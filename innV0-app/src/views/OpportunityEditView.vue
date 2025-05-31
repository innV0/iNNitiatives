<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { JsonForms } from '@jsonforms/vue';
import type { UISchemaElement } from '@jsonforms/core';
import { nanoid } from 'nanoid';
import { useDataStore } from '../dataStore';

const dataStore = inject('dataStore', useDataStore());
const route = useRoute();
const router = useRouter();

const isCreateMode = ref(route.params.id === 'new');
const currentOpportunityData = ref<any>(null);
const formErrors = ref<any[]>([]);

const opportunitySchema = computed(() => dataStore.getOpportunitySchema());
const programData = computed(() => dataStore.getProgramData()); // For default statuses

const toYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initializeNewOpportunityData = (schema: any, progData: any): object => {
  const data: { [key: string]: any } = {};
  if (schema && schema.properties) {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      if (prop.default !== undefined) {
        data[key] = prop.default;
      } else {
        switch (key) {
          case 'opportunityStatus':
            data[key] = progData?.programDefaultOpportunityStatuses?.[0] || 'Identified';
            break;
          case 'opportunityDateIdentified':
            data[key] = toYYYYMMDD(new Date());
            break;
          case 'opportunityLastUpdated':
            data[key] = new Date().toISOString();
            break;
          default:
            if (prop.type === 'string') data[key] = '';
            else if (prop.type === 'array') data[key] = [];
            else if (prop.type === 'boolean') data[key] = false;
            else if (prop.type === 'number' || prop.type === 'integer') data[key] = null;
            else data[key] = null;
        }
      }
    }
  }
  // opportunityId will be set on save
  return data;
};

watch(
  [() => route.params.id, () => dataStore.loading.value, opportunitySchema, programData],
  ([newId, isLoading, schema, progData]) => {
    if (isLoading && newId !== 'new') { // Only clear if not creating and genuinely loading existing data
      currentOpportunityData.value = null;
      return;
    }

    isCreateMode.value = newId === 'new';

    if (isCreateMode.value) {
      if (schema && progData) { // Ensure schema and programData are loaded
        currentOpportunityData.value = initializeNewOpportunityData(schema, progData);
      } else {
        currentOpportunityData.value = null; // Dependencies not ready
      }
    } else {
      const opportunity = dataStore.getOpportunitiesData()?.find((o: any) => o.opportunityId === newId);
      if (opportunity) {
        currentOpportunityData.value = JSON.parse(JSON.stringify(opportunity));
      } else if (!isLoading) { // If not loading and not found
        currentOpportunityData.value = null;
      }
    }
  },
  { immediate: true, deep: false } // deep:false as we only care about references of schema/programData
);

const generatedUiSchema = computed<UISchemaElement | null>(() => {
  if (!opportunitySchema.value || !opportunitySchema.value.properties) return null;

  const elements = Object.entries(opportunitySchema.value.properties)
    .filter(([key]) => key !== 'opportunityId' && key !== 'opportunityLastUpdated') // Exclude auto-managed fields
    .map(([key, prop]: [string, any]) => ({
      key,
      group: prop['nn-group'] || '_ungrouped',
      order: prop['nn-order'] === undefined ? Infinity : prop['nn-order'],
      uischema: { type: 'Control', scope: `#/properties/${key}`, label: prop.title || key }
    }))
    .sort((a,b) => a.order - b.order);

  const groupedElements: { [key: string]: any[] } = {};
  elements.forEach(el => {
    if (!groupedElements[el.group]) groupedElements[el.group] = [];
    groupedElements[el.group].push(el.uischema);
  });

  const finalUiSchemaElements = Object.entries(groupedElements).map(([groupName, groupElements]) => {
    if (groupName === '_ungrouped') {
      return { type: 'VerticalLayout', elements: groupElements };
    }
    return { type: 'Group', label: groupName, elements: groupElements };
  });

  if (finalUiSchemaElements.length === 1 && finalUiSchemaElements[0].type === 'VerticalLayout' && groupedElements['_ungrouped']) {
     return finalUiSchemaElements[0];
  }
  return { type: 'VerticalLayout', elements: finalUiSchemaElements };
});

const onFormChange = (event: any) => {
  currentOpportunityData.value = event.data;
  formErrors.value = event.errors || [];
};

const pageTitle = computed(() => {
  if (isCreateMode.value) return "Create New Opportunity";
  return currentOpportunityData.value?.opportunityName ? `Edit ${currentOpportunityData.value.opportunityName}` : "Edit Opportunity";
});

const handleSave = () => {
  if (formErrors.value.length > 0) {
    alert('Please correct the form errors before saving.');
    return;
  }

  currentOpportunityData.value.opportunityLastUpdated = new Date().toISOString();
  let opportunityIdToNavigate = route.params.id as string;

  if (isCreateMode.value) {
    currentOpportunityData.value.opportunityId = 'opp_' + nanoid(10);
    if (!currentOpportunityData.value.opportunityDateIdentified) { // Should be set by init, but as a fallback
        currentOpportunityData.value.opportunityDateIdentified = toYYYYMMDD(new Date());
    }
    opportunityIdToNavigate = currentOpportunityData.value.opportunityId;
    console.log("New opportunity data to be added:", currentOpportunityData.value);
    alert('New opportunity data logged to console. Saving to store not yet implemented.');
  } else {
    console.log("Updated opportunity data:", currentOpportunityData.value);
    alert('Updated opportunity data logged to console. Saving to store not yet implemented.');
  }
  router.push({ name: 'OpportunityDetailView', params: { id: opportunityIdToNavigate } });
};

const handleCancel = () => {
  if (isCreateMode.value) {
    router.push({ name: 'OpportunitiesDiscovery' });
  } else {
    router.push({ name: 'OpportunityDetailView', params: { id: route.params.id as string } });
  }
};

const backRoute = computed(() => {
  return isCreateMode.value
    ? { name: 'OpportunitiesDiscovery' }
    : { name: 'OpportunityDetailView', params: { id: route.params.id as string } };
});

const backButtonText = computed(() => {
  return isCreateMode.value ? '< Back to Opportunities List' : '< Back to Details';
});

</script>

<template>
  <div class="container mx-auto p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-slate-700">{{ pageTitle }}</h1>
      <router-link :to="backRoute" class="text-sm text-sky-600 hover:text-sky-700 hover:underline">
        {{ backButtonText }}
      </router-link>
    </div>

    <div v-if="dataStore.loading.value && !currentOpportunityData && !isCreateMode" class="text-center py-10 text-lg text-slate-500">Loading opportunity data...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading initial data: {{ dataStore.error.value }}</div>
    <div v-else-if="!opportunitySchema || (isCreateMode && !programData)" class="text-center py-10 text-lg text-slate-500">Loading schema information...</div>
    <div v-else-if="(!currentOpportunityData && !isCreateMode) || (isCreateMode && !currentOpportunityData)" class="text-center py-10 text-lg text-slate-500">
      <span v-if="isCreateMode">Initializing form...</span>
      <span v-else>Opportunity data not found.</span>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg p-6">
      <JsonForms
        v-if="generatedUiSchema && currentOpportunityData"
        :schema="opportunitySchema"
        :uischema="generatedUiSchema"
        :data="currentOpportunityData"
        @change="onFormChange"
      />
      <div v-else class="text-center py-10 text-lg text-slate-500">Preparing form...</div>

      <div v-if="formErrors.length > 0" class="mt-4 p-4 bg-red-100 text-red-700 border border-red-300 rounded-md">
        <h3 class="font-bold mb-2">Validation Errors:</h3>
        <ul>
          <li v-for="(error, index) in formErrors" :key="index">
            {{ error.instancePath ? error.instancePath.substring(1) : 'Form' }}: {{ error.message }}
          </li>
        </ul>
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
  </div>
</template>
