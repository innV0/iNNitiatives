import { APP_SCHEMA } from './appSchema.js';
import { appUtils } from './appUtils.js';
import { NotificationHandler } from './components/NotificationHandler.js';
import { DataControls } from './components/DataControls.js';
import { TabNavigation } from './components/TabNavigation.js';
import { StatsCard } from './components/StatsCard.js';
import { KanbanColumn } from './components/KanbanColumn.js';
import { InitiativesByPhaseSummary } from './components/InitiativesByPhaseSummary.js';
import { TopOpportunitiesSummary } from './components/TopOpportunitiesSummary.js';
import { TeamOverviewSummary } from './components/TeamOverviewSummary.js';
import { RecentActivitySummary } from './components/RecentActivitySummary.js';
import { DashboardView } from './components/DashboardView.js';
import { ProgramView } from './components/ProgramView.js';
import { ItemModal } from './components/ItemModal.js';
import { HelpModal } from './components/HelpModal.js';
import { AiModal } from './components/AiModal.js';
import { PersonCard } from './components/PersonCard.js';
import { PeopleView } from './components/PeopleView.js';
import { OpportunityListItem } from './components/OpportunityListItem.js';
import { OpportunitiesFilterControls } from './components/OpportunitiesFilterControls.js';
import { OpportunitiesView } from './components/OpportunitiesView.js';
import { InitiativeListItem } from './components/InitiativeListItem.js';
import { InitiativesView } from './components/InitiativesView.js';
import { TableView } from './components/TableView.js';
import { ItemBadge } from './components/ItemBadge.js';

const { createApp } = Vue; // Vue import

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
            mainOpportunityFilterName: '',
            mainOpportunityFilterProposerId: '',
            mainOpportunityFilterStatus: '',
            opportunitySortField: 'opportunityName',
            opportunitySortOrder: 'asc',
            initiativeSortField: 'initiativeName',
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
        initiativePhasesSummaryForDashboard() {
            const phases = {};
            (this.appData.initiatives || []).forEach(init => {
                const phase = init.initiativePhase || 'Unknown';
                phases[phase] = (phases[phase] || 0) + 1;
            });
            return Object.entries(phases).map(([name, count]) => ({ name, count }));
        },
        kanbanPhases() {
            if (this.appData.program && this.appData.program.programStages && this.appData.program.programStages.length > 0) {
                return this.appData.program.programStages;
            }
            return APP_SCHEMA.definitions.initiative.properties.initiativePhase.enum || [];
        },
        initiativesByPhase() {
            const grouped = {};
            this.kanbanPhases.forEach(phase => { grouped[phase] = []; });
            (this.appData.initiatives || []).forEach(init => {
                if (grouped[init.initiativePhase]) {
                    grouped[init.initiativePhase].push(init);
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
                .sort((a, b) => new Date(b.initiativeLastUpdated || 0) - new Date(a.initiativeLastUpdated || 0))
                .slice(0, 5);
        },
        filteredAndSortedOpportunities() {
            let opportunities = [...(this.appData.opportunities || [])];
            if (this.mainOpportunityFilterName) {
                opportunities = opportunities.filter(opp =>
                    opp.opportunityName.toLowerCase().includes(this.mainOpportunityFilterName.toLowerCase()));
            }
            if (this.mainOpportunityFilterProposerId) {
                opportunities = opportunities.filter(opp => opp.opportunityProposerId === this.mainOpportunityFilterProposerId);
            }
            if (this.mainOpportunityFilterStatus) {
                opportunities = opportunities.filter(opp => opp.opportunityStatus === this.mainOpportunityFilterStatus);
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
                    else if (type.endsWith('Item')) { itemIdentifier = data.personName || data.opportunityName || data.initiativeName || 'Item'; const typeName = type.replace('Item', ''); contextInfo = `Item: "${itemIdentifier}" (Type: ${typeName.charAt(0).toUpperCase() + typeName.slice(1)})`; }
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
        getPersonInitiativeCount(personId) { return (this.appData.initiatives || []).filter(init => init.initiativeManagerId === personId).length; },
        getOpportunity(opportunityId) { return (this.appData.opportunities || []).find(o => o.opportunityId === opportunityId); },
        getOpportunityName(opportunityId) { if (!opportunityId) return 'No opportunity linked'; const opportunity = this.getOpportunity(opportunityId); return opportunity ? opportunity.opportunityName : opportunityId; },
        showNotification(title, message, type = 'info') { const notification = { id: ++this.notificationId, title, message, type, show: false }; this.notifications.push(notification); setTimeout(() => { notification.show = true; this.$nextTick(() => { lucide.createIcons(); }); }, 100); setTimeout(() => { this.removeNotification(notification.id); }, 10000); },
        removeNotification(id) { const index = this.notifications.findIndex(n => n.id === id); if (index > -1) { this.notifications[index].show = false; setTimeout(() => { this.notifications.splice(index, 1); }, 300); } },
        loadDataFile(file) { if (!file) return; const reader = new FileReader(); reader.onload = (e) => { try { const jsonData = JSON.parse(e.target.result); if (typeof jsonData === 'object' && jsonData !== null && 'program' in jsonData && 'people' in jsonData && 'opportunities' in jsonData && 'initiatives' in jsonData) { this.appData = jsonData; this.showNotification('Success', 'Data file loaded successfully!', 'success'); } else { this.showNotification('Error', 'Invalid data file: Missing one or more required top-level keys (program, people, opportunities, initiatives).', 'error'); } } catch (error) { this.showNotification('Error', `Error parsing JSON: ${error.message}`, 'error'); } }; reader.readAsText(file); },
        async loadSampleData() { try { const response = await fetch('./sample-data.json'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const sampleData = await response.json(); this.appData = sampleData; this.showNotification('Success', 'Sample data loaded successfully!', 'success'); } catch (error) { this.showNotification('Error', `Error loading sample data: ${error.message}`, 'error'); } },
        exportData() { try { const now = new Date(); const timestamp = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + '-' + String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0'); const dataStr = JSON.stringify(this.appData, null, 2); const dataBlob = new Blob([dataStr], { type: 'application/json' }); const url = URL.createObjectURL(dataBlob); const link = document.createElement('a'); link.href = url; link.download = `innit-data-${timestamp}.json`; document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url); this.showNotification('Success', 'Data exported successfully!', 'success'); } catch (error) { this.showNotification('Error', `Error exporting data: ${error.message}`, 'error'); } },
        generateFormFields(schemaDefinition) { const fields = []; const properties = schemaDefinition.properties || {}; const simpleStringArrayFields = [ 'programStages', 'programDefaultOpportunityStatuses', 'programDefaultInitiativeTypes', 'initiativeGoals', 'initiativeNextSteps', 'initiativeResources', 'initiativeRisks' ]; for (const [key, prop] of Object.entries(properties)) { let effectiveEnum = prop.enum; if (this.currentEditType === 'initiative') { if (key === 'initiativeType' && this.appData.program && this.appData.program.programDefaultInitiativeTypes && this.appData.program.programDefaultInitiativeTypes.length > 0) { effectiveEnum = this.appData.program.programDefaultInitiativeTypes; } else if (key === 'initiativePhase' && this.appData.program && this.appData.program.programStages && this.appData.program.programStages.length > 0) { effectiveEnum = this.appData.program.programStages; } } else if (this.currentEditType === 'opportunity') { if (key === 'opportunityStatus' && this.appData.program && this.appData.program.programDefaultOpportunityStatuses && this.appData.program.programDefaultOpportunityStatuses.length > 0) { effectiveEnum = this.appData.program.programDefaultOpportunityStatuses; } } fields.push({ key: key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, enum: effectiveEnum, minimum: prop.minimum, maximum: prop.maximum, readonly: prop.readonly || false, relationshipType: prop.relationshipType, isSimpleStringArray: prop.type === 'array' && prop.items && prop.items.type === 'string' && simpleStringArrayFields.includes(key) }); } fields.forEach(field => { if ( (this.currentEditId && (field.key === 'personId' || field.key === 'opportunityId' || field.key === 'initiativeId')) || field.key === 'lastUpdated' || field.key === 'initiativeLastUpdated' || field.key === 'opportunityLastUpdated') { field.readonly = true; } if (!this.currentEditId && (field.key === 'personId' || field.key === 'opportunityId' || field.key === 'initiativeId') && field.key !== 'lastUpdated' && field.key !== 'initiativeLastUpdated' && field.key !== 'opportunityLastUpdated') { if (schemaDefinition.properties[field.key] && schemaDefinition.properties[field.key].readonly !== true) { } } }); return fields; },
        prepareFormData(data, fields) { const formData = { ...data }; fields.forEach(field => { if (field.isSimpleStringArray) { if (typeof data[field.key] === 'string') { formData[field.key] = data[field.key].split('\n').map(item => item.trim()).filter(item => item !== ''); } else { formData[field.key] = Array.isArray(data[field.key]) ? [...data[field.key]] : []; } } else if (field.type === 'array') { formData[field.key + '_json'] = JSON.stringify(formData[field.key] || []); } }); return formData; },
        processFormData(formData, fields) { const processedData = { ...formData }; let parseErrorOccurred = false; fields.forEach(field => { if (field.isSimpleStringArray) { processedData[field.key] = Array.isArray(formData[field.key]) ? formData[field.key].join('\n') : ''; } else if (field.type === 'array') { try { processedData[field.key] = JSON.parse(formData[field.key + '_json'] || '[]'); } catch (e) { this.showNotification('Error', `Invalid JSON format for field: ${field.title}. Please correct it.`, 'error'); parseErrorOccurred = true; } delete processedData[field.key + '_json']; } }); return parseErrorOccurred ? null : processedData; },
        editProgram() { this.itemModalTitle = 'Edit Program Configuration'; const schema = APP_SCHEMA.definitions.programConfiguration; this.currentEditType = 'program'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); if (!this.appData.program || Object.keys(this.appData.program).length === 0) { this.appData.program = { programName: APP_SCHEMA.definitions.programConfiguration.properties.programName.default || "My Innovation Program" }; } this.itemModalFormData = this.prepareFormData(this.appData.program, this.itemModalFormFields); this.itemModalItemData = this.appData.program; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => ({ key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType })); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        addPerson() { this.itemModalTitle = 'Add New Person'; const schema = APP_SCHEMA.definitions.person; this.currentEditType = 'person'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); let newPersonData = { personId: appUtils.generateUniqueId('PERSON') }; for(const key in schema.properties) { if(schema.properties[key].default !== undefined && newPersonData[key] === undefined) { newPersonData[key] = schema.properties[key].default; } } this.itemModalFormData = this.prepareFormData(newPersonData, this.itemModalFormFields); this.itemModalItemData = newPersonData; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => ({ key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType })); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        editPerson(person) { this.itemModalTitle = 'Edit Person'; const schema = APP_SCHEMA.definitions.person; this.currentEditType = 'person'; this.currentEditId = person.personId; this.itemModalFormFields = this.generateFormFields(schema); this.itemModalFormData = this.prepareFormData(person, this.itemModalFormFields); this.itemModalItemData = person; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => ({ key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType })); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        deletePerson(personId) { const linkedInitiatives = (this.appData.initiatives || []).filter(init => init.initiativeManagerId === personId).length; const linkedOpportunities = (this.appData.opportunities || []).filter(opp => opp.opportunityProposerId === personId).length; let warningMessage = `Are you sure you want to delete person ID: ${personId}? This action cannot be undone.`; if (linkedInitiatives > 0 || linkedOpportunities > 0) { warningMessage = `Warning: This person is linked to ${linkedInitiatives} initiative(s) and ${linkedOpportunities} opportunity(s). Deleting them will leave these records without a valid reference. Proceed with deletion?`; } if (confirm(warningMessage)) { const index = (this.appData.people || []).findIndex(p => p.personId === personId); if (index !== -1) { this.appData.people.splice(index, 1); this.showNotification('Success', `Person ${personId} deleted successfully!`, 'success'); } else { this.showNotification('Error', `Person ${personId} not found.`, 'error'); } } },
        addOpportunity() { this.itemModalTitle = 'Add New Opportunity'; const schema = APP_SCHEMA.definitions.opportunity; this.currentEditType = 'opportunity'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); const today = new Date().toISOString().split('T')[0]; let newOppData = { opportunityId: appUtils.generateUniqueId('OPP'), opportunityDateIdentified: today, opportunityLastUpdated: new Date().toISOString() }; for(const key in schema.properties) { if(schema.properties[key].default !== undefined && newOppData[key] === undefined) { newOppData[key] = schema.properties[key].default; } if(key === "opportunityPriority" && newOppData[key] === undefined) newOppData[key] = 0; if(key === "opportunityStatus" && newOppData[key] === undefined) newOppData[key] = (this.appData.program && this.appData.program.programDefaultOpportunityStatuses && this.appData.program.programDefaultOpportunityStatuses.length > 0) ? this.appData.program.programDefaultOpportunityStatuses[0] : (schema.properties.opportunityStatus.enum ? schema.properties.opportunityStatus.enum[0] : ''); } this.itemModalFormData = this.prepareFormData(newOppData, this.itemModalFormFields); this.itemModalItemData = newOppData; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => ({ key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType })); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        editOpportunity(opportunity) { this.itemModalTitle = 'Edit Opportunity'; const schema = APP_SCHEMA.definitions.opportunity; this.currentEditType = 'opportunity'; this.currentEditId = opportunity.opportunityId; this.itemModalFormFields = this.generateFormFields(schema); this.itemModalFormData = this.prepareFormData(opportunity, this.itemModalFormFields); this.itemModalItemData = opportunity; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => ({ key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType })); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        deleteOpportunity(opportunityId) { const linkedInitiatives = (this.appData.initiatives || []).filter(init => init.initiativeOpportunityId === opportunityId).length; let warningMessage = `Are you sure you want to delete opportunity ID: ${opportunityId}? This action cannot be undone.`; if (linkedInitiatives > 0) { warningMessage = `Warning: This opportunity is linked to ${linkedInitiatives} initiative(s). Deleting it will leave these initiatives without a valid reference. Proceed with deletion?`; } if (confirm(warningMessage)) { const index = (this.appData.opportunities || []).findIndex(o => o.opportunityId === opportunityId); if (index !== -1) { this.appData.opportunities.splice(index, 1); this.showNotification('Success', `Opportunity ${opportunityId} deleted successfully!`, 'success'); } else { this.showNotification('Error', `Opportunity ${opportunityId} not found.`, 'error'); } } },
        addInitiative() { this.itemModalTitle = 'Add New iNNitiative'; const schema = APP_SCHEMA.definitions.initiative; this.currentEditType = 'initiative'; this.currentEditId = null; this.itemModalFormFields = this.generateFormFields(schema); const today = new Date().toISOString().split('T')[0]; let newInitData = { initiativeId: appUtils.generateUniqueId('INN'), initiativeDateRegistered: today, initiativeLastUpdated: new Date().toISOString() }; for(const key in schema.properties) { if(schema.properties[key].default !== undefined && newInitData[key] === undefined) { newInitData[key] = schema.properties[key].default; } if(key === "initiativeBudget" && newInitData[key] === undefined) newInitData[key] = 0; if(key === "initiativePhase" && newInitData[key] === undefined) newInitData[key] = (this.appData.program && this.appData.program.programStages && this.appData.program.programStages.length > 0) ? this.appData.program.programStages[0] : (schema.properties.initiativePhase.enum ? schema.properties.initiativePhase.enum[0] : ''); if(key === "initiativeType" && newInitData[key] === undefined) newInitData[key] = (this.appData.program && this.appData.program.programDefaultInitiativeTypes && this.appData.program.programDefaultInitiativeTypes.length > 0) ? this.appData.program.programDefaultInitiativeTypes[0] : (schema.properties.initiativeType.enum ? schema.properties.initiativeType.enum[0] : ''); if(key === "initiativeDecision" && newInitData[key] === undefined) newInitData[key] = (schema.properties.initiativeDecision.enum ? schema.properties.initiativeDecision.enum[0] : ''); } this.itemModalFormData = this.prepareFormData(newInitData, this.itemModalFormFields); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        editInitiative(initiative) { this.itemModalTitle = 'Edit iNNitiative'; const schema = APP_SCHEMA.definitions.initiative; this.currentEditType = 'initiative'; this.currentEditId = initiative.initiativeId; this.itemModalFormFields = this.generateFormFields(schema); this.itemModalFormData = this.prepareFormData(initiative, this.itemModalFormFields); this.itemModalItemData = initiative; this.itemModalItemFields = Object.entries(schema.properties || {}).map(([key, prop]) => ({ key, title: prop.title || appUtils.formatFieldName(key), description: prop.description || 'No description available.', type: prop.type, format: prop.format, relationshipType: prop.relationshipType })); this.showSaveAndDownload = true; this.itemModalActiveTab = 'edit'; this.showItemModal = true; },
        deleteInitiative(initiativeId) { if (confirm(`Are you sure you want to delete iNNitiative ID: ${initiativeId}? This action cannot be undone.`)) { const index = (this.appData.initiatives || []).findIndex(i => i.initiativeId === initiativeId); if (index !== -1) { this.appData.initiatives.splice(index, 1); this.showNotification('Success', `Initiative ${initiativeId} deleted successfully!`, 'success'); } else { this.showNotification('Error', `Initiative ${initiativeId} not found.`, 'error'); } } },
        closeItemModal() { this.showItemModal = false; this.itemModalTitle = ''; this.itemModalFormData = {}; this.itemModalFormFields = []; this.itemModalItemData = null; this.itemModalItemFields = []; this.currentEditType = null; this.currentEditId = null; this.showSaveAndDownload = false; this.relatedItems = []; },
        saveForm(formDataFromModal) { this.performSave(formDataFromModal); },
        saveAndDownload(formDataFromModal) { this.performSave(formDataFromModal); this.$nextTick(() => { this.exportData(); }); },
        performSave(dataToSave) { try { let schemaDefinition; let requiredFields = []; const entityTitle = this.currentEditType.charAt(0).toUpperCase() + this.currentEditType.slice(1); if (this.currentEditType === 'program') { schemaDefinition = APP_SCHEMA.definitions.programConfiguration; } else if (this.currentEditType === 'person') { schemaDefinition = APP_SCHEMA.definitions.person; } else if (this.currentEditType === 'opportunity') { schemaDefinition = APP_SCHEMA.definitions.opportunity; } else if (this.currentEditType === 'initiative') { schemaDefinition = APP_SCHEMA.definitions.initiative; } if (schemaDefinition && schemaDefinition.required) { requiredFields = schemaDefinition.required; } for (const fieldName of requiredFields) { const fieldDefinition = schemaDefinition.properties[fieldName]; const fieldTitle = (fieldDefinition ? fieldDefinition.title : '') || appUtils.formatFieldName(fieldName); const value = dataToSave[fieldName]; if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) { this.showNotification('Error', `Field "${fieldTitle}" is required for ${entityTitle}.`, 'error'); return; } } const processedData = this.processFormData(dataToSave, this.itemModalFormFields); if (processedData === null) { return; } if (this.currentEditType === 'program') { this.appData.program = { ...this.appData.program, ...processedData }; } else if (this.currentEditType === 'person') { if (!this.appData.people) this.appData.people = []; if (this.currentEditId) { const index = this.appData.people.findIndex(p => p.personId === this.currentEditId); if (index !== -1) this.appData.people[index] = { ...this.appData.people[index], ...processedData }; } else { this.appData.people.push(processedData); } } else if (this.currentEditType === 'opportunity') { if (!this.appData.opportunities) this.appData.opportunities = []; if (this.currentEditId) { const index = this.appData.opportunities.findIndex(o => o.opportunityId === this.currentEditId); if (index !== -1) this.appData.opportunities[index] = { ...this.appData.opportunities[index], ...processedData }; } else { this.appData.opportunities.push(processedData); } } else if (this.currentEditType === 'initiative') { if (!this.appData.initiatives) this.appData.initiatives = []; processedData.initiativeLastUpdated = new Date().toISOString(); if (this.currentEditId) { const index = this.appData.initiatives.findIndex(i => i.initiativeId === this.currentEditId); if (index !== -1) this.appData.initiatives[index] = { ...this.appData.initiatives[index], ...processedData }; } else { this.appData.initiatives.push(processedData); } } this.closeItemModal(); this.showNotification('Success', `${entityTitle} data saved successfully!`, 'success'); } catch (error) { this.showNotification('Error', `Error saving data: ${error.message}`, 'error'); console.error("Error in performSave:", error); } },
        setOpportunitySort(field) { if (this.opportunitySortField === field) { this.opportunitySortOrder = this.opportunitySortOrder === 'asc' ? 'desc' : 'asc'; } else { this.opportunitySortField = field; this.opportunitySortOrder = 'asc'; } this.$nextTick(() => lucide.createIcons() ); },
        // Event handlers for OpportunitiesView component
        handleAddOpportunityRequested() { this.addOpportunity(); },
        handleOpportunityFiltersChanged(filters) { this.mainOpportunityFilterName = filters.name; this.mainOpportunityFilterProposerId = filters.proposerId; this.mainOpportunityFilterStatus = filters.status; },
        handleClearOpportunityFilters() {  this.mainOpportunityFilterName = ''; this.mainOpportunityFilterProposerId = ''; this.mainOpportunityFilterStatus = ''; },
        handleOpportunitySortRequested(field) {  this.setOpportunitySort(field); },
        setInitiativeSort(field) { if (this.initiativeSortField === field) { this.initiativeSortOrder = this.initiativeSortOrder === 'asc' ? 'desc' : 'asc'; } else { this.initiativeSortField = field; this.initiativeSortOrder = 'asc'; } this.$nextTick(() => lucide.createIcons() ); },
        // Event handlers for InitiativesView component
        handleAddInitiativeRequested() { this.addInitiative(); },
        handleInitiativeSortRequested(field) { this.setInitiativeSort(field); },
        togglePeopleViewMode() {
            this.peopleViewMode = this.peopleViewMode === 'grid' ? 'table' : 'grid';
            localStorage.setItem('peopleViewMode', this.peopleViewMode);
        },
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
                else if (type === 'initiative') item = (this.appData.initiatives || []).find(i => i.initiativeId === item);
                else if (type === 'program') item = this.appData.program;
                if (!item) return;
            }
            this.itemModalItemData = item;
            this.itemModalTitle = `View ${type.charAt(0).toUpperCase() + type.slice(1)}: ${item.initiativeName || item.opportunityName || item.personName || item.programName}`;
            let schemaDefinition;
            if (type === 'program') schemaDefinition = APP_SCHEMA.definitions.programConfiguration;
            else if (type === 'person') schemaDefinition = APP_SCHEMA.definitions.person;
            else if (type === 'opportunity') schemaDefinition = APP_SCHEMA.definitions.opportunity;
            else if (type === 'initiative') schemaDefinition = APP_SCHEMA.definitions.initiative;
            this.itemModalItemFields = Object.entries(schemaDefinition.properties || {}).map(([key, prop]) => ({
                key: key,
                title: prop.title || appUtils.formatFieldName(key),
                description: prop.description || 'No description available.',
                type: prop.type,
                format: prop.format,
                relationshipType: prop.relationshipType,
            }));
            this.findRelatedItems(item, type);
            this.itemModalActiveTab = 'edit'; this.showItemModal = true;
        findRelatedItems(item, type) { this.relatedItems = []; if (!item || !type || !this.appData) return; if (type === 'person') { (this.appData.opportunities || []).forEach(opp => { if (opp.opportunityProposerId === item.personId) { this.relatedItems.push({ id: opp.opportunityId, name: opp.opportunityName, type: 'opportunity', item: opp }); } }); (this.appData.initiatives || []).forEach(init => { if (init.initiativeManagerId === item.personId) { this.relatedItems.push({ id: init.initiativeId, name: init.initiativeName, type: 'initiative', item: init }); } }); } else if (type === 'opportunity') { (this.appData.initiatives || []).forEach(init => { if (init.initiativeOpportunityId === item.opportunityId) { this.relatedItems.push({ id: init.initiativeId, name: init.initiativeName, type: 'initiative', item: init }); } }); } else if (type === 'initiative') { if (item.initiativeManagerId) { const manager = this.getPerson(item.initiativeManagerId); if (manager) { this.relatedItems.push({ id: manager.personId, name: manager.personName, type: 'person', item: manager }); } } if (item.initiativeOpportunityId) { const opportunity = this.getOpportunity(item.initiativeOpportunityId); if (opportunity) { this.relatedItems.push({ id: opportunity.opportunityId, name: opportunity.opportunityName, type: 'opportunity', item: opportunity }); } } } },
        async fetchDocumentation() { try { const response = await fetch('./docs.md'); if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`); const markdown = await response.text(); this.parseDocumentation(markdown); } catch (error) { console.error("Error fetching documentation:", error); this.showNotification('Error', 'Failed to load documentation.', 'error'); } },
        parseDocumentation(markdown) { const lines = markdown.split('\n'); let currentEntity = null; let currentField = null; let descriptionLines = []; this.documentation = {}; for (const line of lines) { const entityMatch = line.match(/^##\s+(.+)\s+\(`(\w+)`\)/); const fieldMatch = line.match(/^###\s+`(\w+)`/); if (entityMatch) { if (currentField && descriptionLines.length > 0) { this.documentation[currentEntity][currentField] = descriptionLines.join('\n').trim(); } currentEntity = entityMatch[2]; this.documentation[currentEntity] = {}; currentField = null; descriptionLines = []; } else if (fieldMatch) { if (currentField && descriptionLines.length > 0) { this.documentation[currentEntity][currentField] = descriptionLines.join('\n').trim(); } currentField = fieldMatch[1]; descriptionLines = []; } else if (currentField !== null) { descriptionLines.push(line); } } if (currentField && descriptionLines.length > 0) { this.documentation[currentEntity][currentField] = descriptionLines.join('\n').trim(); } console.log("Parsed Documentation:", this.documentation); },
        showHelp(fieldKey, entityType) { const entityKey = entityType === 'initiative' ? 'initiative' : entityType === 'opportunity' ? 'opportunity' : entityType === 'person' ? 'person' : 'program'; const markdownContent = this.documentation[entityKey] ? this.documentation[entityKey][fieldKey] : null; if (markdownContent) { this.helpModalTitle = `Help: ${appUtils.formatFieldName(fieldKey)}`; const renderedHtml = marked.parse(markdownContent); this.renderedHelpContent = DOMPurify.sanitize(renderedHtml); this.showHelpContentModal = true; this.$nextTick(() => { lucide.createIcons(); }); } else { this.showNotification('Info', 'Documentation not available for this field.', 'info'); } },
        closeHelpModal() { this.showHelpContentModal = false; this.helpModalTitle = ''; this.renderedHelpContent = ''; },
                 adjustModalPositions() {
                    const modals = document.querySelectorAll('.fixed.inset-0.bg-black\\/30'); // This selector might need to be more specific if other fixed elements exist
                    modals.forEach((modal, index) => {
                        // This logic might need refinement if modals are not always stacked or z-index needs to be more dynamic
                        const zIndexBase = 50; // Base z-index for first modal
                        modal.style.zIndex = zIndexBase + index;
                        const modalContent = modal.querySelector('.relative.mx-auto');
                        if (modalContent) {
                            // This centering logic might be affected by other styles; Tailwind's flex centering is usually preferred.
                            // modalContent.style.transform = `translate(-50%, -50%) translate(${index * 20}px, ${index * 20}px)`;
                            // modalContent.style.top = '50%';
                            // modalContent.style.left = '50%';
                        }
            });
        },
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

// Register components
app.component('notification-handler', NotificationHandler);
app.component('data-controls', DataControls);
app.component('tab-navigation', TabNavigation);
app.component('stats-card', StatsCard);
app.component('kanban-column', KanbanColumn);
app.component('initiatives-by-phase-summary', InitiativesByPhaseSummary);
app.component('top-opportunities-summary', TopOpportunitiesSummary);
app.component('team-overview-summary', TeamOverviewSummary);
app.component('recent-activity-summary', RecentActivitySummary);
app.component('dashboard-view', DashboardView);
app.component('program-view', ProgramView);
app.component('item-modal', ItemModal);
app.component('help-modal', HelpModal);
app.component('ai-modal', AiModal);
app.component('person-card', PersonCard);
app.component('people-view', PeopleView);
app.component('opportunity-list-item', OpportunityListItem);
app.component('opportunities-filter-controls', OpportunitiesFilterControls);
app.component('opportunities-view', OpportunitiesView);
app.component('initiative-list-item', InitiativeListItem);
app.component('initiatives-view', InitiativesView);
app.component('table-view', TableView);
app.component('item-badge', ItemBadge);

app.mount('#app');
