import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Globe, 
  FileText, 
  ListFilter, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { Opportunity, StudentProfile, EligibilityReport } from '../types';
import { api } from '../api/client';
import { TrustBanner } from '../components/TrustBanner';

interface EligibilityCheckerPageProps {
  opportunities: Opportunity[];
  currentProfile: StudentProfile;
  initialOpportunity?: Opportunity | null;
  onReportGenerated: (report: EligibilityReport, opp: Opportunity) => void;
  onNavigateToResume: () => void;
}

export const EligibilityCheckerPage: React.FC<EligibilityCheckerPageProps> = ({
  opportunities,
  currentProfile,
  initialOpportunity = null,
  onReportGenerated,
  onNavigateToResume
}) => {
  // Input method mode: 'catalog' | 'url' | 'paste'
  const [entryMode, setEntryMode] = useState<'catalog' | 'url' | 'paste'>('catalog');

  // Selected opportunity from catalog
  const [selectedOppId, setSelectedOppId] = useState<string>(
    initialOpportunity ? initialOpportunity.id : (opportunities[0]?.id || '')
  );

  // URL input state
  const [urlInput, setUrlInput] = useState('');
  const [isUrlExtracting, setIsUrlExtracting] = useState(false);
  const [urlExtractError, setUrlExtractError] = useState<string | null>(null);
  const [extractedOpp, setExtractedOpp] = useState<Partial<Opportunity> | null>(null);

  // Raw paste state
  const [pastedText, setPastedText] = useState('');
  const [pastedTitle, setPastedTitle] = useState('');
  const [pastedOrg, setPastedOrg] = useState('');

  // Editable Student Profile for this evaluation
  const [profileForm, setProfileForm] = useState<StudentProfile>({ ...currentProfile });
  const [syncToSavedProfile, setSyncToSavedProfile] = useState(true);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Handle URL fetch
  const handleExtractUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUrlExtracting(true);
    setUrlExtractError(null);
    setExtractedOpp(null);

    try {
      const res = await api.parseOpportunityUrl(urlInput.trim());
      if (res.success && res.opportunity) {
        setExtractedOpp(res.opportunity);
      }
    } catch (err: any) {
      setUrlExtractError(err.message || 'Failed to fetch and analyze URL. You can paste the requirements text below.');
    } finally {
      setIsUrlExtracting(false);
    }
  };

  // Run final eligibility evaluation
  const handleRunAssessment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      let payload: any = {
        profile: profileForm
      };

      if (entryMode === 'catalog') {
        payload.opportunityId = selectedOppId;
      } else if (entryMode === 'url') {
        if (!extractedOpp) {
          throw new Error('Please fetch the URL first or paste the requirements directly.');
        }
        payload.customOpportunity = extractedOpp;
      } else if (entryMode === 'paste') {
        if (!pastedText.trim()) {
          throw new Error('Please paste the opportunity criteria or notice description.');
        }
        payload.rawDescription = pastedText.trim();
        payload.customOpportunity = {
          title: pastedTitle.trim() || 'Custom Pasted Opportunity',
          organization: pastedOrg.trim() || 'Organization',
          fullDescription: pastedText.trim()
        };
      }

      const res = await api.analyzeEligibility(payload);
      if (res.success && res.report) {
        // If user opted to sync back to main profile, update in background
        if (syncToSavedProfile) {
          api.updateProfile(profileForm).catch(() => {});
        }
        onReportGenerated(res.report, res.opportunity);
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An error occurred while evaluating eligibility. Please verify your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOpp = opportunities.find(o => o.id === selectedOppId);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#202522]">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-4 h-4 text-[#087F73]" />
          <span className="text-xs font-semibold text-[#087F73] uppercase tracking-wider">
            Automated Eligibility Verification
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
          Eligibility Checker
        </h1>
        <p className="text-xs text-[#69716D] mt-1 max-w-2xl leading-relaxed">
          Compare your student background against explicit requirements. Discover verified matches, clarify missing details, and avoid submitting disqualified applications.
        </p>
      </div>

      <TrustBanner variant="compact" />

      {/* STEP 1: Select Opportunity Source */}
      <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold text-[#202522] uppercase tracking-wider mb-1">
            Step 1: Choose Opportunity to Check
          </h2>
          <p className="text-xs text-[#69716D]">
            Select an opportunity from our catalog, provide an external URL, or paste requirements text.
          </p>
        </div>

        {/* 3 Entry Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-1 bg-[#FAFAF7] rounded-xl border border-[#E5E9E5]">
          <button
            type="button"
            onClick={() => setEntryMode('catalog')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              entryMode === 'catalog'
                ? 'bg-white text-[#087F73] shadow-xs border border-[#E5E9E5]'
                : 'text-[#69716D] hover:text-[#202522]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Select from Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('url')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              entryMode === 'url'
                ? 'bg-white text-[#087F73] shadow-xs border border-[#E5E9E5]'
                : 'text-[#69716D] hover:text-[#202522]'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Enter Opportunity URL</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('paste')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              entryMode === 'paste'
                ? 'bg-white text-[#087F73] shadow-xs border border-[#E5E9E5]'
                : 'text-[#69716D] hover:text-[#202522]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Paste Requirements</span>
          </button>
        </div>

        {/* Tab 1: Catalog Selection */}
        {entryMode === 'catalog' && (
          <div className="space-y-3">
            <label className="block text-xs font-semibold text-[#202522]">
              Select Opportunity:
            </label>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5E9E5] bg-white text-xs font-medium text-[#202522] focus:outline-none focus:border-[#087F73]"
            >
              {opportunities.map((opp) => (
                <option key={opp.id} value={opp.id}>
                  {opp.title} ({opp.organization}) — {opp.category}
                </option>
              ))}
            </select>

            {selectedOpp && (
              <div className="p-3.5 rounded-xl bg-stone-50 border border-[#E5E9E5] text-xs space-y-1">
                <div className="flex items-center justify-between font-semibold text-[#202522]">
                  <span>{selectedOpp.title}</span>
                  <span className="text-[#087F73] capitalize">{selectedOpp.category}</span>
                </div>
                <p className="text-[#69716D]">{selectedOpp.shortDescription}</p>
                <div className="text-[11px] text-[#69716D] pt-1 flex items-center gap-3">
                  <span>{selectedOpp.criteria.length} explicit criteria</span>
                  <span>•</span>
                  <span>Deadline: {selectedOpp.deadline ? new Date(selectedOpp.deadline).toLocaleDateString() : 'Unspecified'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: URL Input */}
        {entryMode === 'url' && (
          <div className="space-y-4">
            <form onSubmit={handleExtractUrl} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.org/internships/student-program-2026"
                className="flex-1 px-3.5 py-2 rounded-xl border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
                required
              />
              <button
                type="submit"
                disabled={isUrlExtracting}
                className="px-4 py-2 rounded-xl bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isUrlExtracting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <span>Extract Criteria</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            {urlExtractError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>URL Retrieval Notice</span>
                </div>
                <p>{urlExtractError}</p>
                <button
                  type="button"
                  onClick={() => setEntryMode('paste')}
                  className="mt-1 text-xs text-[#087F73] underline font-semibold hover:text-[#066258] cursor-pointer"
                >
                  Switch to manual paste →
                </button>
              </div>
            )}

            {extractedOpp && (
              <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Successfully Extracted Criteria</span>
                </div>
                <p className="font-bold text-sm text-[#202522]">{extractedOpp.title}</p>
                <p className="text-[#69716D]">{extractedOpp.shortDescription}</p>
                {extractedOpp.criteria && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Found {extractedOpp.criteria.length} structured requirements from this page.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Paste Input */}
        {entryMode === 'paste' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">
                  Opportunity Title:
                </label>
                <input
                  type="text"
                  value={pastedTitle}
                  onChange={(e) => setPastedTitle(e.target.value)}
                  placeholder="e.g. Summer Research Grant 2026"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">
                  Organization / University:
                </label>
                <input
                  type="text"
                  value={pastedOrg}
                  onChange={(e) => setPastedOrg(e.target.value)}
                  placeholder="e.g. Stanford University Lab"
                  className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Pasted Requirements & Eligibility Notice:
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={5}
                placeholder="Paste the eligibility section, minimum GPA rules, prerequisite courses, deadlines, and required documentation..."
                className="w-full px-3 py-2 rounded-xl border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
              <span className="text-[11px] text-[#69716D]">
                Our engine automatically extracts GPA, major, academic standing, and required skills.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: Candidate Academic Profile Form */}
      <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5E9E5]">
          <div>
            <h2 className="text-sm font-bold text-[#202522] uppercase tracking-wider">
              Step 2: Candidate Profile & Qualifications
            </h2>
            <p className="text-xs text-[#69716D] mt-0.5">
              Review and adjust the profile information to test against this opportunity.
            </p>
          </div>

          <button
            type="button"
            onClick={onNavigateToResume}
            className="text-xs font-semibold text-[#087F73] hover:text-[#066258] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import from Resume</span>
          </button>
        </div>

        <form onSubmit={handleRunAssessment} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Education Level */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Current Education Stage
              </label>
              <select
                value={profileForm.educationLevel}
                onChange={(e) => setProfileForm({ ...profileForm, educationLevel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              >
                <option value="undergraduate">Undergraduate (Bachelors / Associate)</option>
                <option value="masters">Masters / Post-Graduate</option>
                <option value="phd">PhD / Doctoral</option>
                <option value="high_school">High School</option>
                <option value="recent_grad">Recent Graduate</option>
              </select>
            </div>

            {/* Major / Field of Study */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Major / Field of Study
              </label>
              <input
                type="text"
                value={profileForm.degreeMajor}
                onChange={(e) => setProfileForm({ ...profileForm, degreeMajor: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            {/* Academic Year Standing */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Current Year Standing
              </label>
              <select
                value={profileForm.currentYear}
                onChange={(e) => setProfileForm({ ...profileForm, currentYear: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year (Final Year)">4th Year (Senior / Final Year)</option>
                <option value="Graduate Student">Graduate Student</option>
              </select>
            </div>

            {/* Projected Graduation Year */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Expected Graduation Year
              </label>
              <input
                type="number"
                value={profileForm.graduationYear || ''}
                onChange={(e) => setProfileForm({ ...profileForm, graduationYear: parseInt(e.target.value, 10) || 2027 })}
                placeholder="2027"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            {/* CGPA and Scale */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Cumulative CGPA / GPA
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={profileForm.cgpa ?? ''}
                  onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value === '' ? null : parseFloat(e.target.value) })}
                  placeholder="e.g. 3.65"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
                />
                <select
                  value={profileForm.cgpaScale}
                  onChange={(e) => setProfileForm({ ...profileForm, cgpaScale: parseFloat(e.target.value) })}
                  className="w-24 px-2 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none"
                >
                  <option value={4.0}>/ 4.0</option>
                  <option value={10.0}>/ 10.0</option>
                  <option value={100}>/ 100%</option>
                </select>
              </div>
            </div>

            {/* Enrollment Confirmation */}
            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#202522] select-none">
                <input
                  type="checkbox"
                  checked={profileForm.enrolledStatus}
                  onChange={(e) => setProfileForm({ ...profileForm, enrolledStatus: e.target.checked })}
                  className="rounded accent-[#087F73]"
                />
                <span>Currently actively matriculated in an accredited institution</span>
              </label>
            </div>

            {/* Country of Residence */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Country of Residence
              </label>
              <input
                type="text"
                value={profileForm.countryOfResidence}
                onChange={(e) => setProfileForm({ ...profileForm, countryOfResidence: e.target.value })}
                placeholder="e.g. United States, India, Germany"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            {/* Citizenship */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Citizenship / Nationality
              </label>
              <input
                type="text"
                value={profileForm.citizenship}
                onChange={(e) => setProfileForm({ ...profileForm, citizenship: e.target.value })}
                placeholder="e.g. United States"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>
          </div>

          {/* Technical Skills */}
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">
              Technical Skills & Proficiencies
            </label>
            <input
              type="text"
              value={profileForm.skills.join(', ')}
              onChange={(e) => setProfileForm({
                ...profileForm,
                skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
              })}
              placeholder="Python, React, TypeScript, Git, C++, SQL, Linux..."
              className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
            />
            <span className="text-[11px] text-[#69716D]">
              Separate skills with commas.
            </span>
          </div>

          {/* Sync Option Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#69716D] select-none">
              <input
                type="checkbox"
                checked={syncToSavedProfile}
                onChange={(e) => setSyncToSavedProfile(e.target.checked)}
                className="rounded accent-[#087F73]"
              />
              <span>Save any modified details back to my permanent profile</span>
            </label>
          </div>

          {submitError && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          )}

          {/* Run Action */}
          <div className="pt-4 border-t border-[#E5E9E5] flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Eligibility Rules...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Evaluate My Eligibility</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
