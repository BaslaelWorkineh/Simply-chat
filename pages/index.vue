<template>
    <div class="flex flex-col h-screen">
      <!-- <MeetingHeader /> -->
      <!-- <Chat :roomId="roomId" /> -->
      <!-- <VideoGrid class="flex-1" />
      <TranscriptPanel />
      <BottomToolbar /> -->
      <DrawingPad />
    </div>
  </template>
  
  <script setup>
  import Chat from '~/components/Chat.vue';
  import DrawingPad from '~/components/DrawingPad.vue';
  import MeetingHeader from '~/components/MeetingHeader.vue';
  import VideoGrid from '~/components/VideoGrid.vue';
  import TranscriptPanel from '~/components/TranscriptPanel.vue';
  import BottomToolbar from '~/components/BottomToolbar.vue';

  const roomId = ref(1234);
  </script>
  