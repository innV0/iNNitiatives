<template>
  <div class="space-y-4">
    <div v-for="person in data" :key="person.personId" class="border border-gray-300 bg-white p-4 rounded-md shadow-sm flex items-center">
      <!-- Profile Picture/Avatar -->
      <img v-if="person.personImageUrl" :src="person.personImageUrl" alt="Profile Picture" class="w-12 h-12 rounded-full mr-4 object-cover">
      <div v-else class="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center mr-4 text-gray-600 font-bold text-lg">
        {{ person.personName ? person.personName.charAt(0).toUpperCase() : '?' }}
      </div>

      <div class="flex-grow">
        <!-- Person Name -->
        <h3 class="text-lg font-semibold text-gray-800">{{ person.personName || 'N/A' }}</h3>
        <!-- Person Role -->
        <p class="text-gray-600 text-sm">{{ person.personRole || 'N/A' }}</p>
        <!-- Person Description (truncated) -->
        <p class="text-gray-500 text-xs mt-1">{{ person.personDescription ? person.personDescription.substring(0, 100) + '...' : 'No description available.' }}</p>

        <!-- Dynamically render other properties if needed -->
        <!-- This would require a more sophisticated approach to decide which properties to show -->
        <!-- For now, we focus on the main ones as per description -->

      </div>
      <!-- Interactive elements -->
      <div class="flex flex-col space-y-2 ml-4">
        <button @click="viewPerson(person.personId)" class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button @click="editPerson(person.personId)" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded text-xs transition duration-150 ease-in-out">
          Edit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps({
  schema: {
    type: Object,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
});

const router = useRouter();

const viewPerson = (personId: string) => {
  router.push({ name: 'PersonDetailView', params: { id: personId } });
};

const editPerson = (personId: string) => {
  router.push({ name: 'PersonEditView', params: { id: personId } });
};

// Note: With this approach, we are explicitly referencing property names
// like 'personName', 'personRole', etc. To make this truly dynamic based on
// schema properties for display in a card, we would need a convention
// in the schema (e.g., a custom 'nn-card-display' property) or a mapping
// configuration passed to this component. For now, this implements the
// described card layout using known property names from the 'person' schema.

</script>

<style scoped>
/* Component-specific styles */
</style>
