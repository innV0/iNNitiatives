<template>
  <header class="bg-slate-800 text-white p-4 flex items-center justify-between shadow-md">
    <div class="flex items-center">
      <CubeIcon class="h-8 w-8 text-sky-400 mr-3" />
      <span class="text-2xl font-bold tracking-tight">iNNitiatives</span>
    </div>
    <div class="flex space-x-2">
      <button class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out">
        File
      </button>
      <button class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out">
        Export
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { CubeIcon } from '@heroicons/vue/24/outline';
// Script setup for AppHeader component
</script>
