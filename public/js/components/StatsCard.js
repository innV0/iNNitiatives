export const StatsCard = {
    props: {
        title: String,
        value: [String, Number],
        icon: String,
        colorTheme: String, // e.g., 'green', 'yellow', 'purple'
        targetTab: String
    },
    computed: {
        iconColorClass() {
            // Determine icon color based on theme
            if (this.colorTheme === 'green') return 'text-green-600';
            if (this.colorTheme === 'yellow') return 'text-yellow-600';
            if (this.colorTheme === 'purple') return 'text-purple-600';
            return 'text-gray-600'; // Default
        },
        bgColorClass() {
            if (this.colorTheme === 'green') return 'bg-green-50';
            if (this.colorTheme === 'yellow') return 'bg-yellow-50';
            if (this.colorTheme === 'purple') return 'bg-purple-50';
            return 'bg-gray-50'; // Default
        }
    },
    template: `
        <div @click="$emit('card-clicked', targetTab)"
             class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm card-hover cursor-pointer">
            <div class="flex items-center justify-between">
                <div>
                    <p class="text-gray-600 text-sm font-medium">{{ title }}</p>
                    <p class="text-2xl font-bold text-gray-900 mt-1">{{ value }}</p>
                </div>
                <div :class="['w-12', 'h-12', bgColorClass, 'rounded-lg', 'flex', 'items-center', 'justify-center']">
                    <i :data-lucide="icon" :class="['w-6', 'h-6', iconColorClass]"></i>
                </div>
            </div>
        </div>
    `,

};
