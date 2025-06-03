export const ViewItemModal = {
    props: {
        show: Boolean,
        title: String,
        itemData: Object,
        itemFields: Array,
        relatedItemsData: Array,
        getPersonNameFn: Function,
        getOpportunityNameFn: Function,
        viewItemFn: Function // To handle clicks on related items
    },
    methods: {
        closeModal() {
            this.$emit('close-modal-requested');
        },
        handleViewItem(item, type) {
            if (this.viewItemFn) {
                this.viewItemFn(item, type);
            }
        }
    },
    template: `
        <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div class="relative mx-auto border border-gray-300 w-full max-w-3xl shadow-2xl rounded-xl bg-white">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="view-item-modal-content">
                    <div v-if="itemData">
                        <div v-for="field in itemFields" :key="field.key" class="field-display">
                            <div class="field-label">{{ field.title }}</div>
                            <div class="field-value">
                                <div v-if="Array.isArray(itemData[field.key])">
                                    <ul v-if="itemData[field.key].length > 0" class="list-disc list-inside">
                                        <li v-for="(val, index) in itemData[field.key]" :key="index">{{ val }}</li>
                                    </ul>
                                    <span v-else class="text-gray-500 italic">No items defined</span>
                                </div>
                                <div v-else-if="field.relationshipType === 'person' && getPersonNameFn">
                                     <span v-if="itemData[field.key]" @click="handleViewItem(itemData[field.key], 'person')" class="text-blue-600 hover:underline cursor-pointer">
                                        {{ getPersonNameFn(itemData[field.key]) }} ({{ itemData[field.key] }})
                                    </span>
                                    <span v-else class="text-gray-500 italic">Not specified</span>
                                </div>
                                <div v-else-if="field.relationshipType === 'opportunity' && getOpportunityNameFn">
                                     <span v-if="itemData[field.key]" @click="handleViewItem(itemData[field.key], 'opportunity')" class="text-blue-600 hover:underline cursor-pointer">
                                        {{ getOpportunityNameFn(itemData[field.key]) }} ({{ itemData[field.key] }})
                                    </span>
                                    <span v-else class="text-gray-500 italic">Not specified</span>
                                </div>
                                <span v-else>{{ itemData[field.key] || 'Not specified' }}</span>
                            </div>
                        </div>

                        <div v-if="relatedItemsData && relatedItemsData.length > 0" class="related-items-section">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">Related Items</h4>
                            <div class="related-items-grid">
                                <div v-for="related in relatedItemsData" :key="related.id" @click="handleViewItem(related.item, related.type)" class="related-item-card">
                                    <p class="related-item-title">{{ related.name }}</p>
                                    <p class="related-item-type">{{ related.type.charAt(0).toUpperCase() + related.type.slice(1) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                     <div v-else class="text-center text-gray-500 py-8">
                        No item data to display.
                    </div>
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
