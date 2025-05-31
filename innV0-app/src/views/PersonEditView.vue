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

// Access person data and schema using data store and route params
const personData = computed(() => {
  const personId = route.params.id as string;
  // Find the person in the data store's people array
  return dataStore.getPeopleData()?.find((p: any) => p.personId === personId) || null;
});

const personSchema = computed(() => dataStore.getPersonSchema());
const fullSchemaDefinitions = computed(() => dataStore.getFullSchemaDefinitions());

// Provide the full schema definitions reactively (needed by SchemaForm)
provide('fullSchemaDefinitions', fullSchemaDefinitions);

// Initialize Ajv and validation function (can potentially be moved to data store)
const ajv = new Ajv({ strict: false, formats: true });
addFormats(ajv);
const validate = computed(() => personSchema.value ? ajv.compile(personSchema.value) : null);


// Handle Save button click
const handleSave = () => {
  console.log('Save button clicked. Person Data:', personData.value);
  // Implement save logic here (e.g., send updated data to API)
  alert('Save functionality for Person Edit not yet implemented.');
  // After saving, potentially navigate back to detail view
  if (personData.value) {
     router.push({ name: 'PersonDetailView', params: { id: personData.value.personId } });
  }
};

// Handle Cancel button click
const handleCancel = () => {
  console.log('Cancel button clicked.');
  // Implement cancel logic here (e.g., navigate back without saving)
   if (personData.value) {
     router.push({ name: 'PersonDetailView', params: { id: personData.value.personId } });
  } else {
     // If no person data, navigate back to the list
     router.push({ name: 'PeopleManagement' });
  }
};

</script>

<template>
  <div class="p-4">
    <div v-if="dataStore.loading.value">Loading person data...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="personSchema && personData">
       <h1 class="text-2xl font-bold mb-6 text-gray-800">Edit Person</h1>

     <!-- Back Button/Breadcrumbs -->
      <div class="mb-6">
        <router-link :to="{ name: 'PersonDetailView', params: { id: $route.params.id } }" class="text-gray-600 hover:text-gray-800 hover:underline transition duration-150 ease-in-out">< Back to Detail View</router-link>
      </div>


    <div v-if="personSchema && personData">
       <!-- Using SchemaForm for editing -->
      <SchemaForm :schema="personSchema" :data="personData" />
    </div>
     <div v-else>
       Loading person data...
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
