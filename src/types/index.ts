export type OpportunityCategory = 
  | 'internship'
  | 'scholarship'
  | 'hackathon'
  | 'research'
  | 'competition'
  | 'fellowship';

export type OpportunityType = 
  | 'fully_funded'
  | 'stipend'
  | 'award'
  | 'unpaid_learning'
  | 'tuition_grant';

export type WorkMode = 'remote' | 'on_site' | 'hybrid';

export type DeadlineStatus = 'open' | 'closing_soon' | 'rolling' | 'closed';

export type CriterionCategory =
  | 'education_level'
  | 'field_of_study'
  | 'minimum_cgpa'
  | 'graduation_year'
  | 'skills'
  | 'location_citizenship'
  | 'experience'
  | 'enrollment_status';

export interface CriterionItem {
  id: string;
  name: string;
  category: CriterionCategory;
  description: string;
  operator: 'gte' | 'lte' | 'equals' | 'includes_any' | 'includes_all' | 'in_list' | 'boolean' | 'text_check';
  targetValue: any;
  importance: 'mandatory' | 'preferred' | 'conditional';
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  category: OpportunityCategory;
  type: OpportunityType;
  shortDescription: string;
  fullDescription: string;
  location: string;
  workMode: WorkMode;
  deadline: string; // ISO or date string
  deadlineStatus: DeadlineStatus;
  fundingAmount: string;
  officialUrl: string;
  lastVerified: string;
  isVerifiedSeed: boolean;
  eligibilitySummary: string;
  criteria: CriterionItem[];
  requiredDocuments: string[];
  applicationSteps: string[];
  importantDates: { label: string; date: string }[];
}

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  educationLevel: 'high_school' | 'undergraduate' | 'masters' | 'phd' | 'recent_grad';
  degreeMajor: string;
  institution: string;
  currentYear: string;
  graduationYear: number;
  cgpa: number | null;
  cgpaScale: number; // 4.0, 10.0, or 100
  skills: string[];
  experienceSummary: string;
  projects: Array<{ title: string; description: string; tech: string[] }>;
  countryOfResidence: string;
  citizenship: string;
  preferredWorkMode: 'remote' | 'on_site' | 'hybrid' | 'any';
  enrolledStatus: boolean;
  resumeFileName?: string;
  resumeParsedText?: string;
  updatedAt: string;
}

export type CriterionAssessmentStatus = 'match' | 'needs_verification' | 'missing_information';

export interface CriterionAssessment {
  criterionId: string;
  criterionName: string;
  category: CriterionCategory;
  expected: string;
  actual: string;
  status: CriterionAssessmentStatus;
  reasoning: string;
  recommendedAction: string;
}

export interface FollowUpQuestion {
  id: string;
  criterionId: string;
  question: string;
  fieldType: 'text' | 'number' | 'select' | 'boolean';
  options?: string[];
  helperText: string;
  currentValue?: any;
}

export interface NextStepTask {
  id: string;
  title: string;
  description: string;
  category: 'profile_fix' | 'documentation' | 'verification' | 'application_submission';
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

export interface EligibilityReport {
  id: string;
  opportunityId?: string;
  opportunityTitle: string;
  opportunityOrg: string;
  officialUrl?: string;
  generatedAt: string;
  overallVerdict: 'high_match' | 'partial_match' | 'needs_attention' | 'insufficient_info';
  summaryCounts: {
    matches: number;
    needsVerification: number;
    missingInformation: number;
    totalCriteria: number;
  };
  criteriaResults: CriterionAssessment[];
  followUpQuestions: FollowUpQuestion[];
  nextStepsPlan: NextStepTask[];
  disclaimer: string;
  inputProfileSnapshot: Partial<StudentProfile>;
  rawOpportunityDescription?: string;
}

export type ApplicationStatus = 'interested' | 'preparing' | 'ready_to_apply' | 'applied' | 'closed';

export interface SavedApplication {
  id: string;
  opportunityId: string;
  opportunity: Opportunity;
  status: ApplicationStatus;
  notes: string;
  savedAt: string;
  appliedAt?: string;
  checklist: Array<{ id: string; text: string; done: boolean }>;
}
