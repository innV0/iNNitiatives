export const OpportunitiesView = {
    props: {
        opportunities: { type: Array, default: () => [] },
        peopleList: { type: Array, default: () => [] },
        programDefaultOpportunityStatuses: { type: Array, default: () => [] }, // from appData.program
        appSchemaOpportunityStatuses: {type: Array, default: () => []}, // Fallback from APP_SCHEMA directly
        getPersonNameFn: { type: Function, required: true },
        currentSortField: String,
        currentSortOrder: String,
        initialFilterName: { type: String, default: '' },
        initialFilterProposerId: { type: String, default: '' },
        initialFilterStatus: { type: String, default: '' }
    },
    data() {
        return {
            filterName: this.initialFilterName,
            filterProposerId: this.initialFilterProposerId,
            filterStatus: this.initialFilterStatus
        };
    },
    computed: {
        // This computed property ensures that the filter controls always have a valid list of statuses.
        effectiveOpportunityStatuses() {
            if (this.programDefaultOpportunityStatuses && this.programDefaultOpportunityStatuses.length > 0) {
                return this.programDefaultOpportunityStatuses;
            }
            return this.appSchemaOpportunityStatuses;
        }
    },
    watch: {
        filterName(newValue) { this.$emit('filters-changed', { name: newValue, proposerId: this.filterProposerId, status: this.filterStatus }); },
        filterProposerId(newValue) { this.$emit('filters-changed', { name: this.filterName, proposerId: newValue, status: this.filterStatus }); },
        filterStatus(newValue) { this.$emit('filters-changed', { name: this.filterName, proposerId: this.filterProposerId, status: newValue }); },
        initialFilterName(newVal) { this.filterName = newVal; },
        initialFilterProposerId(newVal) { this.filterProposerId = newVal; },
        initialFilterStatus(newVal) { this.filterStatus = newVal; }
    },
    methods: {
        clearInternalFiltersAndEmit() {
            this.filterName = '';
            this.filterProposerId = '';
            this.filterStatus = '';
            this.$emit('filters-cleared'); // This will trigger the parent to clear its main filters
        },
        handleSortRequested(field) {
            this.$emit('sort-requested', field);
        }
        // Item-specific events are re-emitted directly in the template
    },
    template: `
        <section class="space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Opportunities</h2>
                    <p class="text-gray-600 mt-1">Discover and track innovation opportunities</p>
                </div>
                <div class="flex space-x-3">
                    <button @click="$emit('add-opportunity-requested')" class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>Add Opportunity</span>
                    </button>
                    <button @click="$emit('open-ai-modal-requested', { contextType: 'opportunityList', item: null })" title="AI Assistant for Opportunities List" class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                        <span>AI</span>
                    </button>
                </div>
            </div>

            <opportunities-filter-controls
                v-model:modelValueName="filterName"
                v-model:modelValueProposerId="filterProposerId"
                v-model:modelValueStatus="filterStatus"
                :people-list="peopleList"
                :program-default-opportunity-statuses="effectiveOpportunityStatuses"
                @clear-filters-requested="clearInternalFiltersAndEmit">
            </opportunities-filter-controls>

            <div v-if="opportunities.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="search-x" class="w-8 h-8 text-gray-400"></i>
                </div>
                <p class="text-gray-600">No opportunities match your current filters or none have been added yet.</p>
            </div>

            <div v-else class="space-y-3">
                <div class="flex justify-between items-center text-xs text-gray-500 font-medium px-3 py-2 border-b bg-gray-50 rounded-t-lg">
                    <div class="flex-1 cursor-pointer hover:text-gray-800" @click="handleSortRequested('opportunityName')">
                        Name
                        <i v-if="currentSortField === 'opportunityName'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-az' : 'arrow-down-za'" class="sort-icon"></i>
                    </div>
                    <div class="w-1/4 cursor-pointer hover:text-gray-800 text-center" @click="handleSortRequested('opportunityProposerId')">
                        Proposer
                         <i v-if="currentSortField === 'opportunityProposerId'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-az' : 'arrow-down-za'" class="sort-icon"></i>
                    </div>
                     <div class="w-1/6 cursor-pointer hover:text-gray-800 text-center" @click="handleSortRequested('opportunityStatus')">
                        Status
                        <i v-if="currentSortField === 'opportunityStatus'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-az' : 'arrow-down-za'" class="sort-icon"></i>
                    </div>
                    <div class="w-1/6 cursor-pointer hover:text-gray-800 text-center" @click="handleSortRequested('opportunityPriority')">
                        Priority
                        <i v-if="currentSortField === 'opportunityPriority'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-0-9' : 'arrow-down-9-0'" class="sort-icon"></i>
                    </div>
                    <div class="w-1/6 text-right">Actions</div>
                </div>

                <opportunity-list-item v-for="opp in opportunities" :key="opp.opportunityId"
                    :opportunity="opp"
                    :get-person-name-fn="getPersonNameFn"
                    @view-item-requested="$emit('view-item-requested', $event)"
                    @edit-item-requested="$emit('edit-item-requested', $event)"
                    @open-ai-modal-requested="$emit('open-ai-modal-requested', $event)"
                    @delete-item-requested="$emit('delete-item-requested', $event)">
                </opportunity-list-item>
            </div>
        </section>
    `,
    mounted() {
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    },
    updated() {
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
};
