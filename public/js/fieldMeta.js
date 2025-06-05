export const FIELD_ICONS = {
  programName: 'settings',
  personName: 'user',
  personRole: 'briefcase',
  personDescription: 'info',
  programSponsorPersonId: 'user-check',
  programManagerPersonId: 'user-cog',
  opportunityName: 'lightbulb',
  opportunityPriority: 'star',
  opportunityStatus: 'flag',
  iNNitiativeName: 'activity',
  iNNitiativePhase: 'flag',
  iNNitiativeType: 'tag',
  programSponsorPersonId: 'user',
  programManagerPersonId: 'user',
  iNNitiativeOwnerPersonId: 'user',
  iNNitiativeRelatedOpportunityId: 'lightbulb'
};

import { APP_SCHEMA } from './appSchema.js';

export function getFieldMeta(path) {
  const [section, field] = path.split('.');
  let def;
  const sectionSchema = APP_SCHEMA.properties[section];
  if (sectionSchema) {
    if (sectionSchema.$ref) {
      def = APP_SCHEMA.definitions[sectionSchema.$ref.split('/').pop()];
    } else if (sectionSchema.type === 'array' && sectionSchema.items && sectionSchema.items.$ref) {
      def = APP_SCHEMA.definitions[sectionSchema.items.$ref.split('/').pop()];
    }
  }
  let prop = def && def.properties ? def.properties[field] : null;
  return {
    key: field,
    title: prop && prop.title ? prop.title : field,
    type: prop && prop.type ? prop.type : 'string',
    format: prop && prop.format ? prop.format : undefined,
    enum: prop && prop.enum ? prop.enum : undefined,
    relationshipType: prop && prop.relationshipType ? prop.relationshipType : undefined,
    tooltip: prop && prop.description ? prop.description : '',
    icon: FIELD_ICONS[field] || ''
  };
}
