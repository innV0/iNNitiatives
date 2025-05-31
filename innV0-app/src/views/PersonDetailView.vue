<template>
  <div class="container mx-auto p-6">
    <div v-if="dataStore.loading.value" class="text-gray-500 text-center p-4">Loading person details...</div>
    <div v-else-if="dataStore.error.value" class="text-red-500 text-center p-4">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="personSchema && personData">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">{{ personData.personName || 'Person Details' }}</h1>

      <!-- Back Button -->
      <div class="mb-6">
        <router-link to="/people" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md transition duration-150 ease-in-out text-sm">< Back to People</router-link>
      </div>

      <div class="space-y-8">
        <!-- Dynamically render sections and properties based on schema -->
        <div v-for="(properties, groupName) in sortedAndGroupedProperties" :key="groupName" class="border border-gray-200 rounded-lg p-6 bg-white shadow-lg">
           <h2 v-if="groupName !== 'General Information'" class="text-xl font-semibold mb-4 text-gray-700">{{ groupName }}</h2>
           <div class="space-y-3 text-gray-700">
             <div v-for="([key, property]) in properties" :key="key" class="py-3 border-b border-gray-200 last:border-b-0">
                <div v-if="shouldDisplayInDetail(property)">
                   <span class="font-semibold text-gray-800">{{ property.title || key }}:</span>
                   <template v-if="property.type === 'array'">
                      <ul class="list-disc list-inside ml-4 text-gray-600">
                         <li v-for="(item, index) in personData[key]" :key="index">{{ item }}</li>
                      </ul>
                   </template>
                   <template v-else-if="property.type === 'object'">
                      <!-- Handle nested objects - could recursively render or display specific properties -->
                      <span class="text-gray-500 ml-2">[Object]</span>
                   </template>
                    <template v-else-if="property.format === 'uri' && property.type === 'string'">
                       <a :href="personData[key]" target="_blank" class="text-blue-600 hover:underline ml-2">{{ personData[key] || 'N/A' }}</a>
                   </template>
                   <template v-else-if="property.format === 'textarea'">
                       <p class="mt-1 text-gray-700 ml-2">{{ personData[key] || 'N/A' }}</p>
                   </template>
                   <template v-else>
                      <span class="ml-2 text-gray-700">{{ personData[key] || 'N/A' }}</span>
                   </template>
                </div>
             </div>
           </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="mt-8">
        <button @click="goToEdit" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
          Edit
        </button>
      </div>

    </div>
    <div v-else class="text-gray-500 text-center p-4">
      <p>Person not found or data not loaded.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
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

// Computed property to get properties sorted by nn-order and grouped by nn-group
const sortedAndGroupedProperties = computed(() => {
  if (!personSchema.value || !personSchema.value.properties) {
    return {};
  }

  const properties = Object.entries(personSchema.value.properties);

  // Group properties by nn-group
  const grouped: { [key: string]: [string, any][] } = {};
  properties.forEach(([key, property]) => {
    const group = property['nn-group'] || 'General Information'; // Default group for detail view
    if (!grouped[group]) {
      grouped[group] = [];
    }
    grouped[group].push([key, property]);
  });

  // Sort properties within each group by nn-order
  for (const group in grouped) {
    grouped[group].sort(([, a], [, b]) => {
      const orderA = a['nn-order'] || 0;
      const orderB = b['nn-order'] || 0;
      return orderA - orderB;
    });
  }

  return grouped;
});

// Helper function to determine if a property should be displayed in the detail view
// This could be based on a custom schema property or other criteria
const shouldDisplayInDetail = (property: any) => {
   // For now, display all properties except the ID itself and potentially complex objects/arrays
   return property.type !== 'object'; // Simple check, can be refined
};


const goToEdit = () => {
  if (personData.value) {
    router.push({ name: 'PersonEditView', params: { id: personData.value.personId } });
  }
};

</script>
