const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const targetEl = document.getElementById("target");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const stickBase = document.getElementById("stickBase");
const stickThumb = document.getElementById("stickThumb");

const world = {
  width: 100,
  height: 64,
  targetScore: 12,
  roundSeconds: 60,
};

const state = {
  running: true,
  score: 0,
  timeLeft: world.roundSeconds,
  timeAcc: 0,
  keys: new Set(),
  joyX: 0,
  joyY: 0,
  joyPointerId: null,
  lastStamp: performance.now(),
};

const player = {
  x: world.width * 0.5,
  y: world.height * 0.75,
  r: 2.1,
  speed: 23,
};

const sparks = [];
const shadows = [];
const stars = [];

for (let i = 0; i < 120; i += 1) {
  stars.push({ x: Math.random() * world.width, y: Math.random() * world.height, tw: Math.random() * Math.PI * 2, s: 0.2 + Math.random() * 0.75 });
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function resetRound() {
  state.running = true;
  state.score = 0;
  state.timeLeft = world.roundSeconds;
  state.timeAcc = 0;
  player.x = world.width * 0.5;
  player.y = world.height * 0.75;
  sparks.length = 0;
  shadows.length = 0;

  for (let i = 0; i < 7; i += 1) spawnSpark();
  for (let i = 0; i < 5; i += 1) spawnShadow();

  targetEl.textContent = String(world.targetScore);
  syncHUD();
  setMessage("Collect sparks before night fades. Avoid shadows.", "");
}

function setMessage(text, cls) {
  messageEl.textContent = text;
  messageEl.className = `message ${cls}`.trim();
}

function syncHUD() {
  scoreEl.textContent = String(state.score);
  timeEl.textContent = String(state.timeLeft);
}

function spawnSpark() {
  sparks.push({
    x: rand(5, world.width - 5),
    y: rand(8, world.height - 5),
    r: 1.1,
    phase: rand(0, Math.PI * 2),
  });
}

function spawnShadow() {
  const edge = Math.floor(rand(0, 4));
  let x = rand(0, world.width);
  let y = rand(0, world.height);

  if (edge === 0) y = -2;
  if (edge === 1) x = world.width + 2;
  if (edge === 2) y = world.height + 2;
  if (edge === 3) x = -2;

  shadows.push({
    x,
    y,
    r: rand(1.7, 2.5),
    speed: rand(9.5, 14),
    wobble: rand(0, Math.PI * 2),
  });
}

function worldToCanvas(x, y) {
  return {
    x: (x / world.width) * canvas.width,
    y: (y / world.height) * canvas.height,
  };
}

function unitToCanvas(u) {
  return (u / world.width) * canvas.width;
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
}

function handleMovement(dt) {
  let vx = state.joyX;
  let vy = state.joyY;

  if (state.keys.has("arrowleft") || state.keys.has("a")) vx -= 1;
  if (state.keys.has("arrowright") || state.keys.has("d")) vx += 1;
  if (state.keys.has("arrowup") || state.keys.has("w")) vy -= 1;
  if (state.keys.has("arrowdown") || state.keys.has("s")) vy += 1;

  if (vx === 0 && vy === 0) return;

  const len = Math.hypot(vx, vy) || 1;
  player.x += (vx / len) * player.speed * dt;
  player.y += (vy / len) * player.speed * dt;

  player.x = clamp(player.x, player.r, world.width - player.r);
  player.y = clamp(player.y, player.r, world.height - player.r);
}

function updateShadows(dt, elapsed) {
  for (const s of shadows) {
    const dx = player.x - s.x;
    const dy = player.y - s.y;
    const d = Math.hypot(dx, dy) || 1;
    const chase = s.speed + Math.sin(elapsed * 2 + s.wobble) * 0.7;
    s.x += (dx / d) * chase * dt;
    s.y += (dy / d) * chase * dt;
  }
}

function checkCollisions() {
  for (let i = sparks.length - 1; i >= 0; i -= 1) {
    const t = sparks[i];
    const dx = player.x - t.x;
    const dy = player.y - t.y;
    if (dx * dx + dy * dy <= (player.r + t.r) * (player.r + t.r)) {
      sparks.splice(i, 1);
      state.score += 1;
      if (state.score >= world.targetScore) {
        state.running = false;
        syncHUD();
        setMessage("The moon opens its eyes. You woke the night.", "win");
        return;
      }
      spawnSpark();
      syncHUD();
    }
  }

  for (const s of shadows) {
    const dx = player.x - s.x;
    const dy = player.y - s.y;
    if (dx * dx + dy * dy <= (player.r + s.r) * (player.r + s.r)) {
      state.running = false;
      setMessage("A shadow touched you. Restart and try again.", "lose");
      return;
    }
  }
}

function updateTimer(dt) {
  state.timeAcc += dt;
  while (state.timeAcc >= 1) {
    state.timeAcc -= 1;
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      state.running = false;
      syncHUD();
      setMessage("Dawn arrived too early. The moon sleeps again.", "lose");
      return;
    }
    syncHUD();
  }
}

function drawBackground(elapsed) {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0a1140");
  g.addColorStop(0.5, "#0a1234");
  g.addColorStop(1, "#050912");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    const p = worldToCanvas(star.x, star.y);
    const twinkle = 0.35 + Math.abs(Math.sin(elapsed * 1.8 + star.tw)) * 0.65;
    const r = star.s * twinkle;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(210,232,255,${0.45 + twinkle * 0.5})`;
    ctx.fill();
  }
}

function drawMoon(elapsed) {
  const wake = clamp(state.score / world.targetScore, 0, 1);
  const moonX = canvas.width * 0.5;
  const moonY = canvas.height * 0.17;
  const moonR = Math.min(canvas.width, canvas.height) * 0.12;

  const glow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 2.4);
  glow.addColorStop(0, `rgba(255,246,202,${0.35 + wake * 0.25})`);
  glow.addColorStop(1, "rgba(255,246,202,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fillStyle = "#fff2bd";
  ctx.fill();

  ctx.strokeStyle = "#d8c886";
  ctx.lineWidth = 2;
  ctx.stroke();

  const blink = 0.28 + wake * 0.9 + Math.sin(elapsed * 0.9) * 0.06;
  const eyeOpen = clamp(blink, 0.2, 1.1);
  const eyeRy = moonR * 0.11 * eyeOpen;
  const eyeRx = moonR * 0.09;

  ctx.fillStyle = "#141a2d";
  ctx.beginPath();
  ctx.ellipse(moonX - moonR * 0.28, moonY - moonR * 0.08, eyeRx, eyeRy, 0, 0, Math.PI * 2);
  ctx.ellipse(moonX + moonR * 0.28, moonY - moonR * 0.08, eyeRx, eyeRy, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#141a2d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const smile = 0.18 + wake * 0.14;
  ctx.arc(moonX, moonY + moonR * 0.2, moonR * 0.36, Math.PI * (1.0 + smile), Math.PI * (2.0 - smile));
  ctx.stroke();
}

function drawSparks(elapsed) {
  for (const s of sparks) {
    const p = worldToCanvas(s.x, s.y);
    const r = unitToCanvas(s.r) * (0.8 + Math.sin(elapsed * 5 + s.phase) * 0.2);

    ctx.beginPath();
    ctx.arc(p.x, p.y, r * 1.65, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(147,208,255,0.24)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.fillStyle = "#9fd5ff";
    ctx.fill();
  }
}

function drawShadows(elapsed) {
  for (const s of shadows) {
    const p = worldToCanvas(s.x, s.y);
    const r = unitToCanvas(s.r);

    ctx.beginPath();
    ctx.ellipse(p.x, p.y, r * 1.05, r * 0.9 + Math.sin(elapsed * 3 + s.wobble) * 0.8, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(17,24,54,0.95)";
    ctx.fill();

    ctx.beginPath();
    ctx.ellipse(p.x + r * 0.15, p.y - r * 0.2, r * 0.3, r * 0.24, 0, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(148,167,255,0.15)";
    ctx.fill();
  }
}

function drawPlayer(elapsed) {
  const p = worldToCanvas(player.x, player.y);
  const r = unitToCanvas(player.r);
  const bob = Math.sin(elapsed * 7) * r * 0.07;

  ctx.beginPath();
  ctx.arc(p.x, p.y + bob, r * 1.7, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(117,250,199,0.18)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(p.x, p.y + bob, r, 0, Math.PI * 2);
  ctx.fillStyle = "#74ffbc";
  ctx.fill();

  ctx.fillStyle = "#0c4233";
  ctx.beginPath();
  ctx.arc(p.x - r * 0.32, p.y - r * 0.1 + bob, r * 0.13, 0, Math.PI * 2);
  ctx.arc(p.x + r * 0.32, p.y - r * 0.1 + bob, r * 0.13, 0, Math.PI * 2);
  ctx.fill();
}

function tick(now) {
  const dt = Math.min((now - state.lastStamp) / 1000, 0.04);
  state.lastStamp = now;
  const elapsed = now / 1000;

  if (state.running) {
    handleMovement(dt);
    updateShadows(dt, elapsed);
    checkCollisions();
    updateTimer(dt);
  }

  drawBackground(elapsed);
  drawMoon(elapsed);
  drawSparks(elapsed);
  drawShadows(elapsed);
  drawPlayer(elapsed);

  requestAnimationFrame(tick);
}

window.addEventListener("resize", resizeCanvas);

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["arrowleft", "arrowright", "arrowup", "arrowdown", "w", "a", "s", "d"].includes(key)) {
    event.preventDefault();
  }
  state.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.key.toLowerCase());
});

function resetStick() {
  state.joyX = 0;
  state.joyY = 0;
  state.joyPointerId = null;
  stickThumb.style.transform = "translate(-50%, -50%)";
}

function updateStick(clientX, clientY) {
  const rect = stickBase.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const maxDist = rect.width * 0.31;

  let dx = clientX - cx;
  let dy = clientY - cy;
  const len = Math.hypot(dx, dy);
  if (len > maxDist) {
    dx = (dx / len) * maxDist;
    dy = (dy / len) * maxDist;
  }

  state.joyX = dx / maxDist;
  state.joyY = dy / maxDist;

  stickThumb.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

stickBase.addEventListener("pointerdown", (event) => {
  state.joyPointerId = event.pointerId;
  stickBase.setPointerCapture(event.pointerId);
  updateStick(event.clientX, event.clientY);
  event.preventDefault();
});

stickBase.addEventListener("pointermove", (event) => {
  if (event.pointerId !== state.joyPointerId) return;
  updateStick(event.clientX, event.clientY);
  event.preventDefault();
});

const finishStick = (event) => {
  if (event.pointerId !== state.joyPointerId) return;
  resetStick();
  event.preventDefault();
};

stickBase.addEventListener("pointerup", finishStick);
stickBase.addEventListener("pointercancel", finishStick);
stickBase.addEventListener("lostpointercapture", resetStick);

restartBtn.addEventListener("click", resetRound);

resizeCanvas();
resetRound();
requestAnimationFrame(tick);
