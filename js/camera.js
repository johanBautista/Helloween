// =============================
// camera.js - Control de cámara y Face API
// =============================

import { initGameCanvas, startCarrots, updateGame } from "./game.js";

let videoStream = null;
const elVideo = document.getElementById("video");

// Cargar los modelos Face API
export async function loadFaceModels() {
  await Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("./models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("./models"),
    faceapi.nets.faceExpressionNet.loadFromUri("./models"),
    faceapi.nets.ageGenderNet.loadFromUri("./models"),
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

  //   const canvas = faceapi.createCanvasFromMedia(videoElement);
  //   document.body.append(canvas);
  //   // Alinear el canvas sobre el video
  //   canvas.style.position = "absolute";
  //   canvas.style.top = `${videoElement.offsetTop}px`;
  //   canvas.style.left = `${videoElement.offsetLeft}px`;

  const canvas = initGameCanvas(videoElement);
  startCarrots();

  const displaySize = {
    width: videoElement.width,
    height: videoElement.height,
  };
  faceapi.matchDimensions(canvas, displaySize);

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
    //   .withFaceExpressions()
    //   .withAgeAndGender();

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    // faceapi.draw.drawDetections(canvas, resizedDetections);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    // // faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // resizedDetections.forEach((detection) => {
    //   const { box } = detection.detection;
    //   const label = `${Math.round(detection.age)} años - ${detection.gender}`;
    //   new faceapi.draw.DrawBox(box, { label }).draw(canvas);
    // });

    updateGame(resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 100);
}
