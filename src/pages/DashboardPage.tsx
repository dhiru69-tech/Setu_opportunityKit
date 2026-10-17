import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Bookmark, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Upload, 
  ExternalLink,
  Sparkles,
  TrendingUp,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { StudentProfile, SavedApplication, EligibilityReport, Opportunity } from '../types';
import { Badge, StatusBadge } from '../components/Badge';

interface DashboardPageProps {
  profile: StudentProfile;
  savedApplications: SavedApplication[];
  recentReports: EligibilityReport[];
  onNavigate: (route: string) => void;
  onViewReport: (report: EligibilityReport) => void;
  onViewOpportunity: (opp: Opportunity) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  profile,
  savedApplications,
  recentReports,
  onNavigate,
  onViewReport,
  onViewOpportunity
}) => {
  // Calculate profile completion score
  const calculateProfileCompletion = () => {
    let score = 0;
    if (profile.fullName) score += 15;
    if (profile.degreeMajor) score += 15;
    if (profile.educationLevel) score += 15;
    if (profile.graduationYear) score += 15;
    if (profile.cgpa !== null && profile.cgpa !== undefined) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 15;
    if (profile.countryOfResidence) score += 10;
    return score;
  };

  const completionScore = calculateProfileCompletion();

  // Upcoming deadlines from saved applications
  const upcomingDeadlines = savedApplications
    .filter(a => a.opportunity.deadline)
    .sort((a, b) => new Date(a.opportunity.deadline).getTime() - new Date(b.opportunity.deadline).getTime())
    .slice(0, 3);

  // Total checklist items
  const totalChecklistItems = savedApplications.reduce((acc, app) => acc + (app.checklist?.length || 0), 0);
  const completedChecklistItems = savedApplications.reduce(
    (acc, app) => acc + (app.checklist?.filter(c => c.done).length || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#202522]">
      {/* Welcome Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087F73]" />
            <span className="text-xs font-semibold text-[#087F73] uppercase tracking-wider">
              Student Career Station
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
            Welcome back, {profile.fullName || 'Student'}
          </h1>
          <p className="text-xs text-[#69716D] mt-1">
            {profile.institution || 'University'} • {profile.degreeMajor || 'Student Track'} • Class of {profile.graduationYear || '2027'}
          </p>
        </div>

        {/* Profile Completion Dial */}
        <div className="flex items-center gap-4 bg-[#FAFAF7] p-3.5 rounded-xl border border-[#E5E9E5] shrink-0">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-[#202522] mb-1">
              <span>Profile Readiness</span>
              <span>{completionScore}%</span>
            </div>
            <div className="w-36 h-2 rounded-full bg-stone-200 overflow-hidden">
              <div
                className="h-full bg-[#087F73] transition-all duration-500"
                style={{ width: `${completionScore}%` }}
              />
            </div>
            <p className="text-[10px] text-[#69716D] mt-1">
              {completionScore < 100 ? 'Add remaining fields for higher accuracy' : 'Profile fully verified'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('profile')}
            className="px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white hover:bg-stone-50 text-xs font-medium text-[#202522] transition-colors"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9E5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#69716D] font-medium">Saved Opportunities</span>
            <div className="w-7 h-7 rounded-lg bg-[#EEF8F6] text-[#087F73] flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#202522]">{savedApplications.length}</p>
          <button
            onClick={() => onNavigate('saved')}
            className="text-[11px] text-[#087F73] hover:underline font-medium mt-1 inline-block"
          >
            View application tracker →
          </button>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9E5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#69716D] font-medium">Eligibility Checks</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#202522]">{recentReports.length}</p>
          <button
            onClick={() => onNavigate('checker')}
            className="text-[11px] text-[#087F73] hover:underline font-medium mt-1 inline-block"
          >
            Run new verification →
          </button>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9E5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#69716D] font-medium">Preparation Tasks</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#202522]">
            {completedChecklistItems} / {totalChecklistItems}
          </p>
          <span className="text-[11px] text-[#69716D] mt-1 inline-block">
            {totalChecklistItems > 0 ? `${Math.round((completedChecklistItems / totalChecklistItems) * 100)}% completed` : 'No active tasks'}
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E9E5] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-[#69716D] font-medium">Upcoming Deadlines</span>
            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <p className="text-2xl font-bold text-[#202522]">{upcomingDeadlines.length}</p>
          <span className="text-[11px] text-[#69716D] mt-1 inline-block">
            In next 30–90 days
          </span>
        </div>
      </div>

      {/* Main Grid: Recent Reports & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Eligibility Reports (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#202522]">
              Recent Eligibility Reports
            </h2>
            <button
              onClick={() => onNavigate('checker')}
              className="text-xs font-semibold text-[#087F73] hover:text-[#066258] cursor-pointer"
            >
              + Check another opportunity
            </button>
          </div>

          {recentReports.length > 0 ? (
            <div className="space-y-3">
              {recentReports.slice(0, 4).map((rep) => (
                <div
                  key={rep.id}
                  className="p-4 rounded-xl bg-white border border-[#E5E9E5] hover:border-[#087F73]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm text-[#202522]">
                        {rep.opportunityTitle}
                      </h3>
                      <span className="text-[10px] text-[#69716D] bg-stone-100 px-1.5 py-0.2 rounded font-medium">
                        {rep.opportunityOrg}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-[#69716D]">
                      <span className="text-emerald-700 font-semibold">{rep.summaryCounts.matches} Matches</span>
                      <span>•</span>
                      <span className="text-amber-700 font-semibold">{rep.summaryCounts.needsVerification} Verify</span>
                      <span>•</span>
                      <span className="text-sky-700 font-semibold">{rep.summaryCounts.missingInformation} Missing</span>
                      <span>•</span>
                      <span className="text-stone-400">{new Date(rep.generatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onViewReport(rep)}
                    className="px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white hover:bg-stone-50 text-xs font-medium text-[#202522] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <span>View Report</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 rounded-xl bg-white border border-[#E5E9E5] text-center space-y-3">
              <ShieldCheck className="w-8 h-8 text-[#087F73] mx-auto" />
              <h3 className="text-sm font-semibold text-[#202522]">No evaluations yet</h3>
              <p className="text-xs text-[#69716D] max-w-sm mx-auto">
                Run an eligibility evaluation on Google Summer of Code, scholarships, or paste your own target program.
              </p>
              <button
                onClick={() => onNavigate('checker')}
                className="px-4 py-2 rounded-lg bg-[#087F73] text-white text-xs font-semibold cursor-pointer"
              >
                Run First Eligibility Check
              </button>
            </div>
          )}

          {/* Quick Action Bar */}
          <div className="p-4 rounded-xl bg-stone-50 border border-[#E5E9E5] flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="font-semibold text-[#202522]">Quick Student Actions:</span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('resume')}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E9E5] hover:bg-stone-100 text-[#202522] font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#087F73]" />
                <span>Upload New Resume</span>
              </button>
              <button
                onClick={() => onNavigate('explore')}
                className="px-3 py-1.5 rounded-lg bg-white border border-[#E5E9E5] hover:bg-stone-100 text-[#202522] font-medium flex items-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-[#087F73]" />
                <span>Discover Fellowships</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines & Tracker Preview (1 col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#202522]">
              Verified Deadlines
            </h2>
            <button
              onClick={() => onNavigate('saved')}
              className="text-xs font-semibold text-[#087F73] hover:text-[#066258] cursor-pointer"
            >
              All tracker items
            </button>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E9E5] p-4 shadow-xs space-y-3">
            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((app) => (
                  <div key={app.id} className="p-3 rounded-lg border border-[#E5E9E5] bg-[#FAFAF7] space-y-1 text-xs">
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-semibold text-[#202522] line-clamp-1">{app.opportunity.title}</span>
                      <span className="text-[10px] uppercase font-bold text-[#087F73] bg-[#EEF8F6] px-1.5 py-0.2 rounded border border-[#CBE6E2]">
                        {app.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#69716D]">{app.opportunity.organization}</p>
                    <div className="flex items-center gap-1 text-[11px] font-medium text-amber-800 pt-1">
                      <Calendar className="w-3 h-3 text-amber-700" />
                      <span>{new Date(app.opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-xs text-[#69716D] space-y-2">
                <Calendar className="w-6 h-6 mx-auto text-stone-300" />
                <p>No upcoming deadlines saved yet.</p>
                <button
                  onClick={() => onNavigate('explore')}
                  className="text-[#087F73] font-semibold hover:underline"
                >
                  Explore opportunities to track →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function Compass(props: any) {
  return (
    <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  );
}
