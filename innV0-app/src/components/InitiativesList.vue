<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="initiative in data"
      :key="initiative.initiativeId"
      class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 ease-in-out flex flex-col">

      <div class="p-6 flex-grow">
        <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ initiative.initiativeName || 'N/A' }}</h3>

        <p class="text-slate-600 text-sm mb-3 leading-relaxed">
          {{ initiative.initiativeDescription ? (initiative.initiativeDescription.length > 120 ? initiative.initiativeDescription.substring(0, 117) + '...' : initiative.initiativeDescription) : 'No description available.' }}
        </p>

        <div class="mt-auto pt-3 flex flex-wrap items-center gap-2">
          <!-- Initiative Type Tag -->
          <span
            v-if="initiative.initiativeType"
            class="px-2.5 py-0.5 text-xs font-medium rounded-full"
            :class="getTypeClass(initiative.initiativeType)"
          >
            {{ initiative.initiativeType }}
          </span>

          <!-- Initiative Phase Tag -->
           <span
            v-if="initiative.initiativePhase"
            class="px-2.5 py-0.5 text-xs font-medium rounded-full"
            :class="getPhaseClass(initiative.initiativePhase)"
          >
            {{ initiative.initiativePhase }}
          </span>
        </div>
      </div>

      <!-- Interactive elements -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
        <button
          @click="viewInitiative(initiative.initiativeId)"
          class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-md text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button
          @click="editInitiative(initiative.initiativeId)"
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

const viewInitiative = (initiativeId: string) => {
  router.push({ name: 'InitiativeDetailView', params: { id: initiativeId } });
};

const editInitiative = (initiativeId: string) => {
  router.push({ name: 'InitiativeEditView', params: { id: initiativeId } });
};


// Helper function to get type class
const getTypeClass = (type: string) => {
  // Using a more generic approach for diverse types, can be expanded
  const colors = [
    'bg-sky-100 text-sky-700 border border-sky-200',
    'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'bg-violet-100 text-violet-700 border border-violet-200',
    'bg-amber-100 text-amber-700 border border-amber-200',
    'bg-indigo-100 text-indigo-700 border border-indigo-200',
    'bg-pink-100 text-pink-700 border border-pink-200',
    'bg-lime-100 text-lime-700 border border-lime-200',
  ];
  // Simple hash function to pick a color based on type string
  let hash = 0;
  for (let i = 0; i < type.length; i++) {
    hash = type.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length] || 'bg-slate-100 text-slate-600 border border-slate-200';
};

// Helper function to get phase class
const getPhaseClass = (phase: string) => {
   switch (phase) {
    case 'Idea Definition':
      return 'bg-slate-100 text-slate-600 border border-slate-200';
    case 'Concept Design':
      return 'bg-sky-100 text-sky-700 border border-sky-200';
    case 'Prototype Development':
      return 'bg-violet-100 text-violet-700 border border-violet-200';
    case 'Validation':
      return 'bg-amber-100 text-amber-700 border border-amber-200';
    case 'Pilot Testing':
      return 'bg-lime-100 text-lime-700 border border-lime-200';
    case 'Launched':
      return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
    case 'Scaling':
      return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
    case 'On Hold':
      return 'bg-orange-100 text-orange-700 border border-orange-200'; // Assuming orange is available or use amber/yellow
    case 'Cancelled':
      return 'bg-rose-100 text-rose-700 border border-rose-200';
    default:
      return 'bg-slate-100 text-slate-500 border border-slate-200';
  }
};

</script>

<style scoped>
/* Component-specific styles if needed */
</style>
