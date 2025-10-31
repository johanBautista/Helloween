let canvas, ctx;
let candies = [];
let ghosts = [];
let player = { x: 0, y: 0 };
let mouthOpen = false;

// 🧙‍♀️ Gorro e imagen
let witchHatImg = new Image();
witchHatImg.src = "./assets/witch-hat.png";

// 👻 Sonido del fantasma
const ghostSound = new Audio("./assets/ghost.mp3");

// --- CONFIG ---
const CANDY_INTERVAL = 2000; // cada 2s
const GHOST_GROWTH = 1.3; // crecimiento progresivo
const MAX_GHOST_SIZE = 80;
const CANDY_SPEED = 3;
const GHOST_RISE_SPEED = -2;

// 🎃 Array de emojis de caramelos
const candyEmojis = ["🍬", "🍭", "🍫", "🧁", "🍡", "🍩", "🍪"];

// =============================
// Inicializar canvas del juego
// =============================
export function initGameCanvas(videoElement) {
  canvas = faceapi.createCanvasFromMedia(videoElement);
  document.body.append(canvas);
  canvas.id = "game-canvas";

  ctx = canvas.getContext("2d");
  faceapi.matchDimensions(canvas, {
    width: videoElement.width,
    height: videoElement.height,
  });

  // Posicionar sobre el video
  canvas.style.position = "absolute";
  canvas.style.top = `${videoElement.offsetTop}px`;
  canvas.style.left = `${videoElement.offsetLeft}px`;
  canvas.style.pointerEvents = "none"; // No bloquear clics

  return canvas;
}

// =============================
// Dibujar elementos del juego
// =============================
function drawObjects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🍭 Dibujar caramelos cayendo
  ctx.font = "40px Arial";
  candies.forEach((c) => {
    ctx.fillText(c.emoji, c.x, c.y);
    c.y += CANDY_SPEED;
  });
  candies = candies.filter((c) => c.y < canvas.height);

  // 👻 Dibujar fantasmas
  ghosts.forEach((g) => {
    ctx.save();
    ctx.font = `${g.size}px Arial`;
    ctx.fillText("👻", g.x, g.y);
    ctx.restore();

    // Crecen y suben
    if (g.size < MAX_GHOST_SIZE) g.size += GHOST_GROWTH;
    g.y += GHOST_RISE_SPEED;
  });
  ghosts = ghosts.filter((g) => g.y > -50);

  // 🧙‍♀️ Dibujar gorro de bruja
  if (player.x && player.y) {
    const hatX = player.x - 180;
    const hatY = player.y - 360;
    ctx.drawImage(witchHatImg, hatX, hatY, 340, 340);
  }
}

// =============================
// Crear elementos
// =============================
function spawnCandy() {
  const emoji = candyEmojis[Math.floor(Math.random() * candyEmojis.length)];
  candies.push({ emoji, x: Math.random() * canvas.width, y: 0 });
}

function spawnGhost(x, y) {
  try {
    ghostSound.currentTime = 0;
    ghostSound.play();
  } catch (err) {
    // ignorar errores de autoplay bloqueado
  }
  ghosts.push({ x, y, size: 10 });
}

// =============================
// Lógica principal del juego
// =============================
export function updateGame(detections) {
  if (!detections.length) return;

  const detection = detections[0];
  const landmarks = detection.landmarks;
  const mouth = landmarks.getMouth();
  const nose = landmarks.getNose();

  // 1️ Detectar si la boca está abierta
  const topLip = mouth[13].y;
  const bottomLip = mouth[19].y;
  mouthOpen = bottomLip - topLip > 20;

  // 2️ Si abre la boca → generar fantasma desde la boca
  if (mouthOpen && Math.random() < 0.1) {
    const mouthCenterX = (mouth[13].x + mouth[19].x) / 2;
    const mouthCenterY = (mouth[13].y + mouth[19].y) / 2;
    spawnGhost(mouthCenterX, mouthCenterY);
  }

  // 3️ Actualizar posición de cabeza (para el gorro)
  const nosePoint = nose[3];
  player.x = nosePoint.x;
  player.y = nosePoint.y;

  // 4️ Dibujar todo
  drawObjects();
}

// =============================
// Iniciar caída de caramelos 🍭
// =============================
export function startCandyRain() {
  setInterval(spawnCandy, CANDY_INTERVAL);
}
