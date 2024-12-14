<template>
  <div class="relative min-h-screen bg-gradient-to-b from-[#0A0F1C] to-[#1A1033] overflow-hidden">
    <!-- Spotlight effect -->
    <div class="absolute inset-0">
      <div class="spotlight"></div>
    </div>

    <!-- Animated background lines -->
    <div class="grid-lines"></div>

    <!-- Main content -->
    <div class="relative z-10 flex justify-center items-center min-h-screen text-white text-center p-6">
      <div class="max-w-4xl">
        <div class="glitch-wrapper mb-2">
          <h1 class="text-7xl font-bold mb-6 font-space tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-[#FF3366] to-[#FF00FF]">
            MEET<span class="text-[#00FFFF]">SYNC</span>
          </h1>
        </div>
        
        <p class="text-xl text-[#B4B4FF] mb-12 font-cyber px-4">
          Next-Generation Virtual Collaboration Platform
        </p>

        <!-- Action Buttons -->
        <div class="flex gap-6 justify-center">
          <button @click="showJoinModal = true" 
                  class="join-button px-8 py-4 text-lg font-semibold rounded-md bg-gradient-to-r from-[#FF3366] to-[#FF00FF] hover:from-[#FF00FF] hover:to-[#FF3366] transform transition-all duration-300 shadow-lg hover:shadow-[#FF3366]/25 font-cyber">
            JOIN SESSION
          </button>
          <button @click="$emit('host')" 
                  class="host-button px-8 py-4 text-lg font-semibold rounded-md bg-transparent border-2 border-[#00FFFF] hover:bg-[#00FFFF]/10 transform transition-all duration-300 font-cyber text-[#00FFFF]">
            HOST SESSION
          </button>
        </div>
      </div>
    </div>

    <!-- Join Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showJoinModal" 
             class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" 
               @click="showJoinModal = false"></div>
          
          <div class="relative bg-[#0A0F1C] rounded-lg p-8 w-full max-w-md border border-[#FF3366] shadow-2xl transform transition-all">
            <div class="absolute -inset-[1px] -z-10 rounded-lg bg-gradient-to-r from-[#FF3366] via-[#FF00FF] to-[#00FFFF] opacity-75 blur-sm"></div>
            
            <h2 class="text-2xl font-bold mb-6 text-white font-space tracking-wide">Enter Virtual Space</h2>
            
            <input type="text" 
                   v-model="meetingCode" 
                   placeholder="SESSION ID" 
                   class="w-full px-4 py-3 rounded-md bg-[#1A1033] border border-[#FF3366] text-white mb-4 focus:outline-none focus:border-[#00FFFF] transition-all font-cyber placeholder:text-gray-500">
            
            <button @click="joinMeeting" 
                    class="w-full px-6 py-3 text-lg font-semibold rounded-md bg-gradient-to-r from-[#FF3366] to-[#FF00FF] hover:from-[#FF00FF] hover:to-[#FF3366] text-white transform transition-all duration-300 font-cyber">
              CONNECT NOW
            </button>
            
            <button @click="showJoinModal = false" 
                    class="absolute top-4 right-4 text-[#FF3366] hover:text-[#00FFFF] transition-colors">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const showJoinModal = ref(false)
const meetingCode = ref('')

const joinMeeting = () => {
  if (meetingCode.value) {
    emit('join', meetingCode.value)
    showJoinModal.value = false
  }
}
</script>

<style scoped>
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

.spotlight {
  @apply absolute top-[-50%] left-1/2 transform -translate-x-1/2;
  width: 200%;
  aspect-ratio: 1;
  background: radial-gradient(circle at center, 
    rgba(255, 51, 102, 0.15) 0%,
    rgba(255, 0, 255, 0.05) 25%,
    transparent 50%);
  animation: spotlight 8s infinite ease-in-out;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-size: 50px 50px;
  background-image: 
    linear-gradient(to right, rgba(255, 51, 102, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 51, 102, 0.1) 1px, transparent 1px);
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% { transform: translateY(0); }
  100% { transform: translateY(50px); }
}

@keyframes spotlight {
  0%, 100% { transform: translate(-50%, -50%) scale(1); }
  50% { transform: translate(-50%, -50%) scale(1.2); }
}

.join-button {
  box-shadow: 0 0 20px rgba(255, 51, 102, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0.4); }
  70% { box-shadow: 0 0 0 15px rgba(255, 51, 102, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 51, 102, 0); }
}

/* Glitch effect */
.glitch-wrapper {
  position: relative;
}

.glitch-wrapper::before,
.glitch-wrapper::after {
  content: "MEETSYNC";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  background: #0A0F1C;
  color: transparent;
  text-shadow: 2px 0 #FF3366, -2px 0 #00FFFF;
  animation: glitch 3s infinite linear alternate-reverse;
}

.glitch-wrapper::before {
  left: 2px;
  text-shadow: 2px 0 #FF3366;
  animation: glitch 3s infinite linear alternate-reverse;
}

.glitch-wrapper::after {
  left: -2px;
  text-shadow: -2px 0 #00FFFF;
  animation: glitch 2s infinite linear alternate-reverse;
}

@keyframes glitch {
  0% { clip-path: inset(40% 0 61% 0); }
  20% { clip-path: inset(92% 0 1% 0); }
  40% { clip-path: inset(43% 0 1% 0); }
  60% { clip-path: inset(25% 0 58% 0); }
  80% { clip-path: inset(54% 0 7% 0); }
  100% { clip-path: inset(58% 0 43% 0); }
}

/* Modal transitions */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>