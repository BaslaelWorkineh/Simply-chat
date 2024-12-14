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
  import { ref, onMounted } from 'vue';
  import { useNuxtApp } from '#app';
  
  const { $socket } = useNuxtApp();
  
  const width = 500;
  const height = 300;
  const canvasRef = ref(null);
  let ctx;
  
  const drawing = ref(false);
  const lastX = ref(0);
  const lastY = ref(0);
  const color = ref("#000000");
  const roomId = ref("1234"); // Your room ID for collaboration
  
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
      $socket.emit("join-room", roomId.value);
  
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
      roomId: roomId.value,
      x,
      y,
      color: color.value,
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
    $socket.emit("clear-canvas", roomId.value);
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
  .drawing-pad {
    max-width: 500px;
    margin: auto;
    padding: 20px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .canvas {
    border: 1px solid black;
  }
  
  .controls {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  button {
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  
  input[type="color"] {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  </style>
  