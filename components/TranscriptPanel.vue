<template>
    <aside class="p-4 border-l bg-gray-50 shadow-md">
      <h2 class="text-lg font-semibold mb-4">Transcript</h2>
      <div v-for="(note, index) in transcript" :key="index" class="mb-4">
        <h3 class="text-gray-800 font-medium">{{ note.user }}</h3>
        <p class="text-sm text-gray-600">{{ note.text }}</p>
      </div>
  
      <div class="mt-4">
        <input
          v-model="message"
          @keydown.enter="sendMessage"
          placeholder="Type a message..."
          class="w-full p-2 border rounded"
        />
      </div>
    </aside>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  const { $socket } = useNuxtApp();
  
  const transcript = ref([
    { user: 'System', text: 'Welcome to the meeting!' },
  ]);
  
  const message = ref('');
  
  const sendMessage = () => {
    if (message.value.trim()) {
      $socket.emit('sendMessage', { user: 'You', text: message.value });
      message.value = '';
    }
  };
  
  onMounted(() => {
    $socket.on('message', (data) => {
      transcript.value.push(data);
    });
  });
  </script>
  