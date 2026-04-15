// ── SCROLL NAV ──
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// ── MOBILE MENU ──
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  mobileMenu.classList.toggle("open");
});

// Close mobile menu when link clicked
document.querySelectorAll(".mobile-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("open");
  });
});

// ── SMOOTH SCROLL HELPER ──
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// Close menu on outside click
document.addEventListener("click", (e) => {
  if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
    hamburger.classList.remove("active");
    mobileMenu.classList.remove("open");
  }
});

// ── HERO BAR CHART ──
const barHeights = [
  42, 58, 35, 70, 52, 28, 65, 78, 48, 68, 44, 88, 62, 74, 55, 82, 70, 45, 90,
  68,
];
const barsContainer = document.getElementById("heroBars");

barHeights.forEach((h, i) => {
  const bar = document.createElement("div");
  bar.className = "bar";
  bar.style.setProperty("--h", h + "%");
  barsContainer.appendChild(bar);
  setTimeout(
    () => {
      bar.style.height = h + "%";
    },
    600 + i * 30,
  );
});

// ── INTERSECTION OBSERVER — FADE IN ──
const fadeEls = document.querySelectorAll(".fade-in, .fade-in-delay");
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = el.dataset.delay || 0;
        setTimeout(() => el.classList.add("visible"), parseInt(delay));
        fadeObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.1 },
);

// Stagger delays for grid children
document
  .querySelectorAll(".grid-3, .grid-4, .pricing-grid, .process-grid")
  .forEach((grid) => {
    grid.querySelectorAll(".fade-in").forEach((el, i) => {
      el.dataset.delay = i * 70;
    });
  });

fadeEls.forEach((el) => fadeObserver.observe(el));

// ── COUNTER ANIMATION ──
const counters = document.querySelectorAll("[data-target]");
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        let current = 0;
        const step = target / 80;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current).toLocaleString() + suffix;
          }
        }, 16);
        counterObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.3 },
);

counters.forEach((el) => counterObserver.observe(el));

// ── ACTIVE NAV HIGHLIGHT ON SCROLL ──
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const top = section.offsetTop - 100;
    if (window.scrollY >= top) current = section.getAttribute("id");
  });
  navLinks.forEach((link) => {
    link.style.color =
      link.getAttribute("href") === "#" + current ? "var(--teal)" : "";
  });
});
// ── TOUCH DEVICE DETECTION ──
const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

// Disable shimmer on touch devices (doesn't work well on mobile)
if (!isTouchDevice()) {
  document.querySelectorAll(".hov").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,229,184,0.04), transparent 60%), linear-gradient(160deg, var(--bg3), var(--bg2))`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.background = "";
    });
  });
}

// ── PREVENT DOUBLE-TAP ZOOM ON BUTTONS (iOS) ──
document.querySelectorAll("button, a").forEach((el) => {
  el.addEventListener(
    "touchend",
    (e) => {
      e.preventDefault();
      el.click();
    },
    { passive: false },
  );
});

// ── HERO SECTION MIN HEIGHT FIX FOR MOBILE ──
function setHeroHeight() {
  const hero = document.getElementById("home");
  if (hero && window.innerWidth <= 768) {
    hero.style.minHeight = window.innerHeight + "px";
  }
}
setHeroHeight();
window.addEventListener("resize", setHeroHeight);

// ── CLOSE MENU ON SCROLL ──
window.addEventListener(
  "scroll",
  () => {
    if (mobileMenu.classList.contains("open")) {
      hamburger.classList.remove("active");
      mobileMenu.classList.remove("open");
    }
  },
  { passive: true },
);
