export const ItemCard = {
    props: {
        item: { type: Object, required: true },
        type: { type: String, required: true },
        getPersonNameFn: Function,
        getPersonAvatarFn: Function
    },
    computed: {
        itemId() {
            return this.item[`${this.type}Id`];
        },
        itemName() {
            return this.item.name || this.item[`${this.type}Name`] || 'N/A';
        },
        subInfo() {
            if (this.type === 'person') {
                return this.item.personRole || '';
            }
            if (this.type === 'opportunity') {
                const proposer = this.getPersonNameFn ? this.getPersonNameFn(this.item.opportunityProposerId) : '';
                const status = this.item.opportunityStatus || '';
                const priority = this.item.opportunityPriority !== undefined ? `Priority: ${this.item.opportunityPriority}` : '';
                return [proposer, status, priority].filter(Boolean).join(' | ');
            }
            if (this.type === 'initiative') {
                const manager = this.getPersonNameFn ? this.getPersonNameFn(this.item.initiativeManagerId) : '';
                const type = this.item.initiativeType || '';
                const phase = this.item.initiativePhase || '';
                return [manager, type, phase].filter(Boolean).join(' | ');
            }
            return '';
        },
        avatar() {
            if (this.type === 'person' && this.getPersonAvatarFn) {
                return this.getPersonAvatarFn(this.item.personId);
            }
            return null;
        }
    },
    template: `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-start card-hover">
            <div class="flex space-x-4 flex-1">
                <img v-if="avatar" :src="avatar" class="w-12 h-12 rounded-full object-cover border"/>
                <div class="min-w-0">
                    <h3 class="text-lg font-semibold text-blue-700 truncate" :title="itemName">{{ itemName }}</h3>
                    <p v-if="subInfo" class="text-sm text-gray-500 mt-1 truncate">{{ subInfo }}</p>
                </div>
            </div>
            <div class="flex space-x-2 flex-shrink-0 hover-actions">
                <button @click="$emit('view-item-requested', { item, type })" class="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md" title="View">
                    <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
                <button @click="$emit('edit-item-requested', item)" class="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md" title="Edit">
                    <i data-lucide="edit" class="w-4 h-4"></i>
                </button>
                <button @click="$emit('open-ai-modal-requested', { contextType: type + 'Item', item })" class="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md" :title="'AI Assistant for ' + itemName">
                    <i data-lucide="bot" class="w-4 h-4"></i>
                </button>
                <button @click="$emit('delete-item-requested', itemId)" class="p-1.5 bg-red-100 hover:bg-red-200 text-red-600 rounded-md" title="Delete">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        </div>
    `
};
