export const DashboardView = {
    props: {
        appData: Object,
        isEmptyData: Boolean,
        iNNitiativePhasesSummary: Array, // Renamed from iNNitiativePhases in main app
        kanbanPhases: Array,
        initiativesByPhase: Object,
        topOpportunities: Array,
        recentInitiatives: Array,
        getPersonNameFn: Function,
        getPersonAvatarFn: Function,
        getPersonInitiativeCountFn: Function
    },
    components: {
        // Child components will be registered globally in app.js,
        // so no local registration needed here if that's the case.
        // If we wanted local registration:
        // 'stats-card': StatsCard,
        // 'kanban-column': KanbanColumn,
        // ...etc
    },
    template: `
        <section class="space-y-8">
            <div v-if="isEmptyData" class="text-center py-16">
                <div class="bg-gray-50 rounded-2xl p-12 border border-gray-200">
                    <img src="https://innv0.com/assets/innv0_logo.svg" alt="iNNitiatives Logo" class="w-12 h-12 mx-auto mb-4"> <!-- Added mx-auto and mb-4 -->
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Welcome to iNNitiatives!</h2>
                    <p class="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">Transform your innovation management with our comprehensive platform. Track ideas, manage teams, and drive breakthrough initiatives.</p>
                    <div class="flex flex-col sm:flex-row gap-4 justify-center">
                        <button @click="$emit('trigger-load-data')" class="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                            <i data-lucide="upload" class="w-5 h-5"></i>
                            <span>Load Your Data</span>
                        </button>
                        <button @click="$emit('trigger-load-sample-data')" class="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors">
                            <i data-lucide="play" class="w-5 h-5"></i>
                            <span>Try Sample Data</span>
                        </button>
                    </div>
                    <p class="text-gray-500 text-sm mt-6">Upload a JSON file conforming to the iNNitiatives schema</p>
                </div>
            </div>
            <div v-else class="space-y-8">
                <!-- Stats Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <stats-card title="Team Members" :value="appData.people.length" icon="users" color-theme="green" target-tab="people" @card-clicked="$emit('set-active-tab', $event)"></stats-card>
                    <stats-card title="Opportunities" :value="appData.opportunities.length" icon="lightbulb" color-theme="yellow" target-tab="opportunities" @card-clicked="$emit('set-active-tab', $event)"></stats-card>
                    <stats-card title="Active Initiatives" :value="appData.initiatives.length" icon="zap" color-theme="purple" target-tab="initiatives" @card-clicked="$emit('set-active-tab', $event)"></stats-card>
                </div>

                <!-- Kanban Board Section -->
                <div class="mt-8">
                    <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <i data-lucide="columns" class="w-5 h-5 mr-2 text-indigo-600"></i>
                        Initiative Progress (Kanban)
                    </h3>
                    <div class="flex space-x-4 overflow-x-auto pb-4">
                        <kanban-column v-for="phase in kanbanPhases" :key="phase"
                            :phase="phase"
                            :initiatives="initiativesByPhase[phase] || []"
                            :get-person-name-fn="getPersonNameFn">
                        </kanban-column>
                    </div>
                </div>

                <!-- Overview Sections -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <initiatives-by-phase-summary :initiative-phases-summary="iNNitiativePhasesSummary"></initiatives-by-phase-summary>
                    <top-opportunities-summary :top-opportunities="topOpportunities" :get-person-name-fn="getPersonNameFn"></top-opportunities-summary>
                </div>

                <team-overview-summary :team-members="appData.people.slice(0, 6)" :get-person-avatar-fn="getPersonAvatarFn" :get-person-initiative-count-fn="getPersonInitiativeCountFn"></team-overview-summary>
                <recent-activity-summary :recent-initiatives="recentInitiatives"></recent-activity-summary>
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
        // This is important to re-render icons if data changes and v-if/v-for blocks are affected
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
};
