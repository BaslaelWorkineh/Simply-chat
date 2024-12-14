<template>
  <div id="app">
    <!-- Room ID input for joining a room -->
    <div v-if="!roomId" class="join-room">
      <input v-model="roomInput" type="text" placeholder="Enter Room ID" />
      <button @click="joinRoom(roomInput)">Join Room</button>
      <button @click="hostRoom()">Host a Room</button>
    </div>

    <!-- Video chat display once in room -->
    <section v-if="roomId" class="video-section">
      <div v-if="isHost">Hosting Room: {{ roomId }}</div>
      <video ref="selfVideo" autoplay muted></video>

      <div v-for="(stream, id) in remoteStreams" :key="id" class="video">
        <video :ref="setVideoRef(id)" autoplay></video>
        <div>{{ id }}</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

// Get the Socket.IO instance from the plugin
const { $socket } = useNuxtApp();

// State variables
const roomId = ref(null);
const isHost = ref(false);
const roomInput = ref('');
const remoteStreams = ref({});
const peers = ref({});

// Initialize your camera stream
const selfVideo = ref(null);

// Setup video streaming
const getUserMediaStream = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  selfVideo.value.srcObject = stream;
  return stream;
};

// Helper to set ref for remote video
const setVideoRef = (id) => (el) => {
  if (el && remoteStreams.value[id]) {
    el.srcObject = remoteStreams.value[id];
  }
};

// Join a room by roomId
const joinRoom = (room) => {
  roomId.value = room;
  isHost.value = false;
  $socket.emit('join-room', room);

  $socket.on('user-joined', (userId) => {
    console.log('User joined: ' + userId);
  });

  $socket.on('signal', ({ senderId, signalData }) => {
    // Handle signaling logic here (similar to the backend's signaling process)
    // You'll need WebRTC-related code for establishing the peer connection.
    console.log(senderId, signalData);
  });

  getUserMediaStream();
};

// Host a new room
const hostRoom = () => {
  roomId.value = Math.random().toString(36).substring(2, 9); // Generate random room ID
  isHost.value = true;
  $socket.emit('join-room', roomId.value);
  getUserMediaStream();
};

// Handle user leaving the room
const leaveRoom = () => {
  $socket.emit('leave-room', roomId.value);
  roomId.value = null;
  isHost.value = false;
};

// Handle peer-to-peer connection setup (signaling between users)
const createPeer = (userID, stream) => {
  // Peer connection code (simplified)
};

onMounted(() => {
  // Join room when component mounts
  $socket.on('signal', ({ senderId, signalData }) => {
    console.log('Signal received:', senderId, signalData);
  });
});
</script>

<style scoped>
/* Add styles for video and room interface */
</style>
