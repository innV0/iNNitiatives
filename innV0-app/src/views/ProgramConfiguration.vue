<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';
import { JsonForms } from '@jsonforms/vue';
import type { UISchemaElement } from '@jsonforms/core';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

const programSchema = computed(() => dataStore.getProgramSchema());
// We need a writable ref for the form data, initialized with the store's data
const currentProgramData = ref<any>(null);

// Watch for initial data loading from the store
watch(
  () => dataStore.getProgramData(),
  (newData) => {
    if (newData) {
      currentProgramData.value = JSON.parse(JSON.stringify(newData)); // Deep copy
    }
  },
  { immediate: true }
);

// Manually generated UI Schema based on programConfiguration properties and nn-order
const generatedUiSchema = computed<UISchemaElement | null>(() => {
  if (!programSchema.value || !programSchema.value.properties) {
    return null;
  }

  const properties = programSchema.value.properties;
  const elements = Object.keys(properties)
    .map(key => ({ key, nnOrder: properties[key]['nn-order'] }))
    .sort((a, b) => (a.nnOrder || Infinity) - (b.nnOrder || Infinity))
    .map(prop => ({
      type: 'Control',
      scope: `#/properties/${prop.key}`
    }));

  return {
    type: 'VerticalLayout',
    elements: elements
  };
});

const formErrors = ref<any[]>([]);

const onFormChange = (event: any) => {
  currentProgramData.value = event.data;
  formErrors.value = event.errors || [];
};

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
        const importedJson = JSON.parse(e.target?.result as string);
        // Assuming the imported JSON directly contains the program data structure
        // or has a specific key like 'program'. For this example, let's assume it's 'program'.
        if (importedJson.program) {
          // Basic validation: check if it's an object
          if (typeof importedJson.program === 'object' && importedJson.program !== null) {
            currentProgramData.value = JSON.parse(JSON.stringify(importedJson.program)); // Deep copy
            alert('Program data imported successfully! Review and save.');
            formErrors.value = []; // Clear previous errors
          } else {
            alert('Error importing file. The "program" property in the data is not a valid object.');
          }
        } else if (typeof importedJson === 'object' && importedJson !== null && Object.keys(importedJson).length > 0 && (importedJson.programName || importedJson.programObjectives)) {
          // Fallback: if the root is the program data itself
           currentProgramData.value = JSON.parse(JSON.stringify(importedJson)); // Deep copy
           alert('Program data imported successfully (assuming root is program data)! Review and save.');
           formErrors.value = []; // Clear previous errors
        }
        else {
          alert('Error importing file. The data does not contain a "program" property or a recognizable program structure.');
        }
      } catch (error) {
        console.error('Error parsing imported file:', error);
        alert('Error importing file. Please ensure it is a valid JSON file.');
      }
    };
    reader.readAsText(file);
  }
};

// Handle Save button click
const handleSave = () => {
  if (formErrors.value.length > 0) {
    alert('Cannot save, form has errors. Please correct them.');
    console.log('Form Errors:', formErrors.value);
    return;
  }
  console.log('Save button clicked. Program Data:', currentProgramData.value);
  // Implement save logic here (e.g., send updated program data to API or update store)
  // For now, we can update the store if a method exists, or just log
  // Example: dataStore.updateProgramData(currentProgramData.value); (if such action exists)
  alert('Program data is ready for saving (actual save to backend/file is out of scope). Check console for data.');
};

// Handle Cancel button click
const handleCancel = () => {
  console.log('Cancel button clicked.');
  // Revert changes by re-fetching from the store
  const originalProgramData = dataStore.getProgramData();
  if (originalProgramData) {
    currentProgramData.value = JSON.parse(JSON.stringify(originalProgramData)); // Deep copy
  }
  formErrors.value = []; // Clear errors
  alert('Changes have been reverted to the last saved state.');
};

</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="text-3xl font-bold mb-6 text-slate-800">Program Configuration</h1>

    <div class="mb-6 flex space-x-2">
      <input type="file" ref="fileInput" @change="handleFileSelect" accept=".json" class="hidden" />
      <button
        @click="fileInput && fileInput.click()"
        class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-md text-sm transition duration-150 ease-in-out">
        Import Program Data
      </button>
      <!-- Export button is commented out as per instructions -->
    </div>

    <div v-if="dataStore.loading.value && !currentProgramData" class="text-slate-500 text-center p-4">Loading program configuration...</div>
    <div v-else-if="dataStore.error.value" class="text-red-600 text-center p-4">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="programSchema && currentProgramData && generatedUiSchema">
      <JsonForms
        :schema="programSchema"
        :uischema="generatedUiSchema"
        :data="currentProgramData"
        @change="onFormChange"
      />
      <div v-if="formErrors.length > 0" class="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
        <h3 class="font-bold mb-2">Validation Errors:</h3>
        <ul>
          <li v-for="(error, index) in formErrors" :key="index">
            {{ error.instancePath ? error.instancePath.substring(1) : 'Form' }}: {{ error.message }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="text-slate-500 text-center p-4">
       No program configuration data or schema available to render the form.
    </div>

    <div class="mt-8 flex justify-end space-x-3">
      <button
        @click="handleCancel"
        class="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
        Cancel
      </button>
      <button
        @click="handleSave"
        :disabled="formErrors.length > 0"
        class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out"
        :class="{ 'opacity-50 cursor-not-allowed': formErrors.length > 0 }">
        Save
      </button>
    </div>
  </div>
</template>
