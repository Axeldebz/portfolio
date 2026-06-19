(function () {
'use strict';

/* ═══════════════════════════════════════════
   ARTIST POOLS (pour choix par langue)
═══════════════════════════════════════════ */
const ARTISTS = [
  '34MURPHY','63OG','Alpha Wann','Aya Nakamura','Cheu-B',
  'DINOS','Damso','Don Toliver','Drake','HAMZA','HOUDI',
  'HUNTRILL','JOLAGREEN23','Jay-Z','Justin Bieber','KLM',
  'Kekra','Kerchak','L2B','La Feve','LAYLOW','La Mano 1.9',
  'La Rvfleuze','Latto','Lil Tecca','Lil Yachty',
  'Menace Santana','Metro Boomin','Nono La Grinta','OBOY',
  'Osirus Jack 667','PLK','PinkPantheress','Playboi Carti',
  'SHERIFFLAZONE','Snoop Dogg','The Weeknd','Tory Lanez',
  'Travis Scott','VALD','YVNNIS','ZIAK','Zola','Zuukou Mayzie 667'
];

const EN_ARTISTS = [
  'Drake','Jay-Z','Snoop Dogg','The Weeknd','Travis Scott',
  'Playboi Carti','Don Toliver','Metro Boomin','Lil Tecca','Lil Yachty',
  'PinkPantheress','Latto','Tory Lanez','Justin Bieber'
];

const FR_ARTISTS = [
  'ZIAK','La Feve','LAYLOW','HAMZA','HOUDI','JOLAGREEN23',
  'DINOS','Damso','VALD','Zola','Alpha Wann','Kekra','Kerchak','PLK',
  'KLM','La Rvfleuze','La Mano 1.9','34MURPHY','63OG','OBOY',
  'Osirus Jack 667','Zuukou Mayzie 667','Menace Santana','Nono La Grinta',
  'SHERIFFLAZONE','YVNNIS','HUNTRILL','L2B','Cheu-B','Aya Nakamura'
];

/* ═══════════════════════════════════════════
   DATA  (f=fichier, a=artiste display, t=titre,
          al=album, y=annee, l=lyrique, lang=langue lyrique)
═══════════════════════════════════════════ */
const T = [
  {f:'34MURPHY - BB9E.m4a',a:'34MURPHY',t:'BB9E',al:null,y:null,l:null,lang:null},
  {f:'63OG - mes frères.m4a',a:'63OG',t:'Mes Freres',al:null,y:null,
   l:'Mes freres, on est restes soudes malgre tout',lang:'fr'},
  {f:'63OG - poukwa (elle m\'demande).m4a',a:'63OG',t:'Poukwa',al:null,y:null,l:null,lang:null},
  {f:'63OG feat. HLD - papier.m4a',a:'63OG',t:'Papier',al:null,y:null,l:null,lang:null},
  {f:'Alpha Wann x Nujabes - ÇA VA ENSEMBLE II (remix).m4a',a:'Alpha Wann',t:'Ca Va Ensemble II',al:null,y:null,l:null,lang:null},
  {f:'Aya Nakamura & La Rvfleuze - Sexy Nana.m4a',a:'Aya Nakamura',t:'Sexy Nana',al:null,y:null,l:null,lang:null},
  {f:'Cheu-B x Ghost Killer Track feat. SDM - Catalina.m4a',a:'Cheu-B',t:'Catalina',al:null,y:null,l:null,lang:null},
  {f:'DINOS feat. JOLAGREEN23 & LA MANO 1.9 - D BLOCK AFRIQUE.m4a',a:'DINOS',t:'D Block Afrique',al:null,y:null,
   l:"D-Block Afrique, on vient de loin pour etre la",lang:'fr'},
  {f:'Damso - Autotune.m4a',a:'Damso',t:'Autotune',al:null,y:null,l:null,lang:null},
  {f:'Damso - Γ. Mosaïque solitaire.m4a',a:'Damso',t:'Mosaique Solitaire',al:'Ipseite',y:2017,
   l:"J'ai laisse le coeur en vrac, t'as garde la cle",lang:'fr'},
  {f:'Dinos feat. Josman - Chelsea.m4a',a:'DINOS',t:'Chelsea',al:'Kintsugi',y:2024,l:null,lang:null},
  {f:'Don Toliver - NEW DROP.m4a',a:'Don Toliver',t:'New Drop',al:'Love Sick',y:2023,l:null,lang:null},
  {f:'Don Toliver feat. Justin Bieber & Future - Private Landing.m4a',a:'Don Toliver',t:'Private Landing',al:'Love Sick',y:2023,l:null,lang:null},
  {f:'Drake - Passionfruit.m4a',a:'Drake',t:'Passionfruit',al:'More Life',y:2017,
   l:"Passionate from miles away, passive love ain't working out",lang:'en'},
  {f:'Drake feat. Majid Jordan - Hold On We\'re Going Home.m4a',a:'Drake',t:"Hold On We're Going Home",al:'Nothing Was The Same',y:2013,
   l:"Baby you're not alone, 'cause you're here with me",lang:'en'},
  {f:'HAMZA - COME & SEE ME.m4a',a:'HAMZA',t:'Come & See Me',al:'Paradise',y:2019,
   l:"Come and see me where I'm at, j'ai tout prepare",lang:'fr'},
  {f:'HAMZA - OSCAR DE LA HOYA.m4a',a:'HAMZA',t:'Oscar De La Hoya',al:'Sincerement',y:2023,
   l:'Oscar de la Hoya, je frappe comme un boxeur en or',lang:'fr'},
  {f:'HOUDI - INTÉRIEUR.m4a',a:'HOUDI',t:'Interieur',al:null,y:null,
   l:"Mon interieur, c'est mon seul sanctuaire",lang:'fr'},
  {f:'HOUDI - PEINE.m4a',a:'HOUDI',t:'Peine',al:null,y:null,
   l:"J'ai trop de peine a cacher, je souris quand meme",lang:'fr'},
  {f:'HOUDI - SCORE.m4a',a:'HOUDI',t:'Score',al:'Hood Volume.1',y:2024,l:null,lang:null},
  {f:'HOUDI feat. FAVE - Pas les mots.m4a',a:'HOUDI',t:'Pas Les Mots',al:null,y:null,l:null,lang:null},
  {f:'HUNTRILL feat. ALPHA WANN & VEUST - TROIS SOLEILS.m4a',a:'HUNTRILL',t:'Trois Soleils',al:null,y:null,l:null,lang:null},
  {f:'JOLAGREEN23 - 12HEURES MINUIT.m4a',a:'JOLAGREEN23',t:'12 Heures Minuit',al:null,y:null,l:null,lang:null},
  {f:'JOLAGREEN23 - 360TRICKSHOT.m4a',a:'JOLAGREEN23',t:'360Trickshot',al:'RECHERCHE&DESTRUCTION',y:2023,l:null,lang:null},
  {f:'JOLAGREEN23 - APPEL D\'UN BRO.m4a',a:'JOLAGREEN23',t:"Appel D'Un Bro",al:null,y:null,
   l:"Appel d'un bro a trois heures du mat, je reponds toujours",lang:'fr'},
  {f:'JOLAGREEN23 - DRAGON2KOMODO.m4a',a:'JOLAGREEN23',t:'Dragon2Komodo',al:null,y:null,l:null,lang:null},
  {f:'JOLAGREEN23 - FOUTULESEUM.m4a',a:'JOLAGREEN23',t:'Foutuleseum',al:null,y:null,l:null,lang:null},
  {f:'JOLAGREEN23 - GANGTAKA.m4a',a:'JOLAGREEN23',t:'Gangtaka',al:'RECHERCHE&DESTRUCTION',y:2023,l:null,lang:null},
  {f:'JOLAGREEN23 - SMACKDOWN VS RAW2009.m4a',a:'JOLAGREEN23',t:'Smackdown vs Raw 2009',al:'+99XP',y:2024,l:null,lang:null},
  {f:'JOLAGREEN23 feat. BENNY THE BUTCHER - OKC.m4a',a:'JOLAGREEN23',t:'OKC',al:null,y:null,l:null,lang:null},
  {f:'Jay-Z - 4_44.m4a',a:'Jay-Z',t:'4:44',al:'4:44',y:2017,
   l:'I apologize, often womanize',lang:'en'},
  {f:'Jay-Z - Legacy.m4a',a:'Jay-Z',t:'Legacy',al:'4:44',y:2017,l:null,lang:null},
  {f:'Justin Bieber feat. Cash Cobain & Eddie Benjamin - SWAG.m4a',a:'Justin Bieber',t:'SWAG',al:null,y:null,l:null,lang:null},
  {f:'KLM - 777.m4a',a:'KLM',t:'777',al:null,y:null,l:null,lang:null},
  {f:'KLM - ECRAN PLAT.m4a',a:'KLM',t:'Ecran Plat',al:null,y:null,l:null,lang:null},
  {f:'Kekra feat. Alpha Wann & La Fève - Ingé son.m4a',a:'Kekra',t:'Inge Son',al:null,y:null,l:null,lang:null},
  {f:'Kerchak - Kerchak.m4a',a:'Kerchak',t:'Kerchak',al:null,y:null,l:null,lang:null},
  {f:'L2B feat. IDS & La Mano 1.9 - JUMP.m4a',a:'L2B',t:'Jump',al:null,y:null,l:null,lang:null},
  {f:'LA FÈVE - MAUVAIS PAYEUR.m4a',a:'La Feve',t:'Mauvais Payeur',al:'24',y:2023,
   l:"Mauvais payeur, j'paye en avance, c'est le paradoxe",lang:'fr'},
  {f:'LAYLOW - TRINITYVILLE.m4a',a:'LAYLOW',t:'Trinityville',al:'Trinity',y:2020,
   l:'Trinityville, personne ne dort, les lumieres restent allumees',lang:'fr'},
  {f:'LAYLOW feat. ALPHA WANN & WIT. - STUNTMEN.m4a',a:'LAYLOW',t:'Stuntmen',al:'Trinity',y:2020,
   l:'On a traverse le feu pour meriter le calme',lang:'fr'},
  {f:'La Fève - 24.m4a',a:'La Feve',t:'24',al:'24',y:2023,
   l:"J'ai vingt-quatre heures, j'ai que dalle",lang:'fr'},
  {f:'La Fève - HOMESTUDIO.m4a',a:'La Feve',t:'Homestudio',al:'24',y:2023,
   l:"Toutes mes nuits dans mon homestudio, c'est ma cathedrale",lang:'fr'},
  {f:'La Fève - LES SNITCH ET LES BITCH.m4a',a:'La Feve',t:'Les Snitch Et Les Bitch',al:null,y:null,l:null,lang:null},
  {f:'La Fève - LOYAL.m4a',a:'La Feve',t:'Loyal',al:'24',y:2023,
   l:"Loyal, je reste loyal meme quand c'est la tempete",lang:'fr'},
  {f:'La Fève - PETIT SEUM.m4a',a:'La Feve',t:'Petit Seum',al:null,y:null,l:null,lang:null},
  {f:'La Fève - SAMESHIT.m4a',a:'La Feve',t:'Same Shit',al:'24',y:2023,l:null,lang:null},
  {f:'La Mano 1.9 - Kilo.m4a',a:'La Mano 1.9',t:'Kilo',al:null,y:null,l:null,lang:null},
  {f:'La Mano 1.9 - No pain No Gain.m4a',a:'La Mano 1.9',t:'No Pain No Gain',al:null,y:null,l:null,lang:null},
  {f:'La Rvfleuze - 312-391.m4a',a:'La Rvfleuze',t:'312-391',al:null,y:null,l:null,lang:null},
  {f:'La Rvfleuze - FITNESS PARK.m4a',a:'La Rvfleuze',t:'Fitness Park',al:null,y:null,l:null,lang:null},
  {f:'La Rvfleuze - PARLU.m4a',a:'La Rvfleuze',t:'Parlu',al:null,y:null,l:null,lang:null},
  {f:'Latto - Blick Sum.m4a',a:'Latto',t:'Blick Sum',al:null,y:null,l:null,lang:null},
  {f:'Lil Tecca - 120.m4a',a:'Lil Tecca',t:'120',al:'We Love You Tecca',y:2019,
   l:"I got racks inside my bag, I been moving like I'm lit",lang:'en'},
  {f:'Lil Tecca - Dark Thoughts.m4a',a:'Lil Tecca',t:'Dark Thoughts',al:null,y:null,l:null,lang:null},
  {f:'Lil Yachty feat. Playboi Carti - Get Dripped.m4a',a:'Lil Yachty',t:'Get Dripped',al:null,y:null,l:null,lang:null},
  {f:'Menace Santana - Freestyle Boosk\'Halloween.m4a',a:'Menace Santana',t:"Freestyle Boosk'Halloween",al:null,y:null,l:null,lang:null},
  {f:'Metro Boomin feat. Travis Scott & Young Thug - Trance.m4a',a:'Metro Boomin',t:'Trance',al:'Heroes & Villains',y:2022,
   l:"You know I'm in a trance, I can't feel my face",lang:'en'},
  {f:'Nono La Grinta - FLASH-BACK.m4a',a:'Nono La Grinta',t:'Flash-Back',al:null,y:null,l:null,lang:null},
  {f:'Nono La Grinta - LOVE YOU.m4a',a:'Nono La Grinta',t:'Love You',al:null,y:null,l:null,lang:null},
  {f:'OBOY feat. 1PLIKE140 - Maybach.m4a',a:'OBOY',t:'Maybach',al:null,y:null,l:null,lang:null},
  {f:'OBOY feat. Josman - Joddy Boy.m4a',a:'OBOY',t:'Joddy Boy',al:null,y:null,l:null,lang:null},
  {f:'OBOY feat. SCH - Saint Laurent.m4a',a:'OBOY',t:'Saint Laurent',al:null,y:null,l:null,lang:null},
  {f:'Osirus Jack 667 feat. Freeze Corleone 667 - Lampadaire Pt.2.m4a',a:'Osirus Jack 667',t:'Lampadaire Pt.2',al:null,y:null,
   l:'Sous les lampadaires, on compte nos cicatrices',lang:'fr'},
  {f:'PLK - Nouvelles.m4a',a:'PLK',t:'Nouvelles',al:null,y:null,
   l:'Donne-moi de tes nouvelles, ca fait longtemps',lang:'fr'},
  {f:'PinkPantheress - Tonight.m4a',a:'PinkPantheress',t:'Tonight',al:null,y:null,
   l:"Tonight, I could be your lover if you let me",lang:'en'},
  {f:'Playboi Carti - HBA.m4a',a:'Playboi Carti',t:'HBA',al:'Die Lit',y:2018,l:null,lang:null},
  {f:'Playboi Carti - Magnolia.m4a',a:'Playboi Carti',t:'Magnolia',al:'Die Lit',y:2018,
   l:"Woah, I been livin' like a rockstar",lang:'en'},
  {f:'Playboi Carti feat. Kendrick Lamar - GOOD CREDIT.m4a',a:'Playboi Carti',t:'Good Credit',al:'Whole Lotta Red',y:2020,l:null,lang:null},
  {f:'Playboi Carti feat. Skepta - TOXIC.m4a',a:'Playboi Carti',t:'Toxic',al:'Whole Lotta Red',y:2020,l:null,lang:null},
  {f:'Playboi Carti feat. The Weeknd - RATHER LIE.m4a',a:'Playboi Carti',t:'Rather Lie',al:'Whole Lotta Red',y:2020,l:null,lang:null},
  {f:'SHERIFFLAZONE - SHINE.m4a',a:'SHERIFFLAZONE',t:'Shine',al:null,y:null,l:null,lang:null},
  {f:'Sherifflazone - NO BAP.m4a',a:'SHERIFFLAZONE',t:'No Bap',al:null,y:null,l:null,lang:null},
  {f:'Snoop Dogg - Gin and Juice.m4a',a:'Snoop Dogg',t:'Gin and Juice',al:'Doggystyle',y:1993,
   l:'Rolling down the street, smoking indo, sipping on gin and juice',lang:'en'},
  {f:'Snoop Dogg - Who Am I (What\'s My Name).m4a',a:'Snoop Dogg',t:"Who Am I?",al:'Doggystyle',y:1993,
   l:'Bow wow wow yippee yo yippee yay, who am I?',lang:'en'},
  {f:'The Weeknd - After Hours.m4a',a:'The Weeknd',t:'After Hours',al:'After Hours',y:2020,
   l:"After all these years, I'm right back where I started",lang:'en'},
  {f:'Tory Lanez - The Color Violet.m4a',a:'Tory Lanez',t:'The Color Violet',al:null,y:null,
   l:'I watched the sky turn violet through my window at night',lang:'en'},
  {f:'Travis Scott feat. Bad Bunny & The Weeknd - K-POP.m4a',a:'Travis Scott',t:'K-POP',al:'UTOPIA',y:2023,
   l:"It's a celebration, yeah, yeah",lang:'en'},
  {f:'Travis Scott feat. Young Thug & M.I.A. - FRANCHISE.m4a',a:'Travis Scott',t:'FRANCHISE',al:null,y:null,
   l:"Yeah, franchise, been the franchise from day one",lang:'en'},
  {f:'VALD - Réflexions basses.m4a',a:'VALD',t:'Reflexions Basses',al:'Ce monde est cruel',y:2019,
   l:'Les reflexions basses qui traversent ma tete la nuit',lang:'fr'},
  {f:'Vald feat. Damso - Vitrine.m4a',a:'VALD',t:'Vitrine',al:'Agartha',y:2017,
   l:'Je me deguise pour paraitre beau dans ta vitrine',lang:'fr'},
  {f:'YVNNIS - DONOTDISTURB.m4a',a:'YVNNIS',t:'Do Not Disturb',al:null,y:null,l:null,lang:null},
  {f:'ZIAK - CATWALK.m4a',a:'ZIAK',t:'Catwalk',al:'Chrome',y:2023,
   l:"Je defile en catwalk, c'est ma fashion week",lang:'fr'},
  {f:'ZIAK - Garçons de café.m4a',a:'ZIAK',t:'Garcons De Cafe',al:'Chrome',y:2023,l:null,lang:null},
  {f:'ZIAK - Grabba.m4a',a:'ZIAK',t:'Grabba',al:null,y:null,
   l:"Grabba, j'attrape tout ce qui passe",lang:'fr'},
  {f:'ZIAK - La nuit.m4a',a:'ZIAK',t:'La Nuit',al:null,y:null,l:null,lang:null},
  {f:'ZIAK - Le crime parfait.m4a',a:'ZIAK',t:'Le Crime Parfait',al:'Chrome',y:2023,l:null,lang:null},
  {f:'ZIAK - Même pas un grincement.m4a',a:'ZIAK',t:'Meme Pas Un Grincement',al:'Akimbo',y:2021,l:null,lang:null},
  {f:'ZIAK feat. JOSMAN - Room.m4a',a:'ZIAK',t:'Room',al:'Chrome',y:2023,l:null,lang:null},
  {f:'ZIAK feat. ZEU - Zulu.m4a',a:'ZIAK',t:'Zulu',al:'Akimbo',y:2021,l:null,lang:null},
  {f:'Ziak - Akimbo.m4a',a:'ZIAK',t:'Akimbo',al:'Akimbo',y:2021,
   l:"En akimbo, les mains sur les hanches, j'pose mes yeux sur toi",lang:'fr'},
  {f:'Ziak - Bad Bad.m4a',a:'ZIAK',t:'Bad Bad',al:'Akimbo',y:2021,l:null,lang:null},
  {f:'Ziak - Chrome.m4a',a:'ZIAK',t:'Chrome',al:'Chrome',y:2023,
   l:"Chrome, ca brille, j'avance en chrome",lang:'fr'},
  {f:'Ziak - Lieu & heure.m4a',a:'ZIAK',t:'Lieu & Heure',al:null,y:null,l:null,lang:null},
  {f:'Ziak feat. Kaaris - Rien ne se remplace.m4a',a:'ZIAK',t:'Rien Ne Se Remplace',al:null,y:null,l:null,lang:null},
  {f:'Zola - Belles Femmes.m4a',a:'Zola',t:'Belles Femmes',al:null,y:null,l:null,lang:null},
  {f:'Zola - California Girl.m4a',a:'Zola',t:'California Girl',al:null,y:null,l:null,lang:null},
  {f:'Zola - Honey.m4a',a:'Zola',t:'Honey',al:'Cicatrices',y:2019,l:null,lang:null},
  {f:'Zola - Zolabeille.m4a',a:'Zola',t:'Zolabeille',al:null,y:null,l:null,lang:null},
  {f:'Zuukou Mayzie 667 feat. Freeze Corleone 667 - Spiderman-Venom.m4a',a:'Zuukou Mayzie 667',t:'Spiderman-Venom',al:null,y:null,
   l:"Spider-Man, c'est moi, Venom c'est mon frere de sang",lang:'fr'},
];

const classicPool = T;
const lyricsPool  = T.filter(x => x.l);
const albumPool   = T.filter(x => x.al);

/* ═══════════════════════════════════════════
   DOM
═══════════════════════════════════════════ */
const OVERLAY   = document.getElementById('gameOverlay');
const P_MODES   = document.getElementById('gPanelStart');
const P_GAME    = document.getElementById('gPanelGame');
const P_OVER    = document.getElementById('gPanelOver');
const BTN_QUIT  = document.getElementById('gBtnQuit');
const BTN_RETRY = document.getElementById('gBtnRetry');
const BTN_MODES = document.getElementById('btBtnModes');
const BTN_QUIT2 = document.getElementById('btBtnQuit');
const OPEN_BTN  = document.getElementById('physicsBtn');  // null in standalone
const Q_WRAP    = document.getElementById('btQuestionWrap');
const CHOICES   = document.getElementById('btChoices');
const SCORE_EL  = document.getElementById('btScoreNum');
const ROUND_LBL = document.getElementById('btRoundLbl');
const PROG_FILL = document.getElementById('btProgFill');
const TIMER_W   = document.getElementById('btTimerWrap');
const TIMER_B   = document.getElementById('btTimerBar');
const FEEDBACK  = document.getElementById('btFeedback');
const FB_TEXT   = document.getElementById('btFeedbackText');
const NEXT_BTN  = document.getElementById('btNext');
const FINAL_SC  = document.getElementById('gFinalScore');
const RECAP_EL  = document.getElementById('btRecap');

const STANDALONE = !OPEN_BTN;
const BASE       = window.location.pathname.includes('/projets/') ? '../' : '';
const TIMER_MS   = 15000;

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
let mode     = null;
let rounds   = [];
let ridx     = 0;
let score    = 0;
let answers  = [];
let answered = false;
let timerRAF = null;
let timerEnd = 0;
let audioEl  = null;
let waveRAF  = null;
let currentVol = 0.8;

/* ═══════════════════════════════════════════
   UTILS
═══════════════════════════════════════════ */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = 0 | (Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Choix avec biais de langue pour le mode paroles */
function pick4(correct, lang) {
  if (!lang) {
    // Classic / Album : tirage aleatoire dans le pool global
    const wrong = shuffle(ARTISTS.filter(a => a !== correct)).slice(0, 3);
    return shuffle([correct, ...wrong]);
  }
  // Lyrics : 2 artistes de la meme langue + 1 de l'autre (piege)
  const samePool = (lang === 'en' ? EN_ARTISTS : FR_ARTISTS).filter(a => a !== correct);
  const diffPool = (lang === 'en' ? FR_ARTISTS : EN_ARTISTS).filter(a => a !== correct);
  const wrong = [...shuffle(samePool).slice(0, 2), ...shuffle(diffPool).slice(0, 1)];
  return shuffle([correct, ...wrong]);
}

/* Albums uniques dans une meme partie */
function pickRounds(pool) {
  const s = shuffle(pool);
  if (mode !== 'album') return s.slice(0, 5);
  const seen = new Set();
  const out  = [];
  for (const tr of s) {
    if (!seen.has(tr.al)) { seen.add(tr.al); out.push(tr); }
    if (out.length === 5) break;
  }
  return out.length >= 5 ? out : s.slice(0, 5);
}

/* ═══════════════════════════════════════════
   ECRANS
═══════════════════════════════════════════ */
function showScreen(id) {
  P_MODES.style.display = 'none';
  P_GAME.style.display  = 'none';
  P_OVER.style.display  = 'none';
  document.getElementById(id).style.display = 'flex';
}

/* ═══════════════════════════════════════════
   OPEN / CLOSE
═══════════════════════════════════════════ */
function openGame() {
  OVERLAY.style.display = 'flex';
  stopAudio();
  clearTimer();
  showScreen('gPanelStart');
}

function closeGame() {
  stopAudio();
  clearTimer();
  stopWave();
  if (STANDALONE) {
    if (window.history.length > 1) window.history.back();
    else window.location.href = './';
  } else {
    OVERLAY.style.display = 'none';
  }
}

/* ═══════════════════════════════════════════
   GAME START
═══════════════════════════════════════════ */
function startGame(m) {
  mode    = m;
  ridx    = 0;
  score   = 0;
  answers = [];

  const pool = m === 'lyrics' ? lyricsPool : m === 'album' ? albumPool : classicPool;
  rounds = pickRounds(pool.length >= 5 ? pool : classicPool);

  SCORE_EL.textContent = '0';
  showScreen('gPanelGame');
  renderRound();
}

/* ═══════════════════════════════════════════
   ROUND
═══════════════════════════════════════════ */
function renderRound() {
  answered = false;
  stopAudio();
  clearTimer();
  NEXT_BTN.style.display = 'none';
  FEEDBACK.className     = 'bt-feedback';

  const tr   = rounds[ridx];
  const lang = mode === 'lyrics' ? tr.lang : null;
  const ch   = pick4(tr.a, lang);

  ROUND_LBL.textContent = ridx + 1 + ' / 5';
  PROG_FILL.style.width = (ridx / 5 * 100) + '%';

  if (mode === 'classic') {
    renderClassic();
    TIMER_W.style.display = 'block';
    setTimeout(() => {
      playAudio(tr);
      startTimer(() => autoWrong(tr));
    }, 500);
  } else {
    mode === 'lyrics' ? renderLyrics(tr) : renderAlbum(tr);
    TIMER_W.style.display = 'none';
  }

  renderChoices(ch, tr.a);
}

function renderClassic() {
  Q_WRAP.innerHTML =
    '<div class="bt-classic-inner">' +
      '<span class="bt-q-label">QUI CHANTE CE SON ?</span>' +
      '<div class="bt-waveform" id="btWaveform">' +
        '<div class="bt-wave-bar"></div>'.repeat(28) +
      '</div>' +
      '<div class="bt-vol-wrap">' +
        '<span class="bt-vol-icon">&#128266;</span>' +
        '<input type="range" class="bt-vol-slider" id="btVolSlider" min="0" max="1" step="0.02" value="' + currentVol + '">' +
        '<span class="bt-vol-icon">&#128266;</span>' +
      '</div>' +
    '</div>';

  startWave();

  const sl = document.getElementById('btVolSlider');
  if (sl) sl.addEventListener('input', function () {
    currentVol = parseFloat(this.value);
    if (audioEl) audioEl.volume = currentVol;
  });
}

function renderLyrics(tr) {
  Q_WRAP.innerHTML =
    '<div class="bt-lyric-inner">' +
      '<span class="bt-q-label">QUI A DIT CA ?</span>' +
      '<div class="bt-lyric-card">' +
        '<span class="bt-quote">&#10077;</span>' +
        '<p class="bt-lyric-text">' + tr.l + '</p>' +
        '<span class="bt-quote bt-quote-end">&#10078;</span>' +
      '</div>' +
    '</div>';
}

function renderAlbum(tr) {
  Q_WRAP.innerHTML =
    '<div class="bt-album-inner">' +
      '<span class="bt-q-label">QUI A CREE CET ALBUM ?</span>' +
      '<div class="bt-album-card">' +
        '<span class="bt-album-icon">&#128191;</span>' +
        '<p class="bt-album-name">' + tr.al + '</p>' +
        (tr.y ? '<span class="bt-album-year">' + tr.y + '</span>' : '') +
      '</div>' +
    '</div>';
}

function renderChoices(ch, correct) {
  CHOICES.innerHTML = '';
  ch.forEach(function (artist) {
    const btn = document.createElement('button');
    btn.className   = 'bt-choice-btn';
    btn.textContent = artist;
    btn.dataset.a   = artist;
    btn.addEventListener('click', function () { onAnswer(artist, correct); });
    CHOICES.appendChild(btn);
  });
}

/* ═══════════════════════════════════════════
   REPONSE
═══════════════════════════════════════════ */
function onAnswer(chosen, correct) {
  if (answered) return;
  answered = true;
  stopAudio();
  clearTimer();

  const ok   = chosen === correct;
  const tr   = rounds[ridx];
  if (ok) score++;
  SCORE_EL.textContent = score;
  answers.push({ tr, correct, chosen, ok });

  revealChoices(chosen, correct);

  // Mode paroles : afficher aussi le titre de la chanson
  const songHint = mode === 'lyrics' ? '  —  ' + tr.t : '';
  FB_TEXT.textContent = ok
    ? '✓ BONNE REPONSE !' + songHint
    : '✗ C\'etait ' + correct + songHint;
  FEEDBACK.className = 'bt-feedback bt--visible ' + (ok ? 'bt--correct' : 'bt--wrong');

  setTimeout(function () { NEXT_BTN.style.display = 'block'; }, 700);
}

function autoWrong(tr) {
  if (answered) return;
  answered = true;
  stopAudio();
  answers.push({ tr, correct: tr.a, chosen: null, ok: false });
  CHOICES.querySelectorAll('.bt-choice-btn').forEach(function (b) {
    b.disabled = true;
    if (b.dataset.a === tr.a) b.classList.add('bt--correct');
  });
  const songHint = mode === 'lyrics' ? '  —  ' + tr.t : '';
  FB_TEXT.textContent = '⏱ Trop lent ! ' + tr.a + songHint;
  FEEDBACK.className  = 'bt-feedback bt--visible bt--wrong';
  setTimeout(function () { NEXT_BTN.style.display = 'block'; }, 700);
}

function revealChoices(chosen, correct) {
  CHOICES.querySelectorAll('.bt-choice-btn').forEach(function (b) {
    b.disabled = true;
    if (b.dataset.a === correct) b.classList.add('bt--correct');
    else if (b.dataset.a === chosen) b.classList.add('bt--wrong');
  });
}

/* ═══════════════════════════════════════════
   SUIVANT / RECAP
═══════════════════════════════════════════ */
function nextRound() {
  ridx++;
  if (ridx >= 5) { showRecap(); return; }
  stopWave();
  P_GAME.style.opacity = '0';
  setTimeout(function () { P_GAME.style.opacity = '1'; renderRound(); }, 180);
}

function showRecap() {
  stopWave();
  PROG_FILL.style.width = '100%';
  var emoji = score === 5 ? '⭐' : score >= 4 ? '🎯' : score >= 2 ? '💡' : '😔';
  FINAL_SC.textContent = emoji + ' ' + score + ' / 5';
  RECAP_EL.innerHTML = answers.map(function (a) {
    return '<div class="bt-rec-row ' + (a.ok ? 'bt--correct' : 'bt--wrong') + '">' +
      '<span class="bt-rec-icon">' + (a.ok ? '✓' : '✗') + '</span>' +
      '<span class="bt-rec-artist">' + a.correct + '</span>' +
      '<span class="bt-rec-track">' + a.tr.t + '</span>' +
    '</div>';
  }).join('');
  showScreen('gPanelOver');
}

/* ═══════════════════════════════════════════
   AUDIO
═══════════════════════════════════════════ */
function playAudio(tr) {
  stopAudio();
  var audio    = new Audio();
  audio.src    = BASE + 'medias/radio%20musique/' + encodeURIComponent(tr.f);
  audio.volume = currentVol;
  audio.addEventListener('loadedmetadata', function () {
    var maxStart = Math.max(0, Math.min(audio.duration * 0.4, audio.duration - 20));
    audio.currentTime = Math.random() * maxStart;
    audio.play().catch(function () {});
  });
  audio.load();
  audioEl = audio;
}

function stopAudio() {
  if (!audioEl) return;
  audioEl.pause();
  audioEl.src = '';
  audioEl = null;
}

/* ═══════════════════════════════════════════
   TIMER
═══════════════════════════════════════════ */
function startTimer(onEnd) {
  timerEnd = performance.now() + TIMER_MS;
  TIMER_B.style.transition = 'none';
  TIMER_B.style.width = '100%';
  function tick() {
    var rem = Math.max(0, timerEnd - performance.now());
    var pct = rem / TIMER_MS;
    TIMER_B.style.transition = '';
    TIMER_B.style.width = (pct * 100) + '%';
    TIMER_B.style.background = pct > 0.5 ? 'var(--apricot)' : pct > 0.25 ? '#ffaa44' : '#ff5566';
    if (rem <= 0) { onEnd(); return; }
    timerRAF = requestAnimationFrame(tick);
  }
  timerRAF = requestAnimationFrame(tick);
}

function clearTimer() {
  if (timerRAF) { cancelAnimationFrame(timerRAF); timerRAF = null; }
  TIMER_B.style.transition = 'none';
  TIMER_B.style.width = '0%';
}

/* ═══════════════════════════════════════════
   WAVEFORM
═══════════════════════════════════════════ */
function startWave() {
  stopWave();
  var t = 0;
  function tick() {
    var bars = document.querySelectorAll('.bt-wave-bar');
    if (!bars.length) { waveRAF = null; return; }
    t += 0.05;
    bars.forEach(function (b, i) {
      var h = 6
        + Math.abs(Math.sin(t * 1.8 + i * 0.38)) * 22
        + Math.abs(Math.sin(t * 3.1 + i * 0.71)) * 14;
      b.style.height = h.toFixed(1) + 'px';
    });
    waveRAF = requestAnimationFrame(tick);
  }
  tick();
}

function stopWave() {
  if (waveRAF) { cancelAnimationFrame(waveRAF); waveRAF = null; }
}

/* ═══════════════════════════════════════════
   EVENTS
═══════════════════════════════════════════ */
if (STANDALONE) {
  openGame();
} else {
  OPEN_BTN.addEventListener('click', openGame);
}

BTN_QUIT.addEventListener('click', closeGame);
BTN_RETRY.addEventListener('click', function () { startGame(mode); });
BTN_MODES.addEventListener('click', function () { stopAudio(); stopWave(); showScreen('gPanelStart'); });
BTN_QUIT2.addEventListener('click', closeGame);
NEXT_BTN.addEventListener('click', nextRound);

document.querySelectorAll('.bt-mode-card').forEach(function (btn) {
  btn.addEventListener('click', function () { startGame(btn.dataset.mode); });
});

})();
