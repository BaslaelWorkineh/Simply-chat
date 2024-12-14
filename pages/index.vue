<template>
    <div class="flex flex-col h-screen bg-white">
      <!-- Meeting Header -->
      <MeetingHeader />
  
      <div class="flex flex-1">
        <!-- Participant Grid -->
        <ParticipantGrid class="flex-1" />
  
        <!-- Transcript Panel -->
        <TranscriptPanel class="w-1/3" />
      </div>
  
      <!-- Bottom Toolbar -->
      <BottomToolbar />
    </div>
  </template>
  
  <script setup>
  import MeetingHeader from '~/components/MeetingHeader.vue';
  import ParticipantGrid from '~/components/ParticipantGrid.vue';
  import TranscriptPanel from '~/components/TranscriptPanel.vue';
  import BottomToolbar from '~/components/BottomToolbar.vue';
  </script>
  