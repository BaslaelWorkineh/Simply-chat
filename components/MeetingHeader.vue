<template>
  <header class="flex justify-between items-center p-4 bg-gradient-to-r from-[#0A0F1C] via-[#1A1033] to-[#0A0F1C] text-white shadow-lg border-b border-[#FF3366] transition-all">
    <!-- App Title -->
    <div class="text-lg font-space tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-[#FF00FF] to-[#00FFFF]">
      <i class="fas fa-satellite-dish text-[#FF3366] mr-2"></i>
      Simply Chat
    </div>

    <!-- Display Room ID -->
    <div class="flex items-center text-sm font-cyber space-x-2 text-[#B4B4FF]">
      <i class="fas fa-key"></i>
      <span>Room ID:</span>
      <span class="text-white font-semibold">{{ roomId }}</span>
    </div>

    <!-- Toggle Buttons for Chat, Video, and Canvas -->
    <div class="flex space-x-4">
      <button 
        @click="$emit('toggleChat')"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-gradient-to-r from-[#FF3366] to-[#FF00FF] text-white hover:from-[#FF00FF] hover:to-[#FF3366] transform transition-all duration-300 shadow-lg hover:shadow-[#FF3366]/25 font-cyber">
        <i class="fas fa-comment-alt"></i>
        Chat
      </button>

      <button 
        @click="$emit('toggleVideo')"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-gradient-to-r from-[#00FFFF] to-[#00FF66] text-white hover:from-[#00FF66] hover:to-[#00FFFF] transform transition-all duration-300 shadow-lg hover:shadow-[#00FFFF]/25 font-cyber">
        <i class="fas fa-video"></i>
        Video
      </button>

      <button 
        @click="$emit('toggleCanvas')"
        class="flex items-center gap-2 px-4 py-2 rounded-md text-sm bg-gradient-to-r from-[#6633FF] to-[#00FFFF] text-white hover:from-[#00FFFF] hover:to-[#6633FF] transform transition-all duration-300 shadow-lg hover:shadow-[#6633FF]/25 font-cyber">
        <i class="fas fa-paint-brush"></i>
        Canvas
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  roomId: String
});
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css');
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

/* Custom font classes */
.font-space {
  font-family: 'Space Grotesk', sans-serif;
}

.font-cyber {
  font-family: 'Syncopate', sans-serif;
  letter-spacing: 0.1em;
}

/* Hover animations */
button {
  transition: background-color 0.3s, transform 0.3s, box-shadow 0.3s;
}

button:hover {
  transform: translateY(-2px);
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  header {
    flex-wrap: nowrap;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  /* Adjust title and room ID flex alignment */
  .text-lg, .flex.items-center.text-sm {
    flex-direction: row;
    justify-content: center;
  }

  /* Show icons only on small screens */
  button {
    padding: 0.5rem;
    font-size: 0.85rem;
  }
  button i {
    display: inline;
  }
  button span {
    display: none;
  }

  .text-lg {
    font-size: 1rem;
    margin-bottom: 0;
  }

  .flex.items-center {
    flex-wrap: nowrap;
    text-align: center;
  }
}
</style>
