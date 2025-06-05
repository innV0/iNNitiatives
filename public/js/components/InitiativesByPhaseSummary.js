export const InitiativesByPhaseSummary = {
    props: {
        iNNitiativePhasesSummary: {
            type: Array,
            default: () => []
        }
        // appUtils is globally available
    },
    template: `
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i data-lucide="pie-chart" class="w-5 h-5 mr-2 text-blue-600"></i>
                Initiatives by Phase Summary
            </h3>
            <div class="space-y-3">
                <div v-if="iNNitiativePhasesSummary.length === 0" class="text-sm text-gray-500">No initiative data to display.</div>
                <div v-for="phase in iNNitiativePhasesSummary" :key="phase.name" class="flex items-center justify-between">
                    <div class="flex items-center space-x-3">
                        <div :class="['w-3', 'h-3', 'rounded-full', $appUtils.getPhaseColor(phase.name)]"></div>
                        <span class="text-sm text-gray-700">{{ phase.name }}</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900">{{ phase.count }}</span>
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
