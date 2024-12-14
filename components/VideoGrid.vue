<template>

  <div id="app">
  
  <!-- Join or Host a Room -->
  
  <div v-if="!roomId" class="join-room">
  
  <input v-model="roomInput" type="text" placeholder="Enter Room ID" />
  
  <button @click="joinRoom(roomInput)">Join Room</button>
  
  <button @click="hostRoom()">Host a Room</button>
  
  </div>  
<!-- Video Streams Section -->
<section v-if="roomId" class="video-section">
  <div v-if="isHost">Hosting Room: {{ roomId }}</div>
  <video ref="selfVideo" autoplay muted></video>
  
  <!-- Remote Streams -->
  <div class="grid">
    <video v-for="(stream, id) in remoteStreams" :key="id" :id="'video-' + id" autoplay>
      <source :srcObject="stream" type="video/mp4" />
    </video>
  </div>
</section>

<!-- Notifications -->
<div v-if="notification" class="notification">{{ notification }}</div>
</div>

</template>

<script setup>

import { ref, onMounted } from 'vue';

import { useNuxtApp } from '#app';

const { $socket } = useNuxtApp();

const roomId = ref(null);

const isHost = ref(false);

const roomInput = ref('');

const remoteStreams = ref({}); // Store all participant streams here

const notification = ref(null);

const peers = {}; // Store WebRTC peer connections

const selfStream = ref(null);

const getUserMediaStream = async () => {

const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

selfStream.value = stream;

return stream;

};

// Handle new participant's stream

const addRemoteStream = (userId, stream) => {

remoteStreams.value = {

...remoteStreams.value,

[userId]: stream,

};

};

// Remove participant's stream

const removeRemoteStream = (userId) => {

const updatedStreams = { ...remoteStreams.value };

delete updatedStreams[userId];

remoteStreams.value = updatedStreams;

};

// Host a new room

const hostRoom = async () => {

roomId.value = Math.random().toString(36).substring(2, 9);

isHost.value = true;

$socket.emit('join-room', roomId.value);

const stream = await getUserMediaStream();

$socket.emit('new-user', { roomId: roomId.value, userId: $socket.id });

$socket.on('user-joined', ({ userId }) => {

showNotification(`User ${userId} has joined the room.`);

});

setupStreamHandlers(stream);

};

// Join an existing room

const joinRoom = async (room) => {

roomId.value = room;

const stream = await getUserMediaStream();

$socket.emit('join-room', room);

$socket.on('user-joined', ({ userId, streamId }) => {

showNotification(`User ${userId} has joined the room.`);

});

setupStreamHandlers(stream);

};

// Setup WebRTC streaming between participants

const setupStreamHandlers = (stream) => {

// Broadcast self-stream to others

$socket.on('new-stream', ({ userId, stream }) => {

addRemoteStream(userId, stream);

});

// Listen for remote users leaving

$socket.on('user-left', (userId) => {

removeRemoteStream(userId);

showNotification(`User ${userId} has left the room.`);

});

};

const showNotification = (message) => {

notification.value = message;

setTimeout(() => (notification.value = null), 3000);

};

onMounted(() => {

$socket.on('signal', ({ senderId, signalData }) => {

console.log(`Signal received from ${senderId}`, signalData);

});

});

</script>

<style scoped>

.video-section {

display: flex;

flex-direction: column;

align-items: center;

margin: 20px;

}

.grid {

display: grid;

grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));

gap: 10px;

}

video {

width: 100%;

height: auto;

border: 1px solid #ddd;

border-radius: 8px;

background: #000;

}

.notification {

position: fixed;

top: 20px;

left: 50%;

transform: translateX(-50%);

background: #444;

color: white;

padding: 10px 20px;

border-radius: 5px;

z-index: 1000;

box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);

}

</style>
