export const ItemBadge = {
    props: {
        name: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            default: 'hash'
        },
        item: {
            type: Object,
            default: null
        },
        type: {
            type: String,
            default: ''
        }
    },
    methods: {
        handleClick() {
            if (this.item && this.type) {
                this.$emit('view-item-requested', { item: this.item, type: this.type });
            } else {
                this.$emit('view-item-requested');
            }
        }
    },
    template: `
        <span @click="handleClick" class="inline-flex items-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs cursor-pointer">
            <i :data-lucide="icon" class="w-3 h-3"></i>
            <span>{{ name }}</span>
        </span>
    `,
    mounted() {
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    },
    updated() {
        this.$nextTick(() => {
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        });
    }
};
