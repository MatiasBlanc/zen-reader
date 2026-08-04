# Contribuir a ZenReader

¡Gracias por querer contribuir! ZenReader es un proyecto pequeño y amigable
para primeras contribuciones. Antes de empezar, lee esto (son 2 minutos).

## Cómo empezar

1. **Fork** del repo y clona tu fork.
2. Instala dependencias: `npm install`.
3. Crea una rama con nombre descriptivo: `git checkout -b fix/sidebar-mobile`.
4. Para probar en Chrome/Edge: `npm run dev`. Para Firefox/Zen:
   `npm run build:watch` + `web-ext run -s dist`.
5. Abre un **Pull Request** hacia `main` cuando estés listo.

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

## Issues

- Si es tu primera contribución, busca issues con la etiqueta
  **`good first issue`**.
- Comenta en el issue que lo vas a tomar para evitar trabajo duplicado.
- Sin cambios de comportamiento no solicitados: si encuentras un bug al pasar,
  abre un issue en vez de arreglarlo de paso en tu PR.

## Pull Requests

- Describe **qué** y **por qué**, no solo cómo.
- Referencia el issue que resuelve: `Closes #12`.
- Mantén los PRs pequeños y revisables.
- El CI (si existe) debe pasar; si no hay CI, corre `npm run build` y
  `npm run lint` (si existe) antes de abrir el PR.

## Dudas

Abre un issue o pregunta en el PR. No hay pregunta tonta.
