<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-slate-700">People Management</h1>
      <button
        @click="addPerson"
        class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
        Add Person
      </button>
    </div>

    <!-- Filter and Sorting Controls Section -->
    <div class="mb-6 p-4 bg-slate-50 rounded-lg shadow">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label for="filterNameRole" class="block text-sm font-medium text-slate-700 mb-1">Filter by name or role</label>
          <input
            type="text"
            id="filterNameRole"
            placeholder="Enter name or role..."
            class="form-input block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm" />
        </div>
        <div>
          <label for="sortBy" class="block text-sm font-medium text-slate-700 mb-1">Sort by</label>
          <select
            id="sortBy"
            class="form-select block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm">
            <option value="">Select...</option>
            <option value="name">Name</option>
            <option value="role">Role</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="dataStore.loading.value" class="text-center py-10 text-lg text-slate-500">Loading people data...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="personSchema && peopleData && peopleData.length > 0">
      <PeopleList :schema="personSchema" :data="peopleData" />
    </div>
    <div v-else class="text-center py-10 text-lg text-slate-500">
      No people data available. You can start by adding a new person.
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import PeopleList from '../components/PeopleList.vue';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());
const router = useRouter();

// Access people data and schema using data store getters
const peopleData = computed(() => dataStore.getPeopleData());
const personSchema = computed(() => dataStore.getPersonSchema());

const addPerson = () => {
  router.push({ name: 'PersonEditView', params: { id: 'new' } });
};

</script>
