/* ─────────────────────────────────────────
   CANDIDATURE.JS — page dossier CVCA
   – Barre de progression scroll
   – Reveal des projets au scroll
   – Lecture vidéo à la demande (aucun chargement avant clic)
   – Tilt 3D au survol des écrans
───────────────────────────────────────── */

/* ── Barre de progression ── */
const cvBar = document.getElementById('cvProgress');
function updateBar() {
  const h = document.documentElement.scrollHeight - window.innerHeight;
  cvBar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
}
window.addEventListener('scroll', () => requestAnimationFrame(updateBar), { passive: true });
updateBar();

/* ── Reveal au scroll ── */
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.16, rootMargin: '0px 0px -80px 0px' });
document.querySelectorAll('.cv-project').forEach(el => revealIO.observe(el));

/* ── Lecture vidéo à la demande ── */
document.querySelectorAll('.cv-frame').forEach(frame => {
  const video = frame.querySelector('video');
  const btn   = frame.querySelector('.cv-play-btn');
  if (!video || !btn) return;

  function start() {
    if (!video.src) {
      video.src = video.dataset.src;
      video.controls = true;
      video.load();
    }
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  btn.addEventListener('click', (e) => { e.stopPropagation(); start(); btn.classList.add('hidden'); });
  frame.addEventListener('click', () => { if (!video.src) { start(); btn.classList.add('hidden'); } });
  video.addEventListener('pause', () => { /* les contrôles natifs gèrent la reprise */ });
});

/* Pause automatique des vidéos hors champ pour ne pas jouer plusieurs pistes son en même temps */
const pauseIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) {
      const v = e.target.querySelector('video');
      if (v && v.src && !v.paused) v.pause();
    }
  });
}, { threshold: 0 });
document.querySelectorAll('.cv-frame').forEach(f => pauseIO.observe(f));

/* ── Tilt 3D au survol des écrans (desktop uniquement) ── */
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.cv-frame').forEach(frame => {
    frame.addEventListener('pointermove', (e) => {
      const r  = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      frame.style.transform = `rotateY(${(px * 14).toFixed(2)}deg) rotateX(${(-py * 12).toFixed(2)}deg) scale(1.015)`;
    });
    frame.addEventListener('pointerleave', () => { frame.style.transform = ''; });
  });
}
