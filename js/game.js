// DRIFT RUSH — Pseudo-3D road racer (OutRun style, pure Canvas)
(function () {
'use strict';

// ── DOM ──────────────────────────────────────────────────────────
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

// ── Constants ────────────────────────────────────────────────────
const CAM_H      = 1000;
const CAM_D      = 0.84;
const SEG_LEN    = 200;
const VISIBLE    = 200;
const TRACK      = 2000;
const MAX_SPD    = 380;
const ACCEL      = 220;
const BRAKE_F    = 520;
const IDLE_DEC   = 90;
const AUTO_ACC   = 35;
const STEER_C    = 0.007;
const CENTRIFUGE = 0.30;
const CURVE_SC   = 0.018;

const OBS_COLORS = ['#EEC5CF','#B4DCC5','#C8BDEA','#F0CAAC','#78BFFF','#FFD080','#FF8866'];

// ── State ────────────────────────────────────────────────────────
let W, H;
let gState = 'idle';
let pos = 0, speed = 0, playerX = 0;
let lives = 3, score = 0, distT = 0;
let obstacles = [], spawnTimer = 1.5, spawnInterval = 1.8;
let shakeT = 0;
let keys = {};
let raf = null, lastTs = 0;
let best = +localStorage.getItem('driftBest') || 0;

// ── Track ────────────────────────────────────────────────────────
let segs = [];

function buildTrack() {
  segs = [];
  function add(n, curve) {
    curve = curve || 0;
    for (let i = 0; i < n; i++) segs.push({ curve, alt: segs.length % 2 | 0, trees: [] });
  }
  add(40);       add(70,  2.2); add(35);       add(80, -2.8);
  add(50);       add(60,  3.5); add(40, -1.8); add(70, -3.2);
  add(55);       add(90,  2.0); add(40);       add(80, -2.4);
  add(60,  3.0); add(45, -1.5); add(55);       add(70,  4.0);
  add(40, -2.0); add(60,  1.8); add(50);       add(80, -3.5);
  while (segs.length < TRACK) {
    var ref = segs[segs.length % 860];
    segs.push({ curve: ref.curve * 0.8, alt: segs.length % 2 | 0, trees: [] });
  }
  segs.forEach(function(s) {
    if (Math.random() < 0.55) {
      var n = 1 + (Math.random() < 0.4 ? 1 : 0);
      for (var j = 0; j < n; j++) {
        s.trees.push({ side: j % 2 === 0 ? -1 : 1, xOff: 1.3 + Math.random() * 2.4, sz: 0.55 + Math.random() * 0.85 });
      }
    }
  });
}

function getSeg(i) {
  return segs[((i % TRACK) + TRACK) % TRACK];
}

// ── Static scene ─────────────────────────────────────────────────
var stars = [], mnts = [];
function buildScene() {
  stars = [];
  for (var i = 0; i < 110; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random() < 0.18 ? 1.5 : 1, a: 0.25 + Math.random() * 0.75 });
  mnts = [];
  for (var j = 0; j < 32; j++) mnts.push({ x: j / 32, h: 0.22 + Math.random() * 0.78, w: 0.04 + Math.random() * 0.10 });
}

// ── Sky ──────────────────────────────────────────────────────────
function drawSky(horizon) {
  var g = CTX.createLinearGradient(0, 0, 0, horizon);
  g.addColorStop(0,    '#050213');
  g.addColorStop(0.55, '#140B38');
  g.addColorStop(1,    '#2C1468');
  CTX.fillStyle = g;
  CTX.fillRect(0, 0, W, horizon + 1);

  stars.forEach(function(s) {
    CTX.globalAlpha = s.a;
    CTX.fillStyle = '#fff';
    CTX.fillRect(s.x * W, s.y * horizon * 0.88, s.r, s.r);
  });
  CTX.globalAlpha = 1;

  CTX.fillStyle = '#110828';
  CTX.beginPath();
  CTX.moveTo(0, horizon);
  mnts.forEach(function(m) {
    var x = ((m.x + pos * 0.000022) % 1) * W;
    CTX.lineTo(x - m.w * W * 0.45, horizon);
    CTX.lineTo(x,                   horizon - m.h * horizon * 0.30);
    CTX.lineTo(x + m.w * W * 0.45, horizon);
  });
  CTX.lineTo(W, horizon);
  CTX.closePath();
  CTX.fill();
}

// ── Road strip ───────────────────────────────────────────────────
function trap(x1, y1, w1, x2, y2, w2) {
  CTX.beginPath();
  CTX.moveTo(x1,      y1); CTX.lineTo(x1 + w1, y1);
  CTX.lineTo(x2 + w2, y2); CTX.lineTo(x2,      y2);
  CTX.closePath(); CTX.fill();
}

function drawStrip(sx1, sy1, sw1, sx2, sy2, sw2, alt) {
  CTX.fillStyle = alt ? '#141A0C' : '#0D1208';
  CTX.fillRect(0, sy2, W, sy1 - sy2);

  var r1 = sw1 * 0.15, r2 = sw2 * 0.15;
  CTX.fillStyle = alt ? '#EE3355' : '#F5F0E8';
  trap(sx1 - sw1 - r1, sy1, r1 * 2, sx2 - sw2 - r2, sy2, r2 * 2);
  trap(sx1 + sw1 - r1, sy1, r1 * 2, sx2 + sw2 - r2, sy2, r2 * 2);

  CTX.fillStyle = alt ? '#252018' : '#1C1810';
  trap(sx1 - sw1, sy1, sw1 * 2, sx2 - sw2, sy2, sw2 * 2);

  if (!alt) {
    var d1 = sw1 * 0.022, d2 = sw2 * 0.022;
    CTX.fillStyle = 'rgba(245,240,232,0.55)';
    trap(sx1 - d1, sy1, d1 * 2, sx2 - d2, sy2, d2 * 2);
  }
}

// ── Tree ─────────────────────────────────────────────────────────
function drawTree(x, y, sc) {
  if (sc < 0.35 || y > H + 20 || y < 0) return;
  var h = 88 * sc, w = 36 * sc;
  CTX.fillStyle = '#2C1A08';
  CTX.fillRect(x - w * 0.09, y - h * 0.28, w * 0.18, h * 0.30);
  CTX.fillStyle = '#0C1E06';
  [[0, 1.0, 1.0], [0.5, 0.62, 0.72], [0.5, 0.30, 0.50]].forEach(function(row) {
    var yf = row[0], hf = row[1], wf = row[2];
    CTX.beginPath();
    CTX.moveTo(x, y - h * hf);
    CTX.lineTo(x + w * wf, y - h * (hf - hf * 0.32));
    CTX.lineTo(x - w * wf, y - h * (hf - hf * 0.32));
    CTX.closePath(); CTX.fill();
  });
}

// ── Obstacle car ─────────────────────────────────────────────────
function drawObsCar(cx, by, sw, color) {
  var cw = sw * 1.2, ch = cw * 0.44;
  if (cw < 4) return;
  CTX.fillStyle = 'rgba(0,0,0,0.30)';
  CTX.beginPath(); CTX.ellipse(cx, by + ch * 0.1, cw * 0.42, ch * 0.09, 0, 0, Math.PI * 2); CTX.fill();
  CTX.fillStyle = color;
  CTX.beginPath(); CTX.roundRect(cx - cw / 2, by - ch, cw, ch, ch * 0.18); CTX.fill();
  CTX.fillStyle = 'rgba(0,0,0,0.20)';
  CTX.beginPath(); CTX.roundRect(cx - cw * 0.3, by - ch * 1.52, cw * 0.6, ch * 0.62, ch * 0.14); CTX.fill();
  CTX.fillStyle = '#FF2233';
  CTX.fillRect(cx - cw / 2 + cw * 0.05, by - ch * 0.22, cw * 0.11, ch * 0.09);
  CTX.fillRect(cx + cw / 2 - cw * 0.16, by - ch * 0.22, cw * 0.11, ch * 0.09);
  CTX.fillStyle = 'rgba(255,20,40,0.18)';
  CTX.beginPath(); CTX.ellipse(cx - cw * 0.35, by - ch * 0.18, cw * 0.09, ch * 0.09, 0, 0, Math.PI * 2); CTX.fill();
  CTX.beginPath(); CTX.ellipse(cx + cw * 0.35, by - ch * 0.18, cw * 0.09, ch * 0.09, 0, 0, Math.PI * 2); CTX.fill();
}

// ── Player car ───────────────────────────────────────────────────
function drawPlayer(steer) {
  var cx = W / 2 + steer * W * 0.028;
  var cy = H * 0.775;
  var cw = Math.min(W * 0.135, 170);
  var ch = cw * 0.50;

  CTX.fillStyle = 'rgba(0,0,0,0.42)';
  CTX.beginPath(); CTX.ellipse(cx, cy + ch * 0.14, cw * 0.44, ch * 0.10, 0, 0, Math.PI * 2); CTX.fill();

  var bg = CTX.createLinearGradient(cx - cw / 2, cy - ch, cx + cw / 2, cy);
  bg.addColorStop(0, '#F5F0E8'); bg.addColorStop(0.5, '#DDD8CC'); bg.addColorStop(1, '#B8B2A6');
  CTX.fillStyle = bg;
  CTX.beginPath(); CTX.roundRect(cx - cw / 2, cy - ch, cw, ch, ch * 0.18); CTX.fill();

  CTX.fillStyle = 'rgba(110,170,255,0.16)';
  CTX.beginPath(); CTX.roundRect(cx - cw * 0.27, cy - ch * 1.50, cw * 0.54, ch * 0.60, ch * 0.10); CTX.fill();

  var rg = CTX.createLinearGradient(cx, cy - ch * 1.50, cx, cy - ch * 0.90);
  rg.addColorStop(0, '#CCCAC0'); rg.addColorStop(1, '#AEACA4');
  CTX.fillStyle = rg;
  CTX.beginPath(); CTX.roundRect(cx - cw * 0.27, cy - ch * 1.50, cw * 0.54, ch * 0.60, ch * 0.10); CTX.fill();

  CTX.fillStyle = 'rgba(255,240,150,0.90)';
  CTX.fillRect(cx - cw / 2 + cw * 0.06, cy - ch * 1.01, cw * 0.13, ch * 0.08);
  CTX.fillRect(cx + cw / 2 - cw * 0.19, cy - ch * 1.01, cw * 0.13, ch * 0.08);
  CTX.fillStyle = 'rgba(255,240,130,0.11)';
  CTX.beginPath(); CTX.ellipse(cx - cw * 0.33, cy - ch * 0.97, cw * 0.12, ch * 0.12, 0, 0, Math.PI * 2); CTX.fill();
  CTX.beginPath(); CTX.ellipse(cx + cw * 0.33, cy - ch * 0.97, cw * 0.12, ch * 0.12, 0, 0, Math.PI * 2); CTX.fill();

  CTX.fillStyle = '#1C1810';
  [cx - cw * 0.37, cx + cw * 0.37].forEach(function(wx) {
    CTX.beginPath(); CTX.ellipse(wx, cy - ch * 0.07, cw * 0.10, ch * 0.14, 0, 0, Math.PI * 2); CTX.fill();
  });
}

// ── Update ───────────────────────────────────────────────────────
function update(dt) {
  var left  = keys['ArrowLeft']  || keys['a'] || keys['A'];
  var right = keys['ArrowRight'] || keys['d'] || keys['D'];
  var accel = keys['ArrowUp']    || keys['w'] || keys['W'];
  var brake = keys['ArrowDown']  || keys['s'] || keys['S'];

  if (accel)      speed = Math.min(speed + ACCEL   * dt, MAX_SPD);
  else if (brake) speed = Math.max(speed - BRAKE_F * dt, 0);
  else            speed = Math.max(speed - IDLE_DEC * dt, 0);
  speed = Math.min(speed + AUTO_ACC * dt, MAX_SPD);

  pos   += speed * dt;
  distT += speed * dt;

  var si  = Math.floor(pos / SEG_LEN);
  var seg = getSeg(si);
  playerX += seg.curve * speed * CENTRIFUGE * dt * 0.00012;

  var steerAmt = STEER_C * Math.max(speed, 60) * dt;
  if (left)  playerX -= steerAmt;
  if (right) playerX += steerAmt;

  if (Math.abs(playerX) > 1.05) { speed *= 0.982; shakeT = Math.max(shakeT, 0.22); }
  playerX = Math.max(-2.4, Math.min(2.4, playerX));
  shakeT  = Math.max(0, shakeT - dt);

  score = Math.floor(distT / 55);
  EL_SCORE.textContent = score;

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    var laneX = (Math.floor(Math.random() * 3) - 1) * 0.52 + (Math.random() - 0.5) * 0.12;
    obstacles.push({
      z:     pos + VISIBLE * SEG_LEN * 0.80,
      x:     laneX,
      color: OBS_COLORS[Math.floor(Math.random() * OBS_COLORS.length)],
      spd:   55 + Math.random() * 90,
    });
    spawnInterval = Math.max(0.65, spawnInterval * 0.992);
    spawnTimer    = spawnInterval;
  }

  obstacles.forEach(function(o) { o.z -= o.spd * dt; });

  var pz = pos + CAM_D * CAM_H;
  obstacles = obstacles.filter(function(o) {
    if (o.z < pos - SEG_LEN * 4) return false;
    if (Math.abs(o.z - pz) < SEG_LEN * 0.75 && Math.abs(o.x - playerX) < 0.44) {
      onHit(); return false;
    }
    return true;
  });
}

function onHit() {
  lives--;
  speed  *= 0.22;
  shakeT  = 0.65;
  EL_LIVES.textContent = '❤'.repeat(Math.max(0, lives));
  if (lives <= 0) setTimeout(gameOver, 750);
}

// ── Render ───────────────────────────────────────────────────────
function render() {
  CTX.save();
  if (shakeT > 0) CTX.translate((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 6);

  var startSeg = Math.floor(pos / SEG_LEN);
  var posInSeg = pos % SEG_LEN;
  var xOff = 0;
  var proj  = [];

  for (var i = 0; i < VISIBLE + 1; i++) {
    var dw = (i + 1) * SEG_LEN - posInSeg;
    if (dw <= 0) { proj.push(null); continue; }
    var scale = (CAM_D * CAM_H) / dw;
    var s     = getSeg(startSeg + i);
    xOff     += s.curve * CURVE_SC;
    proj.push({
      sx:    W / 2 + (xOff - playerX) * scale * W * 0.5,
      sy:    H / 2 + scale * H * 0.5,
      sw:    scale * W * 0.5,
      scale: scale,
      seg:   s,
    });
  }

  var horizon = H * 0.40;
  for (var ii = proj.length - 1; ii >= 0; ii--) {
    var pp = proj[ii];
    if (pp && pp.sy > H * 0.18 && pp.sy < H) { horizon = pp.sy; break; }
  }

  drawSky(horizon);

  var treeList = [], carList = [];

  for (var i = VISIBLE - 1; i >= 0; i--) {
    var p1 = proj[i], p2 = proj[i + 1];
    if (!p1 || !p2) continue;
    var sy1 = Math.min(H, p1.sy);
    var sy2 = Math.max(horizon, p2.sy);
    if (sy2 >= sy1) continue;

    drawStrip(p1.sx, sy1, p1.sw, p2.sx, sy2, p2.sw, p1.seg.alt);

    p1.seg.trees.forEach(function(t) {
      var tx = p1.sx + t.side * (p1.sw + t.xOff * p1.sw * 0.5);
      var sc = p1.sw * t.sz / (W * 0.28);
      treeList.push({ x: tx, y: p1.sy, sc: sc });
    });

    var segIdx = ((startSeg + i) % TRACK + TRACK) % TRACK;
    obstacles.forEach(function(o) {
      var oz = ((Math.floor(o.z / SEG_LEN)) % TRACK + TRACK) % TRACK;
      if (oz !== segIdx) return;
      carList.push({ cx: p1.sx + o.x * p1.sw, by: p1.sy, sw55: p1.sw * 0.024 * 55, color: o.color });
    });
  }

  treeList.forEach(function(t) { drawTree(t.x, t.y, t.sc); });
  carList.forEach(function(c)  { drawObsCar(c.cx, c.by, c.sw55, c.color); });

  var steer = (keys['ArrowLeft'] || keys['a'] || keys['A']) ? -1
            : (keys['ArrowRight'] || keys['d'] || keys['D']) ? 1 : 0;
  drawPlayer(steer * Math.min(speed / MAX_SPD, 1) * 1.3);

  var sr = speed / MAX_SPD;
  if (sr > 0.58) {
    var a  = (sr - 0.58) / 0.42 * 0.26;
    var vg = CTX.createRadialGradient(W / 2, H / 2, H * 0.18, W / 2, H / 2, H * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,16,' + a.toFixed(2) + ')');
    CTX.fillStyle = vg; CTX.fillRect(0, 0, W, H);
  }

  var bw = Math.min(W * 0.22, 280), bx = W / 2 - bw / 2, by_sp = H - 10;
  CTX.fillStyle = 'rgba(255,255,255,0.08)'; CTX.fillRect(bx, by_sp, bw, 3);
  CTX.fillStyle = sr > 0.85 ? '#FF4466' : sr > 0.62 ? '#FFAA33' : '#B4DCC5';
  CTX.fillRect(bx, by_sp, bw * sr, 3);

  CTX.restore();
}

// ── Loop ─────────────────────────────────────────────────────────
function loop(ts) {
  raf = requestAnimationFrame(loop);
  var dt = Math.min((ts - lastTs) / 1000, 0.05);
  lastTs = ts;
  if (gState === 'playing') { update(dt); render(); }
}

// ── State ────────────────────────────────────────────────────────
function startGame() {
  pos = 0; speed = 70; playerX = 0;
  lives = 3; score = 0; distT = 0;
  obstacles = []; spawnTimer = 1.4; spawnInterval = 1.8;
  shakeT = 0; keys = {};
  EL_LIVES.textContent = '❤❤❤';
  EL_SCORE.textContent = '0';
  if (EL_COMBO) EL_COMBO.textContent = '';
  PSTART.style.display = 'none';
  POVER.style.display  = 'none';
  G_HUD.style.display  = 'flex';
  gState  = 'playing';
  lastTs  = performance.now();
}

function gameOver() {
  gState = 'over';
  G_HUD.style.display = 'none';
  POVER.style.display = 'flex';
  EL_FINAL.textContent = score;
  if (score > best) { best = score; localStorage.setItem('driftBest', best); }
  EL_BEST.textContent = best;
}

function openGame() {
  resize();
  OVERLAY.style.display = 'flex';
  PSTART.style.display  = 'flex';
  POVER.style.display   = 'none';
  G_HUD.style.display   = 'none';
  gState = 'idle';
}

function closeGame() {
  OVERLAY.style.display = 'none';
  gState = 'idle';
}

function resize() {
  W = GC.width  = window.innerWidth;
  H = GC.height = window.innerHeight;
}

// ── Input ────────────────────────────────────────────────────────
window.addEventListener('keydown', function(e) {
  keys[e.key] = true;
  if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)) e.preventDefault();
}, { capture: true });
window.addEventListener('keyup', function(e) { delete keys[e.key]; });

// ── Wiring ───────────────────────────────────────────────────────
OPEN_BTN.addEventListener('click', openGame);
BTN_START.addEventListener('click', startGame);
BTN_RETRY.addEventListener('click', startGame);
BTN_QUIT.addEventListener('click',  closeGame);
window.addEventListener('resize', resize);

// ── Init ─────────────────────────────────────────────────────────
buildTrack();
buildScene();
resize();
requestAnimationFrame(loop);

})();
