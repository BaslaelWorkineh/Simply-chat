<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Hero Section (Visible before the rest of the page) -->
    <div v-if="showHero" class="flex justify-center items-center flex-col bg-blue-600 h-screen text-white text-center p-6">
      <h1 class="text-4xl font-bold mb-4">Welcome to Our Meeting Platform</h1>
      <p class="text-lg mb-6">Join, host, and collaborate easily with our innovative online meeting tool</p>

      <!-- Action Buttons -->
      <div class="space-x-4">
        <button @click="joinMeeting" class="px-6 py-2 bg-green-500 rounded-lg text-white hover:bg-green-600 transition-all">Join</button>
        <button @click="hostMeeting" class="px-6 py-2 bg-purple-500 rounded-lg text-white hover:bg-purple-600 transition-all">Host</button>
      </div>
    </div>

    <!-- Main Meeting Content (Initially hidden until hero section is skipped) -->
    <div v-if="!showHero">
      <!-- Meeting Header with buttons to toggle visibility -->
      <MeetingHeader 
        @toggleChat="toggleChat"
        @toggleVideo="toggleVideo"
        @toggleCanvas="toggleCanvas" 
        :roomId="String(roomId)"
      />

      <!-- Content Area -->
      <div class="flex flex-1 overflow-hidden">
        <!-- Conditional Video Section -->
        <div v-if="showVideo" class="flex-1 p-4 bg-white shadow-md rounded-lg">
          <VideoGrid :roomId="String(roomId)" class="w-full h-full" />
        </div>

        <!-- Conditional Chat Section -->
        <div v-if="showChat" class="flex-1 p-4 bg-gray-100 overflow-y-auto shadow-md rounded-lg">
          <Chat :roomId="String(roomId)" />
        </div>

        <!-- Conditional Drawing Pad Section -->
        <div v-if="showCanvas" class="flex-1 p-4 bg-white shadow-md rounded-lg">
          <DrawingPad :roomId="String(roomId)" />
        </div>
      </div>

      <!-- Bottom Toolbar -->
      <BottomToolbar />
    </div>

    <!-- Notification Area -->
    <div v-if="notification" class="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
      {{ notification }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app'; // To access the socket instance globally
import Chat from '~/components/Chat.vue';
import DrawingPad from '~/components/DrawingPad.vue';
import MeetingHeader from '~/components/MeetingHeader.vue';
import VideoGrid from '~/components/VideoGrid.vue';
import BottomToolbar from '~/components/BottomToolbar.vue';

// Setup variables
const roomId = ref(null);
const showChat = ref(false);
const showVideo = ref(false);
const showCanvas = ref(false);
const showHero = ref(true);
const notification = ref(null);

// Get the socket instance provided by the plugin
const { $socket } = useNuxtApp();

// Ensure socket is available before using it
onMounted(() => {
  if ($socket) {
    $socket.on('user-joined', (message) => {
      console.log('User joined:', message);
      notification.value = message;
      setTimeout(() => {
        notification.value = null;
      }, 5000); // Display notification for 5 seconds
    });
  } else {
    console.error('Socket is not initialized');
  }
});

// Toggle functions to show/hide sections
const toggleChat = () => {
  showChat.value = !showChat.value;
  showVideo.value = false;
  showCanvas.value = false;
};

const toggleVideo = () => {
  showVideo.value = !showVideo.value;
  showChat.value = false;
  showCanvas.value = false;
};

const toggleCanvas = () => {
  showCanvas.value = !showCanvas.value;
  showChat.value = false;
  showVideo.value = false;
};

// Host a new meeting
const hostMeeting = () => {
  showHero.value = false;  
  roomId.value = generateRoomId();
  if ($socket) {
    $socket.emit('join-room', roomId.value); // Emit when the host starts the meeting
  }
  console.log(`Room created with Room ID: ${roomId.value}`);
};

// Join an existing meeting
const joinMeeting = () => {
  showHero.value = false;
  const userRoomId = prompt('Enter the room ID to join:');
  if (userRoomId) {
    roomId.value = userRoomId;
    if ($socket) {
      $socket.emit('join-room', roomId.value); // Emit when a user joins a room
    }
    console.log(`Joining Room ID: ${roomId.value}`);
  } else {
    console.log('No Room ID provided. Canceling join action.');
  }
};

// Helper function to generate a random roomId
const generateRoomId = () => {
  return Math.floor(Math.random() * 1000000000);  // Random 9-digit number
};
</script>

<style scoped>
/* Hero Section Styling */
h1 {
  font-size: 3rem;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.1);
}

button {
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  transform: translateY(-2px);
}
</style>
