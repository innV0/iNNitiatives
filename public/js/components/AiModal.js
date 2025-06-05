import { APP_CONFIG } from '../config.js';

export const AiModal = {
    props: {
        show: Boolean,
        contextInfo: String,
        fullPrompt: String,
        appJsonString: String,
        contextQuestionsHtml: String
    },
    methods: {
        closeModal() {
            this.$emit('close-modal-requested');
        },
        copyPromptAndOpenAssistant() {
            navigator.clipboard.writeText(this.fullPrompt).catch(() => {}).finally(() => {
                window.open(APP_CONFIG.assistantUrl, '_blank');
            });
        }
    },
    template: `
        <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div class="relative mx-auto border border-gray-300 w-full max-w-3xl shadow-2xl rounded-xl bg-white modal-content">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-900">AI Assistant <span v-if="contextInfo" class="text-base font-normal text-gray-600">- {{ contextInfo }}</span></h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="p-6">
                    <div class="mb-4">
                        <label for="aiModalFullPromptTextarea" class="block text-sm font-medium text-gray-700 mb-1">Full Prompt (for copy-pasting):</label>
                        <textarea id="aiModalFullPromptTextarea" :value="fullPrompt" rows="15" readonly class="w-full p-2 border border-gray-300 rounded-md shadow-sm text-xs bg-gray-50"></textarea>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <h4 class="text-md font-semibold mb-1 text-gray-700">Application JSON (Snapshot):</h4>
                            <pre v-text="appJsonString" class="bg-gray-50 p-2.5 rounded-md overflow-x-auto max-h-60 border border-gray-200 text-xs"></pre>
                        </div>
                        <div>
                            <h4 class="text-md font-semibold mb-1 text-gray-700">Contextual Questions:</h4>
                            <div v-html="contextQuestionsHtml" class="bg-gray-50 p-2.5 rounded-md max-h-60 overflow-y-auto border border-gray-200 text-xs prose prose-sm"></div>
                        </div>
                    </div>
                    <div class="flex flex-col sm:flex-row justify-center items-center pt-4 border-t mt-4">
                        <button @click="copyPromptAndOpenAssistant" class="text-blue-600 hover:text-blue-700 font-semibold text-sm">
                            Copiar en inglés, copiar prompt y abrir AI Assistant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,

};
