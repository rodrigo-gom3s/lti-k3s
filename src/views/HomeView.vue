<script setup>
import { ref } from 'vue';
import { HomeIcon, SettingsIcon } from 'lucide-vue-next';

  function setup() {
    const selected = ref('Home');
    return { selected };
  }
</script>

<template>
  <div class="flex h-screen w-full bg-blue-500">
    <main class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-4xl font-semibold text-white">Welcome to the Kubernetes Manager</h1>
        <p class="text-lg text-white mt-4 max-w-lg mx-auto">
          Using the left sidebar, you can navigate through the webpage and manage your K3S' Kubernetes solution.
        </p>
      </div>
    </main>
  </div>
</template>


