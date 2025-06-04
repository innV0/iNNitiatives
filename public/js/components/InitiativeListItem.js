export const InitiativeListItem = {
    props: ['initiative', 'getPersonNameFn'],
    emits: ['view-item-requested', 'edit-item-requested', 'open-ai-modal-requested', 'delete-item-requested'],
    template: `
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm initiative-card p-6 card-hover">
            <div class="flex flex-col md:flex-row justify-between md:items-start">
                <div class="flex-1 mb-4 md:mb-0 md:mr-6 min-w-0"> <!-- Added min-w-0 for better truncation if names are long -->
                    <div class="flex items-center mb-2">
                        <h3 class="text-xl font-semibold text-blue-700 mr-3 truncate" :title="initiative.initiativeName">{{ initiative.initiativeName || 'N/A' }}</h3>
                        <span :class="$appUtils.getPhaseClass(initiative.initiativePhase)" class="status-badge flex-shrink-0"> <!-- Added flex-shrink-0 -->
                            {{ initiative.initiativePhase }}
                        </span>
                    </div>
                    <p class="text-sm text-gray-500 mb-1">Type: <span class="font-medium text-gray-700">{{ initiative.initiativeType }}</span></p>
                    <p class="text-sm text-gray-500 mb-1">Manager:
                        <item-badge
                            :name="getPersonNameFn(initiative.initiativeManagerId)"
                            icon="user"
                            :item="{ personId: initiative.initiativeManagerId, personName: getPersonNameFn(initiative.initiativeManagerId) }"
                            type="person"
                            @view-item-requested="$emit('view-item-requested', $event)"
                        ></item-badge>
                    </p>
                    <p class="text-sm text-gray-500">Budget: <span class="font-medium text-gray-700">€{{ $appUtils.formatNumber(initiative.initiativeBudget) }}</span></p>
                    <p v-if="initiative.initiativeObjective" class="text-sm text-gray-600 mt-2 line-clamp-2">{{ initiative.initiativeObjective }}</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 flex-shrink-0 hover-actions">
                    <button @click="$emit('view-item-requested', { item: initiative, type: 'initiative' })" class="w-full md:w-auto flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors" title="View Initiative">
                        <i data-lucide="eye" class="w-4 h-4"></i>
                        <span>View</span>
                    </button>
                    <button @click="$emit('edit-item-requested', initiative)" class="w-full md:w-auto flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors" title="Edit Initiative">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                        <span>Edit</span>
                    </button>
                    <button @click="$emit('open-ai-modal-requested', { contextType: 'initiativeItem', item: initiative })" :title="'AI Assistant for ' + initiative.initiativeName" class="w-full md:w-auto flex items-center justify-center space-x-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                        <span>AI</span>
                    </button>
                    <button @click="$emit('delete-item-requested', initiative.initiativeId)" class="w-full md:w-auto flex items-center justify-center space-x-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-red-200" title="Delete Initiative">
                        <i data-lucide="trash-2" class="w-4 h-4"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        </div>
    `,
    mounted() { // Added mounted and updated for Lucide icons, as they are good practice for components with icons
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
