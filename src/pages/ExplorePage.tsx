import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  Sparkles, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Check, 
  ArrowUpDown,
  Compass,
  AlertCircle
} from 'lucide-react';
import { Opportunity, OpportunityCategory, OpportunityType, WorkMode } from '../types';
import { OpportunityCard } from '../components/OpportunityCard';
import { Badge } from '../components/Badge';

interface ExplorePageProps {
  opportunities: Opportunity[];
  savedOppIds: Set<string>;
  onToggleSave: (opp: Opportunity) => void;
  onViewDetails: (opp: Opportunity) => void;
  onCheckEligibility: (opp: Opportunity) => void;
  initialQuery?: string;
  initialCategory?: string;
}

export const ExplorePage: React.FC<ExplorePageProps> = ({
  opportunities,
  savedOppIds,
  onToggleSave,
  onViewDetails,
  onCheckEligibility,
  initialQuery = '',
  initialCategory = 'all'
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'recent' | 'title'>('deadline');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'internship', label: 'Internships' },
    { id: 'scholarship', label: 'Scholarships' },
    { id: 'research', label: 'Research' },
    { id: 'competition', label: 'Competitions' },
    { id: 'fellowship', label: 'Fellowships' },
    { id: 'hackathon', label: 'Hackathons' }
  ];

  const workModes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Locations' },
    { id: 'remote', label: 'Remote / Virtual' },
    { id: 'hybrid', label: 'Hybrid' },
    { id: 'on_site', label: 'On-site / In-Person' }
  ];

  const fundingTypes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Support Types' },
    { id: 'stipend', label: 'Stipend' },
    { id: 'fully_funded', label: 'Fully Funded' },
    { id: 'tuition_grant', label: 'Tuition Grant' },
    { id: 'award', label: 'Prize / Award' },
    { id: 'unpaid_learning', label: 'Educational / Certificate' }
  ];

  // Filtering and Sorting logic
  const filteredOpportunities = useMemo(() => {
    let list = [...opportunities];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(opp =>
        opp.title.toLowerCase().includes(q) ||
        opp.organization.toLowerCase().includes(q) ||
        opp.shortDescription.toLowerCase().includes(q) ||
        opp.location.toLowerCase().includes(q) ||
        opp.criteria.some(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory !== 'all') {
      list = list.filter(opp => opp.category === selectedCategory);
    }

    // Type
    if (selectedType !== 'all') {
      list = list.filter(opp => opp.type === selectedType);
    }

    // Work Mode
    if (selectedWorkMode !== 'all') {
      list = list.filter(opp => opp.workMode === selectedWorkMode);
    }

    // Verified only
    if (onlyVerified) {
      list = list.filter(opp => opp.isVerifiedSeed);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'deadline') {
        const da = a.deadline ? new Date(a.deadline).getTime() : 9999999999999;
        const db = b.deadline ? new Date(b.deadline).getTime() : 9999999999999;
        return da - db;
      }
      if (sortBy === 'recent') {
        return (b.lastVerified || '').localeCompare(a.lastVerified || '');
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return list;
  }, [opportunities, searchQuery, selectedCategory, selectedType, selectedWorkMode, sortBy, onlyVerified]);

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'all' || 
    selectedType !== 'all' || 
    selectedWorkMode !== 'all' || 
    onlyVerified;

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSelectedWorkMode('all');
    setOnlyVerified(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-[#E5E9E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#087F73]" />
            <span className="text-xs font-semibold text-[#087F73] uppercase tracking-wider">
              Opportunity Directory
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
            Explore Student Opportunities
          </h1>
          <p className="text-xs text-[#69716D] mt-1 max-w-xl">
            Search internships, fellowships, scholarships, and hackathons with verified criteria and authentic deadlines.
          </p>
        </div>

        {/* Global Search Bar */}
        <div className="w-full md:w-80">
          <div className="relative">
            <Search className="w-4 h-4 text-[#69716D] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, org, or skill..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E9E5] bg-white text-xs text-[#202522] focus:outline-none focus:border-[#087F73] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#69716D] hover:text-[#202522]"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === cat.id
                ? 'bg-[#087F73] text-white border-[#087F73] font-semibold'
                : 'bg-white text-[#69716D] border-[#E5E9E5] hover:text-[#202522] hover:bg-stone-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Filter & Sort Controls Row */}
      <div className="p-4 rounded-xl bg-white border border-[#E5E9E5] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Work Mode dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#69716D] font-medium">Work Mode:</span>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] bg-white text-[#202522] focus:outline-none focus:border-[#087F73] cursor-pointer"
            >
              {workModes.map(m => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Funding / Award Type */}
          <div className="flex items-center gap-1.5">
            <span className="text-[#69716D] font-medium">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] bg-white text-[#202522] focus:outline-none focus:border-[#087F73] cursor-pointer"
            >
              {fundingTypes.map(t => (
                <option key={t.id} value={t.id}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Verified toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer text-[#202522] select-none">
            <input
              type="checkbox"
              checked={onlyVerified}
              onChange={(e) => setOnlyVerified(e.target.checked)}
              className="rounded accent-[#087F73]"
            />
            <span className="font-medium">Verified Seed Only</span>
          </label>
        </div>

        {/* Sort & Reset */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#69716D]" />
            <span className="text-[#69716D] font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] bg-white text-[#202522] focus:outline-none focus:border-[#087F73] cursor-pointer"
            >
              <option value="deadline">Deadline (Soonest first)</option>
              <option value="recent">Recently Verified</option>
              <option value="title">Program Name (A-Z)</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="text-[#69716D] hover:text-[#087F73] flex items-center gap-1 font-medium cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count & Status Header */}
      <div className="flex items-center justify-between text-xs text-[#69716D]">
        <span>Showing <strong>{filteredOpportunities.length}</strong> of {opportunities.length} opportunities</span>
        {onlyVerified && (
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Filtering verified catalog records
          </span>
        )}
      </div>

      {/* Opportunities Grid */}
      {filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
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
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E5E9E5] space-y-3">
          <div className="w-12 h-12 rounded-xl bg-stone-50 border border-[#E5E9E5] text-[#69716D] flex items-center justify-center mx-auto">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-[#202522]">No opportunities found</h3>
          <p className="text-xs text-[#69716D] max-w-sm mx-auto">
            We couldn’t find matches with your active filters. Try searching with different keywords or reset your filters.
          </p>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 rounded-lg bg-[#087F73] text-white text-xs font-semibold cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
