// =====================================================
// ICON RUSH — mini-jeu portfolio
// =====================================================

const OVERLAY   = document.getElementById('gameOverlay');
const GC        = document.getElementById('gameCanvas');
const CTX       = GC.getContext('2d');
const EL_SCORE  = document.getElementById('gScore');
const EL_LIVES  = document.getElementById('gLives');
const EL_COMBO  = document.getElementById('gCombo');
const EL_FINAL  = document.getElementById('gFinalScore');
const EL_BEST   = document.getElementById('gBestScore');
const G_HUD     = document.getElementById('gHud');
const PSTART    = document.getElementById('gPanelStart');
const POVER     = document.getElementById('gPanelOver');
const BTN_START = document.getElementById('gBtnStart');
const BTN_RETRY = document.getElementById('gBtnRetry');
const BTN_QUIT  = document.getElementById('gBtnQuit');
const OPEN_BTN  = document.getElementById('physicsBtn');

let state = 'idle'; // idle | playing | over
let score = 0, lives = 3, combo = 1;
let best  = +localStorage.getItem('iconRushBest') || 0;
let bubbles = [], sparks = [], ftexts = [];
let spawnT = 0, spawnInterval = 88;
let doubleOn = false, doubleT = 0;
let shakeT = 0;
let raf = null;

// ── Icon definitions ──────────────────────────────
const ICONS = [
  { t:'Ae',  bg:'#1E0848', fg:'#9B6FFF', pts:10, k:'good' },
  { t:'Pr',  bg:'#180430', fg:'#DD60EE', pts:10, k:'good' },
  { t:'3D',  bg:'#0A1835', fg:'#78BFFF', pts:10, k:'good' },
  { t:'✦',  bg:'#EEC5CF', fg:'#7A6055', pts: 8, k:'good' },
  { t:'▶',  bg:'#B4DCC5', fg:'#1C1810', pts: 8, k:'good' },
  { t:'MOV', bg:'#C8BDEA', fg:'#1C1810', pts: 8, k:'good' },
  { t:'CUT', bg:'#F0CAAC', fg:'#1C1810', pts: 8, k:'good' },
  { t:'✴',  bg:'#E6D0A0', fg:'#4A3800', pts: 8, k:'good' },
  { t:'☠',  bg:'#7B1010', fg:'#ffaaaa', pts: 0, k:'skull'},
  { t:'x2',  bg:'#D4A820', fg:'#3A2800', pts: 0, k:'multi'},
  { t:'♥',  bg:'#EEC5CF', fg:'#C03060', pts: 0, k:'life' },
];

// ── Bubble ────────────────────────────────────────
class Bubble {
  constructor() {
    this.r    = 30 + Math.random() * 22;
    this.x    = this.r * 1.5 + Math.random() * (GC.width  - this.r * 3);
    this.y    = GC.height + this.r * 2;
    this.vy   = -(0.7 + Math.random() * 1.0 + score * 0.0006);
    this.vx   = (Math.random() - 0.5) * 0.7;
    this.ph   = Math.random() * Math.PI * 2;
    this.a    = 0;
    this.dead = false;
    this.pop  = 0;
    this.icon = this.#pick();
  }

  #pick() {
    const roll = Math.random();
    if (roll < 0.05)   return ICONS.find(i => i.k === 'skull');
    if (roll < 0.085)  return ICONS.find(i => i.k === 'multi');
    if (roll < 0.11)   return ICONS.find(i => i.k === 'life');
    const g = ICONS.filter(i => i.k === 'good');
    return g[Math.floor(Math.random() * g.length)];
  }

  update() {
    if (this.pop > 0) {
      this.pop += 0.07;
      this.a = Math.max(0, 1 - this.pop);
      if (this.a <= 0) this.dead = true;
      return;
    }
    this.ph += 0.022;
    this.x  += this.vx + Math.sin(this.ph) * 0.6;
    this.y  += this.vy;
    this.a   = Math.min(1, this.a + 0.055);
    if (this.x < this.r)             { this.x = this.r;            this.vx *= -0.5; }
    if (this.x > GC.width - this.r)  { this.x = GC.width - this.r; this.vx *= -0.5; }
    if (this.y < -this.r) {
      this.dead = true;
      if (this.icon.k === 'good') loseLife();
    }
  }

  draw() {
    CTX.save();
    CTX.globalAlpha = this.a;
    CTX.translate(this.x, this.y);

    if (this.pop > 0) {
      CTX.beginPath();
      CTX.arc(0, 0, this.r * (1 + this.pop * 1.5), 0, Math.PI * 2);
      CTX.strokeStyle = this.icon.bg;
      CTX.lineWidth   = 3 * (1 - this.pop);
      CTX.stroke();
      CTX.restore();
      return;
    }

    CTX.shadowColor = this.icon.bg;
    CTX.shadowBlur  = 24;
    CTX.beginPath();
    CTX.arc(0, 0, this.r, 0, Math.PI * 2);
    CTX.fillStyle = this.icon.bg;
    CTX.fill();

    CTX.shadowBlur = 0;
    const hl = CTX.createRadialGradient(-this.r*0.28, -this.r*0.3, 0, 0, 0, this.r);
    hl.addColorStop(0,   'rgba(255,255,255,0.44)');
    hl.addColorStop(0.5, 'rgba(255,255,255,0.06)');
    hl.addColorStop(1,   'rgba(0,0,0,0.18)');
    CTX.fillStyle = hl;
    CTX.fill();

    CTX.fillStyle    = this.icon.fg;
    const fs = this.icon.t.length > 2 ? this.r * 0.58 : this.r * 0.78;
    CTX.font         = `900 ${fs}px "Arial Black",Arial,sans-serif`;
    CTX.textAlign    = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillText(this.icon.t, 0, 2);
    CTX.restore();
  }

  hit(px, py) { return Math.hypot(px - this.x, py - this.y) < this.r; }
  startPop()  { this.pop = 0.001; }
}

// ── Spark ─────────────────────────────────────────
class Spark {
  constructor(x, y, col) {
    const a = Math.random() * Math.PI * 2;
    const s = 3 + Math.random() * 6;
    this.x = x; this.y = y;
    this.vx = Math.cos(a)*s; this.vy = Math.sin(a)*s - 2;
    this.col = col; this.r = 2.5 + Math.random()*3;
    this.a = 1; this.dead = false;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    this.vy += 0.18; this.vx *= 0.97;
    this.a -= 0.035; if (this.a <= 0) this.dead = true;
  }
  draw() {
    CTX.save();
    CTX.globalAlpha = this.a;
    CTX.fillStyle   = this.col;
    CTX.shadowColor = this.col; CTX.shadowBlur = 6;
    CTX.beginPath();
    CTX.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    CTX.fill();
    CTX.restore();
  }
}

// ── Floating text ─────────────────────────────────
class FText {
  constructor(x, y, txt, col='#fff') {
    this.x=x; this.y=y; this.txt=txt; this.col=col;
    this.vy=-2.2; this.a=1; this.dead=false;
  }
  update() {
    this.y += this.vy; this.vy *= 0.93;
    this.a -= 0.022; if (this.a<=0) this.dead=true;
  }
  draw() {
    CTX.save();
    CTX.globalAlpha  = this.a;
    CTX.fillStyle    = this.col;
    CTX.shadowColor  = this.col; CTX.shadowBlur = 8;
    CTX.font         = '700 18px "Arial Black",Arial,sans-serif';
    CTX.textAlign    = 'center';
    CTX.textBaseline = 'middle';
    CTX.fillText(this.txt, this.x, this.y);
    CTX.restore();
  }
}

// ── Game events ───────────────────────────────────
function loseLife() {
  lives = Math.max(0, lives - 1);
  refreshLives();
  combo = 1; refreshCombo();
  shakeT = 14;
  if (lives === 0) endGame();
}

function onHit(b, px, py) {
  b.startPop();
  for (let i = 0; i < 16; i++) sparks.push(new Spark(px, py, b.icon.bg));

  switch (b.icon.k) {
    case 'skull':
      loseLife();
      ftexts.push(new FText(px, py-28, '☠ −VIE', '#ff5555'));
      break;
    case 'multi':
      doubleOn = true; doubleT = 300;
      ftexts.push(new FText(px, py-28, 'x2 ACTIF !', '#D4A820'));
      break;
    case 'life':
      lives = Math.min(3, lives+1); refreshLives();
      ftexts.push(new FText(px, py-28, '+1 ❤', '#EEC5CF'));
      break;
    case 'good': {
      const mult = combo * (doubleOn ? 2 : 1);
      const pts  = b.icon.pts * mult;
      score += pts;
      EL_SCORE.textContent = score;
      combo = Math.min(combo+1, 10); refreshCombo();
      const col = mult >= 4 ? '#D4A820' : mult >= 2 ? '#EEC5CF' : '#fff';
      ftexts.push(new FText(px, py-28, `+${pts}${mult>1?' ×'+mult:''}`, col));
      break;
    }
  }
}

function handleClick(px, py) {
  if (state !== 'playing') return;
  let hit = false;
  for (let i = bubbles.length-1; i >= 0; i--) {
    if (bubbles[i].pop === 0 && bubbles[i].hit(px, py)) {
      onHit(bubbles[i], px, py); hit = true; break;
    }
  }
  if (!hit) { combo = 1; refreshCombo(); }
}

function refreshLives() {
  EL_LIVES.textContent = '❤'.repeat(lives) + '🖤'.repeat(3-lives);
}

function refreshCombo() {
  if (combo > 1) {
    EL_COMBO.textContent = `×${combo} COMBO`;
    EL_COMBO.classList.add('on');
  } else {
    EL_COMBO.classList.remove('on');
  }
}

// ── Render loop ───────────────────────────────────
function loop() {
  // Screen shake
  let shaking = shakeT > 0;
  if (shaking) {
    shakeT--;
    const s = shakeT / 14;
    CTX.save();
    CTX.translate((Math.random()-0.5)*10*s, (Math.random()-0.5)*10*s);
  }

  // Background
  CTX.clearRect(-20, -20, GC.width+40, GC.height+40);
  const bg = CTX.createLinearGradient(0, 0, 0, GC.height);
  bg.addColorStop(0, '#120828');
  bg.addColorStop(1, '#070412');
  CTX.fillStyle = bg;
  CTX.fillRect(-20, -20, GC.width+40, GC.height+40);

  // Subtle dot grid
  CTX.fillStyle = 'rgba(255,255,255,0.028)';
  for (let x=40; x<GC.width; x+=80)
    for (let y=40; y<GC.height; y+=80) {
      CTX.beginPath(); CTX.arc(x,y,1.5,0,Math.PI*2); CTX.fill();
    }

  // Multiplier progress bar
  if (doubleOn) {
    doubleT--;
    if (doubleT <= 0) doubleOn = false;
    const pct = doubleT / 300;
    CTX.fillStyle = 'rgba(212,168,32,0.15)';
    CTX.fillRect(0, GC.height-6, GC.width, 6);
    CTX.fillStyle = 'rgba(212,168,32,0.65)';
    CTX.fillRect(0, GC.height-6, GC.width*pct, 6);
  }

  // Spawn
  spawnT++;
  if (spawnT >= spawnInterval) {
    // Occasionally spawn 2 at once
    bubbles.push(new Bubble());
    if (score > 300 && Math.random() < 0.3) bubbles.push(new Bubble());
    spawnT = 0;
    spawnInterval = Math.max(26, spawnInterval - 0.2);
  }

  bubbles.forEach(b => b.update());
  sparks.forEach(s => s.update());
  ftexts.forEach(t => t.update());
  bubbles.forEach(b => b.draw());
  sparks.forEach(s => s.draw());
  ftexts.forEach(t => t.draw());

  // Cull dead
  bubbles = bubbles.filter(b => !b.dead);
  sparks  = sparks.filter(s => !s.dead);
  ftexts  = ftexts.filter(t => !t.dead);

  if (shaking) CTX.restore();
  if (state === 'playing') raf = requestAnimationFrame(loop);
}

// ── State control ─────────────────────────────────
function startGame() {
  state = 'playing';
  score=0; lives=3; combo=1;
  bubbles=[]; sparks=[]; ftexts=[];
  spawnT=0; spawnInterval=88;
  doubleOn=false; shakeT=0;

  EL_SCORE.textContent = '0';
  refreshLives(); refreshCombo();

  PSTART.style.display = 'none';
  POVER.style.display  = 'none';
  G_HUD.style.display  = 'flex';

  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(loop);
}

function endGame() {
  state = 'over';
  if (raf) cancelAnimationFrame(raf);
  if (score > best) { best = score; localStorage.setItem('iconRushBest', best); }
  EL_FINAL.textContent = score.toLocaleString('fr-FR');
  EL_BEST.textContent  = best.toLocaleString('fr-FR');
  setTimeout(() => { POVER.style.display = 'flex'; }, 600);
}

function openGame() {
  resize();
  OVERLAY.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  G_HUD.style.display  = 'none';
  PSTART.style.display = 'flex';
  POVER.style.display  = 'none';
  state = 'idle';
  // Draw bg immediately
  const bg = CTX.createLinearGradient(0,0,0,GC.height);
  bg.addColorStop(0,'#120828'); bg.addColorStop(1,'#070412');
  CTX.fillStyle=bg; CTX.fillRect(0,0,GC.width,GC.height);
}

function closeGame() {
  state = 'idle';
  if (raf) cancelAnimationFrame(raf);
  OVERLAY.style.display = 'none';
  document.body.style.overflow = '';
}

function resize() {
  GC.width  = window.innerWidth;
  GC.height = window.innerHeight;
}

// ── Event listeners ───────────────────────────────
OPEN_BTN.addEventListener('click', openGame);
BTN_START.addEventListener('click', startGame);
BTN_RETRY.addEventListener('click', startGame);
BTN_QUIT.addEventListener('click', closeGame);
window.addEventListener('resize', resize);
document.addEventListener('keydown', e => { if (e.key==='Escape') closeGame(); });

GC.addEventListener('click', e => {
  const r = GC.getBoundingClientRect();
  handleClick(e.clientX-r.left, e.clientY-r.top);
});
GC.addEventListener('touchstart', e => {
  e.preventDefault();
  const r = GC.getBoundingClientRect();
  const t = e.touches[0];
  handleClick(t.clientX-r.left, t.clientY-r.top);
}, { passive: false });
