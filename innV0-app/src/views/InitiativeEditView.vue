<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { JsonForms } from '@jsonforms/vue';
import type { UISchemaElement } from '@jsonforms/core';
import { nanoid } from 'nanoid';
import { useDataStore } from '../dataStore';
import { cloneDeep } from 'lodash-es'; // For deep cloning schema

const dataStore = inject('dataStore', useDataStore());
const route = useRoute();
const router = useRouter();

const isCreateMode = ref(route.params.id === 'new');
const currentInitiativeData = ref<any>(null);
const formErrors = ref<any[]>([]);

const baseInitiativeSchema = computed(() => dataStore.getInitiativeSchema());
const programConfig = computed(() => dataStore.getProgramData());

const formSchemaForJsonForms = computed(() => {
  if (!baseInitiativeSchema.value || !programConfig.value) {
    return null;
  }
  const schemaCopy = cloneDeep(baseInitiativeSchema.value); // Use lodash cloneDeep

  if (schemaCopy.properties) {
    if (schemaCopy.properties.initiativePhase && programConfig.value.programStages) {
      schemaCopy.properties.initiativePhase.enum = [...programConfig.value.programStages];
    }
    if (schemaCopy.properties.initiativeType && programConfig.value.programDefaultInitiativeTypes) {
      schemaCopy.properties.initiativeType.enum = [...programConfig.value.programDefaultInitiativeTypes];
    }
  }
  return schemaCopy;
});

const toYYYYMMDD = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const initializeNewInitiativeData = (schema: any): object => {
  const data: { [key: string]: any } = {};
  if (schema && schema.properties) {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      if (prop.default !== undefined) {
        data[key] = prop.default;
      } else {
        switch (key) {
          case 'initiativeDateRegistered':
            data[key] = toYYYYMMDD(new Date());
            break;
          case 'initiativeLastUpdated':
            data[key] = new Date().toISOString();
            break;
          // initiativeType and initiativePhase will use the first enum value if not otherwise specified by schema default
          case 'initiativeType':
            data[key] = prop.enum?.[0] || '';
            break;
          case 'initiativePhase':
            data[key] = prop.enum?.[0] || '';
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
  return data;
};

watch(
  [() => route.params.id, () => dataStore.loading.value, formSchemaForJsonForms],
  ([newId, isLoading, currentFormSchema]) => {
    if (isLoading && newId !== 'new') {
      currentInitiativeData.value = null;
      return;
    }

    isCreateMode.value = newId === 'new';

    if (isCreateMode.value) {
      if (currentFormSchema) {
        currentInitiativeData.value = initializeNewInitiativeData(currentFormSchema);
      } else {
        currentInitiativeData.value = null;
      }
    } else {
      const initiative = dataStore.getInitiativesData()?.find((i: any) => i.initiativeId === newId);
      if (initiative) {
        currentInitiativeData.value = JSON.parse(JSON.stringify(initiative));
      } else if (!isLoading) {
        currentInitiativeData.value = null;
      }
    }
  },
  { immediate: true, deep: false }
);

const generatedUiSchema = computed<UISchemaElement | null>(() => {
  if (!formSchemaForJsonForms.value || !formSchemaForJsonForms.value.properties) return null;

  const properties = formSchemaForJsonForms.value.properties;
  const elements = Object.keys(properties)
    .filter(key => key !== 'initiativeId' && key !== 'initiativeLastUpdated')
    .map(key => ({
      key,
      group: properties[key]['nn-group'] || '_ungrouped',
      order: properties[key]['nn-order'] === undefined ? Infinity : properties[key]['nn-order'],
      uischema: { type: 'Control', scope: `#/properties/${key}`, label: properties[key].title || key }
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
  currentInitiativeData.value = event.data;
  formErrors.value = event.errors || [];
};

const pageTitle = computed(() => {
  if (isCreateMode.value) return "Create New Initiative";
  return currentInitiativeData.value?.initiativeName ? `Edit ${currentInitiativeData.value.initiativeName}` : "Edit Initiative";
});

const handleSave = () => {
  if (formErrors.value.length > 0) {
    alert('Please correct the form errors before saving.');
    return;
  }

  currentInitiativeData.value.initiativeLastUpdated = new Date().toISOString();
  let initiativeIdToNavigate = route.params.id as string;

  if (isCreateMode.value) {
    currentInitiativeData.value.initiativeId = 'init_' + nanoid(10);
    if (!currentInitiativeData.value.initiativeDateRegistered) {
        currentInitiativeData.value.initiativeDateRegistered = toYYYYMMDD(new Date());
    }
    initiativeIdToNavigate = currentInitiativeData.value.initiativeId;
    console.log("New initiative data to be added:", currentInitiativeData.value);
    alert('New initiative data logged to console. Saving to store not yet implemented.');
  } else {
    console.log("Updated initiative data:", currentInitiativeData.value);
    alert('Updated initiative data logged to console. Saving to store not yet implemented.');
  }
  router.push({ name: 'InitiativeDetailView', params: { id: initiativeIdToNavigate } });
};

const handleCancel = () => {
  if (isCreateMode.value) {
    router.push({ name: 'InitiativeLifecycleManagement' });
  } else {
    router.push({ name: 'InitiativeDetailView', params: { id: route.params.id as string } });
  }
};

const backRoute = computed(() => {
  return isCreateMode.value
    ? { name: 'InitiativeLifecycleManagement' }
    : { name: 'InitiativeDetailView', params: { id: route.params.id as string } };
});

const backButtonText = computed(() => {
  return isCreateMode.value ? '< Back to Initiatives List' : '< Back to Details';
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

    <div v-if="dataStore.loading.value && !currentInitiativeData && !isCreateMode" class="text-center py-10 text-lg text-slate-500">Loading initiative data...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading initial data: {{ dataStore.error.value }}</div>
    <div v-else-if="!baseInitiativeSchema || (isCreateMode && !programConfig)" class="text-center py-10 text-lg text-slate-500">Loading schema or program configuration...</div>
    <div v-else-if="!formSchemaForJsonForms" class="text-center py-10 text-lg text-slate-500">Preparing form schema...</div>
    <div v-else-if="(!currentInitiativeData && !isCreateMode) || (isCreateMode && !currentInitiativeData)" class="text-center py-10 text-lg text-slate-500">
      <span v-if="isCreateMode">Initializing form...</span>
      <span v-else>Initiative data not found.</span>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg p-6">
      <JsonForms
        v-if="generatedUiSchema && currentInitiativeData"
        :schema="formSchemaForJsonForms"
        :uischema="generatedUiSchema"
        :data="currentInitiativeData"
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
