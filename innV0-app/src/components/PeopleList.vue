<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div
      v-for="person in data"
      :key="person.personId"
      class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200 ease-in-out flex flex-col">

      <div class="p-6 flex-grow">
        <div class="flex items-start">
          <!-- Profile Picture/Avatar -->
          <div class="mr-4 flex-shrink-0">
            <img
              v-if="person.personImageUrl"
              :src="person.personImageUrl"
              alt="Profile Picture"
              class="w-16 h-16 rounded-full object-cover border-2 border-slate-200">
            <div
              v-else
              class="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-semibold text-2xl border-2 border-slate-300">
              {{ person.personName ? person.personName.charAt(0).toUpperCase() : '?' }}
            </div>
          </div>

          <div class="flex-grow">
            <!-- Person Name -->
            <h3 class="text-xl font-semibold text-slate-800 mb-1">{{ person.personName || 'N/A' }}</h3>
            <!-- Person Role -->
            <p class="text-sky-600 text-sm font-medium mb-2">{{ person.personRole || 'N/A' }}</p>
          </div>
        </div>

        <!-- Person Description -->
        <p class="text-slate-600 text-sm leading-relaxed mt-3">
          {{ person.personDescription ? (person.personDescription.length > 150 ? person.personDescription.substring(0, 147) + '...' : person.personDescription) : 'No description available.' }}
        </p>
      </div>

      <!-- Interactive elements -->
      <div class="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-2">
        <button
          @click="viewPerson(person.personId)"
          class="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 px-3 rounded-md text-xs transition duration-150 ease-in-out">
          View
        </button>
        <button
          @click="editPerson(person.personId)"
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
