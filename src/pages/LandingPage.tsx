import React, { useState } from 'react';
import { 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  Compass, 
  CheckCircle2, 
  FileText, 
  Sparkles, 
  CheckSquare, 
  Building2, 
  Award, 
  Code, 
  GraduationCap, 
  Users, 
  Info,
  ChevronRight,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { Opportunity } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { TrustBanner } from '../components/TrustBanner';
import { Badge, StatusBadge } from '../components/Badge';

interface LandingPageProps {
  opportunities: Opportunity[];
  savedOppIds: Set<string>;
  onToggleSave: (opp: Opportunity) => void;
  onViewDetails: (opp: Opportunity) => void;
  onCheckEligibility: (opp?: Opportunity) => void;
  onNavigate: (route: string) => void;
  onSearchFromLanding: (query: string, category?: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  opportunities,
  savedOppIds,
  onToggleSave,
  onViewDetails,
  onCheckEligibility,
  onNavigate,
  onSearchFromLanding
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchFromLanding(searchQuery);
  };

  const categories = [
    { id: 'internship', name: 'Software Internships', icon: Code, count: '100+ openings', desc: 'Paid industry & open source developer roles' },
    { id: 'scholarship', name: 'Student Scholarships', icon: GraduationCap, count: 'Global grants', desc: 'Merit, diversity & tuition assistance programs' },
    { id: 'research', name: 'Research Fellowships', icon: Award, count: 'Funded labs', desc: 'Faculty-mentored scientific & university projects' },
    { id: 'competition', name: 'Competitions & Cups', icon: TrendingUp, count: '$100k+ prizes', desc: 'Student technology innovation challenges' },
    { id: 'hackathon', name: 'Global Hackathons', icon: Building2, count: 'Weekend sprints', desc: 'Virtual & in-person team building challenges' },
    { id: 'fellowship', name: 'Community Fellowships', icon: Users, count: 'Leadership cohorts', desc: 'Stipends, leadership training & tech networks' }
  ];

  // Pick top 3 featured opportunities
  const featuredOpportunities = opportunities.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="pt-8 sm:pt-14 pb-8 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF8F6] border border-[#CBE6E2] text-xs font-semibold text-[#087F73] mb-6">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Evidence-Based Opportunity Discovery for Students</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#202522] tracking-tight leading-tight sm:leading-none mb-4">
          Find student opportunities.<br className="hidden sm:inline" />
          <span className="text-[#087F73]"> Understand your next step.</span>
        </h1>

        <p className="text-sm sm:text-base text-[#69716D] max-w-2xl mx-auto leading-relaxed mb-8">
          Discover verified internships, scholarships, research programs, and hackathons. Compare your academic profile against official criteria, clarify missing information, and prepare a personalized checklist.
        </p>

        {/* Hero Search Box */}
        <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center bg-white rounded-xl border border-[#E5E9E5] shadow-sm p-1.5 focus-within:border-[#087F73] focus-within:ring-2 focus-within:ring-[#EEF8F6] transition-all">
            <Search className="w-5 h-5 text-[#69716D] ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, program (e.g. GSoC, NASA, Scholarship) or skill..."
              className="w-full px-3 py-2 text-sm text-[#202522] placeholder:text-stone-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold shrink-0 transition-colors cursor-pointer"
            >
              Search
            </button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2 text-xs text-[#69716D]">
            <span>Popular searches:</span>
            {['Google Summer of Code', 'Undergraduate Research', 'Grace Hopper', 'NASA', 'Remote'].map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => onSearchFromLanding(term)}
                className="hover:text-[#087F73] underline decoration-stone-300 hover:decoration-[#087F73] cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </form>

        {/* Primary & Secondary Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('explore')}
            className="px-5 py-2.5 rounded-xl bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            Explore All Opportunities
          </button>
          <button
            onClick={() => onCheckEligibility()}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#E5E9E5] text-[#202522] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-[#087F73]" />
            Check My Eligibility
          </button>
          <button
            onClick={() => onNavigate('resume')}
            className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-50 border border-[#E5E9E5] text-[#69716D] hover:text-[#202522] text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            Upload Resume
          </button>
        </div>
      </section>

      {/* Trust & Policy Callout Banner */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <TrustBanner variant="compact" />
      </section>

      {/* Opportunity Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#202522]">Explore by Opportunity Category</h2>
            <p className="text-xs text-[#69716D]">Curated tracks with verified eligibility standards</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#087F73] hover:text-[#066258] flex items-center gap-1 cursor-pointer"
          >
            <span>View catalog</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onSearchFromLanding('', cat.id)}
                className="p-5 rounded-xl bg-white border border-[#E5E9E5] hover:border-[#087F73]/50 transition-all text-left flex items-start gap-4 group cursor-pointer shadow-xs hover:shadow-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-[#EEF8F6] text-[#087F73] flex items-center justify-center shrink-0 border border-[#CBE6E2] group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#202522] group-hover:text-[#087F73] transition-colors">
                      {cat.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#69716D] mt-1 leading-relaxed">{cat.desc}</p>
                  <span className="inline-block mt-2 text-[11px] font-medium text-[#087F73]">
                    {cat.count} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3-Step Process Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white border border-[#E5E9E5] p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-[#087F73]">How It Works</span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#202522] mt-1">
              A transparent path from discovery to application
            </h2>
            <p className="text-xs text-[#69716D] mt-2">
              No generic match percentages or secret algorithms. Just your profile compared systematically with actual program requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E5E9E5]">
              <div className="w-8 h-8 rounded-lg bg-[#087F73] text-white font-bold text-xs flex items-center justify-center mb-3">
                1
              </div>
              <h3 className="font-semibold text-sm text-[#202522] mb-1.5">
                Add Your Academic Profile
              </h3>
              <p className="text-xs text-[#69716D] leading-relaxed">
                Provide your major, year standing, CGPA, technical skills, and citizenship. Or upload your resume to extract fields instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E5E9E5]">
              <div className="w-8 h-8 rounded-lg bg-[#087F73] text-white font-bold text-xs flex items-center justify-center mb-3">
                2
              </div>
              <h3 className="font-semibold text-sm text-[#202522] mb-1.5">
                Compare Requirements
              </h3>
              <p className="text-xs text-[#69716D] leading-relaxed">
                Select from our catalog, enter a public URL, or paste requirements text. The engine categorizes criteria into Matches, Needs Verification, and Missing Information.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-5 rounded-xl bg-[#FAFAF7] border border-[#E5E9E5]">
              <div className="w-8 h-8 rounded-lg bg-[#087F73] text-white font-bold text-xs flex items-center justify-center mb-3">
                3
              </div>
              <h3 className="font-semibold text-sm text-[#202522] mb-1.5">
                Plan Practical Next Steps
              </h3>
              <p className="text-xs text-[#69716D] leading-relaxed">
                Resolve missing information via guided prompts, gather required documents with a personalized checklist, and track application deadlines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Eligibility Report Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#E5E9E5]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F73] bg-[#EEF8F6] px-2 py-0.5 rounded border border-[#CBE6E2]">
                  Interactive Report Preview
                </span>
                <span className="text-xs text-[#69716D]">Sample Assessment</span>
              </div>
              <h2 className="text-lg font-bold text-[#202522]">
                Google Summer of Code (GSoC) 2026 Evaluation
              </h2>
              <p className="text-xs text-[#69716D]">
                Evaluated against: Alex Chen (Undergraduate, CS & Engineering, CGPA 3.65/4.0)
              </p>
            </div>

            <button
              onClick={() => onCheckEligibility(opportunities[0])}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#087F73] hover:bg-[#066258] text-white transition-colors cursor-pointer self-start sm:self-auto shadow-xs"
            >
              Run Your Own Assessment
            </button>
          </div>

          {/* Sample Breakdown Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-emerald-800">Matches</span>
                <span className="text-sm font-bold text-emerald-900">3 Criteria</span>
              </div>
              <p className="text-[11px] text-emerald-700">Minimum age, programming competency (Python/TypeScript), work legality.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-amber-800">Needs Verification</span>
                <span className="text-sm font-bold text-amber-900">1 Criterion</span>
              </div>
              <p className="text-[11px] text-amber-700">Prior open source contribution history requires repository verification.</p>
            </div>

            <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-sky-800">Missing Information</span>
                <span className="text-sm font-bold text-sky-900">0 Gaps</span>
              </div>
              <p className="text-[11px] text-sky-700">All required baseline fields provided in candidate profile.</p>
            </div>
          </div>

          {/* Sample Criterion Rows */}
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg border border-[#E5E9E5] bg-[#FAFAF7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#202522]">Technical Competence</span>
                <p className="text-[#69716D] text-[11px]">Requirement: Python, C++, TypeScript, or Go knowledge.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#202522]">Profile: Python, TypeScript, React</span>
                <StatusBadge status="match" />
              </div>
            </div>

            <div className="p-3 rounded-lg border border-[#E5E9E5] bg-[#FAFAF7] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-semibold text-[#202522]">Open Source Experience Level</span>
                <p className="text-[#69716D] text-[11px]">Requirement: Beginner to intermediate contributor standing.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-[#202522]">Profile: Campus Course Planner repo</span>
                <StatusBadge status="needs_verification" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-[#202522]">Featured Opportunities</h2>
            <p className="text-xs text-[#69716D]">Authentic programs with verified deadlines and requirements</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-semibold text-[#087F73] hover:text-[#066258] flex items-center gap-1 cursor-pointer"
          >
            <span>Explore all ({opportunities.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredOpportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              isSaved={savedOppIds.has(opp.id)}
              onToggleSave={onToggleSave}
              onViewDetails={onViewDetails}
              onCheckEligibility={onCheckEligibility}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
