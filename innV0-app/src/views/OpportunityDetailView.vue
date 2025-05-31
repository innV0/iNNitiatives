<template>
  <div class="p-4">
    <div v-if="dataStore.loading.value">Loading opportunity details...</div>
    <div v-else-if="dataStore.error.value">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="opportunitySchema && opportunityData">
      <h1 class="text-2xl font-bold mb-6 text-gray-800">{{ opportunityData.opportunityName || 'Opportunity Details' }}</h1>

      <!-- Back Button/Breadcrumbs -->
      <div class="mb-6">
        <router-link to="/opportunities" class="text-gray-600 hover:text-gray-800 hover:underline transition duration-150 ease-in-out">< Back to Opportunities</router-link>
      </div>

      <div class="space-y-8">
        <!-- Dynamically render sections and properties based on schema -->
        <div v-for="(properties, groupName) in sortedAndGroupedProperties" :key="groupName" class="border border-gray-300 rounded-md p-4 bg-white shadow-sm">
           <h2 v-if="groupName !== 'General Information'" class="text-xl font-semibold mb-4 text-gray-700">{{ groupName }}</h2>
           <div class="space-y-3 text-gray-700">
             <div v-for="([key, property]) in properties" :key="key">
                <div v-if="shouldDisplayInDetail(property)">
                   <span class="font-semibold text-gray-800">{{ property.title || key }}:</span>
                   <template v-if="property.type === 'array'">
                      <ul class="list-disc list-inside ml-4 text-gray-600">
                         <li v-for="(item, index) in opportunityData[key]" :key="index">{{ item }}</li>
                      </ul>
                   </template>
                   <template v-else-if="property.type === 'object'">
                      <!-- Handle nested objects - could recursively render or display specific properties -->
                      <span class="text-gray-500">[Object]</span>
                   </template>
                    <template v-else-if="property.format === 'uri' && property.type === 'string'">
                       <a :href="opportunityData[key]" target="_blank" class="text-blue-600 hover:underline">{{ opportunityData[key] || 'N/A' }}</a>
                   </template>
                   <template v-else-if="property.format === 'textarea'">
                       <p class="mt-1 text-gray-700">{{ opportunityData[key] || 'N/A' }}</p>
                   </template>
                   <template v-else>
                      {{ opportunityData[key] || 'N/A' }}
                   </template>
                </div>
             </div>
           </div>
        </div>
      </div>

      <!-- Edit Button -->
      <div class="mt-8">
        <button @click="goToEdit" class="bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded text-sm transition duration-150 ease-in-out">
          Edit
        </button>
      </div>

    </div>
    <div v-else>
      <p>Opportunity not found or data not loaded.</p>
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

// Access opportunity data and schema using data store and route params
const opportunityData = computed(() => {
  const opportunityId = route.params.id as string;
  // Find the opportunity in the data store's opportunities array
  return dataStore.getOpportunitiesData()?.find((o: any) => o.opportunityId === opportunityId) || null;
});

const opportunitySchema = computed(() => dataStore.getOpportunitySchema());

// Computed property to get properties sorted by nn-order and grouped by nn-group
const sortedAndGroupedProperties = computed(() => {
  if (!opportunitySchema.value || !opportunitySchema.value.properties) {
    return {};
  }

  const properties = Object.entries(opportunitySchema.value.properties);

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
  if (opportunityData.value) {
    router.push({ name: 'OpportunityEditView', params: { id: opportunityData.value.opportunityId } });
  }
};

</script>

<style scoped>
/* Component-specific styles */
</style>
