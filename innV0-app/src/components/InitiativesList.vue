<template>
  <div class="space-y-4">
    <div v-for="initiative in data" :key="initiative.initiativeId" class="border border-gray-300 bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <!-- Dynamically render properties based on schema -->
      <div v-if="schema && schema.properties" class="flex-grow mr-4">
        <!-- Initiative Name -->
        <h3 class="text-lg font-semibold text-gray-800">{{ initiative.initiativeName || 'N/A' }}</h3>

        <div class="mt-1 flex items-center space-x-2 text-sm text-gray-600">
          <!-- Initiative Type Tag (dynamically styled) -->
          <span
            v-if="initiative.initiativeType"
            class="px-2 py-1 text-xs font-semibold rounded"
            :class="getTypeClass(initiative.initiativeType)"
          >
            {{ initiative.initiativeType }}
          </span>

          <!-- Initiative Phase Tag (dynamically styled) -->
           <span
            v-if="initiative.initiativePhase"
            class="px-2 py-1 text-xs font-semibold rounded"
            :class="getPhaseClass(initiative.initiativePhase)"
          >
            {{ initiative.initiativePhase }}
          </span>
        </div>

        <!-- Initiative Description (truncated) -->
        <p class="text-gray-600 text-sm mt-2">{{ initiative.initiativeDescription ? initiative.initiativeDescription.substring(0, 150) + '...' : 'No description available.' }}</p>

        <div class="mt-3 text-sm text-gray-700">
          <!-- Initiative Budget -->
          <div v-if="initiative.initiativeBudget !== undefined" class="flex items-center">
            <span class="font-semibold mr-1">Budget:</span> {{ initiative.initiativeBudget }}
          </div>
          <!-- Initiative Timeline -->
          <div v-if="initiative.initiativeTimeline" class="flex items-center mt-1">
            <span class="font-semibold mr-1">Timeline:</span> {{ initiative.initiativeTimeline }}
          </div>
        </div>

        <!-- Dynamically render other basic properties if needed -->
        <!-- This would require a more sophisticated approach to decide which properties to show -->

      </div>
      <!-- Interactive elements -->
      <div class="flex flex-col space-y-2 mt-4 sm:mt-0">
        <button @click="viewInitiative(initiative.initiativeId)" class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button @click="editInitiative(initiative.initiativeId)" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded text-xs transition duration-150 ease-in-out">
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

const viewInitiative = (initiativeId: string) => {
  router.push({ name: 'InitiativeDetailView', params: { id: initiativeId } });
};

const editInitiative = (initiativeId: string) => {
  router.push({ name: 'InitiativeEditView', params: { id: initiativeId } });
};


// Helper function to get type class (can be made more dynamic based on schema later)
const getTypeClass = (type: string) => {
  switch (type) {
    case 'New Product Development':
      return 'bg-blue-200 text-blue-800';
    case 'Process Improvement':
      return 'bg-green-200 text-green-800';
    case 'Technology Exploration':
      return 'bg-purple-200 text-purple-800';
    case 'Market Research':
      return 'bg-yellow-200 text-yellow-800';
    case 'Partnership Development':
      return 'bg-indigo-200 text-indigo-800';
    case 'Platform Enhancement':
      return 'bg-pink-200 text-pink-800';
    case 'Sustainability Initiative':
      return 'bg-teal-200 text-teal-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

// Helper function to get phase class (can be made more dynamic based on schema later)
const getPhaseClass = (phase: string) => {
   switch (phase) {
    case 'Idea Definition':
      return 'bg-gray-400 text-gray-800'; // Gray for early phase
    case 'Concept Design':
      return 'bg-blue-200 text-blue-800';
    case 'Prototype Development':
      return 'bg-purple-200 text-purple-800';
    case 'Validation':
      return 'bg-yellow-200 text-yellow-800';
    case 'Pilot Testing':
      return 'bg-green-200 text-green-800';
    case 'Launched':
      return 'bg-teal-200 text-teal-800';
    case 'Scaling':
      return 'bg-indigo-200 text-indigo-800';
    case 'On Hold':
      return 'bg-orange-200 text-orange-800';
    case 'Cancelled':
      return 'bg-red-200 text-red-800';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

</script>

<style scoped>
/* Component-specific styles */
</style>
