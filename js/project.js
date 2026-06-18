/* ── Menu overlay ── */
const menuOpen    = document.getElementById('menuOpen');
const menuClose   = document.getElementById('menuClose');
const menuOverlay = document.getElementById('menuOverlay');

menuOpen.addEventListener('click', () => menuOverlay.classList.add('open'));
menuClose.addEventListener('click', closeMenu);
menuOverlay.querySelectorAll('.menu-link').forEach(l => l.addEventListener('click', closeMenu));
function closeMenu() { menuOverlay.classList.remove('open'); }

/* ── COMPÉTENCES modal ── */
const compBtn     = document.getElementById('compBtn');
const compModal   = document.getElementById('compModal');
const compOverlay = document.getElementById('compOverlay');
const compClose   = document.getElementById('compClose');

if (compBtn && compModal && compOverlay) {
  compBtn.addEventListener('click', () => {
    compModal.classList.add('open');
    compOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  function closeModal() {
    compModal.classList.remove('open');
    compOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  compOverlay.addEventListener('click', closeModal);
  if (compClose) compClose.addEventListener('click', closeModal);
}

/* ── Hero video controls (auto-injected) ── */
const PLAY_SVG  = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_SVG = `<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const SOUND_SVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
const MUTE_SVG  = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`;

(function initVideoControls() {
  const hero  = document.querySelector('.proj-hero');
  if (!hero) return;
  const video = hero.querySelector('video');
  if (!video) return;

  const wrap = document.createElement('div');
  wrap.className = 'proj-video-controls';

  const playBtn = document.createElement('button');
  playBtn.className = 'proj-vid-btn';
  playBtn.setAttribute('aria-label', 'Lecture / Pause');

  const muteBtn = document.createElement('button');
  muteBtn.className = 'proj-vid-btn';
  muteBtn.setAttribute('aria-label', 'Son');

  wrap.appendChild(playBtn);
  wrap.appendChild(muteBtn);
  hero.appendChild(wrap);

  // Initial state: autoplay = playing + muted
  playBtn.innerHTML = PAUSE_SVG;
  muteBtn.innerHTML = MUTE_SVG;

  playBtn.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {});
      playBtn.innerHTML = PAUSE_SVG;
    } else {
      video.pause();
      playBtn.innerHTML = PLAY_SVG;
    }
  });

  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.innerHTML = video.muted ? MUTE_SVG : SOUND_SVG;
  });

  video.addEventListener('pause', () => { playBtn.innerHTML = PLAY_SVG; });
  video.addEventListener('play',  () => { playBtn.innerHTML = PAUSE_SVG; });
})();
