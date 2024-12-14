<template>
  <div class="chat-container">
    <!-- Chat Messages -->
    <div class="messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" class="message">
        <span class="user">{{ message.user }}:</span>
        <span class="text">{{ message.text }}</span>
      </div>
    </div>

    <!-- Input Box -->
    <div class="input-container">
      <input v-model="messageText" @keyup.enter="sendMessage" type="text" placeholder="Type a message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useNuxtApp } from '#app';

// Get socket from Nuxt context
const { $socket } = useNuxtApp();

// Accept roomId as a prop
const props = defineProps({
  roomId: String
});

const messages = ref([]); // Store chat messages
const messageText = ref(''); // Input field for new message

// Create a ref for messages container to use it in scrollToBottom
const messagesContainer = ref(null);

// Check if $socket is initialized and safe to use
onMounted(() => {
  if ($socket && props.roomId) {
    // Join the room when the component is mounted
    $socket.emit('join-room', props.roomId);
    console.log("room id from chat", props.roomId);
    // Listen for new messages on socket
    $socket.on('receive-message', (message) => {
      messages.value.push(message);
      scrollToBottom();
    });
  } else {
    console.error('Socket is not initialized or roomId is not available!');
  }
});

// Send message to the server
const sendMessage = () => {
  if (!props.roomId) {
    console.error('Room ID is not defined');
    return;
  }

  if (messageText.value.trim() !== '') {
    const message = {
      user: $socket.id, // Assuming user id is stored in socket
      text: messageText.value,
      roomId: props.roomId, // Include roomId to ensure the message is sent to the right room
    };
    $socket.emit('send-message', message); // Emit to the server
    messages.value.push(message); // Add to local chat
    messageText.value = ''; // Clear input field
    scrollToBottom();
  }
};

// Scroll to bottom of messages when new message is added
const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Syncopate:wght@400;700&display=swap');

.chat-container {
  position: fixed;
  top: 60px; /* Adjust based on header height */
  bottom: 60px; /* Adjust based on footer height */
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: 15px;
  background: linear-gradient(to right, #0A0F1C, #1A1033, #0A0F1C);
  color: white;
  font-family: 'Space Grotesk', sans-serif;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #FF3366;
  border-radius: 8px;
  background: rgba(10, 15, 28, 0.8);
}

.message {
  margin-bottom: 10px;
  font-size: 14px;
}

.message .user {
  font-weight: bold;
  color: #FF3366;
}

.input-container {
  display: flex;
  gap: 8px;
}

input {
  flex: 1;
  padding: 8px 12px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  outline: none;
  background: rgba(26, 16, 51, 0.6);
  color: white;
  transition: background 0.3s;
}

input:focus {
  background: rgba(26, 16, 51, 0.8);
}

button {
  flex-shrink: 0;
  padding: 8px 16px;
  font-size: 14px;
  font-family: 'Syncopate', sans-serif;
  border: none;
  border-radius: 6px;
  background: linear-gradient(to right, #FF3366, #FF00FF);
  color: white;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(255, 51, 102, 0.3);
  transition: all 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0px 6px 15px rgba(255, 51, 102, 0.5);
}

@media (max-width: 768px) {
  .chat-container {
    top:150px;
    bottom: 130px; /* Increase the gap to account for footer overlapping */
  }
}
</style>
