export const NotificationHandler = {
    props: {
        notifications: {
            type: Array,
            default: () => []
        }
    },
    methods: {
        requestRemoveNotification(id) {
            this.$emit('remove-notification', id);
        }
    },
    template: `
        <div id="notifications-container" class="fixed top-4 right-4 z-50 space-y-2">
            <div v-for="notification in notifications" :key="notification.id"
                 :class="['notification', 'bg-white', 'border', 'rounded-lg', 'shadow-lg', 'p-4', 'max-w-sm',
                         notification.type === 'success' ? 'border-green-200' :
                         notification.type === 'error' ? 'border-red-200' : 'border-blue-200',
                         notification.show ? 'show' : '']">
                <div class="flex items-start">
                    <div :class="['flex-shrink-0', 'mr-3']">
                        <i :data-lucide="notification.type === 'success' ? 'check-circle' :
                                        notification.type === 'error' ? 'x-circle' : 'info'"
                           :class="[notification.type === 'success' ? 'text-green-500' :
                                   notification.type === 'error' ? 'text-red-500' : 'text-blue-500']"
                           class="w-5 h-5"></i>
                    </div>
                    <div class="flex-1">
                        <p :class="['text-sm', 'font-medium',
                                   notification.type === 'success' ? 'text-green-800' :
                                   notification.type === 'error' ? 'text-red-800' : 'text-blue-800']">
                            {{ notification.title }}
                        </p>
                        <p :class="['text-sm', 'mt-1',
                                   notification.type === 'success' ? 'text-green-600' :
                                   notification.type === 'error' ? 'text-red-600' : 'text-blue-600']">
                            {{ notification.message }}
                        </p>
                    </div>
                    <button @click="requestRemoveNotification(notification.id)"
                            class="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600">
                        <i data-lucide="x" class="w-4 h-4"></i>
                    </button>
                </div>
            </div>
        </div>
    `
};
