import { createApp } from 'vue';
import './style.css'; // Tailwind CSS (already here)
import App from './App.vue';
import router from './router'; // Import the router
import { jsonFormsVueVueCompositionProps } from '@jsonforms/vue';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';

const app = createApp(App);

app.use(router); // Use the router

// Register JSON Forms
// Note: Provide the renderers. `as any` is used to bypass strict type checking for vanillaRenderers if necessary,
// depending on the exact version and type definitions. Ideally, types should align.
app.use(jsonFormsVueVueCompositionProps);
app.provide('jsonforms.renderers', vanillaRenderers as any);


app.mount('#app');
