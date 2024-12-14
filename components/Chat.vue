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
  .chat-container {
    max-width: 600px;
    margin: auto;
    padding: 10px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .messages {
    max-height: 300px;
    overflow-y: auto;
    padding-right: 10px;
    margin-bottom: 15px;
  }
  
  .message {
    margin-bottom: 10px;
    font-size: 14px;
  }
  
  .message .user {
    font-weight: bold;
  }
  
  .input-container {
    display: flex;
    justify-content: space-between;
  }
  
  input {
    width: 80%;
    padding: 8px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  button {
    width: 15%;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 8px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #218838;
  }
  </style>
  