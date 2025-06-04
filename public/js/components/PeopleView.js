import { TableView } from './TableView.js';
import { APP_SCHEMA } from '../appSchema.js';

export const PeopleView = {
    props: {
        people: {
            type: Array,
            default: () => []
        },
        getPersonAvatarFn: {
            type: Function,
            required: true
        },
        viewMode: {
            type: String,
            default: 'grid'
        }
    },
    components: { TableView },
    computed: {
        tableFields() { return this.$root.generateFormFields(APP_SCHEMA.definitions.person); }
    },
    template: `
        <section class="space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Team Members</h2>
                    <p class="text-gray-600 mt-1">Manage your innovation team and their roles</p>
                </div>
                <div class="flex space-x-3"> <!-- Added a div wrapper for buttons -->
                    <button @click="$emit('add-person-requested')" class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="user-plus" class="w-4 h-4"></i>
                        <span>Add Person</span>
                    </button>
                    <button @click="$emit('open-ai-modal-requested', { contextType: 'peopleList', item: null })" title="AI Assistant for People List" class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                        <span>AI</span>
                    </button>
                    <button @click="$emit('toggle-view-mode')" :title="viewMode === 'grid' ? 'Switch to table view' : 'Switch to grid view'" class="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors">
                        <i :data-lucide="viewMode === 'grid' ? 'table' : 'layout-grid'" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>

            <div v-if="people.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="users" class="w-8 h-8 text-gray-400"></i>
                </div>
                <p class="text-gray-600">No team members added yet</p>
            </div>

            <div v-else>
                <div v-if="viewMode === 'grid'" class="space-y-4">
                    <person-card
                        v-for="person in people"
                        :key="person.personId"
                        :person="person"
                        :get-person-avatar-fn="getPersonAvatarFn"
                        @view-item-requested="$emit('view-item-requested', $event)"
                        @edit-item-requested="$emit('edit-item-requested', $event)"
                        @open-ai-modal-requested="$emit('open-ai-modal-requested', $event)"
                        @delete-item-requested="$emit('delete-item-requested', $event)">
                    </person-card>
                </div>
                <table-view v-else :items="people" :fields="tableFields" app-data-section="people" @view-item-requested="$emit('view-item-requested', $event)"></table-view>
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
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
};
