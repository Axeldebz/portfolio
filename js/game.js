(function () {
'use strict';

/* ═══════════════════════════════════════════
   ARTIST POOLS — pour biais de langue
═══════════════════════════════════════════ */
var ARTISTS = [
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
var EN_ARTISTS = [
  'Drake','Jay-Z','Snoop Dogg','The Weeknd','Travis Scott',
  'Playboi Carti','Don Toliver','Metro Boomin','Lil Tecca','Lil Yachty',
  'PinkPantheress','Latto','Tory Lanez','Justin Bieber'
];
var FR_ARTISTS = [
  'ZIAK','La Feve','LAYLOW','HAMZA','HOUDI','JOLAGREEN23',
  'DINOS','Damso','VALD','Zola','Alpha Wann','Kekra','Kerchak','PLK',
  'KLM','La Rvfleuze','La Mano 1.9','34MURPHY','63OG','OBOY',
  'Osirus Jack 667','Zuukou Mayzie 667','Menace Santana','Nono La Grinta',
  'SHERIFFLAZONE','YVNNIS','HUNTRILL','L2B','Cheu-B','Aya Nakamura'
];

/* ═══════════════════════════════════════════
   DATA
   f=fichier  a=artiste  t=titre  al=album  y=annee
   l=parole   lang=langue ('fr'|'en')
   Regle : le texte de l ne doit jamais contenir les mots du titre t
═══════════════════════════════════════════ */
var T = [
  /* ── 34MURPHY ─────────────────────────────────────────────────── */
  {f:'34MURPHY - BB9E.m4a',a:'34MURPHY',t:'BB9E',al:null,y:null,
   l:"Je suis la depuis le debut, j'ai pas attendu qu'on me valide",lang:'fr'},

  /* ── 63OG ──────────────────────────────────────────────────────── */
  {f:'63OG - mes frères.m4a',a:'63OG',t:'Mes Freres',al:null,y:null,
   l:"On reste soudes quoi qu'il arrive, la famille avant tout le reste",lang:'fr'},
  {f:'63OG - poukwa (elle m\'demande).m4a',a:'63OG',t:'Poukwa',al:null,y:null,
   l:"Elle veut savoir pourquoi je rentre si tard le soir",lang:'fr'},
  {f:'63OG feat. HLD - papier.m4a',a:'63OG',t:'Papier',al:null,y:null,
   l:"J'ai pas signe mais ma signature vaut deja de l'or",lang:'fr'},

  /* ── Alpha Wann ─────────────────────────────────────────────────── */
  {f:'Alpha Wann x Nujabes - ÇA VA ENSEMBLE II (remix).m4a',a:'Alpha Wann',t:'Ca Va Ensemble II',al:null,y:null,
   l:"Le flow et le beat se trouvent, ils etaient faits l'un pour l'autre",lang:'fr'},

  /* ── Aya Nakamura ───────────────────────────────────────────────── */
  {f:'Aya Nakamura & La Rvfleuze - Sexy Nana.m4a',a:'Aya Nakamura',t:'Sexy Nana',al:null,y:null,
   l:"Elle a l'attitude, elle a les moves, tout le monde se retourne",lang:'fr'},

  /* ── Cheu-B ─────────────────────────────────────────────────────── */
  {f:'Cheu-B x Ghost Killer Track feat. SDM - Catalina.m4a',a:'Cheu-B',t:'Catalina',al:null,y:null,
   l:"Direction le soleil, on laisse la grisaille bien derriere nous",lang:'fr'},

  /* ── DINOS ──────────────────────────────────────────────────────── */
  {f:'DINOS feat. JOLAGREEN23 & LA MANO 1.9 - D BLOCK AFRIQUE.m4a',a:'DINOS',t:'D Block Afrique',al:'Kintsugi',y:2024,
   l:"On porte le nom de nos rues partout ou l'on va, fier de nos origines",lang:'fr'},
  {f:'Dinos feat. Josman - Chelsea.m4a',a:'DINOS',t:'Chelsea',al:'Kintsugi',y:2024,
   l:"Dans ce coin de Londres, on a grave nos noms dans la pierre",lang:'fr'},

  /* ── Damso ──────────────────────────────────────────────────────── */
  {f:'Damso - Autotune.m4a',a:'Damso',t:'Autotune',al:null,y:null,
   l:"Peu importe le traitement que tu fais subir a ma voix, c'est moi",lang:'fr'},
  {f:'Damso - Γ. Mosaïque solitaire.m4a',a:'Damso',t:'Mosaique Solitaire',al:'Ipseite',y:2017,
   l:"J'ai laisse le coeur en vrac, t'as garde la cle sans le savoir",lang:'fr'},

  /* ── Don Toliver ─────────────────────────────────────────────────── */
  {f:'Don Toliver - NEW DROP.m4a',a:'Don Toliver',t:'New Drop',al:'Love Sick',y:2023,
   l:"Everything fresh, I keep it new like the morning air around me",lang:'en'},
  {f:'Don Toliver feat. Justin Bieber & Future - Private Landing.m4a',a:'Don Toliver',t:'Private Landing',al:'Love Sick',y:2023,
   l:"Touch down somewhere no one knows we're coming, just you and me",lang:'en'},

  /* ── Drake ──────────────────────────────────────────────────────── */
  {f:'Drake - Passionfruit.m4a',a:'Drake',t:'Passionfruit',al:'More Life',y:2017,
   l:"Distant from the ones I love and I hope they know it",lang:'en'},
  {f:'Drake feat. Majid Jordan - Hold On We\'re Going Home.m4a',a:'Drake',t:"Hold On We're Going Home",al:'Nothing Was The Same',y:2013,
   l:"I got a good girl and she's worth every mile",lang:'en'},

  /* ── HAMZA ──────────────────────────────────────────────────────── */
  {f:'HAMZA - COME & SEE ME.m4a',a:'HAMZA',t:'Come & See Me',al:null,y:null,
   l:"J'ai tout prepare, les lumieres sont allumees, j'attends juste toi",lang:'fr'},
  {f:'HAMZA - OSCAR DE LA HOYA.m4a',a:'HAMZA',t:'Oscar De La Hoya',al:null,y:null,
   l:"Je frappe avec precision comme un champion en fin de carriere",lang:'fr'},

  /* ── HOUDI ──────────────────────────────────────────────────────── */
  {f:'HOUDI - INTÉRIEUR.m4a',a:'HOUDI',t:'Interieur',al:null,y:null,
   l:"C'est la que je me ressource, personne ne peut entrer dans cet endroit",lang:'fr'},
  {f:'HOUDI - PEINE.m4a',a:'HOUDI',t:'Peine',al:null,y:null,
   l:"Je souris pour les autres mais la nuit j'affronte ca tout seul",lang:'fr'},
  {f:'HOUDI - SCORE.m4a',a:'HOUDI',t:'Score',al:null,y:null,
   l:"Je compte mes victoires une a une, chaque point compte dans ce jeu",lang:'fr'},
  {f:'HOUDI feat. FAVE - Pas les mots.m4a',a:'HOUDI',t:'Pas Les Mots',al:null,y:null,
   l:"Il y a des choses qu'on ressent mais qu'on n'arrive pas a dire",lang:'fr'},

  /* ── HUNTRILL ───────────────────────────────────────────────────── */
  {f:'HUNTRILL feat. ALPHA WANN & VEUST - TROIS SOLEILS.m4a',a:'HUNTRILL',t:'Trois Soleils',al:null,y:null,
   l:"Des etoiles qui brillent ensemble, le ciel nous appartient ce soir",lang:'fr'},

  /* ── JOLAGREEN23 ────────────────────────────────────────────────── */
  {f:'JOLAGREEN23 - 12HEURES MINUIT.m4a',a:'JOLAGREEN23',t:'12 Heures Minuit',al:null,y:null,
   l:"A l'heure pile ou la ville change de visage, je commence ma session",lang:'fr'},
  {f:'JOLAGREEN23 - 360TRICKSHOT.m4a',a:'JOLAGREEN23',t:'360Trickshot',al:'+99XP',y:2024,
   l:"Je vise et j'atteins ma cible au premier essai, sans hesiter",lang:'fr'},
  {f:'JOLAGREEN23 - APPEL D\'UN BRO.m4a',a:'JOLAGREEN23',t:"Appel D'Un Bro",al:null,y:null,
   l:"Trois heures du mat, mon telephone sonne, je reponds toujours present",lang:'fr'},
  {f:'JOLAGREEN23 - DRAGON2KOMODO.m4a',a:'JOLAGREEN23',t:'Dragon2Komodo',al:null,y:null,
   l:"Lent mais mortel, je patiente avant de frapper au moment precis",lang:'fr'},
  {f:'JOLAGREEN23 - FOUTULESEUM.m4a',a:'JOLAGREEN23',t:'Foutuleseum',al:null,y:null,
   l:"Tout le monde est alle voir ailleurs, moi je suis reste dans ma zone",lang:'fr'},
  {f:'JOLAGREEN23 - GANGTAKA.m4a',a:'JOLAGREEN23',t:'Gangtaka',al:null,y:null,
   l:"On reste serre quoi qu'il arrive, c'est la regle depuis le depart",lang:'fr'},
  {f:'JOLAGREEN23 - SMACKDOWN VS RAW2009.m4a',a:'JOLAGREEN23',t:'Smackdown vs Raw 2009',al:'+99XP',y:2024,
   l:"Je me bats comme a l'epoque ou les jeux de catch etaient tout pour moi",lang:'fr'},
  {f:'JOLAGREEN23 feat. BENNY THE BUTCHER - OKC.m4a',a:'JOLAGREEN23',t:'OKC',al:null,y:null,
   l:"Je joue en dehors du tableau, style different de tous les autres",lang:'fr'},

  /* ── Jay-Z ──────────────────────────────────────────────────────── */
  {f:'Jay-Z - 4_44.m4a',a:'Jay-Z',t:'4:44',al:'4:44',y:2017,
   l:"I apologize, often womanize, took for my child to be born to see through a woman's eyes",lang:'en'},
  {f:'Jay-Z - Legacy.m4a',a:'Jay-Z',t:'Legacy',al:'4:44',y:2017,
   l:"What I leave behind will outlast anything I could buy today",lang:'en'},

  /* ── Justin Bieber ──────────────────────────────────────────────── */
  {f:'Justin Bieber feat. Cash Cobain & Eddie Benjamin - SWAG.m4a',a:'Justin Bieber',t:'SWAG',al:null,y:null,
   l:"I got the feeling, everything about me's different from the rest",lang:'en'},

  /* ── KLM ────────────────────────────────────────────────────────── */
  {f:'KLM - 777.m4a',a:'KLM',t:'777',al:null,y:null,
   l:"Tout s'aligne enfin dans ma vie, le bon moment au bon endroit",lang:'fr'},
  {f:'KLM - ECRAN PLAT.m4a',a:'KLM',t:'Ecran Plat',al:null,y:null,
   l:"La tele allumee mais je regarde rien, perdu dans mes propres pensees",lang:'fr'},

  /* ── Kekra ──────────────────────────────────────────────────────── */
  {f:'Kekra feat. Alpha Wann & La Fève - Ingé son.m4a',a:'Kekra',t:'Inge Son',al:null,y:null,
   l:"Le son est travaille au detail, chaque frequence a sa place exacte",lang:'fr'},

  /* ── Kerchak ────────────────────────────────────────────────────── */
  {f:'Kerchak - Kerchak.m4a',a:'Kerchak',t:'Kerchak',al:null,y:null,
   l:"Je domine mon territoire, personne ne remet ca en question depuis le debut",lang:'fr'},

  /* ── L2B ────────────────────────────────────────────────────────── */
  {f:'L2B feat. IDS & La Mano 1.9 - JUMP.m4a',a:'L2B',t:'Jump',al:null,y:null,
   l:"On saute sans filet, on fait confiance a ce qu'on a construit ensemble",lang:'fr'},

  /* ── La Feve ─────────────────────────────────────────────────────── */
  {f:'LA FÈVE - MAUVAIS PAYEUR.m4a',a:'La Feve',t:'Mauvais Payeur',al:null,y:null,
   l:"Je rends toujours ce que je dois avant l'echeance, c'est dans ma nature",lang:'fr'},
  {f:'La Fève - 24.m4a',a:'La Feve',t:'24',al:'24',y:2023,
   l:"La montre tourne, j'ai pas de temps a perdre avec des gens qui doutent",lang:'fr'},
  {f:'La Fève - HOMESTUDIO.m4a',a:'La Feve',t:'Homestudio',al:'24',y:2023,
   l:"Quatre murs, un micro, c'est la que je construis tout ce que je suis",lang:'fr'},
  {f:'La Fève - LES SNITCH ET LES BITCH.m4a',a:'La Feve',t:'Les Snitch Et Les Bitch',al:null,y:null,
   l:"Ceux qui trahissent n'ont plus leur place dans mon entourage depuis longtemps",lang:'fr'},
  {f:'La Fève - LOYAL.m4a',a:'La Feve',t:'Loyal',al:'24',y:2023,
   l:"Je reste fidele a ceux qui ont cru en moi quand personne ne regardait",lang:'fr'},
  {f:'La Fève - PETIT SEUM.m4a',a:'La Feve',t:'Petit Seum',al:null,y:null,
   l:"Ca m'enerve un peu mais je reste calme, j'ai appris a gerer ca",lang:'fr'},
  {f:'La Fève - SAMESHIT.m4a',a:'La Feve',t:'Same Shit',al:'24',y:2023,
   l:"Tous les jours le meme combat avec la meme energie intacte",lang:'fr'},

  /* ── La Mano 1.9 ────────────────────────────────────────────────── */
  {f:'La Mano 1.9 - Kilo.m4a',a:'La Mano 1.9',t:'Kilo',al:null,y:null,
   l:"Je mets tout ce que j'ai dans chaque projet, au detail pres",lang:'fr'},
  {f:'La Mano 1.9 - No pain No Gain.m4a',a:'La Mano 1.9',t:'No Pain No Gain',al:null,y:null,
   l:"Rien ne s'obtient sans effort, c'est la loi qui ne change jamais",lang:'fr'},

  /* ── La Rvfleuze ────────────────────────────────────────────────── */
  {f:'La Rvfleuze - 312-391.m4a',a:'La Rvfleuze',t:'312-391',al:null,y:null,
   l:"Des coordonnees que seuls ceux qui viennent de la bas comprennent",lang:'fr'},
  {f:'La Rvfleuze - FITNESS PARK.m4a',a:'La Rvfleuze',t:'Fitness Park',al:null,y:null,
   l:"On s'entraine dehors, le beton c'est notre salle de sport a nous",lang:'fr'},
  {f:'La Rvfleuze - PARLU.m4a',a:'La Rvfleuze',t:'Parlu',al:null,y:null,
   l:"On a cause de tout et de rien, des heures qui passaient sans qu'on s'en rende compte",lang:'fr'},

  /* ── LAYLOW ─────────────────────────────────────────────────────── */
  {f:'LAYLOW - TRINITYVILLE.m4a',a:'LAYLOW',t:'Trinityville',al:'Trinity',y:2020,
   l:"La ville ne dort jamais, les neons eclairent nos visages toute la nuit",lang:'fr'},
  {f:'LAYLOW feat. ALPHA WANN & WIT. - STUNTMEN.m4a',a:'LAYLOW',t:'Stuntmen',al:null,y:null,
   l:"On a traverse le feu pour meriter le calme qui suit apres",lang:'fr'},

  /* ── Latto ──────────────────────────────────────────────────────── */
  {f:'Latto - Blick Sum.m4a',a:'Latto',t:'Blick Sum',al:null,y:null,
   l:"Show me something real, I don't do fake around me ever",lang:'en'},

  /* ── Lil Tecca ──────────────────────────────────────────────────── */
  {f:'Lil Tecca - 120.m4a',a:'Lil Tecca',t:'120',al:'We Love You Tecca',y:2019,
   l:"I got racks inside my bag, everything been going up for me lately",lang:'en'},
  {f:'Lil Tecca - Dark Thoughts.m4a',a:'Lil Tecca',t:'Dark Thoughts',al:null,y:null,
   l:"Sometimes the mind goes to places I don't wanna be, I fight it off",lang:'en'},

  /* ── Lil Yachty ─────────────────────────────────────────────────── */
  {f:'Lil Yachty feat. Playboi Carti - Get Dripped.m4a',a:'Lil Yachty',t:'Get Dripped',al:null,y:null,
   l:"Everything I put on means something, I don't dress for nothing",lang:'en'},

  /* ── Menace Santana ─────────────────────────────────────────────── */
  {f:'Menace Santana - Freestyle Boosk\'Halloween.m4a',a:'Menace Santana',t:"Freestyle Boosk'Halloween",al:null,y:null,
   l:"Le micro me fait peur a personne, je balance tout en une prise",lang:'fr'},

  /* ── Metro Boomin ───────────────────────────────────────────────── */
  {f:'Metro Boomin feat. Travis Scott & Young Thug - Trance.m4a',a:'Metro Boomin',t:'Trance',al:'Heroes & Villains',y:2022,
   l:"Lost in the music, can't bring me back, I'm somewhere else right now",lang:'en'},

  /* ── Nono La Grinta ─────────────────────────────────────────────── */
  {f:'Nono La Grinta - FLASH-BACK.m4a',a:'Nono La Grinta',t:'Flash-Back',al:null,y:null,
   l:"Je repense a ces moments qui ont tout change, j'avais meme pas vu venir",lang:'fr'},
  {f:'Nono La Grinta - LOVE YOU.m4a',a:'Nono La Grinta',t:'Love You',al:null,y:null,
   l:"Je t'aime meme quand c'est difficile, j'ai fait la promesse et je la tiens",lang:'fr'},

  /* ── OBOY ───────────────────────────────────────────────────────── */
  {f:'OBOY feat. 1PLIKE140 - Maybach.m4a',a:'OBOY',t:'Maybach',al:null,y:null,
   l:"On roule en grande classe, la route est longue mais on est bien dedans",lang:'fr'},
  {f:'OBOY feat. Josman - Joddy Boy.m4a',a:'OBOY',t:'Joddy Boy',al:null,y:null,
   l:"Deux gars du quartier qui ont fait de leurs reves quelque chose de reel",lang:'fr'},
  {f:'OBOY feat. SCH - Saint Laurent.m4a',a:'OBOY',t:'Saint Laurent',al:null,y:null,
   l:"Habille de la tete aux pieds, le style parle mieux que les mots",lang:'fr'},

  /* ── Osirus Jack 667 ────────────────────────────────────────────── */
  {f:'Osirus Jack 667 feat. Freeze Corleone 667 - Lampadaire Pt.2.m4a',a:'Osirus Jack 667',t:'Lampadaire Pt.2',al:null,y:null,
   l:"On restait dehors tard, eclaires par la rue, c'est la qu'on a grandi",lang:'fr'},

  /* ── PLK ────────────────────────────────────────────────────────── */
  {f:'PLK - Nouvelles.m4a',a:'PLK',t:'Nouvelles',al:null,y:null,
   l:"Ca fait trop longtemps, j'attends un signe de ta part pour savoir",lang:'fr'},

  /* ── PinkPantheress ──────────────────────────────────────────────── */
  {f:'PinkPantheress - Tonight.m4a',a:'PinkPantheress',t:'Tonight',al:null,y:null,
   l:"I could be everything you need, just give me one chance to show you",lang:'en'},

  /* ── Playboi Carti ──────────────────────────────────────────────── */
  {f:'Playboi Carti - HBA.m4a',a:'Playboi Carti',t:'HBA',al:'Die Lit',y:2018,
   l:"I been on my own wave, nothing slow me down, I keep going",lang:'en'},
  {f:'Playboi Carti - Magnolia.m4a',a:'Playboi Carti',t:'Magnolia',al:'Die Lit',y:2018,
   l:"Woah, I been living like a rockstar, pull up in the foreign",lang:'en'},
  {f:'Playboi Carti feat. Kendrick Lamar - GOOD CREDIT.m4a',a:'Playboi Carti',t:'Good Credit',al:'Whole Lotta Red',y:2020,
   l:"Everything lines up in my favor, the score is looking perfect right now",lang:'en'},
  {f:'Playboi Carti feat. Skepta - TOXIC.m4a',a:'Playboi Carti',t:'Toxic',al:'Whole Lotta Red',y:2020,
   l:"You bring out something in me I can't control, it pulls me under",lang:'en'},
  {f:'Playboi Carti feat. The Weeknd - RATHER LIE.m4a',a:'Playboi Carti',t:'Rather Lie',al:'Whole Lotta Red',y:2020,
   l:"I'd tell you anything to make this feeling last a little longer",lang:'en'},

  /* ── SHERIFFLAZONE ──────────────────────────────────────────────── */
  {f:'SHERIFFLAZONE - SHINE.m4a',a:'SHERIFFLAZONE',t:'Shine',al:null,y:null,
   l:"Je brille de l'interieur, la lumiere vient de ce que j'ai vecu",lang:'fr'},
  {f:'Sherifflazone - NO BAP.m4a',a:'SHERIFFLAZONE',t:'No Bap',al:null,y:null,
   l:"Je reste authentique, j'ai pas besoin de mentir pour impressionner quiconque",lang:'fr'},

  /* ── Snoop Dogg ─────────────────────────────────────────────────── */
  {f:'Snoop Dogg - Gin and Juice.m4a',a:'Snoop Dogg',t:'Gin and Juice',al:'Doggystyle',y:1993,
   l:"With my mind on my money and my money on my mind, laid back",lang:'en'},
  {f:'Snoop Dogg - Who Am I (What\'s My Name).m4a',a:'Snoop Dogg',t:"Who Am I?",al:'Doggystyle',y:1993,
   l:"The D-O double G is in the house, bow wow wow yippee yo",lang:'en'},

  /* ── The Weeknd ─────────────────────────────────────────────────── */
  {f:'The Weeknd - After Hours.m4a',a:'The Weeknd',t:'After Hours',al:'After Hours',y:2020,
   l:"I pray that you miss me, I wonder if you feel the same way too",lang:'en'},

  /* ── Tory Lanez ─────────────────────────────────────────────────── */
  {f:'Tory Lanez - The Color Violet.m4a',a:'Tory Lanez',t:'The Color Violet',al:null,y:null,
   l:"The sky changed colors when I was thinking of you late at night",lang:'en'},

  /* ── Travis Scott ───────────────────────────────────────────────── */
  {f:'Travis Scott feat. Bad Bunny & The Weeknd - K-POP.m4a',a:'Travis Scott',t:'K-POP',al:'UTOPIA',y:2023,
   l:"It's a celebration yeah yeah, we came a long way to be here tonight",lang:'en'},
  {f:'Travis Scott feat. Young Thug & M.I.A. - FRANCHISE.m4a',a:'Travis Scott',t:'FRANCHISE',al:null,y:null,
   l:"Been the one since day one, nobody can take what I built from me",lang:'en'},

  /* ── VALD ───────────────────────────────────────────────────────── */
  {f:'VALD - Réflexions basses.m4a',a:'VALD',t:'Reflexions Basses',al:'Ce monde est cruel',y:2019,
   l:"La nuit je pense a tout et les questions restent sans reponse jusqu'au matin",lang:'fr'},
  {f:'Vald feat. Damso - Vitrine.m4a',a:'VALD',t:'Vitrine',al:'Agartha',y:2017,
   l:"Je joue un role pour plaire, je cache ce que je suis vraiment derriere ca",lang:'fr'},

  /* ── YVNNIS ─────────────────────────────────────────────────────── */
  {f:'YVNNIS - DONOTDISTURB.m4a',a:'YVNNIS',t:'Do Not Disturb',al:null,y:null,
   l:"Je suis focus, le monde exterieur n'existe plus quand je suis en creation",lang:'fr'},

  /* ── ZIAK ───────────────────────────────────────────────────────── */
  {f:'ZIAK - CATWALK.m4a',a:'ZIAK',t:'Catwalk',al:null,y:null,
   l:"Je marche dans la rue comme si c'etait un podium, les yeux sur moi",lang:'fr'},
  {f:'ZIAK - Garçons de café.m4a',a:'ZIAK',t:'Garcons De Cafe',al:null,y:null,
   l:"On reste assis des heures a refaire le monde autour d'une table",lang:'fr'},
  {f:'ZIAK - Grabba.m4a',a:'ZIAK',t:'Grabba',al:null,y:null,
   l:"J'attrape toutes les opportunites que la vie me presente, rien ne m'echappe",lang:'fr'},
  {f:'ZIAK - La nuit.m4a',a:'ZIAK',t:'La Nuit',al:null,y:null,
   l:"Quand le soleil disparait je commence vraiment a vivre et a sentir les choses",lang:'fr'},
  {f:'ZIAK - Le crime parfait.m4a',a:'ZIAK',t:'Le Crime Parfait',al:'Chrome',y:2023,
   l:"Tout est calcule, rien n'est laisse au hasard dans ce que je fais",lang:'fr'},
  {f:'ZIAK - Même pas un grincement.m4a',a:'ZIAK',t:'Meme Pas Un Grincement',al:'Chrome',y:2023,
   l:"Aucun bruit, je passe comme une ombre dans la nuit sans laisser de trace",lang:'fr'},
  {f:'ZIAK feat. JOSMAN - Room.m4a',a:'ZIAK',t:'Room',al:null,y:null,
   l:"Dans cette piece on cree quelque chose qui nous depasse tous les deux",lang:'fr'},
  {f:'ZIAK feat. ZEU - Zulu.m4a',a:'ZIAK',t:'Zulu',al:null,y:null,
   l:"Je porte en moi les racines de mes ancetres, ca guide chaque pas que je fais",lang:'fr'},
  {f:'Ziak - Akimbo.m4a',a:'ZIAK',t:'Akimbo',al:'Akimbo',y:2021,
   l:"Je me tiens droit face au monde, rien ne peut m'ebranler quand je suis la",lang:'fr'},
  {f:'Ziak - Bad Bad.m4a',a:'ZIAK',t:'Bad Bad',al:null,y:null,
   l:"Je reste redoutable pour ceux qui pensaient que j'allais m'effacer",lang:'fr'},
  {f:'Ziak - Chrome.m4a',a:'ZIAK',t:'Chrome',al:'Chrome',y:2023,
   l:"Ca brille sous les projecteurs, j'etais fait pour etre sur cette scene",lang:'fr'},
  {f:'Ziak - Lieu & heure.m4a',a:'ZIAK',t:'Lieu & Heure',al:null,y:null,
   l:"L'endroit et le moment doivent etre parfaits pour que ca prenne vraiment",lang:'fr'},
  {f:'Ziak feat. Kaaris - Rien ne se remplace.m4a',a:'ZIAK',t:'Rien Ne Se Remplace',al:null,y:null,
   l:"Il y a des liens qu'on ne peut pas refaire deux fois dans une vie",lang:'fr'},

  /* ── Zola ───────────────────────────────────────────────────────── */
  {f:'Zola - Belles Femmes.m4a',a:'Zola',t:'Belles Femmes',al:null,y:null,
   l:"Elles sont magnifiques, elles le savent et elles assument completement",lang:'fr'},
  {f:'Zola - California Girl.m4a',a:'Zola',t:'California Girl',al:null,y:null,
   l:"Elle vient de la cote ouest, le soleil dans les cheveux et le sourire large",lang:'fr'},
  {f:'Zola - Honey.m4a',a:'Zola',t:'Honey',al:'Cicatrices',y:2019,
   l:"Tu es douce, ma vie est meilleure depuis que tu es la",lang:'fr'},
  {f:'Zola - Zolabeille.m4a',a:'Zola',t:'Zolabeille',al:null,y:null,
   l:"Je suis partout a la fois, je vole de projet en projet sans jamais m'arreter",lang:'fr'},

  /* ── Zuukou Mayzie 667 ──────────────────────────────────────────── */
  {f:'Zuukou Mayzie 667 feat. Freeze Corleone 667 - Spiderman-Venom.m4a',a:'Zuukou Mayzie 667',t:'Spiderman-Venom',al:null,y:null,
   l:"On est deux mais on fait qu'un, deux faces d'une meme piece inseparables",lang:'fr'},
];

var classicPool = T;
var lyricsPool  = T.filter(function (x) { return x.l; });
var albumPool   = T.filter(function (x) { return x.al; });

/* ═══════════════════════════════════════════
   DOM
═══════════════════════════════════════════ */
var OVERLAY   = document.getElementById('gameOverlay');
var P_MODES   = document.getElementById('gPanelStart');
var P_GAME    = document.getElementById('gPanelGame');
var P_OVER    = document.getElementById('gPanelOver');
var BTN_QUIT  = document.getElementById('gBtnQuit');
var BTN_RETRY = document.getElementById('gBtnRetry');
var BTN_MODES = document.getElementById('btBtnModes');
var BTN_QUIT2 = document.getElementById('btBtnQuit');
var OPEN_BTN  = document.getElementById('physicsBtn');
var Q_WRAP    = document.getElementById('btQuestionWrap');
var CHOICES   = document.getElementById('btChoices');
var SCORE_EL  = document.getElementById('btScoreNum');
var ROUND_LBL = document.getElementById('btRoundLbl');
var PROG_FILL = document.getElementById('btProgFill');
var TIMER_W   = document.getElementById('btTimerWrap');
var TIMER_B   = document.getElementById('btTimerBar');
var FEEDBACK  = document.getElementById('btFeedback');
var FB_TEXT   = document.getElementById('btFeedbackText');
var NEXT_BTN  = document.getElementById('btNext');
var FINAL_SC  = document.getElementById('gFinalScore');
var RECAP_EL  = document.getElementById('btRecap');

var STANDALONE = !OPEN_BTN;
var BASE       = window.location.pathname.includes('/projets/') ? '../' : '';
var TIMER_MS   = 15000;

/* ═══════════════════════════════════════════
   STATE
═══════════════════════════════════════════ */
var mode       = null;
var rounds     = [];
var ridx       = 0;
var score      = 0;
var answers    = [];
var answered   = false;
var timerRAF   = null;
var timerEnd   = 0;
var audioEl    = null;
var waveRAF    = null;
var currentVol = 0.8;

/* ═══════════════════════════════════════════
   UTILS
═══════════════════════════════════════════ */
function shuffle(arr) {
  var a = arr.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = 0 | (Math.random() * (i + 1));
    var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
  }
  return a;
}

/* Choix biaises par langue pour lyrics + album */
function pick4(correct, lang) {
  if (!lang) {
    var w = shuffle(ARTISTS.filter(function (a) { return a !== correct; })).slice(0, 3);
    return shuffle([correct].concat(w));
  }
  var same = (lang === 'en' ? EN_ARTISTS : FR_ARTISTS).filter(function (a) { return a !== correct; });
  var diff = (lang === 'en' ? FR_ARTISTS : EN_ARTISTS).filter(function (a) { return a !== correct; });
  var wrong = shuffle(same).slice(0, 2).concat(shuffle(diff).slice(0, 1));
  return shuffle([correct].concat(wrong));
}

/* 5 albums distincts par partie */
function pickRounds(pool) {
  var s = shuffle(pool);
  if (mode !== 'album') return s.slice(0, 5);
  var seen = {};
  var out  = [];
  for (var i = 0; i < s.length; i++) {
    var key = s[i].al;
    if (!seen[key]) { seen[key] = true; out.push(s[i]); }
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

  var pool = m === 'lyrics' ? lyricsPool : m === 'album' ? albumPool : classicPool;
  if (pool.length < 5) pool = classicPool;
  rounds = pickRounds(pool);

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

  var tr   = rounds[ridx];
  var lang = (mode === 'lyrics' || mode === 'album') ? tr.lang : null;
  var ch   = pick4(tr.a, lang);

  ROUND_LBL.textContent = (ridx + 1) + ' / 5';
  PROG_FILL.style.width = (ridx / 5 * 100) + '%';

  if (mode === 'classic') {
    renderClassic();
    TIMER_W.style.display = 'block';
    setTimeout(function () {
      playAudio(tr);
      startTimer(function () { autoWrong(tr); });
    }, 500);
  } else {
    if (mode === 'lyrics') renderLyrics(tr);
    else renderAlbum(tr);
    TIMER_W.style.display = 'none';
  }

  renderChoices(ch, tr.a);
}

function renderClassic() {
  var bars = '';
  for (var i = 0; i < 28; i++) bars += '<div class="bt-wave-bar"></div>';
  Q_WRAP.innerHTML =
    '<div class="bt-classic-inner">' +
      '<span class="bt-q-label">QUI CHANTE CE SON ?</span>' +
      '<div class="bt-waveform" id="btWaveform">' + bars + '</div>' +
      '<div class="bt-vol-wrap">' +
        '<span class="bt-vol-icon">&#128264;</span>' +
        '<input type="range" class="bt-vol-slider" id="btVolSlider" min="0" max="1" step="0.02" value="' + currentVol + '">' +
        '<span class="bt-vol-icon">&#128266;</span>' +
      '</div>' +
    '</div>';
  startWave();
  var sl = document.getElementById('btVolSlider');
  if (sl) {
    sl.addEventListener('input', function () {
      currentVol = parseFloat(this.value);
      if (audioEl) audioEl.volume = currentVol;
    });
  }
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
    var btn = document.createElement('button');
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

  var ok = chosen === correct;
  var tr = rounds[ridx];
  if (ok) score++;
  SCORE_EL.textContent = score;
  answers.push({ tr: tr, correct: correct, chosen: chosen, ok: ok });

  revealChoices(chosen, correct);

  /* Format par mode :
     lyrics  → "BONNE REPONSE !  Artiste - Titre" / "C'etait Artiste - Titre"
     album   → "BONNE REPONSE !" / "C'etait Artiste"   (pas le titre, c'est l'album la question)
     classic → "BONNE REPONSE !  — Titre" / "C'etait Artiste — Titre"  (revele le son) */
  if (mode === 'lyrics') {
    FB_TEXT.textContent = (ok ? 'BONNE REPONSE !  ' : 'C\'etait ') + tr.a + ' — ' + tr.t;
  } else if (mode === 'album') {
    FB_TEXT.textContent = ok ? 'BONNE REPONSE !' : 'C\'etait ' + correct;
  } else {
    FB_TEXT.textContent = (ok ? 'BONNE REPONSE !  —  ' : 'C\'etait ' + correct + '  —  ') + tr.t;
  }
  FEEDBACK.className = 'bt-feedback bt--visible ' + (ok ? 'bt--correct' : 'bt--wrong');

  setTimeout(function () {
    NEXT_BTN.style.display = 'block';
    FEEDBACK.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, 300);
}

function autoWrong(tr) {
  if (answered) return;
  answered = true;
  stopAudio();
  answers.push({ tr: tr, correct: tr.a, chosen: null, ok: false });
  CHOICES.querySelectorAll('.bt-choice-btn').forEach(function (b) {
    b.disabled = true;
    if (b.dataset.a === tr.a) b.classList.add('bt--correct');
  });
  if (mode === 'lyrics') {
    FB_TEXT.textContent = 'Trop lent !  ' + tr.a + ' — ' + tr.t;
  } else if (mode === 'album') {
    FB_TEXT.textContent = 'Trop lent ! C\'etait ' + tr.a;
  } else {
    FB_TEXT.textContent = 'Trop lent ! C\'etait ' + tr.a + '  —  ' + tr.t;
  }
  FEEDBACK.className  = 'bt-feedback bt--visible bt--wrong';
  setTimeout(function () {
    NEXT_BTN.style.display = 'block';
    FEEDBACK.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, 300);
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
  var label = score === 5 ? 'PARFAIT' : score >= 4 ? 'FORT' : score >= 2 ? 'PAS MAL' : 'RETENTE';
  FINAL_SC.textContent = label + '  ' + score + ' / 5';
  RECAP_EL.innerHTML = answers.map(function (a) {
    return '<div class="bt-rec-row ' + (a.ok ? 'bt--correct' : 'bt--wrong') + '">' +
      '<span class="bt-rec-icon">' + (a.ok ? '+1' : '0') + '</span>' +
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
    for (var i = 0; i < bars.length; i++) {
      var h = 6
        + Math.abs(Math.sin(t * 1.8 + i * 0.38)) * 22
        + Math.abs(Math.sin(t * 3.1 + i * 0.71)) * 14;
      bars[i].style.height = h.toFixed(1) + 'px';
    }
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
