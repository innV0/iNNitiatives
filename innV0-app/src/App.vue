<script setup lang="ts">
import { ref, onMounted, provide, computed } from 'vue';
import SchemaForm from './components/SchemaForm.vue';
import Ajv from 'ajv';
import type { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

// Define types based on the JSON schema for better type checking
interface ProgramConfiguration {
  programName: string;
  programObjectives: string;
  programScope?: string;
  programIndicators?: string;
  programGovernance?: string;
  programFunding?: string;
  programStages: string[];
  programReporting?: string;
  programDefaultOpportunityStatuses: string[];
  programDefaultInitiativeTypes: string[];
}

interface Person {
  personId: string;
  personName: string;
  personDescription?: string;
  personRole: "Innovation Manager" | "Innovation Sponsor" | "Team Member" | "Collaborator" | "Observer";
  personUrl?: string;
  personImageUrl?: string;
}

interface Opportunity {
  opportunityId: string;
  opportunityName: string;
  opportunityDescription?: string;
  opportunityProblem: string;
  opportunitySource?: "Customer Feedback" | "Market Trend" | "Internal Brainstorm" | "Competitor Analysis" | "Technology Scouting" | "Employee Idea" | "Other";
  opportunityStakeholders?: string;
  opportunityProposerId: string;
  opportunityPriority?: number;
  opportunityStatus: "Identified" | "Under Review" | "Prioritized" | "Archived";
  opportunityDateIdentified: string; // date format
  opportunityLastUpdated: string; // date-time format
}

interface Initiative {
  initiativeId: string;
  initiativeName: string;
  initiativeType: "New Product Development" | "Process Improvement" | "Technology Exploration" | "Market Research" | "Partnership Development" | "Platform Enhancement" | "Sustainability Initiative";
  initiativePhase: "Idea Definition" | "Concept Design" | "Prototype Development" | "Validation" | "Pilot Testing" | "Launched" | "Scaling" | "On Hold" | "Cancelled";
  initiativeManagerId: string;
  initiativeOpportunityId: string;
  initiativeTargetUser?: string;
  initiativeProblem?: string;
  initiativeSolution?: string;
  initiativeValueProposition?: string;
  initiativeSolutionHypothesis?: string;
  initiativeGoals?: string;
  initiativeObjective?: string;
  initiativeResults?: string;
  initiativeLearnings?: string;
  initiativeDecision?: "Persevere" | "Pivot" | "Discard" | "Validated for Handover";
  initiativeDecisionJustification?: string;
  initiativeNextSteps?: string;
  initiativeBudget?: number;
  initiativeResources?: string;
  initiativeRisks?: string;
  initiativeDateRegistered: string; // date format
  initiativeStartDate?: string; // date format
  initiativeEndDate?: string; // date format
  initiativeLastUpdated: string; // date-time format
  initiativeNotes?: string;
}

interface AppData {
  program: ProgramConfiguration;
  people: Person[];
  opportunities: Opportunity[];
  initiatives: Initiative[];
}

const schema = ref<JSONSchemaType<AppData> | null>(null);
const data = ref<AppData | null>(null);
const fileInput = ref<HTMLInputElement | null>(null); // Ref for the file input element
const ajv = new Ajv({ strict: false, formats: true }); // Configure Ajv and enable formats
addFormats(ajv); // Register formats with Ajv
let validate: any = null; // To hold the validation function

// Provide the full schema definitions reactively
const fullSchemaDefinitions = computed(() => schema.value?.definitions || null);
provide('fullSchemaDefinitions', fullSchemaDefinitions);


onMounted(async () => {
  // Load the JSON schema
  try {
    const schemaResponse = await fetch('/schema.json'); // Assuming schema.json is in the public folder
    schema.value = await schemaResponse.json();
    console.log('Schema loaded:', schema.value);

    // Compile the schema for validation
    if (schema.value) {
      validate = ajv.compile(schema.value);
    }


    // Initialize data based on schema
    if (schema.value && schema.value.properties) {
      const initialData: any = {};
      for (const key in schema.value.properties) {
        const property: any = schema.value.properties[key]; // Explicitly type property
        if (property.type === 'array') {
          initialData[key] = [];
        } else if (property.type === 'object') {
           if (property.$ref) {
             const definitionName = property.$ref.replace('#/definitions/', '');
             if (schema.value.definitions && schema.value.definitions[definitionName]) {
               initialData[key] = initializeObjectFromSchema(schema.value.definitions[definitionName]);
             } else {
                initialData[key] = {};
             }
           } else {
              initialData[key] = {};
           }
        } else if (property.default !== undefined) {
           initialData[key] = property.default;
        } else {
           initialData[key] = null; // Or a more appropriate default
        }
      }
      data.value = initialData as AppData; // Type assertion
       console.log('Initial data structure:', data.value);
    }

  } catch (error) {
    console.error('Error loading schema:', error);
  }
});

// Helper function to recursively initialize objects based on schema definitions
const initializeObjectFromSchema = (schemaObject: any) => {
  const initialData: any = {};
  if (schemaObject.properties) {
    for (const key in schemaObject.properties) {
      const property = schemaObject.properties[key];
      if (property.type === 'object') {
        if (property.$ref) {
          const definitionName = property.$ref.replace('#/definitions/', '');
           if (schema.value?.definitions && schema.value.definitions[definitionName]) { // Add null check for schema.value
             initialData[key] = initializeObjectFromSchema(schema.value.definitions[definitionName]);
           } else {
             initialData[key] = {};
           }
        } else {
           initialData[key] = {};
        }
      } else if (property.type === 'array') {
        initialData[key] = [];
      } else if (property.default !== undefined) {
        initialData[key] = property.default;
      } else {
        initialData[key] = null; // Or a more appropriate default based on type
      }
    }
  }
  return initialData;
};

// Function to handle file selection for import
const handleFileSelect = (event: Event) => {
  const files = (event.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    const file = files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);

        if (validate && validate(importedData)) {
          data.value = importedData;
          console.log('Data imported successfully and is valid:', importedData);
          alert('Data imported successfully!');
        } else {
          console.error('Imported data is invalid:', validate?.errors);
          alert('Error importing file. The data does not match the expected schema.');
        }
      } catch (error) {
        console.error('Error parsing imported file:', error);
        alert('Error importing file. Please ensure it is a valid JSON file.');
      }
    };

    reader.readAsText(file);
  }
};

// Function to handle data export
const handleExportData = () => {
  if (data.value) {
    const jsonData = JSON.stringify(data.value, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'innitiatives_data.json';
    link.click();
    URL.revokeObjectURL(url);
    console.log('Data exported successfully.');
  } else {
    alert('No data to export.');
  }
};

</script>

<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">iNNitiatives</h1>

    <div class="mb-4">
      <input type="file" ref="fileInput" @change="handleFileSelect" accept=".json" class="hidden" />
      <button @click="$refs.fileInput.click()" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">
        Import Data
      </button>
      <button @click="handleExportData" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
        Export Data
      </button>
    </div>

    <div v-if="schema && data">
      <SchemaForm :schema="schema" :data="data" />
    </div>
     <div v-else>
       Loading schema...
     </div>
  </div>
</template>

<style scoped>
/* Add any component-specific styles here if needed */
</style>

<style scoped>
/* Add any component-specific styles here if needed */
</style>
