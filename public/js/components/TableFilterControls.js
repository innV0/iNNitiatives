export const TableFilterControls = {
    props: {
        fields: { type: Array, default: () => [] },
        modelValueField: String,
        modelValueValue: String,
        peopleList: { type: Array, default: () => [] },
        opportunitiesList: { type: Array, default: () => [] }
    },
    emits: ['update:modelValueField', 'update:modelValueValue', 'clear-filter'],
    computed: {
        selectedFieldMeta() {
            return this.fields.find(f => f.key === this.modelValueField) || {};
        },
        valueOptions() {
            if (this.selectedFieldMeta.relationshipType === 'person') {
                return this.peopleList.map(p => ({ value: p.personId, label: p.personName }));
            }
            if (this.selectedFieldMeta.relationshipType === 'opportunity') {
                return this.opportunitiesList.map(o => ({ value: o.opportunityId, label: o.opportunityName }));
            }
            if (Array.isArray(this.selectedFieldMeta.enum)) {
                return this.selectedFieldMeta.enum.map(v => ({ value: v, label: v }));
            }
            return [];
        }
    },
    template: `
        <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap items-end gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">Filter by Field</label>
                <select :value="modelValueField" @change="$emit('update:modelValueField', $event.target.value)" class="form-select mt-1">
                    <option value="">-- None --</option>
                    <option v-for="f in fields" :key="f.key" :value="f.key">{{ f.title }}</option>
                </select>
            </div>
            <div v-if="modelValueField">
                <label class="block text-sm font-medium text-gray-700">Value</label>
                <template v-if="valueOptions.length">
                    <select :value="modelValueValue" @change="$emit('update:modelValueValue', $event.target.value)" class="form-select mt-1">
                        <option value="">All</option>
                        <option v-for="opt in valueOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                    </select>
                </template>
                <template v-else>
                    <input type="text" :value="modelValueValue" @input="$emit('update:modelValueValue', $event.target.value)" class="form-input mt-1"/>
                </template>
            </div>
            <button @click="$emit('clear-filter')" class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm" type="button">Clear</button>
        </div>
    `
};
