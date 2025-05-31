<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-slate-700">Opportunities Discovery</h1>
      <button
        @click="addOpportunity"
        class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
        Add Opportunity
      </button>
    </div>

    <!-- Filter and Sorting Controls Section -->
    <div class="mb-6 p-4 bg-slate-50 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="filterNameDesc" class="block text-sm font-medium text-slate-700 mb-1">Filter by name or description</label>
          <input
            type="text"
            id="filterNameDesc"
            placeholder="Enter name or description..."
            class="form-input block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
        </div>
        <div>
          <label for="sortBy" class="block text-sm font-medium text-slate-700 mb-1">Sort by</label>
          <select
            id="sortBy"
            class="form-select block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
            <option value="">Select...</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="dataStore.loading.value" class="text-center py-10 text-lg text-slate-500">Loading opportunities data...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="opportunitySchema && opportunitiesData && opportunitiesData.length > 0">
      <OpportunitiesList :schema="opportunitySchema" :data="opportunitiesData" />
    </div>
    <div v-else class="text-center py-10 text-lg text-slate-500">
      No opportunities data available. You can start by adding a new opportunity.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import OpportunitiesList from '../components/OpportunitiesList.vue';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());
const router = useRouter();

// Access opportunities data and schema using data store getters
const opportunitiesData = computed(() => dataStore.getOpportunitiesData());
const opportunitySchema = computed(() => dataStore.getOpportunitySchema());

const addOpportunity = () => {
  router.push({ name: 'OpportunityEditView', params: { id: 'new' } });
};

</script>
