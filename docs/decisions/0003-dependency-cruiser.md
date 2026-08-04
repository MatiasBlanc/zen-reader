# 0003 — Verificar la arquitectura con dependency-cruiser; docs estables

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

Se decidió invertir el modelo: **verificar en vez de describir**, con tres
niveles complementarios:

1. **Reglas verificables en CI** — `dependency-cruiser` (`.dependency-cruiser.cjs`)
   declara las reglas de capas (domain aislado, application sin infraestructura,
   presentation/background solo vía `di/container.ts`) y `npm run arch` las
   ejecuta. Un PR que rompa las capas **falla el CI** (workflow `.github/workflows/ci.yml`).
2. **Docs de alto nivel estables** — `docs/architecture.md` describe solo lo
   que cambia poco (capas, flujos, reglas) y enlaza un **grafo de dependencias
   generado** con `npm run arch:graph` (mermaid). El detalle por archivo vive en
   los JSDoc del código, cerca del código.
3. **Decisiones en ADRs** — los cambios de arquitectura se registran en
   `docs/decisions/`, no reescribiendo el mapa.

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
- El doc ya no puede desincronizarse en lo esencial; el grafo se regenera.
- La deuda técnica existente quedó visibilizada y rastreada (ver roadmap).

**Negativas**

- `dependency-cruiser` requiere TypeScript < 7 como transpilador: el proyecto
  bajó de `typescript@7` a `typescript@6` (el build usa esbuild/Vite, sin
  impacto; se revisará cuando dependency-cruiser soporte TS7).
- Mantener `pathNot` de deuda en el config exige disciplina: solo añadir
  excepciones con issue asociado.
