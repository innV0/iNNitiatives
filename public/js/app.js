import { APP_SCHEMA } from './appSchema.js';
import { appUtils } from './appUtils.js';
import { NotificationHandler } from './components/NotificationHandler.js';
import { DataControls } from './components/DataControls.js';
import { TabNavigation } from './components/TabNavigation.js';
import { StatsCard } from './components/StatsCard.js';
import { DashboardView } from './components/DashboardView.js';
import { ProgramView } from './components/ProgramView.js';
import { ItemModal } from './components/ItemModal.js';
import { HelpModal } from './components/HelpModal.js';
import { AiModal } from './components/AiModal.js';
import { ItemCard } from './components/ItemCard.js';
import { PeopleView } from './components/PeopleView.js';
import { OpportunitiesFilterControls } from './components/OpportunitiesFilterControls.js';
import { OpportunitiesView } from './components/OpportunitiesView.js';
import { InitiativesView } from './components/InitiativesView.js';
import { TableView } from './components/TableView.js';
import { TableFilterControls } from './components/TableFilterControls.js';
import { ItemBadge } from './components/ItemBadge.js';
import { FieldRenderer } from './components/FieldRenderer.js';
import { SearchSelect } from './components/SearchSelect.js';
import { getFieldMeta } from './fieldMeta.js';

const { createApp } = Vue; // Vue import

const lucideMixin = {
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

const app = createApp({
    data() {
        return {
            activeTab: 'dashboard',
            tabs: [
                { id: 'dashboard', name: 'Dashboard', icon: 'home' },
                { id: 'program', name: 'Program', icon: 'settings' },
                { id: 'people', name: 'People', icon: 'users' },
                { id: 'opportunities', name: 'Opportunities', icon: 'lightbulb' },
                { id: 'initiatives', name: 'iNNitiatives', icon: 'zap' }
            ],
            appData: {
                program: { programName: APP_SCHEMA.definitions.programConfiguration.properties.programName.default || "My Innovation Program" },
                people: [],
                opportunities: [],
                initiatives: []
            },
            showItemModal: false,
            itemModalTitle: '',
            itemModalActiveTab: 'view',
            itemModalFormData: {},
            itemModalFormFields: [],
            itemModalItemData: null,
            itemModalItemFields: [],
            currentEditType: null,
            currentEditId: null,
            showSaveAndDownload: false,
            notifications: [],
            notificationId: 0,
            peopleFilterField: '',
            peopleFilterValue: '',
            opportunityFilterField: '',
            opportunityFilterValue: '',
            initiativeFilterField: '',
            initiativeFilterValue: '',
            opportunitySortField: 'opportunityName',
            opportunitySortOrder: 'asc',
            initiativeSortField: 'iNNitiativeName',
            initiativeSortOrder: 'asc',
            peopleViewMode: 'grid',
            opportunitiesViewMode: 'table',
            initiativesViewMode: 'table',
            relatedItems: [],
            showHelpContentModal: false,
            helpModalTitle: '',
            renderedHelpContent: '',
            documentation: {},
            showAiAssistantModal: false,
            aiModalContextInfo: '',
            aiModalFullPrompt: '',
            aiModalAppJsonString: '',
            aiModalContextQuestionsHtml: ''
        }
    },
    computed: {
        isEmptyData() {
            const defaultProgramName = APP_SCHEMA.definitions.programConfiguration.properties.programName.default || "My Innovation Program";
            const hasNonDefaultProgram = this.appData.program &&
                this.appData.program.programName &&
                this.appData.program.programName !== defaultProgramName;
            const hasMeaningfulData = (this.appData.people && this.appData.people.length > 0) ||
                                   (this.appData.opportunities && this.appData.opportunities.length > 0) ||
                                   (this.appData.initiatives && this.appData.initiatives.length > 0);
            return !hasNonDefaultProgram && !hasMeaningfulData;
        },
        iNNitiativePhasesSummaryForDashboard() {
            const phases = {};
            (this.appData.initiatives || []).forEach(init => {
                const phase = init.iNNitiativePhase || 'Unknown';
                phases[phase] = (phases[phase] || 0) + 1;
            });
            return Object.entries(phases).map(([name, count]) => ({ name, count }));
        },
        summaryCards() {
            const mapping = {
                people: { icon: 'users', colorTheme: 'green', targetTab: 'people' },
                opportunities: { icon: 'lightbulb', colorTheme: 'yellow', targetTab: 'opportunities' },
                initiatives: { icon: 'zap', colorTheme: 'purple', targetTab: 'initiatives' }
            };
            const cards = [];
            Object.entries(APP_SCHEMA.properties).forEach(([key, prop]) => {
                if (prop.type === 'array') {
                    const base = mapping[key] || { icon: 'list', colorTheme: 'gray', targetTab: key };
                    cards.push({
                        title: prop.title || key,
                        value: (this.appData[key] || []).length,
                        icon: base.icon,
                        colorTheme: base.colorTheme,
                        targetTab: base.targetTab
                    });
                }
            });
            return cards;
        },
        kanbanPhases() {
            if (
                this.appData.program &&
                Array.isArray(this.appData.program.programStages) &&
                this.appData.program.programStages.length > 0
            ) {
                return this.appData.program.programStages;
            }
            const phaseSchema =
                APP_SCHEMA?.definitions?.iNNitiative?.properties?.iNNitiativePhase;
            return Array.isArray(phaseSchema?.enum) ? phaseSchema.enum : [];
        },
        initiativesByPhase() {
            const grouped = {};
            this.kanbanPhases.forEach(phase => { grouped[phase] = []; });
            (this.appData.initiatives || []).forEach(init => {
                if (grouped[init.iNNitiativePhase]) {
                    grouped[init.iNNitiativePhase].push(init);
                } else {
                    if (!grouped['Uncategorized']) grouped['Uncategorized'] = [];
                    grouped['Uncategorized'].push(init);
                }
            });
            return grouped;
        },
        topOpportunities() {
            return [...(this.appData.opportunities || [])]
                .sort((a, b) => (b.opportunityPriority || 0) - (a.opportunityPriority || 0))
                .slice(0, 3);
        },
        recentInitiatives() {
            return [...(this.appData.initiatives || [])]
                .sort((a, b) => new Date(b.iNNitiativeDateRegistered || 0) - new Date(a.iNNitiativeDateRegistered || 0))
                .slice(0, 5);
        },
        filteredPeople() {
            let people = [...(this.appData.people || [])];
            if (this.peopleFilterField) {
                people = people.filter(p => {
                    const val = p[this.peopleFilterField];
                    if (val === undefined || val === null) return false;
                    if (typeof val === 'string') {
                        return val.toLowerCase().includes((this.peopleFilterValue || '').toLowerCase());
                    }
                    return String(val) === this.peopleFilterValue;
                });
            }
            return people;
        },
        filteredAndSortedOpportunities() {
            let opportunities = [...(this.appData.opportunities || [])];
            if (this.opportunityFilterField) {
                opportunities = opportunities.filter(o => {
                    const val = o[this.opportunityFilterField];
                    if (val === undefined || val === null) return false;
                    if (typeof val === 'string') {
                        return val.toLowerCase().includes((this.opportunityFilterValue || '').toLowerCase());
                    }
                    return String(val) === this.opportunityFilterValue;
                });
            }
            opportunities.sort((a, b) => {
                let valA = a[this.opportunitySortField];
                let valB = b[this.opportunitySortField];
                if (this.opportunitySortField === 'opportunityPriority') {
                    valA = Number(valA || 0);
                    valB = Number(valB || 0);
                } else if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
                let comparison = 0;
                if (valA > valB) comparison = 1;
                else if (valA < valB) comparison = -1;
                return this.opportunitySortOrder === 'asc' ? comparison : -comparison;
            });
            return opportunities;
        },
        filteredAndSortedInitiatives() {
            let initiatives = [...(this.appData.initiatives || [])];
            if (this.initiativeFilterField) {
                initiatives = initiatives.filter(i => {
                    const val = i[this.initiativeFilterField];
                    if (val === undefined || val === null) return false;
                    if (typeof val === 'string') {
                        return val.toLowerCase().includes((this.initiativeFilterValue || '').toLowerCase());
                    }
                    return String(val) === this.initiativeFilterValue;
                });
            }
            initiatives.sort((a, b) => {
                let valA = a[this.initiativeSortField];
                let valB = b[this.initiativeSortField];
                if (typeof valA === 'string') {
                    valA = valA.toLowerCase();
                    valB = valB.toLowerCase();
                }
                let comparison = 0;
                if (valA > valB) comparison = 1;
                else if (valA < valB) comparison = -1;
                return this.initiativeSortOrder === 'asc' ? comparison : -comparison;
            });
            return initiatives;
        }
    },
    methods: {
        closeAiModal() { this.showAiAssistantModal = false; },
        async openAiModal(contextType, contextDataItem = null) {
            let type = contextType;
            let data = contextDataItem;
            if (typeof contextType === 'object' && contextType !== null) {
                type = contextType.context;
                data = contextType.data;
            }
            this.showAiAssistantModal = true;
            this.aiModalContextInfo = `Loading context for ${type}...`;
            this.aiModalFullPrompt = 'Loading full prompt...';
            this.aiModalAppJsonString = 'Loading application JSON...';
            this.aiModalContextQuestionsHtml = '<p>Loading questions...</p>';
            this.$nextTick(() => { if (typeof lucide !== 'undefined') lucide.createIcons(); });
            try {
                let contextInfo = `Section: ${type}`;
                let itemIdentifier = '';
                if (data) {
                    if (type === 'program') { itemIdentifier = data.programName || 'Program'; contextInfo = `Program: ${itemIdentifier}`; }
                    else if (type.endsWith('Item')) { itemIdentifier = data.personName || data.opportunityName || data.iNNitiativeName || 'Item'; const typeName = type.replace('Item', ''); contextInfo = `Item: "${itemIdentifier}" (Type: ${typeName.charAt(0).toUpperCase() + typeName.slice(1)})`; }
                    else { const typeName = type.replace('List', ''); contextInfo = `List View: ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}`; itemIdentifier = typeName; }
                } else if (type) { contextInfo = `Section: ${type.charAt(0).toUpperCase() + type.slice(1)}`; itemIdentifier = type; }
                this.aiModalContextInfo = contextInfo;
                const promptMdResponse = await fetch('./prompt.md');
                if (!promptMdResponse.ok) throw new Error('Failed to load prompt.md');
                const promptMdText = await promptMdResponse.text();
                this.aiModalAppJsonString = JSON.stringify(this.appData, null, 2);
                let questionsStringForPrompt = "";
                let questionsHtml = "<p>No specific questions for this context.</p>";
                try {
                    const promptsJsonResponse = await fetch('./prompt.json');
                    if (!promptsJsonResponse.ok) throw new Error('Failed to load prompt.json');
                    const promptsData = await promptsJsonResponse.json();
                    let promptKey = null;
                    if (type.includes('person') || type.includes('People')) promptKey = 'people_';
                    else if (type.includes('opportunity') || type.includes('Opportunities')) promptKey = 'Opportunities';
                    else if (type.includes('initiative') || type.includes('Initiatives')) promptKey = 'initiatives';
                    else if (type.includes('program')) promptKey = 'program';
                    if (promptKey && promptsData[promptKey]) {
                        let questionsArray = [];
                        if (type.endsWith('Item') && promptsData[promptKey].item) { questionsArray = promptsData[promptKey].item; questionsStringForPrompt += "\n\n--- ITEM-SPECIFIC CONTEXTUAL QUESTIONS ---\n"; }
                        else if (promptsData[promptKey].list) { questionsArray = promptsData[promptKey].list; questionsStringForPrompt += "\n\n--- CONTEXTUAL QUESTIONS (for list/section) ---\n"; }
                        else if (type === 'program' && promptsData[promptKey] && Array.isArray(promptsData[promptKey].questions)) { questionsArray = promptsData[promptKey].questions; questionsStringForPrompt += "\n\n--- CONTEXTUAL QUESTIONS ---\n"; }
                        if (questionsArray.length > 0) {
                            questionsHtml = '<ul>';
                            questionsArray.forEach(q => { let finalQuestion = q; if (itemIdentifier) { finalQuestion = q.replace(/{person_name}|{opportunity_name}|{initiative_name}|{program_name}/gi, itemIdentifier.replace(/\.\.\.$/, '')); } questionsHtml += `<li class="mb-1 p-1 bg-gray-100 rounded text-xs">${finalQuestion}</li>`; questionsStringForPrompt += '- ' + finalQuestion + '\n'; });
                            questionsHtml += '</ul>';
                        }
                    }
                } catch (e) { console.error("Error processing prompt.json:", e); questionsHtml = "<p>Error loading or processing contextual questions.</p>"; questionsStringForPrompt = "\nError loading contextual questions.\n"; }
                this.aiModalContextQuestionsHtml = questionsHtml;
                this.aiModalFullPrompt = `${promptMdText}\n\n--- CONTEXT ---\n${this.aiModalContextInfo}\n\n--- APPLICATION JSON ---\n${this.aiModalAppJsonString}${questionsStringForPrompt}`;
            } catch (error) { console.error('Error opening AI modal:', error); this.aiModalFullPrompt = `Error loading content: ${error.message}`; this.aiModalAppJsonString = `Error: ${error.message}`; this.aiModalContextQuestionsHtml = `<p>Error: ${error.message}</p>`; this.aiModalContextInfo = 'Error'; }
        },
        getFieldDescription(path) {
            const parts = path.split('.'); if (parts.length === 2) { const [sectionKey, fieldKey] = parts; const sectionSchemaDefinition = APP_SCHEMA.properties[sectionKey]; let definition; if (sectionSchemaDefinition && sectionSchemaDefinition.$ref) { definition = APP_SCHEMA.definitions[sectionSchemaDefinition.$ref.split('/').pop()]; } else if (sectionSchemaDefinition && sectionSchemaDefinition.type === 'array' && sectionSchemaDefinition.items && sectionSchemaDefinition.items.$ref) { definition = APP_SCHEMA.definitions[sectionSchemaDefinition.items.$ref.split('/').pop()]; } if (definition && definition.properties && definition.properties[fieldKey]) { return definition.properties[fieldKey].description || 'No description available.'; } } return 'No description available.';
        },
        getPerson(personId) { return (this.appData.people || []).find(p => p.personId === personId); },
        getPersonName(personId) { if (!personId) return 'Unknown'; const person = this.getPerson(personId); return person ? person.personName : personId; },
        getPersonAvatar(personId) { if (!personId) return `https://ui-avatars.com/api/?name=Unknown&background=64748b&color=fff&size=64`; const person = this.getPerson(personId); if (person && person.personImageUrl) return person.personImageUrl; const name = person ? person.personName : personId; return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=64`; },
        getPersonInitiativeCount(personId) { return (this.appData.initiatives || []).filter(init => init.iNNitiativeOwnerPersonId === personId).length; },
        getOpportunity(opportunityId) { return (this.appData.opportunities || []).find(o => o.opportunityId === opportunityId); },
        getOpportunityName(opportunityId) { if (!opportunityId) return 'No opportunity linked'; const opportunity = this.getOpportunity(opportunityId); return opportunity ? opportunity.opportunityName : opportunityId; },
        showNotification(title, message, type = 'info') { const notification = { id: ++this.notificationId, title, message, type, show: false }; this.notifications.push(notification); setTimeout(() => { notification.show = true; this.$nextTick(() => { lucide.createIcons(); }); }, 100); setTimeout(() => { this.removeNotification(notification.id); }, 10000); },
        removeNotification(id) { const index = this.notifications.findIndex(n => n.id === id); if (index > -1) { this.notifications[index].show = false; setTimeout(() => { this.notifications.splice(index, 1); }, 300); } },
        loadDataFile(file) { if (!file) return; const reader = new FileReader(); reader.onload = (e) => { try { const jsonData = JSON.parse(e.target.result); if (typeof jsonData === 'object' && jsonData !== null && 'program' in jsonData && 'people' in jsonData && 'opportunities' in jsonData && 'initiatives' in jsonData) { this.appData = jsonData; this.showNotification('Success', 'Data file loaded successfully!', 'success'); } else { this.showNotification('Error', 'Invalid data file: Missing one or more required top-level keys (program, people, opportunities, initiatives).', 'error'); } } catch (error) { this.showNotification('Error', `Error parsing JSON: ${error.message}`, 'error'); } }; reader.readAsText(file); },
        async loadSampleData() { try { const response = await fetch('./sample-data.json'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const sampleData = await response.json(); this.appData = sampleData; this.showNotification('Success', 'Sample data loaded successfully!', 'success'); } catch (error) { this.showNotification('Error', `Error loading sample data: ${error.message}`, 'error'); } },
        exportData(format = 'json') {
            try {
                const now = new Date();
                const timestamp =
                    now.getFullYear() +
                    '-' + String(now.getMonth() + 1).padStart(2, '0') +
                    '-' + String(now.getDate()).padStart(2, '0') +
                    '-' + String(now.getHours()).padStart(2, '0') +
                    String(now.getMinutes()).padStart(2, '0') +
                    String(now.getSeconds()).padStart(2, '0');

                let dataStr = '';
                let mime = 'application/json';
                let extension = 'json';

                if (format === 'markdown') {
                    dataStr = this.convertToMarkdown(this.appData);
                    mime = 'text/markdown';
                    extension = 'md';
                } else if (format === 'html') {
                    dataStr = this.convertToHtml(this.appData);
                    mime = 'text/html';
                    extension = 'html';
                } else {
                    dataStr = JSON.stringify(this.appData, null, 2);
                }

                const dataBlob = new Blob([dataStr], { type: mime });
                const url = URL.createObjectURL(dataBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `innit-data-${timestamp}.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                this.showNotification('Success', 'Data exported successfully!', 'success');
            } catch (error) {
                this.showNotification('Error', `Error exporting data: ${error.message}`, 'error');
            }
        },

        convertToMarkdown(data) {
            const sectionHeader = (title, level) => `${'#'.repeat(level)} ${title}\n`;
            const objectToMarkdown = (obj, level) => {
                let md = '';
                Object.entries(obj || {}).forEach(([key, value]) => {
                    const header = sectionHeader(this.$appUtils.formatFieldName(key), level);
                    if (Array.isArray(value)) {
                        md += header;
                        if (value.length === 0) return;
                        if (value.every(v => typeof v !== 'object')) {
                            value.forEach(v => { md += `- ${v}\n`; });
                        } else {
                            value.forEach((v, idx) => {
                                md += sectionHeader(`Item ${idx + 1}`, level + 1);
                                md += objectToMarkdown(v, level + 2);
                            });
                        }
                    } else if (typeof value === 'object' && value !== null) {
                        md += header;
                        md += objectToMarkdown(value, level + 1);
                    } else {
                        md += header + (value ?? '') + '\n';
                    }
                });
                return md;
            };

            let md = sectionHeader('Program', 1);
            md += objectToMarkdown(data.program || {}, 2);

            md += '\n' + sectionHeader('People', 1);
            (data.people || []).forEach((p, idx) => {
                md += sectionHeader(p.personName || `Person ${idx + 1}`, 2);
                md += objectToMarkdown(p, 3);
            });

            md += '\n' + sectionHeader('Opportunities', 1);
            (data.opportunities || []).forEach((o, idx) => {
                md += sectionHeader(o.opportunityName || `Opportunity ${idx + 1}`, 2);
                md += objectToMarkdown(o, 3);
            });

            md += '\n' + sectionHeader('Initiatives', 1);
            (data.initiatives || []).forEach((i, idx) => {
                md += sectionHeader(i.iNNitiativeName || `Initiative ${idx + 1}`, 2);
                md += objectToMarkdown(i, 3);
            });

            return md;
        },

        convertToHtml(data) {
            const md = this.convertToMarkdown(data);
            const lines = md.split('\n');
            let html = '';
            const headings = [];
            let inList = false;

            const slug = text => text.toLowerCase().replace(/[^a-z0-9]+/g, '-');

            lines.forEach(line => {
                const hMatch = line.match(/^(#+)\s+(.*)/);
                if (hMatch) {
                    if (inList) { html += '</ul>'; inList = false; }
                    const level = hMatch[1].length;
                    const text = hMatch[2];
                    const id = slug(text);
                    headings.push({ level, text, id });
                    html += `<h${level} id="${id}">${text}</h${level}>`;
                    return;
                }

                if (line.startsWith('- ')) {
                    if (!inList) { html += '<ul>'; inList = true; }
                    html += `<li>${line.substring(2)}</li>`;
                    return;
                }

                if (line.trim() === '') {
                    if (inList) { html += '</ul>'; inList = false; }
                    return;
                }

                if (inList) { html += '</ul>'; inList = false; }
                html += `<p>${line}</p>`;
            });
            if (inList) html += '</ul>';

            let toc = '<h1>Index</h1><ul>';
            headings.forEach(h => {
                toc += `<li style="margin-left:${(h.level - 1) * 20}px"><a href="#${h.id}">${h.text}</a></li>`;
            });
            toc += '</ul>';

            return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>iNNitiatives Export</title></head><body>${toc}${html}</body></html>`;
        },
        generateFormFields(schemaDefinition) {
            const fields = [];
            const properties = schemaDefinition.properties || {};
            const simpleStringArrayFields = [
                'programStages',
                'programDefaultOpportunityStatuses',
                'programDefaultInitiativeTypes',
                'initiativeGoals',
                'initiativeNextSteps',
                'initiativeResources',
                'initiativeRisks'
            ];

            for (const [key, prop] of Object.entries(properties)) {
                let effectiveEnum = prop.enum;

                if (this.currentEditType === 'initiative') {
                    if (
                        key === 'iNNitiativeType' &&
                        this.appData.program &&
                        this.appData.program.programDefaultInitiativeTypes &&
                        this.appData.program.programDefaultInitiativeTypes.length > 0
                    ) {
                        effectiveEnum = this.appData.program.programDefaultInitiativeTypes;
                    } else if (
                        key === 'iNNitiativePhase' &&
                        this.appData.program &&
                        this.appData.program.programStages &&
                        this.appData.program.programStages.length > 0
                    ) {
                        effectiveEnum = this.appData.program.programStages;
                    }
                } else if (this.currentEditType === 'opportunity') {
                    if (
                        key === 'opportunityStatus' &&
                        this.appData.program &&
                        this.appData.program.programDefaultOpportunityStatuses &&
                        this.appData.program.programDefaultOpportunityStatuses.length > 0
                    ) {
                        effectiveEnum = this.appData.program.programDefaultOpportunityStatuses;
                    }
                }

                fields.push({
                    key,
                    title: prop.title || appUtils.formatFieldName(key),
                    description: prop.description || 'No description available.',
                    type: prop.type,
                    format: prop.format,
                    enum: effectiveEnum,
                    minimum: prop.minimum,
                    maximum: prop.maximum,
                    readonly: prop.readonly || false,
                    relationshipType: prop.relationshipType,
                    isSimpleStringArray:
                        prop.type === 'array' &&
                        prop.items &&
                        prop.items.type === 'string' &&
                        simpleStringArrayFields.includes(key)
                });
            }

            fields.forEach(field => {
                const isIdField =
                    field.key === 'personId' ||
                    field.key === 'opportunityId' ||
                    field.key === 'iNNitiativeId';

                if (
                    (this.currentEditId && isIdField) ||
                    field.key === 'lastUpdated' ||
                    field.key === 'iNNitiativeDateRegistered' ||
                    field.key === 'opportunityLastUpdated'
                ) {
                    field.readonly = true;
                }

                if (
                    !this.currentEditId &&
                    isIdField &&
                    field.key !== 'lastUpdated' &&
                    field.key !== 'iNNitiativeDateRegistered' &&
                    field.key !== 'opportunityLastUpdated'
                ) {
                    if (
                        schemaDefinition.properties[field.key] &&
                        schemaDefinition.properties[field.key].readonly !== true
                    ) {
                        // field remains editable
                    }
                }
            });

            return fields;
        },

        prepareFormData(data, fields) {
            const formData = { ...data };
            fields.forEach(field => {
                if (field.isSimpleStringArray) {
                    if (typeof data[field.key] === 'string') {
                        formData[field.key] = data[field.key]
                            .split('\n')
                            .map(item => item.trim())
                            .filter(item => item !== '');
                    } else {
                        formData[field.key] = Array.isArray(data[field.key])
                            ? [...data[field.key]]
                            : [];
                    }
                } else if (field.type === 'array') {
                    formData[field.key + '_json'] = JSON.stringify(formData[field.key] || []);
                }
            });
            return formData;
        },

        processFormData(formData, fields) {
            const processedData = { ...formData };
            let parseErrorOccurred = false;

            fields.forEach(field => {
                if (field.isSimpleStringArray) {
                    processedData[field.key] = Array.isArray(formData[field.key])
                        ? formData[field.key].join('\n')
                        : '';
                } else if (field.type === 'array') {
                    try {
                        processedData[field.key] = JSON.parse(
                            formData[field.key + '_json'] || '[]'
                        );
                    } catch (e) {
                        this.showNotification(
                            'Error',
                            `Invalid JSON format for field: ${field.title}. Please correct it.`,
                            'error'
                        );
                        parseErrorOccurred = true;
                    }
                    delete processedData[field.key + '_json'];
                }
            });

            return parseErrorOccurred ? null : processedData;
        },
        editProgram() { this.itemModalTitle = 'Edit Program Configuration'; const schema = APP_SCHEMA.definitions.programConfiguration; this.currentEditType = 'program'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); if (!this.appData.program || Object.keys(this.appData.program).length === 0) { this.appData.program = { programName: APP_SCHEMA.definitions.programConfiguration.properties.programName.default || "My Innovation Program" }; } this.itemModalFormData = this.prepareFormData(this.appData.program, this.itemModalFormFields); this.itemModalItemData = this.appData.program; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => { const meta = getFieldMeta('program.' + key); return { key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType, icon: meta.icon, tooltip: meta.tooltip }; }); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        addPerson() { this.itemModalTitle = 'Add New Person'; const schema = APP_SCHEMA.definitions.person; this.currentEditType = 'person'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); let newPersonData = { personId: appUtils.generateUniqueId('PERSON') }; for(const key in schema.properties) { if(schema.properties[key].default !== undefined && newPersonData[key] === undefined) { newPersonData[key] = schema.properties[key].default; } } this.itemModalFormData = this.prepareFormData(newPersonData, this.itemModalFormFields); this.itemModalItemData = newPersonData; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => { const meta = getFieldMeta('person.' + key); return { key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType, icon: meta.icon, tooltip: meta.tooltip }; }); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        editPerson(person) { this.itemModalTitle = 'Edit Person'; const schema = APP_SCHEMA.definitions.person; this.currentEditType = 'person'; this.currentEditId = person.personId; this.itemModalFormFields = this.generateFormFields(schema); this.itemModalFormData = this.prepareFormData(person, this.itemModalFormFields); this.itemModalItemData = person; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => { const meta = getFieldMeta('person.' + key); return { key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType, icon: meta.icon, tooltip: meta.tooltip }; }); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        deletePerson(personId) { const linkedInitiatives = (this.appData.initiatives || []).filter(init => init.iNNitiativeOwnerPersonId === personId).length; const linkedOpportunities = (this.appData.opportunities || []).filter(opp => opp.opportunityProposerId === personId).length; let warningMessage = `Are you sure you want to delete person ID: ${personId}? This action cannot be undone.`; if (linkedInitiatives > 0 || linkedOpportunities > 0) { warningMessage = `Warning: This person is linked to ${linkedInitiatives} initiative(s) and ${linkedOpportunities} opportunity(s). Deleting them will leave these records without a valid reference. Proceed with deletion?`; } if (confirm(warningMessage)) { const index = (this.appData.people || []).findIndex(p => p.personId === personId); if (index !== -1) { this.appData.people.splice(index, 1); this.showNotification('Success', `Person ${personId} deleted successfully!`, 'success'); } else { this.showNotification('Error', `Person ${personId} not found.`, 'error'); } } },
        addOpportunity() { this.itemModalTitle = 'Add New Opportunity'; const schema = APP_SCHEMA.definitions.opportunity; this.currentEditType = 'opportunity'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); const today = new Date().toISOString().split('T')[0]; let newOppData = { opportunityId: appUtils.generateUniqueId('OPP'), opportunityDateIdentified: today, opportunityLastUpdated: new Date().toISOString() }; for(const key in schema.properties) { if(schema.properties[key].default !== undefined && newOppData[key] === undefined) { newOppData[key] = schema.properties[key].default; } if(key === "opportunityPriority" && newOppData[key] === undefined) newOppData[key] = 0; if(key === "opportunityStatus" && newOppData[key] === undefined) newOppData[key] = (this.appData.program && this.appData.program.programDefaultOpportunityStatuses && this.appData.program.programDefaultOpportunityStatuses.length > 0) ? this.appData.program.programDefaultOpportunityStatuses[0] : (schema.properties.opportunityStatus.enum ? schema.properties.opportunityStatus.enum[0] : ''); } this.itemModalFormData = this.prepareFormData(newOppData, this.itemModalFormFields); this.itemModalItemData = newOppData; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => { const meta = getFieldMeta('opportunity.' + key); return { key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType, icon: meta.icon, tooltip: meta.tooltip }; }); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        editOpportunity(opportunity) { this.itemModalTitle = 'Edit Opportunity'; const schema = APP_SCHEMA.definitions.opportunity; this.currentEditType = 'opportunity'; this.currentEditId = opportunity.opportunityId; this.itemModalFormFields = this.generateFormFields(schema); this.itemModalFormData = this.prepareFormData(opportunity, this.itemModalFormFields); this.itemModalItemData = opportunity; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => { const meta = getFieldMeta('opportunity.' + key); return { key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType, icon: meta.icon, tooltip: meta.tooltip }; }); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        deleteOpportunity(opportunityId) { const linkedInitiatives = (this.appData.initiatives || []).filter(init => init.iNNitiativeRelatedOpportunityId === opportunityId).length; let warningMessage = `Are you sure you want to delete opportunity ID: ${opportunityId}? This action cannot be undone.`; if (linkedInitiatives > 0) { warningMessage = `Warning: This opportunity is linked to ${linkedInitiatives} initiative(s). Deleting it will leave these initiatives without a valid reference. Proceed with deletion?`; } if (confirm(warningMessage)) { const index = (this.appData.opportunities || []).findIndex(o => o.opportunityId === opportunityId); if (index !== -1) { this.appData.opportunities.splice(index, 1); this.showNotification('Success', `Opportunity ${opportunityId} deleted successfully!`, 'success'); } else { this.showNotification('Error', `Opportunity ${opportunityId} not found.`, 'error'); } } },
        addInitiative() {
            this.itemModalTitle = 'Add New iNNitiative';
            const schema = APP_SCHEMA.definitions.iNNitiative;
            this.currentEditType = 'initiative';
            this.currentEditId = null;
            this.itemModalFormFields = this.generateFormFields(schema);
            let newInitData = {
                iNNitiativeId: appUtils.generateUniqueId('INN'),
                iNNitiativeDateRegistered: new Date().toISOString()
            };
            for (const key in schema.properties) {
                if (schema.properties[key].default !== undefined && newInitData[key] === undefined) {
                    newInitData[key] = schema.properties[key].default;
                }
                if (key === 'iNNitiativePhase' && newInitData[key] === undefined) {
                    newInitData[key] =
                        this.appData.program &&
                        this.appData.program.programStages &&
                        this.appData.program.programStages.length > 0
                            ? this.appData.program.programStages[0]
                            : schema.properties.iNNitiativePhase.enum
                            ? schema.properties.iNNitiativePhase.enum[0]
                            : '';
                }
                if (key === 'iNNitiativeType' && newInitData[key] === undefined) {
                    newInitData[key] =
                        this.appData.program &&
                        this.appData.program.programDefaultInitiativeTypes &&
                        this.appData.program.programDefaultInitiativeTypes.length > 0
                            ? this.appData.program.programDefaultInitiativeTypes[0]
                            : schema.properties.iNNitiativeType.enum
                            ? schema.properties.iNNitiativeType.enum[0]
                            : '';
                }
            }
            this.itemModalFormData = this.prepareFormData(newInitData, this.itemModalFormFields);
            this.showSaveAndDownload = true;
            this.itemModalActiveTab = 'edit';
            this.showItemModal = true;
        },
        editInitiative(initiative) { this.itemModalTitle = 'Edit iNNitiative'; const schema = APP_SCHEMA.definitions.iNNitiative; this.currentEditType = 'initiative'; this.currentEditId = initiative.iNNitiativeId; this.itemModalFormFields = this.generateFormFields(schema); this.itemModalFormData = this.prepareFormData(initiative, this.itemModalFormFields); this.itemModalItemData = initiative; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => { const meta = getFieldMeta('initiative.' + key); return { key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType, icon: meta.icon, tooltip: meta.tooltip }; }); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        deleteInitiative(iNNitiativeId) { if (confirm(`Are you sure you want to delete iNNitiative ID: ${iNNitiativeId}? This action cannot be undone.`)) { const index = (this.appData.initiatives || []).findIndex(i => i.iNNitiativeId === iNNitiativeId); if (index !== -1) { this.appData.initiatives.splice(index, 1); this.showNotification('Success', `Initiative ${iNNitiativeId} deleted successfully!`, 'success'); } else { this.showNotification('Error', `Initiative ${iNNitiativeId} not found.`, 'error'); } } },
        closeItemModal() { this.showItemModal = false; this.itemModalTitle = ''; this.itemModalFormData = {}; this.itemModalFormFields = []; this.itemModalItemData = null; this.itemModalItemFields = []; this.currentEditType = null; this.currentEditId = null; this.showSaveAndDownload = false; this.relatedItems = []; },
        saveForm(formDataFromModal) { this.performSave(formDataFromModal); },
        saveAndDownload(formDataFromModal) { this.performSave(formDataFromModal); this.$nextTick(() => { this.exportData(); }); },
        performSave(dataToSave) {
            try {
                let schemaDefinition;
                let requiredFields = [];
                const entityTitle = this.currentEditType.charAt(0).toUpperCase() + this.currentEditType.slice(1);

                if (this.currentEditType === 'program') {
                    schemaDefinition = APP_SCHEMA.definitions.programConfiguration;
                } else if (this.currentEditType === 'person') {
                    schemaDefinition = APP_SCHEMA.definitions.person;
                } else if (this.currentEditType === 'opportunity') {
                    schemaDefinition = APP_SCHEMA.definitions.opportunity;
                } else if (this.currentEditType === 'initiative') {
                    schemaDefinition = APP_SCHEMA.definitions.iNNitiative;
                }

                if (schemaDefinition && schemaDefinition.required) {
                    requiredFields = schemaDefinition.required;
                }

                for (const fieldName of requiredFields) {
                    const fieldDefinition = schemaDefinition.properties[fieldName];
                    const fieldTitle = (fieldDefinition ? fieldDefinition.title : '') || appUtils.formatFieldName(fieldName);
                    const value = dataToSave[fieldName];
                    if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
                        this.showNotification('Error', `Field "${fieldTitle}" is required for ${entityTitle}.`, 'error');
                        return;
                    }
                }

                const processedData = this.processFormData(dataToSave, this.itemModalFormFields);
                if (processedData === null) {
                    return;
                }

                if (this.currentEditType === 'program') {
                    processedData.programLastUpdated = new Date().toISOString();
                    this.appData.program = { ...this.appData.program, ...processedData };
                } else if (this.currentEditType === 'person') {
                    if (!this.appData.people) this.appData.people = [];
                    if (this.currentEditId) {
                        const index = this.appData.people.findIndex(p => p.personId === this.currentEditId);
                        if (index !== -1) this.appData.people.splice(index, 1, { ...this.appData.people[index], ...processedData });
                    } else {
                        this.appData.people.push(processedData);
                    }
                } else if (this.currentEditType === 'opportunity') {
                    if (!this.appData.opportunities) this.appData.opportunities = [];
                    processedData.opportunityLastUpdated = new Date().toISOString();
                    if (this.currentEditId) {
                        const index = this.appData.opportunities.findIndex(o => o.opportunityId === this.currentEditId);
                        if (index !== -1) this.appData.opportunities.splice(index, 1, { ...this.appData.opportunities[index], ...processedData });
                    } else {
                        this.appData.opportunities.push(processedData);
                    }
                } else if (this.currentEditType === 'initiative') {
                    if (!this.appData.initiatives) this.appData.initiatives = [];
                    processedData.iNNitiativeDateRegistered = new Date().toISOString();
                    if (this.currentEditId) {
                        const index = this.appData.initiatives.findIndex(i => i.iNNitiativeId === this.currentEditId);
                        if (index !== -1) this.appData.initiatives.splice(index, 1, { ...this.appData.initiatives[index], ...processedData });
                    } else {
                        this.appData.initiatives.push(processedData);
                    }
                }

                this.closeItemModal();
                this.showNotification('Success', `${entityTitle} data saved successfully!`, 'success');
            } catch (error) {
                this.showNotification('Error', `Error saving data: ${error.message}`, 'error');
                console.error('Error in performSave:', error);
            }
        },
        setSort(field, fieldProp, orderProp) {
            if (this[fieldProp] === field) {
                this[orderProp] = this[orderProp] === 'asc' ? 'desc' : 'asc';
            } else {
                this[fieldProp] = field;
                this[orderProp] = 'asc';
            }
            this.$nextTick(() => {
                if (typeof lucide !== 'undefined') lucide.createIcons();
            });
        },
        setOpportunitySort(field) { this.setSort(field, 'opportunitySortField', 'opportunitySortOrder'); },
        // Event handlers for OpportunitiesView component
        handleAddOpportunityRequested() { this.addOpportunity(); },
        handleOpportunityFiltersChanged(filter) { this.opportunityFilterField = filter.field; this.opportunityFilterValue = filter.value; },
        handleClearOpportunityFilters() { this.opportunityFilterField = ''; this.opportunityFilterValue = ''; },
        handleOpportunitySortRequested(field) {  this.setOpportunitySort(field); },
        setInitiativeSort(field) { this.setSort(field, 'initiativeSortField', 'initiativeSortOrder'); },
        // Event handlers for InitiativesView component
        handleAddInitiativeRequested() { this.addInitiative(); },
        handleInitiativeSortRequested(field) { this.setInitiativeSort(field); },
        handleInitiativeFilterChanged(filter) { this.initiativeFilterField = filter.field; this.initiativeFilterValue = filter.value; },
        handleClearInitiativeFilter() { this.initiativeFilterField = ''; this.initiativeFilterValue = ''; },
        togglePeopleViewMode() {
            this.peopleViewMode = this.peopleViewMode === 'grid' ? 'table' : 'grid';
            localStorage.setItem('peopleViewMode', this.peopleViewMode);
        },
        handlePeopleFilterChanged(filter) { this.peopleFilterField = filter.field; this.peopleFilterValue = filter.value; },
        handleClearPeopleFilter() { this.peopleFilterField = ''; this.peopleFilterValue = ''; },
        toggleOpportunitiesViewMode() {
            this.opportunitiesViewMode = this.opportunitiesViewMode === 'grid' ? 'table' : 'grid';
            localStorage.setItem('opportunitiesViewMode', this.opportunitiesViewMode);
        },
        toggleInitiativesViewMode() {
            this.initiativesViewMode = this.initiativesViewMode === 'grid' ? 'table' : 'grid';
            localStorage.setItem('initiativesViewMode', this.initiativesViewMode);
        },
        viewItem(item, type) {
            if (!item || !type) return;
            if (typeof item !== 'object') {
                if (type === 'person') item = this.getPerson(item);
                else if (type === 'opportunity') item = this.getOpportunity(item);
                else if (type === 'initiative') item = (this.appData.initiatives || []).find(i => i.iNNitiativeId === item);
                else if (type === 'program') item = this.appData.program;
                if (!item) return;
            }
            this.itemModalItemData = item;
            this.itemModalTitle = `View ${type.charAt(0).toUpperCase() + type.slice(1)}: ${item.iNNitiativeName || item.opportunityName || item.personName || item.programName}`;
            let schemaDefinition;
            if (type === 'program') schemaDefinition = APP_SCHEMA.definitions.programConfiguration;
            else if (type === 'person') schemaDefinition = APP_SCHEMA.definitions.person;
            else if (type === 'opportunity') schemaDefinition = APP_SCHEMA.definitions.opportunity;
            else if (type === 'initiative') schemaDefinition = APP_SCHEMA.definitions.iNNitiative;
            this.itemModalItemFields = Object.entries(schemaDefinition.properties || {}).map(([key, prop]) => ({
                key: key,
                title: prop.title || appUtils.formatFieldName(key),
                description: prop.description || 'No description available.',
                type: prop.type,
                format: prop.format,
                relationshipType: prop.relationshipType,
            }));
            this.itemModalFormFields = this.generateFormFields(schemaDefinition);
            this.itemModalFormData = this.prepareFormData(item, this.itemModalFormFields);
            this.findRelatedItems(item, type);
            this.itemModalActiveTab = 'view'; this.showItemModal = true;
        },
        findRelatedItems(item, type) {
            this.relatedItems = [];
            if (!item || !type || !this.appData) return;

            if (type === 'person') {
                (this.appData.opportunities || []).forEach(opp => {
                    if (opp.opportunityProposerId === item.personId) {
                        this.relatedItems.push({
                            id: opp.opportunityId,
                            name: opp.opportunityName,
                            type: 'opportunity',
                            item: opp
                        });
                    }
                });
                (this.appData.initiatives || []).forEach(init => {
                    if (init.iNNitiativeOwnerPersonId === item.personId) {
                        this.relatedItems.push({
                            id: init.iNNitiativeId,
                            name: init.iNNitiativeName,
                            type: 'initiative',
                            item: init
                        });
                    }
                });
            } else if (type === 'opportunity') {
                (this.appData.initiatives || []).forEach(init => {
                    if (init.iNNitiativeRelatedOpportunityId === item.opportunityId) {
                        this.relatedItems.push({
                            id: init.iNNitiativeId,
                            name: init.iNNitiativeName,
                            type: 'initiative',
                            item: init
                        });
                    }
                });
            } else if (type === 'initiative') {
                if (item.iNNitiativeOwnerPersonId) {
                    const manager = this.getPerson(item.iNNitiativeOwnerPersonId);
                    if (manager) {
                        this.relatedItems.push({
                            id: manager.personId,
                            name: manager.personName,
                            type: 'person',
                            item: manager
                        });
                    }
                }
                if (item.iNNitiativeRelatedOpportunityId) {
                    const opportunity = this.getOpportunity(item.iNNitiativeRelatedOpportunityId);
                    if (opportunity) {
                        this.relatedItems.push({
                            id: opportunity.opportunityId,
                            name: opportunity.opportunityName,
                            type: 'opportunity',
                            item: opportunity
                        });
                    }
                }
            }
        },
        async fetchDocumentation() { try { const response = await fetch('./docs.md'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const markdown = await response.text(); this.parseDocumentation(markdown); } catch (error) { console.error("Error fetching documentation:", error); this.showNotification('Error', 'Failed to load documentation.', 'error'); } },
        parseDocumentation(markdown) { const lines = markdown.split('\n'); let currentEntity = null; let currentField = null; let descriptionLines = []; this.documentation = {}; for (const line of lines) { const entityMatch = line.match(/^##\s+(.+)\s+\(`(\w+)`\)/); const fieldMatch = line.match(/^###\s+`(\w+)`/); if (entityMatch) { if (currentField && descriptionLines.length > 0) { this.documentation[currentEntity][currentField] = descriptionLines.join('\n').trim(); } currentEntity = entityMatch[2]; this.documentation[currentEntity] = {}; currentField = null; descriptionLines = []; } else if (fieldMatch) { if (currentField && descriptionLines.length > 0) { this.documentation[currentEntity][currentField] = descriptionLines.join('\n').trim(); } currentField = fieldMatch[1]; descriptionLines = []; } else if (currentField !== null) { descriptionLines.push(line); } } if (currentField && descriptionLines.length > 0) { this.documentation[currentEntity][currentField] = descriptionLines.join('\n').trim(); } console.log("Parsed Documentation:", this.documentation); },
        showHelp(fieldKey, entityType) { const entityKey = entityType === 'initiative' ? 'initiative' : entityType === 'opportunity' ? 'opportunity' : entityType === 'person' ? 'person' : 'program'; const markdownContent = this.documentation[entityKey] ? this.documentation[entityKey][fieldKey] : null; if (markdownContent) { this.helpModalTitle = `Help: ${appUtils.formatFieldName(fieldKey)}`; const renderedHtml = marked.parse(markdownContent); this.renderedHelpContent = DOMPurify.sanitize(renderedHtml); this.showHelpContentModal = true; this.$nextTick(() => { lucide.createIcons(); }); } else { this.showNotification('Info', 'Documentation not available for this field.', 'info'); } },
        closeHelpModal() { this.showHelpContentModal = false; this.helpModalTitle = ''; this.renderedHelpContent = ''; },
         adjustModalPositions() {
            const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/30');
            modals.forEach((modal, index) => {
                const offset = index * 20; // 20px offset per modal
                modal.style.zIndex = 50 + index;
                const modalContent = modal.querySelector('.relative.mx-auto');
                if (modalContent) {
                    modalContent.style.transform = `translate(-50%, -50%) translate(${offset}px, ${offset}px)`;
                    modalContent.style.top = '50%';
                    modalContent.style.left = '50%';
                }
            });
        }
    },
    // --- LIFECYCLE HOOKS ---
    mounted() {
        const ppl = localStorage.getItem('peopleViewMode');
        const opp = localStorage.getItem('opportunitiesViewMode');
        const ini = localStorage.getItem('initiativesViewMode');
        if (ppl) this.peopleViewMode = ppl;
        if (opp) this.opportunitiesViewMode = opp;
        if (ini) this.initiativesViewMode = ini;
        this.$nextTick(() => {
            lucide.createIcons();
        });
        this.fetchDocumentation(); // Fetch documentation on mount
    },
    updated() {
        this.$nextTick(() => {
            lucide.createIcons();
        });
    }
});

// Expose appUtils and APP_SCHEMA to the global context of the Vue app instance
app.config.globalProperties.$appUtils = appUtils;
app.config.globalProperties.$APP_SCHEMA = APP_SCHEMA;
app.mixin(lucideMixin);

// Register components
app.component('notification-handler', NotificationHandler);
app.component('data-controls', DataControls);
app.component('tab-navigation', TabNavigation);
app.component('stats-card', StatsCard);
app.component('dashboard-view', DashboardView);
app.component('program-view', ProgramView);
app.component('item-modal', ItemModal);
app.component('help-modal', HelpModal);
app.component('ai-modal', AiModal);
app.component('item-card', ItemCard);
app.component('people-view', PeopleView);
app.component('opportunities-filter-controls', OpportunitiesFilterControls);
app.component('opportunities-view', OpportunitiesView);
app.component('initiatives-view', InitiativesView);
app.component('table-view', TableView);
app.component('table-filter-controls', TableFilterControls);
app.component('item-badge', ItemBadge);
app.component('field-renderer', FieldRenderer);
app.component('search-select', SearchSelect);

app.mount('#app');
