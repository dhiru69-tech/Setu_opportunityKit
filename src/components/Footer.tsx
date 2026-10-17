import React from 'react';
import { CheckSquare, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-[#E5E9E5] text-[#202522] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-[#087F73] text-white flex items-center justify-center">
                <CheckSquare className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-semibold text-base tracking-tight text-[#202522]">
                OpportunityKit
              </span>
            </div>
            <p className="text-xs text-[#69716D] leading-relaxed mb-4">
              Find opportunities. Understand your next step. Empowering students to discover programs, verify criteria, and submit confident applications.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#69716D]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#087F73]" />
              <span>Free student platform</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202522] mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#69716D]">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Explore Opportunities
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('checker')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Eligibility Checker
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('resume')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Resume Parser
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Application Tracker
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202522] mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#69716D]">
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Software Internships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Diversity & Merit Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Undergraduate Research Grants
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('explore')}
                  className="hover:text-[#087F73] transition-colors"
                >
                  Global Hackathons & Challenges
                </button>
              </li>
            </ul>
          </div>

          {/* Trust and Policy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#202522] mb-3">
              Trust & Source Attribution
            </h4>
            <p className="text-xs text-[#69716D] leading-relaxed mb-3">
              OpportunityKit provides informational eligibility assessments based on publicly accessible sponsor requirements. We never guarantee selection or admission.
            </p>
            <div className="p-2.5 rounded bg-stone-50 border border-[#E5E9E5] text-[11px] text-[#69716D]">
              Always check the official host links for latest deadlines and amendments.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#E5E9E5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#69716D] gap-3">
          <p>© 2026 OpportunityKit. Designed for student opportunity discovery.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-[#202522] cursor-pointer">Privacy Notice</span>
            <span>•</span>
            <span className="hover:text-[#202522] cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-[#202522] cursor-pointer">Source Attribution</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
