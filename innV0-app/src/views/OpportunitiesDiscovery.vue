<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">Opportunities Discovery</h1>

    <!-- Filter and Sorting Controls Section -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg shadow">
      <div class="flex items-center space-x-4">
        <input type="text" placeholder="Filter by name or description..." class="form-input block w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
        <select class="form-select block w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm">
          <option value="">Sort by...</option>
          <option value="name">Name</option>
          <option value="status">Status</option>
          <option value="priority">Priority</option>
        </select>
      </div>
    </div>

    <div v-if="dataStore.loading.value" class="text-gray-500 text-center p-4">Loading opportunities data...</div>
    <div v-else-if="dataStore.error.value" class="text-red-500 text-center p-4">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="opportunitySchema && opportunitiesData">
      <OpportunitiesList :schema="opportunitySchema" :data="opportunitiesData" />
    </div>
    <div v-else class="text-gray-500 text-center p-4">
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
