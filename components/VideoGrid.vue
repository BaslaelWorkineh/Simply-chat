<template>
    <section class="grid grid-cols-2 gap-4 p-4">
      <!-- Self Video -->
      <div class="relative bg-gray-200 rounded-lg">
        <video ref="selfVideo" autoplay muted class="w-full rounded"></video>
        <span class="absolute top-2 left-2 bg-black text-white px-2 py-1 text-sm rounded">You</span>
      </div>
  
      <!-- Remote Videos -->
      <div v-for="(stream, id) in remoteStreams" :key="id" class="relative bg-gray-200 rounded-lg">
        <video :ref="setVideoRef(id)" autoplay class="w-full rounded"></video>
        <span class="absolute top-2 left-2 bg-black text-white px-2 py-1 text-sm rounded">{{ id }}</span>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import SimplePeer from 'simple-peer';
  
  const { $socket } = useNuxtApp();
  
  const selfVideo = ref(null);
  const remoteStreams = ref({});
  const peers = ref({});
  
  // Start camera stream
  const getUserMediaStream = async () => {
    return await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  };
  
  // Helper to set refs for remote videos
  const setVideoRef = (id) => (el) => {
    if (el && remoteStreams.value[id]) {
      el.srcObject = remoteStreams.value[id];
    }
  };
  
  // Join Room
  onMounted(async () => {
    const stream = await getUserMediaStream();
    selfVideo.value.srcObject = stream;
  
    // Inform server that a new user joined
    $socket.emit('joinRoom');
  
    $socket.on('allUsers', (users) => {
      users.forEach((userID) => createPeer(userID, stream));
    });
  
    $socket.on('receiveSignal', ({ signal, callerID }) => {
      addPeer(callerID, signal, stream);
    });
  });
  
  // Create a new peer to send signal
  const createPeer = (userID, stream) => {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    });
  
    peer.on('signal', (signal) => {
      $socket.emit('sendSignal', { signal, target: userID });
    });
  
    peer.on('stream', (remoteStream) => {
      remoteStreams.value[userID] = remoteStream;
    });
  
    peers.value[userID] = peer;
  };
  
  // Add an incoming peer (called by server)
  const addPeer = (callerID, signal, stream) => {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    });
  
    peer.on('signal', (returnSignal) => {
      $socket.emit('sendSignal', { signal: returnSignal, target: callerID });
    });
  
    peer.on('stream', (remoteStream) => {
      remoteStreams.value[callerID] = remoteStream;
    });
  
    peer.signal(signal);
    peers.value[callerID] = peer;
  };
  </script>
  