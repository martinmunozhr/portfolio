/* =====================================================================
   MODEL — los datos y el estado de la app. Nunca toca el DOM.
   Acá editás tu contenido: proyectos, trayectoria, formación, skills.
   ===================================================================== */

const Model = {

  githubUser: "martinmunozhr",

  // A dónde llega el formulario de contacto (relay vía formsubmit.co)
  contactEmail: "martin@laboralforge.com",

  // Estado de la app (lo escribe el Controller, lo muestra la View)
  state: {
    screen: "home",
    menuIndex: 0,
    reposLoaded: false,
    skillsBuilt: false,
    trayectoriaBuilt: false,
  },

  // ---- Proyectos destacados (a mano, arriba del feed de GitHub) ----
  // Sin `url` la tarjeta se renderiza sin link (para trabajo privado).
  featured: [
    {
      title: "Laboral Forge",
      tag: "Consultora", color: "#3dff6e", live: true,
      url: "https://laboralforge.com", cta: "Entrar a laboralforge.com →",
      img: "assets/projects/laboralforge.png",
      desc: "La consultora que fundé en mayo de 2026. Trabajo con dos audiencias: profesionales que quieren ordenar o relanzar su carrera con estrategia, y organizaciones que necesitan resolver su operación de talento. Definí el método, el modelo de servicio, el posicionamiento y el equipo de seis personas que hoy lo sostiene.",
    },
    {
      title: "UPEX Satellite",
      tag: "Co-founder", color: "#14B8A6",
      img: "assets/projects/upexsatellite.png",
      desc: "Co-fundada con Elyer Maldonado como la división de talento QA e IT de UPEX Galaxy. Llevé el método de Laboral Forge a una audiencia técnica y armé el modelo de servicio con naming propio: One Shot, Carry Sessions y Teamfight. Misma cabeza metodológica, otro branding y otro esquema de precios.",
    },
    {
      title: "Forge Gotham",
      tag: "Automatización", color: "#A78BFA",
      img: "assets/projects/forgegotham.png",
      desc: "Ocho agentes de Claude Code que ordenan el conocimiento de la consultora: rutean transcripciones de reuniones, curan la biblioteca metodológica, mantienen la crónica del proyecto y generan entregables de cliente. Cada uno tiene rol, protocolo y voz propia.",
    },
    {
      title: "CVForge",
      tag: "Producto", color: "#C084FC",
      img: "assets/projects/cvforge.png",
      desc: "Analizador de CVs con la lógica cien por ciento hardcodeada y cero costo de IA por uso. Diagnostica un currículum contra criterios de ATS y de reclutador real, calibrado con un golden set de casos por familia profesional. Los criterios salen de seis años leyendo CVs para decidir a quién llamar.",
    },
    {
      title: "Promptpal",
      tag: "Herramienta", color: "#f1e05a", live: true,
      url: "https://martinmunozhr.github.io/promptpal/",
      cta: "Probar la herramienta →",
      img: "assets/projects/promptpal.png",
      desc: "Constructor visual de prompts para modelos de lenguaje, con flujo Relay Gemini→Claude. TypeScript sobre GitHub Pages. Salió de necesitar prompts consistentes para el laburo diario de la consultora.",
    },
    {
      title: "Prode Mundial 2026",
      tag: "Full-stack", color: "#3178c6", live: true,
      url: "https://prode-mundial-2026.martinmunoz191095.workers.dev",
      cta: "Jugar al prode →",
      img: "assets/projects/prode2026.png",
      desc: "Lo armé para jugar el Mundial con mi familia y creció bastante más de lo previsto: pronósticos, ranking en vivo, bola de cristal y álbum de figuritas. TanStack Start, Supabase y Cloudflare Workers. El puntaje multiplica según la fase y los resultados se sincronizan solos contra la API pública de FIFA.",
    },
  ],

  // Los repos ya mostrados arriba se ocultan del feed de GitHub
  featuredRepoNames: [
    "promptpal",
    "prode2026-martinmunoz",
  ],

  // Se muestra si no se puede llegar a la API de GitHub
  fallbackRepos: [],

  // Override opcional de miniaturas: nombre de repo → ruta de imagen.
  // Lo que no esté listado se busca en assets/projects/<NombreRepo>.png
  projectImages: {},

  langColors: {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    PLpgSQL: "#336790", CSS: "#663399", HTML: "#e34c26", Shell: "#89e051",
    PHP: "#4F5D95", Java: "#b07219", C: "#555", "C++": "#f34b7d",
  },

  // ---- Pantalla EXPERIENCIA ----
  // `now: true` marca lo vigente (rombo verde en el riel).
  // `roles` lista los puestos sucesivos dentro de una misma empresa.
  trayectoria: [
    {
      when: "May 2026 — hoy", now: true,
      role: "Fundador",
      org: "Laboral Forge · Consultora de talento y estrategia",
      desc: "Fundé la consultora para resolver dos problemas que venía viendo desde los dos lados del mostrador: profesionales que no saben cómo mostrar lo que valen, y organizaciones que improvisan procesos de talento que deberían ser estratégicos. Definí el método, el modelo de servicio B2C y B2B, el posicionamiento de marca y el equipo de seis personas. También construyo las herramientas internas con las que trabajamos.",
    },
    {
      when: "May 2026 — hoy", now: true,
      role: "Profesor",
      org: "Universidad Nacional de Quilmes",
      desc: "Doy clases en la misma casa donde me recibí. El contenido sale de la práctica: cómo se selecciona de verdad en IT, con qué criterios se decide a quién llamar y cómo se construye empleabilidad con estrategia.",
    },
    {
      when: "Abr 2026 — hoy", now: true,
      role: "Co-fundador",
      org: "UPEX Satellite · División de talento QA e IT de UPEX Galaxy",
      desc: "Co-fundé la división junto a Elyer Maldonado. Adapté el método de Laboral Forge a una audiencia técnica y armé el modelo de servicio con naming propio: One Shot, Carry Sessions y Teamfight. Capacitación y soluciones de talento para equipos de QA e IT.",
    },
    {
      when: "Dic 2018 — hoy", now: true,
      role: "Consultor de Empleabilidad y Desarrollo Profesional",
      org: "Práctica independiente · Origen de Laboral Forge",
      desc: "Acompaño a profesionales de distintos roles y seniorities en empleabilidad, desarrollo profesional y transición de carrera. CV, perfil de LinkedIn y marca personal; preparación para entrevistas técnicas, por competencias y de soft skills; discurso profesional y storytelling laboral; estrategia de búsqueda activa y contacto con recruiters; outplacement; diagnóstico con plan de acción y negociación salarial. Más de 100 profesionales acompañados hasta hoy, de IT, RRHH, Administración, Comercial y otros rubros.",
    },
    {
      when: "Ago 2024 — Abr 2026",
      role: "HR Business Partner",
      org: "Selectium · Consultora de RRHH",
      roles: [
        ["Dic 2024 — Abr 2026", "HRBP"],
        ["Ago 2024 — Nov 2024", "Associate Human Resources Consultant"],
      ],
      desc: "Acompañé a startups, software factories y consultoras IT de toda LATAM y de Estados Unidos en procesos estratégicos de Talent Acquisition. Fui Focal Point entre los líderes técnicos y las áreas de RRHH: relevamiento de perfiles con las áreas decisoras, briefing al equipo interno de recruiters y sourcers, validación de skills y fit cultural, entrevistas y hunting activo. Sumé al desarrollo comercial con prospección, alianzas y apertura de cuentas nuevas, representé a la consultora en eventos del ecosistema IT, PyME y RRHH, y trabajé en la estandarización de los procesos internos de selección y outplacement.",
    },
    {
      when: "Dic 2021 — Ago 2024",
      role: "Talent Acquisition IT y People Experience",
      org: "CTL Information Technology",
      roles: [
        ["Ago 2023 — Ago 2024", "Onboarding & People Experience Analyst"],
        ["Dic 2022 — Feb 2024", "IT Talent Acquisition Lead"],
        ["Dic 2021 — Dic 2022", "IT Talent Acquisition Analyst"],
      ],
      desc: "Entré como analista y salí liderando el área. Como Lead coordiné el equipo de Analistas de Talento, asigné y seguí búsquedas y objetivos, construí las métricas y los KPIs del área y presenté el status a stakeholders para redefinir prioridades. Busqué perfiles de soporte, infraestructura, ciberseguridad, networking, DevOps, monitoreo, BI, desarrollo y cloud, además de roles comerciales y administrativos. Después pasé a Onboarding y People Experience: planes de inducción individuales, evaluación de gaps contra el perfil de puesto, definición de capacitaciones, feedback 180° mensual e informes de cierre. También llevé marca empleadora, mejora continua de procesos y participé de auditorías internas y externas de ISO 9001.",
    },
    {
      when: "Jun 2022 — Dic 2023",
      role: "Mentor voluntario",
      org: "Fundación Empujar",
      desc: "Di formación en empleabilidad a chicos de 18 a 24 años en situación de vulnerabilidad. Talleres grupales y acompañamiento uno a uno para armar el primer CV, prepararse para entrevistas y entender cómo se entra al mercado laboral.",
    },
    {
      when: "Jul 2021 — Oct 2021",
      role: "IT Recruiting Analyst",
      org: "C&S",
      desc: "Mi primera experiencia dedicada full a recruiting IT. Armado de perfiles, atracción y selección de candidatos del sector, entrevistas, gestión de objetivos y métricas de reclutamiento, y acompañamiento del candidato durante todo el proceso.",
    },
    {
      when: "2014 — 2021",
      role: "Docente particular",
      org: "Materias técnicas y científicas",
      desc: "Di clases particulares a estudiantes de secundario y de universidad: Electrónica Digital y Analógica, Telecomunicaciones, Física, Química, Matemática, Análisis Matemático y Álgebra. Todos los alumnos llegaron por recomendación. Siete años agarrando conceptos abstractos y bajándolos hasta que se entienden.",
    },
    {
      when: "Nov 2019 — May 2020",
      role: "Payroll Assistant (pasantía)",
      org: "Tenaris",
      desc: "Mi entrada a Recursos Humanos, por el lado más duro del área. Asistí a liquidadores senior, manejé los sistemas de liquidación, respondí consultas del personal y seguí ausencias y fichadas. Gestión de pagos a personal, sindicatos y proveedores, reportes de gestión del área y documentación legal ante AFIP con los aplicativos SIAP (SICORE, SICOSS). También trabajé con el área legal en la lectura de puntos periciales y la recopilación de documentación.",
    },
    {
      when: "May 2014 — Nov 2019",
      role: "Administración y Producción",
      org: "Vroom Safety Products",
      desc: "Cinco años y medio en administración y producción mientras cursaba, antes de dedicarme de lleno a Recursos Humanos.",
    },
  ],

  formacion: [
    {
      when: "2016 — 2024",
      role: "Lic. en Gestión de Recursos Humanos y Relaciones Laborales",
      org: "Universidad Nacional de Quilmes · Promedio 9,24",
      desc: "Participé del Proyecto de Investigación UNQ «Los jóvenes y el trabajo. Expectativas laborales y demandas empresarias en el Partido de Quilmes», coordinado por la Dra. Beatriz Wehle, sobre inserción laboral juvenil y qué pide el mercado de trabajo local.",
    },
    {
      when: "2014 — 2016",
      role: "Ingeniería Industrial (estudios no concluidos)",
      org: "Universidad de Buenos Aires",
      desc: "Ciclo Básico Común aprobado y materias de los primeros años de la carrera.",
    },
    {
      when: "2007 — 2014",
      role: "Técnico Secundario en Electrónica",
      org: "E.E.S.T. N°2 Paula Albarracín de Sarmiento «El Chaparral»",
      desc: "Electrónica digital, analógica y telecomunicaciones. La misma base que después enseñé durante siete años dando clases particulares, y la que hoy me deja hablar de igual a igual con los perfiles técnicos.",
    },
    {
      when: "Formación continua",
      role: "Certificaciones y cursos",
      org: "Udemy · Capacitarte FCE–UBA",
      desc: "Talent Acquisition IT, People Experience, Onboarding y Performance Management. Cómo construir y medir KPIs de RRHH. Cómo mejorar las entrevistas de selección. Entrevistas por competencias y evaluación conductual. Programa Integral de Liquidación de Sueldos. Programación Neurolingüística. Comunicación efectiva aplicada a RRHH.",
    },
  ],

  // ---- Pantalla SKILLS ----
  // Los valores son autoevaluación sobre 100. Ajustalos a tu criterio.
  skills: [
    { group: "Talent Acquisition IT", items: [
      ["Selección IT end-to-end", 95], ["Sourcing y hunting activo", 92],
      ["Entrevistas por competencias", 92], ["ATS y LinkedIn Recruiter", 90],
      ["Evaluación técnica y fit cultural", 90], ["Job descriptions y avisos", 88],
    ]},
    { group: "RRHH & People", items: [
      ["HR Business Partnering", 90], ["Onboarding y People Experience", 88],
      ["Métricas y KPIs de RRHH", 88], ["Performance management", 82],
      ["Marca empleadora", 80], ["Liquidación de sueldos", 70],
    ]},
    { group: "Empleabilidad & Consultoría", items: [
      ["Diagnóstico de perfil profesional", 95], ["CV ATS y marca personal", 94],
      ["Preparación para entrevistas", 92], ["Estrategia de LinkedIn", 90],
      ["Outplacement y transición", 88], ["Negociación salarial", 85],
    ]},
    { group: "Liderazgo & Negocio", items: [
      ["Liderazgo de equipos de talento", 90], ["Diseño de servicios y método", 92],
      ["Docencia y facilitación", 90], ["Gestión de clientes", 88],
      ["Desarrollo comercial y alianzas", 82], ["Calidad de procesos · ISO 9001", 76],
    ]},
    { group: "Producto & Tecnología", items: [
      ["Claude Code y agentes de IA", 90], ["Excel y Power BI", 84],
      ["n8n y automatización", 80], ["React · TypeScript · Vite", 76],
      ["Supabase · SQL · Cloudflare", 70], ["Git y GitHub", 74],
    ]},
    { group: "Idiomas", items: [
      ["Español (nativo)", 100], ["Inglés (intermedio · lectoescritura)", 65],
    ]},
  ],

  // ---- Traída de datos ----
  async fetchRepos() {
    const skip = new Set(this.featuredRepoNames);
    try {
      const res = await fetch(
        `https://api.github.com/users/${this.githubUser}/repos?per_page=100&sort=updated`
      );
      if (!res.ok) throw new Error(res.status);
      const repos = (await res.json()).filter(r => !r.fork && !skip.has(r.name));
      return { repos, live: true };
    } catch {
      return { repos: this.fallbackRepos.filter(r => !skip.has(r.name)), live: false };
    }
  },
};
