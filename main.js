// Highlight active link when scrolling (optional for now)
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 80;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});


// Mobile menu toggle
const hamburger = document.getElementById("hamburger");
const navLinksContainer = document.getElementById("nav-links");

hamburger.addEventListener("click", () => {
  navLinksContainer.classList.toggle("open");
});
// Close menu when clicking a nav link (mobile UX fix)
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.remove("open");
  });
});

































/* =============================
   HERO ANIMATIONS — safe version
   (preserves <br> and nested spans)
   ============================= */
(function () {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const hero        = document.querySelector('.hero');
  const helloPill   = document.querySelector('.greeting');
  const titleEl     = document.querySelector('.hero-title');
  const portraitBG  = document.querySelector('.portrait-bg');
  const portraitImg = document.querySelector('.portrait-img');
  const ctaPill     = document.querySelector('.cta-pill');
  const ctas        = document.querySelectorAll('.cta');

  if (!hero) return;

  const easeOut     = 'cubic-bezier(.25,.8,.25,1)';
  const easeOutBack = 'cubic-bezier(.2,.9,.3,1.15)';

  // ---- Safe word wrapper: walks text nodes, keeps <br> & nested elements intact
  function wrapWordsPreserveStructure(root) {
    if (!root || root.dataset._wordsWrapped === '1') return [...root.querySelectorAll('.__word')];

    const spans = [];
    function process(node) {
      node.childNodes.forEach(ch => {
        // Text node → split into words & whitespace, replace with fragment
        if (ch.nodeType === Node.TEXT_NODE) {
          const txt = ch.textContent;
          if (!txt || !txt.trim()) return; // keep pure whitespace nodes as-is
          const frag = document.createDocumentFragment();
          // keep spaces as real text nodes, words as spans
          txt.split(/(\s+)/).forEach(token => {
            if (!token) return;
            if (/^\s+$/.test(token)) {
              frag.appendChild(document.createTextNode(token));
            } else {
              const s = document.createElement('span');
              s.className = '__word';
              s.textContent = token;
              s.style.display = 'inline-block';
              s.style.willChange = 'opacity, transform';
              frag.appendChild(s);
              spans.push(s);
            }
          });
          ch.replaceWith(frag);
        }
        // Element node → recurse (but don't process <br>)
        else if (ch.nodeType === Node.ELEMENT_NODE && ch.tagName !== 'BR') {
          process(ch);
        }
      });
    }
    process(root);
    root.dataset._wordsWrapped = '1';
    return spans;
  }

  function once(el, keyframes, options) {
    if (!el) return;
    if (prefersReduced) { el.style.opacity = 1; el.style.transform = ''; el.style.filter=''; return; }
    el.animate(keyframes, options).addEventListener('finish', () => {
      const end = keyframes[keyframes.length - 1];
      if (end.opacity != null)   el.style.opacity = String(end.opacity);
      if (end.transform != null) el.style.transform = end.transform;
      if (end.filter != null)    el.style.filter = end.filter;
    });
  }

  // 1) Text Stagger (gentle) – now uses safe wrapper above
  function animateHeadline(delayBase = 360, stagger = 120) {
    const parts = wrapWordsPreserveStructure(titleEl);
    parts.forEach((span, i) => {
      span.style.opacity = 0;
      once(span, [
        { opacity: 0, transform: 'translateY(12px)' },
        { opacity: 1, transform: 'translateY(0px)' }
      ], { duration: 700, delay: delayBase + i * stagger, easing: easeOut, fill: 'both' });
    });
  }

  // 2) Portrait Reveal (gentle)
  function animatePortrait(delay = 420) {
    if (portraitBG) {
      portraitBG.style.opacity = 0;
      once(portraitBG, [{opacity:0},{opacity:1}], { duration: 600, delay, easing: easeOut, fill: 'both' });
    }
    if (portraitImg) {
      portraitImg.style.opacity = 0;
      once(portraitImg, [
        { opacity: 0, transform: 'translateX(-50%) translateY(16px)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'translateX(-50%) translateY(0px)',  filter: 'blur(0px)' }
      ], { duration: 900, delay: delay + 180, easing: easeOut, fill: 'both' });
    }
  }

  // 3) CTA Shine (soft & slow) + hover micro-lift
  function addCTAShine() {
    if (!ctaPill || prefersReduced) return;

    const shine = document.createElement('div');
    Object.assign(shine.style, { position: 'absolute', inset: '0', overflow: 'hidden', pointerEvents: 'none', borderRadius: '999px' });
    const bar = document.createElement('div');
    Object.assign(bar.style, {
      position: 'absolute', top: '-45%', left: '-25%', width: '120px', height: '190%',
      transform: 'rotate(10deg)', background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.28) 48%, rgba(255,255,255,0) 100%)',
      filter: 'blur(7px)', opacity: '0'
    });
    shine.appendChild(bar);
    ctaPill.style.position = 'absolute';
    ctaPill.appendChild(shine);

    const doSweep = () => {
      if (prefersReduced) return;
      bar.animate([
        { opacity: 0, transform: 'translateX(-150%) rotate(10deg)' },
        { opacity: .45, offset: .35 },
        { opacity: 0, transform: 'translateX(170%) rotate(10deg)' }
      ], { duration: 1400, delay: 1200, easing: easeOut, fill: 'both' });
    };
    setTimeout(doSweep, 600);

    document.querySelectorAll('.cta').forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        if (prefersReduced) return;
        btn.animate([{transform:'translateY(0)'},{transform:'translateY(-1px)'}], {duration:160, easing:easeOut, fill:'forwards'});
      });
      btn.addEventListener('mouseleave', () => {
        if (prefersReduced) return;
        btn.animate([{transform:'translateY(-1px)'},{transform:'translateY(0)'}], {duration:160, easing:easeOut, fill:'forwards'});
      });
    });
  }

  // 4) Hello pill pop (soft)
  function animateHello(delay = 160) {
    if (!helloPill) return;
    once(helloPill, [
      { opacity: 0, transform: 'scale(.94)' },
      { opacity: 1, transform: 'scale(1.02)', offset: 0.7 },
      { opacity: 1, transform: 'scale(1.0)' }
    ], { duration: 650, delay, easing: easeOutBack, fill: 'both' });
  }

  // 5) Micro-parallax (very subtle)
  function initParallax() {
    if (!portraitImg || prefersReduced) return;

    const maxShift = 6;  // px (mouse)
    const maxY = 6;      // px (scroll)
    let rafMove = 0, rafScroll = 0;

    function onMove(e) {
      if (!window.matchMedia('(pointer:fine)').matches) return;
      if (rafMove) cancelAnimationFrame(rafMove);
      rafMove = requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = ((e.clientX - cx) / rect.width) * maxShift;
        const dy = ((e.clientY - cy) / rect.height) * maxShift;
        portraitImg.style.transform = `translateX(-50%) translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      });
    }
    function resetMove() {
      portraitImg.style.transform = 'translateX(-50%) translate(0,0)';
    }
    if (window.matchMedia('(pointer:fine)').matches) {
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', resetMove);
    }

    function onScroll() {
      if (rafScroll) cancelAnimationFrame(rafScroll);
      rafScroll = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        const p = Math.min(1, Math.max(0, 1 - r.top / vh));
        const ty = (p * maxY).toFixed(1);
        const current = portraitImg.style.transform || 'translateX(-50%)';
        portraitImg.style.transform = current.replace(/translateY\([^)]+\)/, '').trim() + ` translateY(${ty}px)`;
      });
    }
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function runEntrance() {
    if (!hero) return;
    if (!prefersReduced) {
      hero.animate([{opacity: 0},{opacity: 1}], { duration: 420, easing: easeOut, fill: 'both' });
    }
    animateHello(160);
    animateHeadline(360, 120);
    animatePortrait(420);
    addCTAShine();
    initParallax();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runEntrance);
  } else {
    runEntrance();
  }
})();























// ---------- HERO MICRO-INTERACTIONS JS (subtle + restartable) ----------
(() => {
  // 1) Subtle portrait parallax (mouse hover)
  const portrait = document.querySelector('.hero-portrait');
  if (portrait) {
    const img = portrait.querySelector('.portrait-img');
    if (img) {
      const maxTilt = 6;   // degrees
      const maxMove = 10;  // px
      portrait.addEventListener('mousemove', (e) => {
        const r = portrait.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) / (r.width / 2);
        const dy = (e.clientY - cy) / (r.height / 2);
        const rotY = dx * maxTilt;
        const rotX = -dy * maxTilt;
        const tx = dx * maxMove;
        const ty = dy * maxMove;

        img.style.transform =
          `translate(-50%,0) translate(${tx}px, ${ty}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      });

      portrait.addEventListener('mouseleave', () => {
        img.style.transform = 'translate(-50%,0)';
      });
    }
  }

  // 2) Restartable sheen on CTA hover (so it plays every time)
  const ctas = document.querySelectorAll('.cta, .btn.primary');
  ctas.forEach((btn) => {
    btn.addEventListener('mouseenter', () => {
      btn.classList.remove('do-sheen');
      void btn.offsetWidth;          // reflow to restart the animation
      btn.classList.add('do-sheen');
    });
  });
})();
// ================================
// Luxurious CTA Hover Animations
// ================================
const ctas = document.querySelectorAll('.cta, .btn.primary');

ctas.forEach((btn) => {
  const trigger = () => {
    // restart shimmer every hover/tap
    btn.classList.remove('do-sheen');
    void btn.offsetWidth; // force reflow
    btn.classList.add('do-sheen');
  };

  btn.addEventListener('mouseenter', trigger, { passive: true });
  btn.addEventListener('click', trigger, { passive: true }); // for touch devices

  btn.addEventListener('animationend', (e) => {
    if (e.animationName === 'heroSheen') {
      btn.classList.remove('do-sheen'); // reset for next hover
    }
  });
});
// ================================
// CTA Entrance + Luxurious Hover
// (fade/slide in + glow + shimmer)
// ================================
(() => {
  const ctas = document.querySelectorAll('.cta, .btn.primary');
  if (!ctas.length) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) ENTRANCE: subtle fade + slide-up with stagger
  function entrance() {
    if (prefersReduced) {
      ctas.forEach(btn => { btn.style.opacity = 1; btn.style.transform = 'none'; });
      return;
    }
    const baseDelay = 200;     // ms before first CTA animates
    const stagger   = 140;     // ms between CTAs
    ctas.forEach((btn, i) => {
      // start visually from a calm state
      btn.style.opacity = 0;
      btn.animate(
        [
          { opacity: 0, transform: 'translateY(10px)' },
          { opacity: 1, transform: 'translateY(0px)' }
        ],
        {
          duration: 520,
          delay: baseDelay + i * stagger,
          easing: 'cubic-bezier(.25,.8,.25,1)',
          fill: 'forwards'
        }
      );
    });
  }

  // 2) HOVER SHIMMER: restartable every hover/tap
  function setupShimmer() {
    const trigger = (btn) => {
      btn.classList.remove('do-sheen');
      void btn.offsetWidth;            // force reflow to restart animation
      btn.classList.add('do-sheen');
    };
    ctas.forEach((btn) => {
      btn.addEventListener('mouseenter', () => trigger(btn), { passive: true });
      btn.addEventListener('click',      () => trigger(btn), { passive: true }); // touch support
      btn.addEventListener('animationend', (e) => {
        if (e.animationName === 'heroSheen') btn.classList.remove('do-sheen');
      });
    });
  }

  // kick things off
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { entrance(); setupShimmer(); });
  } else {
    entrance(); setupShimmer();
  }
})();





























/* ============================
   Premium hover – attach only
   ============================ */

const hasText = (el, re) => el && re.test((el.textContent || "").trim());

const sectionByTitle = (re) => {
  const hs = document.querySelectorAll('h1,h2,h3,h4');
  for (const h of hs) {
    if (hasText(h, re)) {
      return h.closest('section, .showcase-card, .work-card, .logo-band, .panel, .card, .container, .wrapper') || h.parentElement;
    }
  }
  return null;
};

const pickItems = (root) => {
  if (!root) return [];
  const selectors = ['.logo-item', '.case-item__tile', '.web-item', '.grid > *', '.row > *', '.card', '.item', 'li'];
  const out = [];
  selectors.forEach(s => out.push(...root.querySelectorAll(s)));
  return Array.from(new Set(out)).filter(n => {
    const r = n.getBoundingClientRect();
    return r.width > 48 && r.height > 40 && (n.textContent.trim().length || n.querySelector('img,svg'));
  });
};

const enableLuxHover = (section) => {
  if (!section) return;
  pickItems(section).forEach(el => el.classList.add('lux-hover'));
};

/* main sections */
const skillSection   = sectionByTitle(/top\s*skill\s*set/i);
const toolkitSection = sectionByTitle(/design\s*toolkit/i);
let statsSection =
  sectionByTitle(/years\s*of\s*experience/i) ||
  sectionByTitle(/projects\s*completed/i)   ||
  sectionByTitle(/clients\s*served/i);

if (!statsSection) {
  const pools = document.querySelectorAll('.grid, .row, .showcase-card, .work-card, .logo-band, section');
  statsSection = Array.from(pools).find(c => /\d+\+?/.test((c.textContent || '')));
}

[skillSection, toolkitSection, statsSection].forEach(enableLuxHover);

/* ============================
   FIX: design toolkit items
   ============================ */
if (toolkitSection) {
  const items = toolkitSection.querySelectorAll('img, svg');
  items.forEach(icon => {
    const parent = icon.parentElement;
    if (parent && !parent.classList.contains('toolkit-item')) {
      parent.classList.add('toolkit-item');
    }
  });
}






























/* ---------- Work Showcase micro-interactions ---------- */

/* Add reveal attribute to key pieces (no HTML change needed) */
document.querySelectorAll(`
  .work-card,
  .logo-band,
  .case-item__tile,
  .web-item,
  .ui-stack img,
  .logo-item
`).forEach(el => el.setAttribute('data-reveal', ''));

/* IntersectionObserver: fade + rise on first view */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
})();

/* Gentle 3D tilt for each .work-card (very subtle) */
(() => {
  const MAX_DEG = 4;                      // keep it classy
  const ease = (v, t = 0.18) => v * (1 - t);  // damping for reset

  document.querySelectorAll('.work-card').forEach(card => {
    let rx = 0, ry = 0;

    const set = () => {
      card.style.setProperty('--rx', rx.toFixed(3) + 'deg');
      card.style.setProperty('--ry', ry.toFixed(3) + 'deg');
    };

    const onMove = (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      rx = (0.5 - y) * MAX_DEG;   // X tilt (top/bottom)
      ry = (x - 0.5) * MAX_DEG;   // Y tilt (left/right)
      set();
    };

    const onLeave = () => {
      // smooth return to rest
      const anim = () => {
        rx = ease(rx);
        ry = ease(ry);
        set();
        if (Math.abs(rx) > .05 || Math.abs(ry) > .05) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    };

    card.addEventListener('mousemove', onMove, { passive: true });
    card.addEventListener('mouseleave', onLeave);
    card.addEventListener('mouseenter', onMove, { passive: true });
  });
})();


























/* =========================
   Work Experience – Micro-animations
   ========================= */

// mark items to reveal (no HTML changes required)
(() => {
  const root = document.querySelector('.experience');
  if (!root) return;

  // title + each row as reveal targets
  const targets = [
    root.querySelector('.exp-title'),
    ...root.querySelectorAll('.exp-item')
  ].filter(Boolean);

  targets.forEach(el => el.setAttribute('data-reveal', ''));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.18 });

  targets.forEach(el => io.observe(el));
})();


































/* =========================
   Recommendations – Reveal on Scroll
   ========================= */
(() => {
  const root = document.querySelector('.recommendations');
  if (!root) return;

  const cards = section.querySelectorAll(
  '.cert, .cert-card, .certificate, .certificate-item, .cert-item'
);

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
      }
    });
  }, { threshold: 0.18 });

  cards.forEach(el => io.observe(el));
})();




































// ========================================
// Certificates: open the right PDF on click
// ========================================
(() => {
  const items = document.querySelectorAll('.cert-item');
  if (!items.length) return;

  function openPdf(el) {
    const pdf = el.getAttribute('data-pdf');
    if (!pdf) return;
    const url = encodeURI(pdf); // handles spaces, etc.
    // open in new tab; noopener for security
    window.open(url, '_blank', 'noopener');
  }

  items.forEach((el) => {
    // Click
    el.addEventListener('click', () => openPdf(el));

    // Keyboard (Enter / Space)
    el.addEventListener('keydown', (e) => {
      const key = e.key || e.code;
      if (key === 'Enter' || key === ' ' || key === 'Spacebar') {
        e.preventDefault();
        openPdf(el);
      }
    });
  });
})();




































// ============================================
// Global Scroll Reveal (fade-in on enter, fade-out on exit)
// - Auto-applies to common sections & grids
// - No class name changes required anywhere
// ============================================
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Containers whose direct children should reveal.
  // (Safe with your current structure; excludes header/hero.)
  const CONTAINERS = [
    'section:not(.hero)',          // all content sections
    '.work-grid', '.case-list',    // projects/case studies
    '.logo-band', '.toolkit-grid',
    '.stat-grid', '.exp-list', '.recs-grid',
    '.certs-grid', '.certs-card',  // certificates
    '.work-card', '.exp-card', '.rec-card'
  ];

  // Collect targets (direct children of containers) and mark them as .reveal
  const targets = [];
  CONTAINERS.forEach(sel => {
    document.querySelectorAll(sel).forEach(container => {
      // reveal only direct children for nice stagger
      const kids = container.querySelectorAll(':scope > *:not(.no-reveal)');
      let i = 0;
      kids.forEach(el => {
        // Skip nav/header/hero if nested somehow
        if (el.closest('.site-header, header, .hero')) return;
        // Don’t double-mark
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        // set per-sibling index for stagger (CSS uses --rev-i)
        el.style.setProperty('--rev-i', i++);
        targets.push(el);
      });
    });
  });

  if (!targets.length) return;

  // Reduced motion: show everything immediately
  if (prefersReduced) {
    targets.forEach(el => el.classList.add('is-inview'));
    return;
  }

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Add when visible; remove when not to allow fade-out
        if (entry.isIntersecting) {
          entry.target.classList.add('is-inview');
        } else {
          entry.target.classList.remove('is-inview');
        }
      });
    },
    {
      root: null,
      threshold: 0.12,           // start revealing around 12% visibility
      rootMargin: '0px 0px -10% 0px' // keeps it snappy near the bottom
    }
  );

  targets.forEach(el => io.observe(el));
})();






































// =====================================================
// Recommendations 3D Pop/Tilt (scoped to .rec-card only)
// =====================================================
(() => {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer) return;

  const cards = document.querySelectorAll(
    '#recommendations .rec-card, .recs .rec-card'
  );
  if (!cards.length) return;

  const MAX = 4; // degrees
  cards.forEach(card => {
    let rID = 0;

    const onMove = (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const nx = (e.clientX - cx) / (rect.width / 2);   // -1 .. 1
      const ny = (e.clientY - cy) / (rect.height / 2);  // -1 .. 1

      const rx = Math.max(-MAX, Math.min(MAX, -ny * MAX)); // rotateX
      const ry = Math.max(-MAX, Math.min(MAX,  nx * MAX)); // rotateY

      cancelAnimationFrame(rID);
      rID = requestAnimationFrame(() => {
        card.style.setProperty('--rx', rx.toFixed(2) + 'deg');
        card.style.setProperty('--ry', ry.toFixed(2) + 'deg');
      });
    };

    const onLeave = () => {
      cancelAnimationFrame(rID);
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    };

    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
    card.addEventListener('pointerdown', onLeave); // prevents stuck tilt on drag/tap
  });
})();
