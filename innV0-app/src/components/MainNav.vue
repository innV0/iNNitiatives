<template>
  <nav class="bg-gray-100 p-4 shadow-sm">
    <ul class="flex space-x-6">
      <li>
        <router-link to="/" class="text-gray-700 hover:text-gray-900 font-semibold transition duration-150 ease-in-out">Program</router-link>
      </li>
      <li>
        <router-link to="/people" class="text-gray-700 hover:text-gray-900 font-semibold transition duration-150 ease-in-out">People</router-link>
      </li>
      <li>
        <router-link to="/opportunities" class="text-gray-700 hover:text-gray-900 font-semibold transition duration-150 ease-in-out">Opportunities</router-link>
      </li>
      <li>
        <router-link to="/initiatives" class="text-gray-700 hover:text-gray-900 font-semibold transition duration-150 ease-in-out">Initiatives</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
// Script setup for MainNav component
</script>

<style scoped>
/* Component-specific styles */
</style>
