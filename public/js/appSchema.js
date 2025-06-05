export const APP_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "iNNitiatives Data Schema",
  "version": "1.0.0",
  "publishedDate": "2025-06-05",
  "type": "object",
  "properties": {
    "program": {
      "$ref": "#/definitions/programConfiguration",
      "title": "Program",
      "description": "Configuration details for the innovation program"
    },
    "people": {
      "type": "array",
      "items": { "$ref": "#/definitions/person" },
      "title": "People",
      "description": "Participants involved in the program"
    },
    "opportunities": {
      "type": "array",
      "items": { "$ref": "#/definitions/opportunity" },
      "title": "Opportunities",
      "description": "Innovation opportunities tracked in the program"
    },
    "initiatives": {
      "type": "array",
      "items": { "$ref": "#/definitions/iNNitiative" },
      "title": "Initiatives",
      "description": "Innovation initiatives derived from opportunities"
    }
  },
  "required": ["program", "people", "opportunities", "initiatives"],
  "definitions": {
    "programConfiguration": {
      "type": "object",
      "title": "Program Configuration",
      "properties": {
        "programName": {
          "type": "string",
          "title": "Program Name",
          "description": "Name of the innovation program"
        },
        "programObjectives": {
          "type": "string",
          "format": "textarea",
          "title": "Program Objectives",
          "description": "Main objectives of the program"
        },
        "programScope": {
          "type": "string",
          "format": "textarea",
          "title": "Program Scope",
          "description": "Scope or boundaries of the program"
        },
        "programIndicators": {
          "type": "string",
          "format": "textarea",
          "title": "Program Indicators",
          "description": "Key metrics or indicators to track progress"
        },
        "programGovernance": {
          "type": "string",
          "format": "textarea",
          "title": "Program Governance",
          "description": "Governance structure for the program"
        },
        "programFunding": {
          "type": "string",
          "format": "textarea",
          "title": "Program Funding",
          "description": "Funding details for the program"
        },
        "programStages": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["Idea Definition", "Concept Design", "Prototype Development", "Validation", "Pilot Testing", "Launched", "Scaling", "On Hold", "Cancelled"],
          "title": "Program Stages",
          "description": "List of stages in the program"
        },
        "programReporting": {
          "type": "string",
          "title": "Program Reporting",
          "description": "Reporting requirements or cadence"
        },
        "programBusinessDescription": {
          "type": "string",
          "format": "textarea",
          "title": "Program Business Description",
          "description": "Business description for the program"
        },
        "programDefaultOpportunityStatuses": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["Identified", "Under Review", "Prioritized", "Archived"],
          "title": "Default Opportunity Statuses",
          "description": "Default status options for opportunities"
        },
        "programDefaultInitiativeTypes": {
          "type": "array",
          "items": { "type": "string" },
          "default": ["New Product Development", "Process Improvement", "Technology Exploration", "Market Research", "Partnership Development", "Platform Enhancement", "Sustainability Initiative"],
          "title": "Default Initiative Types",
          "description": "Default initiative type options"
        },
        "programLastUpdated": {
          "type": "string",
          "format": "date-time",
          "title": "Program Last Updated",
          "description": "Date and time when the program was last updated"
        },
        "programSponsorPersonId": {
          "type": "string",
          "relationshipType": "person",
          "title": "Sponsor Person ID",
          "description": "Reference to the sponsor of the program"
        },
        "programManagerPersonId": {
          "type": "string",
          "relationshipType": "person",
          "title": "Manager Person ID",
          "description": "Reference to the program manager"
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
        "personId": {
          "type": "string",
          "title": "Person ID",
          "description": "Unique identifier for the person"
        },
        "personName": {
          "type": "string",
          "title": "Person Name",
          "description": "Full name of the person"
        },
        "personDescription": {
          "type": "string",
          "format": "textarea",
          "title": "Person Description",
          "description": "Brief biography or notes about the person"
        },
        "personRole": {
          "type": "string",
          "enum": ["Innovation Manager", "Innovation Sponsor", "Team Member", "Collaborator", "Observer"],
          "title": "Person Role",
          "description": "Role of the person in the innovation program"
        },
        "personUrl": {
          "type": "string",
          "format": "uri",
          "title": "Person URL",
          "description": "External link to more information about the person"
        },
        "personImageUrl": {
          "type": "string",
          "format": "uri",
          "title": "Person Image URL",
          "description": "URL of the person's image"
        }
      },
      "required": ["personId", "personName", "personRole"]
    },
    "opportunity": {
      "type": "object",
      "title": "Opportunity",
      "properties": {
        "opportunityId": {
          "type": "string",
          "title": "Opportunity ID",
          "description": "Unique identifier for the opportunity"
        },
        "opportunityName": {
          "type": "string",
          "title": "Opportunity Name",
          "description": "Name or short title for the opportunity"
        },
        "opportunityDescription": {
          "type": "string",
          "format": "textarea",
          "title": "Opportunity Description",
          "description": "Detailed description of the opportunity"
        },
        "opportunityProblem": {
          "type": "string",
          "format": "textarea",
          "title": "Opportunity Problem",
          "description": "Problem statement or need the opportunity addresses"
        },
        "opportunitySource": {
          "type": "string",
          "enum": ["Customer Feedback", "Market Trend", "Internal Brainstorm", "Competitor Analysis", "Technology Scouting", "Employee Idea", "Other"],
          "title": "Opportunity Source",
          "description": "Source of the opportunity"
        },
        "opportunityStakeholders": {
          "type": "string",
          "format": "textarea",
          "title": "Opportunity Stakeholders",
          "description": "Stakeholders affected or involved"
        },
        "opportunityProposerId": {
          "type": "string",
          "relationshipType": "person",
          "title": "Proposer Person ID",
          "description": "Reference to the person proposing the opportunity"
        },
        "opportunityPriority": {
          "type": "integer",
          "minimum": 0,
          "maximum": 10,
          "title": "Opportunity Priority",
          "description": "Priority rating from 0 to 10"
        },
        "opportunityStatus": {
          "type": "string",
          "enum": ["Identified", "Under Review", "Prioritized", "Archived"],
          "title": "Opportunity Status",
          "description": "Current status of the opportunity"
        },
        "opportunityDateIdentified": {
          "type": "string",
          "format": "date",
          "title": "Date Identified",
          "description": "Date when the opportunity was identified"
        },
        "opportunityLastUpdated": {
          "type": "string",
          "format": "date-time",
          "readonly": true,
          "title": "Last Updated",
          "description": "Timestamp of the last update"
        }
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
        "iNNitiativeId": {
          "type": "string",
          "title": "Initiative ID",
          "description": "Unique identifier for the initiative"
        },
        "iNNitiativeName": {
          "type": "string",
          "title": "Initiative Name",
          "description": "Name of the initiative"
        },
        "iNNitiativeType": {
          "type": "string",
          "title": "Initiative Type",
          "description": "Type category of the initiative"
        },
        "iNNitiativePhase": {
          "type": "string",
          "title": "Initiative Phase",
          "description": "Current phase of the initiative"
        },
        "iNNitiativeOwnerPersonId": {
          "type": "string",
          "relationshipType": "person",
          "title": "Owner Person ID",
          "description": "Reference to the initiative owner"
        },
        "iNNitiativeRelatedOpportunityId": {
          "type": "string",
          "relationshipType": "opportunity",
          "title": "Related Opportunity ID",
          "description": "Reference to the related opportunity"
        },
        "iNNitiativeGoals": {
          "type": "string",
          "format": "textarea",
          "title": "Initiative Goals",
          "description": "Goals of the initiative"
        },
        "iNNitiativeValueProposition": {
          "type": "string",
          "format": "textarea",
          "title": "Value Proposition",
          "description": "Value proposition of the initiative"
        },
        "iNNitiativeExpectedBenefits": {
          "type": "string",
          "format": "textarea",
          "title": "Expected Benefits",
          "description": "Expected benefits of the initiative"
        },
        "iNNitiativeRisks": {
          "type": "string",
          "format": "textarea",
          "title": "Initiative Risks",
          "description": "Risks associated with the initiative"
        },
        "iNNitiativeValidation": {
          "type": "string",
          "format": "textarea",
          "title": "Initiative Validation",
          "description": "Validation efforts or results"
        },
        "iNNitiativeNotes": {
          "type": "string",
          "format": "textarea",
          "title": "Initiative Notes",
          "description": "Additional notes"
        },
        "iNNitiativeStatus": {
          "type": "string",
          "title": "Initiative Status",
          "description": "Current status of the initiative"
        },
        "iNNitiativeDateRegistered": {
          "type": "string",
          "format": "date",
          "title": "Date Registered",
          "description": "Date when the initiative was registered"
        }
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
