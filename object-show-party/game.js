const canvas = document.getElementById("arena");
const ctx = canvas.getContext("2d");
let viewW = 960;
let viewH = 540;

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const heartsEl = document.getElementById("hearts");
const hostNameEl = document.getElementById("hostName");
const challengeNameEl = document.getElementById("challengeName");
const hostLineEl = document.getElementById("hostLine");
const challengeInfoEl = document.getElementById("challengeInfo");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const recordBtn = document.getElementById("recordBtn");
const recordStatus = document.getElementById("recordStatus");
const messageEl = document.getElementById("message");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const jumpBtn = document.getElementById("jumpBtn");
const characterButtons = document.getElementById("characterButtons");
const customNameInput = document.getElementById("customName");
const customShapeSelect = document.getElementById("customShape");
const customMainInput = document.getElementById("customMain");
const customAccentInput = document.getElementById("customAccent");
const addCharacterBtn = document.getElementById("addCharacterBtn");

const DEFAULT_CHARACTERS = [
  { id: "gluey", label: "Gluey", main: "#f7f9ff", accent: "#43c6f2", kind: "tube" },
  { id: "piney", label: "Piney", main: "#30c151", accent: "#1c913a", kind: "tree" },
  { id: "photoy", label: "Photoy", main: "#f36186", accent: "#4d74d8", kind: "frame" },
  { id: "bagely", label: "Bagely", main: "#f1ddad", accent: "#d7c18e", kind: "ring" },
  { id: "booksy", label: "Booksy", main: "#31b9d3", accent: "#3ec243", kind: "book" },
  { id: "ballsy", label: "Ballsy", main: "#f4d65c", accent: "#6bd1f8", kind: "ball" }
];
let characterPool = [...DEFAULT_CHARACTERS];

const CUSTOM_STORAGE_KEY = "object-show-party-custom-characters-v1";

const HOSTS = [
  {
    name: "Cloud Host",
    line: "Welcome players. Finish all challenges to win the show!",
    kind: "frame",
    main: "#f3fdff",
    accent: "#77c8ff"
  },
  {
    name: "Star Host",
    line: "Fast hands win this one. Let the challenge begin!",
    kind: "ball",
    main: "#ffd365",
    accent: "#ff8f62"
  },
  {
    name: "Neon Host",
    line: "Three rounds, one winner. Keep moving!",
    kind: "tube",
    main: "#f7f6ff",
    accent: "#45e29f"
  }
];

const CHALLENGES = [
  {
    key: "collect",
    title: "Collect 8 stars",
    detail: "Challenge 1: Collect 8 stars before time runs out.",
    duration: 25,
    goal: 8,
    spawnInterval: 0.62,
    badRate: 0.18
  },
  {
    key: "survive",
    title: "Survive the hazard round",
    detail: "Challenge 2: Survive while dodging the red danger balls.",
    duration: 20,
    goal: 0,
    spawnInterval: 0.48,
    badRate: 0.52
  },
  {
    key: "final",
    title: "Reach score 18",
    detail: "Final Challenge: Reach total score 18 to win the episode.",
    duration: 35,
    goal: 18,
    spawnInterval: 0.55,
    badRate: 0.25
  }
];

const state = {
  running: false,
  over: false,
  score: 0,
  hearts: 3,
  timeLeft: CHALLENGES[0].duration,
  selected: characterPool[0],
  host: HOSTS[0],
  challengeIndex: 0,
  challengeProgress: 0,
  elapsedSpawn: 0,
  pickups: [],
  stars: [],
  shake: 0
};

const player = {
  x: 110,
  y: 0,
  w: 66,
  h: 76,
  vx: 0,
  vy: 0,
  moveSpeed: 340,
  jumpPower: 660,
  gravity: 1650,
  onGround: false,
  flyFuel: 95,
  maxFlyFuel: 95
};

const controls = {
  left: false,
  right: false,
  jump: false,
  jumpQueued: false
};

let lastTs = 0;
let mediaRecorder = null;
let recording = false;
let recordedChunks = [];
let pulseTimer = null;

function groundY() {
  return viewH - 78;
}

function resetGame() {
  if (pulseTimer) {
    clearTimeout(pulseTimer);
    pulseTimer = null;
  }
  state.running = false;
  state.over = false;
  state.score = 0;
  state.hearts = 3;
  state.timeLeft = CHALLENGES[0].duration;
  state.challengeIndex = 0;
  state.challengeProgress = 0;
  state.elapsedSpawn = 0;
  state.pickups = [];
  state.stars = makeStars();
  state.shake = 0;
  chooseHost();

  player.x = 110;
  player.y = groundY() - player.h;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  player.flyFuel = player.maxFlyFuel;

  controls.left = false;
  controls.right = false;
  controls.jump = false;
  controls.jumpQueued = false;

  challengeInfoEl.textContent = CHALLENGES[0].detail;
  setHostLine(`${state.host.line} Pick your character and tap Start.`);
  setMessage("Tap Start to play");
  renderHUD();
}

function startGame() {
  if (state.running) return;
  if (state.over) {
    resetGame();
  }
  state.running = true;
  startChallenge(state.challengeIndex);
}

function endGame(text) {
  state.running = false;
  state.over = true;
  setMessage(text);
}

function renderHUD() {
  const challenge = currentChallenge();
  scoreEl.textContent = String(state.score);
  timeEl.textContent = String(Math.max(0, Math.ceil(state.timeLeft)));
  heartsEl.textContent = String(state.hearts);
  hostNameEl.textContent = state.host.name;
  challengeNameEl.textContent = challenge.title;

  if (challenge.key === "collect") {
    challengeInfoEl.textContent = `Challenge ${state.challengeIndex + 1}: Collect ${state.challengeProgress}/${challenge.goal} stars.`;
  } else if (challenge.key === "survive") {
    challengeInfoEl.textContent = `Challenge ${state.challengeIndex + 1}: Survive. Time left ${Math.max(0, Math.ceil(state.timeLeft))}s.`;
  } else {
    challengeInfoEl.textContent = `Final Challenge: Reach score ${challenge.goal}. Current score ${state.score}.`;
  }
}

function setMessage(text) {
  messageEl.textContent = text;
  if (text) {
    messageEl.classList.remove("hide");
  } else {
    messageEl.classList.add("hide");
  }
}

function updateRecordStatus(text) {
  recordStatus.textContent = text;
}

function currentChallenge() {
  return CHALLENGES[state.challengeIndex];
}

function chooseHost() {
  state.host = HOSTS[Math.floor(Math.random() * HOSTS.length)];
}

function setHostLine(text) {
  hostLineEl.textContent = `Host says: ${text}`;
}

function showPulse(text, ms = 1300) {
  setMessage(text);
  if (pulseTimer) {
    clearTimeout(pulseTimer);
  }
  pulseTimer = setTimeout(() => {
    if (state.running) setMessage("");
    pulseTimer = null;
  }, ms);
}

function startChallenge(index) {
  state.challengeIndex = index;
  state.challengeProgress = 0;
  state.timeLeft = CHALLENGES[index].duration;
  state.elapsedSpawn = 0;
  state.pickups = [];
  challengeInfoEl.textContent = CHALLENGES[index].detail;
  setHostLine(`${state.host.line} Now: ${CHALLENGES[index].title}.`);
  renderHUD();
  showPulse(`Round ${index + 1}: ${CHALLENGES[index].title}`);
}

function advanceChallenge() {
  if (state.challengeIndex >= CHALLENGES.length - 1) {
    endGame(`You won all challenges! Final score: ${state.score}`);
    return;
  }
  startChallenge(state.challengeIndex + 1);
}

function makeCharacterId(name) {
  return `custom-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;
}

function getCustomCharacters() {
  return characterPool.filter(c => c.custom);
}

function saveCustomCharacters() {
  try {
    localStorage.setItem(CUSTOM_STORAGE_KEY, JSON.stringify(getCustomCharacters()));
  } catch (err) {
    updateRecordStatus("Character saved for now, but browser storage is blocked.");
  }
}

function loadCustomCharacters() {
  try {
    const raw = localStorage.getItem(CUSTOM_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return;
    const loaded = parsed
      .filter(item => item && item.label && item.kind && item.main && item.accent)
      .slice(0, 24)
      .map(item => ({
        id: item.id || makeCharacterId(item.label),
        label: String(item.label).slice(0, 20),
        main: String(item.main),
        accent: String(item.accent),
        kind: String(item.kind),
        custom: true
      }));
    characterPool = [...DEFAULT_CHARACTERS, ...loaded];
    state.selected = characterPool[0];
  } catch (_err) {
    characterPool = [...DEFAULT_CHARACTERS];
  }
}

function makeStars() {
  const stars = [];
  for (let i = 0; i < 50; i += 1) {
    stars.push({
      x: Math.random() * viewW,
      y: Math.random() * viewH * 0.55,
      s: Math.random() * 2.2 + 1,
      drift: (Math.random() - 0.5) * 0.24
    });
  }
  return stars;
}

function spawnPickup() {
  const challenge = currentChallenge();
  const bad = Math.random() < challenge.badRate;
  state.pickups.push({
    x: Math.random() * (viewW - 80) + 40,
    y: -18,
    r: bad ? 16 : 14,
    vy: bad ? 220 : 180,
    kind: bad ? "bad" : "good"
  });
}

function update(dt) {
  if (!state.running) return;
  const challenge = currentChallenge();

  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    if (challenge.key === "survive") {
      advanceChallenge();
      renderHUD();
      return;
    }
    endGame(`Challenge failed: ${challenge.title}`);
    renderHUD();
    return;
  }

  state.elapsedSpawn += dt;
  if (state.elapsedSpawn > challenge.spawnInterval) {
    state.elapsedSpawn = 0;
    spawnPickup();
  }

  player.vx = 0;
  if (controls.left) player.vx -= player.moveSpeed;
  if (controls.right) player.vx += player.moveSpeed;

  if (controls.jumpQueued && player.onGround) {
    player.vy = -player.jumpPower;
    player.onGround = false;
    controls.jumpQueued = false;
  }

  if (controls.jump && !player.onGround && player.flyFuel > 0) {
    player.vy -= 950 * dt;
    player.flyFuel -= 65 * dt;
    if (player.flyFuel < 0) player.flyFuel = 0;
  }

  player.vy += player.gravity * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  const floor = groundY() - player.h;
  if (player.y >= floor) {
    player.y = floor;
    player.vy = 0;
    player.onGround = true;
    player.flyFuel = Math.min(player.maxFlyFuel, player.flyFuel + 70 * dt);
  }

  player.x = clamp(player.x, 24, viewW - player.w - 24);

  for (let i = state.pickups.length - 1; i >= 0; i -= 1) {
    const p = state.pickups[i];
    p.y += p.vy * dt;

    if (intersects(player, p)) {
      if (p.kind === "good") {
        state.score += 1;
        if (challenge.key === "collect") {
          state.challengeProgress += 1;
        }
      } else {
        state.hearts -= 1;
        state.shake = 0.28;
      }
      state.pickups.splice(i, 1);
      continue;
    }

    if (p.y > viewH + 30) {
      state.pickups.splice(i, 1);
    }
  }

  if (state.hearts <= 0) {
    endGame("Out of hearts. Try again!");
    renderHUD();
    return;
  }

  if (challenge.key === "collect" && state.challengeProgress >= challenge.goal) {
    advanceChallenge();
    renderHUD();
    return;
  }

  if (challenge.key === "final" && state.score >= challenge.goal) {
    advanceChallenge();
    renderHUD();
    return;
  }

  if (state.shake > 0) {
    state.shake -= dt;
    if (state.shake < 0) state.shake = 0;
  }

  renderHUD();
}

function draw() {
  const shakeX = state.shake > 0 ? (Math.random() - 0.5) * 12 : 0;
  const shakeY = state.shake > 0 ? (Math.random() - 0.5) * 8 : 0;

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawBackground();
  drawFloor();

  state.pickups.forEach(drawPickup);
  drawPlayer();
  drawFlyBar();
  drawHost();

  ctx.restore();
}

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, viewH);
  g.addColorStop(0, "#72d8ff");
  g.addColorStop(0.6, "#b8f9d5");
  g.addColorStop(1, "#d5ffd8");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.fillStyle = "#fff4a5";
  ctx.beginPath();
  ctx.arc(viewW - 116, 110, 52, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffffb6";
  state.stars.forEach(s => {
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.s, 0, Math.PI * 2);
    ctx.fill();
    s.x += s.drift;
    if (s.x < -5) s.x = viewW + 5;
    if (s.x > viewW + 5) s.x = -5;
  });
}

function drawFloor() {
  const y = groundY();
  ctx.fillStyle = "#2f9a5f";
  ctx.fillRect(0, y, viewW, viewH - y);

  ctx.fillStyle = "#44b26f";
  for (let i = 0; i < viewW; i += 46) {
    ctx.fillRect(i, y - 4, 24, 6);
  }
}

function drawPlayer() {
  drawCharacter(state.selected.kind, player.x, player.y, player.w, player.h, state.selected.main, state.selected.accent);

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(player.x + player.w * 0.36, player.y + player.h * 0.4, 3.4, 0, Math.PI * 2);
  ctx.arc(player.x + player.w * 0.66, player.y + player.h * 0.4, 3.4, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(player.x + player.w * 0.5, player.y + player.h * 0.52, 12, 0.16, Math.PI - 0.16, false);
  ctx.stroke();
}

function drawFlyBar() {
  const x = 18;
  const y = 16;
  const w = 160;
  const h = 18;
  const t = player.flyFuel / player.maxFlyFuel;

  ctx.fillStyle = "#ffffffb5";
  roundRect(ctx, x, y, w, h, 9, true, false);
  ctx.fillStyle = "#6f42d8";
  roundRect(ctx, x + 2, y + 2, (w - 4) * t, h - 4, 7, true, false);
  ctx.fillStyle = "#112344";
  ctx.font = "700 12px Fredoka";
  ctx.fillText("Fly", x + w + 8, y + 13);
}

function drawHost() {
  const x = viewW - 124;
  const y = 24;
  const w = 74;
  const h = 76;
  drawCharacter(state.host.kind, x, y, w, h, state.host.main, state.host.accent);

  ctx.strokeStyle = "#102038";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x + w * 0.36, y + h * 0.42, 2.7, 0, Math.PI * 2);
  ctx.arc(x + w * 0.66, y + h * 0.42, 2.7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x + w * 0.5, y + h * 0.55, 10, 0.2, Math.PI - 0.2, false);
  ctx.stroke();

  ctx.fillStyle = "#ffffffd6";
  roundRect(ctx, x - 194, y + 4, 184, 42, 10, true, false);
  ctx.fillStyle = "#153a5f";
  ctx.font = "700 12px Fredoka";
  const bubble = state.running ? currentChallenge().title : "Press Start";
  ctx.fillText(`${state.host.name}: ${bubble}`, x - 186, y + 29);
}

function drawPickup(p) {
  if (p.kind === "good") {
    ctx.fillStyle = "#ffe34f";
    drawStar(p.x, p.y, p.r, 5);
    ctx.fill();
  } else {
    ctx.fillStyle = "#ff4f5e";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(p.x - 7, p.y - 7);
    ctx.lineTo(p.x + 7, p.y + 7);
    ctx.moveTo(p.x + 7, p.y - 7);
    ctx.lineTo(p.x - 7, p.y + 7);
    ctx.stroke();
  }
}

function drawCharacter(kind, x, y, w, h, main, accent) {
  ctx.save();
  ctx.fillStyle = main;
  ctx.strokeStyle = "#7897ac";
  ctx.lineWidth = 3;

  if (kind === "tube") {
    roundRect(ctx, x + 8, y + 4, w - 16, h - 14, 18, true, true);
    ctx.fillStyle = accent;
    roundRect(ctx, x + 16, y - 6, w - 32, 20, 8, true, false);
    ctx.fillStyle = "#4acdf0";
    roundRect(ctx, x + 11, y + h - 17, w - 22, 14, 5, true, false);
  } else if (kind === "tree") {
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + 10);
    ctx.lineTo(x + 8, y + h - 16);
    ctx.lineTo(x + w - 8, y + h - 16);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = main;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.5, y + 2);
    ctx.lineTo(x + 2, y + h - 20);
    ctx.lineTo(x + w - 2, y + h - 20);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#9dbe62";
    roundRect(ctx, x + w * 0.46, y + h * 0.38, 8, h * 0.52, 3, true, false);
  } else if (kind === "frame") {
    ctx.fillStyle = "#fff";
    roundRect(ctx, x + 6, y + 2, w - 12, h - 10, 8, true, true);
    ctx.fillStyle = accent;
    roundRect(ctx, x + 11, y + 7, w - 22, h * 0.45, 4, true, false);
    ctx.fillStyle = main;
    roundRect(ctx, x + 11, y + h * 0.45, w - 22, h * 0.39, 4, true, false);
    ctx.fillStyle = "#ffe065";
    ctx.beginPath();
    ctx.arc(x + w * 0.72, y + h * 0.63, 9, 0, Math.PI * 2);
    ctx.fill();
  } else if (kind === "ring") {
    ctx.fillStyle = main;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.43, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff4d1";
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.42, 0, Math.PI * 2);
    ctx.stroke();
  } else if (kind === "book") {
    ctx.fillStyle = main;
    roundRect(ctx, x + 9, y + 4, w - 16, h - 12, 7, true, true);
    ctx.fillStyle = accent;
    roundRect(ctx, x + 9, y + 4, 16, h - 12, 4, true, false);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w - 13, y + 12);
    ctx.lineTo(x + w - 13, y + h - 13);
    ctx.stroke();
  } else {
    const g = ctx.createRadialGradient(x + w * 0.34, y + h * 0.3, 7, x + w * 0.5, y + h * 0.5, w * 0.5);
    g.addColorStop(0, main);
    g.addColorStop(1, accent);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h / 2, w * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function roundRect(c, x, y, w, h, r, fill, stroke) {
  c.beginPath();
  c.moveTo(x + r, y);
  c.lineTo(x + w - r, y);
  c.quadraticCurveTo(x + w, y, x + w, y + r);
  c.lineTo(x + w, y + h - r);
  c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  c.lineTo(x + r, y + h);
  c.quadraticCurveTo(x, y + h, x, y + h - r);
  c.lineTo(x, y + r);
  c.quadraticCurveTo(x, y, x + r, y);
  c.closePath();
  if (fill) c.fill();
  if (stroke) c.stroke();
}

function drawStar(x, y, r, points) {
  const step = Math.PI / points;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  for (let i = 0; i < points * 2; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.48;
    const a = i * step - Math.PI / 2;
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad);
  }
  ctx.closePath();
}

function intersects(rect, c) {
  const cx = clamp(c.x, rect.x, rect.x + rect.w);
  const cy = clamp(c.y, rect.y, rect.y + rect.h);
  const dx = c.x - cx;
  const dy = c.y - cy;
  return dx * dx + dy * dy < c.r * c.r;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function onPress(key, active) {
  controls[key] = active;
  if (key === "jump" && active) {
    controls.jumpQueued = true;
  }
}

function bindHoldButton(btn, key) {
  const down = e => {
    e.preventDefault();
    onPress(key, true);
  };
  const up = e => {
    e.preventDefault();
    onPress(key, false);
  };

  btn.addEventListener("pointerdown", down);
  btn.addEventListener("pointerup", up);
  btn.addEventListener("pointerleave", up);
  btn.addEventListener("pointercancel", up);
  btn.addEventListener("touchstart", down, { passive: false });
  btn.addEventListener("touchend", up, { passive: false });
}

function makeCharacterButtons() {
  characterButtons.innerHTML = "";
  characterPool.forEach(character => {
    const btn = document.createElement("button");
    btn.className = "char-btn";
    btn.textContent = character.label;
    btn.type = "button";
    if (character.id === state.selected.id) {
      btn.classList.add("active");
    }

    btn.addEventListener("click", () => {
      state.selected = character;
      [...characterButtons.querySelectorAll(".char-btn")].forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });

    characterButtons.appendChild(btn);
  });
}

function addCustomCharacter() {
  if (characterPool.length >= 30) {
    updateRecordStatus("Character limit reached. Refresh to clear and add more.");
    return;
  }

  const label = customNameInput.value.trim().slice(0, 20);
  if (!label) {
    updateRecordStatus("Type a character name first.");
    return;
  }

  const character = {
    id: makeCharacterId(label),
    label,
    kind: customShapeSelect.value,
    main: customMainInput.value,
    accent: customAccentInput.value,
    custom: true
  };

  characterPool.push(character);
  state.selected = character;
  saveCustomCharacters();
  makeCharacterButtons();
  updateRecordStatus(`Character "${label}" added.`);
  customNameInput.value = "";
}

function recordingMimeType() {
  const types = [
    "video/mp4;codecs=h264",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm"
  ];
  for (const type of types) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  return "";
}

function setRecordingUi(isRecording) {
  recording = isRecording;
  recordBtn.classList.toggle("active", isRecording);
  recordBtn.textContent = isRecording ? "Stop Recording" : "Record Video";
}

async function finalizeRecording(blob, filename) {
  const file = new File([blob], filename, { type: blob.type || "video/mp4" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "My Object Show Video",
        text: "I made this game video!",
        files: [file]
      });
      updateRecordStatus("Shared. You can also save it to Photos from the share sheet.");
      return;
    } catch (_err) {
      // User canceled share; continue to download fallback.
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1600);
  updateRecordStatus("Video downloaded. On iPhone: open Files, then Save Video to Photos.");
}

function startRecording() {
  if (!canvas.captureStream || !window.MediaRecorder) {
    updateRecordStatus("Recording not supported in this browser.");
    return;
  }
  if (recording) return;

  try {
    const stream = canvas.captureStream(30);
    const mimeType = recordingMimeType();
    mediaRecorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    recordedChunks = [];

    mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(track => track.stop());
      const outputType = mediaRecorder.mimeType || "video/mp4";
      const ext = outputType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(recordedChunks, { type: outputType });
      const filename = `object-show-video-${Date.now()}.${ext}`;
      setRecordingUi(false);
      finalizeRecording(blob, filename);
    };

    mediaRecorder.start(120);
    setRecordingUi(true);
    updateRecordStatus("Recording... tap Stop Recording when done.");
  } catch (_err) {
    setRecordingUi(false);
    updateRecordStatus("Could not start recording. Try Safari on iPhone.");
  }
}

function stopRecording() {
  if (!recording || !mediaRecorder) return;
  if (mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    updateRecordStatus("Processing video...");
  }
}

function resizeCanvas() {
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
  viewW = w;
  viewH = h;
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  if (!state.running) {
    player.y = groundY() - player.h;
    state.stars = makeStars();
  }
}

function loop(ts) {
  const dt = Math.min(0.032, (ts - lastTs) / 1000 || 0);
  lastTs = ts;

  update(dt);
  draw();

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", e => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)) {
    e.preventDefault();
  }
  if (e.key === "ArrowLeft") onPress("left", true);
  if (e.key === "ArrowRight") onPress("right", true);
  if (e.key === "ArrowUp" || e.key === " ") onPress("jump", true);
});

window.addEventListener("keyup", e => {
  if (e.key === "ArrowLeft") onPress("left", false);
  if (e.key === "ArrowRight") onPress("right", false);
  if (e.key === "ArrowUp" || e.key === " ") onPress("jump", false);
});

bindHoldButton(leftBtn, "left");
bindHoldButton(rightBtn, "right");
bindHoldButton(jumpBtn, "jump");

startBtn.addEventListener("click", startGame);
resetBtn.addEventListener("click", resetGame);
addCharacterBtn.addEventListener("click", addCustomCharacter);
customNameInput.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();
    addCustomCharacter();
  }
});
recordBtn.addEventListener("click", () => {
  if (recording) {
    stopRecording();
  } else {
    startRecording();
  }
});

window.addEventListener("resize", resizeCanvas);
window.addEventListener("beforeunload", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
});

loadCustomCharacters();
makeCharacterButtons();
resetGame();
resizeCanvas();
requestAnimationFrame(loop);
