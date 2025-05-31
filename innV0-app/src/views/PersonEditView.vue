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
const currentPersonData = ref<any>(null);
const formErrors = ref<any[]>([]);

const personSchema = computed(() => dataStore.getPersonSchema());

const initializeNewPersonData = (schema: any): object => {
  const data: { [key: string]: any } = {};
  if (schema && schema.properties) {
    for (const key in schema.properties) {
      const prop = schema.properties[key];
      if (prop.default !== undefined) {
        data[key] = prop.default;
      } else {
        switch (prop.type) {
          case 'string':
            data[key] = '';
            break;
          case 'array':
            data[key] = [];
            break;
          case 'boolean':
            data[key] = false;
            break;
          case 'number':
          case 'integer':
            data[key] = null; // Or 0, depending on preference
            break;
          default:
            data[key] = null;
        }
      }
    }
  }
  // personId will be set on save for new entries
  return data;
};

watch(
  [() => route.params.id, () => dataStore.loading.value], // React to ID change or data store loading state
  ([newId, isLoading]) => {
    if (isLoading) {
      currentPersonData.value = null; // Clear data while store is loading
      return;
    }

    isCreateMode.value = newId === 'new';
    if (isCreateMode.value) {
      if (personSchema.value) {
        currentPersonData.value = initializeNewPersonData(personSchema.value);
      } else {
        // Schema not ready yet, wait for it
        currentPersonData.value = null;
      }
    } else {
      const person = dataStore.getPeopleData()?.find((p: any) => p.personId === newId);
      if (person) {
        currentPersonData.value = JSON.parse(JSON.stringify(person)); // Deep copy
      } else {
        currentPersonData.value = null; // Not found or still loading
      }
    }
  },
  { immediate: true }
);

// Watch for schema to be ready in create mode
watch(personSchema, (newSchema) => {
  if (isCreateMode.value && !currentPersonData.value && newSchema) {
    currentPersonData.value = initializeNewPersonData(newSchema);
  }
});


const generatedUiSchema = computed<UISchemaElement | null>(() => {
  if (!personSchema.value || !personSchema.value.properties) return null;

  const elements = Object.entries(personSchema.value.properties)
    .filter(([key]) => key !== 'personId') // Exclude personId from form
    .map(([key, prop]: [string, any]) => ({
      key,
      group: prop['nn-group'] || '_ungrouped',
      order: prop['nn-order'] === undefined ? Infinity : prop['nn-order'],
      uischema: {
        type: 'Control',
        scope: `#/properties/${key}`,
        label: prop.title || key,
      }
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
    return {
      type: 'Group',
      label: groupName,
      elements: groupElements
    };
  });

  // If there's only one group and it's '_ungrouped', don't wrap it in another VerticalLayout.
  if (finalUiSchemaElements.length === 1 && finalUiSchemaElements[0].type === 'VerticalLayout' && groupedElements['_ungrouped']) {
     return finalUiSchemaElements[0];
  }

  return {
    type: 'VerticalLayout',
    elements: finalUiSchemaElements,
  };
});

const onFormChange = (event: any) => {
  currentPersonData.value = event.data;
  formErrors.value = event.errors || [];
};

const pageTitle = computed(() => {
  if (isCreateMode.value) return "Create New Person";
  return currentPersonData.value?.personName ? `Edit ${currentPersonData.value.personName}` : "Edit Person";
});

const handleSave = () => {
  if (formErrors.value.length > 0) {
    alert('Please correct the form errors before saving.');
    return;
  }

  let personIdToNavigate = route.params.id as string;

  if (isCreateMode.value) {
    currentPersonData.value.personId = nanoid(10);
    personIdToNavigate = currentPersonData.value.personId;
    console.log("New person data to be added:", currentPersonData.value);
    // Conceptual: dataStore.addPerson(currentPersonData.value);
    alert('New person data logged to console. Saving to store not yet implemented.');
  } else {
    console.log("Updated person data:", currentPersonData.value);
    // Conceptual: dataStore.updatePerson(currentPersonData.value);
    alert('Updated person data logged to console. Saving to store not yet implemented.');
  }
  router.push({ name: 'PersonDetailView', params: { id: personIdToNavigate } });
};

const handleCancel = () => {
  if (isCreateMode.value) {
    router.push({ name: 'PeopleManagement' });
  } else {
    router.push({ name: 'PersonDetailView', params: { id: route.params.id as string } });
  }
};

const backRoute = computed(() => {
  return isCreateMode.value
    ? { name: 'PeopleManagement' }
    : { name: 'PersonDetailView', params: { id: route.params.id as string } };
});

const backButtonText = computed(() => {
  return isCreateMode.value ? '< Back to People List' : '< Back to Details';
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

    <div v-if="dataStore.loading.value && !currentPersonData && !isCreateMode" class="text-center py-10 text-lg text-slate-500">Loading person data...</div>
    <div v-else-if="dataStore.error.value" class="text-center py-10 text-lg text-red-600">Error loading initial data: {{ dataStore.error.value }}</div>
    <div v-else-if="!personSchema" class="text-center py-10 text-lg text-slate-500">Loading schema...</div>
    <div v-else-if="(!currentPersonData && !isCreateMode) || (isCreateMode && !currentPersonData)" class="text-center py-10 text-lg text-slate-500">
      <span v-if="isCreateMode">Initializing form...</span>
      <span v-else>Person data not found.</span>
    </div>

    <div v-else class="bg-white shadow-md rounded-lg p-6">
      <JsonForms
        v-if="generatedUiSchema && currentPersonData"
        :schema="personSchema"
        :uischema="generatedUiSchema"
        :data="currentPersonData"
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
