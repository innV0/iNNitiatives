export const appUtils = {
    formatFieldName(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    },
    generateUniqueId(prefix = 'item') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },
    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 'Invalid Date';
            }
            // Format as YYYY-MM-DD
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        } catch {
            return 'Invalid Date';
        }
    },
    formatNumber(num) {
        if (num === undefined || num === null || isNaN(Number(num))) return '0';
        return new Intl.NumberFormat().format(Number(num));
    },
    getPriorityClass(priority) {
        const p = Number(priority);
        if (isNaN(p)) return 'priority-low';
        if (p >= 8) return 'priority-high';
        if (p >= 5) return 'priority-medium';
        return 'priority-low';
    },
    getPhaseClass(phase) {
        switch (phase) {
            case 'Launched':
            case 'Scaling':
            case 'Completed':
                return 'phase-completed';
            case 'On Hold':
                return 'phase-hold';
            case 'Cancelled':
                return 'phase-cancelled';
            case 'Idea Definition':
            case 'Concept Design':
            case 'Prototype Development':
            case 'Validation':
            case 'Pilot Testing':
                 return 'phase-active';
            default:
                return 'phase-active';
        }
    },
    getPhaseColor(phase) {
        switch (phase) {
            case 'Launched':
            case 'Scaling':
            case 'Completed':
                return 'bg-green-500';
            case 'On Hold':
            case 'Archived':
                return 'bg-yellow-500';
            case 'Cancelled':
            case 'Discard':
                return 'bg-red-500';
            case 'Idea Definition':
            case 'Concept Design':
            case 'Prototype Development':
            case 'Validation':
            case 'Pilot Testing':
            case 'Persevere':
            case 'Pivot':
            case 'Validated for Handover':
                 return 'bg-blue-500';
            default:
                return 'bg-blue-500';
        }
    }
};
