export const APP_SCHEMA = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "iNNitiatives Data Schema",
  "type": "object",
  "properties": {
    "program": { "$ref": "#/definitions/programConfiguration" },
    "people": { "type": "array", "items": { "$ref": "#/definitions/person" } },
    "opportunities": { "type": "array", "items": { "$ref": "#/definitions/opportunity" } },
    "initiatives": { "type": "array", "items": { "$ref": "#/definitions/initiative" } }
  },
  "required": ["program", "people", "opportunities", "initiatives"],
  "definitions": {
    "programConfiguration": {
      "type": "object",
      "title": "Program Configuration",
      "properties": {
        "programName": { "type": "string", "title": "Program Name", "description": "The official name of the innovation program within the organization. This helps identify and brand the overall innovation effort.", "default": "My Innovation Program" },
        "programObjectives": { "type": "string", "title": "Program Objectives", "description": "Key strategic goals the innovation program aims to achieve, encompassing its long-term vision, core mission, and primary purpose. These measurable targets align innovation efforts with the organization's broader strategy.", "format": "textarea" },
        "programScope": { "type": "string", "title": "Program Scope", "description": "The defined boundaries and areas of focus for the innovation program. This clarifies what is included and excluded from the program's initiatives.", "format": "textarea" },
        "programIndicators": { "type": "string", "title": "Program Indicators", "description": "Metrics used to measure the success and progress of the overall innovation program. These quantify achievement against strategic objectives and the program's health.", "format": "textarea" },
        "programGovernance": { "type": "string", "title": "Program Governance", "description": "Describes the decision-making processes, defined roles, and clear responsibilities within the innovation program. It ensures clarity on how projects are approved, reviewed, and managed.", "format": "textarea" },
        "programFunding": { "type": "string", "title": "Program Funding", "description": "Explains how innovation initiatives within the program are financed, including sources of funding, allocation rules, and budgetary considerations.", "format": "textarea" },
        "programStages": {
          "type": "array",
          "items": { "type": "string" },
          "title": "Program Stages",
          "description": "The predefined stages that an innovation initiative progresses through, from idea generation to validated concept. These stages provide a structured path for managing innovation.",
          "default": ["Idea Definition", "Concept Design", "Prototype Development", "Validation", "Pilot Testing", "Launched", "Scaling", "On Hold", "Cancelled"]
        },
        "programReporting": { "type": "string", "title": "Program Reporting", "description": "The frequency and format for reporting on the progress and outcomes of the innovation program to relevant stakeholders. This ensures transparency and accountability." },
        "businessDescription": { "type": "string", "title": "Business Description", "description": "Basic information about the business model that is important for providing context to AI queries.", "format": "textarea" },
        "programDefaultOpportunityStatuses": { "type": "array", "items": { "type": "string" }, "title": "Program Default Opportunity Statuses", "description": "Predefined status values for opportunities within the program. These categorize the current state of an identified innovation opportunity.", "default": ["Identified", "Under Review", "Prioritized", "Archived"] },
        "programDefaultInitiativeTypes": { "type": "array", "items": { "type": "string" }, "title": "Program Default Initiative Types", "description": "Predefined categories for innovation initiatives. These help classify projects based on their nature or focus area.", "default": ["New Product Development", "Process Improvement", "Technology Exploration", "Market Research", "Partnership Development", "Platform Enhancement", "Sustainability Initiative"] }
      },
      "required": ["programName", "programObjectives", "programStages", "programDefaultOpportunityStatuses", "programDefaultInitiativeTypes"]
    },
    "person": {
      "type": "object",
      "title": "Person",
      "properties": {
        "personId": { "type": "string", "title": "Person ID", "description": "A unique identifier for each individual associated with the innovation program. This ID ensures consistent referencing across the application." },
        "personName": { "type": "string", "title": "Person Name", "description": "The full name of the person. This is their common identification within the organization." },
        "personDescription": { "type": "string", "title": "Person Role/Short Bio", "description": "A brief description of the person's role, title, department, or a short biography within the organization. This helps clarify their contribution and expertise.", "format": "textarea" },
        "personRole": {
          "type": "string",
          "title": "Person Role",
          "description": "The defined role of the person within the context of the innovation program. This helps delineate responsibilities and interaction levels within the application.",
          "enum": ["Innovation Manager", "Innovation Sponsor", "Team Member", "Collaborator", "Observer"]
        },
        "personUrl": { "type": "string", "format": "uri", "title": "Person Profile URL", "description": "A link to an external profile or internal directory page for the person, if available. This can provide additional context or contact information." },
        "personImageUrl": { "type": "string", "format": "uri", "title": "Person Image URL", "description": "A URL to a profile picture or avatar of the person. This can enhance visual identification within the application." }
      },
      "required": ["personId", "personName", "personRole"]
    },
    "opportunity": {
      "type": "object",
      "title": "Opportunity",
      "properties": {
        "opportunityId": { "type": "string", "title": "Opportunity ID", "description": "A unique identifier for each innovation opportunity. This ID allows for distinct tracking and referencing throughout its lifecycle." },
        "opportunityName": { "type": "string", "title": "Opportunity Name", "description": "A concise and clear name for the innovation opportunity. This serves as a quick reference point." },
        "opportunityDescription": { "type": "string", "title": "Opportunity Description", "description": "A detailed explanation of the innovation opportunity, including any context or background that is relevant but doesn't fit into other specific fields. This is a general catchment for comprehensive information.", "format": "textarea" },
        "opportunityProblem": { "type": "string", "title": "Opportunity Problem", "description": "A clear and concise description of the specific problem, need, or unmet demand that this opportunity represents. This is crucial for applying Design Thinking principles of 'Define'.", "format": "textarea" },
        "opportunitySource": { "type": "string", "title": "Opportunity Source", "description": "Indicates where the opportunity was identified or originated from (e.g., Customer Feedback, Market Trend, Internal Brainstorm, Competitor Analysis). This helps trace the origin of insights.", "enum": ["Customer Feedback", "Market Trend", "Internal Brainstorm", "Competitor Analysis", "Technology Scouting", "Employee Idea", "Other"] },
        "opportunityStakeholders": { "type": "string", "title": "Opportunity Stakeholders", "description": "Key individuals or groups who have a vested interest in or are affected by this opportunity. Understanding stakeholders is vital for broader context and potential impact.", "format": "textarea" },
        "opportunityProposerId": {
          "type": "string",
          "title": "Opportunity Proposer ID",
          "description": "The unique ID of the person who initially proposed or identified this innovation opportunity. This links the opportunity to its originator.",
          "relationshipType": "person"
        },
        "opportunityPriority": { "type": "integer", "title": "Opportunity Priority", "minimum": 0, "maximum": 10, "description": "A numerical score (0-10) indicating the relative importance or urgency of the opportunity. Higher numbers represent higher priority." },
        "opportunityStatus": { "type": "string", "title": "Opportunity Status", "description": "The current state or status of the opportunity within the innovation pipeline (e.g., Identified, Under Review, Prioritized, Archived). This acts as a mini-gate for opportunities.", "enum": ["Identified", "Under Review", "Prioritized", "Archived"] },
        "opportunityDateIdentified": { "type": "string", "format": "date", "title": "Opportunity Date Identified", "description": "The date when the innovation opportunity was formally identified and registered in the system." },
        "opportunityLastUpdated": { "type": "string", "format": "date-time", "title": "Opportunity Last Updated", "description": "A timestamp indicating the last time any information related to this opportunity was modified. This field is automatically updated.", "readonly": true }
      },
      "required": ["opportunityId", "opportunityName", "opportunityProblem", "opportunityProposerId", "opportunityStatus", "opportunityDateIdentified", "opportunityLastUpdated"]
    },
    "initiative": {
      "type": "object",
      "title": "iNNitiative",
      "properties": {
        "initiativeId": { "type": "string", "title": "Initiative ID", "description": "A unique identifier for each innovation initiative or project. This ID allows for distinct tracking throughout its lifecycle." },
        "initiativeName": { "type": "string", "title": "Initiative Name", "description": "A descriptive and concise name for the innovation initiative. This is its primary identifier." },
        "initiativeType": { "type": "string", "title": "Initiative Type", "description": "The category or nature of the innovation initiative (e.g., New Product, Process Improvement). This helps classify and group initiatives.", "enum": ["New Product Development", "Process Improvement", "Technology Exploration", "Market Research", "Partnership Development", "Platform Enhancement", "Sustainability Initiative"] },
        "initiativePhase": { "type": "string", "title": "Initiative Phase", "description": "The current phase of the innovation initiative within the defined innovation lifecycle. This indicates its progression and current stage according to a Stage-Gate approach.", "enum": ["Idea Definition", "Concept Design", "Prototype Development", "Validation", "Pilot Testing", "Launched", "Scaling", "On Hold", "Cancelled"] },
        "initiativeManagerId": {
          "type": "string",
          "title": "Initiative Manager ID",
          "description": "The unique ID of the person responsible for leading and managing this specific innovation initiative. This person oversees its progress and outcomes.",
          "relationshipType": "person"
        },
        "initiativeOpportunityId": {
          "type": "string",
          "title": "Initiative Linked Opportunity ID",
          "description": "The unique ID of the opportunity that this initiative aims to address. This creates a direct link between a defined problem and its proposed solution.",
          "relationshipType": "opportunity"
        },
        "initiativeUser": { "type": "string", "title": "Initiative Target User", "description": "The specific user or customer segment that this innovation initiative is designed to serve. This aligns with Design Thinking's focus on user-centricity (previously 'iNNitiativeCustomer')." },
        "initiativeProblem": { "type": "string", "title": "Initiative Problem", "description": "The specific problem or need that this initiative aims to solve with its proposed solution. This can be directly linked to an opportunity's problem statement or be a new problem identified for this initiative.", "format": "textarea" },
        "initiativeSolution": { "type": "string", "title": "Initiative Solution", "description": "An overview and detailed explanation of the solution being developed or implemented by this initiative. This encompasses what is being built, prototyped, or delivered.", "format": "textarea" },
        "initiativeValueProposition": { "type": "string", "title": "Initiative Value Proposition", "description": "The unique benefits or outcomes that this initiative is expected to deliver to its target users or the organization. This clarifies the 'why' behind the solution.", "format": "textarea" },
        "initiativeSolutionHypothesis": { "type": "string", "title": "Initiative Solution Hypothesis", "description": "The core assumption(s) about how the proposed solution will solve the problem and create value. This is a crucial element of the Lean Startup methodology, guiding experiments.", "format": "textarea" },
        "initiativeGoals": { "type": "string", "title": "Initiative Goals/Success Metrics", "description": "Specific, measurable, achievable, relevant, and time-bound goals that define how the success of this initiative will be measured. These can include KPIs for the initiative itself.", "format": "textarea" },
        "initiativeObjective": { "type": "string", "title": "Initiative Objective (Experiment)", "description": "The specific learning objective or hypothesis being tested with the current prototype or MVP. This drives the 'Measure' and 'Learn' parts of the Lean Startup cycle and the 'Test' phase of Design Thinking.", "format": "textarea" },
        "initiativeResults": { "type": "string", "title": "Initiative Results (Experiment)", "description": "The observed data, user feedback, and outcomes gathered from testing the prototype or MVP. This captures the concrete evidence from experimentation, feeding into the 'Measure' phase of Lean Startup.", "format": "textarea" },
        "initiativeLearnings": { "type": "string", "title": "Initiative Learnings", "description": "Key insights and discoveries gained from the experiment's results. This is the 'Learn' part of the Lean Startup cycle, informing subsequent decisions and iterations.", "format": "textarea" },
        "initiativeDecision": { "type": "string", "title": "Initiative Decision", "description": "The critical Go/No-Go decision taken after evaluating the experiment's results and learnings. This represents a 'Gate' in the Stage-Gate process, determining the next steps for the initiative.", "enum": ["Persevere", "Pivot", "Discard", "Validated for Handover"] },
        "initiativeDecisionJustification": { "type": "string", "title": "Initiative Decision Justification", "description": "The rationale and reasoning behind the decision made after the experiment. This provides transparency and a historical record for the choice made.", "format": "textarea" },
        "initiativeNextSteps": { "type": "string", "title": "Initiative Next Steps", "description": "The immediate actions or planned activities following the current phase or decision point. This reflects the iterative nature of Agile and Lean approaches.", "format": "textarea" },
        "initiativeBudget": { "type": "number", "title": "Initiative Budget (€)", "description": "The allocated or estimated financial resources for this innovation initiative. This includes costs for development, testing, and other related expenses.", "minimum": 0 },
        "initiativeResources": { "type": "string", "title": "Initiative Resources Needed", "description": "A description of key non-financial resources required for the initiative, such as specific personnel, tools, equipment, or external partnerships.", "format": "textarea" },
        "initiativeRisks": { "type": "string", "title": "Initiative Risks & Mitigation", "description": "Identification of potential risks that could impact the initiative's success, along with proposed plans or strategies to mitigate those risks.", "format": "textarea" },
        "initiativeDateRegistered": { "type": "string", "format": "date", "title": "Initiative Date Registered", "description": "The date when the innovation initiative was formally registered in the system." },
        "initiativeStartDate": { "type": "string", "format": "date", "title": "Initiative Start Date", "description": "The actual or estimated start date of the initiative or its current phase. This helps in tracking timelines." },
        "initiativeEndDate": { "type": "string", "format": "date", "title": "Initiative End Date", "description": "The actual or estimated end date of the initiative or its current phase. This helps in tracking timelines and project completion.", "format": "date" },
        "initiativeLastUpdated": { "type": "string", "format": "date-time", "title": "Initiative Last Updated", "description": "A timestamp indicating the last time any information related to this initiative was modified. This field is automatically updated.", "readonly": true },
        "initiativeNotes": { "type": "string", "title": "Initiative Additional Notes", "description": "Any other relevant notes, comments, or supplementary information pertaining to the initiative that does not fit into other structured fields.", "format": "textarea" }
      },
      "required": [
        "initiativeId",
        "initiativeName",
        "initiativeType",
        "initiativePhase",
        "initiativeManagerId",
        "initiativeOpportunityId",
        "initiativeDateRegistered",
        "initiativeLastUpdated",
        "initiativeSolutionHypothesis",
        "initiativeDecision"
      ]
    }
  }
};
