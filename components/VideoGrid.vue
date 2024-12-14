<template>
  <div id="app">
    <!-- Video Streams Section -->
    <section v-if="roomId" class="video-section">
      <div v-if="isHost">Hosting Room: {{ roomId }}</div>
      
      <!-- Self Video -->
      <video ref="selfVideo" autoplay muted></video>
      
      <!-- Remote Streams -->
      <div class="grid">
        <video 
          v-for="(stream, id) in remoteStreams" 
          :key="id" 
          :id="'video-' + id" 
          autoplay 
          :roomId="roomId">
          <source :srcObject="stream" type="video/mp4" />
        </video>
      </div>
    </section>

    <!-- Notifications -->
    <div v-if="notification" class="notification">{{ notification }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';

// Access the socket from Nuxt context
const { $socket } = useNuxtApp();

// Props for roomId passed into the component
const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
});

const isHost = ref(false);
const remoteStreams = ref({}); // Store all participant streams here
const notification = ref(null);
const selfStream = ref(null);

// Get user media stream (video & audio)
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

// Handle user joining the room (emitting join event)
const joinRoom = async () => {
  const stream = await getUserMediaStream();

  $socket.emit('join-room', props.roomId);
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

// Show a notification for user join/leave
const showNotification = (message) => {
  notification.value = message;
  setTimeout(() => (notification.value = null), 3000);
};

// Watch for the roomId change and automatically call joinRoom when it updates
watch(() => props.roomId, (newRoomId) => {
  if (newRoomId) {
    joinRoom();
  }
});

onMounted(() => {
  if (props.roomId) {
    joinRoom(); // Start the process when the roomId is passed
  }
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
