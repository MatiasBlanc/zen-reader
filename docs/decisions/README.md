# Decisiones de Arquitectura (ADRs)

Cada documento en esta carpeta registra una **decisión de arquitectura** con su contexto, la decisión tomada, las alternativas descartadas y las consecuencias. Formato basado en [ADR (Architecture Decision Record)](https://adr.github.io/).

## Reglas

- Un ADR por decisión. Nunca se sobrescribe un ADR existente.
- Si una decisión cambia, se crea un **nuevo** ADR que la reemplace y se marca el anterior como *Reemplazado por XXXX*.
- Los ADRs se numeran de forma secuencial (`NNNN-titulo.md`).
- Se escriben en español, en pasado ("se decidió"), porque documentan una decisión ya tomada.

## Índice

| ADR | Decisión |
|---|---|
| [0001-clean-architecture.md](0001-clean-architecture.md) | Separar el código en 4 capas (domain/application/infrastructure/presentation) |
| [0002-inyeccion-bajo-demanda.md](0002-inyeccion-bajo-demanda.md) | Inyectar el content script bajo demanda en vez de declararlo permanente |

## Plantilla

```markdown
# NNNN — Título de la decisión

- **Estado**: Aceptado | Propuesto | Reemplazado por NNNN | Obsoleto
- **Fecha**: AAAA-MM-DD

## Contexto

¿Qué problema motivaba la decisión? ¿Qué opciones existían?

## Decisión

Qué se decidió y por qué. Detalles suficientes para entenderla sin leer el código.

## Alternativas consideradas

- **Opción A** — por qué se descartó
- **Opción B** — por qué se descartó

## Consecuencias

Positivas y negativas. ¿Qué se gana y qué se paga?
```

> Consejo: cuando tomes una decisión de arquitectura (nueva capa, cambio de librería, nuevo permiso), crea su ADR en el mismo PR. Eso evita que las decisiones queden enterradas en conversaciones de issues o en la cabeza de una sola persona.
