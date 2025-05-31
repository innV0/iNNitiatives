<template>
  <div class="space-y-4">
    <div v-for="opportunity in data" :key="opportunity.opportunityId" class="border border-gray-300 bg-white p-4 rounded-md shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between">
      <!-- Dynamically render properties based on schema -->
      <div v-if="schema && schema.properties" class="flex-grow mr-4">
        <!-- Opportunity Name -->
        <h3 class="text-lg font-semibold text-gray-800">{{ opportunity.opportunityName || 'N/A' }}</h3>

        <!-- Opportunity Description (truncated) -->
        <p class="text-gray-600 text-sm mt-1">{{ opportunity.opportunityDescription ? opportunity.opportunityDescription.substring(0, 150) + '...' : 'No description available.' }}</p>

        <div class="mt-2 flex items-center space-x-2">
          <!-- Status Tag (dynamically styled) -->
          <span
            v-if="opportunity.opportunityStatus"
            class="px-2 py-1 text-xs font-semibold rounded"
            :class="getStatusClass(opportunity.opportunityStatus)"
          >
            {{ opportunity.opportunityStatus }}
          </span>

          <!-- Priority Tag (dynamically styled) -->
           <span
            v-if="opportunity.opportunityPriority !== undefined"
            class="px-2 py-1 text-xs font-semibold rounded"
            :class="getPriorityClass(opportunity.opportunityPriority)"
          >
            Priority: {{ opportunity.opportunityPriority }}
          </span>
        </div>

        <!-- Dynamically render other basic properties if needed -->
        <!-- This would require a more sophisticated approach to decide which properties to show -->

      </div>
      <!-- Interactive elements -->
      <div class="flex flex-col space-y-2 mt-4 sm:mt-0">
        <button @click="viewOpportunity(opportunity.opportunityId)" class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-1 px-2 rounded text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button @click="editOpportunity(opportunity.opportunityId)" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-2 rounded text-xs transition duration-150 ease-in-out">
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

const viewOpportunity = (opportunityId: string) => {
  router.push({ name: 'OpportunityDetailView', params: { id: opportunityId } });
};

const editOpportunity = (opportunityId: string) => {
  router.push({ name: 'OpportunityEditView', params: { id: opportunityId } });
};


// Helper function to get status class (can be made more dynamic based on schema later)
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Identified':
      return 'bg-blue-200 text-blue-800'; // Using blue for identified
    case 'Under Review':
      return 'bg-yellow-200 text-yellow-800'; // Using yellow for under review
    case 'Prioritized':
      return 'bg-green-200 text-green-800'; // Using green for prioritized
    case 'Archived':
      return 'bg-gray-400 text-gray-800'; // Using gray for archived
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

// Helper function to get priority class (can be made more dynamic based on schema later)
const getPriorityClass = (priority: number) => {
   if (priority >= 8) return 'bg-red-200 text-red-800'; // High priority in red
   if (priority >= 5) return 'bg-yellow-200 text-yellow-800'; // Medium priority in yellow
   if (priority >= 0) return 'bg-green-200 text-green-800'; // Low priority in green
   return 'bg-gray-200 text-gray-800';
};

</script>

<style scoped>
/* Component-specific styles */
</style>
