# Schone Halacha Prompting

> An Angular application for generating structured halachic analyses from Hebrew text using AI-powered markdown formatting.

---

## 1. Introduction and Goals

This application addresses the challenge of converting complex Hebrew halachic texts into clear, structured German analyses that maintain the scholarly rigor while being accessible to a broader audience.

* **Problem:** Traditional halachic texts are often inaccessible to non-Hebrew speakers, and manual translation/analysis is time-consuming and inconsistent.
* **Solution:** An AI-powered application that automatically generates structured, well-formatted halachic analyses in German with proper markdown formatting and scholarly citations.
* **Key Goals:**
    * **Goal:** Reduce manual halachic text analysis time by 80% through automated AI processing.
    * **Goal:** Achieve consistent formatting and structure across all generated analyses.
    * **Goal:** Provide accessible halachic content to German-speaking Jewish communities.

---

## 2. System Context (C4 Model: Level 1)

This diagram shows how the Schone Halacha system integrates with users and external services.

```
+------------------+     +------------------+     +------------------+
|   User (Rabbi/   |     |  Schone Halacha  |     |   Google Gemini  |
|   Student)       |---->|   Application    |---->|      API         |
|                  |     |                  |     |                  |
+------------------+     +------------------+     +------------------+
         |                        |                        |
         | Uses                   | Generates              | Processes
         v                        v                        v
+------------------+     +------------------+     +------------------+
|   Hebrew Text    |     |  Markdown       |     |  AI Analysis     |
|   Input          |     |  Output         |     |  & Translation   |
+------------------+     +------------------+     +------------------+
```

---

## 3. Solution Strategy & Technology Stack

This section describes the high-level technical decisions and the technologies used.

* **Architecture:** Modern Angular standalone application with Firebase backend
* **Primary Language:** TypeScript
* **Frameworks:** Angular 18, Angular Material
* **AI/ML:** Google Gemini 2.5 Pro API
* **Backend:** Firebase Functions
* **Deployment:** Firebase Hosting
* **Styling:** SCSS with Material Design Azure Blue theme

---

## 4. Requirements & Feature Set

This table tracks the curated set of functional requirements for this project.

| ID      | Status      | Feature                | Requirement Description                                                                | Rationale                                           |
| :------ | :---------- | :--------------------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------- |
| REQ-001 | `Done`      | Hebrew Text Input      | As a user, I can input Hebrew halachic text and specify a halacha number.              | To provide the source material for AI analysis.     |
| REQ-002 | `Done`      | AI Analysis            | As a user, I can generate structured German analysis using Google Gemini API.          | To automate the translation and analysis process.    |
| REQ-003 | `Done`      | Markdown Rendering     | As a user, I can view beautifully formatted markdown output with proper styling.        | To ensure readability and professional presentation. |
| REQ-004 | `Done`      | Copy to Clipboard      | As a user, I can copy the generated analysis to clipboard for external use.            | To enable easy sharing and integration with other tools. |
| REQ-005 | `Done`      | Responsive Design      | As a user, I can use the application on desktop and mobile devices.                   | To ensure accessibility across different devices.     |
| REQ-006 | `Done`      | Error Handling         | As a user, I receive clear error messages when the API fails or input is invalid.      | To provide a robust user experience.                |

---

## Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn
* Firebase CLI (for deployment)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [your-repo-url]
   cd shone-halacha-prompting
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Firebase (for backend functions):**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init functions
   ```

4. **Configure environment variables:**
   - Set `GEMINI_KEY` in Firebase Functions environment
   - Configure Firebase project settings

5. **Run the application:**
   ```bash
   # Development
   npm start
   
   # Production build
   npm run build
   
   # Deploy to Firebase
   firebase deploy
   ```

### Usage

1. Enter a halacha number (e.g., "1", "2", "3")
2. Paste or type Hebrew halachic text in the input field
3. Click "Zusammenfassung erstellen" to generate the analysis
4. View the beautifully formatted markdown output
5. Use the copy button to copy the result to clipboard

### Features

* **AI-Powered Analysis:** Uses Google Gemini 2.5 Pro for intelligent text processing
* **Structured Output:** Generates well-formatted markdown with proper citations
* **Responsive Design:** Works seamlessly on desktop and mobile devices
* **Modern UI:** Clean, professional interface using Angular Material
* **Real-time Processing:** Immediate feedback and loading states
* **Error Handling:** Comprehensive error handling and user feedback

### Technology Highlights

* **Angular 18:** Latest Angular with standalone components
* **TypeScript:** Strict type checking for robust development
* **Angular Material:** Professional UI components with Azure Blue theme
* **Firebase Functions:** Serverless backend for AI processing
* **SCSS:** Advanced styling with responsive design
* **Modern Testing:** Comprehensive test suite with modern Angular testing patterns
