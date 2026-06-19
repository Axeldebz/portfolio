/* =====================================================
   MAIN.JS
   – Menu overlay
   – Video variant switcher (random start, first-click → NORMAL)
   – Scroll-driven 3D carousel with breathing room
   – Impressive physics canvas shake
===================================================== */

/* ── Menu overlay ─────────────────────────────────── */
const menuOpen    = document.getElementById('menuOpen');
const menuClose   = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');

menuOpen.addEventListener('click',  () => menuOverlay.classList.add('open'));
menuClose.addEventListener('click', closeMenu);
menuOverlay.querySelectorAll('.menu-link').forEach(l => l.addEventListener('click', closeMenu));
function closeMenu() { menuOverlay.classList.remove('open'); }

/* ── Video variant switcher ───────────────────────── */
const VARIANTS = [
  { src: 'medias/videos/fond%20video%20axel%20normal.mp4',   label: 'NORMAL'   },
  { src: 'medias/videos/fond%20video%20axel%20grunge.mp4',   label: 'GRUNGE'   },
  { src: 'medias/videos/fond%20video%20axel%20halftone.mp4', label: 'HALFTONE' },
  { src: 'medias/videos/fond%20video%20axel%20lofi.mp4',     label: 'LOFI'     },
];

const bgVideo     = document.getElementById('bgVideo');
const variantBtn  = document.getElementById('variantBtn');
const variantName = document.getElementById('variantName');

const RANDOM_START = 1 + Math.floor(Math.random() * (VARIANTS.length - 1));
let vIdx = RANDOM_START;

function switchVideo(idx) {
  bgVideo.style.opacity = '0';
  setTimeout(() => {
    const v = VARIANTS[idx];
    bgVideo.src = v.src;
    bgVideo.load();
    bgVideo.play().catch(() => {});
    variantName.textContent = v.label;
    bgVideo.style.opacity = '1';
  }, 380);
}

switchVideo(RANDOM_START);
variantBtn.classList.add('highlighted');

let firstVideoClick = true;

variantBtn.addEventListener('click', () => {
  if (firstVideoClick) {
    firstVideoClick = false;
    variantBtn.classList.remove('highlighted');
    vIdx = 0;
    switchVideo(0);
    return;
  }
  vIdx = (vIdx + 1) % VARIANTS.length;
  switchVideo(vIdx);
});

/* ── 3D Carousel ──────────────────────────────────── */
const workContainer = document.getElementById('workScrollContainer');
const workSection   = document.getElementById('work');
const track         = document.getElementById('carouselTrack');
const cards         = Array.from(document.querySelectorAll('.card-item'));
const titleEl       = document.getElementById('projectTitle');
const typeEl        = document.getElementById('projectType');
const workCount     = document.getElementById('workCount');
const dotsWrap      = document.getElementById('carouselDots');

const N      = cards.length;
const CARD_W = Math.max(Math.min(window.innerWidth * 0.38, window.innerHeight * 0.58, 660), 220);
const CARD_H = CARD_W * (9 / 16);
const RADIUS = Math.max(
  (CARD_W / 2 + 20) / Math.sin(Math.PI / N),
  Math.min(window.innerWidth * 0.46, 500)
);

// Gradients par carte — objets structurés pour interpolation JS au scroll
const CARD_GRADIENTS = [
  { dir: 135, c1: '#0A0000', c2: '#7A0000' },   // Marrons nous : noir → rouge profond
  { dir: 160, c1: '#5A8FA8', c2: '#3D7285' },   // Blender 3D : bleu acier froid
  { dir: 160, c1: '#01506E', c2: '#016F8E' },   // Sillans cascade : proche #017196
  { dir: 160, c1: '#7A7E84', c2: '#5E6268' },   // Van Gogh : gris froid
  { dir: 170, c1: '#060608', c2: '#14141E' },   // Freeze EzDeeKid : noir cinématique
  { dir: 145, c1: '#141414', c2: '#2D2D2D' },   // Affiche statistique : noir graphique
  { dir: 160, c1: '#1A2840', c2: '#2C4A6E' },   // 400 ans Marine : bleu nuit
];

function hexRgb(hex) {
  const h = hex.replace('#','');
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function lerpRgb(a, b, t) {
  const [ar,ag,ab_] = hexRgb(a), [br,bg,bb] = hexRgb(b);
  return `rgb(${Math.round(ar+(br-ar)*t)},${Math.round(ag+(bg-ag)*t)},${Math.round(ab_+(bb-ab_)*t)})`;
}
function gradientAt(rawIdx) {
  const fl  = Math.min(Math.floor(rawIdx), N - 2);
  const frac = Math.max(0, Math.min(1, rawIdx - fl));
  const gA  = CARD_GRADIENTS[fl], gB = CARD_GRADIENTS[fl + 1];
  const dir = Math.round(gA.dir + (gB.dir - gA.dir) * frac);
  return `linear-gradient(${dir}deg, ${lerpRgb(gA.c1,gB.c1,frac)} 0%, ${lerpRgb(gA.c2,gB.c2,frac)} 100%)`;
}

const BREATHE    = 1;
workContainer.style.height = `${(N + BREATHE * 2) * 100}vh`;

const TOTAL_SLOTS = N + BREATHE * 2 - 1;
const START_P     = BREATHE / TOTAL_SLOTS;
const END_P       = (BREATHE + N - 1) / TOTAL_SLOTS;

cards.forEach(card => {
  card.style.width  = `${CARD_W}px`;
  card.style.height = `${CARD_H}px`;
  card.style.top    = `${-CARD_H / 2}px`;
  card.style.left   = `${-CARD_W / 2}px`;
});

cards.forEach((card, i) => {
  const angle = (360 / N) * i;
  card.style.transform = `rotateY(${angle}deg) translateZ(${RADIUS}px)`;
});

cards.forEach((_, i) => {
  const dot = document.createElement('div');
  dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
  dotsWrap.appendChild(dot);
});
const dots = Array.from(dotsWrap.querySelectorAll('.carousel-dot'));


let currentAngle = 0;
let targetAngle  = 0;
let activeIdx    = -1; // Start at -1 so goToCard(0) never returns early on first call

function setTitle(idx) {
  const card = cards[idx];
  if (!card) return;
  // Opacity driven by scroll — just swap text (change happens when opacity≈0)
  titleEl.textContent = card.dataset.title;
  typeEl.textContent  = card.dataset.type;
}

function goToCard(idx) {
  idx = ((idx % N) + N) % N;
  if (idx === activeIdx) return;
  activeIdx = idx;
  setTitle(idx);
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  cards.forEach((c, i) => c.classList.toggle('active', i === idx));
  if (workCount) workCount.textContent = `${String(idx+1).padStart(2,'0')} / ${String(N).padStart(2,'0')}`;

  // All videos loop continuously — ensure active card is playing
  cards.forEach((c, i) => {
    const v = c.querySelector('video');
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {
        v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true });
      });
    }
  });

  cards.forEach((c, i) => {
    const s = c.querySelector('.card-shadow');
    if (s) s.style.opacity = (i === idx) ? '1' : '0';
  });
}

// Graceful fallback when video fails (ProRes .mov in Chrome, etc.)
cards.forEach(card => {
  const video = card.querySelector('video');
  if (!video) return;
  video.addEventListener('error', () => {
    video.style.display = 'none';
    const fb = document.createElement('div');
    fb.className = 'card-video-fallback';
    fb.style.cssText = `position:absolute;inset:0;background:${card.dataset.color||'#EEC5CF'};display:flex;align-items:center;justify-content:center;border-radius:20px;`;
    fb.innerHTML = `<span style="font-size:13px;font-weight:700;letter-spacing:0.18em;color:rgba(0,0,0,0.35);text-transform:uppercase;">${card.dataset.title}</span>`;
    card.querySelector('.card-inner').appendChild(fb);
  });
});

// Carousel update is folded into the unified tick() loop — no separate RAF

function onScroll() {
  const rect       = workContainer.getBoundingClientRect();
  const scrollable = workContainer.offsetHeight - window.innerHeight;
  const rawP       = Math.max(0, Math.min(1, -rect.top / scrollable));
  const progress   = Math.max(0, Math.min(1, (rawP - START_P) / (END_P - START_P)));
  const rawIdx     = progress * (N - 1);
  targetAngle      = -(rawIdx / N) * 360;

  // ── Gradient interpolé pixel par pixel selon le scroll ──
  workSection.style.background = gradientAt(rawIdx);

  // ── Titre : opacité + léger décalage Y piloté par le scroll ──
  const nearest   = Math.round(rawIdx);
  const dist      = Math.abs(rawIdx - nearest);        // 0 au centre, 0.5 au milieu
  const titleOp   = Math.max(0, 1 - dist * 2.6);      // s'efface avant le changement
  const titleShiftY = (rawIdx - nearest) * 16;         // légère montée/descente
  titleEl.style.opacity   = titleOp.toFixed(3);
  typeEl.style.opacity    = titleOp.toFixed(3);
  titleEl.style.transform = `translateY(${titleShiftY.toFixed(1)}px)`;

  const idx = Math.min(nearest, N - 1);
  if (idx !== activeIdx) goToCard(idx);
}
let _scrollPending = false;
window.addEventListener('scroll', () => {
  if (_scrollPending) return;
  _scrollPending = true;
  requestAnimationFrame(() => { onScroll(); _scrollPending = false; });
}, { passive: true });

function scrollToCard(idx) {
  idx = ((idx % N) + N) % N;
  const p          = idx / (N - 1);
  const rawP       = START_P + p * (END_P - START_P);
  const scrollable = workContainer.offsetHeight - window.innerHeight;
  window.scrollTo({ top: workContainer.offsetTop + rawP * scrollable, behavior: 'smooth' });
}

document.getElementById('prevBtn').addEventListener('click', () => scrollToCard(activeIdx - 1));
document.getElementById('nextBtn').addEventListener('click', () => scrollToCard(activeIdx + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => scrollToCard(i)));

// Init gradient + titre (avant tout scroll)
workSection.style.background = gradientAt(0);
titleEl.style.opacity = '1';
typeEl.style.opacity  = '1';
titleEl.style.transform = 'translateY(0)';

// Init: all videos playing and looping
cards.forEach(c => {
  const v = c.querySelector('video');
  if (!v) return;
  v.play().catch(() => { v.addEventListener('canplay', () => v.play().catch(() => {}), { once: true }); });
});
setTitle(0);
goToCard(0);

// Drag-to-scroll on carousel
let cDragStartX = 0, cDragStartY = 0, cDragStartScrollY = 0;
let cDragging = false, cDidDrag = false, cDragLock = null;
const carouselWrap = document.querySelector('.carousel-wrap');

function onDragMove(e) {
  if (!cDragging || cDidDrag) return;
  const dx = e.clientX - cDragStartX;
  const dy = e.clientY - cDragStartY;
  if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(dy)) return;
  cDidDrag = true;
  const targetIdx = dx < 0
    ? Math.min(activeIdx + 1, N - 1)
    : Math.max(activeIdx - 1, 0);
  scrollToCard(targetIdx);
}

function onDragEnd() {
  if (!cDragging) return;
  cDragging = false;
  carouselWrap.classList.remove('dragging');
  document.removeEventListener('pointermove', onDragMove);
  document.removeEventListener('pointerup',   onDragEnd);
}

carouselWrap.addEventListener('pointerdown', e => {
  if (e.button !== 0) return;
  cDragging = true; cDidDrag = false; cDragLock = null;
  cDragStartX = e.clientX; cDragStartY = e.clientY;
  cDragStartScrollY = window.scrollY;
  carouselWrap.classList.add('dragging');
  document.addEventListener('pointermove', onDragMove);
  document.addEventListener('pointerup',   onDragEnd);
});

carouselWrap.addEventListener('dragstart', e => e.preventDefault());

// Click active card → navigate to project page
cards.forEach(card => {
  card.addEventListener('click', () => {
    if (cDidDrag) return;
    if (!card.classList.contains('active')) return;
    const href = card.dataset.href;
    if (!href) return;
    window.parent?.postMessage({ type: 'navStart' }, '*');
    setTimeout(() => { window.location.href = href; }, 260);
  });
});

// Pause all carousel videos when the work section is not visible
const _videoIO = new IntersectionObserver(([entry]) => {
  cards.forEach(c => {
    const v = c.querySelector('video');
    if (!v) return;
    entry.isIntersecting ? v.play().catch(() => {}) : v.pause();
  });
}, { rootMargin: '200px', threshold: 0 });
_videoIO.observe(workContainer);

// Pause hero background video when hero is scrolled out of view
const _heroIO = new IntersectionObserver(([entry]) => {
  entry.isIntersecting ? bgVideo.play().catch(() => {}) : bgVideo.pause();
}, { threshold: 0.05 });
_heroIO.observe(document.getElementById('hero'));

/* ── Decorative elements — float + parallax + drag + tilt ── */
// JS owns ALL animation so CSS keyframes are not used on .deco-item

const decoItems = Array.from(document.querySelectorAll('.deco-item'));

const decoState = decoItems.map(el => {
  const isBubble = el.classList.contains('section-bubble');
  return {
    el,
    inner:      el.querySelector('.deco-inner'),
    floatAmp:   isBubble ? (14 + Math.random() * 10) : (9  + Math.random() * 13),
    floatSpd:   isBubble ? (0.22 + Math.random() * 0.10) : (0.32 + Math.random() * 0.22),
    floatPhase: Math.random() * Math.PI * 2,
    parallax:   0.022 + Math.random() * 0.058,
    dragging: false,
    dragDX: 0, dragDY: 0,
    startCX: 0, startCY: 0,
    isBubble,
    bvx: 0, bvy: 0,
    bx:  0, by:  0,
    bpopping: false,
  };
});

let decoMX = window.innerWidth  / 2;
let decoMY = window.innerHeight / 2;
let decoT  = 0;

document.addEventListener('mousemove', e => {
  decoMX = e.clientX;
  decoMY = e.clientY;
}, { passive: true });

// Make .about-icon and .contact-icon elements draggable
decoState.forEach(s => {
  if (!s.el.classList.contains('about-icon') && !s.el.classList.contains('contact-icon')) return;
  const el = s.el;

  el.addEventListener('pointerdown', e => {
    s.dragging = true;
    el.style.zIndex = '10';
    el.setPointerCapture(e.pointerId);
    // Record drag start relative to current translated position
    s.startCX = e.clientX - s.dragDX;
    s.startCY = e.clientY - s.dragDY;
    e.preventDefault(); e.stopPropagation();
  });

  el.addEventListener('pointermove', e => {
    if (!s.dragging) return;
    s.dragDX = e.clientX - s.startCX;
    s.dragDY = e.clientY - s.startCY;
  });

  el.addEventListener('pointerup', () => {
    s.dragging = false;
    el.style.zIndex = '';
    // dragDX/dragDY will spring back to 0 via damping in animDeco
  });
});

// Bubbles: pop on click, respawn at random position within section
decoState.forEach(s => {
  if (!s.isBubble) return;
  const face    = s.el.querySelector('.bubble-face');
  const section = s.el.closest('section');
  s.el.addEventListener('click', () => {
    if (s.bpopping) return;
    s.bpopping = true;
    face.classList.add('popping');
    face.addEventListener('animationend', () => {
      face.classList.remove('popping');
      const sw = section.offsetWidth;
      const sh = section.offsetHeight;
      const sz = s.el.offsetWidth || 110;
      const m  = 80;
      s.el.style.left   = `${m + Math.random() * Math.max(20, sw - m * 2 - sz)}px`;
      s.el.style.top    = `${m + Math.random() * Math.max(20, sh - m * 2 - sz)}px`;
      s.el.style.right  = 'auto';
      s.el.style.bottom = 'auto';
      s.bx = 0; s.by = 0; s.bvx = 0; s.bvy = 0;
      s.floatPhase = Math.random() * Math.PI * 2;
      s.bpopping = false;
    }, { once: true });
  });
});

function tick() {
  requestAnimationFrame(tick);
  if (document.hidden) return;

  // ── Carousel ──
  currentAngle += (targetAngle - currentAngle) * 0.055;
  track.style.transform = `rotateY(${currentAngle}deg)`;

  // ── Deco ──
  decoT += 0.016;
  const cX = window.innerWidth  / 2;
  const cY = window.innerHeight / 2;

  decoState.forEach(s => {
    const { el, inner, dragging } = s;

    const fy = Math.sin(decoT * s.floatSpd + s.floatPhase) * s.floatAmp;
    const fx = Math.cos(decoT * s.floatSpd * 0.6 + s.floatPhase) * (s.floatAmp * 0.28);

    if (s.isBubble) {
      if (!s.bpopping) {
        const rect = el.getBoundingClientRect();
        const cx   = rect.left + rect.width  / 2;
        const cy   = rect.top  + rect.height / 2;
        const dx   = cx - decoMX;
        const dy   = cy - decoMY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const FLEE = 260;
        if (dist < FLEE && dist > 1) {
          const f = 0.16 * (1 - dist / FLEE);
          s.bvx += (dx / dist) * f;
          s.bvy += (dy / dist) * f;
        }
        s.bvx *= 0.93; s.bvy *= 0.93;
        s.bx  += s.bvx; s.by  += s.bvy;
        const drift = Math.sqrt(s.bx * s.bx + s.by * s.by);
        if (drift > 200) { s.bvx -= s.bx * 0.022; s.bvy -= s.by * 0.022; }
        el.style.transform = `translate(${fx + s.bx}px, ${fy + s.by}px)`;
      }
      return;
    }

    const px = dragging ? 0 : (decoMX - cX) * s.parallax;
    const py = dragging ? 0 : (decoMY - cY) * s.parallax;
    if (!dragging) { s.dragDX *= 0.86; s.dragDY *= 0.86; }
    el.style.transform = `translate(${fx + px + s.dragDX}px, ${fy + py + s.dragDY}px)`;

    if (inner && !dragging) {
      const rect = el.getBoundingClientRect();
      const ecX  = rect.left + rect.width  / 2;
      const ecY  = rect.top  + rect.height / 2;
      const ddx  = decoMX - ecX;
      const ddy  = decoMY - ecY;
      const dist = Math.sqrt(ddx * ddx + ddy * ddy);
      const PROX = 210;
      if (dist < PROX) {
        const t  = 1 - dist / PROX;
        const rx =  (ddy / PROX) * 24 * t;
        const ry = -(ddx / PROX) * 24 * t;
        inner.style.transform = `perspective(500px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${1 + t * 0.09})`;
      } else {
        inner.style.transform = '';
      }
    }
    if (inner && dragging) {
      inner.style.transform = 'perspective(500px) rotateX(4deg) rotateY(-4deg) scale(1.08)';
    }
  });
}
tick();
