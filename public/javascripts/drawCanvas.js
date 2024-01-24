const drawScript = document.getElementById('drawScript');
const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

// intitial brush size
let lineWidth = 10;
let isDrawing = false;
let isErasing = false;
let currentColor = 'black';

if (drawScript?.getAttribute('data-allow-draw') === 'true') {
  // allow drawing on canvas
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  canvas.style.cursor = `url(${generateCircularCursorImage(
    lineWidth * 2,
    lineWidth,
    currentColor
  )}) ${lineWidth} ${lineWidth}, auto`;
}

// Intercept form and set value of hidden image data input
const form = document.querySelector('form');
form.addEventListener('submit', function (e) {
  const imageDataInput = document.querySelector('input[name="image_data"]');
  const imageData = canvas.toDataURL('image/png');
  if (imageDataInput) {
    imageDataInput.value = imageData;
    console.log(imageDataInput.value);
  }
});

// draw image if image is provided
document.addEventListener('DOMContentLoaded', function () {
  // Get the canvas and context
  const canvas = document.getElementById('drawingCanvas');
  const ctx = canvas.getContext('2d');

  // Your base64-encoded image data
  const drawScript = document.getElementById('drawScript');
  if (drawScript) {
    const base64ImageData = drawScript.getAttribute('data-image-data');

    // Create an Image object
    const img = new Image();

    // Set the source of the image using the base64-encoded data
    img.src = base64ImageData;

    // When the image is loaded, draw it on the canvas
    img.onload = function () {
      ctx.drawImage(img, 0, 0);
    };
  }
});

document.querySelector('#drawButton')?.classList.add('paintButtonActive');
document.querySelector('#clearButton')?.addEventListener('click', clearCanvas);

document.querySelector('#eraseButton')?.addEventListener('click', () => {
  isErasing = true;
  toggleButton('eraseButton');
  context.globalCompositeOperation = 'destination-out';
});

document.getElementById('drawButton')?.addEventListener('click', () => {
  isErasing = false;
  toggleButton('drawButton');
  context.globalCompositeOperation = 'source-over';
});

document.getElementById('colorPicker')?.addEventListener('input', (event) => {
  currentColor = event.target.value;
  // Set the custom cursor image as the cursor
  canvas.style.cursor = `url(${generateCircularCursorImage(
    lineWidth * 2,
    lineWidth,
    currentColor
  )}) ${lineWidth} ${lineWidth}, auto`;
});

// Function to generate a circular cursor image
function generateCircularCursorImage(diameter, lineWidth, outlineColor) {
  const cursorCanvas = document.createElement('canvas');
  cursorCanvas.width = diameter;
  cursorCanvas.height = diameter;

  const cursorContext = cursorCanvas.getContext('2d');
  cursorContext.beginPath();
  cursorContext.arc(
    diameter / 2,
    diameter / 2,
    diameter / 2 - lineWidth / 2,
    0,
    2 * Math.PI
  );
  cursorContext.strokeStyle = outlineColor;
  cursorContext.stroke();

  return cursorCanvas.toDataURL(); // Return the data URL of the cursor image
}

function toggleButton(activeButtonId) {
  // Remove the 'active' class from all buttons
  document.getElementById('drawButton').classList.remove('paintButtonActive');
  document.getElementById('eraseButton').classList.remove('paintButtonActive');

  // Add the 'active' class to the clicked button
  document.getElementById(activeButtonId).classList.add('paintButtonActive');
}

function clearCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
  isDrawing = true;
  draw(e);
}

function draw(e) {
  if (!isDrawing) return;
  context.lineWidth = lineWidth;
  context.lineCap = 'round';

  // const x = e.clientX - canvas.offsetLeft;
  // const y = e.clientY - canvas.offsetTop;

  const rect = canvas.getBoundingClientRect();
  const x = e.pageX - window.scrollX - rect.left;
  const y = e.pageY - window.scrollY - rect.top;

  context.strokeStyle = currentColor;
  context.lineTo(x, y);
  context.stroke();
  context.beginPath();
  // context.arc(x, y, context.lineWidth / 2, 0, Math.PI * 2);
  context.fill();
  context.beginPath();
  context.moveTo(x, y);
}

function stopDrawing() {
  isDrawing = false;
  context.beginPath(); // Reset the path to start a new one when drawing resumes
}
