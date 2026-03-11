const canvas = document.getElementById("arena");

const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const heartsEl = document.getElementById("hearts");
const hostNameEl = document.getElementById("hostName");
const challengeNameEl = document.getElementById("challengeName");
const hostLineEl = document.getElementById("hostLine");
const challengeInfoEl = document.getElementById("challengeInfo");
const creatorStatusEl = document.getElementById("creatorStatus");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const recordBtn = document.getElementById("recordBtn");
const recordStatusEl = document.getElementById("recordStatus");
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

const CUSTOM_STORAGE_KEY = "object-show-party-custom-characters-v2";

const DEFAULT_CHARACTERS = [
  { id: "gluey", label: "Gluey", main: "#f7f9ff", accent: "#43c6f2", kind: "tube" },
  { id: "piney", label: "Piney", main: "#30c151", accent: "#1c913a", kind: "tree" },
  { id: "photoy", label: "Photoy", main: "#f36186", accent: "#4d74d8", kind: "frame" },
  { id: "bagely", label: "Bagely", main: "#f1ddad", accent: "#d7c18e", kind: "ring" },
  { id: "booksy", label: "Booksy", main: "#31b9d3", accent: "#3ec243", kind: "book" },
  { id: "ballsy", label: "Ballsy", main: "#f4d65c", accent: "#6bd1f8", kind: "ball" }
];

const HOSTS = [
  { name: "Cloud Host", line: "Welcome to the infinite world challenge!", kind: "frame", main: "#f3fdff", accent: "#77c8ff" },
  { name: "Star Host", line: "Beat all rounds and become the winner!", kind: "ball", main: "#ffd365", accent: "#ff8f62" },
  { name: "Neon Host", line: "Move fast. Dodge danger. Collect stars!", kind: "tube", main: "#f7f6ff", accent: "#45e29f" }
];

const CHALLENGES = [
  {
    key: "collect",
    title: "Collect 8 stars",
    detail: "Challenge 1: Collect 8 stars.",
    duration: 28,
    goal: 8,
    spawnInterval: 0.65,
    badRate: 0.2
  },
  {
    key: "survive",
    title: "Survive hazard round",
    detail: "Challenge 2: Survive the danger balls.",
    duration: 22,
    goal: 0,
    spawnInterval: 0.48,
    badRate: 0.58
  },
  {
    key: "final",
    title: "Reach score 18",
    detail: "Final Challenge: Reach score 18.",
    duration: 35,
    goal: 18,
    spawnInterval: 0.56,
    badRate: 0.28
  }
];

let characterPool = [...DEFAULT_CHARACTERS];
let playerMesh = null;
let hostMesh = null;
let mediaRecorder = null;
let recordedChunks = [];
let recording = false;
let pulseTimer = null;
let lastAddPressAt = 0;

const state = {
  running: false,
  over: false,
  score: 0,
  hearts: 3,
  host: HOSTS[0],
  selected: characterPool[0],
  challengeIndex: 0,
  challengeProgress: 0,
  timeLeft: CHALLENGES[0].duration,
  spawnAccumulator: 0,
  worldSpeed: 11,
  pickups: []
};

const controls = {
  left: false,
  right: false,
  jump: false,
  jumpQueued: false
};

const player = {
  x: 0,
  y: 1,
  vx: 0,
  vy: 0,
  moveSpeed: 8,
  gravity: -23,
  jumpPower: 9,
  onGround: true,
  flyFuel: 2.4,
  maxFlyFuel: 2.4
};

const world = {
  laneMin: -4,
  laneMax: 4,
  floorY: 0,
  playerZ: 0,
  segmentLength: 18,
  segments: [],
  segmentCount: 10
};

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.setSize(canvas.clientWidth || 960, canvas.clientHeight || 540, false);

const scene = new THREE.Scene();
scene.background = new THREE.Color("#89ddff");
scene.fog = new THREE.Fog("#9ce8ff", 16, 90);

const camera = new THREE.PerspectiveCamera(58, 16 / 9, 0.1, 220);
camera.position.set(0, 5.4, 11.2);
camera.lookAt(0, 1.5, 0);

const hemi = new THREE.HemisphereLight("#d7fbff", "#6ab985", 0.95);
scene.add(hemi);

const sun = new THREE.DirectionalLight("#fff5d6", 0.95);
sun.position.set(6, 14, 8);
scene.add(sun);

const roadGroup = new THREE.Group();
scene.add(roadGroup);

const skyStars = new THREE.Group();
scene.add(skyStars);

function makeSkyStars() {
  skyStars.clear();
  const starGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const starMat = new THREE.MeshBasicMaterial({ color: "#ffffff" });
  for (let i = 0; i < 90; i += 1) {
    const s = new THREE.Mesh(starGeo, starMat);
    s.position.set((Math.random() - 0.5) * 36, Math.random() * 8 + 3, -Math.random() * 92 - 4);
    skyStars.add(s);
  }
}

function makeRoadSegments() {
  world.segments = [];
  roadGroup.clear();

  const roadGeo = new THREE.BoxGeometry(12.5, 0.25, world.segmentLength);
  const sideGeo = new THREE.BoxGeometry(2.3, 0.15, world.segmentLength);

  for (let i = 0; i < world.segmentCount; i += 1) {
    const z = -i * world.segmentLength;

    const road = new THREE.Mesh(
      roadGeo,
      new THREE.MeshStandardMaterial({ color: i % 2 ? "#2f965f" : "#2a8754", roughness: 0.95 })
    );
    road.position.set(0, -0.12, z);

    const leftGrass = new THREE.Mesh(
      sideGeo,
      new THREE.MeshStandardMaterial({ color: "#4ec06f", roughness: 1 })
    );
    leftGrass.position.set(-7.2, -0.05, z);

    const rightGrass = leftGrass.clone();
    rightGrass.position.x = 7.2;

    roadGroup.add(road, leftGrass, rightGrass);
    world.segments.push({ road, leftGrass, rightGrass });
  }
}

function setElText(el, text) {
  if (el) el.textContent = text;
}

function setMessage(text) {
  if (!messageEl) return;
  messageEl.textContent = text;
  if (text) messageEl.classList.remove("hide");
  else messageEl.classList.add("hide");
}

function updateCreatorStatus(text) {
  setElText(creatorStatusEl, text);
}

function updateRecordStatus(text) {
  setElText(recordStatusEl, text);
}

function currentChallenge() {
  return CHALLENGES[state.challengeIndex];
}

function chooseHost() {
  state.host = HOSTS[Math.floor(Math.random() * HOSTS.length)];
}

function setHostLine(text) {
  setElText(hostLineEl, `Host says: ${text}`);
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
  } catch (_err) {
    updateCreatorStatus("Saved for now, but browser storage is blocked.");
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
      .slice(0, 40)
      .map(item => ({
        id: item.id || makeCharacterId(String(item.label)),
        label: String(item.label).slice(0, 20),
        kind: String(item.kind),
        main: String(item.main),
        accent: String(item.accent),
        custom: true
      }));

    characterPool = [...DEFAULT_CHARACTERS, ...loaded];
    state.selected = characterPool[0];
  } catch (_err) {
    characterPool = [...DEFAULT_CHARACTERS];
    state.selected = characterPool[0];
  }
}

function makeCharacterMesh(character, scale = 1) {
  const group = new THREE.Group();
  const main = new THREE.Color(character.main);
  const accent = new THREE.Color(character.accent);
  const dark = new THREE.Color("#111111");

  const bodyMat = new THREE.MeshStandardMaterial({ color: main, roughness: 0.62, metalness: 0.1 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.5, metalness: 0.15 });
  const darkMat = new THREE.MeshStandardMaterial({ color: dark, roughness: 0.9 });

  if (character.kind === "tube") {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 2.2, 24), bodyMat);
    body.position.y = 1.4;
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.5, 18), accentMat);
    cap.position.y = 2.7;
    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.05, 1.15, 0.35, 24), accentMat);
    base.position.y = 0.28;
    group.add(body, cap, base);
  } else if (character.kind === "tree") {
    const coneA = new THREE.Mesh(new THREE.ConeGeometry(1.1, 1.7, 22), bodyMat);
    coneA.position.y = 2.2;
    const coneB = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.85, 22), accentMat);
    coneB.position.y = 1.45;
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.2, 1, 12), new THREE.MeshStandardMaterial({ color: "#97b55d" }));
    trunk.position.y = 0.35;
    group.add(coneA, coneB, trunk);
  } else if (character.kind === "frame") {
    const out = new THREE.Mesh(new THREE.BoxGeometry(2.15, 2.15, 0.3), new THREE.MeshStandardMaterial({ color: "#ffffff" }));
    out.position.y = 1.4;
    const inA = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 0.15), accentMat);
    inA.position.set(0, 1.72, 0.24);
    const inB = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.75, 0.15), bodyMat);
    inB.position.set(0, 1.1, 0.24);
    group.add(out, inA, inB);
  } else if (character.kind === "ring") {
    const tor = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.34, 20, 44), bodyMat);
    tor.position.y = 1.38;
    const edge = new THREE.Mesh(new THREE.TorusGeometry(1.02, 0.08, 12, 42), accentMat);
    edge.position.y = 1.38;
    group.add(tor, edge);
  } else if (character.kind === "book") {
    const book = new THREE.Mesh(new THREE.BoxGeometry(1.75, 2.25, 0.72), bodyMat);
    book.position.y = 1.38;
    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.32, 2.25, 0.75), accentMat);
    spine.position.set(-0.72, 1.38, 0.02);
    group.add(book, spine);
  } else {
    const ball = new THREE.Mesh(new THREE.SphereGeometry(1.05, 24, 24), bodyMat);
    ball.position.y = 1.4;
    const stripe = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.1, 10, 42), accentMat);
    stripe.rotation.x = Math.PI / 2;
    stripe.position.y = 1.4;
    group.add(ball, stripe);
  }

  const eyeGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const eyeL = new THREE.Mesh(eyeGeo, darkMat);
  const eyeR = new THREE.Mesh(eyeGeo, darkMat);
  eyeL.position.set(-0.24, 1.55, 0.92);
  eyeR.position.set(0.24, 1.55, 0.92);

  const mouth = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.03, 10, 24, Math.PI), darkMat);
  mouth.position.set(0, 1.22, 0.93);
  mouth.rotation.z = Math.PI;

  group.add(eyeL, eyeR, mouth);
  group.scale.setScalar(scale);
  return group;
}

function setPlayerCharacter(character) {
  state.selected = character;
  if (playerMesh) scene.remove(playerMesh);
  playerMesh = makeCharacterMesh(character, 0.92);
  playerMesh.position.set(player.x, player.y, world.playerZ);
  scene.add(playerMesh);
}

function setHostCharacter() {
  if (hostMesh) scene.remove(hostMesh);
  hostMesh = makeCharacterMesh(state.host, 0.65);
  hostMesh.position.set(5.8, 3.6, -8.2);
  scene.add(hostMesh);
}

function refreshCharacterButtons() {
  if (!characterButtons) return;
  characterButtons.innerHTML = "";

  characterPool.forEach(character => {
    const btn = document.createElement("button");
    btn.className = "char-btn";
    btn.type = "button";
    btn.textContent = character.label;
    if (character.id === state.selected.id) btn.classList.add("active");

    btn.addEventListener("click", () => {
      state.selected = character;
      setPlayerCharacter(character);
      [...characterButtons.querySelectorAll(".char-btn")].forEach(node => node.classList.remove("active"));
      btn.classList.add("active");
      updateCreatorStatus(`Selected ${character.label}.`);
    });

    characterButtons.appendChild(btn);
  });
}

function addCustomCharacter() {
  if (characterPool.length >= 60) {
    updateCreatorStatus("Character limit reached. Press Reset to clear gameplay and keep characters.");
    return;
  }

  const typed = customNameInput ? customNameInput.value.trim().slice(0, 20) : "";
  const label = typed || `My Character ${getCustomCharacters().length + 1}`;

  const character = {
    id: makeCharacterId(label),
    label,
    kind: customShapeSelect ? customShapeSelect.value : "ball",
    main: customMainInput ? customMainInput.value : "#ffd66e",
    accent: customAccentInput ? customAccentInput.value : "#5ac8ff",
    custom: true
  };

  characterPool.push(character);
  saveCustomCharacters();
  refreshCharacterButtons();
  setPlayerCharacter(character);
  updateCreatorStatus(`Added ${label}.`);
  updateRecordStatus(`Character ${label} added.`);
  if (customNameInput) customNameInput.value = "";
}

function handleAddCharacterPress(e) {
  if (e) e.preventDefault();
  const now = Date.now();
  if (now - lastAddPressAt < 220) return;
  lastAddPressAt = now;
  addCustomCharacter();
}

function updateHUD() {
  const challenge = currentChallenge();
  setElText(scoreEl, String(state.score));
  setElText(timeEl, String(Math.max(0, Math.ceil(state.timeLeft))));
  setElText(heartsEl, String(state.hearts));
  setElText(hostNameEl, state.host.name);
  setElText(challengeNameEl, challenge.title);

  if (challenge.key === "collect") {
    setElText(challengeInfoEl, `Challenge ${state.challengeIndex + 1}: Collect ${state.challengeProgress}/${challenge.goal} stars.`);
  } else if (challenge.key === "survive") {
    setElText(challengeInfoEl, `Challenge ${state.challengeIndex + 1}: Survive. Time left ${Math.max(0, Math.ceil(state.timeLeft))}s.`);
  } else {
    setElText(challengeInfoEl, `Final Challenge: Reach score ${challenge.goal}. Current score ${state.score}.`);
  }
}

function showPulse(text, ms = 1300) {
  setMessage(text);
  if (pulseTimer) clearTimeout(pulseTimer);
  pulseTimer = setTimeout(() => {
    if (state.running) setMessage("");
    pulseTimer = null;
  }, ms);
}

function clearPickups() {
  state.pickups.forEach(item => scene.remove(item.mesh));
  state.pickups = [];
}

function spawnPickup() {
  const challenge = currentChallenge();
  const isBad = Math.random() < challenge.badRate;

  const geo = isBad
    ? new THREE.SphereGeometry(0.35, 16, 16)
    : new THREE.IcosahedronGeometry(0.34, 0);

  const mat = new THREE.MeshStandardMaterial({
    color: isBad ? "#ff4f5e" : "#ffe45f",
    emissive: isBad ? "#5c0c16" : "#4a3f08",
    emissiveIntensity: 0.5,
    roughness: 0.35,
    metalness: 0.25
  });

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set((Math.random() * 8) - 4, isBad ? 0.9 : 1.35, -78 - Math.random() * 16);
  scene.add(mesh);

  state.pickups.push({
    kind: isBad ? "bad" : "good",
    mesh,
    spinX: (Math.random() - 0.5) * 5,
    spinY: (Math.random() - 0.5) * 5
  });
}

function startChallenge(index) {
  state.challengeIndex = index;
  state.challengeProgress = 0;
  state.timeLeft = CHALLENGES[index].duration;
  state.spawnAccumulator = 0;
  clearPickups();
  setHostLine(`${state.host.line} Now: ${CHALLENGES[index].title}.`);
  updateHUD();
  showPulse(`Round ${index + 1}: ${CHALLENGES[index].title}`);
}

function advanceChallenge() {
  if (state.challengeIndex >= CHALLENGES.length - 1) {
    endGame(`You won all challenges! Final score: ${state.score}`);
    return;
  }
  startChallenge(state.challengeIndex + 1);
}

function endGame(text) {
  state.running = false;
  state.over = true;
  setMessage(text);
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
  state.challengeIndex = 0;
  state.challengeProgress = 0;
  state.timeLeft = CHALLENGES[0].duration;
  state.spawnAccumulator = 0;
  chooseHost();
  setHostCharacter();
  clearPickups();

  player.x = 0;
  player.y = 1;
  player.vx = 0;
  player.vy = 0;
  player.onGround = true;
  player.flyFuel = player.maxFlyFuel;

  controls.left = false;
  controls.right = false;
  controls.jump = false;
  controls.jumpQueued = false;

  setHostLine(`${state.host.line} Pick your character and tap Start.`);
  setMessage("Tap Start to play");
  updateHUD();
}

function startGame() {
  if (state.running) return;
  if (state.over) resetGame();
  state.running = true;
  startChallenge(state.challengeIndex);
}

function recycleRoad(dt) {
  const shift = state.worldSpeed * dt;
  const totalLength = world.segmentLength * world.segmentCount;

  world.segments.forEach(segment => {
    segment.road.position.z += shift;
    segment.leftGrass.position.z += shift;
    segment.rightGrass.position.z += shift;

    if (segment.road.position.z > world.segmentLength) {
      segment.road.position.z -= totalLength;
      segment.leftGrass.position.z -= totalLength;
      segment.rightGrass.position.z -= totalLength;
    }
  });
}

function updatePlayer(dt) {
  player.vx = 0;
  if (controls.left) player.vx -= player.moveSpeed;
  if (controls.right) player.vx += player.moveSpeed;

  if (controls.jumpQueued && player.onGround) {
    player.vy = player.jumpPower;
    player.onGround = false;
    controls.jumpQueued = false;
  }

  if (controls.jump && !player.onGround && player.flyFuel > 0) {
    player.vy += 17 * dt;
    player.flyFuel -= 1.8 * dt;
    if (player.flyFuel < 0) player.flyFuel = 0;
  }

  player.vy += player.gravity * dt;
  player.x += player.vx * dt;
  player.y += player.vy * dt;

  if (player.y <= 1) {
    player.y = 1;
    player.vy = 0;
    player.onGround = true;
    player.flyFuel = Math.min(player.maxFlyFuel, player.flyFuel + 2.2 * dt);
  }

  player.x = Math.max(world.laneMin, Math.min(world.laneMax, player.x));
}

function intersectsPickup(item) {
  const dx = player.x - item.mesh.position.x;
  const dy = player.y - item.mesh.position.y;
  const dz = world.playerZ - item.mesh.position.z;
  return (dx * dx + dy * dy + dz * dz) < 1.2;
}

function updatePickups(dt) {
  const challenge = currentChallenge();
  const move = state.worldSpeed * dt;

  for (let i = state.pickups.length - 1; i >= 0; i -= 1) {
    const item = state.pickups[i];
    item.mesh.position.z += move;
    item.mesh.rotation.x += item.spinX * dt;
    item.mesh.rotation.y += item.spinY * dt;

    if (intersectsPickup(item)) {
      if (item.kind === "good") {
        state.score += 1;
        if (challenge.key === "collect") state.challengeProgress += 1;
      } else {
        state.hearts -= 1;
        showPulse("Ouch!", 500);
      }
      scene.remove(item.mesh);
      state.pickups.splice(i, 1);
      continue;
    }

    if (item.mesh.position.z > 14) {
      scene.remove(item.mesh);
      state.pickups.splice(i, 1);
    }
  }
}

function updateGame(dt) {
  if (!state.running) return;
  const challenge = currentChallenge();

  state.timeLeft -= dt;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    if (challenge.key === "survive") {
      advanceChallenge();
      updateHUD();
      return;
    }
    endGame(`Challenge failed: ${challenge.title}`);
    updateHUD();
    return;
  }

  state.spawnAccumulator += dt;
  if (state.spawnAccumulator > challenge.spawnInterval) {
    state.spawnAccumulator = 0;
    spawnPickup();
  }

  updatePlayer(dt);
  recycleRoad(dt);
  updatePickups(dt);

  if (state.hearts <= 0) {
    endGame("Out of hearts. Try again!");
    updateHUD();
    return;
  }

  if (challenge.key === "collect" && state.challengeProgress >= challenge.goal) {
    advanceChallenge();
    updateHUD();
    return;
  }

  if (challenge.key === "final" && state.score >= challenge.goal) {
    advanceChallenge();
    updateHUD();
    return;
  }

  updateHUD();
}

function renderScene(dt) {
  if (playerMesh) {
    playerMesh.position.set(player.x, player.y, world.playerZ);
    playerMesh.rotation.y = player.vx < -0.1 ? 0.2 : player.vx > 0.1 ? -0.2 : 0;
  }

  if (hostMesh) {
    hostMesh.rotation.y += dt * 0.7;
  }

  camera.position.x += (player.x * 0.18 - camera.position.x) * Math.min(1, dt * 6);
  camera.lookAt(player.x * 0.35, 1.5, 0);
  renderer.render(scene, camera);
}

function recordingMimeType() {
  const types = [
    "video/mp4;codecs=h264",
    "video/mp4",
    "video/webm;codecs=vp9",
    "video/webm"
  ];
  for (const type of types) {
    if (window.MediaRecorder && MediaRecorder.isTypeSupported(type)) return type;
  }
  return "";
}

function setRecordingUi(isRecording) {
  recording = isRecording;
  if (recordBtn) {
    recordBtn.classList.toggle("active", isRecording);
    recordBtn.textContent = isRecording ? "Stop Recording" : "Record Video";
  }
}

async function finalizeRecording(blob, filename) {
  const file = new File([blob], filename, { type: blob.type || "video/mp4" });

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: "My Object Show Video",
        text: "I made this 3D object show video!",
        files: [file]
      });
      updateRecordStatus("Shared. You can also save it to Photos.");
      return;
    } catch (_err) {
      // canceled share
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1800);
  updateRecordStatus("Video downloaded. On iPhone you can Save Video to Photos.");
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

    mediaRecorder.ondataavailable = ev => {
      if (ev.data && ev.data.size > 0) recordedChunks.push(ev.data);
    };

    mediaRecorder.onstop = () => {
      stream.getTracks().forEach(track => track.stop());
      const outputType = mediaRecorder.mimeType || "video/mp4";
      const ext = outputType.includes("mp4") ? "mp4" : "webm";
      const blob = new Blob(recordedChunks, { type: outputType });
      setRecordingUi(false);
      finalizeRecording(blob, `object-show-3d-${Date.now()}.${ext}`);
    };

    mediaRecorder.start(120);
    setRecordingUi(true);
    updateRecordStatus("Recording... tap Stop Recording when done.");
  } catch (_err) {
    setRecordingUi(false);
    updateRecordStatus("Could not start recording. Use Safari on iPhone.");
  }
}

function stopRecording() {
  if (!recording || !mediaRecorder) return;
  if (mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    updateRecordStatus("Processing video...");
  }
}

function onPress(key, active) {
  controls[key] = active;
  if (key === "jump" && active) controls.jumpQueued = true;
}

function bindHoldButton(btn, key) {
  if (!btn) return;

  const down = ev => {
    ev.preventDefault();
    onPress(key, true);
  };

  const up = ev => {
    ev.preventDefault();
    onPress(key, false);
  };

  btn.addEventListener("pointerdown", down);
  btn.addEventListener("pointerup", up);
  btn.addEventListener("pointerleave", up);
  btn.addEventListener("pointercancel", up);
  btn.addEventListener("touchstart", down, { passive: false });
  btn.addEventListener("touchend", up, { passive: false });
}

function onResize() {
  const w = Math.max(320, canvas.clientWidth || 960);
  const h = Math.max(180, canvas.clientHeight || 540);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

let lastTs = performance.now();
function loop(ts) {
  const dt = Math.min(0.05, (ts - lastTs) / 1000 || 0.016);
  lastTs = ts;

  updateGame(dt);
  renderScene(dt);

  requestAnimationFrame(loop);
}

window.addEventListener("keydown", ev => {
  if (["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(ev.key)) ev.preventDefault();
  if (ev.key === "ArrowLeft") onPress("left", true);
  if (ev.key === "ArrowRight") onPress("right", true);
  if (ev.key === "ArrowUp" || ev.key === " ") onPress("jump", true);
});

window.addEventListener("keyup", ev => {
  if (ev.key === "ArrowLeft") onPress("left", false);
  if (ev.key === "ArrowRight") onPress("right", false);
  if (ev.key === "ArrowUp" || ev.key === " ") onPress("jump", false);
});

if (addCharacterBtn) {
  addCharacterBtn.addEventListener("click", handleAddCharacterPress);
  addCharacterBtn.addEventListener("pointerup", handleAddCharacterPress);
  addCharacterBtn.addEventListener("touchend", handleAddCharacterPress, { passive: false });
}

if (customNameInput) {
  customNameInput.addEventListener("keydown", ev => {
    if (ev.key === "Enter") {
      ev.preventDefault();
      addCustomCharacter();
    }
  });
}

if (recordBtn) {
  recordBtn.addEventListener("click", () => {
    if (recording) stopRecording();
    else startRecording();
  });
}

if (startBtn) startBtn.addEventListener("click", startGame);
if (resetBtn) resetBtn.addEventListener("click", resetGame);

bindHoldButton(leftBtn, "left");
bindHoldButton(rightBtn, "right");
bindHoldButton(jumpBtn, "jump");

window.addEventListener("resize", onResize);
window.addEventListener("beforeunload", () => {
  if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
});

loadCustomCharacters();
makeSkyStars();
makeRoadSegments();
chooseHost();
setPlayerCharacter(state.selected);
setHostCharacter();
refreshCharacterButtons();
resetGame();
onResize();
requestAnimationFrame(loop);
