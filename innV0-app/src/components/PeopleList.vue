<template>
  <div class="space-y-4">
    <div v-for="person in data" :key="person.personId" class="bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 ease-in-out p-6 flex items-center">
      <!-- Profile Picture/Avatar -->
      <img v-if="person.personImageUrl" :src="person.personImageUrl" alt="Profile Picture" class="w-16 h-16 rounded-full mr-6 object-cover border-2 border-gray-200">
      <div v-else class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-6 text-gray-500 font-semibold text-xl border-2 border-gray-200">
        {{ person.personName ? person.personName.charAt(0).toUpperCase() : '?' }}
      </div>

      <div class="flex-grow">
        <!-- Person Name -->
        <h3 class="text-xl font-semibold text-gray-900 mb-1">{{ person.personName || 'N/A' }}</h3>
        <!-- Person Role -->
        <p class="text-indigo-600 text-sm font-medium mb-2">{{ person.personRole || 'N/A' }}</p>
        <!-- Person Description -->
        <p class="text-gray-600 text-sm leading-relaxed">{{ person.personDescription || 'No description available.' }}</p>

        <!-- Dynamically render other properties if needed -->
        <!-- This would require a more sophisticated approach to decide which properties to show -->
        <!-- For now, we focus on the main ones as per description -->

      </div>
      <!-- Interactive elements -->
      <div class="flex flex-col space-y-2 ml-4">
        <button @click="viewPerson(person.personId)" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button @click="editPerson(person.personId)" class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-md text-xs transition duration-150 ease-in-out">
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
