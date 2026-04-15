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
function smoothScroll(id) {
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

// ── FAQ TOGGLE ──
function toggleFaq(btn) {
  const item = btn.closest(".faq-item");
  const isOpen = item.classList.contains("open");
  // Close all open items
  document.querySelectorAll(".faq-item.open").forEach((openItem) => {
    openItem.classList.remove("open");
  });
  // If it wasn't open, open it
  if (!isOpen) {
    item.classList.add("open");
  }
}

// Attach FAQ listeners after DOM ready
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => toggleFaq(btn));
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
    entries.forEach((entry) => {
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

// Disable shimmer on touch devices
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
// Exclude .faq-q buttons to avoid interfering with FAQ toggle
document.querySelectorAll("button:not(.faq-q), a").forEach((el) => {
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

// ── CONTACT FORM SUBMIT (Formspree) ──
async function submitContactForm() {
  const name = document.getElementById("f-name")?.value.trim();
  const phone = document.getElementById("f-phone")?.value.trim();
  const biz = document.getElementById("f-biz")?.value;
  const goal = document.getElementById("f-goal")?.value.trim();

  // Validate required fields
  if (!name || !phone || !biz) {
    ["f-name", "f-phone", "f-biz"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && !el.value.trim()) {
        el.style.borderColor = "var(--red)";
        el.addEventListener(
          "input",
          () => {
            el.style.borderColor = "";
          },
          { once: true },
        );
      }
    });
    return;
  }

  const btn = document.getElementById("formSubmitBtn");
  const btnText = document.getElementById("formBtnText");
  btn.disabled = true;
  btnText.textContent = "Sending...";

  try {
    const res = await fetch("https://formspree.io/f/meeveaeb", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        business_type: biz,
        want_to_track: goal || "Not specified",
        _replyto: "rupeshsolase360@gmail.com",
        _subject: `New Demo Request — ${name} (${biz})`,
      }),
    });

    if (res.ok) {
      document.getElementById("contactForm").style.display = "none";
      document.getElementById("formSuccess").style.display = "block";
    } else {
      const data = await res.json();
      btnText.textContent = "📊 Get My Free Demo";
      btn.disabled = false;
      alert(
        "Something went wrong. Please email us directly at rupeshsolase360@gmail.com",
      );
    }
  } catch (err) {
    btnText.textContent = "📊 Get My Free Demo";
    btn.disabled = false;
    alert("Network error. Please email us at rupeshsolase360@gmail.com");
  }
}
