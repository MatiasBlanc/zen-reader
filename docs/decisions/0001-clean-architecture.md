# 0001 — Clean Architecture en 4 capas

- **Estado**: Aceptado
- **Fecha**: 2025-07

## Contexto

ZenReader es una extensión de navegador pequeña pero con varias superficies de
entrada (content script, popup, dashboard, service worker) que comparten el
mismo dominio (artículos, preferencias) y las mismas dependencias externas
(Dexie/IndexedDB, Readability, DOMPurify, APIs de Chrome).

Riesgos identificados:

- Que la UI acceda a Dexie directamente, acoplando el modelo de datos al DOM.
- Que un cambio de librería (p. ej. reemplazar Dexie) obligue a tocar la UI.
- Que el código generado por IA mezcle responsabilidades y sea difícil de
  testear.

## Decisión

Se decidió separar el código en 4 capas con dependencias apuntando hacia
adentro:

```
presentation → application → domain
                   ↑
         infrastructure (implementa ports)
```

- **`domain/`** — entidades y funciones puras, sin dependencias externas.
- **`application/`** — casos de uso y contratos (ports). No conoce Dexie ni el DOM.
- **`infrastructure/`** — implementaciones concretas de los ports (Dexie,
  Readability, notificaciones) y el composition root (`di/container.ts`).
- **`presentation/`** — UI en Preact. Solo consume casos de uso.

Regla estricta: **ningún componente de `presentation/` importa Dexie**; todo
pasa por un caso de uso de `application/` inyectado desde el container.

## Alternativas consideradas

- **Sin capas (archivos sueltos por funcionalidad)** — rápido al inicio, pero
  la extensión tiene 4 puntos de entrada que comparten dominio; el acoplamiento
  a Dexie/chrome APIs se habría propagado. Descartada.
- **MVC tradicional** — mezcla lógica de negocio con presentación en los
  controllers; no aporta el aislamiento de la UI que esta decisión busca.
  Descartada.

## Consecuencias

**Positivas**

- `domain/` y `application/` son testeables sin navegador (sin suite hoy, pero
  listos para ella).
- Reemplazar una librería externa es un cambio confinado a `infrastructure/`.
- Las reglas de negocio (errores, cálculo de lectura, sanitización) viven en un
  solo lugar y con mensajes en español.

**Negativas**

- Más boilerplate que un proyecto plano (ports, container, use cases).
- Coste cognitivo inicial para quien llega: hay que conocer el flujo
  `UI → use case → port → infra`.

**Nota**: `domain/services/text-sanitizer.ts` viola técnicamente "domain sin
dependencias externas" (envuelve DOMPurify, que necesita `window`). Se aceptó
conscientemente porque el wrapper es mínimo; si crece, se migra a
`infrastructure/`.
