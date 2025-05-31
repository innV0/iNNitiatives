import { ref, readonly } from 'vue';

const schema = ref<any | null>(null);
const data = ref<any | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const loadData = async () => {
  try {
    loading.value = true;
    // Load the JSON schema
    const schemaResponse = await fetch('/schema.json');
    const loadedSchema = await schemaResponse.json();
    schema.value = loadedSchema;

    // Load the sample data
    const dataResponse = await fetch('/sample-data.json');
    const loadedData = await dataResponse.json();
    data.value = loadedData;

    loading.value = false;
    console.log('Data store loaded successfully.');

  } catch (e: any) {
    console.error('Error loading data store:', e);
    error.value = e.message || 'Failed to load data.';
    loading.value = false;
  }
};

// Load data when the store is imported
loadData();

export const useDataStore = () => {
  return {
    schema: readonly(schema),
    data: readonly(data),
    loading: readonly(loading),
    error: readonly(error),
    // Add computed properties or functions to get specific data/schema parts
    getProgramData: () => data.value?.program,
    getProgramSchema: () => schema.value?.definitions?.programConfiguration,
    getPeopleData: () => data.value?.people,
    getPersonSchema: () => schema.value?.definitions?.person,
    getOpportunitiesData: () => data.value?.opportunities,
    getOpportunitySchema: () => schema.value?.definitions?.opportunity,
    getInitiativesData: () => data.value?.initiatives,
    getInitiativeSchema: () => schema.value?.definitions?.initiative,
    getFullSchemaDefinitions: () => schema.value?.definitions,
  };
};
