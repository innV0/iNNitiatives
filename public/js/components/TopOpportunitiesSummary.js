export const TopOpportunitiesSummary = {
    props: {
        topOpportunities: {
            type: Array,
            default: () => []
        },
        getPersonNameFn: Function
        // appUtils is globally available
    },
    template: `
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i data-lucide="trending-up" class="w-5 h-5 mr-2 text-yellow-600"></i>
                Top Priority Opportunities
            </h3>
            <div class="space-y-3">
                <div v-if="topOpportunities.length === 0" class="text-sm text-gray-500">No opportunities to display.</div>
                <div v-for="opp in topOpportunities" :key="opp.opportunityId" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div class="flex-1 min-w-0"> <!-- Added min-w-0 for better truncation -->
                        <p class="text-sm font-medium text-gray-900 truncate" :title="opp.opportunityName">{{ opp.opportunityName }}</p>
                        <p v-if="getPersonNameFn" class="text-xs text-gray-600 truncate" :title="getPersonNameFn(opp.opportunityProposerId)">
                            {{ getPersonNameFn(opp.opportunityProposerId) }}
                        </p>
                    </div>
                    <span :class="$appUtils.getPriorityClass(opp.opportunityPriority)" class="status-badge ml-2 flex-shrink-0"> <!-- Added ml-2 and flex-shrink-0 -->
                        {{ opp.opportunityPriority }}
                    </span>
                </div>
            </div>
        </div>
    `,

};
