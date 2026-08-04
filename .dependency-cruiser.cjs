/**
 * Configuración de dependency-cruiser: verifica las reglas de capas de la
 * Clean Architecture en CI. Si alguien rompe una regla, `npm run arch` falla.
 *
 * Capas (ver docs/decisions/0001-clean-architecture.md):
 *   domain → application → presentation/background
 *   infrastructure implementa los ports; solo el composition root
 *   (di/container.ts) se importa desde fuera de infrastructure.
 *
 * Las excepciones en `allowed` son DEUDA TÉCNICA conocida, con referencia a su
 * issue. No añadas excepciones nuevas sin justificarlas en un issue/ADR.
 */
module.exports = {
  forbidden: [
    /* Ciclos de dependencia: prohibidos en todo el proyecto */
    {
      name: 'no-circular',
      severity: 'error',
      comment: 'No se permiten ciclos de importación.',
      from: {},
      to: { circular: true },
    },

    /* CAPA 1 — domain: sin dependencias de otras capas */
    {
      name: 'domain-no-importa-capas',
      severity: 'error',
      comment:
        'domain/ es la capa más interna: no puede importar application, infrastructure, presentation ni background.',
      from: { path: '^src/domain' },
      to: { path: '^src/(application|infrastructure|presentation|background)' },
    },

    /* CAPA 2 — application: conoce domain, nunca infraestructura/UI */
    {
      name: 'application-no-importa-infra-ni-ui',
      severity: 'error',
      comment:
        'application/ define casos de uso y ports: no puede importar infrastructure (implementaciones) ni presentation/background (UI).',
      from: { path: '^src/application' },
      to: { path: '^src/(infrastructure|presentation|background)' },
    },

    /* CAPAS 4 — presentation/background: solo el composition root sale de infrastructure */
    {
      name: 'ui-no-importa-infra-salvo-container',
      severity: 'error',
      comment:
        'presentation/ y background/ solo pueden tocar infrastructure vía el composition root (di/container.ts). Las excepciones en pathNot son DEUDA TÉCNICA (ver docs/roadmap.md) pendiente de port/refactor; elimínalas al resolverla.',
      from: { path: '^src/(presentation|background)' },
      to: {
        path: '^src/infrastructure/(?!di/container)',
        pathNot:
          '^src/infrastructure/(parser/readability\\.parser|notifications/chrome-toast\\.notifier)',
      },
    },
  ],
  options: {
    tsConfig: { fileName: 'tsconfig.json' },
    doNotFollow: { path: 'node_modules' },
    exclude: { path: '(node_modules|dist|\\.d\\.ts$)' },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/[^/]+' },
      archi: { collapsePattern: '^(src/(domain|application|infrastructure|presentation|background))' },
    },
  },
};
