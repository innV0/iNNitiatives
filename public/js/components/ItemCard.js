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
        avatar() {
            if (this.type === 'person' && this.getPersonAvatarFn) {
                return this.getPersonAvatarFn(this.item.personId);
            }
            return null;
        },
        badges() {
            const b = [];
            if (this.type === 'opportunity') {
                if (this.item.opportunityProposerId) {
                    b.push({
                        kind: 'item',
                        name: this.getPersonNameFn ? this.getPersonNameFn(this.item.opportunityProposerId) : this.$root.getPersonName(this.item.opportunityProposerId),
                        icon: 'user',
                        item: this.$root.getPerson(this.item.opportunityProposerId),
                        type: 'person'
                    });
                }
                if (this.item.opportunityPriority !== undefined) {
                    b.push({
                        kind: 'number',
                        value: this.$appUtils.formatNumber(this.item.opportunityPriority),
                        icon: 'star'
                    });
                }
                if (this.item.opportunityStatus) {
                    b.push({
                        kind: 'text',
                        value: this.item.opportunityStatus,
                        icon: 'flag'
                    });
                }
            } else if (this.type === 'initiative') {
                if (this.item.iNNitiativeOwnerPersonId) {
                    b.push({
                        kind: 'item',
                        name: this.getPersonNameFn ? this.getPersonNameFn(this.item.iNNitiativeOwnerPersonId) : this.$root.getPersonName(this.item.iNNitiativeOwnerPersonId),
                        icon: 'user',
                        item: this.$root.getPerson(this.item.iNNitiativeOwnerPersonId),
                        type: 'person'
                    });
                }
                if (this.item.iNNitiativeRelatedOpportunityId) {
                    b.push({
                        kind: 'item',
                        name: this.$root.getOpportunityName(this.item.iNNitiativeRelatedOpportunityId),
                        icon: 'lightbulb',
                        item: this.$root.getOpportunity(this.item.iNNitiativeRelatedOpportunityId),
                        type: 'opportunity'
                    });
                }
                if (this.item.initiativeBudget !== undefined) {
                    b.push({
                        kind: 'number',
                        value: this.$appUtils.formatNumber(this.item.initiativeBudget),
                        icon: 'euro'
                    });
                }
            }
            return b;
        }
    },
    template: `
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-start card-hover">
            <div class="flex space-x-4 flex-1">
                <img v-if="avatar" :src="avatar" class="w-12 h-12 rounded-full object-cover border"/>
                <div class="min-w-0">
                    <h3 class="text-lg font-semibold text-blue-700 truncate" :title="itemName">{{ itemName }}</h3>
                    <div v-if="badges.length" class="flex flex-wrap gap-1 mt-1">
                        <template v-for="(badge, idx) in badges" :key="idx">
                            <item-badge
                                v-if="badge.kind === 'item'"
                                :name="badge.name"
                                :icon="badge.icon"
                                :item="badge.item"
                                :type="badge.type"
                                @view-item-requested="$emit('view-item-requested', $event)"
                            ></item-badge>
                            <span v-else class="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                                <i :data-lucide="badge.icon" class="w-3 h-3"></i>
                                <span>{{ badge.value }}</span>
                            </span>
                        </template>
                    </div>
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
