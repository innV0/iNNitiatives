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

  const getSchemaProperty = (definitionName: string, propertyName: string) => {
    const definition = schema.value?.definitions?.[definitionName];
    if (definition && definition.properties) {
      return definition.properties[propertyName];
    }
    return undefined; // Or null, depending on desired return for not found
  };

  const getSchemaProperties = (definitionName: string) => {
    const definition = schema.value?.definitions?.[definitionName];
    if (!definition || !definition.properties) {
      return [];
    }
    const properties = definition.properties;
    return Object.keys(properties)
      .map(key => ({
        name: key,
        ...properties[key]
      }))
      .sort((a, b) => {
        const orderA = a['nn-order'] !== undefined ? a['nn-order'] : Infinity;
        const orderB = b['nn-order'] !== undefined ? b['nn-order'] : Infinity;
        return orderA - orderB;
      });
  };

  const getGroupedSchemaProperties = (definitionName: string) => {
    const sortedProperties = getSchemaProperties(definitionName); // Direct call
    if (!sortedProperties.length) {
      return {};
    }

    const grouped: { [key: string]: any[] } = {};
    sortedProperties.forEach(prop => {
      const groupName = prop['nn-group'] || '_ungrouped';
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(prop);
    });
    return grouped;
  };

  return {
    ...existingGetters, // Keep existing getters
    getSchemaProperty,
    getSchemaProperties,
    getGroupedSchemaProperties,
  };
};
