<script setup lang="ts">
import { ref, onMounted, provide, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SchemaForm from '../components/SchemaForm.vue';
import Ajv from 'ajv';
import type { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

const route = useRoute();
const router = useRouter();

// Access opportunity data and schema using data store and route params
const opportunityData = computed(() => {
  const opportunityId = route.params.id as string;
  // Find the opportunity in the data store's opportunities array
  return dataStore.getOpportunitiesData()?.find((o: any) => o.opportunityId === opportunityId) || null;
});

const opportunitySchema = computed(() => dataStore.getOpportunitySchema());
const fullSchemaDefinitions = computed(() => dataStore.getFullSchemaDefinitions());

// Provide the full schema definitions reactively (needed by SchemaForm)
provide('fullSchemaDefinitions', fullSchemaDefinitions);

// Initialize Ajv and validation function (can potentially be moved to data store)
const ajv = new Ajv({ strict: false, formats: true });
addFormats(ajv);
const validate = computed(() => opportunitySchema.value ? ajv.compile(opportunitySchema.value) : null);


// Handle Save button click
const handleSave = () => {
  console.log('Save button clicked. Opportunity Data:', opportunityData.value);
  // Implement save logic here (e.g., send updated data to API)
  alert('Save functionality for Opportunity Edit not yet implemented.');
  // After saving, potentially navigate back to detail view
  if (opportunityData.value) {
     router.push({ name: 'OpportunityDetailView', params: { id: opportunityData.value.opportunityId } });
  }
};

// Handle Cancel button click
const handleCancel = () => {
  console.log('Cancel button clicked.');
  // Implement cancel logic here (e.g., navigate back without saving)
   if (opportunityData.value) {
     router.push({ name: 'OpportunityDetailView', params: { id: opportunityData.value.opportunityId } });
  } else {
     // If no opportunity data, navigate back to the list
     router.push({ name: 'OpportunitiesDiscovery' });
  }
};

</script>

<template>
  <div class="container mx-auto p-6">
    <div v-if="dataStore.loading.value" class="text-gray-500 text-center p-4">Loading opportunity data...</div>
    <div v-else-if="dataStore.error.value" class="text-red-500 text-center p-4">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="opportunitySchema && opportunityData">
       <h1 class="text-3xl font-bold mb-6 text-gray-800">Edit {{ opportunityData.opportunityName || 'Opportunity' }}</h1>

     <!-- Back Button -->
      <div class="mb-6">
        <router-link :to="{ name: 'OpportunityDetailView', params: { id: $route.params.id } }" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm">< Back to Detail View</router-link>
      </div>

      <!-- SchemaForm handles the actual form rendering -->
      <SchemaForm :schema="opportunitySchema" :data="opportunityData" />

      <div class="mt-8 flex justify-end space-x-2">
        <button @click="handleCancel" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm">
          Cancel
        </button>
        <button @click="handleSave" class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm">
          Save
        </button>
      </div>
    </div>
    <div v-else class="text-gray-500 text-center p-4">
      Opportunity data not available or schema not loaded.
    </div>
  </div>
</template>
