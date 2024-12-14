<template>
  <div id="app">
    <!-- Video Streams Section -->
    <section v-if="roomId" class="video-section">
      <div v-if="isHost" class="host-title">Hosting Room: {{ roomId }}</div>

      <!-- Self Video -->
      <div class="video-container">
        <video ref="selfVideo" autoplay muted playsinline class="video-player"></video>
        <div class="video-label">You</div>
      </div>

      <!-- Remote Streams -->
      <div class="grid">
        <div 
          v-for="(stream, id) in remoteStreams" 
          :key="id" 
          class="video-container">
          <video 
            :ref="'video-' + id" 
            autoplay 
            playsinline
            class="video-player">
          </video>
          <div class="video-label">User {{ id }}</div>
        </div>
      </div>
    </section>

    <!-- Notifications -->
    <div v-if="notification" class="notification">{{ notification }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useNuxtApp } from '#app';

const { $socket } = useNuxtApp();
const props = defineProps({
  roomId: {
    type: String,
    required: true,
  },
});

const isHost = ref(false);
const remoteStreams = ref({});
const notification = ref(null);
const selfStream = ref(null);
const videoRefs = ref({});

const getUserMediaStream = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    selfStream.value = stream;
    return stream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    return null;
  }
};

const addRemoteStream = (userId, stream) => {
  remoteStreams.value = {
    ...remoteStreams.value,
    [userId]: stream,
  };
};

const removeRemoteStream = (userId) => {
  const updatedStreams = { ...remoteStreams.value };
  delete updatedStreams[userId];
  remoteStreams.value = updatedStreams;
};

const joinRoom = async () => {
  const stream = await getUserMediaStream();
  if (!stream) return;

  $socket.emit('join-room', props.roomId);
  
  $socket.on('user-joined', ({ userId }) => {
    showNotification(`User ${userId} has joined the room.`);
  });

  $socket.on('receive-stream', ({ userId, streamId }) => {
    const remoteStream = new MediaStream();
    // Add logic here to attach media tracks to `remoteStream`
    addRemoteStream(userId, remoteStream);
    attachStreamToVideo(userId, remoteStream);
  });

  setupStreamHandlers(stream);
};

const setupStreamHandlers = (stream) => {
  const videoElement = selfStream.value;
  videoElement.srcObject = stream;

  $socket.on('new-stream', ({ userId, stream }) => {
    addRemoteStream(userId, stream);
  });

  $socket.on('user-left', (userId) => {
    removeRemoteStream(userId);
    showNotification(`User ${userId} has left the room.`);
  });
};

const attachStreamToVideo = (userId, stream) => {
  const videoElement = document.querySelector(`#video-${userId}`);
  if (videoElement) {
    videoElement.srcObject = stream;
  }
};

const showNotification = (message) => {
  notification.value = message;
  setTimeout(() => (notification.value = null), 3000);
};

watch(() => props.roomId, (newRoomId) => {
  if (newRoomId) {
    joinRoom();
  }
});

onMounted(() => {
  if (props.roomId) {
    joinRoom();
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

#app {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
  font-family: 'Space Grotesk', sans-serif;
  background: linear-gradient(to right, #0A0F1C, #1A1033, #0A0F1C);
}

.video-section {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 20px;
  overflow: auto;
  box-sizing: border-box;
}

.host-title {
  font-size: 18px;
  color: #FF3366;
  margin-bottom: 15px;
  text-align: center;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  width: 100%;
  max-width: 1200px;
  margin-top: 20px;
}

.video-container {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
}

.video-player {
  width: 100%;
  height: auto;
  background: black;
}

.video-label {
  position: absolute;
  bottom: 8px;
  left: 8px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 5px;
  border-radius: 4px;
  font-size: 12px;
}

.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #FF3366;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
  box-shadow: 0px 4px 10px rgba(255, 51, 102, 0.3);
  font-family: 'Space Grotesk', sans-serif;
}

@media screen and (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>

