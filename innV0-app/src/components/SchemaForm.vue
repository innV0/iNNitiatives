<script setup lang="ts">
import { defineProps, ref, watch, inject, computed } from 'vue';

// Define the props for the component
const props = defineProps({
  // The schema object for the current level of the form
  schema: {
    type: Object,
    required: true,
  },
  // The data object for the current level of the form
  data: {
    type: [Object, Array], // data can be an object or an array for array items
    required: true,
  },
  // Optional: The full schema definitions, needed for resolving $ref
  definitions: {
    type: Object,
    required: false,
  },
  // Optional: The key of the current property, used for labeling and identification
  propertyKey: {
    type: String,
    required: false,
  }
});

// Use inject to get the full schema definitions from a parent provider
const fullSchemaDefinitions = inject('fullSchemaDefinitions', props.definitions);

// Local reactive copy of data to emit changes
const formData = ref<any>(props.data);

// Watch for external changes to the data prop and update formData
watch(() => props.data, (newData) => {
  formData.value = newData;
}, { deep: true });

// Function to handle input changes and emit update
const handleInput = (key: string | number, value: any) => {
  if (formData.value && typeof formData.value === 'object') {
     formData.value[key] = value;
     // Emit an event to the parent component with the updated data
     // This is a simplified approach; a more robust solution might use provide/inject or a dedicated state management library
     // For this task, we'll assume a direct update is sufficient for now.
     // console.log(`Updating data for key "${key}":`, value); // Removed for final review
  }
};

// Function to handle adding a new item to an array
const addArrayItem = (arrayKey: string, itemSchema: any) => {
  if (formData.value && Array.isArray(formData.value[arrayKey])) {
    const newItem = initializeObjectFromSchema(itemSchema);
    formData.value[arrayKey].push(newItem);
    // console.log(`Added new item to array "${arrayKey}"`); // Removed for final review
  }
};

// Function to handle removing an item from an array
const removeArrayItem = (arrayKey: string, index: number) => {
   if (formData.value && Array.isArray(formData.value[arrayKey])) {
    formData.value[arrayKey].splice(index, 1);
    // console.log(`Removed item at index ${index} from array "${arrayKey}"`); // Removed for final review
  }
};


// Function to determine the input type based on schema property type and format
const getInputType = (property: any) => {
  if (property.format === 'textarea') {
    return 'textarea';
  }
  if (property.type === 'integer' || property.type === 'number') {
    return 'number';
  }
  if (property.type === 'string' && property.format === 'date') {
    return 'date';
  }
   if (property.type === 'string' && property.format === 'date-time') {
    return 'datetime-local';
  }
  if (property.type === 'string' && property.format === 'uri') {
    return 'url';
  }
  if (property.type === 'string') {
    return 'text';
  }
  // Add more type mappings as needed (e.g., boolean, array, object)
  return 'text'; // Default to text for now
};

// Function to get the title for a property
const getPropertyTitle = (key: string, property: any) => {
  return property.title || key;
};

// Function to get the description for a property
const getPropertyDescription = (property: any) => {
  return property.description;
};

// Function to check if a property should be visible based on nn-visible-if
const isVisible = (property: any) => {
  if (!property['nn-visible-if']) {
    return true;
  }
  const condition = property['nn-visible-if'];
  const fieldName = condition.field;
  const allowedValues = condition.in;

  // Check if the field exists in the current data and if its value is in the allowed values
  // Need to access the parent data for this check if the current schema is for a nested object or array item
  // For simplicity, this implementation assumes nn-visible-if refers to fields at the same level or parent level.
  // A more robust solution would require passing down the full data tree or using a state management solution.
   return formData.value && formData.value[fieldName] !== undefined && allowedValues.includes(formData.value[fieldName]);
};

// Helper function to recursively initialize objects based on schema definitions
const initializeObjectFromSchema = (schemaObject: any): any => {
  const initialData: any = {};
  if (!schemaObject || !schemaObject.properties) {
    return initialData; // Return empty object for invalid schema
  }
  for (const key in schemaObject.properties) {
    const property = schemaObject.properties[key];
      if (property.type === 'object') {
        if (property.$ref) {
          const definitionName = property.$ref.replace('#/definitions/', '');
           if (fullSchemaDefinitions && fullSchemaDefinitions[definitionName]) {
             initialData[key] = initializeObjectFromSchema(fullSchemaDefinitions[definitionName]);
           } else {
             initialData[key] = {};
           }
        } else {
           initialData[key] = {};
        }
      } else if (property.type === 'array') {
        initialData[key] = [];
      } else if (property.default !== undefined) {
        initialData[key] = property.default;
      } else {
        initialData[key] = null; // Or a more appropriate default based on type
      }
    }
  return initialData;
};

// Function to get the item schema for an array
const getArrayItemSchema = (arraySchema: any): any => {
  if (!arraySchema || !arraySchema.items) {
    return {}; // Return empty schema if items is missing
  }

  if (arraySchema.items.$ref) {
    const definitionName = arraySchema.items.$ref.replace('#/definitions/', '');
    return fullSchemaDefinitions?.value ? fullSchemaDefinitions.value[definitionName] || {} : {}; // Resolve $ref or return empty
  }

  return arraySchema.items; // Return inline schema
};

// Computed property to get properties sorted by nn-order and grouped by nn-group
const sortedAndGroupedProperties = computed(() => {
  if (!props.schema || !props.schema.properties) {
    return {};
  }

  const properties = Object.entries(props.schema.properties);

  // Group properties by nn-group
  const grouped: { [key: string]: [string, any][] } = {};
  let ungrouped: [string, any][] = [];

  properties.forEach(([key, property]) => {
    const group = property['nn-group'] || 'General'; // Default group
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

</script>

<template>
  <div class="space-y-6">
    <div v-for="(properties, groupName) in sortedAndGroupedProperties" :key="groupName">
      <h2 v-if="groupName !== 'General'" class="text-xl font-semibold mb-4">{{ groupName }}</h2>
      <div class="space-y-4">
        <div v-for="([key, property]) in properties" :key="key">
          <div v-if="isVisible(property)">
            <label :for="key as string" class="block text-sm font-medium text-gray-700 mb-1">{{ getPropertyTitle(key as string, property) }}</label>
            <p v-if="getPropertyDescription(property)" class="text-xs text-gray-500 mt-1">{{ getPropertyDescription(property) }}</p>
            <p v-if="property['nn-tag']" class="mt-1 text-xs text-gray-500">Tags: {{ Array.isArray(property['nn-tag']) ? property['nn-tag'].join(', ') : property['nn-tag'] }}</p>
            <p v-if="property['nn-source']" class="mt-1 text-xs text-gray-500">Source: {{ property['nn-source'] }}</p>

            <div v-if="property.type === 'object'">
              <!-- Recursively render nested objects -->
              <fieldset class="border border-gray-300 p-4 rounded-md space-y-4 mt-2">
                <legend class="text-sm font-medium text-gray-700 px-1">{{ getPropertyTitle(key as string, property) }}</legend>
                <SchemaForm :schema="property.$ref ? fullSchemaDefinitions[property.$ref.replace('#/definitions/', '')] : property" :data="formData[key]" :definitions="fullSchemaDefinitions" :propertyKey="key as string" />
              </fieldset>
            </div>

            <div v-else-if="property.type === 'array'">
              <!-- Handle arrays -->
              <fieldset class="border border-gray-300 p-4 rounded-md space-y-4 mt-2">
                <legend class="text-lg font-semibold mb-2 px-1">{{ getPropertyTitle(key as string, property) }}</legend>
                <div v-for="(item, index) in formData[key]" :key="index" class="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                  <!-- Recursively render array items -->
                  <SchemaForm :schema="getArrayItemSchema(property)" :data="item" :definitions="fullSchemaDefinitions" :propertyKey="`${key}[${index}]`" />
                  <button type="button" @click="removeArrayItem(key as string, index)" class="mt-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-150 ease-in-out">Remove</button>
                </div>
                <button type="button" @click="addArrayItem(key as string, getArrayItemSchema(property))" class="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-md text-xs transition duration-150 ease-in-out">Add Item</button>
              </fieldset>
            </div>

            <div v-else-if="property.enum">
              <!-- Handle enums (dropdown) -->
              <select
                :id="key as string"
                :value="formData[key]"
                @change="handleInput(key as string, ($event.target as HTMLSelectElement).value)"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
                :disabled="property.readonly"
              >
                <option v-for="option in property.enum" :key="option" :value="option">{{ option }}</option>
              </select>
            </div>

            <div v-else>
              <!-- Handle basic input types -->
              <input
                v-if="getInputType(property) !== 'textarea'"
                :type="getInputType(property)"
                :id="key as string"
                :value="formData[key]"
                @input="handleInput(key as string, ($event.target as HTMLInputElement).value)"
                :disabled="property.readonly"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              />
               <textarea
                v-else
                :id="key as string"
                :value="formData[key]"
                @input="handleInput(key as string, ($event.target as HTMLTextAreaElement).value)"
                :disabled="property.readonly"
                rows="3"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

