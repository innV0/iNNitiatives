export const HelpModal = {
    props: {
        show: Boolean,
        title: String,
        contentHtml: String
    },
    methods: {
        closeModal() {
            this.$emit('close-modal-requested');
        }
    },
    template: `
        <div v-if="show" class="fixed inset-0 bg-black/30 backdrop-blur-sm overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
            <div class="relative mx-auto border border-gray-300 w-full max-w-3xl shadow-2xl rounded-xl bg-white">
                <div class="flex justify-between items-center p-6 border-b border-gray-200">
                    <h3 class="text-xl font-semibold text-gray-900">{{ title }}</h3>
                    <button @click="closeModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                        <i data-lucide="x" class="w-6 h-6"></i>
                    </button>
                </div>
                <div class="view-item-modal-content p-6" v-html="contentHtml">
                </div> <!-- Added padding to match original styling if needed -->
            </div>
        </div>
    `,

};
