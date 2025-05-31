<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="opportunity in data"
      :key="opportunity.opportunityId"
      class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 ease-in-out flex flex-col">

      <div class="p-6 flex-grow">
        <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ opportunity.opportunityName || 'N/A' }}</h3>
        <p class="text-slate-600 text-sm mb-3 leading-relaxed">
          {{ opportunity.opportunityDescription ? (opportunity.opportunityDescription.length > 120 ? opportunity.opportunityDescription.substring(0, 117) + '...' : opportunity.opportunityDescription) : 'No description available.' }}
        </p>

        <div class="mt-auto pt-3 flex flex-wrap items-center gap-2">
          <!-- Status Tag -->
          <span
            v-if="opportunity.opportunityStatus"
            class="px-2.5 py-0.5 text-xs font-medium rounded-full"
            :class="getStatusClass(opportunity.opportunityStatus)"
          >
            {{ opportunity.opportunityStatus }}
          </span>

          <!-- Priority Tag -->
           <span
            v-if="opportunity.opportunityPriority !== undefined && opportunity.opportunityPriority !== null"
            class="px-2.5 py-0.5 text-xs font-medium rounded-full"
            :class="getPriorityClass(opportunity.opportunityPriority)"
          >
            Priority: {{ opportunity.opportunityPriority }}
          </span>
        </div>
      </div>

      <!-- Interactive elements -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
        <button
          @click="viewOpportunity(opportunity.opportunityId)"
          class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-md text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button
          @click="editOpportunity(opportunity.opportunityId)"
          class="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-2 px-3 rounded-md text-xs transition duration-150 ease-in-out">
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


// Helper function to get status class
const getStatusClass = (status: string) => {
  switch (status) {
    case 'Identified':
      return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'Under Review':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Prioritized':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'Archived':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    default:
      return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
};

// Helper function to get priority class
const getPriorityClass = (priority: number) => {
   if (priority >= 8) return 'bg-rose-100 text-rose-700 border border-rose-200';
   if (priority >= 5) return 'bg-amber-100 text-amber-700 border border-amber-200';
   if (priority >= 0) return 'bg-lime-100 text-lime-700 border border-lime-200';
   return 'bg-slate-100 text-slate-500 border border-slate-200';
};

</script>

<style scoped>
/* Component-specific styles if needed */
</style>
