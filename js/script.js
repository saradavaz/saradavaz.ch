/* =========================================================
   PROJECTS: IDs + JSON Loader
   ========================================================= */

const PROJECTS = [
  "businesscards",
  "whenidanceibecomewhole_video",
  "whenidanceibecomewhole_documentation",
  "zurichpridemagazine_2024",
  "zurichpridemagazine_2025",
  "tavolata",
];

async function loadProjectData(projectId) {
  const url = `/content/${projectId}/info.json`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Fehler beim Laden von ${url}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

/* =========================================================
   PROJECTS: DOM Builder
   ========================================================= */

function createProjectDOM(projectId, data) {
  const container = document.getElementById("projectsContainer");
  if (!container || !data) return;

  /* -----------------------
     SECTION: Kopf (Titel + Info-Button)
  ------------------------ */

  const headSection = document.createElement("section");
  headSection.className = "project-section";
  headSection.id = `project-${projectId}`;

  const titleSpan = document.createElement("span");
  titleSpan.className = "project-title";
  titleSpan.textContent = data.title || projectId;

  const infoButton = document.createElement("button");
  infoButton.className = "info-toggle";
  infoButton.textContent = "Information";
  infoButton.setAttribute("aria-expanded", "false");

  headSection.appendChild(titleSpan);
  headSection.appendChild(infoButton);

  /* -----------------------
     SECTION: Info (auf/zu)
  ------------------------ */

  const infoSection = document.createElement("section");
  infoSection.className = "project-info hidden";
  infoSection.setAttribute("aria-hidden", "true");

  const infoLeft = document.createElement("div");
  infoLeft.className = "info-left";

  const infoSub = document.createElement("p");
  infoSub.className = "info-sub";
  infoSub.innerHTML = `${data.type || ""}<br>${data.date || ""}`;

  const toolsWrapper = document.createElement("div");

  const infoCreated = document.createElement("p");
  infoCreated.className = "info-created";
  infoCreated.textContent = "Created with:";

  const infoTags = document.createElement("div");
  infoTags.className = "info-tags";

  if (Array.isArray(data.tools)) {
    data.tools.forEach((tool) => {
      const tag = document.createElement("span");
      tag.className = "tag";
      tag.textContent = tool;
      infoTags.appendChild(tag);
    });
  }

  toolsWrapper.appendChild(infoCreated);
  toolsWrapper.appendChild(infoTags);

  infoLeft.appendChild(infoSub);
  infoLeft.appendChild(toolsWrapper);

const infoRight = document.createElement("div");
infoRight.className = "info-right";

const infoText = document.createElement("p");
infoText.textContent = data.description || "";
infoRight.appendChild(infoText);

// --- Optional: Link CTA (wenn vorhanden) ---
if (data.link_url && data.link_text) {
  const linkP = document.createElement("p");

  // "To explore..., click here" -> nur "here" klickbar
  const prefix = data.link_text.replace(/\s*here\s*$/i, "").trim();

  const textNode = document.createTextNode(prefix ? `${prefix} ` : "");
  const linkEl = document.createElement("a");
  linkEl.href = data.link_url;
  linkEl.target = "_blank";
  linkEl.rel = "noopener";
  linkEl.className = "project-link";
  linkEl.textContent = "here";

  linkP.appendChild(textNode);
  linkP.appendChild(linkEl);

  infoRight.appendChild(linkP);
}


  infoSection.appendChild(infoLeft);
  infoSection.appendChild(infoRight);

  /* -----------------------
     SECTION: Medien (Video + Bilder)
  ------------------------ */

  const mediaSection = document.createElement("section");
  mediaSection.className = "project-media";

  // --- YouTube Video (wenn vorhanden) ---
  if (data.youtubeId) {
    const ytWrap = document.createElement("div");
    ytWrap.className = "project-video is-square";

    const crop = document.createElement("div");
    crop.className = "youtube-crop";

    const img = document.createElement("img");
    img.src = `content/${projectId}/${data.videoThumbnail}`;
    img.alt = data.title || "Video thumbnail";
    img.className = "video-thumbnail";

    const clickLayer = document.createElement("button");
    clickLayer.type = "button";
    clickLayer.className = "youtube-click";
    clickLayer.setAttribute("aria-label", "Play video");
    clickLayer.addEventListener("click", () => {
      openVideoModal(data.youtubeId, data.title || "Video");
    });

    crop.appendChild(img);
    crop.appendChild(clickLayer);
    ytWrap.appendChild(crop);
    mediaSection.appendChild(ytWrap);
  }

  // --- Bilder wie bisher ---
  if (Array.isArray(data.images)) {
    data.images.forEach((filename) => {
      const wrapper = document.createElement("div");
      wrapper.className = "project-image";

      const img = document.createElement("img");
      img.src = `content/${projectId}/${filename}`;
      img.alt = data.title || "Project image";

      wrapper.appendChild(img);
      mediaSection.appendChild(wrapper);
    });
  }

  /* -----------------------
     APPEND: Reihenfolge beibehalten
  ------------------------ */

  container.appendChild(headSection);
  container.appendChild(infoSection);
  container.appendChild(mediaSection);

  /* -----------------------
     PROJECT OVERLAY: Button-Liste füllen
  ------------------------ */

  const projectListEl = document.getElementById("projectList");
  if (projectListEl) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "project-select-button";
    btn.textContent = data.title || projectId;

    btn.addEventListener("click", () => {
      const headerTitle = document.getElementById("siteTitle");
      const overlayWhite = document.getElementById("overlay");
      const headerBack = document.querySelector(".header-back");
      const viewToggle = document.querySelector(".view-toggle");

      if (overlayWhite && overlayWhite.classList.contains("show")) {
        overlayWhite.classList.remove("show");
        overlayWhite.hidden = true;
      }

      if (headerTitle) {
        headerTitle.classList.remove("active");
        headerTitle.textContent = "SARA DAVAZ";
        headerTitle.style.fontWeight = "bold";
      }

      if (headerBack) headerBack.style.display = "";
      if (viewToggle) viewToggle.style.display = "";
      document.body.classList.remove("about-open");

      const target = document.getElementById(`project-${projectId}`);
      if (!target) return;

      const headerOffset = 60;
      const elementTop = target.getBoundingClientRect().top + window.scrollY;
      const scrollTo = elementTop - headerOffset;

      window.scrollTo({ top: scrollTo, behavior: "auto" });

      setTimeout(() => {
        closeProjectOverlay();
      }, 10);
    });

    projectListEl.appendChild(btn);
  }

  /* -----------------------
     Info Toggle
  ------------------------ */

  infoButton.addEventListener("click", () => {
    const isOpen = infoSection.classList.contains("show");

    if (isOpen) {
      infoSection.classList.remove("show");
      infoButton.textContent = "Information";
      infoButton.setAttribute("aria-expanded", "false");
      infoSection.setAttribute("aria-hidden", "true");
      return;
    }

    infoSection.classList.add("show");
    infoButton.textContent = "Close";
    infoButton.setAttribute("aria-expanded", "true");
    infoSection.setAttribute("aria-hidden", "false");
  });
}

/* =========================================================
   PROJECTS: Init
   ========================================================= */

async function initProjects() {
  for (const projectId of PROJECTS) {
    const data = await loadProjectData(projectId);
    createProjectDOM(projectId, data);
  }

  // Desktop Maus: Wheel + Drag
  // enableWheelHorizontalScroll(); // auskommentiert – Funktion existiert nicht
  enableDragScrollForProjectMedia();
}

/* =========================================================
   FONTS READY
   ========================================================= */

function onFontsReady() {
  if (document.fonts && document.fonts.ready) {
    return document.fonts.ready.catch(() => {});
  }
  return Promise.resolve();
}

/* =========================================================
   GLOBAL ELEMENTS
   ========================================================= */

const headerTitle = document.getElementById("siteTitle");
const overlayWhite = document.getElementById("overlay");

const footer = document.getElementById("footer");

const datenschutzEl = document.getElementById("footerDatenschutz");
const impressumEl = document.getElementById("footerImpressum");
const ovDS = document.getElementById("overlay-datenschutz");
const ovIM = document.getElementById("overlay-impressum");

const projectOverlay = document.getElementById("projectOverlay");
const seeAllProjectsEl = document.getElementById("seeAllProjects");
const backToProjectsBtn = document.getElementById("backToProjects");

/* =========================================================
   BACK TO PROJECT OVERLAY BUTTON
   ========================================================= */

if (backToProjectsBtn) {
  backToProjectsBtn.addEventListener("click", () => {
    // Wenn wir uns in der Portfolio-Ansicht befinden:
    if (document.body.classList.contains("mode-portfolio")) {
      // Project-Overlay öffnen
      openProjectOverlay();

      // Sofort nach oben (keine Animation)
      window.scrollTo({ top: 0, behavior: "auto" });
      return;
    }

    // Wenn wir bereits im Overlay sind → normal sanft nach oben scrollen
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   PROJECT OVERLAY
   ========================================================= */

function openProjectOverlay() {
  projectOverlay.hidden = false;
  projectOverlay.classList.add("show");
  document.body.classList.add("mode-project-list");
  document.body.classList.remove("mode-portfolio");
}

function closeProjectOverlay() {
  projectOverlay.classList.remove("show");
  document.body.classList.remove("mode-project-list");
  document.body.classList.add("mode-portfolio");

  setTimeout(() => {
    projectOverlay.hidden = true;
  }, 400);
}

/* =========================================================
   DOMCONTENTLOADED
   ========================================================= */

window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("preload-lock");
  document.body.classList.add("mode-project-list");
  initProjects();
});

/* =========================================================
   PRELOADER + STARTMODUS
   ========================================================= */

window.addEventListener("load", async () => {
  // Immer im Project-Overlay-Modus starten
  document.body.classList.add("mode-project-list");
  document.body.classList.remove("mode-portfolio");

  const preloader = document.getElementById("preloader");
  const preTitle = document.getElementById("preTitle");
  const siteTitle = document.getElementById("siteTitle");

  if (!preloader || !preTitle || !siteTitle) {
    document.body.classList.remove("preload-lock");
    return;
  }

  await onFontsReady();

  // Startposition: Mitte des Screens
  const startY = window.innerHeight / 2;

  preTitle.style.position = "fixed";
  preTitle.style.left = "50%";
  preTitle.style.top = `${startY}px`;
  preTitle.style.transform = "translate(-50%, -50%)";

  // 1.5 Sekunden stehen lassen
  await new Promise((res) => setTimeout(res, 800));

  // Zielposition: echte Header-Position, mit deinem -8px Offset
  const rect = siteTitle.getBoundingClientRect();
  const targetY = rect.top + rect.height / 2 - 8;

  // Nur vertikal animieren
  preTitle.style.transition = "transform 900ms cubic-bezier(.22,.8,.24,1)";
  preTitle.style.transform = `translate(-50%, ${targetY - startY}px)`;

  preTitle.addEventListener(
    "transitionend",
    () => {
      // Header-Titel sichtbar machen
      siteTitle.style.opacity = "1";
      siteTitle.style.pointerEvents = "auto";

      // Overlay-Modus sicherstellen
      document.body.classList.add("mode-project-list");
      document.body.classList.remove("mode-portfolio");

      // Project-Overlay öffnen
      openProjectOverlay();

      // Preloader ausblenden und entfernen
      preloader.classList.add("is-hidden");
      preloader.addEventListener("transitionend", () => preloader.remove(), {
        once: true,
      });

      // Body wieder scrollbar
      document.body.classList.remove("preload-lock");
    },
    { once: true }
  );
});

/* =========================================================
   ABOUT OVERLAY
   ========================================================= */

if (headerTitle && overlayWhite) {
  headerTitle.addEventListener("click", () => {
    const isActive = headerTitle.classList.contains("active");

    const headerBack = document.querySelector(".header-back");
    const viewToggle = document.querySelector(".view-toggle");

    if (isActive) {
      /* ====== CLOSE ABOUT ====== */

      headerTitle.classList.remove("active");
      overlayWhite.classList.remove("show");
      document.body.classList.remove("about-open");

      // Text wiederherstellen
      headerTitle.textContent = "SARA DAVAZ";
      headerTitle.style.fontWeight = "bold";

      // Pfeile wieder anzeigen
      if (headerBack) headerBack.style.display = "";
      if (viewToggle) viewToggle.style.display = "";

      setTimeout(() => {
        overlayWhite.hidden = true;
      }, 400);

      return;
    }

    /* ====== OPEN ABOUT ====== */

    overlayWhite.hidden = false;
    overlayWhite.classList.add("show");
    headerTitle.classList.add("active");
    document.body.classList.add("about-open");

    // Text ändern
    headerTitle.textContent = "CLOSE";
    headerTitle.style.fontWeight = "bold";

    // Pfeile verstecken
    if (headerBack) headerBack.style.display = "none";
    if (viewToggle) viewToggle.style.display = "none";
  });
}

/* =========================================================
   FOOTER OVERLAYS
   ========================================================= */

function hideAllFooterOverlays() {
  // Scroll wieder erlauben
  document.body.classList.remove("no-scroll");

  // Datenschutz Overlay ausblenden
  if (ovDS) {
    ovDS.classList.remove("show");
    setTimeout(() => (ovDS.hidden = true), 400);
  }

  // Impressum Overlay ausblenden
  if (ovIM) {
    ovIM.classList.remove("show");
    setTimeout(() => (ovIM.hidden = true), 400);
  }

  // Header wieder sichtbar machen
  const header = document.querySelector("header");
  if (header) {
    header.style.opacity = "1";
    header.style.pointerEvents = "auto";
    header.style.transform = "translateY(0)";
  }

  // Footer-Texte zurücksetzen
  if (datenschutzEl) {
    datenschutzEl.textContent = "Datenschutz";
    datenschutzEl.style.visibility = "visible";
  }

  if (impressumEl) {
    impressumEl.textContent = "Impressum";
    impressumEl.style.visibility = "visible";
  }

  // (Wurde bereits entfernt — bitte so lassen)
  // document.body.classList.remove("overlay-lock");
}

/* --- DATENSCHUTZ BUTTON --- */
if (datenschutzEl && ovDS) {
  datenschutzEl.addEventListener("click", () => {
    const alreadyOpen = datenschutzEl.textContent.includes("Close");

    if (alreadyOpen) {
      hideAllFooterOverlays();
      return;
    }

    hideAllFooterOverlays();

    ovDS.hidden = false;
    ovDS.classList.add("show");

    document.body.classList.add("no-scroll");

    datenschutzEl.textContent = "Close";

    if (impressumEl) {
      impressumEl.style.visibility = "hidden";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "0";
      header.style.pointerEvents = "none";
      header.style.transform = "translateY(-50px)";
    }

    // ❌ Scroll-Lock ENTFERNT
    // document.body.classList.add("overlay-lock");
  });
}

/* --- IMPRESSUM BUTTON --- */
if (impressumEl && ovIM) {
  impressumEl.addEventListener("click", () => {
    const alreadyOpen = impressumEl.textContent.includes("Close");

    if (alreadyOpen) {
      hideAllFooterOverlays();
      return;
    }

    hideAllFooterOverlays();

    ovIM.hidden = false;
    ovIM.classList.add("show");
    document.body.classList.add("no-scroll");

    impressumEl.textContent = "Close";

    if (datenschutzEl) {
      datenschutzEl.style.visibility = "hidden";
    }

    const header = document.querySelector("header");
    if (header) {
      header.style.opacity = "0";
      header.style.pointerEvents = "none";
      header.style.transform = "translateY(-50px)";
    }

    // ❌ Scroll-Lock ENTFERNT
    // document.body.classList.add("overlay-lock");
  });
}

/* =========================================================
   VIEW TOGGLE (Mobile)
   ========================================================= */

const viewToggle = document.getElementById("viewToggle");
const viewToggleIcon = document.getElementById("viewToggleIcon");
const desktopMQ = window.matchMedia("(min-width: 900px)");

function setArrowIcon(isHorizontal) {
  if (!viewToggleIcon) return;

  viewToggleIcon.src = isHorizontal
    ? "assets/arrows/arrow-down.svg"
    : "assets/arrows/arrow-right.svg";
}

function findCurrentProjectSection() {
  const sections = document.querySelectorAll(".project-section");
  if (!sections.length) return null;

  const headerOffset = 60;
  const focusY = window.scrollY + headerOffset;

  let bestSection = null;
  let bestDist = Infinity;

  sections.forEach((sec) => {
    const rect = sec.getBoundingClientRect();
    const secTop = rect.top + window.scrollY;
    const dist = Math.abs(secTop - focusY);

    if (dist < bestDist) {
      bestDist = dist;
      bestSection = sec;
    }
  });

  return bestSection;
}

function updateViewToggleState() {
  if (!viewToggle) return;

  const isDesktop = desktopMQ.matches;
  const isHorizontal = document.body.classList.contains("view-horizontal");

  if (isDesktop) {
    document.body.classList.remove("view-horizontal");
    viewToggle.setAttribute("aria-hidden", "true");
    viewToggle.setAttribute("aria-pressed", "false");
    setArrowIcon(false);
    return;
  }

  viewToggle.setAttribute("aria-hidden", "false");
  viewToggle.setAttribute("aria-pressed", isHorizontal ? "true" : "false");
  setArrowIcon(isHorizontal);
}

if (viewToggle) {
  viewToggle.addEventListener("click", () => {
    if (desktopMQ.matches) return;

    const currentSection = findCurrentProjectSection();

    const isHorizontal = document.body.classList.toggle("view-horizontal");
    viewToggle.setAttribute("aria-pressed", isHorizontal ? "true" : "false");
    setArrowIcon(isHorizontal);

    if (currentSection) {
      requestAnimationFrame(() => {
        const headerOffset = 60;
        const targetTop =
          currentSection.getBoundingClientRect().top +
          window.scrollY -
          headerOffset;

        window.scrollTo({ top: targetTop, behavior: "auto" });
      });
    }
  });

  desktopMQ.addEventListener("change", updateViewToggleState);
  window.addEventListener("resize", updateViewToggleState);
  updateViewToggleState();
}

/* =========================================================
   SEE ALL PROJECTS BUTTON
   ========================================================= */

if (seeAllProjectsEl) {
  seeAllProjectsEl.addEventListener("click", () => {
    closeProjectOverlay();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* =========================================================
   VIDEO MODAL
   ========================================================= */

function ensureVideoModal() {
  let modal = document.getElementById("videoModal");
  if (modal) return modal;

  modal = document.createElement("div");
  modal.id = "videoModal";
  modal.className = "video-modal";
  modal.innerHTML = `
    <div class="video-modal-inner" role="dialog" aria-modal="true">
      <button class="video-modal-close" type="button" aria-label="Close">Close</button>
      <div class="video-modal-player"></div>
    </div>
  `;

  // Klick auf den dunklen Hintergrund schliesst
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeVideoModal();
  });

  // Close Button
  modal.querySelector(".video-modal-close").addEventListener("click", closeVideoModal);

  // ESC schliesst
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeVideoModal();
  });

  document.body.appendChild(modal);
  return modal;
}

function openVideoModal(youtubeId, title) {
  const modal = ensureVideoModal();
  const player = modal.querySelector(".video-modal-player");

  player.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
      title="${title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  `;

  modal.classList.add("show");
  document.body.classList.add("no-scroll"); // du hast diese Klasse schon
  document.body.classList.add("video-modal-open");
}

function closeVideoModal() {
  const modal = document.getElementById("videoModal");
  if (!modal) return;

  const player = modal.querySelector(".video-modal-player");
  if (player) player.innerHTML = ""; // stoppt playback sofort

  modal.classList.remove("show");
  document.body.classList.remove("no-scroll");
  document.body.classList.remove("video-modal-open");
}

/* =========================================================
   Desktop: Click + Drag to Scroll in .project-media
   ========================================================= */

function enableDragScrollForProjectMedia() {
  const desktopMQ = window.matchMedia("(min-width: 900px)");

  function attach() {
    if (!desktopMQ.matches) return;

    document.querySelectorAll(".project-media").forEach((el) => {
      if (el.dataset.dragScroll === "1") return;
      el.dataset.dragScroll = "1";

      let isDown = false;
      let startX = 0;
      let startScrollLeft = 0;
      let moved = false;

      el.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // nur linke Maustaste

        // nur aktivieren, wenn es horizontal scrollen kann
        const canScrollX = el.scrollWidth > el.clientWidth + 1;
        if (!canScrollX) return;

        isDown = true;
        moved = false;
        startX = e.pageX;
        startScrollLeft = el.scrollLeft;

        el.classList.add("is-dragging");
        e.preventDefault(); // verhindert Bild/Text selection
      });

      window.addEventListener("mousemove", (e) => {
        if (!isDown) return;

        const dx = e.pageX - startX;
        if (Math.abs(dx) > 3) moved = true;

        el.scrollLeft = startScrollLeft - dx;
      });

      window.addEventListener("mouseup", () => {
        if (!isDown) return;
        isDown = false;
        el.classList.remove("is-dragging");
      });

      // Wenn gezogen wurde: den "Klick" (z.B. auf Video-Thumbnail) nicht auslösen
      el.addEventListener(
        "click",
        (e) => {
          if (!moved) return;
          e.preventDefault();
          e.stopPropagation();
          moved = false;
        },
        true
      );
    });
  }

  attach();
  desktopMQ.addEventListener("change", attach);
  window.addEventListener("resize", attach);
}

/* =========================================================
   iOS FIX: Body-Rubberband verhindern (nur mobile + view-horizontal)
   ========================================================= */

(function lockBodyRubberBandInHorizontalView() {
  let startX = 0;
  let startY = 0;

  function isEnabled() {
    return (
      document.body.classList.contains("view-horizontal") &&
      !window.matchMedia("(min-width: 900px)").matches
    );
  }

  document.addEventListener(
    "touchstart",
    (e) => {
      if (!isEnabled()) return;
      if (!e.touches || e.touches.length !== 1) return;

      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    },
    { passive: true, capture: true }
  );

  document.addEventListener(
    "touchmove",
    (e) => {
      if (!isEnabled()) return;
      if (!e.touches || e.touches.length !== 1) return;

      // Wichtig: nur wenn cancelable, sonst bringt preventDefault nichts
      if (!e.cancelable) return;

      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;

      const dx = x - startX;
      const dy = y - startY;

      // Wenn es hauptsächlich horizontal ist -> NICHT blockieren (sonst killt es pan-x)
      if (Math.abs(dx) > Math.abs(dy)) return;

      const scroller = document.scrollingElement || document.documentElement;
      const atTop = scroller.scrollTop <= 0;

      // Nur: ganz oben UND nach unten ziehen -> blockieren
      if (atTop && dy > 0) {
        e.preventDefault();
      }
    },
    { passive: false, capture: true }
  );
})();
