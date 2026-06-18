// =====================================================
// SCENE3D.JS — Spline-inspired 3D decorative scene
// Bloom post-processing · Physical materials · Custom icons
// Objects react to cursor proximity
// =====================================================
import * as THREE from 'three';
import { EffectComposer }   from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass }       from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass }  from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FontLoader }       from 'three/addons/loaders/FontLoader.js';
import { TextGeometry }     from 'three/addons/geometries/TextGeometry.js';
import { RoomEnvironment }  from 'three/addons/environments/RoomEnvironment.js';

/* ── Canvas & renderer ──────────────────────────── */
const canvas = document.getElementById('sceneCanvas');
const W = window.innerWidth, H = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'default' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(W, H);
renderer.setClearColor(0x000000, 0);
renderer.autoClear = false;
// Shadows disabled — no receivers in scene, zero visual impact
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

/* ── Scene & camera ─────────────────────────────── */
const scene  = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 120);
camera.position.set(0, 0, 9);

/* ── Environment (reflections for metal/glass) ──── */
const pmrem  = new THREE.PMREMGenerator(renderer);
const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
scene.environment = envTex;
pmrem.dispose();

/* ── Post-processing: bloom ─────────────────────── */
const renderTarget = new THREE.WebGLRenderTarget(W, H, {
  type: THREE.HalfFloatType,
  format: THREE.RGBAFormat,
  stencilBuffer: false,
});
const composer = new EffectComposer(renderer, renderTarget);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(
  new THREE.Vector2(W, H),
  0.55,   // strength
  0.55,   // radius
  0.78    // threshold — only bright surfaces glow
);
composer.addPass(bloom);

/* ── Lights ─────────────────────────────────────── */
scene.add(new THREE.AmbientLight(0xfff0e8, 0.7));

const key = new THREE.DirectionalLight(0xffffff, 2.2);
key.position.set(6, 10, 7);
scene.add(key);

const fill = new THREE.PointLight(0xC8BDEA, 3.5, 35);
fill.position.set(-8, 3, 5);
scene.add(fill);

const rim = new THREE.PointLight(0xB4DCC5, 2.8, 30);
rim.position.set(4, -7, 4);
scene.add(rim);

const warm = new THREE.PointLight(0xF0CAAC, 1.8, 25);
warm.position.set(0, 6, 3);
scene.add(warm);

/* ── Material factory ───────────────────────────── */
const P = [0xEEC5CF,0xC8BDEA,0xB4DCC5,0xB4CEEC,0xF0CAAC,0xE6D0A0];

function metalMat(ci, metalness = 0.82, roughness = 0.14) {
  return new THREE.MeshPhysicalMaterial({
    color: P[ci % P.length], metalness, roughness,
    envMapIntensity: 1.2,
  });
}
function matteMat(ci) {
  return new THREE.MeshStandardMaterial({ color: P[ci%P.length], metalness:0.05, roughness:0.82 });
}
function glowMat(ci) {
  const c = new THREE.Color(P[ci%P.length]);
  return new THREE.MeshStandardMaterial({
    color: c, emissive: c, emissiveIntensity: 0.6,
    metalness: 0.1, roughness: 0.4,
  });
}
function glassMat(ci) {
  return new THREE.MeshPhysicalMaterial({
    color: P[ci%P.length], metalness:0.0, roughness:0.05,
    transmission: 0.88, thickness: 1.8,
    transparent: true, side: THREE.DoubleSide,
    envMapIntensity: 1.5,
  });
}
function wireMat(ci) {
  return new THREE.MeshStandardMaterial({
    color: P[ci%P.length], wireframe:true, transparent:true, opacity:0.6,
  });
}

/* ── Canvas icon textures ───────────────────────── */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
  ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h); ctx.quadraticCurveTo(x, y+h, x, y+h-r);
  ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y);
  ctx.closePath();
}

function iconTex(drawFn, size = 256) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const ctx = c.getContext('2d');
  ctx.clearRect(0, 0, size, size);
  drawFn(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// AE – After Effects
const aeTex = iconTex((ctx, s) => {
  const g = ctx.createLinearGradient(0,0,s,s);
  g.addColorStop(0, '#2D0E6E'); g.addColorStop(1, '#1A0840');
  ctx.fillStyle = g;
  rr(ctx, 4, 4, s-8, s-8, s*0.18); ctx.fill();
  ctx.shadowColor='#9B6FFF'; ctx.shadowBlur=20;
  ctx.fillStyle='#9B6FFF';
  ctx.font=`900 ${s*0.5}px 'Arial Black',sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Ae', s*0.5, s*0.53);
});

// Blender
const blenderTex = iconTex((ctx, s) => {
  const g = ctx.createLinearGradient(0,0,s,s);
  g.addColorStop(0,'#2B2B2B'); g.addColorStop(1,'#1A1A1A');
  ctx.fillStyle=g; rr(ctx,4,4,s-8,s-8,s*0.18); ctx.fill();
  // Orange circle
  ctx.shadowColor='#FF7000'; ctx.shadowBlur=24;
  ctx.fillStyle='#FF7000';
  ctx.beginPath(); ctx.arc(s*0.5,s*0.46,s*0.3,0,Math.PI*2); ctx.fill();
  // Inner highlight
  ctx.fillStyle='rgba(255,200,80,0.3)';
  ctx.beginPath(); ctx.arc(s*0.42,s*0.38,s*0.12,0,Math.PI*2); ctx.fill();
  // Dot
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.arc(s*0.5,s*0.46,s*0.06,0,Math.PI*2); ctx.fill();
});

// Premiere Pro
const prTex = iconTex((ctx, s) => {
  const g = ctx.createLinearGradient(0,0,s,s);
  g.addColorStop(0,'#2B0E4E'); g.addColorStop(1,'#15062A');
  ctx.fillStyle=g; rr(ctx,4,4,s-8,s-8,s*0.18); ctx.fill();
  ctx.shadowColor='#E066FF'; ctx.shadowBlur=20;
  ctx.fillStyle='#E066FF';
  ctx.font=`900 ${s*0.5}px 'Arial Black',sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('Pr', s*0.5, s*0.53);
});

// Play button
const playTex = iconTex((ctx, s) => {
  const g = ctx.createRadialGradient(s*0.4,s*0.4,0,s*0.5,s*0.5,s*0.5);
  g.addColorStop(0,'#FFB0C8'); g.addColorStop(1,'#EE7090');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s*0.5,s*0.5,s*0.46,0,Math.PI*2); ctx.fill();
  ctx.shadowColor='rgba(0,0,0,0.3)'; ctx.shadowBlur=10;
  ctx.fillStyle='#fff';
  ctx.beginPath();
  ctx.moveTo(s*0.38, s*0.28); ctx.lineTo(s*0.72, s*0.5); ctx.lineTo(s*0.38, s*0.72);
  ctx.closePath(); ctx.fill();
});

// Film reel
const filmTex = iconTex((ctx, s) => {
  const g = ctx.createLinearGradient(0,0,s,s);
  g.addColorStop(0,'#1A1A2E'); g.addColorStop(1,'#0D0D1A');
  ctx.fillStyle=g; ctx.beginPath(); ctx.arc(s*0.5,s*0.5,s*0.46,0,Math.PI*2); ctx.fill();
  // Outer ring
  ctx.strokeStyle='#B4CEEC'; ctx.lineWidth=s*0.04;
  ctx.beginPath(); ctx.arc(s*0.5,s*0.5,s*0.4,0,Math.PI*2); ctx.stroke();
  // Spokes
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    ctx.beginPath();
    ctx.moveTo(s*0.5+Math.cos(a)*s*0.18, s*0.5+Math.sin(a)*s*0.18);
    ctx.lineTo(s*0.5+Math.cos(a)*s*0.4,  s*0.5+Math.sin(a)*s*0.4);
    ctx.stroke();
  }
  // Center hub
  ctx.fillStyle='#B4CEEC';
  ctx.beginPath(); ctx.arc(s*0.5,s*0.5,s*0.1,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#1A1A2E';
  ctx.beginPath(); ctx.arc(s*0.5,s*0.5,s*0.05,0,Math.PI*2); ctx.fill();
});

// Color wheel
const colorWheelTex = iconTex((ctx, s) => {
  const cx=s*0.5, cy=s*0.5, r=s*0.44;
  const segs=[['#EEC5CF',-90,30],['#F0CAAC',30,90],['#E6D0A0',90,150],
               ['#B4DCC5',150,210],['#B4CEEC',210,270],['#C8BDEA',270,330],['#EEC5CF',330,390]];
  segs.forEach(([c,a0,a1])=>{
    ctx.beginPath(); ctx.moveTo(cx,cy);
    ctx.arc(cx,cy,r,a0*Math.PI/180,a1*Math.PI/180);
    ctx.fillStyle=c; ctx.fill();
  });
  ctx.fillStyle='rgba(245,240,232,0.92)';
  ctx.beginPath(); ctx.arc(cx,cy,r*0.35,0,Math.PI*2); ctx.fill();
});

// "3D" text badge
const tdTex = iconTex((ctx, s) => {
  const g = ctx.createLinearGradient(0,0,s,s);
  g.addColorStop(0,'#1A2E4E'); g.addColorStop(1,'#0A1422');
  ctx.fillStyle=g; rr(ctx,4,4,s-8,s-8,s*0.18); ctx.fill();
  ctx.shadowColor='#78BFFF'; ctx.shadowBlur=22;
  ctx.fillStyle='#78BFFF';
  ctx.font=`900 ${s*0.46}px 'Arial Black',sans-serif`;
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('3D', s*0.5, s*0.53);
});

function iconPlane(tex, x, y, z, scale=1.0) {
  const g = new THREE.PlaneGeometry(1.4*scale, 1.4*scale);
  const m = new THREE.MeshStandardMaterial({
    map:tex, transparent:true, alphaTest:0.01,
    side:THREE.DoubleSide, metalness:0.05, roughness:0.45,
  });
  const mesh = new THREE.Mesh(g, m);
  mesh.position.set(x,y,z);
  return mesh;
}

/* ── Build scene objects ─────────────────────────── */
const objs = []; // { mesh, base:{x,y,z}, phase, isIcon }

function add(mesh, x, y, z, isIcon=false) {
  mesh.position.set(x, y, z);
  scene.add(mesh);
  objs.push({ mesh, base:{x,y,z}, phase: Math.random()*Math.PI*2, isIcon });
}

/* HERO zone y = 0..−2 */
// Big glowing sphere (hero centrepiece)
add(new THREE.Mesh(new THREE.SphereGeometry(0.9,32,32),  metalMat(0, 0.9, 0.08)),  -7.5,  1.2, -2);
add(new THREE.Mesh(new THREE.SphereGeometry(0.6,32,32),  metalMat(2, 0.85,0.12)),   7.2,  1.5, -1.5);
add(new THREE.Mesh(new THREE.TorusGeometry(0.7,0.22,24,60), metalMat(1, 0.88,0.1)), -5,   -0.8, -2);
add(new THREE.Mesh(new THREE.OctahedronGeometry(0.55,0), glassMat(3)),               6,   -1.5, -2);
add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.38,0.1,80,12,2,3), metalMat(4,0.75,0.2)), 4.5, 3.5,-3);
add(new THREE.Mesh(new THREE.BoxGeometry(0.7,0.7,0.7), wireMat(5)),                 -7.5, -0.8, -2.5);

// Glow gems (small, emissive → bloom)
add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.3,0), glowMat(0)),  -3.5, 2.8, -1.5);
add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.22,0), glowMat(2)),  5.5, 3.8, -1.8);
add(new THREE.Mesh(new THREE.SphereGeometry(0.18,32,32), glowMat(1)),  -4.5,-1.5, -1);

// Icon planes – hero
const iAE     = iconPlane(aeTex,      -7.8, 2.5, -2, 1.1);
const iPlay   = iconPlane(playTex,     7.5, 3.2, -2, 1.0);
scene.add(iAE);   objs.push({ mesh:iAE,   base:{x:-7.8,y:2.5,z:-2},  phase:0.4,  isIcon:true });
scene.add(iPlay); objs.push({ mesh:iPlay, base:{x:7.5,y:3.2,z:-2},   phase:1.1,  isIcon:true });

/* WORK zone y = −4..−7 */
add(new THREE.Mesh(new THREE.TorusGeometry(0.85,0.26,24,60), metalMat(3,0.9,0.1)),  -4.5,-5.5,-2.5);
add(new THREE.Mesh(new THREE.SphereGeometry(0.7,32,32),  metalMat(2,0.88,0.12)),    7,  -5, -2);
add(new THREE.Mesh(new THREE.OctahedronGeometry(0.55,0), metalMat(5,0.9,0.08)),    -6.5,-4.5,-2);
add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.4,0), glassMat(1)),               5.5,-6.5,-1.8);
add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.28,0), glowMat(3)),              -2,  -4.5,-1.2);

const iFilm   = iconPlane(filmTex,    -7.5,-6, -2, 1.1);
const iBlend  = iconPlane(blenderTex,  7.5,-4.8,-2, 1.0);
scene.add(iFilm);  objs.push({ mesh:iFilm,  base:{x:-7.5,y:-6,z:-2}, phase:0.8, isIcon:true });
scene.add(iBlend); objs.push({ mesh:iBlend, base:{x:7.5,y:-4.8,z:-2},phase:1.5, isIcon:true });

/* ABOUT zone y = −8..−11 */
add(new THREE.Mesh(new THREE.TorusGeometry(0.65,0.2,24,60), metalMat(4,0.85,0.15)),  7,   -9.5,-2.5);
add(new THREE.Mesh(new THREE.SphereGeometry(0.55,32,32),  metalMat(0,0.88,0.1)),    -5.5,-10, -2);
add(new THREE.Mesh(new THREE.TorusGeometry(0.45,0.14,24,60), metalMat(2,0.9,0.08)), -7.5,-8.5,-2);
add(new THREE.Mesh(new THREE.OctahedronGeometry(0.4,0), glassMat(5)),                5.5,-11, -1.8);
add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.3,0), glowMat(4)),                3,  -9,  -1.5);

const iPr     = iconPlane(prTex,       7.8,-8.5,-2, 1.05);
const iColor  = iconPlane(colorWheelTex,-7.5,-10.5,-2, 1.1);
const iTD     = iconPlane(tdTex,        5.5,-10.2,-2, 1.0);
scene.add(iPr);    objs.push({ mesh:iPr,    base:{x:7.8,y:-8.5,z:-2},   phase:0.6, isIcon:true });
scene.add(iColor); objs.push({ mesh:iColor, base:{x:-7.5,y:-10.5,z:-2}, phase:1.9, isIcon:true });
scene.add(iTD);    objs.push({ mesh:iTD,    base:{x:5.5,y:-10.2,z:-2},  phase:0.3, isIcon:true });

/* CONTACT zone y = −12..−15 */
add(new THREE.Mesh(new THREE.TorusKnotGeometry(0.45,0.13,80,12,3,4), metalMat(0,0.9,0.1)),  5.5,-13,-3);
add(new THREE.Mesh(new THREE.SphereGeometry(0.65,32,32), metalMat(1,0.85,0.12)),            -6,  -14,-2.5);
add(new THREE.Mesh(new THREE.OctahedronGeometry(0.5,0),  glowMat(2)),                         4, -15,-2);
add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.35,0), glassMat(3)),                      -4.5,-13.5,-1.8);

const iPlayBig = iconPlane(playTex, -7.5,-13,-2, 1.2);
scene.add(iPlayBig); objs.push({ mesh:iPlayBig, base:{x:-7.5,y:-13,z:-2}, phase:2.1, isIcon:true });

/* ── 3D Text ─────────────────────────────────────── */
const fLoader = new FontLoader();
fLoader.load(
  'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json',
  (font) => {
    [
      { t:'MOTION', c:0xEEC5CF, x:-9,    y: 3.5, z:-5, ry:0.06  },
      { t:'3D',     c:0xB4CEEC, x: 7,    y: 5,   z:-5, ry:-0.06 },
      { t:'COLOR',  c:0xF0CAAC, x:-7,    y:-7.5, z:-5, ry:0.05  },
      { t:'EDIT',   c:0xE6D0A0, x: 6.5,  y: 5.5, z:-5, ry:-0.04 },
      { t:'BLEND',  c:0xC8BDEA, x:-8.5,  y:-10.5,z:-5, ry:0.07  },
      { t:'CLIP',   c:0xB4DCC5, x: 6.5,  y:-13,  z:-5, ry:-0.04 },
    ].forEach(({ t, c, x, y, z, ry }) => {
      const geo = new TextGeometry(t, { font, size:0.45, depth:0.12, curveSegments:10 });
      geo.center();
      const mat = new THREE.MeshPhysicalMaterial({
        color:c, metalness:0.6, roughness:0.2, envMapIntensity:1.0,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(x, y, z);
      mesh.rotation.y = ry;
      scene.add(mesh);
      objs.push({ mesh, base:{x,y,z}, phase: Math.random()*Math.PI*2, isIcon:false });
    });
  }
);

/* ── Mouse & scroll ─────────────────────────────── */
let mouseScreen = { x: W/2, y: H/2 };
let mouseNDC    = new THREE.Vector2(0, 0);
let camTargetY  = 0, camCurrentY = 0;

window.addEventListener('mousemove', e => {
  mouseScreen.x = e.clientX;
  mouseScreen.y = e.clientY;
  mouseNDC.x = (e.clientX/window.innerWidth)*2-1;
  mouseNDC.y = -(e.clientY/window.innerHeight)*2+1;
}, { passive:true });

window.addEventListener('scroll', () => {
  const p = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  camTargetY = -p * 17;
}, { passive:true });

/* ── Animation loop ─────────────────────────────── */
const clock  = new THREE.Clock();
const _proj  = new THREE.Vector3(); // reused — avoids per-frame allocation

function animate() {
  requestAnimationFrame(animate);
  if (document.hidden) return; // near-zero cost when tab is in background

  const t = clock.getElapsedTime();

  camCurrentY += (camTargetY - camCurrentY) * 0.05;
  camera.position.x += (mouseNDC.x * 0.55 - camera.position.x) * 0.04;
  camera.position.y += (camCurrentY + mouseNDC.y * 0.28 - camera.position.y) * 0.04;
  camera.lookAt(camera.position.x * 0.15, camCurrentY, 0);

  objs.forEach(({ mesh, base, phase, isIcon }) => {
    mesh.position.y = base.y + Math.sin(t*0.42 + phase)*0.24;
    mesh.position.x = base.x + Math.sin(t*0.28 + phase*0.8)*0.1;

    // Reuse _proj instead of mesh.position.clone() → no GC allocation
    _proj.copy(mesh.position).project(camera);
    const sx = (_proj.x+1)/2*window.innerWidth;
    const sy = (-_proj.y+1)/2*window.innerHeight;
    const dx = mouseScreen.x - sx, dy = mouseScreen.y - sy;
    const dist = Math.sqrt(dx*dx + dy*dy);
    const PROX = 200;

    if (dist < PROX) {
      const inf = (1 - dist/PROX);
      const f = isIcon ? 0.8 : 0.5;
      mesh.rotation.x += ((dy/PROX)*Math.PI*f*inf - mesh.rotation.x)*0.1;
      mesh.rotation.y += ((-dx/PROX)*Math.PI*f*inf - mesh.rotation.y)*0.1;
    } else {
      if (!isIcon) {
        mesh.rotation.x += 0.003*(phase>Math.PI?1:-1);
        mesh.rotation.y += 0.005*(phase>Math.PI*1.5?-0.9:1.1);
      } else {
        mesh.rotation.x += (Math.sin(t*0.2+phase)*0.18 - mesh.rotation.x)*0.04;
        mesh.rotation.y += (Math.sin(t*0.15+phase)*0.22 - mesh.rotation.y)*0.04;
      }
    }
  });

  renderer.clearColor();
  renderer.clearDepth();
  composer.render();
}
animate();

/* ── Resize ─────────────────────────────────────── */
window.addEventListener('resize', () => {
  const w = window.innerWidth, h = window.innerHeight;
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloom.resolution.set(w, h);
});
