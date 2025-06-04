export const FieldRenderer = {
  props: {
    fieldKey: { type: String, required: true },
    value: { default: '' },
    fieldMeta: { type: Object, default: () => ({}) },
    editable: { type: Boolean, default: false }
  },
  emits: ['update'],
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
        <select v-if="fieldMeta.enum" v-model="internalValue" @change="emitUpdate" class="form-select w-full">
          <option v-for="option in fieldMeta.enum" :key="option" :value="option">{{ option }}</option>
        </select>
        <textarea v-else-if="fieldMeta.format === 'textarea'" v-model="internalValue" @input="emitUpdate" rows="3" class="form-input form-textarea w-full"></textarea>
        <input v-else :type="inputType" v-model="internalValue" @input="emitUpdate" class="form-input w-full"/>
      </template>
      <template v-else>
        <span class="inline-flex items-center space-x-1" :title="fieldMeta.tooltip">
          <i v-if="fieldMeta.icon" :data-lucide="fieldMeta.icon" class="w-3 h-3"></i>
          <span>{{ displayValue }}</span>
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
