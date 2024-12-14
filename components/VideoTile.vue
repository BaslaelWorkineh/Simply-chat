<template>
    <div class="relative flex flex-col items-center p-2 bg-gray-100 rounded-lg">
      <div class="h-40 w-full bg-gray-200 rounded-md overflow-hidden">
        <img v-if="avatar" :src="avatar" alt="Participant" class="object-cover w-full h-full" />
        <div v-else class="flex items-center justify-center h-full">
          <span class="text-gray-500 text-lg font-medium">{{ name[0] }}</span>
        </div>
      </div>
      <span class="mt-2 text-gray-700 font-medium">{{ name }}</span>
    </div>
  </template>
  
  <script setup>
  defineProps({
    name: String,
    avatar: String, // Optional avatar image source
  });
  </script>
  