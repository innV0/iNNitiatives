export const InitiativesView = {
    props: ['initiatives', 'getPersonNameFn', 'currentSortField', 'currentSortOrder'],
    emits: ['add-initiative-requested', 'open-ai-modal-requested', 'sort-requested', 'view-item-requested', 'edit-item-requested', 'delete-item-requested'],
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
                </div>
            </div>

            <div v-if="!initiatives || initiatives.length === 0" class="text-center py-12">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i data-lucide="zap" class="w-8 h-8 text-gray-400"></i>
                </div>
                <p class="text-gray-600">No initiatives created yet</p>
            </div>

            <div v-else class="space-y-4">
                <div class="flex justify-between items-center text-xs text-gray-500 font-medium px-6 py-2 border-b bg-gray-50 rounded-t-lg">
                    <div class="flex-1 cursor-pointer hover:text-gray-800" @click="$emit('sort-requested', 'initiativeName')">
                        Name
                        <i v-if="currentSortField === 'initiativeName'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-az' : 'arrow-down-za'" class="sort-icon"></i>
                    </div>
                    <div class="w-1/4 cursor-pointer hover:text-gray-800 text-center" @click="$emit('sort-requested', 'initiativePhase')">
                        Phase
                        <i v-if="currentSortField === 'initiativePhase'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-az' : 'arrow-down-za'" class="sort-icon"></i>
                    </div>
                    <div class="w-1/6 cursor-pointer hover:text-gray-800 text-center" @click="$emit('sort-requested', 'initiativeType')">
                        Type
                        <i v-if="currentSortField === 'initiativeType'" :data-lucide="currentSortOrder === 'asc' ? 'arrow-up-az' : 'arrow-down-za'" class="sort-icon"></i>
                    </div>
                    <div class="w-1/6 text-right">Actions</div>
                </div>
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
