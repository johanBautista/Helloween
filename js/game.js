// =============================
// game.js - Lógica del juego
// =============================

let canvas, ctx;
let carrots = [];
let ghosts = [];
let player = { x: 0, y: 0 };
let mouthOpen = false;

// --- CONFIG ---
const CARROT_INTERVAL = 1000; // cada 1s cae una zanahoria
const GHOST_SPEED = -2;
const CARROT_SPEED = 3;

// Cargar el canvas una vez
export function initGameCanvas(videoElement) {
  canvas = faceapi.createCanvasFromMedia(videoElement);
  document.body.append(canvas);
  canvas.id = "game-canvas";

  ctx = canvas.getContext("2d");
  faceapi.matchDimensions(canvas, {
    width: videoElement.width,
    height: videoElement.height,
  });

  // 💡 Añade esto para posicionarlo sobre el video:
  canvas.style.position = "absolute";
  canvas.style.top = `${videoElement.offsetTop}px`;
  canvas.style.left = `${videoElement.offsetLeft}px`;
  canvas.style.pointerEvents = "none"; // para que no bloquee clics

  return canvas;
}

// Dibuja los objetos del juego
function drawObjects() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dibujar zanahorias 🥕
  ctx.font = "130px Arial";
  carrots.forEach((c) => {
    ctx.fillText("🍬", c.x, c.y);
    c.y += CARROT_SPEED;
  });
  carrots = carrots.filter((c) => c.y < canvas.height);

  // Dibujar fantasmas 👻
  ctx.font = "240px Arial";
  ghosts.forEach((g) => {
    ctx.fillText("👻", g.x, g.y);
    g.y += GHOST_SPEED;
  });
  ghosts = ghosts.filter((g) => g.y > -50);

  // Dibujar cepillo 🪥 (controlado por la cabeza)
  //   ctx.font = "40px Arial";
  //   ctx.fillText("🪥", player.x - 20, player.y + 50);
}

// Crear zanahorias
function spawnCarrot() {
  carrots.push({ x: Math.random() * canvas.width, y: 0 });
}

// Crear fantasmas
function spawnGhost() {
  ghosts.push({ x: Math.random() * canvas.width, y: canvas.height - 50 });
}

// Bucle principal del juego
export function updateGame(detections) {
  if (!detections.length) return;

  const detection = detections[0];
  const landmarks = detection.landmarks;
  const mouth = landmarks.getMouth();
  const nose = landmarks.getNose();

  // 1️⃣ Detectar si la boca está abierta
  const topLip = mouth[13].y;
  const bottomLip = mouth[19].y;
  mouthOpen = bottomLip - topLip > 20;

  // 2️⃣ Si abre la boca → aparece un fantasma 👻
  if (mouthOpen && Math.random() < 0.1) {
    spawnGhost();
  }

  // 3️⃣ Controlar el cepillo con la cabeza (nariz)
  const nosePoint = nose[3];
  player.x = nosePoint.x;
  player.y = nosePoint.y;

  // 4️⃣ Dibujar todos los elementos
  drawObjects();
}

// Iniciar caída de zanahorias
export function startCarrots() {
  setInterval(spawnCarrot, CARROT_INTERVAL);
}
