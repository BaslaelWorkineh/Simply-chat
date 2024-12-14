<template>
  <div class="drawing-pad">
    <canvas
      ref="canvasRef"
      :width="width"
      :height="height"
      class="canvas"
    ></canvas>
  
    <div class="controls">
      <button @click="clearCanvas">Clear</button>
      <input type="color" v-model="color" @change="changeColor" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useNuxtApp } from '#app';

// Pass the roomId from the parent component
const props = defineProps({
  roomId: {
    type: String,
    required: true
  }
});

const { $socket } = useNuxtApp();

const width = 500;
const height = 300;
const canvasRef = ref(null);
let ctx;

const drawing = ref(false);
const lastX = ref(0);
const lastY = ref(0);
const color = ref("#000000");

onMounted(() => {
  const canvas = canvasRef.value;
  ctx = canvas.getContext('2d');

  // Initial canvas setup (optional)
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // Event listeners for drawing
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', draw);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Join room and listen for other drawings
  if ($socket) {
    $socket.emit("join-room", props.roomId);

    $socket.on("receive-drawing-data", (data) => {
      drawOnCanvas(data);
    });

    $socket.on("clear-canvas", () => {
      clearCanvas();
    });
  }
});

// Start drawing on mousedown
const startDrawing = (event) => {
  const [x, y] = getMousePosition(event);
  drawing.value = true;
  lastX.value = x;
  lastY.value = y;
  ctx.beginPath();
  ctx.moveTo(x, y);
};

// Stop drawing
const stopDrawing = () => {
  drawing.value = false;
};

// Draw on canvas when mouse is moved
const draw = (event) => {
  if (!drawing.value) return;

  const [x, y] = getMousePosition(event);
  ctx.strokeStyle = color.value;
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX.value = x;
  lastY.value = y;

  const data = {
    roomId: props.roomId,
    x,
    y,
    color: color.value
  };
  $socket.emit("send-drawing-data", data);
};

// Get mouse position relative to canvas
const getMousePosition = (event) => {
  const canvas = canvasRef.value;
  if (!canvas) return [null, null]; 

  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  return [x, y];
};

// Change drawing color
const changeColor = () => {};

// Clear the canvas
const clearCanvas = () => {
  const canvas = canvasRef.value;
  if (canvas && ctx) {
    ctx.clearRect(0, 0, width, height);
  }
  $socket.emit("clear-canvas", props.roomId);
};

// Draw received data on the canvas
const drawOnCanvas = (data) => {
  const { x, y, color } = data;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(lastX.value, lastY.value);
  ctx.lineTo(x, y);
  ctx.stroke();
  lastX.value = x;
  lastY.value = y;
};
</script>
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

.drawing-pad {
  width: 95vw;
  height: calc(100vh - 160px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(to right, #0A0F1C, #1A1033, #0A0F1C);
  font-family: 'Space Grotesk', sans-serif;
}

.canvas {
  flex-grow: 1;
  width: 100%;
  max-height: calc(100% - 150px); /* Adjust for header and footer */
  border: 2px solid #FF3366;
  border-radius: 5px;
  background-color: #121212;
}

.controls {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: rgba(10, 15, 28, 0.8);
  border-radius: 5px;
  margin-top: 10px;
}

button {
  padding: 10px;
  bottom:30px;
  background-color: #FF3366;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Syncopate', sans-serif;
  font-size: 14px;
}

button:hover {
  background-color: #FF4B76;
}

input[type="color"] {
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .drawing-pad {
    padding: 10px;
    height: 70vh;
  }

  .canvas {
    max-height: calc(100% - 320px); /* Adjust for header/footer and responsive padding */
  }

  .controls {
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
  }

  button {
    margin-bottom: 5px;
    
  }
}
</style>
