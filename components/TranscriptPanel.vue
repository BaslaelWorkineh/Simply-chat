<template>
    <aside class="p-4 border-l bg-gray-50 shadow-md">
      <h2 class="text-lg font-semibold mb-4">Transcript</h2>
      <div v-for="(note, index) in transcript" :key="index" class="mb-4">
        <h3 class="text-gray-800 font-medium">{{ note.name }}</h3>
        <p class="text-sm text-gray-600">{{ note.text }}</p>
      </div>
    </aside>
  </template>
  
  <script setup>
  const transcript = [
    { name: "John Bergson", text: "Yesterday, I worked on refining the user flows..." },
    { name: "Sarah Franci", text: "Hi, everyone. I continued working on the wireframes..." },
    { name: "Lydia Botosh", text: "Good morning. I've been collaborating with the team..." },
  ];
  </script>
  