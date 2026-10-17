import React from 'react';
import { CriterionAssessmentStatus, OpportunityCategory, WorkMode, DeadlineStatus } from '../types';

interface BadgeProps {
  children?: React.ReactNode;
  variant?: 'match' | 'needs_verification' | 'missing_information' | 'neutral' | 'teal' | 'category' | 'deadline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = ''
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  let colorClasses = 'bg-stone-100 text-stone-700 border border-stone-200';

  switch (variant) {
    case 'match':
      colorClasses = 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium';
      break;
    case 'needs_verification':
      colorClasses = 'bg-amber-50 text-amber-800 border border-amber-200 font-medium';
      break;
    case 'missing_information':
      colorClasses = 'bg-sky-50 text-sky-800 border border-sky-200 font-medium';
      break;
    case 'teal':
      colorClasses = 'bg-[#EEF8F6] text-[#087F73] border border-[#CBE6E2] font-medium';
      break;
    case 'category':
      colorClasses = 'bg-stone-50 text-stone-800 border border-stone-200 font-medium capitalize';
      break;
    case 'deadline':
      colorClasses = 'bg-stone-100 text-stone-700 border border-stone-200';
      break;
    case 'neutral':
    default:
      colorClasses = 'bg-stone-100 text-stone-700 border border-stone-200';
      break;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-sans leading-none ${sizeClasses} ${colorClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge: React.FC<{ status: CriterionAssessmentStatus }> = ({ status }) => {
  if (status === 'match') {
    return (
      <Badge variant="match">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block" />
        Match
      </Badge>
    );
  }
  if (status === 'needs_verification') {
    return (
      <Badge variant="needs_verification">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 inline-block" />
        Needs Verification
      </Badge>
    );
  }
  return (
    <Badge variant="missing_information">
      <span className="w-1.5 h-1.5 rounded-full bg-sky-600 inline-block" />
      Missing Information
    </Badge>
  );
};
