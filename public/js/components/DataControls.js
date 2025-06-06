export const DataControls = {
    template: `
        <div class="flex items-center space-x-3">
            <input type="file" ref="fileInput" @change="onFileSelected" accept=".json" class="hidden">
            <button @click="triggerFileInput" class="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-gray-300">
                <i data-lucide="upload" class="w-4 h-4"></i>
                <span>Load Data</span>
            </button>
        </div>
    `,
    methods: {
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        onFileSelected(event) {
            if (event.target.files && event.target.files[0]) {
                this.$emit('file-selected', event.target.files[0]);
            }
            // Reset file input to allow selecting the same file again if needed
            event.target.value = '';
        }
    },

};
