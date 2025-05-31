import { createRouter, createWebHistory } from 'vue-router';

// Import view components
import ProgramConfiguration from '../views/ProgramConfiguration.vue';
import PeopleManagement from '../views/PeopleManagement.vue';
import PersonDetailView from '../views/PersonDetailView.vue';
import PersonEditView from '../views/PersonEditView.vue';
import OpportunitiesDiscovery from '../views/OpportunitiesDiscovery.vue';
import OpportunityDetailView from '../views/OpportunityDetailView.vue';
import OpportunityEditView from '../views/OpportunityEditView.vue';
import InitiativeLifecycleManagement from '../views/InitiativeLifecycleManagement.vue';
import InitiativeDetailView from '../views/InitiativeDetailView.vue';
import InitiativeEditView from '../views/InitiativeEditView.vue';


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'ProgramConfiguration',
      component: ProgramConfiguration,
    },
    {
      path: '/people',
      name: 'PeopleManagement',
      component: PeopleManagement,
    },
    {
      path: '/people/:id',
      name: 'PersonDetailView',
      component: PersonDetailView,
      props: true, // Allows passing route params as props
    },
     {
      path: '/people/:id/edit',
      name: 'PersonEditView',
      component: PersonEditView,
      props: true, // Allows passing route params as props
    },
    {
      path: '/opportunities',
      name: 'OpportunitiesDiscovery',
      component: OpportunitiesDiscovery,
    },
     {
      path: '/opportunities/:id',
      name: 'OpportunityDetailView',
      component: OpportunityDetailView,
      props: true, // Allows passing route params as props
    },
     {
      path: '/opportunities/:id/edit',
      name: 'OpportunityEditView',
      component: OpportunityEditView,
      props: true, // Allows passing route params as props
    },
    {
      path: '/initiatives',
      name: 'InitiativeLifecycleManagement',
      component: InitiativeLifecycleManagement,
    },
    {
      path: '/initiatives/:id',
      name: 'InitiativeDetailView',
      component: InitiativeDetailView,
      props: true, // Allows passing route params as props
    },
    {
      path: '/initiatives/:id/edit',
      name: 'InitiativeEditView',
      component: InitiativeEditView,
      props: true, // Allows passing route params as props
    },
  ],
});

export default router;
