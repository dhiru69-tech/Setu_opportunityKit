import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  Printer, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Calendar, 
  FileCheck, 
  Bookmark, 
  BookmarkCheck, 
  RefreshCw,
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { EligibilityReport, Opportunity, StudentProfile, NextStepTask } from '../types';
import { StatusBadge, Badge } from '../components/Badge';
import { DistributionChart } from '../components/DistributionChart';
import { NextStepsPlan } from '../components/NextStepsPlan';
import { GuidedQuestionsModal } from '../components/GuidedQuestionsModal';
import { TrustBanner } from '../components/TrustBanner';

interface ReportPageProps {
  report: EligibilityReport;
  opportunity: Opportunity | null;
  isSaved: boolean;
  onToggleSave: (opp: Opportunity) => void;
  onBackToChecker: () => void;
  onSubmitFollowUp: (answers: Record<string, any>) => Promise<void>;
  onTasksChange: (tasks: NextStepTask[]) => void;
}

export const ReportPage: React.FC<ReportPageProps> = ({
  report,
  opportunity,
  isSaved,
  onToggleSave,
  onBackToChecker,
  onSubmitFollowUp,
  onTasksChange
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'match' | 'needs_verification' | 'missing_information'>('all');
  const [isGuidedModalOpen, setIsGuidedModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const criteriaList = report.criteriaResults || [];
  const filteredCriteria = activeTab === 'all'
    ? criteriaList
    : criteriaList.filter(c => c.status === activeTab);

  const handlePrint = () => {
    window.print();
  };

  const handleShareSummary = () => {
    const text = `OpportunityKit Eligibility Report for ${report.opportunityTitle}: ${report.summaryCounts.matches} Matches, ${report.summaryCounts.needsVerification} Needs Verification, ${report.summaryCounts.missingInformation} Missing Information.`;
    navigator.clipboard.writeText(text).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    });
  };

  const getVerdictLabel = () => {
    switch (report.overallVerdict) {
      case 'high_match':
        return {
          title: 'Strong Initial Match',
          desc: 'Your profile satisfies the majority of explicit program requirements.',
          color: 'text-emerald-800 bg-emerald-50 border-emerald-200'
        };
      case 'partial_match':
        return {
          title: 'Partial Match — Key Criteria Met',
          desc: 'Several criteria match; some items require verification or supplemental records.',
          color: 'text-teal-900 bg-[#EEF8F6] border-[#CBE6E2]'
        };
      case 'needs_attention':
        return {
          title: 'Verification Needed',
          desc: 'Review specific departmental or geographic guidelines before preparing your application.',
          color: 'text-amber-800 bg-amber-50 border-amber-200'
        };
      case 'insufficient_info':
      default:
        return {
          title: 'Information Incomplete',
          desc: 'Answer the guided follow-up questions to produce a definitive criteria check.',
          color: 'text-sky-800 bg-sky-50 border-sky-200'
        };
    }
  };

  const verdict = getVerdictLabel();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#202522]">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <button
          onClick={onBackToChecker}
          className="text-[#69716D] hover:text-[#202522] flex items-center gap-1 font-medium cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Eligibility Checker</span>
        </button>

        <div className="flex items-center gap-2">
          {opportunity && (
            <button
              onClick={() => onToggleSave(opportunity)}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#EEF8F6] text-[#087F73] border-[#CBE6E2]'
                  : 'bg-white text-[#202522] border-[#E5E9E5] hover:bg-stone-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
              <span>{isSaved ? 'Saved in Tracker' : 'Save to Tracker'}</span>
            </button>
          )}

          <button
            onClick={handleShareSummary}
            className="px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white hover:bg-stone-50 text-[#202522] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-[#69716D]" />
            <span>{copySuccess ? 'Copied Summary!' : 'Share Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white hover:bg-stone-50 text-[#202522] flex items-center gap-1.5 font-medium transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#69716D]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Report Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#087F73] bg-[#EEF8F6] px-2.5 py-0.5 rounded border border-[#CBE6E2]">
              Official Eligibility Assessment
            </span>
            <span className="text-xs text-[#69716D] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
            {report.opportunityTitle}
          </h1>

          <p className="text-xs font-medium text-[#69716D] mt-1 flex flex-wrap items-center gap-2">
            <span>Host: {report.opportunityOrg}</span>
            {report.officialUrl && (
              <>
                <span>•</span>
                <a
                  href={report.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#087F73] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Official Application Notice</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </p>
        </div>

        {/* Overall Status Banner */}
        <div className={`p-4 rounded-xl border ${verdict.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
          <div>
            <h3 className="text-sm font-bold">{verdict.title}</h3>
            <p className="text-xs mt-0.5 opacity-90">{verdict.desc}</p>
          </div>

          {report.summaryCounts.missingInformation > 0 && (
            <button
              onClick={() => setIsGuidedModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Answer {report.summaryCounts.missingInformation} Missing Questions</span>
            </button>
          )}
        </div>

        {/* Visual Distribution Chart */}
        <DistributionChart summaryCounts={report.summaryCounts} />
      </div>

      {/* Trust Notice */}
      <TrustBanner variant="compact" />

      {/* Criterion Breakdown Section */}
      <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E9E5]">
          <div>
            <h2 className="text-base font-bold text-[#202522]">
              Criterion-by-Criterion Evaluation ({report.criteriaResults.length})
            </h2>
            <p className="text-xs text-[#69716D] mt-0.5">
              Inspect expected requirement vs available student profile data and recommended next steps.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 bg-[#FAFAF7] p-1 rounded-lg border border-[#E5E9E5] text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-2.5 py-1 rounded font-medium ${
                activeTab === 'all' ? 'bg-white shadow-xs text-[#202522] font-semibold' : 'text-[#69716D]'
              }`}
            >
              All ({criteriaList.length})
            </button>
            <button
              onClick={() => setActiveTab('match')}
              className={`px-2.5 py-1 rounded font-medium ${
                activeTab === 'match' ? 'bg-white shadow-xs text-emerald-800 font-semibold' : 'text-[#69716D]'
              }`}
            >
              Matches ({report.summaryCounts.matches})
            </button>
            <button
              onClick={() => setActiveTab('needs_verification')}
              className={`px-2.5 py-1 rounded font-medium ${
                activeTab === 'needs_verification' ? 'bg-white shadow-xs text-amber-800 font-semibold' : 'text-[#69716D]'
              }`}
            >
              Verify ({report.summaryCounts.needsVerification})
            </button>
            <button
              onClick={() => setActiveTab('missing_information')}
              className={`px-2.5 py-1 rounded font-medium ${
                activeTab === 'missing_information' ? 'bg-white shadow-xs text-sky-800 font-semibold' : 'text-[#69716D]'
              }`}
            >
              Missing ({report.summaryCounts.missingInformation})
            </button>
          </div>
        </div>

        {/* Criteria Cards */}
        <div className="space-y-4">
          {filteredCriteria.map((c, idx) => (
            <div
              key={c.criterionId || idx}
              className="p-4 rounded-xl border border-[#E5E9E5] bg-[#FAFAF7] space-y-3 text-xs"
            >
              {/* Header: Title and Status */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#202522]">
                      {c.criterionName}
                    </h3>
                    <span className="text-[10px] text-[#69716D] uppercase font-bold bg-stone-200/70 px-1.5 py-0.2 rounded">
                      {c.category.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-[#69716D] mt-0.5">{c.expected}</p>
                </div>
                <StatusBadge status={c.status} />
              </div>

              {/* Data comparison: Actual vs Reasoning */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#E5E9E5]/70">
                <div className="p-2.5 rounded bg-white border border-[#E5E9E5]">
                  <span className="text-[11px] font-semibold text-[#69716D] block mb-0.5">
                    Your Profile Information:
                  </span>
                  <p className="font-medium text-[#202522]">{c.actual}</p>
                </div>

                <div className="p-2.5 rounded bg-white border border-[#E5E9E5]">
                  <span className="text-[11px] font-semibold text-[#69716D] block mb-0.5">
                    Reasoning:
                  </span>
                  <p className="text-[#69716D]">{c.reasoning}</p>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="flex items-center gap-2 text-[11px] text-[#087F73] font-medium pt-1">
                <span className="font-bold">Next Action:</span>
                <span>{c.recommendedAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Next Steps Plan Checklist */}
      {report.nextStepsPlan && report.nextStepsPlan.length > 0 && (
        <NextStepsPlan
          tasks={report.nextStepsPlan}
          onTasksChange={onTasksChange}
        />
      )}

      {/* Disclaimer Bottom Note */}
      <div className="p-4 rounded-xl bg-stone-50 border border-[#E5E9E5] text-xs text-[#69716D] space-y-1">
        <p className="font-semibold text-[#202522]">Important Disclaimer:</p>
        <p className="leading-relaxed">{report.disclaimer}</p>
      </div>

      {/* Guided Questions Modal */}
      <GuidedQuestionsModal
        isOpen={isGuidedModalOpen}
        onClose={() => setIsGuidedModalOpen(false)}
        report={report}
        onSubmitAnswers={onSubmitFollowUp}
      />
    </div>
  );
};
