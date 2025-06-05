export const APP_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "iNNitiatives Data Schema",
  "version": "1.0.0",
  "publishedDate": "2025-06-05",
  "type": "object",
  "properties": {
    "program": { "$ref": "#/definitions/programConfiguration" },
    "people": { "type": "array", "items": { "$ref": "#/definitions/person" } },
    "opportunities": { "type": "array", "items": { "$ref": "#/definitions/opportunity" } },
    "initiatives": { "type": "array", "items": { "$ref": "#/definitions/iNNitiative" } }
  },
  "required": ["program", "people", "opportunities", "initiatives"],
  "definitions": {
    "programConfiguration": {
      "type": "object",
      "title": "Program Configuration",
      "properties": {
        "programName": { "type": "string" },
        "programObjectives": { "type": "string", "format": "textarea" },
        "programScope": { "type": "string", "format": "textarea" },
        "programIndicators": { "type": "string", "format": "textarea" },
        "programGovernance": { "type": "string", "format": "textarea" },
        "programFunding": { "type": "string", "format": "textarea" },
        "programStages": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["Idea Definition", "Concept Design", "Prototype Development", "Validation", "Pilot Testing", "Launched", "Scaling", "On Hold", "Cancelled"]
        },
        "programReporting": { "type": "string" },
        "programBusinessDescription": { "type": "string", "format": "textarea" },
        "programDefaultOpportunityStatuses": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["Identified", "Under Review", "Prioritized", "Archived"]
        },
        "programDefaultInitiativeTypes": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["New Product Development", "Process Improvement", "Technology Exploration", "Market Research", "Partnership Development", "Platform Enhancement", "Sustainability Initiative"]
        },
        "programLastUpdated": {
          "type": "string",
          "format": "date-time"
        },
        "programSponsorPersonId": {
          "type": "string",
          "relationshipType": "person"
        },
        "programManagerPersonId": {
          "type": "string",
          "relationshipType": "person"
        }
      },
      "required": [
        "programName",
        "programObjectives",
        "programStages",
        "programDefaultOpportunityStatuses",
        "programDefaultInitiativeTypes",
        "programLastUpdated",
        "programSponsorPersonId",
        "programManagerPersonId"
      ]
    },
    "person": {
      "type": "object",
      "title": "Person",
      "properties": {
        "personId": { "type": "string" },
        "personName": { "type": "string" },
        "personDescription": { "type": "string", "format": "textarea" },
        "personRole": {
          "type": "string",
          "enum": ["Innovation Manager", "Innovation Sponsor", "Team Member", "Collaborator", "Observer"]
        },
        "personUrl": { "type": "string", "format": "uri" },
        "personImageUrl": { "type": "string", "format": "uri" }
      },
      "required": ["personId", "personName", "personRole"]
    },
    "opportunity": {
      "type": "object",
      "title": "Opportunity",
      "properties": {
        "opportunityId": { "type": "string" },
        "opportunityName": { "type": "string" },
        "opportunityDescription": { "type": "string", "format": "textarea" },
        "opportunityProblem": { "type": "string", "format": "textarea" },
        "opportunitySource": {
          "type": "string",
          "enum": ["Customer Feedback", "Market Trend", "Internal Brainstorm", "Competitor Analysis", "Technology Scouting", "Employee Idea", "Other"]
        },
        "opportunityStakeholders": { "type": "string", "format": "textarea" },
        "opportunityProposerId": {
          "type": "string",
          "relationshipType": "person"
        },
        "opportunityPriority": {
          "type": "integer",
          "minimum": 0,
          "maximum": 10
        },
        "opportunityStatus": {
          "type": "string",
          "enum": ["Identified", "Under Review", "Prioritized", "Archived"]
        },
        "opportunityDateIdentified": { "type": "string", "format": "date" },
        "opportunityLastUpdated": { "type": "string", "format": "date-time", "readonly": true }
      },
      "required": [
        "opportunityId",
        "opportunityName",
        "opportunityProblem",
        "opportunityProposerId",
        "opportunityStatus",
        "opportunityDateIdentified",
        "opportunityLastUpdated"
      ]
    },
    "iNNitiative": {
      "type": "object",
      "title": "iNNitiative",
      "properties": {
        "iNNitiativeId": { "type": "string" },
        "iNNitiativeName": { "type": "string" },
        "iNNitiativeType": { "type": "string" },
        "iNNitiativePhase": { "type": "string" },
        "iNNitiativeOwnerPersonId": { "type": "string", "relationshipType": "person" },
        "iNNitiativeRelatedOpportunityId": { "type": "string", "relationshipType": "opportunity" },
        "iNNitiativeGoals": { "type": "string", "format": "textarea" },
        "iNNitiativeValueProposition": { "type": "string", "format": "textarea" },
        "iNNitiativeExpectedBenefits": { "type": "string", "format": "textarea" },
        "iNNitiativeRisks": { "type": "string", "format": "textarea" },
        "iNNitiativeValidation": { "type": "string", "format": "textarea" },
        "iNNitiativeNotes": { "type": "string", "format": "textarea" },
        "iNNitiativeStatus": { "type": "string" },
        "iNNitiativeDateRegistered": { "type": "string", "format": "date" }
      },
      "required": [
        "iNNitiativeId",
        "iNNitiativeName",
        "iNNitiativeType",
        "iNNitiativePhase",
        "iNNitiativeOwnerPersonId",
        "iNNitiativeRelatedOpportunityId",
        "iNNitiativeDateRegistered",
        "iNNitiativeStatus"
      ]
    }
  }
};
