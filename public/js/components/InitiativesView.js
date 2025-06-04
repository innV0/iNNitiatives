import { TableView } from './TableView.js';
import { APP_SCHEMA } from '../appSchema.js';

export const InitiativesView = {
    props: {
        initiatives: Array,
        getPersonNameFn: Function,
        currentSortField: String,
        currentSortOrder: String,
        viewMode: {
            type: String,
            default: 'table'
        }
    },
    components: { TableView },
    emits: ['add-initiative-requested', 'open-ai-modal-requested', 'sort-requested', 'view-item-requested', 'edit-item-requested', 'delete-item-requested'],
    computed: {
        tableFields() { return this.$root.generateFormFields(APP_SCHEMA.definitions.initiative); }
    },
    template: `
        <section class="space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">iNNitiatives</h2>
                    <p class="text-gray-600 mt-1">Track and manage your innovation initiatives</p>
                </div>
                <div class="flex space-x-3"> <!-- Wrapper for buttons -->
                    <button @click="$emit('add-initiative-requested')" class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                        <span>Add Initiative</span>
                    </button>
                    <button @click="$emit('open-ai-modal-requested', { contextType: 'initiativeList', item: null })" title="AI Assistant for Initiatives List" class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                        <span>AI</span>
                    </button>
                    <button @click="$emit('toggle-view-mode')" :title="viewMode === 'grid' ? 'Switch to table view' : 'Switch to grid view'" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                        <i :data-lucide="viewMode === 'grid' ? 'table' : 'layout-grid'" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div v-if="!initiatives || initiatives.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="zap" class="w-8 h-8 text-gray-400"></i>
                </div>
                <p class="text-gray-600">No initiatives created yet</p>
            </div>

            <div v-else>
                <div v-if="viewMode === 'table'">
                    <table-view :items="initiatives" :fields="tableFields" app-data-section="initiatives" @view-item-requested="$emit('view-item-requested', $event)"></table-view>
                </div>
                <div v-else class="space-y-4">
                    <initiative-list-item
                        v-for="init in initiatives"
                        :key="init.initiativeId"
                        :initiative="init"
                        :get-person-name-fn="getPersonNameFn"
                        @view-item-requested="$emit('view-item-requested', $event)"
                        @edit-item-requested="$emit('edit-item-requested', $event)"
                        @open-ai-modal-requested="$emit('open-ai-modal-requested', $event)"
                        @delete-item-requested="$emit('delete-item-requested', $event)">
                    </initiative-list-item>
                </div>
            </div>
        </section>
    `,
    mounted() { // Added mounted and updated for Lucide icons
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
