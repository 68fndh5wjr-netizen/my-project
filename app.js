/**
 * CUMPLEAÑOS ESEQUIEL . 18
 * Official Interactive Web Invitation Logic - Montevideo Edition
 */

// ==========================================
// 1. DEFAULT DATA & STATE
// ==========================================
const DEFAULT_CONFIG = {
  name: "Esequiel",
  age: 18,
  dateText: "Viernes 23 de Marzo",
  eventDateTime: "2027-03-23T23:00",
  timeText: "23:00 HS",
  locationText: "María Orticochea 4183, Montevideo",
  mapsUrl: "https://maps.app.goo.gl/Xb3xjy4f4ADwYHi49?g_st=ic",
  spotifyUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
  whatsappNumber: "", // Default empty: opens WhatsApp contact selector
  dressCode: "Total Black / Streetwear",
  lineUp: "Cachengue • RKT • Trap"
};

// Default DJ / Spotify requested songs
const DEFAULT_SONGS = [
  { name: "Milo J, Bizarrap - Fruto", by: "Joaco" },
  { name: "Duki - She Don't Give a FO", by: "Sofi" },
  { name: "La Joaqui - Dos Besitos", by: "Cande" },
  { name: "Tiago PZK, Quevedo - Real G's", by: "Mateo" }
];

// Initial sample messages for the guestbook (no drinks)
const SAMPLE_MESSAGES = [
  {
    name: "Joaco",
    text: "¡Felices 18 hermano! Se pica fuerte ese salón en María Orticochea 🔥🍾",
    song: "Milo J, Bizarrap - Fruto",
    time: "Hace 10 min"
  },
  {
    name: "Cande & Sofi",
    text: "¡No faltamos ni locas! Ya tenemos los outfits total black listos 🖤",
    song: "La Joaqui - Dos Besitos",
    time: "Hace 25 min"
  },
  {
    name: "Mateo R.",
    text: "¡Salud Ese! Ya te sumé un par de temas a la playlist de Spotify 🎧",
    song: "Tiago PZK - Real G's",
    time: "Hace 1 hora"
  }
];

// Evasive NO button jokes
const NO_JOKES = [
  "¡Ni en pedo te lo perdés! 😂",
  "¿Cómo que NO? 🤨",
  "Ese botón hoy no funciona 😉",
  "¡Dale no seas ortiva!",
  "Apretá el SÍ que te conviene 🔥",
  "¡Esequiel ya te anotó en la lista igual!",
  "¡No tenés escapatoria! 🍾",
  "Error 404: Faltar no está permitido",
  "¡Nos vemos en María Orticochea 4183!"
];

const ANGRY_PHRASES = [
  "¡¿QUÉ ME TOCÁS?!",
  "¡QUÉ ME TOCÁS!",
  "¡EH PARÁ UN POCO!",
  "¡NO ME TOQUÉS!",
  "¡SACÁ LA MANO DE AHÍ! 😂"
];

const HAPPY_PHRASES = [
  "¡VAMOOOO!",
  "¡VAMOOOO CARAJO!",
  "¡SE PICAAA!",
  "¡VAMOOOO ESOS 18!"
];

const NO_BTN_TEXTS = ["NO", "NO?", "¿POSTA?", "NO PODÉS", "IMPOSIBLE", "BUENO SÍ"];

// ==========================================
// 2. WEB AUDIO SYNTHESIZER
// ==========================================
class SoundFX {
  constructor() {
    this.ctx = null;
    this.isPlayingBeat = false;
    this.beatInterval = null;
    this.step = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  playAngry() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  }

  playHappy() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);
      gain.gain.setValueAtTime(0.18, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.3);
    });
  }

  playCelebration() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Sub bass drop
    const bass = this.ctx.createOscillator();
    const bassGain = this.ctx.createGain();
    bass.type = 'sine';
    bass.frequency.setValueAtTime(190, now);
    bass.frequency.exponentialRampToValueAtTime(45, now + 0.7);
    bassGain.gain.setValueAtTime(0.4, now);
    bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    bass.connect(bassGain);
    bassGain.connect(this.ctx.destination);
    bass.start(now);
    bass.stop(now + 0.8);

    // Fanfare chords
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const noteOsc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      noteOsc.type = 'sawtooth';
      noteOsc.frequency.setValueAtTime(freq, now + idx * 0.08);
      noteGain.gain.setValueAtTime(0.12, now + idx * 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
      noteOsc.connect(noteGain);
      noteGain.connect(this.ctx.destination);
      noteOsc.start(now + idx * 0.08);
      noteOsc.stop(now + idx * 0.08 + 0.45);
    });
  }

  togglePartyBeat(onStateChange) {
    this.init();
    if (this.isPlayingBeat) {
      this.stopPartyBeat();
      if (onStateChange) onStateChange(false);
    } else {
      this.startPartyBeat();
      if (onStateChange) onStateChange(true);
    }
  }

  startPartyBeat() {
    if (!this.ctx) return;
    this.isPlayingBeat = true;
    const intervalMs = (60 / 128) * 1000 / 2;
    this.step = 0;

    this.beatInterval = setInterval(() => {
      const now = this.ctx.currentTime;
      if (this.step % 2 === 0) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(130, now);
        osc.frequency.exponentialRampToValueAtTime(35, now + 0.12);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
      } else {
        const bufferSize = this.ctx.sampleRate * 0.04;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(7000, now);
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.08, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        noise.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
      }
      this.step = (this.step + 1) % 16;
    }, intervalMs);
  }

  stopPartyBeat() {
    this.isPlayingBeat = false;
    if (this.beatInterval) {
      clearInterval(this.beatInterval);
      this.beatInterval = null;
    }
  }
}

const sounds = new SoundFX();

// ==========================================
// 3. DYNAMIC STICKER ENGINE (Angry & Happy)
// ==========================================
let angryIndex = 0;
let happyIndex = 0;

function spawnSticker(type, clientX, clientY, customPhrase) {
  const container = document.getElementById('stickersContainer');
  if (!container) return;

  const sticker = document.createElement('div');
  sticker.className = `pop-sticker ${type}`;

  let emoji = '😡';
  let phrase = customPhrase;

  if (type === 'angry') {
    sounds.playAngry();
    emoji = ['😡', '🤬', '😠', '😤'][Math.floor(Math.random() * 4)];
    if (!phrase) {
      phrase = ANGRY_PHRASES[angryIndex % ANGRY_PHRASES.length];
      angryIndex++;
    }
  } else {
    sounds.playHappy();
    emoji = ['😎', '🥳', '🔥', '🎉'][Math.floor(Math.random() * 4)];
    if (!phrase) {
      phrase = HAPPY_PHRASES[happyIndex % HAPPY_PHRASES.length];
      happyIndex++;
    }
  }

  sticker.innerHTML = `
    <span class="sticker-emoji">${emoji}</span>
    <span class="sticker-text">${escapeHtml(phrase)}</span>
  `;

  // Position at click or viewport center if coordinates missing
  const posX = clientX ?? (window.innerWidth / 2);
  const posY = clientY ?? (window.innerHeight / 2);

  // Slight random offset for organic sticker cluster
  const jitterX = (Math.random() - 0.5) * 30;
  const jitterY = (Math.random() - 0.5) * 30;

  sticker.style.left = `${Math.max(80, Math.min(window.innerWidth - 80, posX + jitterX))}px`;
  sticker.style.top = `${Math.max(60, Math.min(window.innerHeight - 60, posY + jitterY))}px`;

  container.appendChild(sticker);

  // Remove element after animation
  setTimeout(() => {
    if (sticker.parentNode) {
      sticker.parentNode.removeChild(sticker);
    }
  }, 1900);
}

// Setup photo tap easter egg (Esequiel's photo reacts with "¡¿Qué me tocás?!")
function setupPhotoReaction() {
  const heroCard = document.getElementById('heroCard');
  if (!heroCard) return;

  const handlePhotoTap = (e) => {
    // Avoid triggering when tapping the scroll down button
    if (e.target.closest('.btn-scroll-down')) return;

    let x = e.clientX;
    let y = e.clientY;
    if (e.touches && e.touches[0]) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    }
    spawnSticker('angry', x, y, '¡¿QUÉ ME TOCÁS?! 😡');
  };

  heroCard.addEventListener('click', handlePhotoTap);
}

// ==========================================
// 4. STORAGE & CONFIG MANAGER
// ==========================================
function getConfig() {
  const saved = localStorage.getItem('ese18_config_v2');
  if (saved) {
    try {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
  }
  return { ...DEFAULT_CONFIG };
}

function saveConfig(cfg) {
  localStorage.setItem('ese18_config_v2', JSON.stringify(cfg));
  applyConfig(cfg);
}

function applyConfig(cfg) {
  document.getElementById('displayDateHeader').textContent = cfg.dateText.toUpperCase();
  document.getElementById('ticketDate').textContent = cfg.dateText;
  document.getElementById('ticketTime').textContent = cfg.timeText;
  document.getElementById('ticketLocation').textContent = cfg.locationText;
  document.getElementById('ticketDressCode').textContent = cfg.dressCode;

  const mapLink = document.getElementById('btnMap');
  if (cfg.mapsUrl && cfg.mapsUrl.trim() !== '') {
    mapLink.href = cfg.mapsUrl;
    mapLink.style.display = 'inline-flex';
  } else {
    mapLink.style.display = 'none';
  }

  // Spotify Link
  const spotifyBtn = document.getElementById('btnSpotifyOpen');
  if (spotifyBtn && cfg.spotifyUrl) {
    spotifyBtn.href = cfg.spotifyUrl;
  }
}

// ==========================================
// 5. COUNTDOWN TIMER
// ==========================================
let countdownTimer = null;

function startCountdown() {
  const cfg = getConfig();
  let targetDate = new Date(cfg.eventDateTime);

  if (isNaN(targetDate.getTime()) || targetDate <= new Date()) {
    const now = new Date();
    let year = now.getFullYear();
    targetDate = new Date(`${year}-03-23T23:00:00`);
    if (targetDate <= now) {
      targetDate = new Date(`${year + 1}-03-23T23:00:00`);
    }
  }

  function update() {
    const now = new Date().getTime();
    const diff = targetDate.getTime() - now;

    if (diff <= 0) {
      document.getElementById('cdDays').textContent = '00';
      document.getElementById('cdHours').textContent = '00';
      document.getElementById('cdMins').textContent = '00';
      document.getElementById('cdSecs').textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
    document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
    document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
  }

  if (countdownTimer) clearInterval(countdownTimer);
  update();
  countdownTimer = setInterval(update, 1000);
}

// ==========================================
// 6. THE VIRAL EVASIVE "NO" BUTTON & ANGRY STICKER
// ==========================================
let noAttempts = 0;
let jokeTimeout = null;

function setupEvasiveNoButton() {
  const btnNo = document.getElementById('btnNo');
  const btnYes = document.getElementById('btnYes');
  const zone = document.getElementById('buttonsZone');
  const toast = document.getElementById('noJokeToast');
  const noText = document.getElementById('noBtnText');

  function dodge(e) {
    let clientX, clientY;
    if (e) {
      if (e.touches && e.touches[0]) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = e.clientX;
        clientY = e.clientY;
      }
      e.preventDefault();
      e.stopPropagation();
    }

    // Spawn the requested ANGRY STICKER: "¿Qué me tocás?" 😡
    spawnSticker('angry', clientX, clientY, '¡¿QUÉ ME TOCÁS?! 😡');

    noAttempts++;

    // Joke toast
    const joke = NO_JOKES[noAttempts % NO_JOKES.length];
    toast.textContent = joke;
    toast.classList.add('show');
    clearTimeout(jokeTimeout);
    jokeTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 1800);

    // Update label
    const labelIdx = Math.min(noAttempts, NO_BTN_TEXTS.length - 1);
    noText.textContent = NO_BTN_TEXTS[labelIdx];

    // Compute random translation within boundaries
    const zoneRect = zone.getBoundingClientRect();
    const maxTranslateX = (zoneRect.width / 2) - 40;
    const maxTranslateY = 60;

    const randX = (Math.random() * 2 - 1) * maxTranslateX;
    const randY = (Math.random() * 2 - 1) * maxTranslateY;
    const randRotate = (Math.random() * 20 - 10);

    btnNo.style.transform = `translate(${randX}px, ${randY}px) rotate(${randRotate}deg) scale(0.92)`;

    // Make YES button more enticing!
    const yesScale = Math.min(1 + noAttempts * 0.05, 1.35);
    btnYes.style.transform = `scale(${yesScale})`;
    btnYes.style.boxShadow = `0 8px 30px rgba(255, 27, 54, ${Math.min(0.4 + noAttempts * 0.1, 0.9)})`;
  }

  btnNo.addEventListener('mouseenter', dodge);
  btnNo.addEventListener('touchstart', dodge, { passive: false });
  btnNo.addEventListener('click', dodge);
}

// ==========================================
// 7. THE "SÍ" BUTTON & HAPPY STICKER ("¡VAMOOOO!")
// ==========================================
function setupYesButton() {
  const btnYes = document.getElementById('btnYes');
  const overlay = document.getElementById('celebrationOverlay');
  const btnProceed = document.getElementById('btnProceedToDetails');

  btnYes.addEventListener('click', (e) => {
    let clientX = e.clientX;
    let clientY = e.clientY;

    // Spawn the requested HAPPY STICKER: "¡VAMOOOO!" 🎉
    spawnSticker('happy', clientX, clientY, '¡VAMOOOO! 😎🔥');

    sounds.playCelebration();
    fireMassiveConfetti();

    // Show celebration modal
    overlay.classList.add('active');
  });

  btnProceed.addEventListener('click', () => {
    sounds.playClick();
    overlay.classList.remove('active');
    document.getElementById('party-details').scrollIntoView({ behavior: 'smooth' });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      document.getElementById('party-details').scrollIntoView({ behavior: 'smooth' });
    }
  });
}

function fireMassiveConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#ff1b36', '#ffffff', '#ffd700', '#1db954']
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors: ['#ff1b36', '#ffffff', '#1db954']
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors: ['#ffd700', '#ff1b36', '#ffffff']
      });
    }, 250);
  }
}

// ==========================================
// 8. SPOTIFY & DJ SONGS LIST MANAGER
// ==========================================
function getStoredSongs() {
  const saved = localStorage.getItem('ese18_songs_v2');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
  }
  return DEFAULT_SONGS;
}

function renderSongs() {
  const container = document.getElementById('songsListContainer');
  if (!container) return;
  const songs = getStoredSongs();
  container.innerHTML = '';

  songs.forEach(s => {
    const pill = document.createElement('div');
    pill.className = 'song-pill';
    const searchUrl = `https://open.spotify.com/search/${encodeURIComponent(s.name)}`;
    pill.innerHTML = `
      <div class="song-info">
        <span class="song-name">🎵 ${escapeHtml(s.name)}</span>
        <span class="song-by">Pedida por: ${escapeHtml(s.by || 'Invitado')}</span>
      </div>
      <a href="${searchUrl}" target="_blank" rel="noopener" class="btn-song-spotify" title="Buscar y agregar en Spotify">
        🎧 Abrir en Spotify
      </a>
    `;
    container.appendChild(pill);
  });
}

function addSong(songName, guestName) {
  if (!songName) return;
  const songs = getStoredSongs();
  songs.unshift({
    name: songName,
    by: guestName || 'Invitado'
  });
  localStorage.setItem('ese18_songs_v2', JSON.stringify(songs));
  renderSongs();
}

// ==========================================
// 9. GUESTBOOK / WALL OF MESSAGES
// ==========================================
function getStoredMessages() {
  const data = localStorage.getItem('ese18_messages_v2');
  if (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
  }
  return SAMPLE_MESSAGES;
}

function renderMessages() {
  const container = document.getElementById('messagesStream');
  if (!container) return;
  const msgs = getStoredMessages();
  container.innerHTML = '';

  msgs.forEach(m => {
    const card = document.createElement('div');
    card.className = 'msg-bubble';
    card.innerHTML = `
      <div class="msg-author">
        <span>${escapeHtml(m.name)}</span>
        <span class="msg-time">${escapeHtml(m.time || 'Reciente')}</span>
      </div>
      <p class="msg-text">${escapeHtml(m.text)}</p>
      ${m.song ? `<span class="msg-song-tag">🎵 ${escapeHtml(m.song)}</span>` : ''}
    `;
    container.appendChild(card);
  });
}

function addMessage(name, text, song) {
  const msgs = getStoredMessages();
  msgs.unshift({
    name,
    text: text || "¡Confirmadísimo para el cumple! 🎉",
    song,
    time: "Recién"
  });
  localStorage.setItem('ese18_messages_v2', JSON.stringify(msgs));
  renderMessages();
}

// ==========================================
// 10. RSVP FORM & WHATSAPP GENERATION (No Drinks)
// ==========================================
function setupRsvpForm() {
  const form = document.getElementById('rsvpForm');
  const successBadge = document.getElementById('rsvpSuccessCard');
  const confirmedText = document.getElementById('confirmedGuestText');
  const ticketId = document.getElementById('ticketId');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('guestName').value.trim();
    const song = document.getElementById('guestSong').value.trim();
    const note = document.getElementById('guestNote').value.trim();

    if (!name) return;

    // Spawn Happy Sticker "¡VAMOOOO!"
    spawnSticker('happy', window.innerWidth / 2, window.innerHeight / 2, '¡VAMOOOO! 🎉');
    sounds.playCelebration();
    fireMassiveConfetti();

    // Add song to collaborative Spotify list
    if (song) {
      addSong(song, name);
    }

    // Save message to guestbook
    addMessage(name, note, song);

    // Update ticket with guest name
    const sanitizedCode = name.replace(/\s+/g, '-').toUpperCase().slice(0, 8);
    ticketId.textContent = `#VIP-18-${sanitizedCode}`;

    // Craft WhatsApp message
    const cfg = getConfig();
    let msg = `*¡CONFIRMACIÓN DE ASISTENCIA - CUMPLE DE ${cfg.name.toUpperCase()} (18 AÑOS)!* 🔞🔥\n\n`;
    msg += `👤 *Invitado:* ${name}\n`;
    if (song) msg += `🎵 *Tema para el DJ / Spotify:* ${song}\n`;
    if (note) msg += `💬 *Dedicatoria:* "${note}"\n\n`;
    msg += `📍 *Salón:* ${cfg.locationText}\n`;
    msg += `¡Nos vemos el ${cfg.dateText} para romper la noche! 🍾`;

    const encodedMsg = encodeURIComponent(msg);
    let waUrl = '';

    if (cfg.whatsappNumber && cfg.whatsappNumber.replace(/\D/g, '').length > 6) {
      const cleanPhone = cfg.whatsappNumber.replace(/\D/g, '');
      waUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
    } else {
      waUrl = `https://api.whatsapp.com/send?text=${encodedMsg}`;
    }

    // Show local success badge
    form.style.display = 'none';
    successBadge.style.display = 'flex';
    confirmedText.textContent = `¡Excelente ${name}! Te redirigimos a WhatsApp para avisarle a ${cfg.name}...`;

    // Open WhatsApp
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 700);
  });
}

// ==========================================
// 11. ADD TO CALENDAR (.ICS FILE GENERATION)
// ==========================================
function setupCalendarButton() {
  const btn = document.getElementById('btnAddToCalendar');
  btn.addEventListener('click', () => {
    sounds.playClick();
    const cfg = getConfig();

    let dtStart = '20270323T230000';
    let dtEnd = '20270324T060000';

    if (cfg.eventDateTime) {
      const d = new Date(cfg.eventDateTime);
      if (!isNaN(d.getTime())) {
        const pad = n => String(n).padStart(2, '0');
        dtStart = `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
        const endD = new Date(d.getTime() + 7 * 60 * 60 * 1000);
        dtEnd = `${endD.getFullYear()}${pad(endD.getMonth()+1)}${pad(endD.getDate())}T${pad(endD.getHours())}${pad(endD.getMinutes())}00`;
      }
    }

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Esequiel 18th Birthday Invitation//ES',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:Cumpleaños Esequiel . 18 🔞🎉`,
      `DESCRIPTION:Invitación oficial a los 18 de Esequiel en Montevideo. Dress code: ${cfg.dressCode}. Ubicación: ${cfg.locationText}`,
      `LOCATION:${cfg.locationText}`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cumple-Esequiel-18.ics`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

// ==========================================
// 12. SOUND TOGGLE BUTTON
// ==========================================
function setupSoundToggle() {
  const btn = document.getElementById('soundToggle');
  const icon = document.getElementById('soundIcon');

  btn.addEventListener('click', () => {
    sounds.togglePartyBeat((isPlaying) => {
      if (isPlaying) {
        btn.classList.add('playing');
        icon.textContent = '🔊';
      } else {
        btn.classList.remove('playing');
        icon.textContent = '🔇';
      }
    });
  });
}

// ==========================================
// 13. CONFIGURATION MODAL (For Esequiel)
// ==========================================
function setupConfigModal() {
  const modal = document.getElementById('configModal');
  const openBtn = document.getElementById('editConfigBtn');
  const closeBtn = document.getElementById('closeModalBtn');
  const saveBtn = document.getElementById('saveConfigBtn');

  // Fields
  const fName = document.getElementById('cfgName');
  const fDateText = document.getElementById('cfgDateText');
  const fCountdownDate = document.getElementById('cfgCountdownDate');
  const fTime = document.getElementById('cfgTime');
  const fLocation = document.getElementById('cfgLocation');
  const fMapsUrl = document.getElementById('cfgMapsUrl');
  const fSpotifyUrl = document.getElementById('cfgSpotifyUrl');
  const fWhatsapp = document.getElementById('cfgWhatsapp');
  const fDressCode = document.getElementById('cfgDressCode');

  openBtn.addEventListener('click', () => {
    sounds.playClick();
    const cfg = getConfig();
    fName.value = cfg.name;
    fDateText.value = cfg.dateText;
    fCountdownDate.value = cfg.eventDateTime || '';
    fTime.value = cfg.timeText;
    fLocation.value = cfg.locationText;
    fMapsUrl.value = cfg.mapsUrl || '';
    fSpotifyUrl.value = cfg.spotifyUrl || '';
    fWhatsapp.value = cfg.whatsappNumber || '';
    fDressCode.value = cfg.dressCode;

    modal.classList.add('open');
  });

  closeBtn.addEventListener('click', () => {
    modal.classList.remove('open');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  saveBtn.addEventListener('click', () => {
    sounds.playClick();
    const updated = {
      name: fName.value.trim() || 'Esequiel',
      age: 18,
      dateText: fDateText.value.trim() || 'Viernes 23 de Marzo',
      eventDateTime: fCountdownDate.value || '2027-03-23T23:00',
      timeText: fTime.value.trim() || '23:00 HS',
      locationText: fLocation.value.trim() || 'María Orticochea 4183, Montevideo',
      mapsUrl: fMapsUrl.value.trim() || 'https://maps.app.goo.gl/Xb3xjy4f4ADwYHi49?g_st=ic',
      spotifyUrl: fSpotifyUrl.value.trim() || 'https://open.spotify.com',
      whatsappNumber: fWhatsapp.value.trim(),
      dressCode: fDressCode.value.trim() || 'Total Black / Streetwear',
      lineUp: 'Cachengue • RKT • Trap'
    };

    saveConfig(updated);
    startCountdown();
    modal.classList.remove('open');
    spawnSticker('happy', window.innerWidth / 2, window.innerHeight / 2, '¡CAMBIOS GUARDADOS!');
    fireMassiveConfetti();
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

// ==========================================
// 14. INITIALIZATION
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const cfg = getConfig();
  applyConfig(cfg);
  startCountdown();
  setupPhotoReaction();
  setupEvasiveNoButton();
  setupYesButton();
  setupRsvpForm();
  renderSongs();
  renderMessages();
  setupCalendarButton();
  setupSoundToggle();
  setupConfigModal();
});
