<template>
  <header class="flex justify-between items-center p-4 bg-white shadow-md border-b transition-all">
    <div class="text-gray-800 font-semibold">Daily Standup Meeting</div>

    <!-- Display the Room ID -->
    <div class="text-gray-600">Room ID: <span class="font-semibold">{{ roomId }}</span></div>

    <!-- Toggle Buttons for Chat, Video, and Canvas -->
    <div class="space-x-4">
      <button @click="$emit('toggleChat')" class="px-4 py-2 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600 transition-all">Chat</button>
      <button @click="$emit('toggleVideo')" class="px-4 py-2 rounded-md text-sm bg-green-500 text-white hover:bg-green-600 transition-all">Video</button>
      <button @click="$emit('toggleCanvas')" class="px-4 py-2 rounded-md text-sm bg-purple-500 text-white hover:bg-purple-600 transition-all">Canvas</button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  roomId: String
});
</script>

<style scoped>
/* Add smooth transitions */
button {
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  transform: translateY(-2px);
}
</style>
