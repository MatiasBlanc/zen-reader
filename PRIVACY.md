# Política de privacidad — ZenReader

**Última actualización:** julio de 2025

ZenReader es una extensión de navegador **100% local**. Esta política explica qué datos maneja y por qué.

## ¿Recopila datos?

**No.** ZenReader no recopila, transmite ni almacena ningún dato fuera de tu dispositivo.

## ¿Qué datos almacena?

ZenReader guarda artículos en **IndexedDB** (almacenamiento local del navegador). Estos datos nunca salen de tu dispositivo:

- Título, URL y contenido HTML de los artículos guardados
- Preferencias de lectura (tema, tamaño de fuente)

## ¿Realiza peticiones de red?

**No.** ZenReader no hace ninguna petición HTTP. Todo el procesamiento (extracción con Readability.js, sanitización con DOMPurify) ocurre localmente en tu navegador.

## ¿Usa analíticos, trackers o publicidad?

**No.** ZenReader no incluye ningún sistema de analíticos, tracking, publicidad ni telemetría.

## ¿Comparte datos con terceros?

**No.** No hay terceros involucrados. No hay servidores, servicios en la nube ni APIs externas.

## Permisos de la extensión

| Permiso | Uso |
|---------|-----|
| `storage` | Guardar artículos y preferencias en IndexedDB |
| `unlimitedStorage` | Sin límite de almacenamiento para artículos |
| `scripting` | Inyectar Readability.js en la página activa para extraer contenido |
| `activeTab` | Acceder a la pestaña actual solo cuando el usuario hace clic en "Guardar" |

## Contacto

Si tienes dudas sobre esta política, abre un issue en [GitHub](https://github.com/MatiasBlanc/zen-reader/issues).
