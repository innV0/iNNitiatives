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
    // Components are registered globally in app.js, so no local 'components' registration for PersonCard needed here.
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
                <div v-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <table v-else class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50 text-xs text-gray-500">
                        <tr>
                            <th class="px-4 py-2 text-left font-medium">Name</th>
                            <th class="px-4 py-2 text-left font-medium">Description</th>
                            <th class="px-4 py-2 text-right font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                        <tr v-for="person in people" :key="person.personId" class="bg-white">
                            <td class="px-4 py-2">
                                <div class="flex items-center space-x-2">
                                    <img :src="getPersonAvatarFn(person.personId)" :alt="person.personName" class="w-8 h-8 rounded-full" />
                                    <span class="font-medium">{{ person.personName || 'N/A' }}</span>
                                </div>
                            </td>
                            <td class="px-4 py-2 text-sm text-gray-700">{{ person.personDescription || 'No description' }}</td>
                            <td class="px-4 py-2 text-right space-x-2">
                                <button @click="$emit('view-item-requested', { item: person, type: 'person' })" class="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md" title="View Person"><i data-lucide="eye" class="w-4 h-4"></i></button>
                                <button @click="$emit('edit-item-requested', person)" class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" title="Edit Person"><i data-lucide="edit" class="w-4 h-4"></i></button>
                                <button @click="$emit('open-ai-modal-requested', { contextType: 'personItem', item: person })" class="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md" :title="'AI Assistant for ' + person.personName"><i data-lucide="bot" class="w-4 h-4"></i></button>
                                <button @click="$emit('delete-item-requested', person.personId)" class="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-md" title="Delete Person"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
