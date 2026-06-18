(function () {
  'use strict';

  /* ── Guard : ne pas s'initialiser dans l'iframe du shell ── */
  if (window.self !== window.top) return;

  /* ── Base path (root ou /projets/) ── */
  const BASE = window.location.pathname.includes('/projets/') ? '../' : '';

  /* ── Playlist ── */
  const RAW = [
    '34MURPHY - BB9E',
    '63OG - mes frères',
    "63OG - poukwa (elle m'demande)",
    '63OG feat. HLD - papier',
    'Alpha Wann x Nujabes - ÇA VA ENSEMBLE II (remix)',
    'Aya Nakamura & La Rvfleuze - Sexy Nana',
    'Cheu-B x Ghost Killer Track feat. SDM - Catalina',
    'DINOS feat. JOLAGREEN23 & LA MANO 1.9 - D BLOCK AFRIQUE',
    'Damso - Autotune',
    'Damso - Γ. Mosaïque solitaire',
    'Dinos feat. Josman - Chelsea',
    'Don Toliver - NEW DROP',
    'Don Toliver feat. Justin Bieber & Future - Private Landing',
    'Drake - Passionfruit',
    "Drake feat. Majid Jordan - Hold On We're Going Home",
    'HAMZA - COME & SEE ME',
    'HAMZA - OSCAR DE LA HOYA',
    'HOUDI - INTÉRIEUR',
    'HOUDI - PEINE',
    'HOUDI - SCORE',
    'HOUDI feat. FAVE - Pas les mots',
    'HUNTRILL feat. ALPHA WANN & VEUST - TROIS SOLEILS',
    'JOLAGREEN23 - 12HEURES MINUIT',
    'JOLAGREEN23 - 360TRICKSHOT',
    "JOLAGREEN23 - APPEL D'UN BRO",
    'JOLAGREEN23 - DRAGON2KOMODO',
    'JOLAGREEN23 - FOUTULESEUM',
    'JOLAGREEN23 - GANGTAKA',
    'JOLAGREEN23 - SMACKDOWN VS RAW2009',
    'JOLAGREEN23 feat. BENNY THE BUTCHER - OKC',
    'Jay-Z - 4_44',
    'Jay-Z - Legacy',
    'Justin Bieber feat. Cash Cobain & Eddie Benjamin - SWAG',
    'KLM - 777',
    'KLM - ECRAN PLAT',
    'Kekra feat. Alpha Wann & La Fève - Ingé son',
    'Kerchak - Kerchak',
    'L2B feat. IDS & La Mano 1.9 - JUMP',
    'LA FÈVE - MAUVAIS PAYEUR',
    'LAYLOW - TRINITYVILLE',
    'LAYLOW feat. ALPHA WANN & WIT. - STUNTMEN',
    'La Fève - 24',
    'La Fève - HOMESTUDIO',
    'La Fève - LES SNITCH ET LES BITCH',
    'La Fève - LOYAL',
    'La Fève - PETIT SEUM',
    'La Fève - SAMESHIT',
    'La Mano 1.9 - Kilo',
    'La Mano 1.9 - No pain No Gain',
    'La Rvfleuze - 312-391',
    'La Rvfleuze - FITNESS PARK',
    'La Rvfleuze - PARLU',
    'Latto - Blick Sum',
    'Lil Tecca - 120',
    'Lil Tecca - Dark Thoughts',
    'Lil Yachty feat. Playboi Carti - Get Dripped',
    "Menace Santana - Freestyle Boosk'Halloween",
    'Metro Boomin feat. Travis Scott & Young Thug - Trance',
    'Nono La Grinta - FLASH-BACK',
    'Nono La Grinta - LOVE YOU',
    'OBOY feat. 1PLIKE140 - Maybach',
    'OBOY feat. Josman - Joddy Boy',
    'OBOY feat. SCH - Saint Laurent',
    'Osirus Jack 667 feat. Freeze Corleone 667 - Lampadaire Pt.2',
    'PLK - Nouvelles',
    'PinkPantheress - Tonight',
    'Playboi Carti - HBA',
    'Playboi Carti - Magnolia',
    'Playboi Carti feat. Kendrick Lamar - GOOD CREDIT',
    'Playboi Carti feat. Skepta - TOXIC',
    'Playboi Carti feat. The Weeknd - RATHER LIE',
    'SHERIFFLAZONE - SHINE',
    'Sherifflazone - NO BAP',
    'Snoop Dogg - Gin and Juice',
    'Snoop Dogg - Who Am I (What’s My Name)',
    'The Weeknd - After Hours',
    'Tory Lanez - The Color Violet',
    'Travis Scott feat. Bad Bunny & The Weeknd - K-POP',
    'Travis Scott feat. Young Thug & M.I.A. - FRANCHISE',
    'VALD - Réflexions basses',
    'Vald feat. Damso - Vitrine',
    'YVNNIS - DONOTDISTURB',
    'ZIAK - CATWALK',
    'ZIAK - Garçons de café',
    'ZIAK - Grabba',
    'ZIAK - La nuit',
    'ZIAK - Le crime parfait',
    'ZIAK - Même pas un grincement',
    'ZIAK feat. JOSMAN - Room',
    'ZIAK feat. ZEU - Zulu',
    'Ziak - Akimbo',
    'Ziak - Bad Bad',
    'Ziak - Chrome',
    'Ziak - Lieu & heure',
    'Ziak feat. Kaaris - Rien ne se remplace',
    'Zola - Belles Femmes',
    'Zola - California Girl',
    'Zola - Honey',
    'Zola - Zolabeille',
    'Zuukou Mayzie 667 feat. Freeze Corleone 667 - Spiderman-Venom',
  ];

  const TRACKS = RAW.slice().sort(() => Math.random() - 0.5);

  function parse(raw) {
    const i = raw.indexOf(' - ');
    return i < 0 ? { artist: raw, title: raw } : { artist: raw.slice(0, i), title: raw.slice(i + 3) };
  }

  /* ── SVGs ── */
  const I = {
    jukebox: `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3.5" y="8.5" width="13" height="9.5" rx="2"/>
      <path d="M3.5 10.5 Q3.5 3.5 10 3.5 Q16.5 3.5 16.5 10.5"/>
      <line x1="6" y1="13" x2="14" y2="13"/>
      <line x1="6" y1="15.5" x2="14" y2="15.5"/>
    </svg>`,
    play:  `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M5 3l8 5-8 5V3z"/></svg>`,
    pause: `<svg viewBox="0 0 16 16" fill="currentColor"><rect x="3" y="3" width="3.5" height="10" rx="1"/><rect x="9.5" y="3" width="3.5" height="10" rx="1"/></svg>`,
    prev:  `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M11.5 3.5L5.5 8l6 4.5V3.5z"/><rect x="3" y="3.5" width="2" height="9" rx="1"/></svg>`,
    next:  `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 3.5l6 4.5-6 4.5V3.5z"/><rect x="11" y="3.5" width="2" height="9" rx="1"/></svg>`,
    vol:   `<svg viewBox="0 0 16 16" fill="currentColor"><path d="M2 6.5h2.5L8 3v10L4.5 9.5H2V6.5z"/><path d="M11 5.5a3.5 3.5 0 010 5" stroke="currentColor" stroke-width="1.3" fill="none" stroke-linecap="round"/></svg>`,
    eye:   `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round">
      <path d="M1.5 8s2.5-4.5 6.5-4.5S14.5 8 14.5 8s-2.5 4.5-6.5 4.5S1.5 8 1.5 8z"/>
      <circle cx="8" cy="8" r="2"/>
      <line x1="2.5" y1="2.5" x2="13.5" y2="13.5"/>
    </svg>`,
  };

  /* ── Injection HTML ── */
  const host = document.createElement('div');
  host.id = 'jukebox';
  host.innerHTML = `
    <div id="jukeboxPanel">
      <div class="juke-track">
        <span id="jukeArtist"></span>
        <span id="jukeTitle"></span>
      </div>
      <div class="juke-controls">
        <button class="juke-btn" id="jukePrev" title="Précédent">${I.prev}</button>
        <div class="juke-play-wrap">
          <button class="juke-btn juke-btn--play" id="jukePlay" aria-label="Lecture / Pause">${I.play}</button>
          <span class="juke-18">18+ · Public averti</span>
        </div>
        <button class="juke-btn" id="jukeNext" title="Suivant">${I.next}</button>
        <label class="juke-vol-wrap" title="Volume">
          ${I.vol}
          <input type="range" id="jukeVol" min="0" max="1" step="0.01" value="0.7">
        </label>
        <button class="juke-btn juke-btn--eye" id="jukeHide" title="Masquer">${I.eye}</button>
      </div>
    </div>
    <button id="jukeboxToggle" aria-label="Jukebox">
      <span id="jukeboxIcon">${I.jukebox}</span>
      <span class="juke-tooltip">Lance le jukebox</span>
    </button>
  `;
  document.body.appendChild(host);

  /* ── Refs ── */
  const panel    = document.getElementById('jukeboxPanel');
  const toggle   = document.getElementById('jukeboxToggle');
  const btnPlay  = document.getElementById('jukePlay');
  const btnPrev  = document.getElementById('jukePrev');
  const btnNext  = document.getElementById('jukeNext');
  const btnHide  = document.getElementById('jukeHide');
  const volInput = document.getElementById('jukeVol');
  const elArtist = document.getElementById('jukeArtist');
  const elTitle  = document.getElementById('jukeTitle');

  /* ── Audio ── */
  const audio = new Audio();
  audio.volume = 0.7;
  let idx     = 0;
  let started = false;

  function setInfo() {
    const { artist, title } = parse(TRACKS[idx]);
    elArtist.textContent = artist;
    elTitle.textContent  = title;
  }

  function loadTrack(i, play) {
    idx = ((i % TRACKS.length) + TRACKS.length) % TRACKS.length;
    audio.src = BASE + 'medias/radio%20musique/' + encodeURIComponent(TRACKS[idx] + '.m4a');
    setInfo();
    if (play) audio.play().catch(() => {});
  }

  function syncBtn() {
    btnPlay.innerHTML = audio.paused ? I.play : I.pause;
    toggle.classList.toggle('playing', !audio.paused);
  }

  audio.addEventListener('ended', () => loadTrack(idx + 1, true));
  audio.addEventListener('play',  syncBtn);
  audio.addEventListener('pause', syncBtn);

  /* ── Hover panel ── */
  let isOpen      = false;
  let forceHidden = false;
  let openTimer   = null;
  let closeTimer  = null;

  function openPanel() {
    if (forceHidden) return;
    isOpen = true;
    panel.classList.add('open');
    host.classList.add('juke--open');
  }

  function closePanel() {
    isOpen      = false;
    forceHidden = false;
    panel.classList.remove('open');
    host.classList.remove('juke--open');
  }

  function scheduleOpen() {
    clearTimeout(closeTimer);
    closeTimer = null;
    if (!isOpen && !forceHidden) {
      openTimer = openTimer || setTimeout(openPanel, 90);
    }
  }

  function scheduleClose() {
    clearTimeout(openTimer);
    openTimer = null;
    if (!closeTimer) {
      closeTimer = setTimeout(closePanel, 320);
    }
  }

  /* Hôte principal */
  host.addEventListener('mouseenter', scheduleOpen);
  host.addEventListener('mouseleave', scheduleClose);

  /* Le panel est en position:absolute au-dessus du bouton —
     on écoute aussi ses événements pour combler l'espace entre les deux */
  panel.addEventListener('mouseenter', () => {
    clearTimeout(closeTimer);
    closeTimer = null;
    forceHidden = false;
  });
  panel.addEventListener('mouseleave', scheduleClose);

  /* Clic sur le bouton jukebox = lecture/pause */
  toggle.addEventListener('click', () => {
    if (!started) {
      started = true;
      loadTrack(idx, true);
    } else if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  /* Bouton masquer : ferme le panel + bloque la réouverture jusqu'à ce que
     le curseur quitte la zone (mouseleave remet forceHidden à false via closePanel) */
  btnHide.addEventListener('click', () => {
    forceHidden = true;
    clearTimeout(openTimer);
    openTimer = null;
    panel.classList.remove('open');
    host.classList.remove('juke--open');
    isOpen = false;
  });

  /* Contrôles */
  btnPlay.addEventListener('click', () => {
    if (!started) {
      started = true;
      loadTrack(idx, true);
    } else if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (started) loadTrack(idx - 1, !audio.paused);
    else { idx = ((idx - 1 + TRACKS.length) % TRACKS.length); setInfo(); }
  });

  btnNext.addEventListener('click', () => {
    if (started) loadTrack(idx + 1, !audio.paused);
    else { idx = (idx + 1) % TRACKS.length; setInfo(); }
  });

  volInput.addEventListener('input', () => { audio.volume = +volInput.value; });

  /* ── Init ── */
  setInfo();
})();
