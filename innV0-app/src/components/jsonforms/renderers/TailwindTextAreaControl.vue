<script setup lang="ts">
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { isMultiLineControl, rankWith } from '@jsonforms/core';

const controlRenderer = defineComponent({
  name: 'TailwindTextAreaControl',
  props: rendererProps,
  setup(props) {
    const control = useJsonFormsControl(props);
    return {
      control,
      onChange: (event: Event) => {
        control.value.handleChange(control.value.path, (event.target as HTMLTextAreaElement).value);
      }
    };
  },
});

export default controlRenderer;

export const entry = {
  tester: rankWith(10, isMultiLineControl), // Rank 10 for multi-line string controls
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
    <textarea
      :id="control.value.id + '-input'"
      :value="control.value.data"
      @change="onChange"
      :disabled="!control.value.enabled"
      :required="control.value.required"
      :placeholder="control.value.schema.description || ''"
      rows="3"
      class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm
             focus:outline-none focus:ring-sky-500 focus:border-sky-500
             sm:text-sm disabled:bg-slate-50 disabled:text-slate-500
             disabled:border-slate-200 disabled:shadow-none"
    ></textarea>
    <div v-if="control.value.errors && control.value.errors.length > 0" class="mt-1">
      <p v-for="(error, index) in control.value.errors" :key="index" class="text-red-600 text-sm">
        {{ error.message }}
      </p>
    </div>
  </div>
</template>
