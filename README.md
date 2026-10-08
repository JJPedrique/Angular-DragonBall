# Directorio de Personajes — Angular 21

Proyecto guía del módulo **Programación del lado del cliente** (URBE 2026).
Consume la API pública de [Dragon Ball](https://dragonball-api.com).
Estilos con [TailwindCSS 4](https://tailwindcss.com) e íconos con [Lucide](https://lucide.dev).

## Cómo arrancar

```bash
npm install
npm start          # http://localhost:4200
npm test           # pruebas con Vitest
```

Requisitos: Node 20.19+ / 22.12+ / 24, y Angular CLI 21 (`npm i -g @angular/cli@21`).

## Paquetes que agregamos

| Paquete                | Dónde            | Por qué                                                  |
|------------------------|------------------|----------------------------------------------------------|
| `tailwindcss`          | devDependencies  | Genera el CSS en tiempo de compilación                   |
| `@tailwindcss/postcss` | devDependencies  | Conecta Tailwind con el build de Angular (PostCSS)       |
| `postcss`              | devDependencies  | El procesador de CSS que usa el plugin                   |
| `@lucide/angular`      | dependencies     | Los íconos viajan dentro de la app que ve el usuario     |

```bash
npm install -D tailwindcss @tailwindcss/postcss postcss
npm install @lucide/angular
```

Además: `.postcssrc.json` con el plugin y `@import 'tailwindcss';` en `src/styles.css`.
Atajo equivalente: `ng add tailwindcss`.

## Avance por pasos

Cada paso es un tag de git:

```bash
git checkout paso-04      # ver ese momento
git checkout main         # volver al final
git diff paso-03 paso-04  # ver solo lo que cambió
```

### Sábado 1 — Fundamentos

| Tag       | Qué se hace                                   | Conceptos                                   |
|-----------|-----------------------------------------------|---------------------------------------------|
| `paso-00` | `ng new directorio-personajes`                | CLI, estructura del proyecto                |
| `paso-01` | Limpiar la plantilla                          | Componente raíz, interpolación              |
| `paso-02` | Instalar Tailwind y Lucide                    | npm, `package.json`, dependencias           |
| `paso-03` | Modelo `Personaje`, datos de ejemplo, listado | Interfaces TS, `signal()`, `@for`           |
| `paso-04` | Componente `PersonajeCard` (imágenes de altura pareja) | `input.required()`, `@switch`, `@let`, CSS Grid |
| `paso-05` | Buscador y filtro por raza                    | `computed()`, eventos, `@empty`             |
| `paso-06` | Favoritos que persisten                       | `output()`, `update()`, `effect()`          |
| `paso-07` | Layout masonry (estilo Pinterest)             | `columns-*`, `break-inside-avoid`, `host`   |

Tag `fin-sabado-1` = `paso-07`. Compara `git diff paso-06 paso-07`: grilla pareja contra masonry.

### Sábado 2 — Aplicación real

| Tag       | Qué se hace                                        | Conceptos                                              |
|-----------|----------------------------------------------------|--------------------------------------------------------|
| `paso-08` | Servicio que consume la API                        | `@Injectable`, `inject()`, `HttpClient`, `toSignal()`  |
| `paso-09` | Rutas: listado, detalle con transformaciones, 404  | `loadComponent`, `withComponentInputBinding`           |
| `paso-10` | Búsqueda y paginación contra el servidor           | `toObservable`, `debounceTime`, `switchMap`            |
| `paso-11` | Página de favoritos y formulario de sugerencias    | `forkJoin`, estado compartido, Reactive Forms          |
| `paso-12` | Pruebas unitarias                                  | Vitest, `HttpTestingController`                        |
| `paso-13` | Arquitectura por features                          | `core/` `shared/` `features/`, `loadChildren`, contenedor y presentación, alias `@core` |

Tag `fin-sabado-2` = `paso-12` (estructura simple). `paso-13` reorganiza el mismo código; compara con `git diff -M --stat paso-12 paso-13`.

## Sobre la API

- Listado paginado: `GET /api/characters?page=1&limit=12` → `{ items, meta, links }`.
- Con filtros (`?name=goku`, `?race=Saiyan`) responde un **arreglo simple, sin paginación**. El servicio normaliza las dos formas.
- Detalle: `GET /api/characters/1` → incluye `originPlanet` y `transformations`.

## Historia

La carpeta [`historia/`](historia) tiene el mismo ejemplo escrito como se hacía antes:

- `1-angularjs/index.html` — AngularJS 1.8 (ábrelo directo en el navegador).
- `2-ngmodules/` — Angular con `NgModule`, `@Input`, `*ngFor`, `constructor(private ...)`.

## Estructura final (paso-13)

Organizada **por funcionalidad** (feature), y dentro de cada una **por responsabilidad**.

```
src/app/
├── app.ts · app.html            ← shell: <app-header> + <router-outlet>
├── app.config.ts                ← providers globales (router, http)
├── app.routes.ts                ← una entrada por feature con loadChildren
│
├── core/                        ← una sola vez en toda la app
│   ├── config/api.ts            ← URL base de la API
│   ├── layout/header/           ← barra de navegación
│   ├── layout/no-encontrada/    ← página 404
│   └── services/favoritos.service.ts   ← estado global (signals + localStorage)
│
├── shared/                      ← reutilizable y sin lógica de negocio
│   ├── models/pagina.model.ts   ← Pagina<T> genérica
│   └── ui/paginador/            ← componente de presentación
│
└── features/
    ├── personajes/
    │   ├── models/              ← interfaces y constantes del dominio
    │   ├── services/            ← acceso a la API (+ pruebas)
    │   ├── components/          ← presentación: personaje-card, filtros-personajes
    │   ├── pages/               ← contenedores: lista-personajes, detalle-personaje
    │   └── personajes.routes.ts
    ├── favoritos/
    │   ├── pages/mis-favoritos/
    │   └── favoritos.routes.ts
    └── sugerencias/
        ├── pages/sugerir-personaje/
        └── sugerencias.routes.ts
```

### Reglas

| Carpeta | Qué va | Puede importar de |
|---|---|---|
| `core/` | Lo que existe una sola vez: layout, configuración, estado global | `shared/` |
| `shared/` | Componentes, modelos y utilidades sin lógica de negocio | nada de la app |
| `features/x/pages/` | Componentes **contenedores**: tienen estado, inyectan servicios, se cargan por ruta | `core/`, `shared/`, su feature y `components/` o `services/` de otra feature |
| `features/x/components/` | Componentes **de presentación**: solo `input()` y `output()`, sin servicios | `shared/`, `models/` de su feature |
| `features/x/services/` | Acceso a datos (HTTP) | `core/`, `shared/`, `models/` |
| `features/x/models/` | Interfaces, tipos y constantes | `shared/models/` |

- Una página nunca importa otra página: a las páginas solo las carga el router.
- Dentro de una feature se usan imports relativos (`../../services/...`); entre capas, los alias de `tsconfig.json`: `@core/*`, `@shared/*`, `@features/*`.
- Cada feature trae su archivo `*.routes.ts`; `app.routes.ts` solo las monta con `loadChildren`.
