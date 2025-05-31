<template>
  <div class="container mx-auto p-6">
    <div v-if="dataStore.loading.value && !opportunityData" class="text-center py-10 text-lg text-slate-500">Loading opportunity details...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="opportunitySchema && opportunityData">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ opportunityData.opportunityName || 'Opportunity Details' }}</h1>
          <router-link
            to="/opportunities"
            class="text-sm text-sky-600 hover:text-sky-700 hover:underline">
            &larr; Back to Opportunities List
          </router-link>
        </div>
        <button
          @click="goToEdit"
          class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
          Edit Opportunity
        </button>
      </div>

      <!-- Status and Priority Badges -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <span
          v-if="opportunityData.opportunityStatus"
          class="px-3 py-1 text-sm font-semibold rounded-full"
          :class="getStatusClass(opportunityData.opportunityStatus)">
          Status: {{ opportunityData.opportunityStatus }}
        </span>
        <span
          v-if="opportunityData.opportunityPriority !== undefined && opportunityData.opportunityPriority !== null"
          class="px-3 py-1 text-sm font-semibold rounded-full"
          :class="getPriorityClass(opportunityData.opportunityPriority)">
          Priority: {{ opportunityData.opportunityPriority }}
          ({{ getPriorityText(opportunityData.opportunityPriority) }})
        </span>
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
                      <ul v-if="opportunityData[key] && opportunityData[key].length > 0" class="list-disc list-inside text-slate-800">
                        <li v-for="(item, index) in opportunityData[key]" :key="index">{{ item || 'N/A' }}</li>
                      </ul>
                      <span v-else class="text-slate-500 italic">N/A</span>
                    </template>
                    <template v-else-if="property.format === 'uri' && property.type === 'string'">
                      <a :href="opportunityData[key]" target="_blank" class="text-sky-600 hover:underline break-all">{{ opportunityData[key] || 'N/A' }}</a>
                    </template>
                    <template v-else-if="property.format === 'date' || property.format === 'date-time'">
                      <span class="text-slate-800">{{ formatDate(opportunityData[key]) }}</span>
                    </template>
                    <template v-else-if="property.format === 'textarea'">
                      <p class="text-slate-800 whitespace-pre-wrap">{{ opportunityData[key] || 'N/A' }}</p>
                    </template>
                    <template v-else>
                      <span class="text-slate-800">{{ opportunityData[key] === null || opportunityData[key] === undefined || opportunityData[key] === '' ? 'N/A' : opportunityData[key] }}</span>
                    </template>

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
      <p>Opportunity not found or data could not be loaded.</p>
      <router-link
        to="/opportunities"
        class="mt-4 inline-block text-sm text-sky-600 hover:text-sky-700 hover:underline">
        &larr; Back to Opportunities List
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useDataStore } from '../dataStore';

const dataStore = inject('dataStore', useDataStore());
const route = useRoute();
const router = useRouter();

const opportunityData = computed(() => {
  const opportunityId = route.params.id as string;
  const opportunities = dataStore.getOpportunitiesData();
  if (!opportunities) return null;
  return opportunities.find((o: any) => o.opportunityId === opportunityId) || null;
});

const opportunitySchema = computed(() => dataStore.getOpportunitySchema());

const sortedAndGroupedProperties = computed(() => {
  if (!opportunitySchema.value || !opportunitySchema.value.properties) return {};

  const properties = Object.entries(opportunitySchema.value.properties);
  const grouped: { [key: string]: [string, any][] } = {};

  properties.forEach(([key, property]) => {
    const groupName = property['nn-group'] || '_ungrouped';
    if (!grouped[groupName]) grouped[groupName] = [];
    grouped[groupName].push([key, property]);
  });

  for (const groupName in grouped) {
    grouped[groupName].sort(([, a], [, b]) => {
      const orderA = a['nn-order'] === undefined ? Infinity : a['nn-order'];
      const orderB = b['nn-order'] === undefined ? Infinity : b['nn-order'];
      return orderA - orderB;
    });
  }
  return grouped;
});

const shouldDisplayInDetail = (key: string, property: any) => {
  if (key === 'opportunityId' || key === 'opportunityStatus' || key === 'opportunityPriority') {
    return false; // Handled separately
  }
  return property.type !== 'object';
};

const goToEdit = () => {
  if (opportunityData.value) {
    router.push({ name: 'OpportunityEditView', params: { id: opportunityData.value.opportunityId } });
  }
};

const getStatusClass = (status: string) => {
  // Using similar classes from OpportunitiesList for consistency
  switch (status) {
    case 'Identified': return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'Under Review': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Prioritized': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'Archived': return 'bg-slate-100 text-slate-600 border border-slate-200';
    default: return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
};

const getPriorityClass = (priority: number) => {
  // Using similar classes from OpportunitiesList for consistency
  if (priority >= 8) return 'bg-rose-100 text-rose-700 border border-rose-200';
  if (priority >= 5) return 'bg-amber-100 text-amber-700 border border-amber-200';
  if (priority >= 0) return 'bg-lime-100 text-lime-700 border border-lime-200';
  return 'bg-slate-100 text-slate-500 border border-slate-200';
};

const getPriorityText = (priority: number) => {
  if (priority >= 8) return 'High';
  if (priority >= 5) return 'Medium';
  if (priority >= 0) return 'Low';
  return 'N/A';
};

const formatDate = (dateString: string | undefined | null) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return dateString; // Return original string if date is invalid
    }
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    return dateString; // In case of error, return original string
  }
};

</script>
