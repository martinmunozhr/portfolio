/* =====================================================================
   CONTROLLER — listens to the user, updates the Model, tells the View.
   ===================================================================== */

const Controller = {

  transitioning: false,
  audioUnlocked: false,

  init() {
    View.init();
    this.bindMenu();
    this.bindKeyboard();
    this.bindAudioUnlock();
    this.bindContactForm();
  },

  /* ---------- Contact form (relayed via formsubmit.co, mailto fallback) ---------- */
  bindContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const status = document.getElementById("form-status");
    const btn = form.querySelector(".form-send");

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return;  // el honeypot agarró un bot
      if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
        status.textContent = "Completá los tres campos primero.";
        return;
      }
      btn.disabled = true;
      status.textContent = "Enviando…";
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${Model.contactEmail}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            _subject: `Mensaje del portfolio de ${data.name}`,
          }),
        });
        if (!res.ok) throw new Error(res.status);
        status.textContent = "¡Listo! Te respondo a la brevedad.";
        form.reset();
        this.play();
      } catch {
        // el relay no responde: abrimos el cliente de mail del visitante
        status.textContent = "El relay no responde, te abro tu app de mail…";
        const subject = encodeURIComponent(`Mensaje del portfolio de ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\nResponder a: ${data.email}`);
        location.href = `mailto:${Model.contactEmail}?subject=${subject}&body=${body}`;
      } finally {
        btn.disabled = false;
      }
    });
  },

  /* ---------- Navigation ---------- */
  goTo(screen) {
    if (this.transitioning || screen === Model.state.screen) return;
    this.transitioning = true;
    this.play();

    View.wipe(
      () => {                       // mid-wipe: cambia de pantalla mientras está tapada
        Model.state.screen = screen;
        View.showScreen(screen);
        if (screen === "proyectos") this.loadProyectos();
        if (screen === "experiencia") this.loadExperiencia();
        if (screen === "skills") this.loadSkills();
      },
      () => { this.transitioning = false; }
    );
  },

  select(index) {
    const n = View.els.menuItems.length;
    const next = (index + n) % n;
    if (next !== Model.state.menuIndex) this.play();
    Model.state.menuIndex = next;
    View.setMenuSelection(next);
  },

  // Las flechas mueven selección y foco juntos, para que Tab retome desde donde
  // quedó el usuario y no desde el principio de la lista.
  selectYFoco(index) {
    this.select(index);
    View.els.menuItems[Model.state.menuIndex].focus();
  },

  /* ---------- Carga de datos por pantalla ---------- */
  async loadProyectos() {
    View.renderFeatured(Model.featured);
    if (Model.state.reposLoaded) return;
    const { repos, live } = await Model.fetchRepos();
    const n = repos.length;
    const status = live
      ? `${n} ${n === 1 ? "repositorio" : "repositorios"} · en vivo desde GitHub`
      : "La API de GitHub no responde en este momento";
    View.renderRepos(repos, status, Model);
    Model.state.reposLoaded = true;
  },

  loadExperiencia() {
    if (Model.state.trayectoriaBuilt) return;
    View.renderTimeline(Model.trayectoria, View.els.timeline);
    View.renderTimeline(Model.formacion, View.els.formacion);
    Model.state.trayectoriaBuilt = true;
  },

  loadSkills() {
    if (!Model.state.skillsBuilt) {
      View.renderSkills(Model.skills);
      Model.state.skillsBuilt = true;
    }
    View.animateSkillBars();
  },

  /* ---------- Sound (browsers block audio until first user gesture) ---------- */
  play() {
    if (this.audioUnlocked) View.playSelect();
  },

  bindAudioUnlock() {
    const unlock = () => { this.audioUnlocked = true; };
    addEventListener("pointerdown", unlock, { once: true, capture: true });
    addEventListener("keydown", unlock, { once: true, capture: true });
  },

  /* ---------- Input bindings ---------- */
  bindMenu() {
    View.els.menuItems.forEach((item, i) => {
      item.addEventListener("mouseenter", () => this.select(i));
      // Tab mueve el foco; sin esto la selección quedaba atrás y Enter abría
      // la pantalla equivocada, porque el handler de teclado usa menuIndex.
      item.addEventListener("focus", () => this.select(i));
      item.addEventListener("click", () => this.goTo(item.dataset.target));
    });

    document.querySelectorAll("[data-back]").forEach(b =>
      b.addEventListener("click", () => this.goTo("home")));

    // Clicking the name always takes you home
    document.getElementById("big-name").addEventListener("click", () => {
      if (Model.state.screen !== "home") this.goTo("home");
      else this.play();
    });
  },

  bindKeyboard() {
    addEventListener("keydown", e => {
      if (Model.state.screen === "home") {
        if (e.key === "ArrowDown") { this.selectYFoco(Model.state.menuIndex + 1); e.preventDefault(); }
        else if (e.key === "ArrowUp") { this.selectYFoco(Model.state.menuIndex - 1); e.preventDefault(); }
        else if (e.key === "Enter") {
          this.goTo(View.els.menuItems[Model.state.menuIndex].dataset.target);
        }
      } else if (e.key === "Escape") {
        this.goTo("home");
      }
    });
  },
};

Controller.init();
