import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface DistributionChartProps {
  summaryCounts: {
    matches: number;
    needsVerification: number;
    missingInformation: number;
    totalCriteria: number;
  };
  className?: string;
}

export const DistributionChart: React.FC<DistributionChartProps> = ({ summaryCounts, className = '' }) => {
  const { matches, needsVerification, missingInformation, totalCriteria } = summaryCounts;

  const matchPct = totalCriteria > 0 ? (matches / totalCriteria) * 100 : 0;
  const verifPct = totalCriteria > 0 ? (needsVerification / totalCriteria) * 100 : 0;
  const missPct = totalCriteria > 0 ? (missingInformation / totalCriteria) * 100 : 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Graphical Bar */}
      <div>
        <div className="flex justify-between items-center text-xs text-[#69716D] mb-1.5 font-medium">
          <span>Criteria Evaluation Distribution</span>
          <span>{totalCriteria} total evaluated {totalCriteria === 1 ? 'criterion' : 'criteria'}</span>
        </div>
        <div className="h-4 w-full rounded-full bg-stone-100 flex overflow-hidden p-0.5 border border-[#E5E9E5]" role="progressbar" aria-label="Criteria Distribution">
          {matches > 0 && (
            <div
              style={{ width: `${matchPct}%` }}
              className="h-full bg-emerald-600 rounded-l-full transition-all duration-500"
              title={`Matches: ${matches} (${Math.round(matchPct)}%)`}
            />
          )}
          {needsVerification > 0 && (
            <div
              style={{ width: `${verifPct}%` }}
              className="h-full bg-amber-500 transition-all duration-500"
              title={`Needs Verification: ${needsVerification} (${Math.round(verifPct)}%)`}
            />
          )}
          {missingInformation > 0 && (
            <div
              style={{ width: `${missPct}%` }}
              className="h-full bg-sky-500 rounded-r-full transition-all duration-500"
              title={`Missing Information: ${missingInformation} (${Math.round(missPct)}%)`}
            />
          )}
        </div>
      </div>

      {/* Accessible readable alternative & breakdown tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Matches */}
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-900">{matches}</span>
              <span className="text-xs text-emerald-700 font-medium">of {totalCriteria}</span>
            </div>
            <p className="text-xs font-semibold text-emerald-800">Matches</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Profile satisfies criterion</p>
          </div>
        </div>

        {/* Needs Verification */}
        <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-amber-900">{needsVerification}</span>
              <span className="text-xs text-amber-700 font-medium">of {totalCriteria}</span>
            </div>
            <p className="text-xs font-semibold text-amber-800">Needs Verification</p>
            <p className="text-[11px] text-amber-600 mt-0.5">Requires external proof</p>
          </div>
        </div>

        {/* Missing Information */}
        <div className="p-3.5 rounded-xl border border-sky-200 bg-sky-50/50 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-sky-900">{missingInformation}</span>
              <span className="text-xs text-sky-700 font-medium">of {totalCriteria}</span>
            </div>
            <p className="text-xs font-semibold text-sky-800">Missing Information</p>
            <p className="text-[11px] text-sky-600 mt-0.5">Answer follow-up prompt</p>
          </div>
        </div>
      </div>
    </div>
  );
};
