import { TableView } from './TableView.js';
import { ItemCard } from './ItemCard.js';
import { TableFilterControls } from './TableFilterControls.js';
import { APP_SCHEMA } from '../appSchema.js';

export const OpportunitiesView = {
    props: {
        opportunities: { type: Array, default: () => [] },
        peopleList: { type: Array, default: () => [] },
        programDefaultOpportunityStatuses: { type: Array, default: () => [] }, // from appData.program
        appSchemaOpportunityStatuses: {type: Array, default: () => []}, // Fallback from APP_SCHEMA directly
        getPersonNameFn: { type: Function, required: true },
        currentSortField: String,
        currentSortOrder: String,
        currentFilterField: String,
        currentFilterValue: String,
        viewMode: {
            type: String,
            default: 'table'
        }
    },
    components: { TableView, ItemCard, TableFilterControls },
    data() {
        return {};
    },
    computed: {
        // This computed property ensures that the filter controls always have a valid list of statuses.
        effectiveOpportunityStatuses() {
            if (this.programDefaultOpportunityStatuses && this.programDefaultOpportunityStatuses.length > 0) {
                return this.programDefaultOpportunityStatuses;
            }
            return this.appSchemaOpportunityStatuses;
        },
        tableFields() { return this.$root.generateFormFields(APP_SCHEMA.definitions.opportunity); }
    },
    emits: ['add-opportunity-requested', 'open-ai-modal-requested', 'toggle-view-mode', 'sort-requested', 'view-item-requested', 'edit-item-requested', 'delete-item-requested', 'filter-changed', 'clear-filter'],
    methods: {
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
                    <button @click="$emit('toggle-view-mode')" :title="viewMode === 'grid' ? 'Switch to table view' : 'Switch to grid view'" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                        <i :data-lucide="viewMode === 'grid' ? 'table' : 'layout-grid'" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <table-filter-controls
                :fields="tableFields"
                :model-value-field="currentFilterField"
                :model-value-value="currentFilterValue"
                :people-list="peopleList"
                :opportunities-list="opportunities"
                @update:modelValueField="$emit('filter-changed', { field: $event, value: currentFilterValue })"
                @update:modelValueValue="$emit('filter-changed', { field: currentFilterField, value: $event })"
                @clear-filter="$emit('clear-filter')"
            ></table-filter-controls>

            <div v-if="opportunities.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="search-x" class="w-8 h-8 text-gray-400"></i>
                </div>
                <p class="text-gray-600">No opportunities match your current filters or none have been added yet.</p>
            </div>

            <div v-else>
                <div v-if="viewMode === 'table'">
                    <table-view :items="opportunities" :fields="tableFields" app-data-section="opportunities" @view-item-requested="$emit('view-item-requested', $event)"></table-view>
                </div>
                <div v-else class="space-y-4">
                    <item-card
                        v-for="opp in opportunities"
                        :key="opp.opportunityId"
                        :item="opp"
                        type="opportunity"
                        :get-person-name-fn="getPersonNameFn"
                        @view-item-requested="$emit('view-item-requested', $event)"
                        @edit-item-requested="$emit('edit-item-requested', $event)"
                        @open-ai-modal-requested="$emit('open-ai-modal-requested', $event)"
                        @delete-item-requested="$emit('delete-item-requested', $event)">
                    </item-card>
                </div>
            </div>
        </section>
    `,
    
};
