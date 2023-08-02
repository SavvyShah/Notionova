// Get the canvas element and its context
const canvas = document.getElementById("drawingCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Set the initial pen color
let penColor = "blue";

// Store the last mouse position
let lastX, lastY;

// Flag to indicate drawing state
let isDrawing = false;

// Function to update pen color
function changePenColor(color) {
  penColor = color;
}

// Function to draw on the canvas
function draw(e) {
  if (!isDrawing) return;

  const { offsetX, offsetY } = e;

  ctx.beginPath();
  ctx.strokeStyle = penColor;
  ctx.lineWidth = 5;
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(offsetX, offsetY);
  ctx.stroke();

  // Update the last mouse position
  lastX = offsetX;
  lastY = offsetY;
}

// Event listeners for pointer events
canvas.addEventListener("pointerdown", (e) => {
  isDrawing = true;
  lastX = e.offsetX;
  lastY = e.offsetY;
});

canvas.addEventListener("pointermove", draw);
canvas.addEventListener("pointerup", () => (isDrawing = false));
canvas.addEventListener("pointerout", () => (isDrawing = false));
canvas.addEventListener("pointercancel", () => (isDrawing = false));
