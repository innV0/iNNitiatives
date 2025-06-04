import { FieldRenderer } from './FieldRenderer.js';
import { getFieldMeta } from '../fieldMeta.js';

export const TableView = {
    props: {
        items: { type: Array, default: () => [] },
        fields: { type: [Array, Object], default: () => [] }
    },
    components: { FieldRenderer },
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
                this.mappedFields = f.map(field => ({ ...field, icon: getFieldMeta(field.key).icon, tooltip: getFieldMeta(field.key).tooltip }));
            } else if (f && typeof f === 'object' && this.$root && this.$root.generateFormFields) {
                this.mappedFields = this.$root.generateFormFields(f).map(field => {
                    const meta = getFieldMeta(field.key);
                    return { ...field, icon: meta.icon, tooltip: meta.tooltip };
                });
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
                            <field-renderer
                                :field-key="field.key"
                                :value="row[field.key]"
                                :field-meta="field"
                                editable
                                @update="val => { row[field.key] = val; emitUpdate(rowIndex); }"
                            ></field-renderer>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `
};
