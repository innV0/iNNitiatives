# iNNitiatives - Innovation Management Platform

A comprehensive Vue.js application for managing innovation programs, opportunities, and initiatives.

## Features

- **Dashboard**: Overview of your innovation program with key metrics
- **Program Management**: Configure your innovation program settings
- **Team Management**: Manage team members and their roles
- **Opportunities Tracking**: Identify and track innovation opportunities
- **Initiative Management**: Manage innovation initiatives with detailed tracking
- **Data Export/Import**: JSON-based data management with timestamped exports
- **Process Guide**: Detailed workflow documentation accessible via Docsify

## Getting Started

### Option 1: Load Sample Data
1. Open the application
2. Click "Load Sample" to see the platform with realistic data
3. Explore the different tabs and features

### Option 2: Load Your Own Data
1. Prepare a JSON file following the iNNitiatives schema
2. Click "Load Data" and select your file
3. Start managing your innovation program

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Styling**: Tailwind CSS
- **Icons**: Lucide Icons
- **Data Format**: JSON with comprehensive schema validation

## File Structure

\`\`\`
public/
├── index.html          # Main application file
├── sample-data.json    # Sample data for demonstration
└── ...
\`\`\`

## Data Schema

The application uses a comprehensive JSON schema for:
- Program configuration
- People/team members
- Innovation opportunities
- Initiative tracking

## Export Format

Data exports use the filename format: `initiatives-YYYY-MM-DD-HH-MM-SS.json`

## Deployment

This is a static web application that can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.
