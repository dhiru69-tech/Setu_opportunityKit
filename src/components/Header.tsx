import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  ShieldCheck, 
  LayoutDashboard, 
  Bookmark, 
  User, 
  Menu, 
  X, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate, savedCount }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<'demo' | 'custom'>('demo');

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Opportunities' },
    { id: 'checker', label: 'Eligibility Checker' },
    { id: 'dashboard', label: 'My Dashboard' },
    { id: 'saved', label: 'Saved Opportunities', count: savedCount },
    { id: 'profile', label: 'Profile' }
  ];

  const handleNavClick = (routeId: string) => {
    onNavigate(routeId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#E5E9E5] text-[#202522]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
            aria-label="OpportunityKit Home"
          >
            <div className="w-8 h-8 rounded-lg bg-[#087F73] text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <CheckSquare className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-lg tracking-tight text-[#202522] group-hover:text-[#087F73] transition-colors">
                OpportunityKit
              </span>
              <span className="hidden sm:inline-block text-[11px] text-[#69716D] ml-2 font-normal">
                Student Discovery & Eligibility
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative cursor-pointer ${
                    isActive
                      ? 'text-[#087F73] bg-[#EEF8F6] font-semibold'
                      : 'text-[#69716D] hover:text-[#202522] hover:bg-stone-50'
                  }`}
                >
                  {link.label}
                  {link.count !== undefined && link.count > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-[#087F73] text-white">
                      {link.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Account Menu & CTA */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={() => handleNavClick('checker')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#087F73] hover:bg-[#066258] text-white transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              Check Eligibility
            </button>

            {/* Account Switcher / Profile */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] bg-white hover:bg-stone-50 text-xs text-[#202522] font-medium transition-colors cursor-pointer"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-5 h-5 rounded-full bg-[#EEF8F6] text-[#087F73] flex items-center justify-center text-[10px] font-bold border border-[#CBE6E2]">
                  {activeUser === 'demo' ? 'AC' : 'ST'}
                </div>
                <span className="max-w-[100px] truncate">
                  {activeUser === 'demo' ? 'Alex Chen' : 'Guest Student'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#69716D]" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-[#E5E9E5] shadow-lg py-1.5 text-xs z-50">
                  <div className="px-3 py-2 border-b border-[#E5E9E5]">
                    <p className="font-semibold text-[#202522]">
                      {activeUser === 'demo' ? 'Alex Chen' : 'Guest Student'}
                    </p>
                    <p className="text-[11px] text-[#69716D] truncate">
                      {activeUser === 'demo' ? 'alex.chen@student.university.edu' : 'Active Session'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      handleNavClick('profile');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-50 text-[#202522] flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#69716D]" />
                    Academic Profile & Settings
                  </button>
                  <button
                    onClick={() => {
                      handleNavClick('dashboard');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-stone-50 text-[#202522] flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-[#69716D]" />
                    Student Dashboard
                  </button>
                  <div className="border-t border-[#E5E9E5] my-1" />
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#69716D] uppercase tracking-wider">
                    Switch Mode
                  </div>
                  <button
                    onClick={() => {
                      setActiveUser('demo');
                      setUserDropdownOpen(false);
                      onNavigate('dashboard');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${
                      activeUser === 'demo' ? 'text-[#087F73] font-semibold bg-[#EEF8F6]' : 'text-[#69716D] hover:bg-stone-50'
                    }`}
                  >
                    Demo Profile (Alex Chen)
                  </button>
                  <button
                    onClick={() => {
                      setActiveUser('custom');
                      setUserDropdownOpen(false);
                      onNavigate('profile');
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs ${
                      activeUser === 'custom' ? 'text-[#087F73] font-semibold bg-[#EEF8F6]' : 'text-[#69716D] hover:bg-stone-50'
                    }`}
                  >
                    New Student Profile
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#69716D] hover:text-[#202522] hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-[#E5E9E5] bg-white px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium flex items-center justify-between ${
                  isActive
                    ? 'text-[#087F73] bg-[#EEF8F6] font-semibold'
                    : 'text-[#69716D] hover:text-[#202522] hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                {link.count !== undefined && link.count > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-[#087F73] text-white">
                    {link.count}
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-2 border-t border-[#E5E9E5] flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('checker')}
              className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-[#087F73] text-white"
            >
              Check My Eligibility
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
