// =============================
// camera.js - Control de cámara y Face API
// =============================

import { initGameCanvas, startCandyRain, updateGame } from "./game.js";

let videoStream = null;
const elVideo = document.getElementById("video");
let showDebug = false;

// Cargar los modelos Face API
export async function loadFaceModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
  ]);
  console.log("✅ Modelos Face API cargados");
}

// Iniciar la cámara
export async function startCamera() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
    elVideo.srcObject = videoStream;
    console.log("🎥 Cámara iniciada");
  } catch (error) {
    console.error("❌ Error al iniciar cámara:", error);
    alert("No se pudo acceder a la cámara. Verifica los permisos.");
  }
}

// Iniciar detección facial
export async function startFaceDetection() {
  const videoElement = document.getElementById("video");
  const canvas = initGameCanvas(videoElement);
  startCandyRain();

  const displaySize = {
    width: videoElement.width,
    height: videoElement.height,
  };
  faceapi.matchDimensions(canvas, displaySize);

  // Teclas para alternar depuración
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "d") showDebug = true;
    if (e.key.toLowerCase() === "h") showDebug = false;
  });

  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(
        videoElement,
        new faceapi.TinyFaceDetectorOptions({
          inputSize: 320,
          scoreThreshold: 0.5,
        })
      )
      .withFaceLandmarks();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    updateGame(resizedDetections);

    // Mostrar puntos de referencia si está en modo depuración
    if (showDebug) {
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }
  }, 100);
}
