import { createApp } from 'vue';
import './style.css'; // Tailwind CSS (already here)
import App from './App.vue';
import router from './router'; // Import the router
import { jsonFormsVueVueCompositionProps } from '@jsonforms/vue';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { entry as tailwindTextControlEntry } from './components/jsonforms/renderers/TailwindTextControl.vue';
import { entry as tailwindTextAreaControlEntry } from './components/jsonforms/renderers/TailwindTextAreaControl.vue';
import { entry as tailwindNumberControlEntry } from './components/jsonforms/renderers/TailwindNumberControl.vue';

const app = createApp(App);

app.use(router); // Use the router

// Create a combined list of renderers, with custom ones potentially overriding vanilla ones based on rank.
// By prepending, our custom renderer's tester will be checked first.
// If its rank is higher for a given schema/uischema, it will be selected.
const customRenderers = [
  tailwindTextControlEntry,
  tailwindTextAreaControlEntry,
  tailwindNumberControlEntry,
  ...vanillaRenderers,
];

// Register JSON Forms
app.use(jsonFormsVueVueCompositionProps);
// Provide the combined renderers. Using `as any` for now to simplify type compatibility.
app.provide('jsonforms.renderers', customRenderers as any);


app.mount('#app');
