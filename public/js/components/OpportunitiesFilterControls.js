export const OpportunitiesFilterControls = {
    props: {
        modelValueName: String,
        modelValueProposerId: String,
        modelValueStatus: String,
        peopleList: {
            type: Array,
            default: () => []
        },
        programDefaultOpportunityStatuses: { // This will come from appData.program.programDefaultOpportunityStatuses
            type: Array,
            default: () => []
        },
        // APP_SCHEMA is globally available in app.js, but not directly in components unless passed or accessed via provide/inject or global properties.
        // For simplicity, we will rely on programDefaultOpportunityStatuses from props, or pass APP_SCHEMA.definitions.opportunity.properties.opportunityStatus.enum as a prop if needed.
        // Here, assuming programDefaultOpportunityStatuses will be populated correctly.
         // If programDefaultOpportunityStatuses is empty, we might need a fallback or ensure it's always provided.
        // For this iteration, the component will use what's passed or an empty array.
    },
    emits: ['update:modelValueName', 'update:modelValueProposerId', 'update:modelValueStatus', 'clear-filters-requested'],
    computed: {
        opportunityStatuses() {
            if (this.programDefaultOpportunityStatuses && this.programDefaultOpportunityStatuses.length > 0) {
                return this.programDefaultOpportunityStatuses;
            }
            // Fallback if not provided by program (though APP_SCHEMA is not directly accessible here easily)
            // This part shows a limitation. Ideally, APP_SCHEMA should be accessed via a global store or provide/inject.
            // For now, this component will heavily rely on `programDefaultOpportunityStatuses` prop.
            // A more robust solution would involve passing the schema's enum as a prop if needed.
            // Or, the parent `OpportunitiesView` can compute this list and pass it.
            // For this iteration, we'll assume `programDefaultOpportunityStatuses` is sufficient or the parent handles the fallback.
            return [];
        }
    },
    template: `
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
            <div class="flex-grow">
                <label for="oppFilterName" class="block text-sm font-medium text-gray-700">Filter by Name</label>
                <input type="text" :value="modelValueName" @input="$emit('update:modelValueName', $event.target.value)" id="oppFilterName" class="form-input mt-1 block w-full" placeholder="Enter name...">
            </div>
            <div class="flex-grow">
                <label for="oppFilterProposer" class="block text-sm font-medium text-gray-700">Filter by Proposer</label>
                <select :value="modelValueProposerId" @change="$emit('update:modelValueProposerId', $event.target.value)" id="oppFilterProposer" class="form-select mt-1 block w-full">
                    <option value="">All Proposers</option>
                    <option v-for="person in peopleList" :key="person.personId" :value="person.personId">{{ person.personName }}</option>
                </select>
            </div>
            <div class="flex-grow">
                <label for="oppFilterStatus" class="block text-sm font-medium text-gray-700">Filter by Status</label>
                 <select :value="modelValueStatus" @change="$emit('update:modelValueStatus', $event.target.value)" id="oppFilterStatus" class="form-select mt-1 block w-full">
                    <option value="">All Statuses</option>
                    <option v-for="status in opportunityStatuses" :key="status" :value="status">{{ status }}</option>
                </select>
            </div>
            <button @click="$emit('clear-filters-requested')" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300 w-full md:w-auto">
                Clear Filters
            </button>
        </div>
    `
};
