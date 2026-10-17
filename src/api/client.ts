import { 
  Opportunity, 
  StudentProfile, 
  EligibilityReport, 
  SavedApplication 
} from '../types';

const BASE_URL = ''; // Relative path because Express serves both frontend and /api routes on the same port

function getUserId(): string {
  try {
    const saved = localStorage.getItem('oppkit_user_id');
    if (saved && saved.trim()) return saved.trim();
  } catch {}
  return 'student-demo-1';
}

export function setUserId(id: string) {
  try {
    localStorage.setItem('oppkit_user_id', id);
  } catch {}
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  headers.set('x-user-id', getUserId());

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg) as Error & { details?: any; canFallbackToPaste?: boolean };
    err.details = data;
    err.canFallbackToPaste = data.canFallbackToPaste;
    throw err;
  }

  return data as T;
}

export const api = {
  // Health
  checkHealth: () => request<{ status: string; aiEnabled: boolean; opportunitiesCount: number }>('/api/health'),

  // Opportunities
  getOpportunities: (params?: {
    query?: string;
    category?: string;
    type?: string;
    workMode?: string;
    deadlineStatus?: string;
  }) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.set('query', params.query);
    if (params?.category && params.category !== 'all') searchParams.set('category', params.category);
    if (params?.type && params.type !== 'all') searchParams.set('type', params.type);
    if (params?.workMode && params.workMode !== 'all') searchParams.set('workMode', params.workMode);
    if (params?.deadlineStatus && params.deadlineStatus !== 'all') searchParams.set('deadlineStatus', params.deadlineStatus);

    const queryStr = searchParams.toString();
    return request<{ success: boolean; opportunities: Opportunity[]; total: number }>(
      `/api/opportunities${queryStr ? `?${queryStr}` : ''}`
    );
  },

  getOpportunityById: (id: string) => 
    request<{ success: boolean; opportunity: Opportunity }>(`/api/opportunities/${id}`),

  createOpportunity: (data: Partial<Opportunity>) =>
    request<{ success: boolean; opportunity: Opportunity }>('/api/opportunities', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Parse URL safely
  parseOpportunityUrl: (url: string) =>
    request<{ success: boolean; opportunity: Partial<Opportunity>; source: string }>(
      '/api/eligibility/parse-url',
      {
        method: 'POST',
        body: JSON.stringify({ url })
      }
    ),

  // Parse Resume
  parseResume: async (file: File) => {
    const formData = new FormData();
    formData.append('resume', file);

    return request<{
      success: boolean;
      fileName: string;
      extractedProfile: Partial<StudentProfile>;
      source: string;
    }>('/api/resume/parse', {
      method: 'POST',
      body: formData
    });
  },

  // Eligibility Evaluation
  analyzeEligibility: (data: {
    opportunityId?: string;
    customOpportunity?: Partial<Opportunity>;
    profile: Partial<StudentProfile>;
    rawDescription?: string;
  }) =>
    request<{ success: boolean; report: EligibilityReport; opportunity: Opportunity }>(
      '/api/eligibility/analyze',
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),

  // Answer Follow-Up
  submitFollowUp: (data: {
    reportId: string;
    opportunityId?: string;
    answers: Record<string, any>;
  }) =>
    request<{ success: boolean; report: EligibilityReport; updatedProfile: Partial<StudentProfile> }>(
      '/api/eligibility/follow-up',
      {
        method: 'POST',
        body: JSON.stringify(data)
      }
    ),

  // Profile
  getProfile: () => request<{ success: boolean; profile: StudentProfile }>('/api/profile'),

  updateProfile: (profile: Partial<StudentProfile>) =>
    request<{ success: boolean; profile: StudentProfile }>('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(profile)
    }),

  // Saved Opportunities & Applications
  getSavedApplications: () =>
    request<{ success: boolean; savedApplications: SavedApplication[] }>('/api/saved-opportunities'),

  saveOpportunity: (opportunityId: string, status: string = 'interested', notes: string = '') =>
    request<{ success: boolean; savedApplication: SavedApplication; updated?: boolean }>(
      '/api/saved-opportunities',
      {
        method: 'POST',
        body: JSON.stringify({ opportunityId, status, notes })
      }
    ),

  removeSavedOpportunity: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/saved-opportunities/${id}`, {
      method: 'DELETE'
    }),

  updateApplicationStatus: (
    id: string,
    updates: {
      status?: string;
      notes?: string;
      checklist?: Array<{ id: string; text: string; done: boolean }>;
    }
  ) =>
    request<{ success: boolean; application: SavedApplication }>(`/api/applications/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    }),

  // Reports
  getReports: () => request<{ success: boolean; reports: EligibilityReport[] }>('/api/reports'),

  getReportById: (id: string) =>
    request<{ success: boolean; report: EligibilityReport }>(`/api/reports/${id}`)
};
