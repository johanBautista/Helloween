// =============================
// main.js - Flujo principal del juego
// =============================
import { loadFaceModels, startCamera, startFaceDetection } from "./camera.js";
import { showElement, hideElement, showPopup, hidePopup } from "./ui.js";

let playerName = "";

// ELEMENTOS
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const nameInput = document.getElementById("player-name");
const saveNameBtn = document.getElementById("save-name");
const cameraBtn = document.getElementById("camera-btn");
const readyButtons = document.getElementById("ready-buttons");
const showInstructionsBtn = document.getElementById("show-instructions");
const startGameBtn = document.getElementById("start-game");
const resetGameBtn = document.getElementById("reset");
const instructionsText = document.getElementById("instructions-text");
const popup = document.getElementById("popup");
const closePopupBtn = document.getElementById("close-popup");
const playerDisplay = document.getElementById("player-display");
const musicBSO = new Audio("./assets/music-bso.mp3"); // background sound 🎶

// =============================
// EVENTOS PRINCIPALES
// =============================

musicBSO.loop = true;

// 1️ Guardar nombre
saveNameBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  if (!name) {
    alert("Por favor, ingresa un nombre antes de continuar.");
    return;
  }

  musicBSO.play();
  playerName = name;
  hideElement(nameInput);
  hideElement(saveNameBtn);
  instructionsText.textContent = `¡Hola, ${playerName}! Puedes leer las instrucciones o empezar el juego.`;
  showElement(readyButtons);
});

// 2️ Mostrar / cerrar popup
showInstructionsBtn.addEventListener("click", () => showPopup(popup));
closePopupBtn.addEventListener("click", () => hidePopup(popup));

// 3️ Iniciar juego (ahora carga cámara y Face API)
startGameBtn.addEventListener("click", async () => {
  hideElement(startScreen);
  showElement(gameScreen);
  hidePopup(popup);
  playerDisplay.textContent = `Jugador: ${playerName}`;

  instructionsText.textContent = "Cargando modelos de detección...";

  await loadFaceModels(); // Cargar modelos
  await startCamera(); // Activar cámara

  // Esperar a que el video esté listo
  const videoElement = document.getElementById("video");
  videoElement.addEventListener("playing", async () => {
    console.log("🎬 Video en reproducción, iniciando detección facial...");
    await startFaceDetection();
  });

  console.log("👻 Juego iniciado con detección facial activa");
});

// 4️ Resetear juego
resetGameBtn.addEventListener("click", () => {
  window.location.reload();
});
