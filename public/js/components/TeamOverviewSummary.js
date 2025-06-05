export const TeamOverviewSummary = {
    props: {
        teamMembers: { // Expects already sliced array
            type: Array,
            default: () => []
        },
        getPersonAvatarFn: Function,
        getPersonInitiativeCountFn: Function
    },
    template: `
        <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i data-lucide="users" class="w-5 h-5 mr-2 text-green-600"></i>
                Team Overview
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div v-if="teamMembers.length === 0" class="text-sm text-gray-500 md:col-span-2 lg:col-span-3">No team members to display.</div>
                <div v-for="person in teamMembers" :key="person.personId" class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <img v-if="getPersonAvatarFn" :src="getPersonAvatarFn(person.personId)"
                         :alt="person.personName"
                         class="w-10 h-10 rounded-full object-cover border-2 border-gray-200">
                    <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate" :title="person.personName">{{ person.personName }}</p>
                        <p v-if="getPersonInitiativeCountFn" class="text-xs text-gray-600">{{ getPersonInitiativeCountFn(person.personId) }} initiatives</p>
                    </div>
                </div>
            </div>
        </div>
    `,
    
};
