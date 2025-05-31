<script setup lang="ts">
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { isNumberControl, rankWith } from '@jsonforms/core';

const controlRenderer = defineComponent({
  name: 'TailwindNumberControl',
  props: rendererProps,
  setup(props) {
    const control = useJsonFormsControl(props);
    return {
      control,
      onChange: (event: Event) => {
        const value = (event.target as HTMLInputElement).value;
        // Attempt to parse as float. If empty or invalid, JSON Forms core might handle it as undefined or keep old value based on its internal logic.
        // For robustness, one might add more sophisticated parsing or error handling here if needed.
        control.value.handleChange(control.value.path, value === '' ? undefined : parseFloat(value));
      }
    };
  },
});

export default controlRenderer;

export const entry = {
  tester: rankWith(10, isNumberControl), // Rank 10 for number controls
  renderer: controlRenderer,
};
</script>

<template>
  <div v-if="control.value.visible" class="mb-4">
    <label
      :for="control.value.id + '-input'"
      class="block text-sm font-medium text-slate-700 mb-1">
      {{ control.value.label }}
      <span v-if="control.value.required" class="text-red-500">*</span>
    </label>
    <input
      type="number"
      :id="control.value.id + '-input'"
      :value="control.value.data"
      @input="onChange"
      :disabled="!control.value.enabled"
      :required="control.value.required"
      :placeholder="control.value.schema.description || ''"
      step="any"
      class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm
             focus:outline-none focus:ring-sky-500 focus:border-sky-500
             sm:text-sm disabled:bg-slate-50 disabled:text-slate-500
             disabled:border-slate-200 disabled:shadow-none"
    />
    <div v-if="control.value.errors && control.value.errors.length > 0" class="mt-1">
      <p v-for="(error, index) in control.value.errors" :key="index" class="text-red-600 text-sm">
        {{ error.message }}
      </p>
    </div>
  </div>
</template>
