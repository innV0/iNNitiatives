const { createApp, ref, computed, watch, onMounted } = Vue;

const App = {
  setup() {
    const message = ref('Loading App Data...');
    const appTitle = ref('iNNitiatives');
    const currentView = ref('loading'); // e.g., 'loading', 'program', 'people', etc.
    const schema = ref(null);
    const rawData = ref(null);

    // Computed properties for data segments
    const programData = computed(() => rawData.value?.program);
    const peopleData = computed(() => rawData.value?.people || []); // Default to empty array
    const opportunitiesData = computed(() => rawData.value?.opportunities || []); // Default to empty array
    const initiativesData = computed(() => rawData.value?.initiatives || []); // Default to empty array

    async function loadCoreData() {
      try {
        message.value = 'Fetching schema...';
        const schemaResponse = await fetch('./schema.json');
        if (!schemaResponse.ok) throw new Error(`HTTP error loading schema.json! Status: ${schemaResponse.status}`);
        schema.value = await schemaResponse.json();
        message.value = 'Fetching sample data...';

        const dataResponse = await fetch('./sample-data.json');
        if (!dataResponse.ok) throw new Error(`HTTP error loading sample-data.json! Status: ${dataResponse.status}`);
        rawData.value = await dataResponse.json();

        message.value = 'Core data loaded successfully.';
        currentView.value = 'program'; // Default view after successful load
      } catch (e) {
        console.error('Error loading core data:', e);
        message.value = 'Error loading core data: ' + e.message;
        currentView.value = 'error';
      }
    }

    onMounted(() => {
      loadCoreData();
    });

    // Helper Functions
    const getProgramSchema = () => schema.value?.definitions?.programConfiguration;
    const getPersonSchema = () => schema.value?.definitions?.person;
    const getOpportunitySchema = () => schema.value?.definitions?.opportunity;
    const getInitiativeSchema = () => schema.value?.definitions?.initiative;
    const getSchemaDefinition = (definitionName) => schema.value?.definitions?.[definitionName];

    function getSchemaProperties(definitionName) {
      const definition = schema.value?.definitions?.[definitionName];
      if (!definition || !definition.properties) return [];
      return Object.entries(definition.properties)
        .map(([key, propDef]) => ({ name: key, ...propDef }))
        .sort((a, b) => (a['nn-order'] || Infinity) - (b['nn-order'] || Infinity));
    }

    function getGroupedSchemaProperties(definitionName) {
      const properties = getSchemaProperties(definitionName);
      if (!properties.length) return {};
      const grouped = {};
      properties.forEach(prop => {
        const groupName = prop['nn-group'] || '_ungrouped';
        if (!grouped[groupName]) {
          grouped[groupName] = [];
        }
        grouped[groupName].push(prop);
      });
      return grouped;
    }

    // Example of a computed property using a helper
    const programName = computed(() => {
      return programData.value ? programData.value.programName : 'Program';
    });

    return {
      message,
      appTitle,
      currentView,
      schema,
      rawData,
      programData,
      peopleData,
      opportunitiesData,
      initiativesData,
      programName, // Example
      // Exposed helper functions
      getProgramSchema,
      getPersonSchema,
      getOpportunitySchema,
      getInitiativeSchema,
      getSchemaDefinition,
      getSchemaProperties,
      getGroupedSchemaProperties
    };
  },
  // Basic template structure using string templates (remains the same as previous step)
  template: `
    <div class="min-h-screen flex flex-col">
      <header class="bg-slate-800 text-white p-4 shadow-md">
        <div class="container mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold">{{ appTitle }}</h1>
          <!-- Add user/auth placeholder if needed later -->
        </div>
      </header>
      <nav class="bg-slate-700 text-white shadow-sm">
        <div class="container mx-auto flex space-x-1">
          <button @click="currentView = 'program'" :class="{'bg-slate-900 text-white': currentView === 'program', 'text-slate-300 hover:bg-slate-600 hover:text-white': currentView !== 'program'}" class="px-3 py-2 rounded-md text-sm font-medium">Program Config</button>
          <button @click="currentView = 'people'" :class="{'bg-slate-900 text-white': currentView === 'people', 'text-slate-300 hover:bg-slate-600 hover:text-white': currentView !== 'people'}" class="px-3 py-2 rounded-md text-sm font-medium">People</button>
          <button @click="currentView = 'opportunities'" :class="{'bg-slate-900 text-white': currentView === 'opportunities', 'text-slate-300 hover:bg-slate-600 hover:text-white': currentView !== 'opportunities'}" class="px-3 py-2 rounded-md text-sm font-medium">Opportunities</button>
          <button @click="currentView = 'initiatives'" :class="{'bg-slate-900 text-white': currentView === 'initiatives', 'text-slate-300 hover:bg-slate-600 hover:text-white': currentView !== 'initiatives'}" class="px-3 py-2 rounded-md text-sm font-medium">Initiatives</button>
        </div>
      </nav>
      <main class="container mx-auto p-4 flex-grow">
        <div v-if="currentView === 'loading'" class="text-center py-10">
          <p class="text-lg text-slate-700">{{ message }}</p>
        </div>
        <div v-else-if="currentView === 'error'" class="text-center py-10">
          <p class="text-lg text-red-600 font-semibold">An Error Occurred</p>
          <p class="text-slate-700">{{ message }}</p>
        </div>
        <div v-else-if="currentView === 'program'">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">Program Configuration: {{ programName }}</h2>
          <pre class="bg-slate-200 p-2 rounded text-xs overflow-auto">{{ JSON.stringify(programData, null, 2) }}</pre>
        </div>
        <div v-else-if="currentView === 'people'">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">People ({{ peopleData.length }})</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <li v-for="person in peopleData" :key="person.personId" class="bg-white p-3 rounded shadow">
              <h3 class="font-semibold text-sky-700">{{person.personName}}</h3>
              <p class="text-sm text-slate-600">{{person.personRole}}</p>
            </li>
          </ul>
        </div>
        <div v-else-if="currentView === 'opportunities'">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">Opportunities ({{ opportunitiesData.length }})</h2>
           <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="opp in opportunitiesData" :key="opp.opportunityId" class="bg-white p-3 rounded shadow">
              <h3 class="font-semibold text-sky-700">{{opp.opportunityName}}</h3>
              <p class="text-sm text-slate-600">Status: {{opp.opportunityStatus}} | Priority: {{opp.opportunityPriority}}</p>
            </li>
          </ul>
        </div>
        <div v-else-if="currentView === 'initiatives'">
          <h2 class="text-xl font-semibold text-slate-700 mb-4">Initiatives ({{ initiativesData.length }})</h2>
          <ul class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <li v-for="init in initiativesData" :key="init.initiativeId" class="bg-white p-3 rounded shadow">
              <h3 class="font-semibold text-sky-700">{{init.initiativeName}}</h3>
              <p class="text-sm text-slate-600">Type: {{init.initiativeType}} | Phase: {{init.initiativePhase}}</p>
            </li>
          </ul>
        </div>
        <div v-else class="text-center py-10">
          <p class="text-red-500">Error: View '{{ currentView }}' not found or data not yet loaded.</p>
          <p>{{ message }}</p>
        </div>
      </main>
      <footer class="bg-slate-200 text-slate-600 text-center p-4 text-sm border-t border-slate-300">
        <p>&copy; ${new Date().getFullYear()} iNNitiatives (CDN Demo)</p>
      </footer>
    </div>
  `
};

createApp(App).mount('#app');
