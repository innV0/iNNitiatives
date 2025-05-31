<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">People Management</h1>

    <!-- Placeholder for Filtering and Sorting Controls -->
    <div class="mb-4 flex items-center space-x-4">
      <input type="text" placeholder="Filter by name or role..." class="border p-2 rounded-md">
      <select class="border p-2 rounded-md">
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="role">Role</option>
      </select>
    </div>

    <div v-if="dataStore.loading.value">Loading people data...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="personSchema && peopleData">
      <PeopleList :schema="personSchema" :data="peopleData" />
    </div>
    <div v-else>
      No people data available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import PeopleList from '../components/PeopleList.vue';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

// Access people data and schema using data store getters
const peopleData = computed(() => dataStore.getPeopleData());
const personSchema = computed(() => dataStore.getPersonSchema());

</script>

<style scoped>
/* Component-specific styles */
</style>
