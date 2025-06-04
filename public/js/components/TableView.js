export const TableView = {
    props: {
        items: { type: Array, default: () => [] },
        fields: { type: [Array, Object], default: () => [] }
    },
    emits: ['update-item'],
    data() {
        return {
            editableItems: [],
            mappedFields: []
        };
    },
    watch: {
        items: {
            handler(newVal) {
                this.editableItems = JSON.parse(JSON.stringify(newVal || []));
            },
            immediate: true,
            deep: true
        },
        fields: {
            handler(newVal) {
                this.prepareFields(newVal);
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        prepareFields(f) {
            if (Array.isArray(f)) {
                this.mappedFields = f;
            } else if (f && typeof f === 'object' && this.$root && this.$root.generateFormFields) {
                this.mappedFields = this.$root.generateFormFields(f);
            } else {
                this.mappedFields = [];
            }
        },
        emitUpdate(index) {
            if (!this.mappedFields.length) return;
            const processed = this.$root && this.$root.processFormData
                ? this.$root.processFormData(this.editableItems[index], this.mappedFields)
                : this.editableItems[index];
            if (processed) {
                this.$emit('update-item', { index, item: processed });
            }
        }
    },
    template: `
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th v-for="field in mappedFields" :key="field.key" class="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            {{ field.title }}
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(row, rowIndex) in editableItems" :key="rowIndex">
                        <td v-for="field in mappedFields" :key="field.key" class="px-3 py-2 whitespace-nowrap">
                            <template v-if="field.enum">
                                <select v-model="row[field.key]" @change="emitUpdate(rowIndex)" class="form-select w-full">
                                    <option v-for="option in field.enum" :key="option" :value="option">{{ option }}</option>
                                </select>
                            </template>
                            <template v-else-if="field.format === 'date'">
                                <input type="date" v-model="row[field.key]" @input="emitUpdate(rowIndex)" class="form-input w-full"/>
                            </template>
                            <template v-else-if="field.type === 'number' || field.type === 'integer'">
                                <input type="number" v-model.number="row[field.key]" @input="emitUpdate(rowIndex)" class="form-input w-full"/>
                            </template>
                            <template v-else>
                                <input type="text" v-model="row[field.key]" @input="emitUpdate(rowIndex)" class="form-input w-full"/>
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};
