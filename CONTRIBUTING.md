# Contribuir a ZenReader

¡Gracias por querer contribuir! ZenReader es un proyecto pequeño y amigable
para primeras contribuciones. Antes de empezar, lee esto (son 2 minutos) y el
índice de documentación en [`docs/README.md`](docs/README.md).

## Cómo empezar

1. **Fork** del repo y clona tu fork.
2. Instala dependencias: `npm install`.
3. Crea una rama con nombre descriptivo: `git checkout -b fix/sidebar-mobile`.
4. Para probar en Chrome/Edge: `npm run dev`. Para Firefox/Zen:
   `npm run build:watch` + `web-ext run -s dist`.
5. Detalle del entorno, debugging y build para AMO en
   [`docs/development.md`](docs/development.md).
6. Abre un **Pull Request** hacia `main` cuando estés listo (usa la
   [plantilla de PR](.github/PULL_REQUEST_TEMPLATE.md)).

## Convenciones de código

- **Formato**: Prettier + ESLint. No reformatees código que no tocas.
- **Naming**: `camelCase` para variables/funciones, `PascalCase` para
  clases/tipos/componentes, `UPPER_SNAKE` para constantes, `snake_case` en SQL.
- **Booleanos** con prefijo `is/has/can/should`.
- **React/Preact**: 1 componente por archivo, sufijo `.tsx`.
- **TypeScript**: tipos explícitos en firmas públicas. Prohibido `any`,
  `@ts-ignore` y `as` para callar al compilador. Preferir `as const` sobre
  enums nativos. `interface` para contratos, `type` para uniones/aliases.
- **Imports**: externos → internos → relativos, separados por línea en blanco.
- **Errores y logs**: sin `console.log` en commits; mensajes de error en español.
- **Arquitectura**: la UI (`presentation/`) nunca accede a Dexie directamente;
  siempre pasa por un caso de uso de `application/`. Las capas apuntan hacia
  adentro: `presentation → application → domain`.

## Mensajes de commit y PR

- Mensajes en **español**, imperativo, sujeto de máx. 72 caracteres.
- Un cambio lógico por commit. Ejemplo: `feat: agregar export a Markdown`.

## Features nuevas (roadmap en issues, no en .md)

El roadmap vive en **issues de GitHub con milestones** (V2, V3, V4), no en un
markdown. Si quieres proponer o implementar una feature:

1. Abre un issue con el [feature request form](.github/ISSUE_TEMPLATE/feature_request.yml):
   problema, solución, criterios de aceptación e impacto en privacidad.
2. Revisa [`docs/roadmap.md`](docs/roadmap.md) para ver qué ya está planificado
   y qué estado tiene (propuesta / en curso).
3. Si la feature es una decisión de arquitectura, documenta el porqué en un
   [ADR](docs/decisions/README.md) dentro del mismo PR.

## Issues

- Si es tu primera contribución, busca issues con la etiqueta
  **`good first issue`**.
- Comenta en el issue que lo vas a tomar para evitar trabajo duplicado.
- Sin cambios de comportamiento no solicitados: si encuentras un bug al pasar,
  abre un issue en vez de arreglarlo de paso en tu PR.
- Los bugs se reportan con el [bug report form](.github/ISSUE_TEMPLATE/bug_report.yml).
  Las vulnerabilidades **nunca** se reportan como issue público; ver [`SECURITY.md`](SECURITY.md).

## Pull Requests

- Describe **qué** y **por qué**, no solo cómo.
- Referencia el issue que resuelve: `Closes #12`.
- Mantén los PRs pequeños y revisables.
- El CI (si existe) debe pasar; si no hay CI, corre `npm run build` y
  `npm run lint` (si existe) antes de abrir el PR.

## Dudas

Abre un issue o pregunta en el PR. No hay pregunta tonta.
