# Portfolio — Martín Muñoz

Portfolio personal con estética de menú de Persona 5, estructurado como Modelo–Vista–Controlador.
Sitio estático puro: sin build, sin dependencias, sin `package.json`.

## Estructura

```
├── index.html            Esqueleto de la vista — markup solo, sin lógica ni estilos
├── css/
│   └── style.css         Todo el estilado (los colores del tema viven en :root, arriba de todo)
├── js/
│   ├── model.js          DATOS — proyectos, experiencia, formación, skills, fetch a GitHub
│   ├── view.js           DOM — render, letras ransom, wipe, cursor animado, sonido
│   └── controller.js     EVENTOS — teclado, mouse, navegación, formulario
└── assets/
    ├── sfx/select.mp3    Sonido de menú (suena al elegir y confirmar)
    ├── cursors/          Sprites del cursor animado (30 frames cada uno)
    ├── menus/            Fondo por pantalla: home.jpg, skills.jpg, about.jpg, contacto.jpg
    │                     ← faltan: proyectos.jpg y experiencia.jpg
    ├── hero.png          ← opcional: arte extra sobre la pantalla de inicio
    ├── me.jpg            ← falta: tu foto para la polaroid de Sobre mí
    └── projects/         ← faltan: miniaturas de las tarjetas
        └── <NombreRepo>.png  (se matchea solo contra los repos de GitHub por nombre exacto)
```

Las imágenes que faltan se ocultan solas. Nada se rompe ni queda un ícono roto.

## Editar contenido

Casi todo vive en **`js/model.js`**:

| Qué | Dónde |
|---|---|
| Proyectos destacados | `featured` — sin `url` la tarjeta queda estática, para trabajo privado |
| Trayectoria laboral | `trayectoria` — `now: true` marca lo vigente (rombo verde) |
| Formación | `formacion` |
| Barras de skills | `skills` — valores sobre 100, autoevaluación |
| Usuario de GitHub | `githubUser` |
| Mail del formulario | `contactEmail` |

La bio de **Sobre mí** y los links de **Contacto** son HTML plano en `index.html`.
Los colores son cinco variables CSS al principio de `css/style.css`.

## Pantallas

`Inicio → Proyectos · Experiencia · Skills · Sobre mí · Contacto`

La sección "Repositorios públicos" de Proyectos se llena sola desde la API de GitHub y
se oculta entera cuando no queda ningún repo para mostrar (los que ya están en `featured`
se filtran vía `featuredRepoNames`).

## Correrlo local

```
python -m http.server 8123
```

Después abrí http://localhost:8123. Abrir el `index.html` directo (`file://`) bloquea
el audio y el fetch a GitHub en la mayoría de los browsers.

## Publicarlo

Push a un repo de GitHub y activar Pages (Settings → Pages → Deploy from branch → main → / root).
Para dominio propio se agrega un archivo `CNAME` con el dominio.

El formulario de contacto pasa por [formsubmit.co](https://formsubmit.co). El primer envío
manda un mail de activación de única vez a `contactEmail`.

## Controles

↑ / ↓ elegir · Enter confirmar · Esc volver · clic en el nombre para ir al inicio
