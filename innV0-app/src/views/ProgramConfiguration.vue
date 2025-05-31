<script setup lang="ts">
import { ref, onMounted, provide, computed, inject } from 'vue';
import SchemaForm from '../components/SchemaForm.vue';
import Ajv from 'ajv';
import type { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

const programData = computed(() => dataStore.getProgramData());
const programSchema = computed(() => dataStore.getProgramSchema());
const fullSchemaDefinitions = computed(() => dataStore.getFullSchemaDefinitions());

// Provide the full schema definitions reactively (needed by SchemaForm)
provide('fullSchemaDefinitions', fullSchemaDefinitions);

// Initialize Ajv and validation function (can potentially be moved to data store)
const ajv = new Ajv({ strict: false, formats: true });
addFormats(ajv);
const validate = computed(() => dataStore.schema.value ? ajv.compile(dataStore.schema.value) : null);


// File input ref for import functionality
const fileInput = ref<HTMLInputElement | null>(null);

// Function to handle file selection for import
const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        // Validate the imported data against the full schema
        if (validate.value && validate.value(importedData)) {
          // Assuming imported data has a 'program' property
          if (importedData.program) {
             // Update the program data in the store (requires store to be mutable or have an action)
             // For now, we'll just log and alert as the store is readonly
             console.log('Program data imported successfully and is valid:', importedData.program);
             alert('Program data imported successfully! (Note: Data store is currently read-only)');
             // In a real app, you would call a store action here: dataStore.updateProgramData(importedData.program);
          } else {
             console.error('Imported data does not contain a program property.');
             alert('Error importing file. The data does not contain program configuration.');
          }
        } else {
          console.error('Imported data is invalid:', validate.value?.errors);
          alert('Error importing file. The data does not match the expected schema.');
        }
      } catch (error) {
        console.error('Error parsing imported file:', error);
        alert('Error importing file. Please ensure it is a valid JSON file.');
      }
    };

    reader.readAsText(file);
  }
};

// Function to handle data export (might need to handle full data in App.vue)
const handleExportData = () => {
  if (programData.value) {
     // For export, we might need the full data structure, not just programData
     // This functionality might need to be moved or adapted to App.vue
     alert('Full data export functionality not yet implemented in this view.');
     console.warn('Attempted to export only program data from Program Configuration view.');
  } else {
    alert('No program data to export.');
  }
};


// Handle Save button click
const handleSave = () => {
  console.log('Save button clicked. Program Data:', programData.value);
  // Implement save logic here (e.g., send updated program data to API)
  alert('Save functionality for Program Configuration not yet implemented.');
};

// Handle Cancel button click
const handleCancel = () => {
  console.log('Cancel button clicked.');
  // Implement cancel logic here (e.g., revert changes or navigate away)
  alert('Cancel functionality for Program Configuration not yet implemented.');
};

</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Program Configuration</h1>

    <!-- Import/Export buttons - might need to handle full data in App.vue -->
    <div class="mb-6">
      <input type="file" ref="fileInput" @change="handleFileSelect" accept=".json" class="hidden" />
      <button @click="$refs.fileInput.click()" class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded text-sm mr-2 transition duration-150 ease-in-out">
        Import Program Data
      </button>
      <!-- Export button is less straightforward here as it should export full data -->
      <!-- <button @click="handleExportData" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Export Data
      </button> -->
    </div>


    <div v-if="dataStore.loading.value">Loading program configuration...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="programSchema && programData">
      <SchemaForm :schema="programSchema" :data="programData" />
    </div>
     <div v-else>
       No program configuration data available.
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
