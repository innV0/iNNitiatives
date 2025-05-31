<template>
  <nav class="bg-gray-100 p-4 shadow-sm">
    <ul class="flex space-x-6">
      <li>
        <router-link to="/" class="text-gray-600 hover:text-blue-600 font-medium py-2 px-3 transition duration-150 ease-in-out" active-class="text-blue-600 border-b-2 border-blue-600">Program</router-link>
      </li>
      <li>
        <router-link to="/people" class="text-gray-600 hover:text-blue-600 font-medium py-2 px-3 transition duration-150 ease-in-out" active-class="text-blue-600 border-b-2 border-blue-600">People</router-link>
      </li>
      <li>
        <router-link to="/opportunities" class="text-gray-600 hover:text-blue-600 font-medium py-2 px-3 transition duration-150 ease-in-out" active-class="text-blue-600 border-b-2 border-blue-600">Opportunities</router-link>
      </li>
      <li>
        <router-link to="/initiatives" class="text-gray-600 hover:text-blue-600 font-medium py-2 px-3 transition duration-150 ease-in-out" active-class="text-blue-600 border-b-2 border-blue-600">Initiatives</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
// Script setup for MainNav component
</script>
