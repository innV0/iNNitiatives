<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-slate-700">Initiative Lifecycle Management</h1>
      <button
        @click="addInitiative"
        class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
        Add Initiative
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
            <option value="type">Type</option>
            <option value="phase">Phase</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="dataStore.loading.value" class="text-center py-10 text-lg text-slate-500">Loading initiatives data...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="initiativeSchema && initiativesData && initiativesData.length > 0">
      <InitiativesList :schema="initiativeSchema" :data="initiativesData" />
    </div>
    <div v-else class="text-center py-10 text-lg text-slate-500">
      No initiatives data available. You can start by adding a new initiative.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import InitiativesList from '../components/InitiativesList.vue';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());
const router = useRouter();

// Access initiatives data and schema using data store getters
const initiativesData = computed(() => dataStore.getInitiativesData());
const initiativeSchema = computed(() => dataStore.getInitiativeSchema());

const addInitiative = () => {
  router.push({ name: 'InitiativeEditView', params: { id: 'new' } });
};

</script>
