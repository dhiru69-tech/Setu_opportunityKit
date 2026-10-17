import React from 'react';
import { Info, ShieldAlert } from 'lucide-react';

interface TrustBannerProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const TrustBanner: React.FC<TrustBannerProps> = ({ className = '', variant = 'compact' }) => {
  if (variant === 'compact') {
    return (
      <div className={`flex items-start gap-2.5 p-3 rounded-lg bg-[#FAFAF7] border border-[#E5E9E5] text-xs text-[#69716D] ${className}`}>
        <Info className="w-4 h-4 text-[#087F73] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#202522] font-semibold">Informational Assessment:</strong> OpportunityKit assesses eligibility against published requirements to help identify gaps. It does not predict or guarantee selection or admission decisions. Official program guidelines remain authoritative.
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-xl bg-stone-50 border border-[#E5E9E5] text-xs text-[#69716D] space-y-2 ${className}`}>
      <div className="flex items-center gap-2 text-sm font-semibold text-[#202522]">
        <ShieldAlert className="w-4 h-4 text-[#087F73]" />
        <span>Authoritative Source & Accuracy Policy</span>
      </div>
      <p className="leading-relaxed">
        Opportunity criteria are synthesized from public notices, university announcements, and sponsor portals. Because program rules, deadlines, and funding quotas may change without notice, always verify instructions directly on the sponsor’s official portal before submitting your application.
      </p>
    </div>
  );
};
