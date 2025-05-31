<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Opportunities Discovery</h1>

    <!-- Placeholder for Filtering and Sorting Controls -->
    <div class="mb-4 flex items-center space-x-4">
      <input type="text" placeholder="Filter by name or description..." class="border p-2 rounded-md">
      <select class="border p-2 rounded-md">
        <option value="">Sort by...</option>
        <option value="name">Name</option>
        <option value="status">Status</option>
        <option value="priority">Priority</option>
      </select>
    </div>

    <div v-if="dataStore.loading.value">Loading opportunities data...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="opportunitySchema && opportunitiesData">
      <OpportunitiesList :schema="opportunitySchema" :data="opportunitiesData" />
    </div>
    <div v-else>
      No opportunities data available.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import OpportunitiesList from '../components/OpportunitiesList.vue';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

// Access opportunities data and schema using data store getters
const opportunitiesData = computed(() => dataStore.getOpportunitiesData());
const opportunitySchema = computed(() => dataStore.getOpportunitySchema());

</script>

<style scoped>
/* Component-specific styles */
</style>
