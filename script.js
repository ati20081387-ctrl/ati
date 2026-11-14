/**
 * Inside Atena's Mind
 * Interactive archive — vanilla JS
 */

(function () {
  'use strict';

  // ---------- DOM refs ----------
  const landing = document.getElementById('landing');
  const universe = document.getElementById('universe');
  const moonTrigger = document.getElementById('moonTrigger');
  const backBtn = document.getElementById('backToLanding');
  const worldCards = document.querySelectorAll('.world-card');
  const panels = document.querySelectorAll('.world-panel');
  const closeBtns = document.querySelectorAll('.close-panel');
  const starfield = document.getElementById('starfield');
  const particlesContainer = document.getElementById('particles');
  const snowLayer = document.getElementById('snowLayer');

  // Music
  const audio = document.getElementById('ambientAudio');
  const playBtn = document.getElementById('playBtn');
  const muteBtn = document.getElementById('muteBtn');
  const volumeSlider = document.getElementById('volumeSlider');

  let isPlaying = false;
  let isMuted = false;

  // ---------- Starfield (canvas) ----------
  function initStarfield() {
    if (!starfield) return;
    const ctx = starfield.getContext('2d');
    let width, height, stars = [];

    function resize() {
      width = starfield.width = window.innerWidth;
      height = starfield.height = window.innerHeight;
      createStars();
    }

    function createStars() {
      const count = Math.min(180, Math.floor((width * height) / 9000));
      stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.4 + 0.3,
          alpha: Math.random() * 0.7 + 0.2,
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          twinklePhase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const time = Date.now() * 0.001;

      for (const s of stars) {
        const a = s.alpha * (0.6 + 0.4 * Math.sin(time * s.twinkleSpeed * 60 + s.twinklePhase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220, 210, 240, ${a})`;
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();
  }

  // ---------- Floating particles ----------
  function initParticles() {
    if (!particlesContainer) return;
    const count = 18;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.width = p.style.height = (Math.random() * 2 + 1) + 'px';
      p.style.animationDuration = (Math.random() * 18 + 14) + 's';
      p.style.animationDelay = (Math.random() * 12) + 's';
      particlesContainer.appendChild(p);
    }
  }

  // ---------- Snow for childhood scene ----------
  function initSnow() {
    if (!snowLayer) return;
    const count = 45;
    for (let i = 0; i < count; i++) {
      const flake = document.createElement('div');
      flake.className = 'snowflake';
      const size = Math.random() * 3 + 1.5;
      flake.style.width = size + 'px';
      flake.style.height = size + 'px';
      flake.style.left = Math.random() * 100 + '%';
      flake.style.animationDuration = (Math.random() * 8 + 6) + 's';
      flake.style.animationDelay = (Math.random() * 8) + 's';
      flake.style.opacity = Math.random() * 0.5 + 0.3;
      snowLayer.appendChild(flake);
    }
  }

  // ---------- Navigation ----------
  function enterUniverse() {
    landing.classList.add('hidden');
    universe.classList.remove('hidden');
    document.body.style.overflow = 'auto';
  }

  function returnToLanding() {
    // Close any open panel first
    panels.forEach(p => p.classList.remove('active'));
    universe.classList.add('hidden');
    landing.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function openWorld(id) {
    const panel = document.getElementById('panel-' + id);
    if (!panel) return;
    panels.forEach(p => p.classList.remove('active'));
    panel.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeWorld() {
    panels.forEach(p => p.classList.remove('active'));
    document.body.style.overflow = 'auto';
  }

  // ---------- Music player ----------
  function updatePlayIcon() {
    if (!playBtn) return;
    if (isPlaying) {
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      playBtn.classList.add('playing');
    } else {
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
      playBtn.classList.remove('playing');
    }
  }

  function togglePlay() {
    if (!audio) return;
    // If no source is set, give a gentle notice in console and do nothing harmful
    if (!audio.src && audio.children.length === 0) {
      console.info('Ambient audio: add a <source> inside #ambientAudio or set audio.src to a royalty-free ambient track.');
      // Still toggle UI state for demo feel
      isPlaying = !isPlaying;
      updatePlayIcon();
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().then(() => {
        isPlaying = true;
        updatePlayIcon();
      }).catch(() => {
        // Autoplay policy or missing file
        console.info('Could not play audio. Ensure a valid source is present and user has interacted.');
      });
      return;
    }
    updatePlayIcon();
  }

  function toggleMute() {
    if (!audio) return;
    isMuted = !isMuted;
    audio.muted = isMuted;
    if (muteBtn) {
      muteBtn.style.opacity = isMuted ? '0.45' : '1';
    }
  }

  function setVolume() {
    if (!audio || !volumeSlider) return;
    audio.volume = parseFloat(volumeSlider.value);
  }

  // ---------- Event listeners ----------
  function bindEvents() {
    if (moonTrigger) {
      moonTrigger.addEventListener('click', enterUniverse);
      moonTrigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          enterUniverse();
        }
      });
      moonTrigger.setAttribute('tabindex', '0');
      moonTrigger.setAttribute('role', 'button');
    }

    if (backBtn) {
      backBtn.addEventListener('click', returnToLanding);
    }

    worldCards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-world');
        openWorld(id);
      });
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', closeWorld);
    });

    // Close panel on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const anyOpen = [...panels].some(p => p.classList.contains('active'));
        if (anyOpen) closeWorld();
      }
    });

    // Click outside panel content to close (on the dark overlay)
    panels.forEach(panel => {
      panel.addEventListener('click', (e) => {
        if (e.target === panel) closeWorld();
      });
    });

    // Music
    if (playBtn) playBtn.addEventListener('click', togglePlay);
    if (muteBtn) muteBtn.addEventListener('click', toggleMute);
    if (volumeSlider) {
      volumeSlider.addEventListener('input', setVolume);
      setVolume();
    }

    if (audio) {
      audio.addEventListener('ended', () => {
        isPlaying = false;
        updatePlayIcon();
      });
      audio.addEventListener('pause', () => {
        isPlaying = false;
        updatePlayIcon();
      });
      audio.addEventListener('play', () => {
        isPlaying = true;
        updatePlayIcon();
      });
    }
  }

  // ---------- Init ----------
  function init() {
    document.body.style.overflow = 'hidden'; // landing first
    initStarfield();
    initParticles();
    initSnow();
    bindEvents();
    updatePlayIcon();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
