export const ProgramView = {
    props: {
        programData: Object,
        getFieldDescriptionFn: Function,
        formatFieldNameFn: Function,
    },
    emits: ['edit-program-requested', 'open-ai-modal-requested', 'export-requested'],
    data() {
        return { showExportMenu: false };
    },
    template: `
        <section class="space-y-6">
            <div class="flex justify-between items-center">
                <div>
                    <h2 class="text-2xl font-bold text-gray-900">Program Configuration</h2>
                    <p class="text-gray-600 mt-1">Manage your innovation program settings and objectives</p>
                </div>
                <div class="flex space-x-3 relative">
                    <button @click="$emit('edit-program-requested')" class="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="edit" class="w-4 h-4"></i>
                        <span>Edit Program</span>
                    </button>
                    <button @click="$emit('open-ai-modal-requested', { context: 'program', data: programData })" title="AI Assistant for Program" class="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                        <i data-lucide="bot" class="w-4 h-4"></i>
                        <span>AI</span>
                    </button>
                    <div @mouseenter="showExportMenu = true" @mouseleave="showExportMenu = false" class="relative">
                        <button @click="showExportMenu = !showExportMenu" class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors border border-gray-300">
                            <i data-lucide="download" class="w-4 h-4"></i>
                            <span>Export</span>
                        </button>
                        <div v-if="showExportMenu" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button @click="$emit('export-requested', 'json'); showExportMenu = false" class="block w-full text-left px-4 py-2 hover:bg-gray-100">JSON</button>
                            <button @click="$emit('export-requested', 'markdown'); showExportMenu = false" class="block w-full text-left px-4 py-2 hover:bg-gray-100">Markdown</button>
                            <button @click="$emit('export-requested', 'html'); showExportMenu = false" class="block w-full text-left px-4 py-2 hover:bg-gray-100">HTML</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div v-if="programData" class="grid grid-cols-1 gap-6">
                    <div v-for="(value, key) in programData" :key="key" class="space-y-2 p-4 bg-gray-50 rounded-lg border">
                        <dt class="text-sm font-medium text-gray-600 flex items-center">
                            <span class="tooltip-container">
                                <i class="tooltip-icon">?</i>
                                <span class="tooltip-text">{{ getFieldDescriptionFn('program.' + key) }}</span>
                            </span>
                            {{ formatFieldNameFn(key) }}
                        </dt>
                        <dd class="text-gray-900">
                            <div v-if="Array.isArray(value)">
                                <ul v-if="value.length > 0" class="list-disc list-inside">
                                    <li v-for="(item, index) in value" :key="index">{{ item }}</li>
                                </ul>
                                <span v-else class="text-gray-500 italic">No items defined</span>
                            </div>
                            <div v-else-if="typeof value === 'object' && value !== null && Object.keys(value).length > 0" class="bg-gray-50 rounded-lg p-4 space-y-2 border">
                                <div v-for="(subValue, subKey) in value" :key="subKey">
                                    <span class="text-gray-600 text-sm">{{ formatFieldNameFn(subKey) }}:</span>
                                    <span class="text-gray-900 ml-2">{{ subValue }}</span>
                                </div>
                            </div>
                            <div v-else-if="key.includes('Objectives') || key.includes('Scope') || key.includes('Indicators') || key.includes('Governance') || key.includes('Funding') || key.includes('Reporting') || key.includes('businessInfo')" class="whitespace-pre-wrap">{{ value || 'Not specified' }}</div>
                            <span v-else class="text-gray-900">{{ value || 'Not specified' }}</span>
                        </dd>
                    </div>
                </div>
                 <div v-else class="text-center text-gray-500 py-8">
                    No program data has been loaded or defined.
                </div>
            </div>
        </section>
    `,

};
