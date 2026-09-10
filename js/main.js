// ================= embers de fondo =================
  const bgFill = document.getElementById('bgFill');
  for (let i = 0; i < 26; i++) {
    const e = document.createElement('div');
    e.className = 'ember';
    e.style.left = `${Math.random() * 100}%`;
    e.style.bottom = `${-10 - Math.random() * 20}%`;
    e.style.animationDuration = `${8 + Math.random() * 10}s`;
    e.style.animationDelay = `${Math.random() * 10}s`;
    bgFill.appendChild(e);
  }

  // ================= datos de artistas (logos reales) =================
  const artists = [
    { name: "Carrizal", ig: "@carrizal", color: "#c9a227", img: "assets/artists/carrizal.png" },
    { name: "Touki Xantana", ig: "@toukixantana", color: "#e83fd1", img: "assets/artists/touki-xantana.png" },
    { name: "Angel Dumile", ig: "@angeldumile", color: "#a3172c", img: "assets/artists/angel-dumile.png" },
    { name: "Nesteb", ig: "@nesteb", color: "#ff5aa8", img: "assets/artists/nesteb.png" },
    { name: "Yung Blackie", ig: "@yungblackie", color: "#2f6fe0", img: "assets/artists/yung-blackie.png" },
    { name: "Torrente", ig: "@torrente", color: "#e2a033", img: "assets/artists/torrente.png" },
    { name: "Tada", ig: "@tada", color: "#8ee62a", img: "assets/artists/tada.png" },
    { name: "Mauro", ig: "@mauro", color: "#e63fb0", img: "assets/artists/mauro.png" },
    { name: "Mowzito", ig: "@mowzito", color: "#ff4fa0", img: "assets/artists/mowzito.png" },
    { name: "Juan One", ig: "@juanone", color: "#2fae66", img: "assets/artists/juan-one.png" },
    { name: "Hazim", ig: "@hazim", color: "#b8752e", img: "assets/artists/hazim.png" },
  ];

  const listWrap = document.getElementById('artistsList');
  listWrap.innerHTML = artists.map((a, i) => `
    <div class="artist-card" data-card style="--dir:${i % 2 === 0 ? -1 : 1}">
      <div class="artist-num">${String(i + 1).padStart(2, '0')} / ${String(artists.length).padStart(2, '0')}</div>
      <div class="artist-photo-wrap" style="--card-color:${a.color}">
        <div class="artist-photo-glow"></div>
        <img class="artist-photo" src="${a.img}" alt="${a.name}">
      </div>
      <a class="artist-ig" href="https://instagram.com/${a.ig.replace('@','')}" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="3.6"/><circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none"/></svg>
        ${a.ig}
      </a>
    </div>
  `).join('');
  const artistCards = document.querySelectorAll('[data-card]');

  function updateArtistCards() {
    const vh = window.innerHeight;
    artistCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const dir = parseFloat(card.style.getPropertyValue('--dir')) || 1;
      const t = clamp01((vh - rect.top) / (vh * 0.62));
      const rotY = dir * (1 - t) * 62;
      const x = dir * (1 - t) * 26;
      const scale = 0.86 + t * 0.14;
      const opacity = t;
      const photo = card.querySelector('.artist-photo-wrap');
      photo.style.opacity = String(opacity);
      photo.style.transform = `translateX(${x}px) rotateY(${rotY}deg) scale(${scale})`;
      card.querySelector('.artist-ig').style.opacity = String(t);
      card.querySelector('.artist-num').style.opacity = String(t);
    });
  }

  const stageWrap = document.getElementById('stageWrap');
  const nav = document.getElementById('nav');
  const flipPerspective = document.getElementById('flipPerspective');
  const flipInner = document.getElementById('flipInner');
  const logoStage = document.getElementById('logoStage');
  const logoTagline = document.getElementById('logoTagline');
  const scrollCue = document.getElementById('scrollCue');
  const trailerStage = document.getElementById('trailerStage');

  const FLIP_START = 0.12, FLIP_END = 0.32;
  const TITLE_HOLD_END = 0.48;
  const LOGO_FADE_END = 0.60;
  const TRAILER_IN_END = 0.76;
  const TRAILER_HOLD_END = 0.92;
  const TRAILER_OUT_END = 1.0;

  function clamp01(n){ return Math.min(Math.max(n, 0), 1); }

  function update() {
    const rect = stageWrap.getBoundingClientRect();
    const total = stageWrap.offsetHeight - window.innerHeight;
    const progress = clamp01(total > 0 ? -rect.top / total : 0);

    nav.classList.toggle('visible', progress > 0.02);

    const zoomT = clamp01(progress / FLIP_END);
    flipPerspective.style.transform = `scale(${0.74 + zoomT * 0.26})`;

    const flipT = clamp01((progress - FLIP_START) / (FLIP_END - FLIP_START));
    flipInner.style.transform = `rotateY(${flipT * 180}deg)`;

    const taglineT = clamp01((progress - FLIP_END) / (TITLE_HOLD_END - FLIP_END));
    logoTagline.style.opacity = String(taglineT);

    scrollCue.style.opacity = String(clamp01(1 - progress / 0.045));

    const logoOutT = clamp01((progress - TITLE_HOLD_END) / (LOGO_FADE_END - TITLE_HOLD_END));
    logoStage.style.opacity = String(1 - logoOutT);
    logoStage.style.pointerEvents = logoOutT > 0.6 ? 'none' : 'auto';

    let trailerOpacity = 0;
    if (progress < LOGO_FADE_END) trailerOpacity = 0;
    else if (progress < TRAILER_IN_END) trailerOpacity = (progress - LOGO_FADE_END) / (TRAILER_IN_END - LOGO_FADE_END);
    else if (progress < TRAILER_HOLD_END) trailerOpacity = 1;
    else if (progress < TRAILER_OUT_END) trailerOpacity = 1 - (progress - TRAILER_HOLD_END) / (TRAILER_OUT_END - TRAILER_HOLD_END);
    else trailerOpacity = 0;
    trailerStage.style.opacity = String(trailerOpacity);
    trailerStage.style.pointerEvents = trailerOpacity > 0.5 ? 'auto' : 'none';
  }

  function onScroll() {
    update();
    updateArtistCards();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  document.getElementById('trailerPlay').addEventListener('click', () => {
    const video = document.querySelector('.trailer-media video');
    if (video) { video.play(); document.getElementById('trailerPlay').style.display = 'none'; }
  });