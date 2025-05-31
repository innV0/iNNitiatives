<script setup lang="ts">
import { provide } from 'vue';
import AppHeader from './components/AppHeader.vue';
import MainNav from './components/MainNav.vue';
import { useDataStore } from './dataStore';

// Use the data store
const dataStore = useDataStore();

// Provide the data store contents to child components
provide('dataStore', dataStore);

// App.vue will now primarily handle routing, the header, main navigation, and data provision
</script>

<template>
  <div class="min-h-screen bg-slate-100 text-slate-800">
    <AppHeader />
    <MainNav />
    <div class="container mx-auto p-4">
      <div v-if="dataStore.loading.value" class="text-center py-10 text-lg">Loading application data...</div>
      <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
