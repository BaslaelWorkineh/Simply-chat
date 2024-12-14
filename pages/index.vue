<template>
    <div class="flex flex-col h-screen">
      <MeetingHeader />
      <VideoGrid class="flex-1" />
      <TranscriptPanel />
      <BottomToolbar />
    </div>
  </template>
  
  <script setup>
  import MeetingHeader from '~/components/MeetingHeader.vue';
  import VideoGrid from '~/components/VideoGrid.vue';
  import TranscriptPanel from '~/components/TranscriptPanel.vue';
  import BottomToolbar from '~/components/BottomToolbar.vue';
  </script>
  