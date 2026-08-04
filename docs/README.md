# Documentación de ZenReader

Índice de la documentación del proyecto. Si estás empezando a colaborar, empieza por aquí.

## Para quién es cada documento

| Documento | Para quién | Qué contiene |
|---|---|---|
| [README](../README.md) | Usuarios y devs nuevos | Qué es ZenReader, stack, cómo ejecutarlo |
| [CONTRIBUTING](../CONTRIBUTING.md) | Contribuidores | Flujo de trabajo para abrir tu primer PR |
| [development.md](development.md) | Contribuidores | Entorno de desarrollo, debugging, build para AMO |
| [roadmap.md](roadmap.md) | Todos | Features de V1 y plan V2/V3/V4 (resumen enlazado a Issues) |
| [decisions/](decisions/) | Devs | ADRs — decisiones de arquitectura con contexto |
| [spec/v1.md](spec/v1.md) | Devs (histórico) | Spec original de desarrollo de la V1 |

## Cómo se trackean las features

Las features **no** se planifican en un markdown. Cada feature nueva nace como un **issue de GitHub** con un **milestone** (V2, V3, V4, sin fecha) y se resuelve con un PR que lo referencia (`Closes #12`).

`docs/roadmap.md` es solo un **resumen** con enlaces a los issues/milestones — si una feature vive ahí, es que aún no se ha convertido en issue (estado "propuesta").

Para proponer una feature usa el [issue form](../.github/ISSUE_TEMPLATE/feature_request.yml): te pide problema, solución, criterios de aceptación e impacto en privacidad. Eso es lo que evita que el roadmap en .md se quede desactualizado.

## Cómo se documentan las decisiones de arquitectura

Las decisiones importantes (por qué Clean Architecture, por qué inyección bajo demanda, etc.) se registran como **ADRs** en [docs/decisions/](decisions/). Cada ADR documenta el contexto, la decisión, las alternativas descartadas y las consecuencias. Nunca se sobrescribe un ADR: si la decisión cambia, se crea uno nuevo que lo reemplace.

## Rutas de lectura recomendadas

- **Primer día en el repo**: README → CONTRIBUTING → docs/development.md → ADRs (`docs/decisions/`)
- **Vas a implementar una feature**: ADRs relevantes → issue de la feature (criterios de aceptación)
- **Vas a proponer una feature**: issue form + docs/roadmap.md para ver qué ya está planificado
