export const SearchSelect = {
  props: {
    modelValue: String,
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: '' }
  },
  emits: ['update:modelValue'],
  data() {
    return { search: '', showList: false };
  },
  computed: {
    selectedLabel() {
      const opt = this.options.find(o => o.value === this.modelValue);
      return opt ? opt.label : '';
    },
    filtered() {
      if (!this.search) return this.options;
      return this.options.filter(o => o.label.toLowerCase().includes(this.search.toLowerCase()));
    }
  },
  watch: {
    modelValue() { this.search = this.selectedLabel; }
  },
  mounted() {
    this.search = this.selectedLabel;
  },
  methods: {
    choose(option) {
      this.$emit('update:modelValue', option.value);
      this.search = option.label;
      this.showList = false;
    }
  },
  template: `
    <div class="relative">
      <input type="text" class="form-input w-full" :placeholder="placeholder"
             v-model="search" @focus="showList = true" @input="showList = true">
      <ul v-if="showList" class="absolute z-10 bg-white border border-gray-200 mt-1 rounded max-h-40 overflow-y-auto w-full">
        <li v-for="opt in filtered" :key="opt.value" @mousedown.prevent="choose(opt)"
            class="px-3 py-1 hover:bg-gray-100 cursor-pointer">{{ opt.label }}</li>
      </ul>
    </div>
  `
};
