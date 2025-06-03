export const EditModal = {
    props: {
        show: Boolean,
        title: String,
        formFields: Array,
        initialFormData: Object,
        showSaveAndDownloadButton: Boolean,
        // Props for select dropdowns
        peopleList: { type: Array, default: () => [] },
        opportunitiesList: { type: Array, default: () => [] },
        currentEditEntityType: String // To pass to the help emitter
    },
    data() {
        return {
            currentFormData: {}
        };
    },
    watch: {
        initialFormData: {
            handler(newData) {
                this.currentFormData = JSON.parse(JSON.stringify(newData || {}));
            },
            immediate: true,
            deep: true
        },
        show(newVal) {
            if (newVal) {
                this.$nextTick(() => {
                     if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                });
            }
        }
    },
    methods: {
        closeModal() {
            this.$emit('close-modal-requested');
        },
        saveForm() {
            this.$emit('save-form-requested', JSON.parse(JSON.stringify(this.currentFormData)));
        },
        saveAndDownload() {
            this.$emit('save-and-download-requested', JSON.parse(JSON.stringify(this.currentFormData)));
        },
        requestShowHelp(fieldKey) {
            this.$emit('show-help-requested', { fieldKey: fieldKey, entityType: this.currentEditEntityType });
        },
        addArrayItem(fieldKey) {
            if (!this.currentFormData[fieldKey] || !Array.isArray(this.currentFormData[fieldKey])) {
                this.currentFormData[fieldKey] = [];
            }
            this.currentFormData[fieldKey].push('');
            this.$nextTick(() => { if (typeof lucide !== 'undefined') { lucide.createIcons(); } });
        },
        removeArrayItem(fieldKey, index) {
            if (this.currentFormData[fieldKey] && Array.isArray(this.currentFormData[fieldKey])) {
                this.currentFormData[fieldKey].splice(index, 1);
            }
        }
    },
    template: `
        <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div class="relative mx-auto border border-gray-300 w-full max-w-5xl shadow-2xl rounded-xl bg-white modal-content">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="p-6">
                    <form @submit.prevent="saveForm" class="space-y-6">
                        <div class="form-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div v-for="field in formFields" :key="field.key"
                                 :class="['form-field', field.key.includes('Objectives') || field.key.includes('Scope') || field.key.includes('Indicators') || field.key.includes('Governance') || field.key.includes('Funding') || field.key.includes('Reporting') || field.key.includes('Description') || field.key.includes('Problem') || field.key.includes('Solution') || field.key.includes('Value') || field.key.includes('Goals') || field.key.includes('NextSteps') || field.key.includes('Resources') || field.key.includes('Risks') || field.key.includes('Learnings') || field.key.includes('DecisionJustification') || field.key.includes('Notes') || field.key.includes('businessInfo') || field.isSimpleStringArray ? 'lg:col-span-2' : '']">
                                <label :for="field.key" class="form-label flex items-center">
                                    <span class="tooltip-container">
                                        <i class="tooltip-icon cursor-pointer" @click.stop="requestShowHelp(field.key)">?</i>
                                        <span class="tooltip-text">{{ field.description }} Click Icon for More Info</span>
                                    </span>
                                    {{ field.title }}
                                </label>

                                <input v-if="field.type === 'string' && !field.enum && field.format !== 'textarea' && !field.isSimpleStringArray && !field.relationshipType"
                                       :id="field.key"
                                       v-model="currentFormData[field.key]"
                                       :type="field.format === 'uri' ? 'url' : field.format === 'date' ? 'date' : 'text'"
                                       :readonly="field.readonly"
                                       class="form-input"
                                       :class="{ 'bg-gray-100 text-gray-500 cursor-not-allowed': field.readonly }">

                                <textarea v-else-if="field.type === 'string' && field.format === 'textarea' && !field.isSimpleStringArray"
                                          :id="field.key"
                                          v-model="currentFormData[field.key]"
                                          rows="4"
                                          class="form-input form-textarea"></textarea>

                                <input v-else-if="field.type === 'number' || field.type === 'integer'"
                                       :id="field.key"
                                       v-model.number="currentFormData[field.key]"
                                       type="number"
                                       :min="field.minimum"
                                       :max="field.maximum"
                                       class="form-input">

                                <select v-else-if="field.enum"
                                        :id="field.key"
                                        v-model="currentFormData[field.key]"
                                        class="form-select">
                                    <option value="">Select {{ field.title }}</option>
                                    <option v-for="option in field.enum" :key="option" :value="option">{{ option }}</option>
                                </select>

                                <select v-else-if="field.relationshipType === 'person'"
                                        :id="field.key"
                                        v-model="currentFormData[field.key]"
                                        class="form-select">
                                    <option value="">Select Person</option>
                                    <option v-for="person in peopleList" :key="person.personId" :value="person.personId">
                                        {{ person.personName }} ({{ person.personId }})
                                    </option>
                                </select>

                                <select v-else-if="field.relationshipType === 'opportunity'"
                                        :id="field.key"
                                        v-model="currentFormData[field.key]"
                                        class="form-select">
                                    <option value="">Select Opportunity</option>
                                    <option v-for="opp in opportunitiesList" :key="opp.opportunityId" :value="opp.opportunityId">
                                        {{ opp.opportunityName }} ({{ opp.opportunityId }})
                                    </option>
                                </select>

                                <textarea v-else-if="field.type === 'array' && !field.isSimpleStringArray"
                                          :id="field.key"
                                          v-model="currentFormData[field.key + '_json']"
                                          rows="3"
                                          class="form-input form-textarea"
                                          placeholder='Enter JSON array, e.g., ["item1", "item2"]'></textarea>

                                <div v-else-if="field.isSimpleStringArray">
                                    <div v-for="(item, index) in currentFormData[field.key]" :key="index" class="array-item-input-container">
                                        <input type="text" v-model="currentFormData[field.key][index]" class="form-input array-item-input" :placeholder="'Item ' + (index + 1)">
                                        <button @click.prevent="removeArrayItem(field.key, index)" type="button" class="p-2 text-red-500 hover:text-red-700">
                                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                                        </button>
                                    </div>
                                    <button @click.prevent="addArrayItem(field.key)" type="button" class="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-800">
                                        <i data-lucide="plus-circle" class="w-4 h-4"></i>
                                        <span>Add Item</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="flex justify-end space-x-3 p-6 border-t border-gray-200">
                    <button @click="closeModal" class="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
                        Cancel
                    </button>
                    <button @click="saveForm" class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                        Save
                    </button>
                    <button v-if="showSaveAndDownloadButton" @click="saveAndDownload" class="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
                        Save & Export
                    </button>
                </div>
            </div>
        </div>
    `
};
