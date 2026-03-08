const sceneEl = document.getElementById("scene");
const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const nextRoundBtn = document.getElementById("nextRound");
const characterNameEl = document.getElementById("characterName");
const roundNumEl = document.getElementById("roundNum");
const remainingCountEl = document.getElementById("remainingCount");
const characterPickerEl = document.getElementById("characterPicker");
const characterInfoEl = document.getElementById("characterInfo");
const facePreviewEl = document.getElementById("facePreview");
const moveWheelEl = document.getElementById("moveWheel");
const moveThumbEl = document.getElementById("moveThumb");
const roundSummaryEl = document.getElementById("roundSummary");
const rosterLineEl = document.getElementById("rosterLine");
const eliminationLineEl = document.getElementById("eliminationLine");
const adminPanelEl = document.getElementById("adminPanel");
const adminToggleBtn = document.getElementById("adminToggle");
const adminFlyBtn = document.getElementById("adminFly");
const adminScoreBtn = document.getElementById("adminScore");
const adminTimeBtn = document.getElementById("adminTime");
const adminWinBtn = document.getElementById("adminWin");
const multiplayerStatusEl = document.getElementById("multiplayerStatus");
const multiplayerCountEl = document.getElementById("multiplayerCount");
const copyRoomLinkBtn = document.getElementById("copyRoomLink");

const world = {
  width: 90,
  depth: 52,
  totalTime: 45,
  targetScore: 12,
};
const ADMIN_LOCKED = true;

const characters = [
  {
    id: "leafy",
    name: "Leafy",
    shape: "leaf",
    speed: 26.5,
    radius: 2,
    bonusTime: 1,
    bio: "Balanced all-rounder.",
  },
  {
    id: "firey",
    name: "Firey",
    shape: "fire",
    speed: 29.5,
    radius: 1.8,
    bonusTime: 0,
    bio: "Fastest movement and quick token runs.",
  },
  {
    id: "bubble",
    name: "Bubble",
    shape: "bubble",
    speed: 24.5,
    radius: 1.6,
    bonusTime: 4,
    bio: "Small hitbox and extra round time.",
  },
  {
    id: "blocky",
    name: "Blocky",
    shape: "block",
    speed: 22,
    radius: 2.4,
    bonusTime: 0,
    bio: "Big body and slower movement.",
  },
  {
    id: "pencil",
    name: "Pencil",
    shape: "pencil",
    speed: 25.2,
    radius: 1.8,
    bonusTime: 2,
    bio: "Solid control with extra time.",
  },
  {
    id: "tennis-ball",
    name: "Tennis Ball",
    shape: "tennis",
    speed: 26,
    radius: 1.9,
    bonusTime: 1,
    bio: "Stable speed and steady rounds.",
  },
  {
    id: "cash",
    name: "Cash",
    shape: "cash",
    speed: 24.8,
    radius: 2.1,
    bonusTime: 2,
    isNew: true,
    bio: "Money stack with extra time and a steady pace.",
  },
  {
    id: "leafy-classic",
    name: "Leafy Classic",
    shape: "leaf-classic",
    speed: 26.2,
    radius: 2,
    bonusTime: 1,
    isNew: true,
    bio: "Classic bright leaf with smooth mobility.",
  },
  {
    id: "teardrop",
    name: "Teardrop",
    shape: "teardrop",
    speed: 27.2,
    radius: 1.9,
    bonusTime: 1,
    isNew: true,
    bio: "Fast blue droplet with a compact frame.",
  },
  {
    id: "lava-lamp",
    name: "Lava Lamp",
    shape: "lava-lamp",
    speed: 23.4,
    radius: 2.2,
    bonusTime: 2,
    isNew: true,
    bio: "Heavy lamp body with strong round endurance.",
  },
  {
    id: "lollipop",
    name: "Lollipop",
    shape: "lollipop",
    speed: 25.7,
    radius: 1.95,
    bonusTime: 2,
    isNew: true,
    bio: "Tall candy build with balanced stats.",
  },
  {
    id: "blocky-red",
    name: "Red Blocky",
    shape: "blocky-red",
    speed: 22.5,
    radius: 2.35,
    bonusTime: 1,
    isNew: true,
    bio: "Confident red cube with sturdy control.",
  },
  {
    id: "syringe",
    name: "Syringe",
    shape: "syringe",
    speed: 24.9,
    radius: 2.05,
    bonusTime: 2,
    isNew: true,
    bio: "Tall syringe body with careful, steady movement.",
  },
  {
    id: "nickel-note",
    name: "Nickel Note",
    shape: "nickel-note",
    speed: 23.9,
    radius: 2.2,
    bonusTime: 2,
    isNew: true,
    bio: "Angry nickel carrying a to-do sign.",
  },
  {
    id: "syringe-side",
    name: "Syringe Side",
    shape: "syringe-side",
    speed: 25.5,
    radius: 2.1,
    bonusTime: 1,
    isNew: true,
    bio: "Horizontal syringe with a focused expression.",
  },
  {
    id: "glue-bottle",
    name: "Glue Bottle",
    shape: "glue-bottle",
    speed: 24.6,
    radius: 2.1,
    bonusTime: 2,
    isNew: true,
    bio: "Sturdy glue bottle with steady control.",
  },
  {
    id: "pine-tree",
    name: "Pine Tree",
    shape: "pine-tree",
    speed: 23.5,
    radius: 2.25,
    bonusTime: 1,
    isNew: true,
    bio: "Wide tree frame with strong reach.",
  },
  {
    id: "photo-frame",
    name: "Photo Frame",
    shape: "photo-frame",
    speed: 25.8,
    radius: 1.95,
    bonusTime: 1,
    isNew: true,
    bio: "Light frame build with balanced speed.",
  },
  {
    id: "donut",
    name: "Donut",
    shape: "donut",
    speed: 25.1,
    radius: 2,
    bonusTime: 2,
    isNew: true,
    bio: "Round ring body with smooth movement.",
  },
  {
    id: "book",
    name: "Book",
    shape: "book",
    speed: 24.2,
    radius: 2.15,
    bonusTime: 2,
    isNew: true,
    bio: "Heavy cover with reliable timing boosts.",
  },
  {
    id: "beach-ball",
    name: "Beach Ball",
    shape: "beach-ball",
    speed: 26.6,
    radius: 1.85,
    bonusTime: 1,
    isNew: true,
    bio: "Bouncy ball with quick mobility.",
  },
];

const state = {
  running: true,
  score: 0,
  timeLeft: world.totalTime,
  keys: new Set(),
  touchMoveX: 0,
  touchMoveZ: 0,
  touchPointerId: null,
  secondTick: 0,
  selectedCharacterId: "leafy-classic",
  round: 1,
  activeContestants: [],
  eliminatedContestants: [],
  roundEnded: false,
  seasonOver: false,
  playerWonRound: false,
  lastCeremonySummary: "Finish a round to start elimination.",
  adminMode: false,
  adminFly: true,
};

const player = {
  x: 0,
  z: 0,
  radius: 2,
  speed: 26,
  mesh: null,
};

const tokens = [];
const hazards = [];
const castShowcase = [];

let fallbackCanvas = null;
let fallbackCtx = null;
let usingFallbackRenderer = false;

const multiplayer = {
  roomId: "",
  hostPeerId: "",
  localPeerId: "",
  isHost: false,
  peer: null,
  hostConn: null,
  hostConnections: new Map(),
  remotePlayers: new Map(),
  snapshotPlayers: [],
  sendTick: 0,
  statusText: "Offline",
  localColor: "#5f7cff",
};

const renderer = (() => {
  try {
    const webglRenderer = new THREE.WebGLRenderer({ antialias: true });
    webglRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    sceneEl.appendChild(webglRenderer.domElement);
    return webglRenderer;
  } catch (error) {
    usingFallbackRenderer = true;
    fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.width = 900;
    fallbackCanvas.height = 520;
    fallbackCanvas.style.width = "100%";
    fallbackCanvas.style.height = "100%";
    fallbackCanvas.style.display = "block";
    sceneEl.innerHTML = "";
    sceneEl.appendChild(fallbackCanvas);
    fallbackCtx = fallbackCanvas.getContext("2d");

    return {
      setPixelRatio() {},
      setSize(width, height) {
        fallbackCanvas.width = Math.max(1, Math.floor(width));
        fallbackCanvas.height = Math.max(1, Math.floor(height));
      },
      render() {
        if (!fallbackCtx) {
          return;
        }

        const w = fallbackCanvas.width;
        const h = fallbackCanvas.height;

        const xToScreen = (x) => ((x + world.width / 2) / world.width) * w;
        const zToScreen = (z) => ((z + world.depth / 2) / world.depth) * h;
        const scaleX = w / world.width;
        const scaleY = h / world.depth;
        const scale = Math.min(scaleX, scaleY);

        fallbackCtx.clearRect(0, 0, w, h);
        const bg = fallbackCtx.createLinearGradient(0, 0, 0, h);
        bg.addColorStop(0, "#d8f7ff");
        bg.addColorStop(1, "#ddffde");
        fallbackCtx.fillStyle = bg;
        fallbackCtx.fillRect(0, 0, w, h);

        for (const hazard of hazards) {
          const hx = xToScreen(hazard.x - hazard.w / 2);
          const hy = zToScreen(hazard.z - hazard.d / 2);
          const hw = hazard.w * scaleX;
          const hh = hazard.d * scaleY;

          fallbackCtx.fillStyle = "#242833";
          fallbackCtx.fillRect(hx, hy, hw, hh);
          fallbackCtx.fillStyle = "#3a4150";
          fallbackCtx.fillRect(hx + hw * 0.12, hy + hh * 0.1, hw * 0.76, hh * 0.8);

          fallbackCtx.fillStyle = "#101317";
          fallbackCtx.beginPath();
          fallbackCtx.arc(hx + hw * 0.5, hy + hh * 0.34, Math.max(3, hh * 0.15), 0, Math.PI * 2);
          fallbackCtx.arc(hx + hw * 0.5, hy + hh * 0.68, Math.max(5, hh * 0.21), 0, Math.PI * 2);
          fallbackCtx.fill();
        }

        for (const token of tokens) {
          fallbackCtx.beginPath();
          fallbackCtx.arc(xToScreen(token.x), zToScreen(token.z), token.radius * scale, 0, Math.PI * 2);
          fallbackCtx.fillStyle = "#ff9d2d";
          fallbackCtx.fill();
        }

        for (const hunter of castShowcase) {
          fallbackCtx.beginPath();
          fallbackCtx.arc(xToScreen(hunter.x), zToScreen(hunter.z), Math.max(7, hunter.radius * scale), 0, Math.PI * 2);
          fallbackCtx.fillStyle = "#5d667a";
          fallbackCtx.fill();
          fallbackCtx.strokeStyle = "#1f2530";
          fallbackCtx.lineWidth = 2;
          fallbackCtx.stroke();
        }

        const character = getSelectedCharacter();
        const px = xToScreen(player.x);
        const py = zToScreen(player.z);
        const r = Math.max(10, player.radius * scale);

        if (character.shape === "blocky-red" || character.shape === "block") {
          fallbackCtx.fillStyle = character.shape === "blocky-red" ? "#ed4646" : "#f0ca2b";
          fallbackCtx.fillRect(px - r, py - r, r * 2, r * 2);
        } else if (character.shape === "syringe") {
          fallbackCtx.fillStyle = "#ececf3";
          fallbackCtx.fillRect(px - r * 0.4, py - r * 1.35, r * 0.8, r * 2.35);
          fallbackCtx.fillStyle = "#e267da";
          fallbackCtx.fillRect(px - r * 0.36, py + r * 0.2, r * 0.72, r * 0.82);
          fallbackCtx.fillStyle = "#111";
          fallbackCtx.fillRect(px - r * 0.42, py + r * 0.08, r * 0.84, r * 0.14);
          fallbackCtx.fillStyle = "#c3c3cd";
          fallbackCtx.fillRect(px - r * 0.63, py - r * 1.52, r * 1.26, r * 0.22);
        } else if (character.shape === "syringe-side") {
          fallbackCtx.fillStyle = "#ececf3";
          fallbackCtx.fillRect(px - r * 1.25, py - r * 0.42, r * 2.45, r * 0.84);
          fallbackCtx.fillStyle = "#e267da";
          fallbackCtx.fillRect(px - r * 0.2, py + r * 0.02, r * 1.05, r * 0.34);
          fallbackCtx.fillStyle = "#8fd6d8";
          fallbackCtx.fillRect(px + r * 1.18, py - r * 0.1, r * 0.55, r * 0.2);
          fallbackCtx.fillStyle = "#c3c3cd";
          fallbackCtx.fillRect(px - r * 1.55, py - r * 0.14, r * 0.3, r * 0.28);
        } else if (character.shape === "nickel-note") {
          fallbackCtx.fillStyle = "#f8f8fc";
          fallbackCtx.fillRect(px - r * 1.75, py - r * 1.25, r * 1.12, r * 1.5);
          fallbackCtx.strokeStyle = "#555b67";
          fallbackCtx.lineWidth = 2;
          fallbackCtx.strokeRect(px - r * 1.75, py - r * 1.25, r * 1.12, r * 1.5);
          fallbackCtx.beginPath();
          fallbackCtx.arc(px, py, r, 0, Math.PI * 2);
          fallbackCtx.fillStyle = "#9b9da3";
          fallbackCtx.fill();
        } else if (character.shape === "lollipop") {
          fallbackCtx.strokeStyle = "#d9d9d9";
          fallbackCtx.lineWidth = Math.max(3, r * 0.28);
          fallbackCtx.beginPath();
          fallbackCtx.moveTo(px, py + r * 1.8);
          fallbackCtx.lineTo(px, py + r * 0.3);
          fallbackCtx.stroke();
          fallbackCtx.beginPath();
          fallbackCtx.arc(px, py, r * 1.1, 0, Math.PI * 2);
          fallbackCtx.fillStyle = "#9f18ff";
          fallbackCtx.fill();
        } else if (character.shape === "glue-bottle") {
          fallbackCtx.fillStyle = "#6ed4ff";
          fallbackCtx.fillRect(px - r * 0.32, py - r * 1.55, r * 0.64, r * 0.58);
          fallbackCtx.fillStyle = "#f0f6ff";
          fallbackCtx.fillRect(px - r * 0.86, py - r * 1.02, r * 1.72, r * 1.72);
          fallbackCtx.fillStyle = "#4cc3f4";
          fallbackCtx.fillRect(px - r * 0.92, py + r * 0.64, r * 1.84, r * 0.42);
        } else if (character.shape === "pine-tree") {
          fallbackCtx.fillStyle = "#1fa84b";
          for (let i = 0; i < 4; i += 1) {
            const layerW = r * (2.3 - i * 0.28);
            const layerY = py - r * (1.5 - i * 0.55);
            fallbackCtx.beginPath();
            fallbackCtx.moveTo(px, layerY - r * 0.72);
            fallbackCtx.lineTo(px - layerW / 2, layerY + r * 0.42);
            fallbackCtx.lineTo(px + layerW / 2, layerY + r * 0.42);
            fallbackCtx.closePath();
            fallbackCtx.fill();
          }
          fallbackCtx.fillStyle = "#9fbf63";
          fallbackCtx.fillRect(px - r * 0.16, py - r * 0.3, r * 0.32, r * 1.2);
        } else if (character.shape === "photo-frame") {
          fallbackCtx.fillStyle = "#f4f7ff";
          fallbackCtx.fillRect(px - r * 1.15, py - r * 1.15, r * 2.3, r * 2.3);
          fallbackCtx.strokeStyle = "#9aa6b2";
          fallbackCtx.lineWidth = 2;
          fallbackCtx.strokeRect(px - r * 1.15, py - r * 1.15, r * 2.3, r * 2.3);
          fallbackCtx.fillStyle = "#4f77e6";
          fallbackCtx.fillRect(px - r * 0.86, py - r * 0.86, r * 1.72, r * 0.88);
          fallbackCtx.fillStyle = "#f25f7f";
          fallbackCtx.fillRect(px - r * 0.86, py + r * 0.02, r * 1.72, r * 0.84);
          fallbackCtx.fillStyle = "#f6d34a";
          fallbackCtx.beginPath();
          fallbackCtx.arc(px + r * 0.45, py + r * 0.55, r * 0.3, 0, Math.PI * 2);
          fallbackCtx.fill();
        } else if (character.shape === "donut") {
          fallbackCtx.strokeStyle = "#f0dca5";
          fallbackCtx.lineWidth = Math.max(5, r * 0.92);
          fallbackCtx.beginPath();
          fallbackCtx.arc(px, py, r * 0.82, 0, Math.PI * 2);
          fallbackCtx.stroke();
          fallbackCtx.strokeStyle = "#d9bf7c";
          fallbackCtx.lineWidth = Math.max(3, r * 0.2);
          fallbackCtx.beginPath();
          fallbackCtx.arc(px, py, r * 0.55, 0, Math.PI * 2);
          fallbackCtx.stroke();
        } else if (character.shape === "book") {
          fallbackCtx.fillStyle = "#27a8c8";
          fallbackCtx.fillRect(px - r * 1.02, py - r * 1.24, r * 2.04, r * 2.48);
          fallbackCtx.fillStyle = "#2cc23b";
          fallbackCtx.fillRect(px - r * 1.02, py - r * 1.24, r * 0.8, r * 2.48);
          fallbackCtx.strokeStyle = "#0e5f6f";
          fallbackCtx.lineWidth = 2;
          fallbackCtx.strokeRect(px - r * 1.02, py - r * 1.24, r * 2.04, r * 2.48);
        } else if (character.shape === "beach-ball") {
          fallbackCtx.fillStyle = "#f6f8ff";
          fallbackCtx.beginPath();
          fallbackCtx.arc(px, py, r, 0, Math.PI * 2);
          fallbackCtx.fill();
          const wedges = [
            { color: "#f05454", start: -Math.PI * 0.9, end: -Math.PI * 0.55 },
            { color: "#f0e448", start: -Math.PI * 0.55, end: -Math.PI * 0.15 },
            { color: "#73e35c", start: -Math.PI * 0.15, end: Math.PI * 0.2 },
            { color: "#4fa8ff", start: Math.PI * 0.2, end: Math.PI * 0.62 },
            { color: "#f39b56", start: Math.PI * 0.62, end: Math.PI * 1.04 },
          ];
          for (const wedge of wedges) {
            fallbackCtx.beginPath();
            fallbackCtx.moveTo(px, py);
            fallbackCtx.arc(px, py, r * 0.96, wedge.start, wedge.end);
            fallbackCtx.closePath();
            fallbackCtx.fillStyle = wedge.color;
            fallbackCtx.fill();
          }
        } else {
          fallbackCtx.beginPath();
          fallbackCtx.arc(px, py, r, 0, Math.PI * 2);
          const fillByShape = {
            cash: "#a7d6ad",
            "leaf-classic": "#57e000",
            teardrop: "#66c8f2",
            "lava-lamp": "#ff6a00",
            "glue-bottle": "#f0f6ff",
            "pine-tree": "#1fa84b",
            "photo-frame": "#f4f7ff",
            donut: "#f0dca5",
            book: "#27a8c8",
            "beach-ball": "#f6f8ff",
            leaf: "#2da44e",
            fire: "#ff7a00",
            bubble: "#8fd8ff",
            pencil: "#f6d574",
            tennis: "#b6e240",
          };
          fallbackCtx.fillStyle = fillByShape[character.shape] || "#2da44e";
          fallbackCtx.fill();
        }

        fallbackCtx.fillStyle = "#111";
        fallbackCtx.font = "700 18px Trebuchet MS, sans-serif";
        fallbackCtx.fillText(`Fallback View: ${character.name}`, 14, 26);
      },
    };
  }
})();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x98dcff);

const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 500);
camera.position.set(0, 18, 20);
camera.lookAt(0, 1.8, 0);

const hemiLight = new THREE.HemisphereLight(0xc8efff, 0xb8d5a0, 0.92);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.05);
dirLight.position.set(30, 55, 20);
scene.add(dirLight);

const ocean = new THREE.Mesh(
  new THREE.CircleGeometry(210, 84),
  new THREE.MeshStandardMaterial({ color: 0x41b7ea, roughness: 0.35, metalness: 0.05 })
);
ocean.rotation.x = -Math.PI / 2;
ocean.position.y = -2.5;
scene.add(ocean);

const islandBase = new THREE.Mesh(
  new THREE.CylinderGeometry(82, 90, 4.2, 48),
  new THREE.MeshStandardMaterial({ color: 0xe6c892, roughness: 0.82, metalness: 0.01 })
);
islandBase.position.y = -1.1;
scene.add(islandBase);

const beachRing = new THREE.Mesh(
  new THREE.RingGeometry(60, 84, 56),
  new THREE.MeshStandardMaterial({ color: 0xf5dcaa, roughness: 0.88, metalness: 0.01 })
);
beachRing.rotation.x = -Math.PI / 2;
beachRing.position.y = 0.03;
scene.add(beachRing);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(world.width, world.depth),
  new THREE.MeshStandardMaterial({ color: 0x87dd75, roughness: 0.92, metalness: 0.02 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0.04;
scene.add(ground);

const playFieldPlate = new THREE.Mesh(
  new THREE.BoxGeometry(world.width + 4, 1.25, world.depth + 4),
  new THREE.MeshStandardMaterial({ color: 0x5a7d45, roughness: 0.68, metalness: 0.02 })
);
playFieldPlate.position.y = -0.85;
scene.add(playFieldPlate);

function addBoundaryWall(x, z, sx, sz) {
  const wall = new THREE.Mesh(
    new THREE.BoxGeometry(sx, 2.4, sz),
    new THREE.MeshStandardMaterial({ color: 0x81684f, roughness: 0.7 })
  );
  wall.position.set(x, 1.1, z);
  scene.add(wall);
}

addBoundaryWall(0, -world.depth / 2 - 1, world.width + 2, 2);
addBoundaryWall(0, world.depth / 2 + 1, world.width + 2, 2);
addBoundaryWall(-world.width / 2 - 1, 0, 2, world.depth + 2);
addBoundaryWall(world.width / 2 + 1, 0, 2, world.depth + 2);

function addPalmTree(x, z, scale) {
  const tree = new THREE.Group();

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.42 * scale, 0.58 * scale, 5.2 * scale, 10),
    new THREE.MeshStandardMaterial({ color: 0x8d623c, roughness: 0.74 })
  );
  trunk.position.y = 2.6 * scale;
  trunk.rotation.z = 0.08;
  tree.add(trunk);

  for (let i = 0; i < 6; i += 1) {
    const leaf = new THREE.Mesh(
      new THREE.ConeGeometry(0.46 * scale, 4.8 * scale, 10),
      new THREE.MeshStandardMaterial({ color: 0x2eb84e, roughness: 0.66 })
    );
    leaf.position.y = 5.3 * scale;
    leaf.rotation.z = Math.PI / 2;
    leaf.rotation.y = (i / 6) * Math.PI * 2;
    tree.add(leaf);
  }

  tree.position.set(x, 0, z);
  scene.add(tree);
}

function addHill(x, z, radius, height, color) {
  const hill = new THREE.Mesh(
    new THREE.ConeGeometry(radius, height, 24),
    new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0 })
  );
  hill.position.set(x, height / 2 - 0.7, z);
  scene.add(hill);
}

function addCloud(x, y, z, scale) {
  const cloud = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.35, metalness: 0 });
  const parts = [
    { x: 0, y: 0, r: 1.2 },
    { x: 1.2, y: 0.25, r: 1.05 },
    { x: -1.15, y: 0.15, r: 0.95 },
    { x: 0.35, y: 0.65, r: 0.9 },
  ];

  for (const part of parts) {
    const puff = new THREE.Mesh(new THREE.SphereGeometry(part.r * scale, 14, 12), mat);
    puff.position.set(part.x * scale, part.y * scale, 0);
    cloud.add(puff);
  }

  cloud.position.set(x, y, z);
  scene.add(cloud);
}

const palmPositions = [
  [-58, -24, 1.05],
  [-52, 10, 0.96],
  [-38, 28, 1.08],
  [42, 30, 1.02],
  [57, 6, 1.1],
  [60, -20, 1.0],
  [18, -33, 0.9],
  [-20, -35, 0.92],
];
for (const [x, z, scale] of palmPositions) {
  addPalmTree(x, z, scale);
}

addHill(-98, -18, 18, 22, 0x7bb45a);
addHill(-86, 22, 14, 16, 0x78ad59);
addHill(86, -8, 15, 18, 0x74a955);
addHill(104, 20, 20, 24, 0x6f9f51);
addHill(6, 98, 24, 26, 0x82ba62);
addHill(-18, -98, 20, 22, 0x79ae5a);

addCloud(-48, 42, -70, 2.8);
addCloud(16, 38, -78, 2.2);
addCloud(66, 44, -62, 2.7);
addCloud(-12, 47, -54, 2.3);

const skyDome = new THREE.Mesh(
  new THREE.SphereGeometry(260, 28, 22),
  new THREE.MeshBasicMaterial({ color: 0x9dd9ff, side: THREE.BackSide })
);
skyDome.position.y = -34;
scene.add(skyDome);

function resizeRenderer() {
  const width = Math.max(sceneEl.clientWidth, 1);
  const height = Math.max(sceneEl.clientHeight, 1);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

window.addEventListener("resize", resizeRenderer);
resizeRenderer();

function getCharacterById(id) {
  return characters.find((character) => character.id === id) || characters[0];
}

function getCharacterName(id) {
  return getCharacterById(id).name;
}

function getSelectedCharacter() {
  return getCharacterById(state.selectedCharacterId);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function randInt(min, max) {
  return Math.floor(rand(min, max + 1));
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeRoomId(raw) {
  const safe = String(raw || "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 24);
  return safe || "island";
}

function ensureRoomIdInUrl() {
  const url = new URL(window.location.href);
  let room = normalizeRoomId(url.searchParams.get("room"));
  if (!url.searchParams.get("room")) {
    room = normalizeRoomId(Math.random().toString(36).slice(2, 8));
    url.searchParams.set("room", room);
    window.history.replaceState({}, "", url.toString());
  }
  return room;
}

function hashColorFromString(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  }
  const hue = hash % 360;
  return `hsl(${hue} 78% 55%)`;
}

function getRoomShareLink() {
  const url = new URL(window.location.href);
  url.searchParams.set("room", multiplayer.roomId);
  return url.toString();
}

function updateMultiplayerHUD() {
  if (multiplayerStatusEl) {
    multiplayerStatusEl.textContent = multiplayer.statusText;
  }

  if (multiplayerCountEl) {
    const count = multiplayer.isHost ? 1 + multiplayer.remotePlayers.size : Math.max(1, multiplayer.snapshotPlayers.length);
    multiplayerCountEl.textContent = String(count);
  }
}

function createRemotePlayerMesh(color) {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.85, 16, 14),
    new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness: 0.4, metalness: 0.08 })
  );
  scene.add(mesh);
  return mesh;
}

function removeRemoteMesh(id) {
  const player = multiplayer.remotePlayers.get(id);
  if (!player || !player.mesh) {
    return;
  }

  scene.remove(player.mesh);
  player.mesh.geometry.dispose();
  player.mesh.material.dispose();
  player.mesh = null;
}

function setMultiplayerStatus(text) {
  multiplayer.statusText = text;
  updateMultiplayerHUD();
}

function applySnapshot(players) {
  multiplayer.snapshotPlayers = Array.isArray(players) ? players : [];

  const incomingIds = new Set();
  for (const entry of multiplayer.snapshotPlayers) {
    if (!entry || entry.id === multiplayer.localPeerId) {
      continue;
    }
    incomingIds.add(entry.id);
    const existing = multiplayer.remotePlayers.get(entry.id);
    const next = {
      id: entry.id,
      x: typeof entry.x === "number" ? entry.x : 0,
      z: typeof entry.z === "number" ? entry.z : 0,
      color: entry.color || hashColorFromString(entry.id),
      name: entry.name || "Player",
      lastSeen: performance.now(),
      mesh: existing ? existing.mesh : null,
    };
    multiplayer.remotePlayers.set(entry.id, next);
  }

  for (const [id] of multiplayer.remotePlayers) {
    if (!incomingIds.has(id)) {
      removeRemoteMesh(id);
      multiplayer.remotePlayers.delete(id);
    }
  }

  updateMultiplayerHUD();
}

function setupHostInboundConnection(conn) {
  multiplayer.hostConnections.set(conn.peer, conn);

  conn.on("data", (message) => {
    if (!message || typeof message !== "object") {
      return;
    }
    if (message.type !== "hello" && message.type !== "update") {
      return;
    }

    const existing = multiplayer.remotePlayers.get(conn.peer);
    const next = {
      id: conn.peer,
      x: typeof message.x === "number" ? message.x : 0,
      z: typeof message.z === "number" ? message.z : 0,
      color: message.color || (existing ? existing.color : hashColorFromString(conn.peer)),
      name: message.name || (existing ? existing.name : "Player"),
      lastSeen: performance.now(),
      mesh: existing ? existing.mesh : null,
    };
    multiplayer.remotePlayers.set(conn.peer, next);
  });

  conn.on("close", () => {
    multiplayer.hostConnections.delete(conn.peer);
    removeRemoteMesh(conn.peer);
    multiplayer.remotePlayers.delete(conn.peer);
    updateMultiplayerHUD();
  });

  conn.on("error", () => {
    multiplayer.hostConnections.delete(conn.peer);
    removeRemoteMesh(conn.peer);
    multiplayer.remotePlayers.delete(conn.peer);
    updateMultiplayerHUD();
  });
}

function connectToHost() {
  if (!multiplayer.peer) {
    return;
  }

  const conn = multiplayer.peer.connect(multiplayer.hostPeerId, { reliable: false, serialization: "json" });
  multiplayer.hostConn = conn;

  conn.on("open", () => {
    setMultiplayerStatus(`Joined room ${multiplayer.roomId}`);
    conn.send({
      type: "hello",
      id: multiplayer.localPeerId,
      name: getSelectedCharacter().name,
      color: multiplayer.localColor,
      x: player.x,
      z: player.z,
    });
  });

  conn.on("data", (message) => {
    if (!message || typeof message !== "object") {
      return;
    }
    if (message.type === "snapshot") {
      applySnapshot(message.players);
    }
  });

  conn.on("close", () => {
    setMultiplayerStatus("Reconnecting...");
    multiplayer.hostConn = null;
    setTimeout(connectToHost, 1500);
  });

  conn.on("error", () => {
    setMultiplayerStatus("Reconnecting...");
  });
}

function initAsClient() {
  multiplayer.isHost = false;
  const peer = new Peer();
  multiplayer.peer = peer;

  peer.on("open", (id) => {
    multiplayer.localPeerId = id;
    multiplayer.localColor = hashColorFromString(id);
    connectToHost();
  });

  peer.on("error", () => {
    setMultiplayerStatus("Connection error");
  });
}

function initMultiplayer() {
  multiplayer.roomId = ensureRoomIdInUrl();
  multiplayer.hostPeerId = `bfdi-${multiplayer.roomId}-host`;

  if (copyRoomLinkBtn) {
    copyRoomLinkBtn.addEventListener("click", async () => {
      const link = getRoomShareLink();
      try {
        await navigator.clipboard.writeText(link);
        setMessage("Join link copied.", "win");
      } catch (error) {
        setMessage(link, "");
      }
    });
  }

  if (typeof window.Peer === "undefined") {
    setMultiplayerStatus("Unavailable");
    return;
  }

  setMultiplayerStatus(`Connecting room ${multiplayer.roomId}...`);
  const peer = new Peer(multiplayer.hostPeerId);
  multiplayer.peer = peer;

  peer.on("open", (id) => {
    multiplayer.isHost = true;
    multiplayer.localPeerId = id;
    multiplayer.localColor = hashColorFromString(id);
    setMultiplayerStatus(`Hosting room ${multiplayer.roomId}`);
  });

  peer.on("connection", (conn) => {
    setupHostInboundConnection(conn);
  });

  peer.on("error", (error) => {
    if (error && error.type === "unavailable-id") {
      if (multiplayer.peer) {
        multiplayer.peer.destroy();
      }
      initAsClient();
      return;
    }
    setMultiplayerStatus("Connection error");
  });
}

function sendMultiplayerUpdate(dt) {
  if (!multiplayer.localPeerId) {
    return;
  }

  multiplayer.sendTick += dt;
  if (multiplayer.sendTick < 0.08) {
    return;
  }
  multiplayer.sendTick = 0;

  const payload = {
    type: "update",
    id: multiplayer.localPeerId,
    name: getSelectedCharacter().name,
    color: multiplayer.localColor,
    x: player.x,
    z: player.z,
  };

  if (multiplayer.isHost) {
    const localSnapshot = [{ ...payload }];
    for (const remote of multiplayer.remotePlayers.values()) {
      localSnapshot.push({
        id: remote.id,
        name: remote.name,
        color: remote.color,
        x: remote.x,
        z: remote.z,
      });
    }
    for (const conn of multiplayer.hostConnections.values()) {
      if (conn.open) {
        conn.send({ type: "snapshot", players: localSnapshot });
      }
    }
    multiplayer.snapshotPlayers = localSnapshot;
    updateMultiplayerHUD();
    return;
  }

  if (multiplayer.hostConn && multiplayer.hostConn.open) {
    multiplayer.hostConn.send(payload);
  }
}

function updateRemotePlayerMeshes(elapsedSeconds) {
  const now = performance.now();
  for (const [id, remote] of multiplayer.remotePlayers) {
    if (now - remote.lastSeen > 12000) {
      removeRemoteMesh(id);
      multiplayer.remotePlayers.delete(id);
      continue;
    }

    if (!remote.mesh) {
      remote.mesh = createRemotePlayerMesh(remote.color);
    }
    remote.mesh.position.set(remote.x, 1.25 + Math.sin(elapsedSeconds * 4 + id.length) * 0.05, remote.z);
  }
}

function updateMultiplayer(dt, elapsedSeconds) {
  sendMultiplayerUpdate(dt);
  updateRemotePlayerMeshes(elapsedSeconds);
}

function spawnToken() {
  const tokenRadius = 1.2;
  const mesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(tokenRadius, 0),
    new THREE.MeshStandardMaterial({ color: 0xff9d2d, roughness: 0.35, metalness: 0.1 })
  );
  scene.add(mesh);

  return {
    x: rand(-world.width / 2 + 4, world.width / 2 - 4),
    z: rand(-world.depth / 2 + 4, world.depth / 2 - 4),
    radius: tokenRadius,
    mesh,
    phase: rand(0, Math.PI * 2),
  };
}

function clearTokens() {
  while (tokens.length) {
    const token = tokens.pop();
    scene.remove(token.mesh);
    token.mesh.geometry.dispose();
    token.mesh.material.dispose();
  }
}

function createSpeakerHazardMesh(w, d) {
  const group = new THREE.Group();

  const cabinet = new THREE.Mesh(
    new THREE.BoxGeometry(w, 3.2, d),
    new THREE.MeshStandardMaterial({ color: 0x242833, roughness: 0.58, metalness: 0.08 })
  );
  group.add(cabinet);

  const front = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.8, 2.6),
    new THREE.MeshStandardMaterial({ color: 0x3a4150, roughness: 0.62, metalness: 0.04 })
  );
  front.position.z = d / 2 + 0.03;
  group.add(front);

  const tweeter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.12, 20),
    new THREE.MeshStandardMaterial({ color: 0x101317, roughness: 0.35, metalness: 0.1 })
  );
  tweeter.rotation.x = Math.PI / 2;
  tweeter.position.set(0, 0.78, d / 2 + 0.1);
  group.add(tweeter);

  const wooferOuter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 0.15, 24),
    new THREE.MeshStandardMaterial({ color: 0x151a22, roughness: 0.4, metalness: 0.12 })
  );
  wooferOuter.rotation.x = Math.PI / 2;
  wooferOuter.position.set(0, -0.58, d / 2 + 0.08);
  group.add(wooferOuter);

  const wooferInner = new THREE.Mesh(
    new THREE.CylinderGeometry(0.44, 0.34, 0.1, 20),
    new THREE.MeshStandardMaterial({ color: 0x0e1015, roughness: 0.28, metalness: 0.08 })
  );
  wooferInner.rotation.x = Math.PI / 2;
  wooferInner.position.set(0, -0.58, d / 2 + 0.16);
  group.add(wooferInner);

  return group;
}

function spawnHazards() {
  while (hazards.length) {
    const oldHazard = hazards.pop();
    scene.remove(oldHazard.mesh);
    disposeGroup(oldHazard.mesh);
  }

  for (let i = 0; i < 6; i += 1) {
    const w = 3;
    const d = 3;
    const mesh = createSpeakerHazardMesh(w, d);
    scene.add(mesh);

    hazards.push({
      x: rand(-world.width / 2 + 4, world.width / 2 - 4),
      z: rand(-world.depth / 2 + 4, world.depth / 2 - 4),
      w,
      d,
      vx: rand(-16, 16) || 10,
      vz: rand(-16, 16) || -10,
      mesh,
    });
  }
}

function setMessage(text, mode) {
  messageEl.textContent = text;
  messageEl.className = `message ${mode}`.trim();
}

function syncAdminUI() {
  if (!adminPanelEl || !adminToggleBtn || !adminFlyBtn || !adminScoreBtn || !adminTimeBtn || !adminWinBtn) {
    return;
  }

  adminPanelEl.classList.toggle("active", state.adminMode);
  adminToggleBtn.textContent = state.adminMode ? "Admin: ON" : "Admin: OFF";
  adminFlyBtn.textContent = state.adminFly ? "Fly: ON" : "Fly: OFF";
  adminFlyBtn.disabled = !state.adminMode;
  adminScoreBtn.disabled = !state.adminMode || !state.running;
  adminTimeBtn.disabled = !state.adminMode || !state.running;
  adminWinBtn.disabled = !state.adminMode || !state.running;
}

function setAdminMode(enabled) {
  if (ADMIN_LOCKED) {
    state.adminMode = false;
    syncAdminUI();
    return;
  }

  state.adminMode = !!enabled;
  if (!state.adminMode) {
    state.adminFly = false;
  }
  syncAdminUI();
}

function adminAddScore(amount) {
  if (!state.adminMode || !state.running) {
    return;
  }

  state.score = clampNumber(state.score + amount, 0, world.targetScore);
  syncHUD();

  if (state.score >= world.targetScore) {
    endRound(true);
  }
}

function adminAddTime(amount) {
  if (!state.adminMode || !state.running) {
    return;
  }

  state.timeLeft = clampNumber(state.timeLeft + amount, 0, 999);
  syncHUD();
}

function updateControlButtons() {
  if (state.seasonOver) {
    nextRoundBtn.disabled = false;
    nextRoundBtn.textContent = "Start New Season";
    restartBtn.disabled = !state.activeContestants.includes(state.selectedCharacterId);
    syncAdminUI();
    return;
  }

  restartBtn.disabled = false;
  nextRoundBtn.textContent = "Next Round";
  nextRoundBtn.disabled = !state.roundEnded;
  syncAdminUI();
}

function syncHUD() {
  const character = getSelectedCharacter();
  characterNameEl.textContent = character.name;
  roundNumEl.textContent = String(state.round);
  remainingCountEl.textContent = String(state.activeContestants.length);
  scoreEl.textContent = String(state.score);
  timeEl.textContent = String(state.timeLeft);
}

function syncCharacterInfo() {
  const character = getSelectedCharacter();
  characterInfoEl.textContent = `${character.bio} Speed ${character.speed.toFixed(1)}, hitbox ${character.radius.toFixed(
    1
  )}, +${character.bonusTime}s.`;

  const buttons = characterPickerEl.querySelectorAll(".pick-btn");
  for (const button of buttons) {
    button.classList.toggle("active", button.dataset.id === character.id);
  }

  drawFacePreview(character);
}

function drawFacePreview(character) {
  if (!facePreviewEl) {
    return;
  }

  const ctx = facePreviewEl.getContext("2d");
  if (!ctx) {
    return;
  }

  const w = facePreviewEl.width;
  const h = facePreviewEl.height;
  ctx.clearRect(0, 0, w, h);

  const background = ctx.createLinearGradient(0, 0, 0, h);
  background.addColorStop(0, "#f6fbff");
  background.addColorStop(1, "#ebf4ff");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, w, h);

  const fillByShape = {
    cash: "#a7d6ad",
    "leaf-classic": "#57e000",
    teardrop: "#66c8f2",
    "lava-lamp": "#ff6a00",
    lollipop: "#9f18ff",
    "blocky-red": "#ed4646",
    syringe: "#ececf3",
    "nickel-note": "#9b9da3",
    "syringe-side": "#ececf3",
    "glue-bottle": "#f0f6ff",
    "pine-tree": "#1fa84b",
    "photo-frame": "#f4f7ff",
    donut: "#f0dca5",
    book: "#27a8c8",
    "beach-ball": "#f6f8ff",
    leaf: "#2da44e",
    fire: "#ff7a00",
    bubble: "#8fd8ff",
    block: "#f0ca2b",
    pencil: "#f6d574",
    tennis: "#b6e240",
  };

  const color = fillByShape[character.shape] || "#2da44e";
  ctx.fillStyle = color;

  if (character.shape === "blocky-red" || character.shape === "block") {
    ctx.fillRect(50, 20, 80, 80);
  } else if (character.shape === "syringe") {
    ctx.fillRect(73, 20, 34, 78);
    ctx.fillStyle = "#e267da";
    ctx.fillRect(75, 60, 30, 36);
    ctx.fillStyle = "#111";
    ctx.fillRect(73, 58, 34, 6);
    ctx.fillStyle = "#c3c3cd";
    ctx.fillRect(62, 12, 56, 8);
  } else if (character.shape === "syringe-side") {
    ctx.fillRect(42, 36, 98, 42);
    ctx.fillStyle = "#e267da";
    ctx.fillRect(86, 58, 44, 16);
    ctx.fillStyle = "#8fd6d8";
    ctx.fillRect(138, 54, 22, 8);
    ctx.fillStyle = "#c3c3cd";
    ctx.fillRect(30, 48, 14, 16);
  } else if (character.shape === "nickel-note") {
    ctx.fillStyle = "#f9f9fc";
    ctx.fillRect(30, 20, 42, 56);
    ctx.strokeStyle = "#6a7280";
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 20, 42, 56);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(104, 58, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (character.shape === "lollipop") {
    ctx.fillRect(86, 68, 8, 36);
    ctx.beginPath();
    ctx.arc(90, 46, 30, 0, Math.PI * 2);
    ctx.fill();
  } else if (character.shape === "glue-bottle") {
    ctx.fillStyle = "#56d0f6";
    ctx.fillRect(75, 10, 30, 24);
    ctx.fillStyle = color;
    ctx.fillRect(52, 28, 76, 66);
    ctx.fillStyle = "#4fc3ef";
    ctx.fillRect(48, 88, 84, 16);
  } else if (character.shape === "pine-tree") {
    ctx.fillStyle = color;
    for (let i = 0; i < 4; i += 1) {
      const layerW = 106 - i * 14;
      const topY = 10 + i * 18;
      ctx.beginPath();
      ctx.moveTo(90, topY);
      ctx.lineTo(90 - layerW / 2, topY + 36);
      ctx.lineTo(90 + layerW / 2, topY + 36);
      ctx.closePath();
      ctx.fill();
    }
    ctx.fillStyle = "#9fbf63";
    ctx.fillRect(84, 48, 12, 54);
  } else if (character.shape === "photo-frame") {
    ctx.fillStyle = color;
    ctx.fillRect(34, 12, 112, 92);
    ctx.strokeStyle = "#a2acb7";
    ctx.lineWidth = 4;
    ctx.strokeRect(34, 12, 112, 92);
    ctx.fillStyle = "#4f77e6";
    ctx.fillRect(44, 22, 92, 36);
    ctx.fillStyle = "#f25f7f";
    ctx.fillRect(44, 58, 92, 36);
    ctx.fillStyle = "#f6d34a";
    ctx.beginPath();
    ctx.arc(118, 78, 12, 0, Math.PI * 2);
    ctx.fill();
  } else if (character.shape === "donut") {
    ctx.strokeStyle = "#f0dca5";
    ctx.lineWidth = 28;
    ctx.beginPath();
    ctx.arc(90, 58, 30, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "#dcbf81";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(90, 58, 21, 0, Math.PI * 2);
    ctx.stroke();
  } else if (character.shape === "book") {
    ctx.fillStyle = color;
    ctx.fillRect(42, 14, 96, 92);
    ctx.fillStyle = "#2cc23b";
    ctx.fillRect(42, 14, 34, 92);
    ctx.strokeStyle = "#0e5f6f";
    ctx.lineWidth = 3;
    ctx.strokeRect(42, 14, 96, 92);
  } else if (character.shape === "beach-ball") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(90, 56, 38, 0, Math.PI * 2);
    ctx.fill();
    const wedges = [
      { color: "#f05454", start: -Math.PI * 0.9, end: -Math.PI * 0.55 },
      { color: "#f0e448", start: -Math.PI * 0.55, end: -Math.PI * 0.15 },
      { color: "#73e35c", start: -Math.PI * 0.15, end: Math.PI * 0.2 },
      { color: "#4fa8ff", start: Math.PI * 0.2, end: Math.PI * 0.62 },
      { color: "#f39b56", start: Math.PI * 0.62, end: Math.PI * 1.04 },
    ];
    for (const wedge of wedges) {
      ctx.beginPath();
      ctx.moveTo(90, 56);
      ctx.arc(90, 56, 36, wedge.start, wedge.end);
      ctx.closePath();
      ctx.fillStyle = wedge.color;
      ctx.fill();
    }
  } else if (character.shape === "teardrop") {
    ctx.beginPath();
    ctx.moveTo(90, 12);
    ctx.quadraticCurveTo(130, 40, 112, 90);
    ctx.quadraticCurveTo(90, 112, 68, 90);
    ctx.quadraticCurveTo(50, 40, 90, 12);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(90, 56, 34, 42, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "#111";
  let eyeY = 52;
  if (character.shape === "donut") {
    eyeY = 46;
  } else if (character.shape === "pine-tree") {
    eyeY = 56;
  }
  ctx.beginPath();
  ctx.ellipse(78, eyeY, 4.5, 8, 0, 0, Math.PI * 2);
  ctx.ellipse(102, eyeY, 4.5, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#111";
  ctx.lineWidth = 4;
  ctx.beginPath();
  if (character.shape === "cash" || character.shape === "lollipop" || character.shape === "syringe") {
    ctx.arc(90, 72, 18, Math.PI * 1.1, Math.PI * 1.9);
  } else if (character.shape === "syringe-side" || character.shape === "nickel-note") {
    ctx.moveTo(72, 74);
    ctx.lineTo(108, 68);
  } else if (character.shape === "pine-tree") {
    ctx.arc(90, 78, 16, Math.PI * 1.05, Math.PI * 1.95);
  } else if (character.shape === "photo-frame") {
    ctx.arc(90, 70, 20, 0, Math.PI);
    ctx.moveTo(70, 70);
    ctx.lineTo(110, 70);
  } else if (character.shape === "donut") {
    ctx.arc(90, 74, 14, 0.2, Math.PI - 0.2);
  } else {
    ctx.arc(90, 68, 22, 0.2, Math.PI - 0.2);
  }
  ctx.stroke();

  ctx.fillStyle = "#16284d";
  ctx.font = "700 14px Trebuchet MS, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(character.name, 90, 112);
}

function syncSeasonInfo() {
  const activeNames = state.activeContestants.map(getCharacterName).join(", ");
  const eliminatedNames = state.eliminatedContestants.length
    ? state.eliminatedContestants.map(getCharacterName).join(", ")
    : "none";

  roundSummaryEl.textContent = state.lastCeremonySummary;
  rosterLineEl.textContent = `Remaining: ${activeNames}`;
  eliminationLineEl.textContent = `Eliminated: ${eliminatedNames}`;
}

function makeFaceEyes(group, y) {
  const eyeGeo = new THREE.SphereGeometry(0.16, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.48, y, 1.35);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.48, y, 1.35);

  group.add(leftEye);
  group.add(rightEye);
}

function makeFaceSmile(group, y) {
  const points = [];
  for (let i = 0; i <= 10; i += 1) {
    const t = (i / 10) * Math.PI;
    points.push(new THREE.Vector3(Math.cos(t) * 0.6, y + Math.sin(t) * 0.25, 1.28));
  }
  const smileGeo = new THREE.BufferGeometry().setFromPoints(points);
  const smile = new THREE.Line(smileGeo, new THREE.LineBasicMaterial({ color: 0x111111 }));
  group.add(smile);
}

function makeFaceFrown(group, y, z) {
  const points = [];
  for (let i = 0; i <= 10; i += 1) {
    const t = (i / 10) * Math.PI;
    points.push(new THREE.Vector3(Math.cos(t) * 0.65, y - Math.sin(t) * 0.3, z));
  }
  const frownGeo = new THREE.BufferGeometry().setFromPoints(points);
  const frown = new THREE.Line(frownGeo, new THREE.LineBasicMaterial({ color: 0x111111 }));
  group.add(frown);
}

function addStickLimbs(group, options = {}) {
  const armY = options.armY !== undefined ? options.armY : -0.45;
  const legY = options.legY !== undefined ? options.legY : -1.95;
  const armSpread = options.armSpread !== undefined ? options.armSpread : 1.2;
  const legSpread = options.legSpread !== undefined ? options.legSpread : 0.42;
  const armLen = options.armLen !== undefined ? options.armLen : 1.4;
  const legLen = options.legLen !== undefined ? options.legLen : 1.7;
  const z = options.z !== undefined ? options.z : 0.9;
  const radius = options.radius !== undefined ? options.radius : 0.06;
  const handRadius = options.handRadius !== undefined ? options.handRadius : 0.2;
  const footRadius = options.footRadius !== undefined ? options.footRadius : 0.25;
  const mat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  function addLimb(x1, y1, x2, y2) {
    const length = Math.hypot(x2 - x1, y2 - y1);
    const limb = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, length, 8), mat);
    limb.position.set((x1 + x2) / 2, (y1 + y2) / 2, z);
    limb.rotation.z = Math.atan2(x2 - x1, y2 - y1);
    group.add(limb);
  }

  addLimb(-armSpread, armY, -armSpread - 0.45, armY - armLen);
  addLimb(armSpread, armY, armSpread + 0.45, armY - armLen);
  addLimb(-legSpread, legY, -legSpread - 0.05, legY - legLen);
  addLimb(legSpread, legY, legSpread + 0.05, legY - legLen);

  const handGeo = new THREE.SphereGeometry(handRadius, 10, 10);
  const leftHand = new THREE.Mesh(handGeo, mat);
  leftHand.position.set(-armSpread - 0.45, armY - armLen, z);
  const rightHand = new THREE.Mesh(handGeo, mat);
  rightHand.position.set(armSpread + 0.45, armY - armLen, z);
  group.add(leftHand);
  group.add(rightHand);

  const footGeo = new THREE.SphereGeometry(footRadius, 10, 10);
  const leftFoot = new THREE.Mesh(footGeo, mat);
  leftFoot.position.set(-legSpread - 0.05, legY - legLen, z);
  leftFoot.scale.y = 0.58;
  const rightFoot = new THREE.Mesh(footGeo, mat);
  rightFoot.position.set(legSpread + 0.05, legY - legLen, z);
  rightFoot.scale.y = 0.58;
  group.add(leftFoot);
  group.add(rightFoot);
}

function createLeafyMesh() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.45, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0x2da44e, roughness: 0.65 })
  );
  body.scale.set(0.95, 1.25, 0.75);
  group.add(body);
  makeFaceEyes(group, 0.2);
  makeFaceSmile(group, -0.28);
  return group;
}

function createFireyMesh() {
  const group = new THREE.Group();

  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(1.4, 3.6, 18),
    new THREE.MeshStandardMaterial({ color: 0xff7a00, roughness: 0.52, emissive: 0x3a1200, emissiveIntensity: 0.45 })
  );
  flame.position.y = 0.5;
  group.add(flame);

  const core = new THREE.Mesh(
    new THREE.ConeGeometry(0.72, 2.1, 14),
    new THREE.MeshStandardMaterial({ color: 0xffe066, roughness: 0.35, emissive: 0x4f3e00, emissiveIntensity: 0.22 })
  );
  core.position.y = 0.3;
  group.add(core);

  makeFaceEyes(group, -0.12);
  makeFaceSmile(group, -0.66);
  return group;
}

function createBubbleMesh() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0x8fd8ff, transparent: true, opacity: 0.58, roughness: 0.08, metalness: 0.12 })
  );
  group.add(body);

  const shine = new THREE.Mesh(
    new THREE.SphereGeometry(0.34, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.62, roughness: 0.2 })
  );
  shine.position.set(-0.48, 0.56, 0.92);
  group.add(shine);

  makeFaceEyes(group, 0);
  makeFaceSmile(group, -0.52);
  return group;
}

function createBlockyMesh() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 2.5, 2.5),
    new THREE.MeshStandardMaterial({ color: 0xf0ca2b, roughness: 0.56 })
  );
  group.add(body);
  makeFaceEyes(group, 0.2);
  makeFaceSmile(group, -0.35);
  return group;
}

function createPencilMesh() {
  const group = new THREE.Group();

  const top = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 0.7, 14),
    new THREE.MeshStandardMaterial({ color: 0xe65570, roughness: 0.6 })
  );
  top.position.y = 1.25;
  group.add(top);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2.2, 14),
    new THREE.MeshStandardMaterial({ color: 0xf6d574, roughness: 0.65 })
  );
  body.position.y = 0.1;
  group.add(body);

  const tipWood = new THREE.Mesh(
    new THREE.ConeGeometry(0.5, 0.85, 14),
    new THREE.MeshStandardMaterial({ color: 0xf5c79a, roughness: 0.58 })
  );
  tipWood.position.y = -1.42;
  group.add(tipWood);

  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.17, 0.38, 10),
    new THREE.MeshStandardMaterial({ color: 0x1f1f1f, roughness: 0.35 })
  );
  tip.position.y = -1.9;
  group.add(tip);

  makeFaceEyes(group, 0.18);
  makeFaceSmile(group, -0.38);
  return group;
}

function createTennisBallMesh() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.38, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0xb6e240, roughness: 0.45 })
  );
  group.add(body);

  const seamMat = new THREE.MeshStandardMaterial({ color: 0xf2ffe0, roughness: 0.2 });
  const seam1 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 10, 30, Math.PI * 1.15), seamMat);
  seam1.rotation.set(0.4, -0.3, 0.85);
  group.add(seam1);

  const seam2 = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.08, 10, 30, Math.PI * 1.15), seamMat);
  seam2.rotation.set(-0.4, 0.3, -0.85);
  group.add(seam2);

  makeFaceEyes(group, 0.08);
  makeFaceSmile(group, -0.45);
  return group;
}

function createCashMesh() {
  const group = new THREE.Group();

  const stackBack = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 2.3, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x83b38f, roughness: 0.7 })
  );
  stackBack.position.set(-0.35, 0.1, -0.38);
  stackBack.rotation.y = -0.24;
  group.add(stackBack);

  const stackMid = new THREE.Mesh(
    new THREE.BoxGeometry(3.25, 2.4, 0.28),
    new THREE.MeshStandardMaterial({ color: 0x95c59f, roughness: 0.68 })
  );
  stackMid.position.set(-0.18, 0.06, -0.2);
  stackMid.rotation.y = -0.1;
  group.add(stackMid);

  const bill = new THREE.Mesh(
    new THREE.BoxGeometry(3.4, 2.45, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xa7d6ad, roughness: 0.62 })
  );
  bill.position.z = 0.05;
  group.add(bill);

  const facePlate = new THREE.Mesh(
    new THREE.CircleGeometry(0.88, 30),
    new THREE.MeshStandardMaterial({ color: 0x89bd95, roughness: 0.55, side: THREE.DoubleSide })
  );
  facePlate.position.set(0.25, 0.02, 0.24);
  group.add(facePlate);

  const fiveRing = new THREE.Mesh(
    new THREE.RingGeometry(0.32, 0.44, 24),
    new THREE.MeshStandardMaterial({ color: 0xe4dda8, roughness: 0.4, side: THREE.DoubleSide })
  );
  fiveRing.position.set(-1.02, 0.63, 0.24);
  group.add(fiveRing);

  const clip = new THREE.Mesh(
    new THREE.BoxGeometry(0.64, 0.9, 0.42),
    new THREE.MeshStandardMaterial({ color: 0xbcc3d5, roughness: 0.38, metalness: 0.2 })
  );
  clip.position.set(-1.6, 0.08, 0.22);
  clip.rotation.z = -0.18;
  group.add(clip);

  const eyeGeo = new THREE.SphereGeometry(0.13, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.14, 0.18, 0.28);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.62, 0.18, 0.28);
  group.add(leftEye);
  group.add(rightEye);

  makeFaceFrown(group, -0.15, 0.29);
  addStickLimbs(group, {
    armY: -0.55,
    legY: -1.85,
    armSpread: 1.65,
    legSpread: 0.48,
    armLen: 1.2,
    legLen: 1.65,
    z: 0.32,
    radius: 0.055,
    handRadius: 0.16,
    footRadius: 0.24,
  });
  return group;
}

function createLeafyClassicMesh() {
  const group = new THREE.Group();

  const outer = new THREE.Mesh(
    new THREE.SphereGeometry(1.55, 26, 22),
    new THREE.MeshStandardMaterial({ color: 0x2ea500, roughness: 0.72, side: THREE.BackSide })
  );
  outer.scale.set(0.98, 1.5, 0.56);
  group.add(outer);

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 26, 22),
    new THREE.MeshStandardMaterial({ color: 0x57e000, roughness: 0.6 })
  );
  body.scale.set(0.95, 1.45, 0.52);
  group.add(body);

  const vein = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, 3.5, 8),
    new THREE.MeshBasicMaterial({ color: 0xa5ff83 })
  );
  vein.position.set(0, 0, 0.84);
  group.add(vein);

  const eyeGeo = new THREE.SphereGeometry(0.15, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.42, 0.2, 0.93);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.42, 0.2, 0.93);
  group.add(leftEye);
  group.add(rightEye);

  const smilePoints = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = (i / 12) * Math.PI;
    smilePoints.push(new THREE.Vector3(Math.cos(t) * 0.78, -0.32 + Math.sin(t) * 0.25, 0.95));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(smilePoints), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -0.58,
    legY: -2.1,
    armSpread: 1.0,
    legSpread: 0.45,
    armLen: 1.25,
    legLen: 1.55,
    z: 0.94,
    radius: 0.055,
    handRadius: 0.17,
    footRadius: 0.26,
  });
  return group;
}

function createTeardropMesh() {
  const group = new THREE.Group();

  const upper = new THREE.Mesh(
    new THREE.ConeGeometry(1.0, 2.45, 24),
    new THREE.MeshStandardMaterial({ color: 0x4fb6ec, roughness: 0.42 })
  );
  upper.position.y = 0.75;
  group.add(upper);

  const lower = new THREE.Mesh(
    new THREE.SphereGeometry(1.25, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0x66c8f2, roughness: 0.35 })
  );
  lower.position.y = -0.56;
  lower.scale.set(1, 1.02, 0.62);
  group.add(lower);

  const highlight = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 12, 10),
    new THREE.MeshStandardMaterial({ color: 0xbff2ff, transparent: true, opacity: 0.72, roughness: 0.18 })
  );
  highlight.position.set(-0.42, 0.62, 0.72);
  group.add(highlight);

  const eyeGeo = new THREE.SphereGeometry(0.16, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.45, -0.05, 0.88);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.45, -0.05, 0.88);
  group.add(leftEye);
  group.add(rightEye);

  const smilePoints = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = (i / 12) * Math.PI;
    smilePoints.push(new THREE.Vector3(Math.cos(t) * 0.78, -0.78 + Math.sin(t) * 0.3, 0.9));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(smilePoints), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -1.0,
    legY: -2.0,
    armSpread: 0.98,
    legSpread: 0.4,
    armLen: 1.25,
    legLen: 1.65,
    z: 0.9,
    radius: 0.055,
    handRadius: 0.17,
    footRadius: 0.25,
  });
  return group;
}

function createLavaLampMesh() {
  const group = new THREE.Group();

  const topCap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.82, 1.08, 0.75, 16),
    new THREE.MeshStandardMaterial({ color: 0x9f9f9f, roughness: 0.42 })
  );
  topCap.position.y = 1.82;
  group.add(topCap);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.98, 1.2, 2.8, 6),
    new THREE.MeshStandardMaterial({ color: 0xff6a00, roughness: 0.45 })
  );
  body.position.y = 0.2;
  body.rotation.y = Math.PI / 6;
  group.add(body);

  const lavaBlobA = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 14, 12),
    new THREE.MeshStandardMaterial({ color: 0xff3d00, roughness: 0.35, emissive: 0x3a1200, emissiveIntensity: 0.35 })
  );
  lavaBlobA.position.set(-0.2, 0.35, 0.75);
  group.add(lavaBlobA);

  const lavaBlobB = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 14, 12),
    new THREE.MeshStandardMaterial({ color: 0xff3d00, roughness: 0.35, emissive: 0x3a1200, emissiveIntensity: 0.35 })
  );
  lavaBlobB.position.set(0.36, -0.45, 0.72);
  group.add(lavaBlobB);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.32, 0.95, 1.35, 16),
    new THREE.MeshStandardMaterial({ color: 0x9f9f9f, roughness: 0.45 })
  );
  base.position.y = -1.95;
  group.add(base);

  const eyeGeo = new THREE.SphereGeometry(0.11, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.28, 0.5, 1.06);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.12, 0.52, 1.06);
  group.add(leftEye);
  group.add(rightEye);

  const grinPlate = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.52, 0.04),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 })
  );
  grinPlate.position.set(-0.05, -0.06, 1.07);
  group.add(grinPlate);

  const mouthTop = [];
  for (let i = 0; i <= 10; i += 1) {
    const t = (i / 10) * Math.PI;
    mouthTop.push(new THREE.Vector3(-0.05 + Math.cos(t) * 0.58, -0.02 + Math.sin(t) * 0.17, 1.09));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mouthTop), new THREE.LineBasicMaterial({ color: 0x111111 })));
  return group;
}

function createLollipopMesh() {
  const group = new THREE.Group();

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(1.2, 24, 20),
    new THREE.MeshStandardMaterial({ color: 0x9f18ff, roughness: 0.34 })
  );
  head.position.y = 0.95;
  group.add(head);

  const wrapper = new THREE.Mesh(
    new THREE.ConeGeometry(0.44, 0.7, 8),
    new THREE.MeshStandardMaterial({ color: 0x8020d7, roughness: 0.45 })
  );
  wrapper.position.y = -0.05;
  group.add(wrapper);

  const stick = new THREE.Mesh(
    new THREE.CylinderGeometry(0.17, 0.17, 2.8, 10),
    new THREE.MeshStandardMaterial({ color: 0xe4e4e4, roughness: 0.5 })
  );
  stick.position.y = -1.45;
  group.add(stick);

  const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const eye = new THREE.Mesh(eyeGeo, eyeMat);
  eye.position.set(-0.22, 1.08, 1.15);
  group.add(eye);

  const browPoints = [new THREE.Vector3(0.7, 1.35, 1.16), new THREE.Vector3(1.0, 1.25, 1.16)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(browPoints), new THREE.LineBasicMaterial({ color: 0x111111 })));

  const flatMouth = [new THREE.Vector3(-0.64, 0.62, 1.18), new THREE.Vector3(0.78, 0.64, 1.18)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(flatMouth), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -1.08,
    legY: -2.75,
    armSpread: 0.26,
    legSpread: 0.28,
    armLen: 1.0,
    legLen: 0.95,
    z: 0.22,
    radius: 0.052,
    handRadius: 0.16,
    footRadius: 0.23,
  });
  return group;
}

function createRedBlockyMesh() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(2.75, 2.75, 2.75),
    new THREE.MeshStandardMaterial({ color: 0xed4646, roughness: 0.58 })
  );
  group.add(body);

  const topHighlight = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.2, 2.4),
    new THREE.MeshStandardMaterial({ color: 0xff8f8f, transparent: true, opacity: 0.55, roughness: 0.25 })
  );
  topHighlight.position.y = 1.35;
  group.add(topHighlight);

  const sidePanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 2.45, 2.45),
    new THREE.MeshStandardMaterial({ color: 0xd83333, roughness: 0.55 })
  );
  sidePanel.position.x = 1.35;
  group.add(sidePanel);

  const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.46, 0.22, 1.38);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.36, 0.2, 1.38);
  group.add(leftEye);
  group.add(rightEye);

  const smirkPoints = [];
  for (let i = 0; i <= 10; i += 1) {
    const t = i / 10;
    smirkPoints.push(new THREE.Vector3(-0.6 + 1.2 * t, -0.42 + 0.18 * t * t, 1.4));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(smirkPoints), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -0.1,
    legY: -1.55,
    armSpread: 1.4,
    legSpread: 0.58,
    armLen: 1.1,
    legLen: 1.25,
    z: 1.42,
    radius: 0.06,
    handRadius: 0.18,
    footRadius: 0.24,
  });
  return group;
}

function createSyringeMesh() {
  const group = new THREE.Group();

  const plungerTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.1, 0.35, 0.65),
    new THREE.MeshStandardMaterial({ color: 0xd7d7e1, roughness: 0.45 })
  );
  plungerTop.position.y = 2.55;
  group.add(plungerTop);

  const plungerStem = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.95, 0.35),
    new THREE.MeshStandardMaterial({ color: 0xc8c8d2, roughness: 0.42 })
  );
  plungerStem.position.y = 1.95;
  group.add(plungerStem);

  const barrel = new THREE.Mesh(
    new THREE.BoxGeometry(1.26, 3.65, 0.78),
    new THREE.MeshStandardMaterial({ color: 0xf2f2f8, roughness: 0.3, transparent: true, opacity: 0.82 })
  );
  barrel.position.y = 0.6;
  group.add(barrel);

  const fluid = new THREE.Mesh(
    new THREE.BoxGeometry(1.16, 1.1, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xe267da, roughness: 0.34 })
  );
  fluid.position.y = -0.75;
  group.add(fluid);

  const ring = new THREE.Mesh(
    new THREE.BoxGeometry(1.3, 0.23, 0.86),
    new THREE.MeshStandardMaterial({ color: 0x0f1117, roughness: 0.35 })
  );
  ring.position.y = -0.17;
  group.add(ring);

  const needleShaft = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.07, 1.45, 8),
    new THREE.MeshStandardMaterial({ color: 0xbec4d4, roughness: 0.35, metalness: 0.2 })
  );
  needleShaft.position.y = -2.28;
  group.add(needleShaft);

  const needleTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.09, 0.45, 8),
    new THREE.MeshStandardMaterial({ color: 0xa7adbb, roughness: 0.35, metalness: 0.18 })
  );
  needleTip.position.y = -3.2;
  group.add(needleTip);

  const eyeGeo = new THREE.SphereGeometry(0.13, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.22, 0.45, 0.43);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.22, 0.42, 0.43);
  group.add(leftEye);
  group.add(rightEye);
  makeFaceFrown(group, 0.0, 0.44);

  addStickLimbs(group, {
    armY: -0.85,
    legY: -2.1,
    armSpread: 0.72,
    legSpread: 0.34,
    armLen: 0.95,
    legLen: 1.2,
    z: 0.44,
    radius: 0.055,
    handRadius: 0.15,
    footRadius: 0.21,
  });

  return group;
}

function createNickelNoteMesh() {
  const group = new THREE.Group();

  const coin = new THREE.Mesh(
    new THREE.CylinderGeometry(1.4, 1.4, 0.48, 30),
    new THREE.MeshStandardMaterial({ color: 0x9fa3aa, roughness: 0.45, metalness: 0.2 })
  );
  coin.rotation.x = Math.PI / 2;
  group.add(coin);

  const rim = new THREE.Mesh(
    new THREE.TorusGeometry(1.38, 0.08, 12, 36),
    new THREE.MeshStandardMaterial({ color: 0x767d87, roughness: 0.42, metalness: 0.22 })
  );
  rim.position.z = 0.26;
  group.add(rim);

  const signStem = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 1.8, 8),
    new THREE.MeshStandardMaterial({ color: 0xd9dbe1, roughness: 0.55 })
  );
  signStem.position.set(-2.05, 0.55, 0.2);
  group.add(signStem);

  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(1.65, 2.2, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xfafafe, roughness: 0.78 })
  );
  signBoard.position.set(-2.05, 2.0, 0.2);
  group.add(signBoard);

  const signLineMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  for (let i = 0; i < 4; i += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.07, 0.03), signLineMat);
    line.position.set(-2.05, 2.65 - i * 0.5, 0.26);
    line.rotation.z = -0.08;
    group.add(line);
  }

  const eyeGeo = new THREE.SphereGeometry(0.14, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.32, 0.18, 0.3);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.22, 0.18, 0.3);
  group.add(leftEye);
  group.add(rightEye);

  const mouthPoints = [
    new THREE.Vector3(-0.45, -0.3, 0.32),
    new THREE.Vector3(-0.08, -0.12, 0.32),
    new THREE.Vector3(0.35, -0.24, 0.32),
  ];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mouthPoints), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -0.18,
    legY: -1.45,
    armSpread: 1.05,
    legSpread: 0.44,
    armLen: 1.15,
    legLen: 1.1,
    z: 0.3,
    radius: 0.055,
    handRadius: 0.15,
    footRadius: 0.22,
  });

  return group;
}

function createSyringeSideMesh() {
  const group = new THREE.Group();

  const barrel = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 1.95, 0.82),
    new THREE.MeshStandardMaterial({ color: 0xf2f2f8, roughness: 0.34, transparent: true, opacity: 0.86 })
  );
  group.add(barrel);

  const measureLineMat = new THREE.MeshBasicMaterial({ color: 0x757a87 });
  for (let i = 0; i < 6; i += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.22, 0.02), measureLineMat);
    line.position.set(-1.25 + i * 0.48, 0.75, 0.43);
    group.add(line);
  }

  const fluid = new THREE.Mesh(
    new THREE.BoxGeometry(2.55, 0.68, 0.7),
    new THREE.MeshStandardMaterial({ color: 0xe267da, roughness: 0.35 })
  );
  fluid.position.set(0.3, -0.58, 0);
  group.add(fluid);

  const plungerBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.58, 1.1, 0.8),
    new THREE.MeshStandardMaterial({ color: 0xb0b3c6, roughness: 0.42 })
  );
  plungerBack.position.x = -2.12;
  group.add(plungerBack);

  const plungerHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 1.6, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x9598ae, roughness: 0.45 })
  );
  plungerHandle.position.x = -2.45;
  group.add(plungerHandle);

  const needleBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.55, 10),
    new THREE.MeshStandardMaterial({ color: 0xd0d3dd, roughness: 0.38, metalness: 0.16 })
  );
  needleBase.rotation.z = Math.PI / 2;
  needleBase.position.x = 1.98;
  group.add(needleBase);

  const needleTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 1.2, 10),
    new THREE.MeshStandardMaterial({ color: 0xb8bfcb, roughness: 0.36, metalness: 0.18 })
  );
  needleTip.rotation.z = -Math.PI / 2;
  needleTip.position.x = 2.85;
  group.add(needleTip);

  const eyeGeo = new THREE.SphereGeometry(0.13, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.4, 0.18, 0.44);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.56, 0.15, 0.44);
  group.add(leftEye);
  group.add(rightEye);

  const mouthPoints = [new THREE.Vector3(-0.35, -0.38, 0.45), new THREE.Vector3(0.65, -0.35, 0.45)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(mouthPoints), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -0.25,
    legY: -1.05,
    armSpread: 1.45,
    legSpread: 0.55,
    armLen: 1.0,
    legLen: 1.0,
    z: 0.44,
    radius: 0.055,
    handRadius: 0.15,
    footRadius: 0.22,
  });

  return group;
}

function createGlueBottleMesh() {
  const group = new THREE.Group();

  const cap = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.72, 1.0, 14),
    new THREE.MeshStandardMaterial({ color: 0x47c5f0, roughness: 0.4 })
  );
  cap.position.y = 2.05;
  group.add(cap);

  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(1.05, 1.28, 3.25, 16),
    new THREE.MeshStandardMaterial({ color: 0xf0f6ff, roughness: 0.38 })
  );
  body.position.y = 0.1;
  group.add(body);

  const panel = new THREE.Mesh(
    new THREE.BoxGeometry(2.26, 2.52, 0.06),
    new THREE.MeshStandardMaterial({ color: 0xe9f2ff, roughness: 0.3 })
  );
  panel.position.set(0, 0.15, 1.25);
  group.add(panel);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(1.42, 1.2, 0.62, 16),
    new THREE.MeshStandardMaterial({ color: 0x50c9f6, roughness: 0.38 })
  );
  base.position.y = -1.86;
  group.add(base);

  const eyeGeo = new THREE.SphereGeometry(0.13, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.35, 0.48, 1.3);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.35, 0.48, 1.3);
  group.add(leftEye);
  group.add(rightEye);

  const browMat = new THREE.LineBasicMaterial({ color: 0x111111 });
  const leftBrow = [new THREE.Vector3(-0.88, 0.95, 1.31), new THREE.Vector3(-0.45, 0.82, 1.31)];
  const rightBrow = [new THREE.Vector3(0.45, 0.82, 1.31), new THREE.Vector3(0.88, 0.95, 1.31)];
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(leftBrow), browMat));
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(rightBrow), browMat));
  makeFaceSmile(group, -0.22);

  addStickLimbs(group, {
    armY: -0.95,
    legY: -2.12,
    armSpread: 1.42,
    legSpread: 0.46,
    armLen: 1.05,
    legLen: 1.05,
    z: 1.3,
    radius: 0.055,
    handRadius: 0.16,
    footRadius: 0.22,
  });

  return group;
}

function createPineTreeMesh() {
  const group = new THREE.Group();
  const greenMat = new THREE.MeshStandardMaterial({ color: 0x23b34b, roughness: 0.62 });

  for (let i = 0; i < 4; i += 1) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(1.85 - i * 0.24, 1.85, 14), greenMat);
    cone.position.y = 1.45 - i * 0.56;
    group.add(cone);
  }

  const trunk = new THREE.Mesh(
    new THREE.ConeGeometry(0.42, 2.95, 10),
    new THREE.MeshStandardMaterial({ color: 0xa8c966, roughness: 0.7 })
  );
  trunk.position.set(0, -0.42, 0.18);
  group.add(trunk);

  const eyeGeo = new THREE.SphereGeometry(0.13, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.38, 0.3, 1.06);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.38, 0.3, 1.06);
  group.add(leftEye);
  group.add(rightEye);
  makeFaceFrown(group, -0.48, 1.08);

  addStickLimbs(group, {
    armY: -0.15,
    legY: -1.65,
    armSpread: 1.35,
    legSpread: 0.46,
    armLen: 1.1,
    legLen: 1.18,
    z: 1.06,
    radius: 0.055,
    handRadius: 0.16,
    footRadius: 0.23,
  });

  return group;
}

function createPhotoFrameMesh() {
  const group = new THREE.Group();

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 3.2, 0.45),
    new THREE.MeshStandardMaterial({ color: 0xf1f5ff, roughness: 0.35 })
  );
  group.add(frame);

  const artTop = new THREE.Mesh(
    new THREE.BoxGeometry(2.46, 1.24, 0.05),
    new THREE.MeshStandardMaterial({ color: 0x4f77e6, roughness: 0.45 })
  );
  artTop.position.set(0, 0.56, 0.25);
  group.add(artTop);

  const artBottom = new THREE.Mesh(
    new THREE.BoxGeometry(2.46, 1.24, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xf25f7f, roughness: 0.45 })
  );
  artBottom.position.set(0, -0.68, 0.25);
  group.add(artBottom);

  const sun = new THREE.Mesh(
    new THREE.CircleGeometry(0.36, 20),
    new THREE.MeshStandardMaterial({ color: 0xf6d34a, roughness: 0.38, side: THREE.DoubleSide })
  );
  sun.position.set(0.86, -0.5, 0.28);
  group.add(sun);

  const eyeGeo = new THREE.SphereGeometry(0.14, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.42, 0.18, 0.3);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.42, 0.18, 0.3);
  group.add(leftEye);
  group.add(rightEye);

  const grin = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = (i / 12) * Math.PI;
    grin.push(new THREE.Vector3(Math.cos(t) * 0.75, -0.48 + Math.sin(t) * 0.42, 0.31));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(grin), new THREE.LineBasicMaterial({ color: 0x111111 })));

  const tooth = new THREE.Mesh(
    new THREE.BoxGeometry(1.0, 0.2, 0.02),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.25 })
  );
  tooth.position.set(0, -0.62, 0.31);
  group.add(tooth);

  addStickLimbs(group, {
    armY: 0.12,
    legY: -1.7,
    armSpread: 1.62,
    legSpread: 0.48,
    armLen: 1.2,
    legLen: 1.25,
    z: 0.31,
    radius: 0.055,
    handRadius: 0.17,
    footRadius: 0.24,
  });

  return group;
}

function createDonutMesh() {
  const group = new THREE.Group();

  const donut = new THREE.Mesh(
    new THREE.TorusGeometry(1.22, 0.56, 22, 40),
    new THREE.MeshStandardMaterial({ color: 0xf0dca5, roughness: 0.58 })
  );
  donut.rotation.x = Math.PI / 2;
  group.add(donut);

  const icing = new THREE.Mesh(
    new THREE.TorusGeometry(1.2, 0.32, 16, 34, Math.PI * 1.35),
    new THREE.MeshStandardMaterial({ color: 0xe7ca89, roughness: 0.46 })
  );
  icing.rotation.set(Math.PI / 2, 0.2, 0.78);
  icing.position.z = 0.1;
  group.add(icing);

  const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.38, 0.52, 0.9);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.3, 0.52, 0.9);
  group.add(leftEye);
  group.add(rightEye);

  const smile = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = (i / 12) * Math.PI;
    smile.push(new THREE.Vector3(Math.cos(t) * 0.62, 0.0 + Math.sin(t) * 0.2, 0.92));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(smile), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -0.02,
    legY: -1.58,
    armSpread: 1.5,
    legSpread: 0.52,
    armLen: 1.0,
    legLen: 1.0,
    z: 0.88,
    radius: 0.055,
    handRadius: 0.16,
    footRadius: 0.23,
  });

  return group;
}

function createBookMesh() {
  const group = new THREE.Group();

  const cover = new THREE.Mesh(
    new THREE.BoxGeometry(2.65, 3.35, 0.95),
    new THREE.MeshStandardMaterial({ color: 0x27a8c8, roughness: 0.5 })
  );
  cover.rotation.y = -0.22;
  group.add(cover);

  const spine = new THREE.Mesh(
    new THREE.BoxGeometry(0.66, 3.3, 0.98),
    new THREE.MeshStandardMaterial({ color: 0x2cc23b, roughness: 0.55 })
  );
  spine.position.set(-1.08, 0, 0.08);
  spine.rotation.y = -0.22;
  group.add(spine);

  const pageStack = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 3.0, 0.84),
    new THREE.MeshStandardMaterial({ color: 0xf7f8ff, roughness: 0.18 })
  );
  pageStack.position.set(1.16, 0.02, 0.1);
  pageStack.rotation.y = -0.22;
  group.add(pageStack);

  const eyeGeo = new THREE.SphereGeometry(0.13, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.28, 0.25, 0.56);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.38, 0.22, 0.56);
  group.add(leftEye);
  group.add(rightEye);

  const smile = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = (i / 12) * Math.PI;
    smile.push(new THREE.Vector3(Math.cos(t) * 0.7, -0.52 + Math.sin(t) * 0.24, 0.58));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(smile), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: -0.5,
    legY: -1.78,
    armSpread: 1.35,
    legSpread: 0.45,
    armLen: 1.12,
    legLen: 1.22,
    z: 0.58,
    radius: 0.055,
    handRadius: 0.16,
    footRadius: 0.23,
  });

  return group;
}

function createBeachBallMesh() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.SphereGeometry(1.35, 24, 22),
    new THREE.MeshStandardMaterial({ color: 0xf7f9ff, roughness: 0.36 })
  );
  group.add(body);

  const segments = [
    { color: 0xf05454, start: -Math.PI * 0.9, length: Math.PI * 0.35 },
    { color: 0xf0e448, start: -Math.PI * 0.55, length: Math.PI * 0.4 },
    { color: 0x73e35c, start: -Math.PI * 0.15, length: Math.PI * 0.35 },
    { color: 0x4fa8ff, start: Math.PI * 0.2, length: Math.PI * 0.42 },
    { color: 0xf39b56, start: Math.PI * 0.62, length: Math.PI * 0.42 },
  ];
  for (const segment of segments) {
    const patch = new THREE.Mesh(
      new THREE.CircleGeometry(1.26, 24, segment.start, segment.length),
      new THREE.MeshStandardMaterial({ color: segment.color, roughness: 0.42, side: THREE.DoubleSide })
    );
    patch.position.z = 1.09;
    group.add(patch);
  }

  const centerCap = new THREE.Mesh(
    new THREE.CircleGeometry(0.26, 18),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, side: THREE.DoubleSide })
  );
  centerCap.position.set(0.52, 0.44, 1.1);
  group.add(centerCap);

  const eyeGeo = new THREE.SphereGeometry(0.12, 10, 10);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.46, 0.18, 1.15);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.2, 0.18, 1.15);
  group.add(leftEye);
  group.add(rightEye);

  const smile = [];
  for (let i = 0; i <= 12; i += 1) {
    const t = (i / 12) * Math.PI;
    smile.push(new THREE.Vector3(Math.cos(t) * 0.66, -0.46 + Math.sin(t) * 0.28, 1.16));
  }
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(smile), new THREE.LineBasicMaterial({ color: 0x111111 })));

  addStickLimbs(group, {
    armY: 0.0,
    legY: -1.45,
    armSpread: 1.32,
    legSpread: 0.48,
    armLen: 1.15,
    legLen: 1.2,
    z: 1.13,
    radius: 0.055,
    handRadius: 0.16,
    footRadius: 0.22,
  });

  return group;
}

function disposeGroup(group) {
  group.traverse((obj) => {
    if (obj.geometry) {
      obj.geometry.dispose();
    }
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        for (const material of obj.material) {
          material.dispose();
        }
      } else {
        obj.material.dispose();
      }
    }
  });
}

function clearCastShowcase() {
  while (castShowcase.length) {
    const item = castShowcase.pop();
    scene.remove(item.mesh);
    disposeGroup(item.mesh);
  }
}

function rebuildCastShowcase() {
  clearCastShowcase();

  const ringX = world.width / 2 - 7;
  const ringZ = world.depth / 2 - 6;
  const hunterIds = state.activeContestants.filter((id) => id !== state.selectedCharacterId);

  for (let i = 0; i < hunterIds.length; i += 1) {
    const character = getCharacterById(hunterIds[i]);
    const angle = (i / Math.max(1, hunterIds.length)) * Math.PI * 2;
    const x = Math.cos(angle) * ringX;
    const z = Math.sin(angle) * ringZ;

    const mesh = createPlayerMesh(character);
    mesh.scale.set(0.58, 0.58, 0.58);
    mesh.position.set(x, character.radius * 0.58, z);
    mesh.rotation.y = Math.atan2(-x, -z);
    scene.add(mesh);

    castShowcase.push({
      id: character.id,
      speed: Math.max(8, character.speed * 0.46),
      radius: Math.max(1.0, character.radius * 0.58),
      mesh,
      x,
      z,
      baseY: character.radius * 0.58,
      phase: i * 0.41,
    });
  }
}

function createPlayerMesh(character) {
  if (character.shape === "leaf") {
    return createLeafyMesh();
  }
  if (character.shape === "fire") {
    return createFireyMesh();
  }
  if (character.shape === "bubble") {
    return createBubbleMesh();
  }
  if (character.shape === "block") {
    return createBlockyMesh();
  }
  if (character.shape === "pencil") {
    return createPencilMesh();
  }
  if (character.shape === "cash") {
    return createCashMesh();
  }
  if (character.shape === "leaf-classic") {
    return createLeafyClassicMesh();
  }
  if (character.shape === "teardrop") {
    return createTeardropMesh();
  }
  if (character.shape === "lava-lamp") {
    return createLavaLampMesh();
  }
  if (character.shape === "lollipop") {
    return createLollipopMesh();
  }
  if (character.shape === "blocky-red") {
    return createRedBlockyMesh();
  }
  if (character.shape === "syringe") {
    return createSyringeMesh();
  }
  if (character.shape === "nickel-note") {
    return createNickelNoteMesh();
  }
  if (character.shape === "syringe-side") {
    return createSyringeSideMesh();
  }
  if (character.shape === "glue-bottle") {
    return createGlueBottleMesh();
  }
  if (character.shape === "pine-tree") {
    return createPineTreeMesh();
  }
  if (character.shape === "photo-frame") {
    return createPhotoFrameMesh();
  }
  if (character.shape === "donut") {
    return createDonutMesh();
  }
  if (character.shape === "book") {
    return createBookMesh();
  }
  if (character.shape === "beach-ball") {
    return createBeachBallMesh();
  }
  return createTennisBallMesh();
}

function rebuildPlayerMesh() {
  if (player.mesh) {
    scene.remove(player.mesh);
    disposeGroup(player.mesh);
  }

  const character = getSelectedCharacter();
  player.mesh = createPlayerMesh(character);
  player.mesh.position.set(player.x, player.radius, player.z);
  scene.add(player.mesh);
}

function applyCharacterStats() {
  const character = getSelectedCharacter();
  player.speed = character.speed;
  player.radius = character.radius;
  rebuildPlayerMesh();
}

function updateTokenMeshes(elapsedSeconds) {
  for (const token of tokens) {
    token.mesh.position.set(token.x, 1.4 + Math.sin(elapsedSeconds * 3 + token.phase) * 0.32, token.z);
    token.mesh.rotation.y += 0.02;
  }
}

function updateHazardMeshes(elapsedSeconds) {
  for (const hazard of hazards) {
    hazard.mesh.position.set(hazard.x, 1.8, hazard.z);
    hazard.mesh.rotation.y = elapsedSeconds + hazard.x * 0.02;
  }
}

function updateCastHunters(dt, elapsedSeconds) {
  for (let i = 0; i < castShowcase.length; i += 1) {
    const hunter = castShowcase[i];
    const dx = player.x - hunter.x;
    const dz = player.z - hunter.z;
    const dist = Math.hypot(dx, dz);
    if (dist > 0.001) {
      const chaseSpeed = hunter.speed;
      hunter.x += (dx / dist) * chaseSpeed * dt;
      hunter.z += (dz / dist) * chaseSpeed * dt;
    }

    hunter.x = clampNumber(hunter.x, -world.width / 2 + hunter.radius, world.width / 2 - hunter.radius);
    hunter.z = clampNumber(hunter.z, -world.depth / 2 + hunter.radius, world.depth / 2 - hunter.radius);

    hunter.mesh.position.set(hunter.x, hunter.baseY + Math.sin(elapsedSeconds * 5 + hunter.phase) * 0.05, hunter.z);
    hunter.mesh.rotation.y = Math.atan2(player.x - hunter.x, player.z - hunter.z);
  }
}

function updatePlayerMesh(elapsedSeconds) {
  if (!player.mesh) {
    return;
  }

  const flyHeight = state.adminFly ? 4.2 : 0;
  const bobScale = state.adminFly ? 0.16 : 0.08;
  player.mesh.position.set(player.x, player.radius + flyHeight + Math.sin(elapsedSeconds * 6) * bobScale, player.z);
  player.mesh.rotation.y = Math.sin(elapsedSeconds * 2) * 0.16;
}

function updateCamera(dt) {
  const targetX = player.x;
  const targetY = player.radius + 10 + (state.adminFly ? 3.6 : 0);
  const targetZ = player.z + 13;
  const smoothing = 1 - Math.exp(-dt * 6);

  camera.position.x += (targetX - camera.position.x) * smoothing;
  camera.position.y += (targetY - camera.position.y) * smoothing;
  camera.position.z += (targetZ - camera.position.z) * smoothing;
  camera.lookAt(player.x, player.radius, player.z);
}

function resetRound() {
  if (state.seasonOver) {
    return;
  }

  if (!state.activeContestants.includes(state.selectedCharacterId)) {
    setMessage("Your character is eliminated. Start a new season.", "lose");
    return;
  }

  const character = getSelectedCharacter();
  state.running = true;
  state.roundEnded = false;
  state.playerWonRound = false;
  state.score = 0;
  state.timeLeft = world.totalTime + character.bonusTime;
  state.secondTick = 0;
  state.keys.clear();
  resetTouchWheel();

  applyCharacterStats();
  player.x = 0;
  player.z = 0;

  clearCastShowcase();
  clearTokens();
  for (let i = 0; i < 5; i += 1) {
    tokens.push(spawnToken());
  }

  spawnHazards();
  updateControlButtons();
  syncHUD();
  syncSeasonInfo();
}

function startSeason(showMessage) {
  state.round = 1;
  state.activeContestants = characters.map((character) => character.id);
  state.eliminatedContestants = [];
  state.roundEnded = false;
  state.seasonOver = false;
  state.lastCeremonySummary = "Finish a round to start elimination.";

  resetRound();
  syncCharacterInfo();

  if (showMessage) {
    setMessage(`${getSelectedCharacter().name} starts a fresh season.`, "");
  } else {
    setMessage("Round starts now. Good luck!", "");
  }

  if (usingFallbackRenderer) {
    setMessage("Safari fallback mode is active. Characters are shown in 2D preview.", "");
  }
}

function selectCharacter(id, restartSeason) {
  state.selectedCharacterId = getCharacterById(id).id;
  applyCharacterStats();
  syncCharacterInfo();
  syncHUD();

  if (restartSeason) {
    startSeason(true);
  }
}

function buildCharacterPicker() {
  characterPickerEl.innerHTML = "";

  for (const character of characters) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "pick-btn";
    button.dataset.id = character.id;
    button.textContent = character.isNew ? `${character.name} (NEW)` : character.name;
    button.addEventListener("click", () => {
      selectCharacter(character.id, true);
    });
    characterPickerEl.appendChild(button);
  }
}

function initAdminPanel() {
  if (!adminPanelEl || !adminToggleBtn || !adminFlyBtn || !adminScoreBtn || !adminTimeBtn || !adminWinBtn) {
    return;
  }

  if (ADMIN_LOCKED) {
    state.adminMode = false;
    state.adminFly = true;
    adminPanelEl.style.display = "none";
    syncAdminUI();
    return;
  }

  adminToggleBtn.addEventListener("click", () => {
    setAdminMode(!state.adminMode);
    setMessage(state.adminMode ? "Admin mode enabled." : "Admin mode disabled.", state.adminMode ? "win" : "");
  });

  adminScoreBtn.addEventListener("click", () => {
    adminAddScore(5);
  });

  adminFlyBtn.addEventListener("click", () => {
    if (!state.adminMode) {
      return;
    }
    state.adminFly = !state.adminFly;
    syncAdminUI();
  });

  adminTimeBtn.addEventListener("click", () => {
    adminAddTime(15);
  });

  adminWinBtn.addEventListener("click", () => {
    if (!state.adminMode || !state.running) {
      return;
    }
    state.score = world.targetScore;
    syncHUD();
    endRound(true);
  });

  const params = new URLSearchParams(window.location.search);
  if (params.get("admin") === "1" || params.get("admin") === "true") {
    setAdminMode(true);
  } else {
    syncAdminUI();
  }
}

function resetTouchWheel() {
  state.touchMoveX = 0;
  state.touchMoveZ = 0;
  state.touchPointerId = null;

  if (moveThumbEl) {
    moveThumbEl.style.transform = "translate(-50%, -50%)";
  }
}

function updateTouchWheel(clientX, clientY) {
  if (!moveWheelEl || !moveThumbEl) {
    return;
  }

  const rect = moveWheelEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const maxDistance = rect.width * 0.32;

  let dx = clientX - cx;
  let dy = clientY - cy;
  const len = Math.hypot(dx, dy);
  if (len > maxDistance) {
    dx = (dx / len) * maxDistance;
    dy = (dy / len) * maxDistance;
  }

  state.touchMoveX = dx / maxDistance;
  state.touchMoveZ = dy / maxDistance;

  moveThumbEl.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
}

function initTouchWheel() {
  if (!moveWheelEl) {
    return;
  }

  moveWheelEl.addEventListener("pointerdown", (event) => {
    state.touchPointerId = event.pointerId;
    moveWheelEl.setPointerCapture(event.pointerId);
    updateTouchWheel(event.clientX, event.clientY);
    event.preventDefault();
  });

  moveWheelEl.addEventListener("pointermove", (event) => {
    if (event.pointerId !== state.touchPointerId) {
      return;
    }
    updateTouchWheel(event.clientX, event.clientY);
    event.preventDefault();
  });

  const finishTouch = (event) => {
    if (event.pointerId !== state.touchPointerId) {
      return;
    }
    resetTouchWheel();
    event.preventDefault();
  };

  moveWheelEl.addEventListener("pointerup", finishTouch);
  moveWheelEl.addEventListener("pointercancel", finishTouch);
  moveWheelEl.addEventListener("lostpointercapture", () => {
    resetTouchWheel();
  });

  // iPhone Safari fallback: keep wheel controls working on devices that
  // behave better with classic touch events than pointer events.
  moveWheelEl.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }
      updateTouchWheel(touch.clientX, touch.clientY);
      event.preventDefault();
    },
    { passive: false }
  );

  moveWheelEl.addEventListener(
    "touchmove",
    (event) => {
      const touch = event.changedTouches[0];
      if (!touch) {
        return;
      }
      updateTouchWheel(touch.clientX, touch.clientY);
      event.preventDefault();
    },
    { passive: false }
  );

  const endTouchWheel = (event) => {
    resetTouchWheel();
    event.preventDefault();
  };

  moveWheelEl.addEventListener("touchend", endTouchWheel, { passive: false });
  moveWheelEl.addEventListener("touchcancel", endTouchWheel, { passive: false });
}

function clampPlayer() {
  player.x = Math.max(-world.width / 2 + player.radius, Math.min(world.width / 2 - player.radius, player.x));
  player.z = Math.max(-world.depth / 2 + player.radius, Math.min(world.depth / 2 - player.radius, player.z));
}

function handleInput(dt) {
  let dx = state.touchMoveX;
  let dz = state.touchMoveZ;

  if (state.keys.has("arrowleft") || state.keys.has("a")) dx -= 1;
  if (state.keys.has("arrowright") || state.keys.has("d")) dx += 1;
  if (state.keys.has("arrowup") || state.keys.has("w")) dz -= 1;
  if (state.keys.has("arrowdown") || state.keys.has("s")) dz += 1;

  if (dx !== 0 || dz !== 0) {
    const len = Math.hypot(dx, dz);
    const moveSpeed = state.adminMode ? player.speed * 1.35 : player.speed;
    player.x += (dx / len) * moveSpeed * dt;
    player.z += (dz / len) * moveSpeed * dt;
    clampPlayer();
  }
}

function updateHazards(dt) {
  for (const hazard of hazards) {
    hazard.x += hazard.vx * dt;
    hazard.z += hazard.vz * dt;

    if (hazard.x - hazard.w / 2 < -world.width / 2 || hazard.x + hazard.w / 2 > world.width / 2) {
      hazard.vx *= -1;
    }

    if (hazard.z - hazard.d / 2 < -world.depth / 2 || hazard.z + hazard.d / 2 > world.depth / 2) {
      hazard.vz *= -1;
    }

    hazard.x = clampNumber(hazard.x, -world.width / 2 + hazard.w / 2, world.width / 2 - hazard.w / 2);
    hazard.z = clampNumber(hazard.z, -world.depth / 2 + hazard.d / 2, world.depth / 2 - hazard.d / 2);
  }
}

function overlapsCircleRect(circle, rect) {
  const closestX = Math.max(rect.x - rect.w / 2, Math.min(circle.x, rect.x + rect.w / 2));
  const closestZ = Math.max(rect.z - rect.d / 2, Math.min(circle.z, rect.z + rect.d / 2));
  const dx = circle.x - closestX;
  const dz = circle.z - closestZ;
  return dx * dx + dz * dz <= circle.radius * circle.radius;
}

function endRound(won) {
  state.running = false;
  state.roundEnded = true;
  state.playerWonRound = won;

  if (won) {
    setMessage("Safe this round. Press Next Round for elimination ceremony.", "win");
  } else {
    setMessage("You are up for elimination. Press Next Round.", "lose");
  }

  updateControlButtons();
}

function checkCollisions() {
  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const token = tokens[i];
    const dx = player.x - token.x;
    const dz = player.z - token.z;
    const d = Math.hypot(dx, dz);
    if (d <= player.radius + token.radius) {
      scene.remove(token.mesh);
      token.mesh.geometry.dispose();
      token.mesh.material.dispose();
      tokens.splice(i, 1);
      state.score += 1;
      tokens.push(spawnToken());
      syncHUD();
      if (state.score >= world.targetScore) {
        endRound(true);
        return;
      }
    }
  }

  if (!state.adminMode) {
    for (const hazard of hazards) {
      if (overlapsCircleRect(player, hazard)) {
        endRound(false);
        return;
      }
    }

    for (const hunter of castShowcase) {
      const dx = player.x - hunter.x;
      const dz = player.z - hunter.z;
      const dist = Math.hypot(dx, dz);
      if (dist <= player.radius + hunter.radius) {
        endRound(false);
        setMessage("Another character hunted you down. Press Next Round.", "lose");
        return;
      }
    }
  }
}

function updateTimer(dt) {
  if (state.adminMode) {
    return;
  }

  state.secondTick += dt;
  while (state.secondTick >= 1) {
    state.secondTick -= 1;
    state.timeLeft -= 1;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      syncHUD();
      endRound(state.score >= world.targetScore);
      return;
    }
    syncHUD();
  }
}

function buildRoundScores() {
  const scores = {};

  for (const id of state.activeContestants) {
    const character = getCharacterById(id);

    if (id === state.selectedCharacterId) {
      scores[id] = state.score;
      continue;
    }

    const base = randInt(4, 13);
    const statBoost =
      Math.round((character.speed - 25) / 2.2) +
      Math.round((2.2 - character.radius) / 0.5) +
      Math.round(character.bonusTime * 0.4);
    const swing = randInt(-2, 2);

    scores[id] = clampNumber(base + statBoost + swing, 0, 18);
  }

  return scores;
}

function getImmuneContestant(scores) {
  if (state.playerWonRound) {
    return state.selectedCharacterId;
  }

  const contenders = Object.keys(scores);
  let bestId = contenders[0];

  for (const id of contenders) {
    if (scores[id] > scores[bestId]) {
      bestId = id;
    }
  }

  return bestId;
}

function getEliminatedContestant(scores, immuneId) {
  const candidates = state.activeContestants.filter((id) => id !== immuneId);
  let lowest = Number.POSITIVE_INFINITY;

  for (const id of candidates) {
    if (scores[id] < lowest) {
      lowest = scores[id];
    }
  }

  const lowestIds = candidates.filter((id) => scores[id] === lowest);
  return lowestIds[randInt(0, lowestIds.length - 1)];
}

function runEliminationCeremony() {
  if (state.seasonOver) {
    startSeason(true);
    return;
  }

  if (!state.roundEnded) {
    return;
  }

  const scores = buildRoundScores();
  const immuneId = getImmuneContestant(scores);
  const eliminatedId = getEliminatedContestant(scores, immuneId);

  const sorted = [...state.activeContestants].sort((a, b) => scores[b] - scores[a]);
  const scoreLine = sorted.map((id) => `${getCharacterName(id)} ${scores[id]}`).join(" | ");
  state.lastCeremonySummary = `Round ${state.round} results: ${scoreLine}. Immune: ${getCharacterName(
    immuneId
  )}. Eliminated: ${getCharacterName(eliminatedId)}.`;

  state.activeContestants = state.activeContestants.filter((id) => id !== eliminatedId);
  state.eliminatedContestants.push(eliminatedId);

  if (eliminatedId === state.selectedCharacterId) {
    state.seasonOver = true;
    state.running = false;
    state.roundEnded = false;
    syncHUD();
    syncSeasonInfo();
    updateControlButtons();
    setMessage("You were eliminated. Press Start New Season to play again.", "lose");
    return;
  }

  if (state.activeContestants.length === 1) {
    state.seasonOver = true;
    state.running = false;
    state.roundEnded = false;
    const winnerId = state.activeContestants[0];
    syncHUD();
    syncSeasonInfo();
    updateControlButtons();

    if (winnerId === state.selectedCharacterId) {
      setMessage("You won the season! Press Start New Season.", "win");
    } else {
      setMessage(`${getCharacterName(winnerId)} won the season. Press Start New Season.`, "lose");
    }
    return;
  }

  state.round += 1;
  resetRound();
  syncSeasonInfo();
  setMessage(`Round ${state.round} begins. ${getCharacterName(eliminatedId)} was eliminated.`, "");
}

let previousTime = performance.now();
let elapsedSeconds = 0;

function frame(now) {
  const dt = Math.min((now - previousTime) / 1000, 0.04);
  previousTime = now;
  elapsedSeconds += dt;

  if (state.running) {
    handleInput(dt);
    updateCastHunters(dt, elapsedSeconds);
    updateHazards(dt);
    checkCollisions();
    updateTimer(dt);
  }

  updateTokenMeshes(elapsedSeconds);
  updateHazardMeshes(elapsedSeconds);
  updatePlayerMesh(elapsedSeconds);
  updateCamera(dt);
  updateMultiplayer(dt, elapsedSeconds);

  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

window.addEventListener("beforeunload", () => {
  if (multiplayer.hostConn && multiplayer.hostConn.open) {
    multiplayer.hostConn.close();
  }
  if (multiplayer.peer) {
    multiplayer.peer.destroy();
  }
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  const movementKeys = ["arrowleft", "arrowright", "arrowup", "arrowdown", "a", "s", "d", "w"];
  if (movementKeys.includes(key)) {
    event.preventDefault();
  }
  state.keys.add(key);
});

window.addEventListener("keyup", (event) => {
  state.keys.delete(event.key.toLowerCase());
});

restartBtn.addEventListener("click", () => {
  if (state.seasonOver && !state.activeContestants.includes(state.selectedCharacterId)) {
    setMessage("You are eliminated. Use Start New Season.", "lose");
    return;
  }

  if (state.seasonOver) {
    startSeason(true);
    return;
  }

  resetRound();
  setMessage(`Round ${state.round} restarted.`, "");
});

nextRoundBtn.addEventListener("click", runEliminationCeremony);

initMultiplayer();
initTouchWheel();
initAdminPanel();
buildCharacterPicker();
selectCharacter(state.selectedCharacterId, false);
startSeason(false);
requestAnimationFrame(frame);
