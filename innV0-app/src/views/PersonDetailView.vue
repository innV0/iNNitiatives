<template>
  <div class="container mx-auto p-6">
    <div v-if="dataStore.loading.value && !personData" class="text-center py-10 text-lg text-slate-500">Loading person details...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="personSchema && personData">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ personData.personName || 'Person Details' }}</h1>
          <router-link
            to="/people"
            class="text-sm text-sky-600 hover:text-sky-700 hover:underline">
            &larr; Back to People List
          </router-link>
        </div>
        <button
          @click="goToEdit"
          class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
          Edit Person
        </button>
      </div>

      <!-- Person Image -->
      <div v-if="personData.personImageUrl" class="mb-8 text-center">
        <img
          :src="personData.personImageUrl"
          alt="Profile Picture"
          class="w-32 h-32 rounded-full object-cover mx-auto shadow-md border-4 border-white">
      </div>

      <div class="space-y-6">
        <div
          v-for="(properties, groupName) in sortedAndGroupedProperties"
          :key="groupName"
          class="bg-white shadow-md rounded-lg p-6">
           <h2
            v-if="groupName !== '_ungrouped'"
            class="text-xl font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-2">
            {{ groupName }}
           </h2>
           <div class="space-y-4">
             <div v-for="([key, property]) in properties" :key="key">
                <div v-if="shouldDisplayInDetail(key, property)" class="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-1">
                  <div class="md:col-span-1 font-medium text-slate-600">{{ property.title || key }}:</div>
                  <div class="md:col-span-2">
                    <template v-if="property.type === 'array'">
                      <ul v-if="personData[key] && personData[key].length > 0" class="list-disc list-inside text-slate-800">
                        <li v-for="(item, index) in personData[key]" :key="index">{{ item || 'N/A' }}</li>
                      </ul>
                      <span v-else class="text-slate-500 italic">N/A</span>
                    </template>
                    <template v-else-if="property.format === 'uri' && property.type === 'string'">
                      <a :href="personData[key]" target="_blank" class="text-sky-600 hover:underline break-all">{{ personData[key] || 'N/A' }}</a>
                    </template>
                    <template v-else-if="property.format === 'textarea'">
                      <p class="text-slate-800 whitespace-pre-wrap">{{ personData[key] || 'N/A' }}</p>
                    </template>
                    <template v-else>
                      <span class="text-slate-800">{{ personData[key] === null || personData[key] === undefined || personData[key] === '' ? 'N/A' : personData[key] }}</span>
                    </template>

                    <!-- Display nn-tags -->
                    <div v-if="property['nn-tag'] && Array.isArray(property['nn-tag'])" class="mt-1">
                      <span
                        v-for="tag in property['nn-tag']"
                        :key="tag"
                        class="inline-block bg-sky-100 text-sky-700 text-xs font-medium mr-2 mb-1 px-2.5 py-0.5 rounded-full">
                        {{ tag }}
                      </span>
                    </div>
                     <div v-else-if="property['nn-tag'] && typeof property['nn-tag'] === 'string'" class="mt-1">
                        <span class="inline-block bg-sky-100 text-sky-700 text-xs font-medium mr-2 mb-1 px-2.5 py-0.5 rounded-full">
                          {{ property['nn-tag'] }}
                        </span>
                    </div>
                  </div>
                </div>
             </div>
           </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center py-10 text-lg text-slate-500">
      <p>Person not found or data could not be loaded.</p>
      <router-link
        to="/people"
        class="mt-4 inline-block text-sm text-sky-600 hover:text-sky-700 hover:underline">
        &larr; Back to People List
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '../dataStore'; // Import the data store

// Inject the data store
const dataStore = inject('dataStore', useDataStore());

const route = useRoute();
const router = useRouter();

// Access person data and schema using data store and route params
const personData = computed(() => {
  const personId = route.params.id as string;
  const people = dataStore.getPeopleData();
  if (!people) return null;
  return people.find((p: any) => p.personId === personId) || null;
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
    // Use '_ungrouped' if 'nn-group' is missing, to ensure all properties are captured.
    const groupName = property['nn-group'] || '_ungrouped';
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push([key, property]);
  });

  // Sort properties within each group by nn-order
  for (const groupName in grouped) {
    grouped[groupName].sort(([, a], [, b]) => {
      const orderA = a['nn-order'] === undefined ? Infinity : a['nn-order'];
      const orderB = b['nn-order'] === undefined ? Infinity : b['nn-order'];
      return orderA - orderB;
    });
  }

  // Optional: Sort the groups themselves if needed, e.g., alphabetically or by a predefined order
  // For now, the order of groups will be based on when they were first encountered.

  return grouped;
});

// Helper function to determine if a property should be displayed in the detail view
const shouldDisplayInDetail = (key: string, property: any) => {
  if (key === 'personId' || key === 'personImageUrl') { // personImageUrl is handled separately
    return false;
  }
  // Exclude complex objects for now, simple arrays are fine
  return property.type !== 'object';
};


const goToEdit = () => {
  if (personData.value) {
    router.push({ name: 'PersonEditView', params: { id: personData.value.personId } });
  }
};

</script>
