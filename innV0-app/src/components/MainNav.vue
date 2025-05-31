<template>
  <nav class="bg-slate-700 shadow-md">
    <ul class="flex space-x-1 px-4">
      <li>
        <router-link
          to="/"
          class="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
          active-class="text-white font-semibold bg-slate-900">Program</router-link>
      </li>
      <li>
        <router-link
          to="/people"
          class="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
          active-class="text-white font-semibold bg-slate-900">People</router-link>
      </li>
      <li>
        <router-link
          to="/opportunities"
          class="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
          active-class="text-white font-semibold bg-slate-900">Opportunities</router-link>
      </li>
      <li>
        <router-link
          to="/initiatives"
          class="text-slate-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition duration-150 ease-in-out"
          active-class="text-white font-semibold bg-slate-900">Initiatives</router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
// Script setup for MainNav component
</script>
