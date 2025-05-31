<template>
  <div class="container mx-auto p-6">
    <div v-if="dataStore.loading.value && !initiativeData" class="text-center py-10 text-lg text-slate-500">Loading initiative details...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading data: {{ dataStore.error.value }}</div>
    <div v-else-if="initiativeSchema && initiativeData">
      <div class="flex justify-between items-start mb-6">
        <div>
          <h1 class="text-3xl font-bold text-slate-800 mb-2">{{ initiativeData.initiativeName || 'Initiative Details' }}</h1>
          <router-link
            to="/initiatives"
            class="text-sm text-sky-600 hover:text-sky-700 hover:underline">
            &larr; Back to Initiatives List
          </router-link>
        </div>
        <button
          @click="goToEdit"
          class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-4 rounded-md text-sm transition duration-150 ease-in-out">
          Edit Initiative
        </button>
      </div>

      <!-- Type, Phase, and Budget Badges -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <span
          v-if="initiativeData.initiativeType"
          class="px-3 py-1 text-sm font-semibold rounded-full"
          :class="getTypeClass(initiativeData.initiativeType)">
          Type: {{ initiativeData.initiativeType }}
        </span>
        <span
          v-if="initiativeData.initiativePhase"
          class="px-3 py-1 text-sm font-semibold rounded-full"
          :class="getPhaseClass(initiativeData.initiativePhase)">
          Phase: {{ initiativeData.initiativePhase }}
        </span>
        <span
          v-if="initiativeData.initiativeBudget !== undefined && initiativeData.initiativeBudget !== null"
          class="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700 border border-green-200">
          Budget: {{ formatCurrency(initiativeData.initiativeBudget) }}
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
                      <ul v-if="initiativeData[key] && initiativeData[key].length > 0" class="list-disc list-inside text-slate-800">
                        <li v-for="(item, index) in initiativeData[key]" :key="index">{{ item || 'N/A' }}</li>
                      </ul>
                      <span v-else class="text-slate-500 italic">N/A</span>
                    </template>
                    <template v-else-if="property.format === 'uri' && property.type === 'string'">
                      <a :href="initiativeData[key]" target="_blank" class="text-sky-600 hover:underline break-all">{{ initiativeData[key] || 'N/A' }}</a>
                    </template>
                    <template v-else-if="property.format === 'date' || property.format === 'date-time'">
                      <span class="text-slate-800">{{ formatDateTime(initiativeData[key], property.format) }}</span>
                    </template>
                    <template v-else-if="property.format === 'textarea'">
                      <p class="text-slate-800 whitespace-pre-wrap">{{ initiativeData[key] || 'N/A' }}</p>
                    </template>
                    <template v-else-if="property.type === 'number' || property.type === 'integer'">
                       <span class="text-slate-800">{{ initiativeData[key] === null || initiativeData[key] === undefined ? 'N/A' : initiativeData[key] }}</span>
                    </template>
                    <template v-else>
                      <span class="text-slate-800">{{ initiativeData[key] === null || initiativeData[key] === undefined || initiativeData[key] === '' ? 'N/A' : initiativeData[key] }}</span>
                    </template>

                    <div v-if="property['nn-tag'] && Array.isArray(property['nn-tag'])" class="mt-1">
                      <span
                        v-for="tag_item in property['nn-tag']"
                        :key="tag_item"
                        class="inline-block bg-sky-100 text-sky-700 text-xs font-medium mr-2 mb-1 px-2.5 py-0.5 rounded-full">
                        {{ tag_item }}
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
      <p>Initiative not found or data could not be loaded.</p>
      <router-link
        to="/initiatives"
        class="mt-4 inline-block text-sm text-sky-600 hover:text-sky-700 hover:underline">
        &larr; Back to Initiatives List
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

const initiativeData = computed(() => {
  const initiativeId = route.params.id as string;
  const initiatives = dataStore.getInitiativesData();
  if (!initiatives) return null;
  return initiatives.find((i: any) => i.initiativeId === initiativeId) || null;
});

const initiativeSchema = computed(() => dataStore.getInitiativeSchema());

const sortedAndGroupedProperties = computed(() => {
  if (!initiativeSchema.value || !initiativeSchema.value.properties) return {};

  const properties = Object.entries(initiativeSchema.value.properties);
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
  const specialHandledKeys = ['initiativeId', 'initiativeType', 'initiativePhase', 'initiativeBudget'];
  if (specialHandledKeys.includes(key)) {
    return false;
  }
  return property.type !== 'object';
};

const goToEdit = () => {
  if (initiativeData.value) {
    router.push({ name: 'InitiativeEditView', params: { id: initiativeData.value.initiativeId } });
  }
};

const getTypeClass = (type: string) => {
  const colors = [
    'bg-sky-100 text-sky-700 border border-sky-200', 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'bg-violet-100 text-violet-700 border border-violet-200', 'bg-amber-100 text-amber-700 border border-amber-200',
    'bg-indigo-100 text-indigo-700 border border-indigo-200', 'bg-pink-100 text-pink-700 border border-pink-200',
    'bg-lime-100 text-lime-700 border border-lime-200',
  ];
  let hash = 0;
  for (let i = 0; i < type.length; i++) { hash = type.charCodeAt(i) + ((hash << 5) - hash); }
  return colors[Math.abs(hash) % colors.length] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

const getPhaseClass = (phase: string) => {
   switch (phase) {
    case 'Idea Definition': return 'bg-slate-100 text-slate-600 border border-slate-200';
    case 'Concept Design': return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'Prototype Development': return 'bg-violet-100 text-violet-700 border border-violet-200';
    case 'Validation': return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Pilot Testing': return 'bg-lime-100 text-lime-700 border border-lime-200';
    case 'Launched': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'Scaling': return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    case 'On Hold': return 'bg-orange-100 text-orange-700 border border-orange-200';
    case 'Cancelled': return 'bg-rose-100 text-rose-700 border border-rose-200';
    default: return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
};

const formatCurrency = (value: number | undefined | null) => {
  if (value === null || value === undefined) return 'N/A';
  return `€${value.toLocaleString('de-DE')}`; // Example: Euro format
};

const formatDateTime = (dateString: string | undefined | null, formatType?: string) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    if (formatType === 'date') {
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch (e) {
    return dateString;
  }
};

</script>
