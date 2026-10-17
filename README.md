# OpportunityKit

> **"Find opportunities. Understand your next step."**

OpportunityKit is a full-stack student opportunity discovery and eligibility verification platform. It helps students discover authentic internships, scholarships, research fellowships, competitions, and hackathons, benchmark their background against published requirements, resolve missing information, and prepare application materials.

---

## 🌟 Key Features

1. **Explore & Filter Verified Opportunities**
   - Search by keyword, organization, required skills, or field of study.
   - Filter by opportunity category (*Internship*, *Scholarship*, *Research*, *Competition*, *Fellowship*, *Hackathon*).
   - Filter by work mode (*Remote*, *Hybrid*, *On-site*) and funding type (*Stipend*, *Fully Funded*, *Tuition Grant*, *Award*).
   - Traceable dates, verified eligibility summaries, and links to official sponsor notices.

2. **Automated & Evidence-Based Eligibility Checker**
   - Three input modes:
     1. Select from verified catalog.
     2. Enter an opportunity URL (safely parsed via backend with SSRF protection).
     3. Paste requirements or circular text directly.
   - Compares academic level, course/major, GPA (with scale normalization), graduation year, skills, enrollment status, and citizenship.

3. **Three-Tier Eligibility Classification**
   - **Matches (Green):** Criteria satisfied by the profile.
   - **Needs Verification (Amber):** Criteria requiring external confirmation (transcripts, letters, citizenship checks).
   - **Missing Information (Sky/Blue):** Required parameters not yet supplied (**never** marked as an automatic rejection or failure).
   - Includes a visual distribution chart calculated strictly from actual criteria.

4. **Guided Follow-Up Questions**
   - Dynamically generated from missing criteria.
   - Students supply missing inputs to immediately rerun evaluation without restarting.

5. **Personalized Next-Steps Plan**
   - Actionable checklist categorized by *Documentation*, *Profile Fixes*, *Verification*, and *Portal Submission*.
   - Progress bar, completion toggles, and custom student task creation.

6. **Resume Parsing & Review**
   - Upload PDF, DOCX, or TXT (up to 5MB).
   - Powered by Gemini multimodal document analysis with deterministic heuristic fallback.
   - Preview and edit all extracted fields before committing to the student profile.

7. **Student Dashboard & Application Tracker**
   - Profile readiness scoring.
   - Kanban-style application stage tracking (*Interested*, *Preparing*, *Ready to Apply*, *Applied*, *Closed*).
   - Application notes editor and document checklists.

8. **User Privacy & Data Portability**
   - Client/Server isolation per user session.
   - Export full profile as standard JSON.
   - One-click reset to standard demo environment.

---

## 🛠️ Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript (`tsx`).
- **AI Integration:** Google Gemini API (`@google/genai` with `gemini-3.8-flash` on server side).
- **Security:** Server-side API key containment, SSRF prevention on external URL ingestion, and file upload validation.

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 1. Environment Configuration

Create a `.env` file based on `.env.example`:

```bash
# Required for Gemini AI API calls
GEMINI_API_KEY="your-gemini-api-key"

# Port (defaults to 3000)
PORT=3000
```

> **Note:** OpportunityKit operates with full functionality even without `GEMINI_API_KEY` using high-precision deterministic heuristic fallback rules.

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Development Server

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### 4. Build for Production

```bash
npm run build
npm start
```

---

## 🛡️ Policy & Accuracy Notice

OpportunityKit provides informational assessments based on sponsor circulars and public eligibility notices. It does not predict or guarantee selection or admission decisions. Official sponsor links remain authoritative.
