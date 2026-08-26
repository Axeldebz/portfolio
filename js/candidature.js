/* ─────────────────────────────────────────
   CANDIDATURE.JS — page dossier TSI
   – Barre de progression scroll
   – Reveal des projets au scroll
   – Lecture vidéo à la demande, en boucle, contrôles custom (pas d'UI native)
   – Tilt 3D au survol des écrans, figé une fois la vidéo activée
   – Logo AXEL : retour portfolio avec avertissement
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

/* ── Lecture vidéo à la demande + contrôles custom (aucune UI native) ── */
const VID_ICONS = {
  play:  '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l8 5-8 5V3z"/></svg>',
  pause: '<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="3.5" height="10" rx="1"/><rect x="9.5" y="3" width="3.5" height="10" rx="1"/></svg>',
  vol:   '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 6.5h2.5L8 3v10L4.5 9.5H2V6.5z"/><path d="M11 5.5a3.5 3.5 0 010 5" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>',
  mute:  '<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 6.5h2.5L8 3v10L4.5 9.5H2V6.5z"/><path d="M11 6l3.2 3.2M14.2 6L11 9.2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  full:  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"/></svg>',
};

function fmtTime(s) {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
}

document.querySelectorAll('.cv-frame').forEach(frame => {
  const video = frame.querySelector('video');
  const btn   = frame.querySelector('.cv-play-btn');
  if (!video || !btn) return;

  let bar, playBtn, muteBtn, track, fill, thumb, timeEl;

  function buildBar() {
    bar = document.createElement('div');
    bar.className = 'cv-vidbar';
    bar.innerHTML = `
      <button class="cv-vidbtn cv-vidbtn--play" aria-label="Lecture / Pause">${VID_ICONS.pause}</button>
      <span class="cv-vidtime">0:00 / 0:00</span>
      <div class="cv-vidtrack">
        <div class="cv-vidfill"></div>
        <div class="cv-vidthumb"></div>
      </div>
      <button class="cv-vidbtn cv-vidbtn--mute" aria-label="Son">${VID_ICONS.vol}</button>
      <button class="cv-vidbtn cv-vidbtn--full" aria-label="Plein écran">${VID_ICONS.full}</button>
    `;
    frame.appendChild(bar);
    playBtn        = bar.querySelector('.cv-vidbtn--play');
    muteBtn        = bar.querySelector('.cv-vidbtn--mute');
    const fullBtn  = bar.querySelector('.cv-vidbtn--full');
    track          = bar.querySelector('.cv-vidtrack');
    fill           = bar.querySelector('.cv-vidfill');
    thumb          = bar.querySelector('.cv-vidthumb');
    timeEl         = bar.querySelector('.cv-vidtime');

    playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlay(); });
    muteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      video.muted = !video.muted;
      muteBtn.innerHTML = video.muted ? VID_ICONS.mute : VID_ICONS.vol;
    });
    fullBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (frame.requestFullscreen) frame.requestFullscreen();
    });

    let seeking = false;
    function seekAt(clientX) {
      const r = track.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (isFinite(video.duration)) video.currentTime = p * video.duration;
      setProgress(p);
    }
    track.addEventListener('pointerdown', (e) => {
      e.stopPropagation();
      seeking = true;
      track.setPointerCapture(e.pointerId);
      seekAt(e.clientX);
    });
    track.addEventListener('pointermove', (e) => { if (seeking) seekAt(e.clientX); });
    track.addEventListener('pointerup',   () => { seeking = false; });
  }

  function setProgress(p) {
    fill.style.width = (p * 100) + '%';
    thumb.style.left = (p * 100) + '%';
  }

  function togglePlay() {
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  function start() {
    if (!video.src) {
      video.src = video.dataset.src;
      video.load();
      buildBar();
      // Activé une fois pour toutes : écran remis à plat, contrôles restent lisibles
      frame.classList.add('is-playing');
      frame.style.transform = 'none';
    }
    togglePlay();
  }

  btn.addEventListener('click',   (e) => { e.stopPropagation(); start(); });
  frame.addEventListener('click', () => { start(); });

  video.addEventListener('play', () => {
    btn.classList.add('hidden');
    if (playBtn) playBtn.innerHTML = VID_ICONS.pause;
  });
  video.addEventListener('pause', () => {
    btn.classList.remove('hidden');
    if (playBtn) playBtn.innerHTML = VID_ICONS.play;
  });
  video.addEventListener('loadedmetadata', () => {
    if (timeEl) timeEl.textContent = `0:00 / ${fmtTime(video.duration)}`;
  });
  video.addEventListener('timeupdate', () => {
    if (!fill || !video.duration) return;
    setProgress(video.currentTime / video.duration);
    timeEl.textContent = `${fmtTime(video.currentTime)} / ${fmtTime(video.duration)}`;
  });
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
      if (frame.classList.contains('is-playing')) return;
      const r  = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width  - 0.5;
      const py = (e.clientY - r.top)  / r.height - 0.5;
      frame.style.transform = `rotateY(${(px * 14).toFixed(2)}deg) rotateX(${(-py * 12).toFixed(2)}deg) scale(1.015)`;
    });
    frame.addEventListener('pointerleave', () => {
      if (!frame.classList.contains('is-playing')) frame.style.transform = '';
    });
  });
}

/* ── Logo AXEL : retour portfolio (avec avertissement) ── */
const cvHome = document.getElementById('cvHome');
if (cvHome) {
  cvHome.addEventListener('click', () => {
    const ok = confirm("Cette page n'est accessible que via le lien qui vous a été transmis — elle n'apparaît pas sur le portfolio public. Retourner au portfolio ?");
    if (ok) window.location.href = 'home.html';
  });
  cvHome.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); cvHome.click(); }
  });
}
