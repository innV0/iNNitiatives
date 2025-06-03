export const TabNavigation = {
    props: {
        tabs: {
            type: Array,
            default: () => []
        },
        activeTab: {
            type: String,
            default: ''
        }
    },
    template: `
        <nav class="bg-white border-b border-gray-200 sticky top-16 z-30">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex space-x-1 overflow-x-auto">
                    <button v-for="tab in tabs" :key="tab.id"
                            @click="selectTab(tab.id)"
                            :class="[
                                'flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
                                activeTab === tab.id
                                    ? 'bg-gray-50 text-blue-600 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            ]">
                        <i :data-lucide="tab.icon" class="w-4 h-4"></i>
                        <span>{{ tab.name }}</span>
                    </button>
                    <a href="https://docsify-this.net/?basePath=https://innv0.github.io/iNNitiatives/public&homepage=docs.md&sidebar=true#/" target="_blank" class="flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                        <i data-lucide="book" class="w-4 h-4"></i>
                        <span>Docs</span>
                    </a>
                </div>
            </div>
        </nav>
    `,
    methods: {
        selectTab(tabId) {
            this.$emit('update:activeTab', tabId);
        }
    },
    mounted() {
        // Ensure icons are rendered when the component mounts
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    },
    updated() {
        // Ensure icons are rendered when the component updates
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
};
