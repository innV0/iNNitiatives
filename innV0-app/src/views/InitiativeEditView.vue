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

// Access initiative data and schema using data store and route params
const initiativeData = computed(() => {
  const initiativeId = route.params.id as string;
  // Find the initiative in the data store's initiatives array
  return dataStore.getInitiativesData()?.find((i: any) => i.initiativeId === initiativeId) || null;
});

const initiativeSchema = computed(() => dataStore.getInitiativeSchema());
const fullSchemaDefinitions = computed(() => dataStore.getFullSchemaDefinitions());

// Provide the full schema definitions reactively (needed by SchemaForm)
provide('fullSchemaDefinitions', fullSchemaDefinitions);

// Initialize Ajv and validation function (can potentially be moved to data store)
const ajv = new Ajv({ strict: false, formats: true });
addFormats(ajv);
const validate = computed(() => initiativeSchema.value ? ajv.compile(initiativeSchema.value) : null);


// Handle Save button click
const handleSave = () => {
  console.log('Save button clicked. Data:', initiativeData.value);
  // Implement save logic here (e.g., send updated data to API)
  alert('Save functionality for Initiative Edit not yet implemented.');
  // After saving, potentially navigate back to detail view
  if (initiativeData.value) {
     router.push({ name: 'InitiativeDetailView', params: { id: initiativeData.value.initiativeId } });
  }
};

// Handle Cancel button click
const handleCancel = () => {
  console.log('Cancel button clicked.');
  // Implement cancel logic here (e.g., navigate back without saving)
   if (initiativeData.value) {
     router.push({ name: 'InitiativeDetailView', params: { id: initiativeData.value.initiativeId } });
  } else {
     // If no initiative data, navigate back to the list
     router.push({ name: 'InitiativeLifecycleManagement' });
  }
};

</script>

<template>
  <div class="p-4">
    <div v-if="dataStore.loading.value">Loading initiative data...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="initiativeSchema && initiativeData">
       <h1 class="text-2xl font-bold mb-6 text-gray-800">Edit Initiative</h1>

     <!-- Back Button/Breadcrumbs -->
      <div class="mb-6">
        <router-link :to="{ name: 'InitiativeDetailView', params: { id: $route.params.id } }" class="text-gray-600 hover:text-gray-800 hover:underline transition duration-150 ease-in-out">< Back to Detail View</router-link>
      </div>


    <div v-if="initiativeSchema && initiativeData">
       <!-- Using SchemaForm for editing -->
      <SchemaForm :schema="initiativeSchema" :data="initiativeData" />
    </div>
     <div v-else>
       Loading initiative data...
     </div>

    <div class="mt-8 flex justify-end">
      <button @click="handleCancel" class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded text-sm mr-2 transition duration-150 ease-in-out">
        Cancel
      </button>
      <button @click="handleSave" class="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm transition duration-150 ease-in-out">
        Save
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
