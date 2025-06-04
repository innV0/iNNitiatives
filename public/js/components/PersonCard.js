import { FieldRenderer } from './FieldRenderer.js';
import { getFieldMeta } from '../fieldMeta.js';

export const PersonCard = {
    props: {
        person: {
            type: Object,
            required: true
        },
        getPersonAvatarFn: {
            type: Function,
            required: true
        }
        // getFieldDescription is not passed as per subtask, tooltip for name will be removed or simplified
    },
    components: { FieldRenderer },
    computed: {
        descriptionMeta() { return getFieldMeta('person.personDescription'); }
    },
    template: `
        <div class="bg-white rounded-xl border border-gray-200 p-6 card-hover shadow-sm">
            <div class="flex items-start space-x-4">
                <img :src="getPersonAvatarFn(person.personId)"
                     :alt="person.personName || 'Person'"
                     class="w-16 h-16 rounded-full object-cover border-2 border-gray-200">
                <div class="flex-1 min-w-0">
                    <h3 class="text-lg font-semibold text-gray-900 truncate" :title="person.personName">
                        {{ person.personName || 'N/A' }}
                    </h3>
                    <field-renderer
                        field-key="personDescription"
                        :value="person.personDescription"
                        :field-meta="descriptionMeta"
                    ></field-renderer>
                    <div v-if="person.personUrl" class="mb-4">
                        <a :href="person.personUrl" target="_blank" rel="noopener noreferrer" class="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm">
                            <i data-lucide="external-link" class="w-3 h-3"></i>
                            <span>View Profile</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-200 hover-actions">
                 <button @click="$emit('view-item-requested', { item: person, type: 'person' })" class="flex items-center space-x-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1.5 rounded-lg text-sm transition-colors" title="View Person">
                    <i data-lucide="eye" class="w-3 h-3"></i>
                    <span>View</span>
                </button>
                <button @click="$emit('edit-item-requested', person)" class="flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg text-sm transition-colors" title="Edit Person">
                    <i data-lucide="edit" class="w-3 h-3"></i>
                    <span>Edit</span>
                </button>
                <button @click="$emit('open-ai-modal-requested', { contextType: 'personItem', item: person })" :title="'AI Assistant for ' + person.personName" class="flex items-center space-x-1 bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-sm transition-colors">
                    <i data-lucide="bot" class="w-3 h-3"></i>
                    <span>AI</span>
                </button>
                <button @click="$emit('delete-item-requested', person.personId)" class="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm transition-colors" title="Delete Person">
                    <i data-lucide="trash-2" class="w-3 h-3"></i>
                    <span>Delete</span>
                </button>
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
