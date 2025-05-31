<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Initiative Lifecycle Management</h1>

    <!-- Placeholder for Filtering and Sorting Controls -->
    <div class="mb-4 flex items-center space-x-4">
      <input type="text" placeholder="Filter by name or description..." class="border p-2 rounded-md">
      <select class="border p-2 rounded-md">
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="type">Type</option>
        <option value="phase">Phase</option>
      </select>
    </div>

    <div v-if="dataStore.loading.value">Loading initiatives data...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="initiativeSchema && initiativesData">
      <InitiativesList :schema="initiativeSchema" :data="initiativesData" />
    </div>
    <div v-else>
      No initiatives data available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import InitiativesList from '../components/InitiativesList.vue';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

// Access initiatives data and schema using data store getters
const initiativesData = computed(() => dataStore.getInitiativesData());
const initiativeSchema = computed(() => dataStore.getInitiativeSchema());

</script>

<style scoped>
/* Component-specific styles */
</style>
