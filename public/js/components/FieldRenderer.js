import { ItemBadge } from './ItemBadge.js';
import { SearchSelect } from './SearchSelect.js';

export const FieldRenderer = {
  props: {
    fieldKey: { type: String, required: true },
    value: { default: '' },
    fieldMeta: { type: Object, default: () => ({}) },
    editable: { type: Boolean, default: false },
    displayClass: { type: String, default: '' }
  },
  components: { ItemBadge, SearchSelect },
  emits: ['update', 'view-item-requested'],
  data() {
    return { internalValue: this.value };
  },
  watch: {
    value(val) { this.internalValue = val; }
  },
  computed: {
    inputType() {
      if (this.fieldMeta.format === 'date') return 'date';
      if (this.fieldMeta.type === 'number' || this.fieldMeta.type === 'integer') return 'number';
      if (this.fieldMeta.format === 'uri') return 'url';
      return 'text';
    },
    displayValue() {
      if (Array.isArray(this.value)) {
        return this.value.length ? this.value.join(', ') : 'No items defined';
      }
      return this.value || 'Not specified';
    }
  },
  methods: {
    emitUpdate() { this.$emit('update', this.internalValue); }
  },
  template: `
    <div class="field-renderer">
      <template v-if="editable">
        <search-select
          v-if="fieldMeta.relationshipType === 'person'"
          :model-value="internalValue"
          @update:modelValue="val => { internalValue = val; emitUpdate(); }"
          :options="$root.appData.people.map(p => ({ value: p.personId, label: p.personName }))"
          placeholder="Select Person"
        ></search-select>
        <search-select
          v-else-if="fieldMeta.relationshipType === 'opportunity'"
          :model-value="internalValue"
          @update:modelValue="val => { internalValue = val; emitUpdate(); }"
          :options="$root.appData.opportunities.map(o => ({ value: o.opportunityId, label: o.opportunityName }))"
          placeholder="Select Opportunity"
        ></search-select>
        <select v-else-if="fieldMeta.enum" v-model="internalValue" @change="emitUpdate" class="form-select w-full">
          <option v-for="option in fieldMeta.enum" :key="option" :value="option">{{ option }}</option>
        </select>
        <textarea v-else-if="fieldMeta.format === 'textarea'" v-model="internalValue" @keydown.enter.prevent="emitUpdate" @blur="emitUpdate" rows="3" class="form-input form-textarea w-full"></textarea>
        <input v-else :type="inputType" v-model="internalValue" @keydown.enter.prevent="emitUpdate" @blur="emitUpdate" class="form-input w-full"/>
      </template>
      <template v-else>
        <item-badge
          v-if="fieldMeta.relationshipType === 'person'"
          :name="$root.getPersonName(value)"
          icon="user"
          :item="$root.getPerson(value)"
          type="person"
          @view-item-requested="$emit('view-item-requested', $event)"
        ></item-badge>
        <item-badge
          v-else-if="fieldMeta.relationshipType === 'opportunity'"
          :name="$root.getOpportunityName(value)"
          icon="lightbulb"
          :item="$root.getOpportunity(value)"
          type="opportunity"
          @view-item-requested="$emit('view-item-requested', $event)"
        ></item-badge>
        <span v-else class="inline-flex items-center space-x-1" :title="fieldMeta.tooltip">
          <i v-if="fieldMeta.icon" :data-lucide="fieldMeta.icon" class="w-3 h-3"></i>
          <span :class="displayClass">{{ displayValue }}</span>
        </span>
      </template>
    </div>
  `,
  mounted() {
    this.$nextTick(() => { if (typeof lucide !== 'undefined') { lucide.createIcons(); } });
  },
  updated() {
    this.$nextTick(() => { if (typeof lucide !== 'undefined') { lucide.createIcons(); } });
  }
};
