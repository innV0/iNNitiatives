export const OpportunityListItem = {
    props: {
        opportunity: {
            type: Object,
            required: true
        },
        getPersonNameFn: {
            type: Function,
            required: true
        }
        // appUtils is globally available via $appUtils
    },
    template: `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-150 card-hover">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
                <div class="flex-1 mb-3 md:mb-0 md:mr-4 min-w-0">
                    <h3 class="text-lg font-semibold text-blue-600 truncate" :title="opportunity.opportunityName">{{ opportunity.opportunityName || 'N/A' }}</h3>
                    <item-badge
                        class="mt-1"
                        :name="opportunity.opportunityId"
                        icon="hash"
                        :item="opportunity"
                        type="opportunity"
                        @view-item-requested="$emit('view-item-requested', $event)"
                    ></item-badge>
                </div>
                <div class="w-full md:w-1/4 text-sm text-gray-700 mb-2 md:mb-0 md:text-center truncate" :title="getPersonNameFn(opportunity.opportunityProposerId)">
                    {{ getPersonNameFn(opportunity.opportunityProposerId) }}
                </div>
                 <div class="w-full md:w-1/6 flex justify-start md:justify-center mb-3 md:mb-0">
                    <span :class="$appUtils.getPhaseClass(opportunity.opportunityStatus)" class="status-badge">
                        {{ opportunity.opportunityStatus || 'N/A' }}
                    </span>
                </div>
                <div class="w-full md:w-1/6 flex justify-start md:justify-center mb-3 md:mb-0">
                    <span :class="$appUtils.getPriorityClass(opportunity.opportunityPriority)" class="status-badge">
                        {{ opportunity.opportunityPriority !== undefined ? opportunity.opportunityPriority : 'N/A' }}
                    </span>
                </div>
                <div class="w-full md:w-1/6 flex justify-start md:justify-end space-x-2 items-center hover-actions"> <!-- Adjusted justify-start for mobile -->
                     <button @click="$emit('view-item-requested', { item: opportunity, type: 'opportunity' })" class="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors" title="View Opportunity">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                    </button>
                    <button @click="$emit('edit-item-requested', opportunity)" class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors" title="Edit Opportunity">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                    </button>
                    <button @click="$emit('open-ai-modal-requested', { contextType: 'opportunityItem', item: opportunity })" :title="'AI Assistant for ' + opportunity.opportunityName" class="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                    </button>
                    <button @click="$emit('delete-item-requested', opportunity.opportunityId)" class="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-colors" title="Delete Opportunity">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
            <div class="px-4 pb-3 pt-2 border-t border-gray-100" v-if="opportunity.opportunityDescription">
                 <p class="text-sm text-gray-600 leading-relaxed line-clamp-2">{{ opportunity.opportunityDescription }}</p>
            </div>
        </div>
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
