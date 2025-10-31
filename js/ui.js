// =============================
// ui.js - Control de interfaz
// =============================

export function showElement(el) {
  el.classList.remove("hidden");
}

export function hideElement(el) {
  el.classList.add("hidden");
}

export function showPopup(popup) {
  popup.classList.remove("hidden");
}

export function hidePopup(popup) {
  popup.classList.add("hidden");
}
