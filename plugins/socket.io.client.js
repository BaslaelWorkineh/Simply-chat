import { io } from 'socket.io-client';

export default defineNuxtPlugin(() => {
  const socket = io('https://video-chat-app-backend-5izg.onrender.com/');
  
  return {
    provide: {
      socket,
    },
  };
});
