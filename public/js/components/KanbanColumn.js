export const KanbanColumn = {
    props: {
        phase: String,
        initiatives: {
            type: Array,
            default: () => []
        },
        getPersonNameFn: Function,
        // appUtils is globally available, so we don't need to pass it as a prop
        // If it wasn't, we would pass appUtils.getPhaseClass as a prop too.
    },
    template: `
        <div class="bg-gray-100 rounded-lg p-4 w-80 md:w-96 flex-shrink-0 kanban-column">
            <h4 class="font-semibold text-gray-700 mb-3 text-center">{{ phase }} ({{ initiatives.length }})</h4>
            <div class="space-y-3">
                <div v-if="initiatives.length === 0" class="text-center text-gray-500 text-sm pt-4">
                    No initiatives in this phase.
                </div>
                <div v-for="init in initiatives" :key="init.iNNitiativeId"
                     class="bg-white p-3 rounded-md shadow-sm hover:shadow-lg cursor-pointer border border-gray-200 hover:border-blue-500 transition-all">
                    <p class="text-base font-medium text-blue-700 truncate mb-1" :title="init.iNNitiativeName">{{ init.iNNitiativeName }}</p>
                    <p v-if="init.iNNitiativeOwnerPersonId && getPersonNameFn" class="text-xs text-gray-600 truncate">
                        <i data-lucide="user-circle" class="w-3 h-3 inline-block mr-1 text-gray-400"></i>{{ getPersonNameFn(init.iNNitiativeOwnerPersonId) }}
                    </p>
                    <div class="mt-2 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <span class="text-xs text-gray-500">{{ init.iNNitiativeType }}</span>
                        <span :class="$appUtils.getPhaseClass(init.iNNitiativePhase)" class="status-badge text-xs">
                            {{ init.iNNitiativePhase }}
                        </span>
                    </div>
                </div>
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
