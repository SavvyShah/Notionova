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
let points = [];
let paths = [];

// Function to update pen color
function changePenColor(color) {
  penColor = color;
}

function renderCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const renderPath = new Path2D(path);
    ctx.stroke(renderPath);
  }
}

// Trim SVG path data so number are each two decimal points. This
// improves SVG exports, and prevents rendering errors on points
// with long decimals.
const TO_FIXED_PRECISION = /(\s?[A-Z]?,?-?[0-9]*\.[0-9]{0,2})(([0-9]|e|-)*)/g;

function med(A, B) {
  return [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
}

function getSvgPathFromStroke(points) {
  if (!points.length) {
    return "";
  }

  const max = points.length - 1;

  return points
    .reduce(
      (acc, point, i, arr) => {
        if (i === max) {
          acc.push(point);
        } else {
          acc.push(point, med(point, arr[i + 1]));
        }
        return acc;
      },
      ["M", points[0], "Q"]
    )
    .join(" ")
    .replace(TO_FIXED_PRECISION, "$1");
}

// Event listeners for pointer events
canvas.addEventListener("pointerdown", (e) => {
  isDrawing = true;
  ctx.lineWidth = 5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  points.push([e.clientX, e.clientY]);
});

canvas.addEventListener("pointermove", (e) => {
  if (isDrawing === false) return;
  points.push([e.clientX, e.clientY]);
  renderCanvas();
  const path = getSvgPathFromStroke(points);
  const renderPath = new Path2D(path);
  ctx.stroke(renderPath);
});
canvas.addEventListener("pointerup", () => {
  isDrawing = false;
  paths.push(getSvgPathFromStroke(points));
  console.log(paths);
  points = [];
});
canvas.addEventListener("pointerout", () => (isDrawing = false));
canvas.addEventListener("pointercancel", () => (isDrawing = false));
