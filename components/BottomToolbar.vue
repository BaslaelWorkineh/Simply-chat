<template>
  <footer class="flex justify-around items-center p-4 bg-gradient-to-r from-[#0A0F1C] via-[#1A1033] to-[#0A0F1C] text-white shadow-lg border-t border-[#FF3366] fixed bottom-0 inset-x-0">
    <!-- Leave Button -->
    <button
      class="flex items-center gap-2 px-6 py-2 rounded-md text-sm bg-gradient-to-r from-[#FF3366] to-[#FF00FF] text-white hover:from-[#FF00FF] hover:to-[#FF3366] transform transition-all duration-300 shadow-lg hover:shadow-[#FF3366]/25 font-cyber"
      @click="handleLeave"
    >
      <i class="fas fa-sign-out-alt"></i>
      Leave
    </button>

    <!-- Mute Button -->
    <button
      class="flex items-center gap-2 px-6 py-2 rounded-md text-sm bg-gradient-to-r from-[#00FFFF] to-[#00FF66] text-white hover:from-[#00FF66] hover:to-[#00FFFF] transform transition-all duration-300 shadow-lg hover:shadow-[#00FFFF]/25 font-cyber"
      @click="handleMute"
    >
      <i class="fas fa-microphone-slash"></i>
      Mute
    </button>

    <!-- Stop Video Button -->
    <button
      class="flex items-center gap-2 px-6 py-2 rounded-md text-sm bg-gradient-to-r from-[#6633FF] to-[#FF3366] text-white hover:from-[#FF3366] hover:to-[#6633FF] transform transition-all duration-300 shadow-lg hover:shadow-[#6633FF]/25 font-cyber"
      @click="handleStopVideo"
    >
      <i class="fas fa-video-slash"></i>
      Stop
    </button>

    <!-- Share Button -->
    <button
      class="flex items-center gap-2 px-6 py-2 rounded-md text-sm bg-gradient-to-r from-[#FFCC00] to-[#FF3366] text-white hover:from-[#FF3366] hover:to-[#FFCC00] transform transition-all duration-300 shadow-lg hover:shadow-[#FFCC00]/25 font-cyber"
      @click="handleShare"
    >
      <i class="fas fa-share-alt"></i>
      Share
    </button>
  </footer>
</template>

<script setup>
const { $socket } = useNuxtApp(); // Access the global socket instance

// Define button click handlers
const handleLeave = () => {
  $socket.emit('leave');
  console.log('Left the session');
};

const handleMute = () => {
  $socket.emit('mute');
  console.log('Muted');
};

const handleStopVideo = () => {
  $socket.emit('stop-video');
  console.log('Stopped video');
};

const handleShare = () => {
  $socket.emit('share');
  console.log('Shared screen');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

.font-cyber {
  font-family: 'Syncopate', sans-serif;
  letter-spacing: 0.1em;
}

button {
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

button:hover {
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  footer {
    flex-wrap: wrap;
    text-align: center;
  }
  button {
    margin: 0.5rem;
    width: calc(50% - 1rem);
  }
}
</style>
