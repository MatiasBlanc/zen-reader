# 0003 — Verificar la arquitectura con dependency-cruiser

- **Estado**: Aceptado
- **Fecha**: 2025-08

## Contexto

La arquitectura (capas de Clean Architecture) se documentaba a mano en
`docs/architecture.md`, archivo por archivo. Con el tiempo el documento quedó
desactualizado: no reflejaba módulos nuevos (`sound/`, `icons.ts`, `Sidebar`)
y, lo más grave, **la regla central ("presentation no toca infrastructure") ya
se violaba en 3 puntos del código** sin que nada lo detectara.

El problema de fondo: documentar arquitectura a mano no escala — la descripción
y la realidad divergen, y nadie se entera hasta que alguien lee ambos.

## Decisión

Se decidió invertir el modelo: **verificar en vez de describir**, con dos
niveles complementarios:

1. **Reglas verificables en CI** — `dependency-cruiser` (`.dependency-cruiser.cjs`)
   declara las reglas de capas (domain aislado, application sin infraestructura,
   presentation/background solo vía `di/container.ts`) y `npm run arch` las
   ejecuta. Un PR que rompa las capas **falla el CI** (workflow `.github/workflows/ci.yml`).
2. **Decisiones en ADRs** — los cambios de arquitectura se registran en
   `docs/decisions/`, no reescribiendo un mapa.

**Sin doc de arquitectura dedicado**: se probó mantener `docs/architecture.md`
con el mapa de capas y un grafo generado, pero se descartó poco después por
redundante — duplicaba el mapa breve del README y la spec histórica
(`docs/spec/v1.md`), y seguía exigiendo mantenimiento manual. El conocimiento
de arquitectura queda en tres lugares que no se desincronizan: las **reglas
verificables**, los **ADRs** y los **JSDoc del código**.

## Alternativas consideradas

- **Seguir documentando a mano** (status quo) — coste de mantenimiento alto,
  ya demostró divergencia. Descartada.
- **TypeDoc/API docs generadas** — muy útil para APIs públicas grandes, pero
  aquí la superficie pública es pequeña y los JSDoc en el código ya cubren el
  detalle. Se descarta por ahora; se puede añadir si el proyecto crece.
- **Sitio de docs (Docusaurus/Starlight)** — peso de tooling y hosting
  desproporcionado para un repo pequeño sin backend. Descartada.

## Consecuencias

**Positivas**

- La regla de capas se hace cumplir de verdad: violarla rompe el CI.
- Sin doc de arquitectura que mantener: la fuente de verdad son las reglas,
  los ADRs y el código.
- La deuda técnica existente quedó visibilizada y rastreada (ver roadmap).

**Negativas**

- `dependency-cruiser` requiere TypeScript < 7 como transpilador: el proyecto
  bajó de `typescript@7` a `typescript@6` (el build usa esbuild/Vite, sin
  impacto; se revisará cuando dependency-cruiser soporte TS7).
- Mantener `pathNot` de deuda en el config exige disciplina: solo añadir
  excepciones con issue asociado.
