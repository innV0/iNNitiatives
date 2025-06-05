export const DashboardView = {
    props: {
        appData: Object,
        isEmptyData: Boolean,
        iNNitiativePhasesSummary: Array, // Renamed from iNNitiativePhases in main app
        kanbanPhases: Array,
        summaryCards: Array,
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
                    <stats-card v-for="card in summaryCards" :key="card.title"
                        :title="card.title" :value="card.value" :icon="card.icon"
                        :color-theme="card.colorTheme" :target-tab="card.targetTab"
                        @card-clicked="$emit('set-active-tab', $event)"></stats-card>
                </div>

            </div>
        </section>
    `,

};
