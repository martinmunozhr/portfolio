/* =====================================================================
   VIEW — everything that draws to the screen. No app logic lives here;
   the Controller tells the View what to show.
   ===================================================================== */

const View = {

  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,

  els: {
    screens:    {},   // filled in init()
    menuItems:  [],
    wipe:       document.getElementById("wipe"),
    featGrid:   document.getElementById("feat-grid"),
    repoGrid:   document.getElementById("repo-grid"),
    repoStatus: document.getElementById("repo-status"),
    repoLabel:  document.getElementById("repo-label"),
    skillsBody: document.getElementById("skills-body"),
    timeline:   document.getElementById("timeline-body"),
    formacion:  document.getElementById("formacion-body"),
    sfx:        document.getElementById("sfx-select"),
    cursor:     document.getElementById("cursor"),
    clock:      document.getElementById("clock"),
  },

  init() {
    document.querySelectorAll(".screen").forEach(s => {
      this.els.screens[s.id.replace("screen-", "")] = s;
    });
    this.els.menuItems = [...document.querySelectorAll(".menu-item")];
    document.querySelectorAll("[data-ransom]").forEach(el => this.ransomize(el));
    this.els.sfx.volume = 0.45;
    this.startClock();
    this.startParallax();
    this.startCursor();
    this.watchScroll();
    addEventListener("resize", () => this.syncScrollHint(), { passive: true });
    document.body.classList.add("loaded");
  },

  // Deterministic pseudo-random hash (so letters look the same every visit)
  hash(str) {
    let h = 9;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 387420489);
    return (h ^ h >>> 9) >>> 0;
  },

  /* ---------- Ransom-note lettering ---------- */
  ransomize(el) {
    const text = el.dataset.ransom || el.textContent;
    el.textContent = "";
    [...text].forEach((c, i) => {
      const span = document.createElement("span");
      // los espacios van sin decorar: un espacio rotado o recuadrado queda raro
      if (c === " ") {
        span.className = "ch sp";
        el.appendChild(span);
        return;
      }
      span.className = "ch display";
      span.textContent = c;
      const h = this.hash(text + i);
      const rot = (h % 17) - 8;                 // -8..8 degrees
      const scale = 0.86 + ((h >> 3) % 30) / 100; // 0.86..1.15
      const dy = ((h >> 5) % 9) - 4;            // -4..4 px
      const t = `rotate(${rot}deg) scale(${scale}) translateY(${dy}px)`;
      span.style.setProperty("--t", t);
      span.style.transform = t;
      const variant = (h >> 7) % 10;
      if (variant === 0) span.classList.add("box");
      else if (variant === 1) span.classList.add("boxw");
      else if (variant === 2) span.classList.add("red");
      el.appendChild(span);
    });
  },

  /* ---------- Screens & menu ---------- */
  showScreen(name) {
    const s = this.els.screens;
    Object.values(s).forEach(sc => sc.classList.remove("active"));
    s[name].classList.add("active");
    s[name].scrollTop = 0;
    document.body.dataset.screen = name;
    this.syncScrollHint();
  },

  // El degradado del pie avisa que queda contenido abajo, y se apaga al llegar al final.
  // Se mide sincrónico y se llama al cierre de cada render: perseguir frames con rAF
  // daba lecturas distintas según cuándo asentaba la grilla.
  syncScrollHint() {
    const sc = document.querySelector(".screen.active");
    const queda = sc && (sc.scrollHeight - sc.scrollTop - sc.clientHeight) > 24;
    document.body.classList.toggle("puede-scrollear", !!queda);
  },

  watchScroll() {
    Object.values(this.els.screens).forEach(sc =>
      sc.addEventListener("scroll", () => this.syncScrollHint(), { passive: true }));
  },

  setMenuSelection(index) {
    this.els.menuItems.forEach((m, j) => m.classList.toggle("sel", j === index));
  },

  // Diagonal wipe; calls swap() mid-way while the screen is covered
  wipe(swap, done) {
    if (this.reducedMotion) { swap(); done(); return; }
    const w = this.els.wipe;
    w.classList.remove("go"); void w.offsetWidth;  // restart animation
    w.classList.add("go");
    setTimeout(swap, 340);
    setTimeout(done, 720);
  },

  /* ---------- Sound ---------- */
  playSelect() {
    try {
      this.els.sfx.currentTime = 0;
      const p = this.els.sfx.play();
      if (p && p.catch) p.catch(() => {});  // blocked before first user gesture — fine
    } catch {}
  },

  /* ---------- Project cards ---------- */
  cardThumb(src) {
    return `<div class="thumb"><img src="${src}" alt="" loading="lazy"
      onerror="this.closest('.thumb').remove()"></div>`;
  },

  // Split "Medical Image…" so the first word renders red
  splitTitle(title) {
    const first = title.split(" ")[0];
    return `<em>${first}</em>${title.slice(first.length)}`;
  },

  // Con `url` la tarjeta es un link; sin `url` queda estática (trabajo privado)
  renderFeatured(list) {
    if (this.els.featGrid.childElementCount) return;
    list.forEach((f, i) => {
      const el = document.createElement(f.url ? "a" : "div");
      el.className = f.url ? "card feat" : "card feat static";
      if (f.url) { el.href = f.url; el.target = "_blank"; el.rel = "noopener"; }
      el.style.setProperty("--tilt", ((this.hash(f.title) % 5) - 2) * 0.8 + "deg");
      el.style.setProperty("--d", i * 70 + "ms");
      const estado = f.live ? "EN VIVO" : (f.url ? "DESTACADO" : "PROYECTO PROPIO");
      el.innerHTML = `
        ${this.cardThumb(f.img)}
        <span class="lang" style="--lc:${f.color}">${f.tag}</span>
        <h3>${f.live ? '<span class="live-dot"></span>' : ""}${this.splitTitle(f.title)}</h3>
        <p>${f.desc}</p>
        <div class="meta"><span>${estado}</span>${
          f.url ? `<span class="go">${f.cta}</span>` : ""
        }</div>`;
      this.els.featGrid.appendChild(el);
    });
    this.syncScrollHint();
  },

  /* ---------- Trayectoria y formación ---------- */
  renderTimeline(list, container) {
    list.forEach((e, i) => {
      const item = document.createElement("article");
      item.className = "tl-item" + (e.now ? " now" : "");
      item.style.setProperty("--d", i * 90 + "ms");
      // Varios puestos dentro de la misma empresa se listan adentro de la tarjeta
      const subs = (e.roles || [])
        .map(([cuando, puesto]) => `<li><span>${cuando}</span>${puesto}</li>`).join("");
      item.innerHTML = `
        <span class="tl-when">${e.when}</span>
        <h3 class="tl-role">${e.role}</h3>
        <div class="tl-org">${e.org}</div>
        ${subs ? `<ul class="tl-roles">${subs}</ul>` : ""}
        <p class="tl-desc">${e.desc}</p>`;
      container.appendChild(item);
    });
    this.syncScrollHint();
  },

  renderRepos(repos, statusText, model) {
    // Sin repos que mostrar, la sección entera desaparece
    const hay = repos.length > 0;
    this.els.repoLabel.hidden = !hay;
    this.els.repoStatus.hidden = !hay;
    this.els.repoStatus.textContent = statusText;
    this.els.repoGrid.innerHTML = "";
    if (!hay) { this.syncScrollHint(); return; }
    repos.forEach((r, i) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(r.name) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.style.setProperty("--lc", model.langColors[r.language] || "#e60012");
      const pretty = r.name.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      const img = model.projectImages[r.name] || `assets/projects/${r.name}.png`;
      a.innerHTML = `
        ${this.cardThumb(img)}
        <span class="lang">${r.language || "Repo"}</span>
        <h3>${this.splitTitle(pretty)}</h3>
        <p>${r.description || "Sin descripción todavía. El código habla por sí solo."}</p>
        <div class="meta">
          <span>★ ${r.stargazers_count || 0}</span>
          <span class="go">Ver en GitHub →</span>
        </div>`;
      this.els.repoGrid.appendChild(a);
    });
    this.syncScrollHint();  // el feed llega async y cambia el alto de la pantalla
  },

  /* ---------- Skills ---------- */
  renderSkills(groups) {
    groups.forEach(g => {
      const div = document.createElement("div");
      div.className = "skill-group";
      div.innerHTML = `<h3>${g.group}</h3>`;
      g.items.forEach(([name, value]) => {
        const row = document.createElement("div");
        row.className = "skill-row";
        row.innerHTML = `
          <span class="name">${name}</span>
          <div class="skill-bar"><div class="fill" data-v="${value}"></div></div>
          <span class="lv">${value}</span>`;
        div.appendChild(row);
      });
      this.els.skillsBody.appendChild(div);
    });
    this.syncScrollHint();
  },

  animateSkillBars() {
    const fills = this.els.skillsBody.querySelectorAll(".fill");
    fills.forEach(f => { f.style.width = "0"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fills.forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.v + "%"; }, i * 60));
    }));
  },

  /* ---------- Ambient: clock, parallax, animated cursor ---------- */
  startClock() {
    setInterval(() => {
      this.els.clock.textContent = new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit", minute: "2-digit", hour12: false,
        timeZone: "America/Argentina/Buenos_Aires",
      }) + " · BUE";
    }, 1000);
  },

  startParallax() {
    if (this.reducedMotion) return;
    const stripes = document.getElementById("bg-stripes");
    const halftone = document.getElementById("bg-halftone");
    const arts = [...document.querySelectorAll(".menu-art")];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener("mousemove", e => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      stripes.style.transform = `translate(${cx * 22}px, ${cy * 14}px)`;
      halftone.style.transform = `translate(${cx * -34}px, ${cy * -22}px)`;
      arts.forEach(a => {
        if (a.isConnected)
          a.style.transform = `translate(${cx * 14}px, ${cy * 9}px) scale(1.04)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  },

  // 30-frame sprite-strip cursor extracted from the original .ani files
  startCursor() {
    if (!matchMedia("(pointer:fine)").matches || this.reducedMotion) return;
    const cur = this.els.cursor;
    document.body.classList.add("cursor-on");
    let x = -100, y = -100, frame = 0, last = 0, visible = false;

    addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      if (!visible) { cur.style.display = "block"; visible = true; }
      const t = e.target;
      const overLink = t.closest &&
        t.closest("a,button,.card,.menu-item,.back-hint,.contact-chip,#big-name");
      cur.classList.toggle("link", !!overLink);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
      cur.style.display = "none"; visible = false;
    });

    const tick = ts => {
      if (ts - last >= 50) {                       // 50ms = original .ani frame rate
        frame = (frame + 1) % 30; last = ts;
        cur.style.backgroundPosition = -frame * 48 + "px 0";
      }
      cur.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  },
};
