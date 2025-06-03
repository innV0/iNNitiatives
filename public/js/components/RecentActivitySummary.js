export const RecentActivitySummary = {
    props: {
        recentInitiatives: {
            type: Array,
            default: () => []
        }
        // appUtils is globally available
    },
    template: `
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i data-lucide="activity" class="w-5 h-5 mr-2 text-blue-600"></i>
                Recent Activity
            </h3>
            <div class="space-y-3">
                <div v-if="recentInitiatives.length === 0" class="text-sm text-gray-500">No recent activity to display.</div>
                <div v-for="initiative in recentInitiatives" :key="initiative.initiativeId" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div class="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div> <!-- Added flex-shrink-0 -->
                    <div class="flex-1 min-w-0"> <!-- Added min-w-0 for better truncation -->
                        <p class="text-gray-900 font-medium truncate" :title="initiative.initiativeName">{{ initiative.initiativeName }}</p>
                        <p class="text-gray-600 text-sm">Updated {{ $appUtils.formatDate(initiative.initiativeLastUpdated) }}</p>
                    </div>
                    <span :class="$appUtils.getPhaseClass(initiative.initiativePhase)" class="status-badge ml-2 flex-shrink-0"> <!-- Added ml-2 and flex-shrink-0 -->
                        {{ initiative.initiativePhase }}
                    </span>
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
