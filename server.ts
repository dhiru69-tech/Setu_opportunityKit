import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { SEED_OPPORTUNITIES } from './src/data/seedOpportunities.js';
import { evaluateEligibility } from './src/utils/eligibilityEngine.js';
import { Opportunity, StudentProfile, SavedApplication, EligibilityReport } from './src/types/index.js';

dotenv.config();

// Enforce HMR disabled per environment constraints
process.env.DISABLE_HMR = 'true';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Setup multer for resume uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Setup Gemini AI client if GEMINI_API_KEY is configured
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log('[OpportunityKit] Gemini API client initialized successfully.');
  } catch (err) {
    console.error('[OpportunityKit] Failed to initialize Gemini client:', err);
  }
} else {
  console.log('[OpportunityKit] Running without GEMINI_API_KEY. Deterministic heuristics will be used.');
}

// In-Memory & File-Backed Persistent Store
const DATA_FILE = path.join(__dirname, 'data_store.json');

interface AppDataStore {
  opportunities: Opportunity[];
  profiles: Record<string, StudentProfile>;
  savedApplications: Record<string, SavedApplication[]>;
  reports: Record<string, EligibilityReport[]>;
}

// Default initial state
const defaultProfile: StudentProfile = {
  id: 'student-demo-1',
  fullName: 'Alex Chen',
  email: 'alex.chen@student.university.edu',
  educationLevel: 'undergraduate',
  degreeMajor: 'Computer Science & Engineering',
  institution: 'State University of Technology',
  currentYear: '3rd Year',
  graduationYear: 2027,
  cgpa: 3.65,
  cgpaScale: 4.0,
  skills: ['Python', 'TypeScript', 'React', 'Git', 'Data Structures', 'C++', 'SQL'],
  experienceSummary: 'Undergraduate student interested in open-source systems, AI applications, and community tech initiatives. Completed coursework in Algorithms and Web Development.',
  projects: [
    {
      title: 'Campus Course Planner',
      description: 'Built a collaborative prerequisite visualizer and scheduler for students.',
      tech: ['React', 'TypeScript', 'Node.js']
    },
    {
      title: 'Autonomous Rover Sensor Telemetry',
      description: 'Configured embedded telemetry ingestion script and data logging dashboard.',
      tech: ['Python', 'C++', 'MQTT']
    }
  ],
  countryOfResidence: 'United States',
  citizenship: 'United States',
  preferredWorkMode: 'any',
  enrolledStatus: true,
  updatedAt: new Date().toISOString()
};

let store: AppDataStore = {
  opportunities: [...SEED_OPPORTUNITIES],
  profiles: { 'student-demo-1': defaultProfile },
  savedApplications: {
    'student-demo-1': [
      {
        id: 'saved-app-1',
        opportunityId: 'opp-gsoc-2026',
        opportunity: SEED_OPPORTUNITIES[0],
        status: 'preparing',
        notes: 'Explored mentor organization repositories. Reaching out on Zulip to discuss initial PRs.',
        savedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        checklist: [
          { id: 'chk-1', text: 'Select 2 mentor organizations', done: true },
          { id: 'chk-2', text: 'Submit good first issue PR', done: false },
          { id: 'chk-3', text: 'Draft official proposal document', done: false }
        ]
      },
      {
        id: 'saved-app-2',
        opportunityId: 'opp-ghc-2026',
        opportunity: SEED_OPPORTUNITIES[1],
        status: 'interested',
        notes: 'Need to ask Professor Miller for a recommendation letter early.',
        savedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        checklist: [
          { id: 'chk-ghc-1', text: 'Draft diversity in tech essay', done: false },
          { id: 'chk-ghc-2', text: 'Request faculty recommendation', done: false }
        ]
      }
    ]
  },
  reports: {}
};

function loadStore() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.opportunities)) {
        store = parsed;
        console.log('[OpportunityKit] Loaded store from file.');
      }
    }
  } catch (err) {
    console.warn('[OpportunityKit] Error reading store, using in-memory defaults:', err);
  }
}

function saveStore() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[OpportunityKit] Error saving store to file:', err);
  }
}

loadStore();

// Helper to get active user ID from header or default demo user
function getUserId(req: Request): string {
  const customId = req.headers['x-user-id'] as string;
  return customId && customId.trim() ? customId.trim() : 'student-demo-1';
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiEnabled: !!aiClient,
    version: '1.0.0',
    opportunitiesCount: store.opportunities.length
  });
});

// 2. Opportunities list with search & filter params
app.get('/api/opportunities', (req: Request, res: Response) => {
  const { query, category, type, workMode, deadlineStatus, minFunding } = req.query;

  let results = [...store.opportunities];

  if (typeof query === 'string' && query.trim()) {
    const q = query.toLowerCase().trim();
    results = results.filter(opp =>
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.shortDescription.toLowerCase().includes(q) ||
      opp.location.toLowerCase().includes(q) ||
      opp.criteria.some(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    );
  }

  if (typeof category === 'string' && category !== 'all') {
    results = results.filter(opp => opp.category === category);
  }

  if (typeof type === 'string' && type !== 'all') {
    results = results.filter(opp => opp.type === type);
  }

  if (typeof workMode === 'string' && workMode !== 'all') {
    results = results.filter(opp => opp.workMode === workMode);
  }

  if (typeof deadlineStatus === 'string' && deadlineStatus !== 'all') {
    results = results.filter(opp => opp.deadlineStatus === deadlineStatus);
  }

  res.json({
    success: true,
    total: results.length,
    opportunities: results
  });
});

// 3. Single opportunity details
app.get('/api/opportunities/:id', (req: Request, res: Response) => {
  const opp = store.opportunities.find(o => o.id === req.params.id);
  if (!opp) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }
  res.json({ success: true, opportunity: opp });
});

// 4. Create custom or parsed opportunity
app.post('/api/opportunities', (req: Request, res: Response) => {
  const body = req.body;
  if (!body.title || !body.organization) {
    return res.status(400).json({ success: false, error: 'Title and organization are required' });
  }

  const newOpp: Opportunity = {
    id: `opp-custom-${Date.now()}`,
    title: body.title,
    organization: body.organization,
    category: body.category || 'internship',
    type: body.type || 'stipend',
    shortDescription: body.shortDescription || body.fullDescription?.substring(0, 160) || 'Custom opportunity',
    fullDescription: body.fullDescription || body.shortDescription || '',
    location: body.location || 'Not specified',
    workMode: body.workMode || 'remote',
    deadline: body.deadline || new Date(Date.now() + 30 * 86400000).toISOString(),
    deadlineStatus: 'open',
    fundingAmount: body.fundingAmount || 'Not specified',
    officialUrl: body.officialUrl || '',
    lastVerified: new Date().toISOString().split('T')[0],
    isVerifiedSeed: false,
    eligibilitySummary: body.eligibilitySummary || 'Parsed from user input',
    criteria: Array.isArray(body.criteria) && body.criteria.length > 0 ? body.criteria : [
      {
        id: 'c-default-1',
        name: 'Student Status',
        category: 'enrollment_status',
        description: 'Enrolled student in an accredited program.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: body.requiredDocuments || ['Resume / CV'],
    applicationSteps: body.applicationSteps || ['Review program page', 'Submit application form'],
    importantDates: body.importantDates || []
  };

  store.opportunities.unshift(newOpp);
  saveStore();
  res.status(201).json({ success: true, opportunity: newOpp });
});

// 5. SSRF-Safe URL Fetcher and Opportunity Extractor
app.post('/api/eligibility/parse-url', async (req: Request, res: Response) => {
  const { url } = req.body;

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'Valid URL is required' });
  }

  try {
    const parsedUrl = new URL(url);

    // SSRF Safeguards: Disallow non-HTTP protocols, private IPs, loopbacks, and cloud metadata
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return res.status(400).json({ success: false, error: 'Only http and https protocols are supported' });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const disallowed = [
      'localhost', '127.0.0.1', '::1', '0.0.0.0',
      '169.254.169.254', 'metadata.google.internal',
      'internal', 'local'
    ];
    if (
      disallowed.includes(hostname) ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return res.status(400).json({
        success: false,
        error: 'Access to private or internal addresses is restricted for security.'
      });
    }

    // Fetch the URL with a 10s timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpportunityKitBot/1.0; +https://opportunitykit.dev)'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(422).json({
        success: false,
        error: `Could not fetch opportunity page (HTTP ${response.status}). Please paste the requirements text manually instead.`,
        canFallbackToPaste: true
      });
    }

    const htmlText = await response.text();

    // Clean HTML to extract text content
    const cleanedText = htmlText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 12000); // Take first 12,000 characters of text

    if (!cleanedText || cleanedText.length < 50) {
      return res.status(422).json({
        success: false,
        error: 'The destination website has minimal text or is protected by JavaScript verification. Please paste the requirements manually.',
        canFallbackToPaste: true
      });
    }

    // If Gemini is available, structure the opportunity
    if (aiClient) {
      try {
        const prompt = `You are an expert student advisor analyzing an educational opportunity webpage.
Extract the structured opportunity details from this webpage text:
URL: ${url}
WEBPAGE CONTENT:
${cleanedText}

Return valid JSON with exactly this structure:
{
  "title": string,
  "organization": string,
  "category": "internship" | "scholarship" | "hackathon" | "research" | "competition" | "fellowship",
  "type": "fully_funded" | "stipend" | "award" | "unpaid_learning" | "tuition_grant",
  "shortDescription": string (max 200 chars),
  "fullDescription": string,
  "location": string,
  "workMode": "remote" | "on_site" | "hybrid",
  "deadline": string (YYYY-MM-DD or empty string if not found),
  "fundingAmount": string,
  "eligibilitySummary": string,
  "criteria": [
    {
      "id": string,
      "name": string,
      "category": "education_level" | "field_of_study" | "minimum_cgpa" | "graduation_year" | "skills" | "location_citizenship" | "experience" | "enrollment_status",
      "description": string,
      "operator": "gte" | "equals" | "includes_any" | "boolean" | "text_check",
      "targetValue": any,
      "importance": "mandatory" | "preferred"
    }
  ],
  "requiredDocuments": string[],
  "applicationSteps": string[]
}`;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const jsonText = aiResponse.text?.trim() || '{}';
        const parsedData = JSON.parse(jsonText);
        parsedData.officialUrl = url;
        parsedData.isVerifiedSeed = false;

        return res.json({
          success: true,
          opportunity: parsedData,
          source: 'ai_extracted'
        });
      } catch (aiErr) {
        console.warn('[OpportunityKit] Gemini extraction failed, falling back to heuristic extraction:', aiErr);
      }
    }

    // Heuristic Fallback when AI is offline or parsing fails
    const extractedTitle = htmlText.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() || 'Extracted Opportunity';
    const fallbackOpp: Partial<Opportunity> = {
      title: extractedTitle.split(/[-–|]/)[0].trim(),
      organization: 'Host Organization (Verify on Site)',
      category: 'internship',
      type: 'stipend',
      shortDescription: cleanedText.substring(0, 180) + '...',
      fullDescription: cleanedText.substring(0, 800),
      location: 'See official website',
      workMode: 'remote',
      deadline: '',
      fundingAmount: 'See official guidelines',
      officialUrl: url,
      eligibilitySummary: 'Review requirements extracted from source page.',
      criteria: [
        {
          id: 'c-heur-1',
          name: 'Student Enrollment Status',
          category: 'enrollment_status',
          description: 'Active university or high school enrollment.',
          operator: 'boolean',
          targetValue: true,
          importance: 'mandatory'
        },
        {
          id: 'c-heur-2',
          name: 'Academic Discipline',
          category: 'field_of_study',
          description: 'Related degree program or technical interest.',
          operator: 'text_check',
          targetValue: 'stem_or_related',
          importance: 'mandatory'
        }
      ],
      requiredDocuments: ['Resume / Curriculum Vitae', 'Academic Transcript'],
      applicationSteps: ['Visit official website', 'Complete eligibility requirements checklist']
    };

    return res.json({
      success: true,
      opportunity: fallbackOpp,
      source: 'heuristic_extracted'
    });
  } catch (err: any) {
    console.error('[OpportunityKit] URL parse error:', err);
    return res.status(500).json({
      success: false,
      error: 'Unable to process this URL. Please paste the requirements manually.',
      canFallbackToPaste: true
    });
  }
});

// 6. Resume Upload and Parsing
app.post('/api/resume/parse', upload.single('resume'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No resume file uploaded' });
  }

  const file = req.file;
  const fileName = file.originalname;
  const mimeType = file.mimetype;
  const buffer = file.buffer;

  // Validate file type
  const allowedMimes = [
    'application/pdf',
    'text/plain',
    'text/markdown',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  if (!allowedMimes.includes(mimeType) && !fileName.endsWith('.txt') && !fileName.endsWith('.pdf') && !fileName.endsWith('.docx')) {
    return res.status(400).json({
      success: false,
      error: 'Unsupported file type. Please upload a PDF, DOCX, or TXT file.'
    });
  }

  try {
    // If text file, decode buffer directly
    let rawText = '';
    if (mimeType.includes('text') || fileName.endsWith('.txt') || fileName.endsWith('.md')) {
      rawText = buffer.toString('utf-8');
    }

    // Try Gemini extraction
    if (aiClient) {
      try {
        let contentPart: any;
        if (mimeType === 'application/pdf') {
          contentPart = {
            inlineData: {
              mimeType: 'application/pdf',
              data: buffer.toString('base64')
            }
          };
        } else {
          // If DOCX or text, use text part (or ASCII representation)
          contentPart = {
            text: rawText || buffer.toString('utf-8', 0, Math.min(buffer.length, 50000))
          };
        }

        const prompt = `Analyze this student resume and extract key profile attributes accurately.
Do not fabricate information. If a field is not mentioned, use null or empty array.
Return JSON with this schema:
{
  "fullName": string or null,
  "email": string or null,
  "educationLevel": "high_school" | "undergraduate" | "masters" | "phd" | "recent_grad",
  "degreeMajor": string or null,
  "institution": string or null,
  "currentYear": string or null (e.g. "3rd Year", "Junior"),
  "graduationYear": number or null,
  "cgpa": number or null,
  "cgpaScale": number (e.g. 4.0 or 10.0),
  "skills": string[],
  "experienceSummary": string,
  "projects": [
    { "title": string, "description": string, "tech": string[] }
  ],
  "countryOfResidence": string or null,
  "citizenship": string or null
}`;

        const aiResponse = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [contentPart, { text: prompt }],
          config: {
            responseMimeType: 'application/json'
          }
        });

        const jsonStr = aiResponse.text?.trim() || '{}';
        const parsedProfile = JSON.parse(jsonStr);

        return res.json({
          success: true,
          fileName,
          extractedProfile: parsedProfile,
          source: 'gemini_multimodal'
        });
      } catch (geminiErr) {
        console.warn('[OpportunityKit] Gemini resume extraction failed, trying heuristic fallback:', geminiErr);
      }
    }

    // Heuristic Fallback
    const fallbackText = rawText || buffer.toString('ascii');
    const skillsList = [
      'Python', 'Java', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
      'HTML', 'CSS', 'SQL', 'Git', 'Docker', 'AWS', 'Linux', 'Machine Learning',
      'TensorFlow', 'PyTorch', 'Data Structures', 'Algorithms', 'Go', 'Rust'
    ];
    const detectedSkills = skillsList.filter(s => new RegExp(`\\b${s}\\b`, 'i').test(fallbackText));

    const gpaMatch = fallbackText.match(/(?:GPA|CGPA)[:\s]+([0-9]\.?[0-9]*)/i);
    const gradMatch = fallbackText.match(/(?:Class of|Graduation|Expected)[:\s]+(202[4-9]|203[0-5])/i);

    const fallbackProfile: Partial<StudentProfile> = {
      fullName: 'Student Applicant',
      educationLevel: 'undergraduate',
      degreeMajor: fallbackText.match(/(?:Computer Science|Software Engineering|Information Technology|Electrical Engineering|Data Science)/i)?.[0] || 'Computer Science',
      institution: 'University',
      currentYear: '3rd Year',
      graduationYear: gradMatch ? parseInt(gradMatch[1], 10) : 2027,
      cgpa: gpaMatch ? parseFloat(gpaMatch[1]) : 3.5,
      cgpaScale: 4.0,
      skills: detectedSkills.length > 0 ? detectedSkills : ['Python', 'Git', 'JavaScript', 'Data Structures'],
      experienceSummary: 'Extracted from uploaded resume text.',
      projects: [],
      countryOfResidence: 'United States',
      citizenship: 'United States',
      enrolledStatus: true
    };

    return res.json({
      success: true,
      fileName,
      extractedProfile: fallbackProfile,
      source: 'heuristic_fallback'
    });
  } catch (err: any) {
    console.error('[OpportunityKit] Resume parsing error:', err);
    return res.status(500).json({
      success: false,
      error: 'Failed to process resume document. Please enter your academic profile manually.'
    });
  }
});

// 7. Analyze Eligibility (Deterministic Engine + Optional Gemini Enhancement)
app.post('/api/eligibility/analyze', async (req: Request, res: Response) => {
  const { opportunityId, customOpportunity, profile, rawDescription } = req.body;

  let targetOpp: Opportunity | undefined;
  if (opportunityId) {
    targetOpp = store.opportunities.find(o => o.id === opportunityId);
  }

  // If custom opportunity supplied or raw description provided
  if (!targetOpp && customOpportunity) {
    targetOpp = customOpportunity as Opportunity;
  } else if (!targetOpp && rawDescription) {
    // If user pasted a raw description and no criteria defined yet, extract criteria first!
    if (aiClient) {
      try {
        const criteriaPrompt = `Extract eligibility criteria, required qualifications, and documents from this opportunity text:
${rawDescription}

Return JSON formatted as:
{
  "title": string,
  "organization": string,
  "category": "internship" | "scholarship" | "hackathon" | "research" | "competition" | "fellowship",
  "type": "fully_funded" | "stipend" | "award" | "unpaid_learning" | "tuition_grant",
  "shortDescription": string,
  "criteria": [
    {
      "id": string,
      "name": string,
      "category": "education_level" | "field_of_study" | "minimum_cgpa" | "graduation_year" | "skills" | "location_citizenship" | "experience" | "enrollment_status",
      "description": string,
      "operator": "gte" | "equals" | "includes_any" | "boolean" | "text_check",
      "targetValue": any,
      "importance": "mandatory" | "preferred"
    }
  ],
  "requiredDocuments": string[],
  "applicationSteps": string[]
}`;

        const genRes = await aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: criteriaPrompt,
          config: { responseMimeType: 'application/json' }
        });
        const parsedOpp = JSON.parse(genRes.text?.trim() || '{}');
        targetOpp = {
          id: `opp-pasted-${Date.now()}`,
          title: parsedOpp.title || 'Pasted Opportunity Requirements',
          organization: parsedOpp.organization || 'External Host',
          category: parsedOpp.category || 'internship',
          type: parsedOpp.type || 'stipend',
          shortDescription: parsedOpp.shortDescription || rawDescription.substring(0, 150),
          fullDescription: rawDescription,
          location: 'Refer to source',
          workMode: 'remote',
          deadline: '',
          deadlineStatus: 'open',
          fundingAmount: 'Unspecified',
          officialUrl: '',
          lastVerified: new Date().toISOString().split('T')[0],
          isVerifiedSeed: false,
          eligibilitySummary: 'Synthesized from pasted description.',
          criteria: parsedOpp.criteria || [],
          requiredDocuments: parsedOpp.requiredDocuments || ['Resume'],
          applicationSteps: parsedOpp.applicationSteps || ['Review requirements'],
          importantDates: []
        };
      } catch (err) {
        console.warn('AI criteria extraction failed:', err);
      }
    }

    if (!targetOpp) {
      // Fallback targetOpp from rawDescription
      targetOpp = {
        id: `opp-pasted-${Date.now()}`,
        title: 'Custom Opportunity',
        organization: 'Independent Organization',
        category: 'internship',
        type: 'stipend',
        shortDescription: rawDescription.substring(0, 160) + '...',
        fullDescription: rawDescription,
        location: 'Refer to text',
        workMode: 'remote',
        deadline: '',
        deadlineStatus: 'open',
        fundingAmount: 'Not specified',
        officialUrl: '',
        lastVerified: new Date().toISOString().split('T')[0],
        isVerifiedSeed: false,
        eligibilitySummary: 'Based on supplied requirements.',
        criteria: [
          {
            id: 'p-1',
            name: 'Active Student Standing',
            category: 'enrollment_status',
            description: 'Enrolled student standing in college or university.',
            operator: 'boolean',
            targetValue: true,
            importance: 'mandatory'
          },
          {
            id: 'p-2',
            name: 'Degree Alignment',
            category: 'field_of_study',
            description: 'Degree program in a relevant field.',
            operator: 'text_check',
            targetValue: 'stem',
            importance: 'mandatory'
          }
        ],
        requiredDocuments: ['Resume / CV', 'Transcript'],
        applicationSteps: ['Verify criteria match', 'Prepare application materials'],
        importantDates: []
      };
    }
  }

  if (!targetOpp) {
    return res.status(404).json({ success: false, error: 'Opportunity not specified or found' });
  }

  const studentProfile = profile || defaultProfile;

  // Run deterministic evaluation
  const report = evaluateEligibility(targetOpp, studentProfile);
  report.rawOpportunityDescription = rawDescription;

  // Store in user reports history
  const userId = getUserId(req);
  if (!store.reports[userId]) {
    store.reports[userId] = [];
  }
  store.reports[userId].unshift(report);
  saveStore();

  return res.json({
    success: true,
    report,
    opportunity: targetOpp
  });
});

// 8. Follow-up Question Answer & Re-Evaluation
app.post('/api/eligibility/follow-up', (req: Request, res: Response) => {
  const { reportId, answers, opportunityId } = req.body;
  const userId = getUserId(req);

  const existingReport = store.reports[userId]?.find(r => r.id === reportId);
  const targetOpp = store.opportunities.find(o => o.id === opportunityId) ||
    store.opportunities.find(o => o.title === existingReport?.opportunityTitle);

  if (!targetOpp) {
    return res.status(404).json({ success: false, error: 'Associated opportunity not found' });
  }

  // Update profile snapshot with answers
  const updatedProfile: Partial<StudentProfile> = {
    ...(existingReport?.inputProfileSnapshot || store.profiles[userId] || defaultProfile)
  };

  if (answers) {
    if (answers.cgpa !== undefined && answers.cgpa !== '') updatedProfile.cgpa = Number(answers.cgpa);
    if (answers.educationLevel) updatedProfile.educationLevel = answers.educationLevel;
    if (answers.degreeMajor) updatedProfile.degreeMajor = answers.degreeMajor;
    if (answers.graduationYear) updatedProfile.graduationYear = Number(answers.graduationYear);
    if (answers.enrolledStatus !== undefined) updatedProfile.enrolledStatus = Boolean(answers.enrolledStatus);
    if (answers.citizenship) updatedProfile.citizenship = answers.citizenship;
    if (answers.countryOfResidence) updatedProfile.countryOfResidence = answers.countryOfResidence;
    if (answers.skills && typeof answers.skills === 'string') {
      const added = answers.skills.split(',').map((s: string) => s.trim()).filter(Boolean);
      updatedProfile.skills = Array.from(new Set([...(updatedProfile.skills || []), ...added]));
    }
  }

  // Re-run evaluation
  const newReport = evaluateEligibility(targetOpp, updatedProfile);
  newReport.id = `rep-reval-${Date.now()}`;

  // Update in store
  store.reports[userId].unshift(newReport);
  saveStore();

  res.json({
    success: true,
    report: newReport,
    updatedProfile
  });
});

// 9. Profile management
app.get('/api/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const profile = store.profiles[userId] || defaultProfile;
  res.json({ success: true, profile });
});

app.put('/api/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const existing = store.profiles[userId] || defaultProfile;
  const updated: StudentProfile = {
    ...existing,
    ...req.body,
    id: userId,
    updatedAt: new Date().toISOString()
  };
  store.profiles[userId] = updated;
  saveStore();
  res.json({ success: true, profile: updated });
});

// 10. Saved opportunities & application tracker
app.get('/api/saved-opportunities', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const apps = store.savedApplications[userId] || [];
  res.json({ success: true, savedApplications: apps });
});

app.post('/api/saved-opportunities', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { opportunityId, status, notes } = req.body;

  const opp = store.opportunities.find(o => o.id === opportunityId);
  if (!opp) {
    return res.status(404).json({ success: false, error: 'Opportunity not found' });
  }

  if (!store.savedApplications[userId]) {
    store.savedApplications[userId] = [];
  }

  // Check if already saved
  const existingIndex = store.savedApplications[userId].findIndex(a => a.opportunityId === opportunityId);
  if (existingIndex >= 0) {
    // Update existing
    store.savedApplications[userId][existingIndex].status = status || store.savedApplications[userId][existingIndex].status;
    if (notes !== undefined) store.savedApplications[userId][existingIndex].notes = notes;
    saveStore();
    return res.json({
      success: true,
      savedApplication: store.savedApplications[userId][existingIndex],
      updated: true
    });
  }

  const newApp: SavedApplication = {
    id: `app-${Date.now()}`,
    opportunityId: opp.id,
    opportunity: opp,
    status: status || 'interested',
    notes: notes || '',
    savedAt: new Date().toISOString(),
    checklist: (opp.requiredDocuments || []).map((doc, idx) => ({
      id: `chk-${idx}`,
      text: `Gather ${doc}`,
      done: false
    }))
  };

  store.savedApplications[userId].unshift(newApp);
  saveStore();

  res.status(201).json({ success: true, savedApplication: newApp });
});

app.delete('/api/saved-opportunities/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;

  if (!store.savedApplications[userId]) {
    return res.status(404).json({ success: false, error: 'No saved applications found' });
  }

  store.savedApplications[userId] = store.savedApplications[userId].filter(
    a => a.id !== id && a.opportunityId !== id
  );
  saveStore();

  res.json({ success: true, message: 'Removed from saved opportunities' });
});

// Update application status / checklist
app.patch('/api/applications/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  const { status, notes, checklist } = req.body;

  const userApps = store.savedApplications[userId] || [];
  const appIndex = userApps.findIndex(a => a.id === id || a.opportunityId === id);

  if (appIndex === -1) {
    return res.status(404).json({ success: false, error: 'Application record not found' });
  }

  if (status) userApps[appIndex].status = status;
  if (notes !== undefined) userApps[appIndex].notes = notes;
  if (checklist) userApps[appIndex].checklist = checklist;

  saveStore();
  res.json({ success: true, application: userApps[appIndex] });
});

// 11. Reports history
app.get('/api/reports', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const userReports = store.reports[userId] || [];
  res.json({ success: true, reports: userReports });
});

app.get('/api/reports/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const report = store.reports[userId]?.find(r => r.id === req.params.id);
  if (!report) {
    return res.status(404).json({ success: false, error: 'Report not found' });
  }
  res.json({ success: true, report });
});

// -------------------------------------------------------------
// VITE DEV MIDDLEWARE OR PRODUCTION STATIC SERVING
// -------------------------------------------------------------

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);

    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api')) {
        return next();
      }
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

    console.log('[OpportunityKit] Running in dev mode with Vite middlewares mounted.');
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('[OpportunityKit] Running in production mode serving static dist.');
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[OpportunityKit] Server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
