const screenContainer = document.getElementById('screen-container');
const audio = document.getElementById('bg-music');
const toggleMusicBtn = document.getElementById('toggle-music');

let currentScreen = 0;

// All photos available in peace.img
const allPhotos = [
  'peace.img/IMG-20260624-WA0132.jpg', 'peace.img/IMG-20260624-WA0133.jpg', 'peace.img/IMG-20260624-WA0134.jpg',
  'peace.img/IMG-20260624-WA0135.jpg', 'peace.img/IMG-20260624-WA0136.jpg', 'peace.img/IMG-20260624-WA0137.jpg',
  'peace.img/IMG-20260624-WA0138.jpg', 'peace.img/IMG-20260624-WA0161.jpg', 'peace.img/IMG-20260624-WA0162.jpg',
  'peace.img/IMG-20260624-WA0164.jpg', 'peace.img/IMG-20260624-WA0165.jpg', 'peace.img/IMG-20260624-WA0167(1).jpg',
  'peace.img/IMG-20260624-WA0167.jpg', 'peace.img/IMG-20260624-WA0168.jpg', 'peace.img/IMG-20260624-WA0169.jpg',
  'peace.img/IMG-20260624-WA0170.jpg', 'peace.img/IMG-20260624-WA0171.jpg', 'peace.img/IMG-20260624-WA0172.jpg',
  'peace.img/IMG-20260624-WA0176.jpg', 'peace.img/IMG-20260624-WA0180.jpg', 'peace.img/IMG-20260624-WA0181.jpg',
  'peace.img/IMG-20260624-WA0182.jpg', 'peace.img/IMG-20260624-WA0183.jpg', 'peace.img/IMG-20260624-WA0184.jpg',
  'peace.img/IMG-20260624-WA0186.jpg', 'peace.img/IMG-20260624-WA0188.jpg', 'peace.img/IMG-20260624-WA0189.jpg',
  'peace.img/IMG-20260624-WA0191.jpg', 'peace.img/IMG-20260624-WA0195.jpg', 'peace.img/IMG-20260624-WA0196.jpg',
  'peace.img/IMG-20260624-WA0197.jpg', 'peace.img/IMG-20260624-WA0198.jpg', 'peace.img/IMG-20260624-WA0199.jpg',
  'peace.img/IMG-20260624-WA0200.jpg', 'peace.img/IMG-20260624-WA0201.jpg', 'peace.img/IMG-20260624-WA0202.jpg'
];

let usedPhotos = [];

function getRandomPhoto() {
  if (usedPhotos.length === allPhotos.length) {
    usedPhotos = [];
  }
  const availablePhotos = allPhotos.filter(p => !usedPhotos.includes(p));
  const photo = availablePhotos[Math.floor(Math.random() * availablePhotos.length)];
  usedPhotos.push(photo);
  return photo;
}

// All screens data
const screens = [
  {
    id: 'splash',
    render: renderSplashScreen
  },
  {
    id: 'quiz',
    render: renderQuiz
  },
  {
    id: 'chests',
    render: renderChests
  },
  {
    id: 'patience',
    render: renderPatience
  },
  {
    id: 'revelation',
    render: renderRevelation
  },
  {
    id: 'archive',
    render: renderArchive
  }
];

const chestData = [
  { id: 'A', title: 'Cadeau express', photo: getRandomPhoto(), msg: 'C\'est toi. C\'est tout. 😴' },
  { id: 'B', title: 'Cadeau mystérieux', photo: getRandomPhoto(), msg: 'Le mystère, c\'était toi depuis le début. 🌟' },
  { id: 'C', title: 'Cadeau légendaire', photo: getRandomPhoto(), msg: 'Instinct de chasseuse de cadeaux. On valide. 😏' }
];

function renderChests() {
  const section = document.createElement('section');
  section.className = 'screen chests-screen';
  
  section.innerHTML = `
    <div class="screen-bg" style="background-image: url('${getRandomPhoto()}')"></div>
    <div class="screen-overlay"></div>
    <div class="glass-panel chests-content fade-in">
      <h2 class="quiz-title text-gradient">🎁 Choisis. Mais choisis bien.</h2>
      <div class="chests-container">
        ${chestData.map(c => `
          <div class="chest-box" data-id="${c.id}">
            <div class="chest-icon">🎁</div>
            <p class="chest-title">${c.title}</p>
          </div>
        `).join('')}
      </div>
      <div id="chest-reveal-modal" class="hidden">
        <div class="glass-panel reveal-modal-content">
          <img id="reveal-img" src="" />
          <p id="reveal-msg"></p>
          <button id="close-reveal" class="glass-btn">Continuer</button>
        </div>
      </div>
      
      <div id="chests-final" class="hidden fade-in">
        <p>"Mais le vrai cadeau… il n'est dans aucun de ces coffres."</p>
        <button id="to-patience" class="glass-btn">VOIR LA SUITE →</button>
      </div>
    </div>
  `;

  const opened = new Set();
  const modal = section.querySelector('#chest-reveal-modal');

  section.querySelectorAll('.chest-box').forEach(box => {
    box.addEventListener('click', () => {
      const id = box.dataset.id;
      if (opened.has(id)) return;
      
      const data = chestData.find(c => c.id === id);
      section.querySelector('#reveal-img').src = data.photo;
      section.querySelector('#reveal-msg').textContent = data.msg;
      
      modal.classList.remove('hidden');
      box.classList.add('opened');
      opened.add(id);
    });
  });

  section.querySelector('#close-reveal').addEventListener('click', () => {
    modal.classList.add('hidden');
    if (opened.size === 3) {
      section.querySelector('.chests-container').classList.add('hidden');
      section.querySelector('#chests-final').classList.remove('hidden');
    }
  });

  section.querySelector('#to-patience').addEventListener('click', nextScreen);

  return section;
}

const quizData = [
  {
    q: "Ton cadeau d'anniversaire, tu l'as réclamé…",
    options: [
      { text: "Le jour J, comme tout le monde", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Quelques jours avant, juste pour rappeler", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Un bon mois à l'avance, avec relances 😩", correct: true, msg: "On le savait. On t'aime quand même. 😏" },
      { text: "Tu avais déjà envoyé une liste en janvier", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" }
    ]
  },
  {
    q: "Parmi vos amis, qui est TOUJOURS la première à souhaiter joyeux anniversaire ?",
    options: [
      { text: "Belor (il est trop bien 😎)", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Charbelle, la loyale", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Toi. C'est toujours toi.", correct: true, msg: "Parce que toi tu n'oublies jamais. Et ça, ça ne s'invente pas. 🫶" },
      { text: "Personne ne se souvient de rien ici", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" }
    ]
  },
  {
    q: "Ta passion la plus sincère, celle que tu pratiquerais sans limite si la vie le permettait ?",
    options: [
      { text: "Étudier la médecine jour et nuit", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Veiller sur la santé de tout le monde", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Dormir. Profondément. Indéfiniment. 😴", correct: true, msg: "Le lit est ton sanctuaire. On respecte. 😴" },
      { text: "Réclamer des cadeaux avec style", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" }
    ],
    showPhoto: 'peace.img/IMG-20260624-WA0134.jpg'
  },
  {
    q: "Ton ami tousse une fois. Tu…",
    options: [
      { text: "Tu lui proposes un verre d'eau", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Tu continues la conversation", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" },
      { text: "Tu identifies 3 maladies possibles et lui interdis le sucre", correct: true, msg: "Docteur Peace disponible 24h/24. Consultations gratuites. 🩺" },
      { text: "Tu appelles le SAMU par précaution", correct: false, msg: "Ton téléphone nous dit autre chose… 📱" }
    ]
  },
  {
    q: "Une phrase. Trois personnes. Une signification que personne d'autre ne comprend.",
    options: [
      { text: "\"On se voit bientôt\"", correct: false, msg: "Hmm. T'es sûre d'être la vraie Peace ? 👀" },
      { text: "\"T'inquiète, ça va aller\"", correct: false, msg: "Hmm. T'es sûre d'être la vraie Peace ? 👀" },
      { text: "\"Je serai là\"", correct: false, msg: "Hmm. T'es sûre d'être la vraie Peace ? 👀" },
      { text: "\"Call me 🤙\"", correct: true, msg: "… Tu sais. 🤙" }
    ]
  }
];

// Ensure each quiz question has a photo
quizData.forEach(q => {
  if (!q.showPhoto) q.showPhoto = getRandomPhoto();
});

function renderQuiz() {
  const section = document.createElement('section');
  section.className = 'screen quiz-screen';
  
  let currentQ = 0;

  function showQuestion() {
    const qData = quizData[currentQ];
    section.innerHTML = `
      <div class="screen-bg" style="background-image: url('${getRandomPhoto()}')"></div>
      <div class="screen-overlay"></div>
      <div class="glass-panel quiz-content fade-in">
        <h2 class="quiz-title text-gradient">🧠 On te connaît mieux que tu crois</h2>
        <p class="quiz-question">${qData.q}</p>
        <div class="quiz-options">
          ${qData.options.map((opt, i) => `
            <button class="glass-btn opt-btn" data-index="${i}">${opt.text}</button>
          `).join('')}
        </div>
        <div id="quiz-feedback" class="hidden"></div>
      </div>
    `;

    section.querySelectorAll('.opt-btn').forEach(btn => {
      btn.addEventListener('click', () => handleAnswer(btn.dataset.index));
    });
  }

  function handleAnswer(index) {
    const qData = quizData[currentQ];
    const option = qData.options[index];
    const feedback = section.querySelector('#quiz-feedback');
    
    feedback.textContent = option.msg;
    feedback.className = 'quiz-feedback fade-in';
    
    section.querySelectorAll('.opt-btn').forEach(b => b.disabled = true);

    setTimeout(() => {
      if (qData.showPhoto) {
        showPhotoReveal(qData.showPhoto);
      } else {
        advance();
      }
    }, 2000);
  }

  function showPhotoReveal(photoPath) {
    section.innerHTML = `
      <div class="glass-panel photo-reveal fade-in">
        <img src="${photoPath}" class="reveal-img" />
        <button id="next-q-btn" class="glass-btn">Continuer ➡️</button>
      </div>
    `;
    section.querySelector('#next-q-btn').addEventListener('click', advance);
  }

  function advance() {
    currentQ++;
    if (currentQ < quizData.length) {
      showQuestion();
    } else {
      showTransition();
    }
  }

  function showTransition() {
    section.innerHTML = `
      <div class="glass-panel quiz-finish fade-in">
        <p>"Quiz terminé. Tu te connais bien… ou alors tu nous connais trop bien."</p>
        <p>"La suite est plus sérieuse. Presque."</p>
        <button id="to-chests" class="glass-btn">CONTINUER →</button>
      </div>
    `;
    section.querySelector('#to-chests').addEventListener('click', nextScreen);
  }

  showQuestion();
  return section;
}

function init() {
  renderScreen(0);
  setupAudio();
}

function renderScreen(index) {
  screenContainer.innerHTML = '';
  const screenData = screens[index];
  if (screenData) {
    const screenElement = screenData.render();
    screenContainer.appendChild(screenElement);
    currentScreen = index;
  }
}

function nextScreen() {
  renderScreen(currentScreen + 1);
}

// --- Screen 0: Splash Screen ---
function renderSplashScreen() {
  const section = document.createElement('section');
  section.className = 'screen splash-screen';
  
  // Use one of the provided images - selecting a beautiful one
  const bgImg = getRandomPhoto();
  
  section.innerHTML = `
    <div class="splash-bg" style="background-image: url('${bgImg}')"></div>
    <div class="splash-overlay"></div>
    <div class="glass-panel splash-content fade-in">
      <h1 class="typewriter-container">
        <span id="typewriter"></span>
      </h1>
      <button id="start-btn" class="glass-btn animate-pulse">
        ACCEPTER LA MISSION 🎯
      </button>
    </div>
  `;

  const typewriterText = [
    "Quelque part dans cet univers… quelque chose t'attend.",
    "Mais rien de beau ne se reçoit sans un peu d'effort.",
    "Es-tu prête, Peace ? 😏"
  ];

  setTimeout(() => {
    typeWriter(document.getElementById('typewriter'), typewriterText, 0);
  }, 500);

  section.querySelector('#start-btn').addEventListener('click', () => {
    if (audio.paused) {
      audio.currentTime = 4; // Start at 4 seconds as requested
      audio.play().catch(e => console.log('Audio autoplay blocked', e));
    }
    nextScreen();
  });

  return section;
}

// Helper: Typewriter effect
function typeWriter(element, lines, lineIndex) {
  if (lineIndex >= lines.length) return;

  let charIndex = 0;
  const line = lines[lineIndex];
  const p = document.createElement('p');
  p.className = 'typewriter-line';
  element.appendChild(p);

  const interval = setInterval(() => {
    if (charIndex < line.length) {
      p.textContent += line.charAt(charIndex);
      charIndex++;
    } else {
      clearInterval(interval);
      setTimeout(() => {
        typeWriter(element, lines, lineIndex + 1);
      }, 1000);
    }
  }, 50);
}

// --- Audio Logic ---
function setupAudio() {
  toggleMusicBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      toggleMusicBtn.querySelector('.icon').textContent = '🔊';
    } else {
      audio.pause();
      toggleMusicBtn.querySelector('.icon').textContent = '🎵';
    }
  });
}

function renderPatience() {
  const section = document.createElement('section');
  section.className = 'screen patience-screen';
  section.innerHTML = `
    <div class="screen-bg" style="background-image: url('${getRandomPhoto()}')"></div>
    <div class="screen-overlay"></div>
    <div class="glass-panel patience-content fade-in">
      <h2 class="quiz-title text-gradient">⏳ Encore un peu de patience, Peace.</h2>
      <div class="progress-container">
        <div id="progress-bar"></div>
      </div>
      <p id="patience-msg">Chargement du cadeau... 0%</p>
      
      <div id="patience-final" class="hidden fade-in">
         <p>"Prête ?"</p>
         <button id="to-revelation" class="glass-btn">OUI →</button>
      </div>
    </div>
  `;

  const bar = section.querySelector('#progress-bar');
  const msg = section.querySelector('#patience-msg');
  const finalBtn = section.querySelector('#patience-final');

  const messages = [
    { p: 2, t: "Chargement du cadeau... 2%" },
    { p: 18, t: "Calcul du nombre de relances envoyées... 18% 😂" },
    { p: 35, t: "Consultation du Docteur Peace... 35%" },
    { p: 52, t: "Vérification de ton niveau de patience... 52%" },
    { p: 71, t: "Presque... ou pas 😏 ... 71%" },
    { p: 83, t: "Call me 🤙 ... 83%" },
    { p: 100, t: "OK. Tu l'as mérité. ... 100%" }
  ];

  let progress = 0;
  const duration = 20000; // 20s
  const interval = 100;
  const increment = 100 / (duration / interval);

  const timer = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(timer);
      msg.textContent = messages[messages.length - 1].t;
      bar.style.width = '100%';
      
      setTimeout(() => {
        msg.classList.add('hidden');
        finalBtn.classList.remove('hidden');
      }, 1000);
    } else {
      bar.style.width = `${progress}%`;
      const currentMsg = messages.findLast(m => progress >= m.p);
      if (currentMsg) msg.textContent = currentMsg.t;
    }
  }, interval);

  section.querySelector('#to-revelation').addEventListener('click', nextScreen);

  return section;
}

function renderRevelation() {
  const section = document.createElement('section');
  section.className = 'screen revelation-screen';
  
  const mainPhoto = getRandomPhoto();

  section.innerHTML = `
    <div class="revelation-bg" style="background-image: url('${mainPhoto}')"></div>
    <div class="revelation-overlay"></div>
    
    <div class="revelation-content fade-in">
      <div class="revelation-hero">
        <h1 class="hero-title animate-pop">JOYEUX ANNIVERSAIRE PEACE 🎂</h1>
        <p class="hero-subtitle">21 ans. Et toujours aussi toi.</p>
      </div>

      <div id="reveal-text-container" class="glass-panel reveal-message-panel hidden">
        <div id="revelation-paragraphs"></div>
        <button id="to-archive" class="glass-btn hidden">Accéder à ton dossier →</button>
      </div>
    </div>
    
    <canvas id="confetti-canvas"></canvas>
  `;

  const paragraphs = [
    "Bon. Les blagues, c'est fini. Pour l'instant. 😏",
    "Peace, pendant tout ce temps tu as été ce genre de personne rare : celle qui n'oublie jamais un anniversaire, qui pardonne quand elle ne devrait pas, qui diagnostique les gens avant qu'ils demandent, et qui réclame ses cadeaux avec une énergie qu'on admire en secret.",
    "Mais surtout : tu es la preuve qu'on peut être forte et douce en même temps. Que la loyauté existe encore. Que l'aminité peut ressembler à quelque chose qu'on n'éteint plus.",
    "Ce jeu, c'était notre façon de te dire qu'on te connaît. Qu'on te voit. Et qu'on est chanceux de t'avoir.",
    "La suite, c'est autre chose."
  ];

  // Confetti effect (simple custom implementation or trigger if available)
  setTimeout(() => {
    startConfetti();
    setTimeout(() => {
      section.querySelector('#reveal-text-container').classList.remove('hidden');
      revealParagraphs(section.querySelector('#revelation-paragraphs'), paragraphs, 0, () => {
        section.querySelector('#to-archive').classList.remove('hidden');
      });
    }, 3000);
  }, 1000);

  section.querySelector('#to-archive').addEventListener('click', nextScreen);

  return section;
}

function revealParagraphs(container, paras, index, callback) {
  if (index >= paras.length) {
    if (callback) callback();
    return;
  }

  const p = document.createElement('p');
  p.className = 'reveal-p fade-in';
  p.textContent = paras[index];
  container.appendChild(p);

  setTimeout(() => {
    revealParagraphs(container, paras, index + 1, callback);
  }, 3000);
}

function startConfetti() {
  const duration = 15 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

function renderArchive() {
  const section = document.createElement('section');
  section.className = 'screen archive-screen';
  
  const galleryPhotos = [
    { p: getRandomPhoto(), l: "Elle dormait encore. 😴" },
    { p: getRandomPhoto(), l: "Ce regard-là. Celui qui dit tout. 🫶" },
    { p: getRandomPhoto(), l: "La fille qui n'oublie jamais ton anniversaire. 🎂" },
    { p: getRandomPhoto(), l: "Docteur Peace en dehors des heures de consultation. 🩺" },
    { p: getRandomPhoto(), l: "Simplement elle." }
  ];

  section.innerHTML = `
    <div class="screen-bg" style="background-image: url('${getRandomPhoto()}')"></div>
    <div class="screen-overlay"></div>
    <div class="archive-container glass-panel fade-in">
      <header class="archive-header">
        <h1 class="text-gradient">📁 PEACE ARCHIVE</h1>
        <p class="tagline">Dossier confidentiel. Accès réservé à une seule personne.</p>
      </header>

      <div class="archive-grid">
        <div class="archive-left">
          <section class="archive-section">
            <h3 class="section-title">🏷️ IDENTITÉ OFFICIELLE</h3>
            <div class="id-row"><span>Nom</span>: <span>Peace</span></div>
            <div class="id-row"><span>Statut</span>: <span>Personne rare en circulation active</span></div>
            <div class="id-row"><span>Niveau d'impact</span>: <span>Élevé</span></div>
            <div class="id-row"><span>Dangerosité</span>: <span>Forte (elle fait s'attacher les gens 😏)</span></div>
          </section>

          <section class="archive-section">
            <h3 class="section-title">🧬 ANALYSE DU PROFIL</h3>
            ${renderStat('Empathie', 100)}
            ${renderStat('Mémoire des anniv.', 100)}
            ${renderStat('Réclamation cadeau', 120, true)}
            ${renderStat('Pardon trop vite', 100)}
            ${renderStat('Sommeil requis', 100)}
          </section>
          
          <section class="archive-section">
            <h3 class="section-title">🧠 VALEUR HUMAINE</h3>
            <blockquote>"Certaines personnes n'ont pas besoin de faire du bruit pour être importantes. Peace en fait partie."</blockquote>
          </section>
        </div>

        <div class="archive-right">
          <h3 class="section-title">📸 MÉMOIRE VISUELLE</h3>
          <div class="gallery-grid">
            ${galleryPhotos.map(ph => `
              <div class="gallery-item">
                <img src="${ph.p}" alt="Photo de Peace" loading="lazy" />
                <p class="photo-caption">${ph.l}</p>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <footer class="archive-footer section-content">
        <h3 class="section-title">💌 NOTE FINALE</h3>
        <p>"Ce projet n'est pas un cadeau. C'est une trace."</p>
        <p>"Tu fais partie des personnes qui rendent les autres meilleurs sans s'en rendre compte."</p>
        <p>"Et si un jour tu te demandes si tu comptes pour les gens qui t'entourent, reviens ici."</p>
        <p class="signature">Odirick Belor & Charbelle 🤙</p>
      </footer>
    </div>
  `;

  return section;
}

function renderStat(label, value, over = false) {
  const percentage = over ? Math.min(value, 150) : value;
  return `
    <div class="stat-row">
      <div class="stat-label"><span>${label}</span> <span>${value}%</span></div>
      <div class="stat-bar-bg">
        <div class="stat-bar-fill" style="width: ${percentage}%"></div>
      </div>
    </div>
  `;
}

// Start the app
init();
