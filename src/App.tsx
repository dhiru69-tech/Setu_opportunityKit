import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { EligibilityCheckerPage } from './pages/EligibilityCheckerPage';
import { ReportPage } from './pages/ReportPage';
import { ResumeUploadPage } from './pages/ResumeUploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { SavedOpportunitiesPage } from './pages/SavedOpportunitiesPage';
import { ProfilePage } from './pages/ProfilePage';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { Opportunity, StudentProfile, SavedApplication, EligibilityReport, NextStepTask } from './types';
import { api } from './api/client';
import { SEED_OPPORTUNITIES } from './data/seedOpportunities';

export function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [opportunities, setOpportunities] = useState<Opportunity[]>(SEED_OPPORTUNITIES);
  const [savedApplications, setSavedApplications] = useState<SavedApplication[]>([]);
  const [recentReports, setRecentReports] = useState<EligibilityReport[]>([]);
  const [currentReport, setCurrentReport] = useState<EligibilityReport | null>(null);
  const [reportOpp, setReportOpp] = useState<Opportunity | null>(null);

  // Active Opportunity for Detail Modal
  const [activeModalOpp, setActiveModalOpp] = useState<Opportunity | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Selected Opportunity for Eligibility Checker
  const [selectedCheckerOpp, setSelectedCheckerOpp] = useState<Opportunity | null>(null);

  // Search pre-fill from Landing Page
  const [exploreQuery, setExploreQuery] = useState('');
  const [exploreCategory, setExploreCategory] = useState('all');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Student Profile State
  const [profile, setProfile] = useState<StudentProfile>({
    id: 'student-demo-1',
    fullName: 'Alex Chen',
    email: 'alex.chen@student.university.edu',
    educationLevel: 'undergraduate',
    degreeMajor: 'Computer Science & Engineering',
    institution: 'State University of Technology',
    currentYear: '3rd Year',
    graduationYear: 2027,
    cgpa: 3.65,
    cgpaScale: 4.0,
    skills: ['Python', 'TypeScript', 'React', 'Git', 'Data Structures', 'C++', 'SQL'],
    experienceSummary: 'Undergraduate student interested in open-source systems, AI applications, and community tech initiatives. Completed coursework in Algorithms and Web Development.',
    projects: [
      {
        title: 'Campus Course Planner',
        description: 'Built a collaborative prerequisite visualizer and scheduler for students.',
        tech: ['React', 'TypeScript', 'Node.js']
      },
      {
        title: 'Autonomous Rover Sensor Telemetry',
        description: 'Configured embedded telemetry ingestion script and data logging dashboard.',
        tech: ['Python', 'C++', 'MQTT']
      }
    ],
    countryOfResidence: 'United States',
    citizenship: 'United States',
    preferredWorkMode: 'any',
    enrolledStatus: true,
    updatedAt: new Date().toISOString()
  });

  // Initial Load from API
  useEffect(() => {
    // 1. Fetch opportunities
    api.getOpportunities()
      .then(res => {
        if (res.success && res.opportunities?.length > 0) {
          setOpportunities(res.opportunities);
        }
      })
      .catch(err => console.warn('Using seed opportunities fallback:', err));

    // 2. Fetch saved applications
    api.getSavedApplications()
      .then(res => {
        if (res.success && res.savedApplications) {
          setSavedApplications(res.savedApplications);
        }
      })
      .catch(() => {});

    // 3. Fetch profile
    api.getProfile()
      .then(res => {
        if (res.success && res.profile) {
          setProfile(res.profile);
        }
      })
      .catch(() => {});

    // 4. Fetch reports
    api.getReports()
      .then(res => {
        if (res.success && res.reports) {
          setRecentReports(res.reports);
          if (res.reports.length > 0 && !currentReport) {
            setCurrentReport(res.reports[0]);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Set of saved opportunity IDs for instant lookup
  const savedOppIds = new Set(savedApplications.map(a => a.opportunityId));

  // Toggle save
  const handleToggleSave = async (opp: Opportunity) => {
    const isCurrentlySaved = savedOppIds.has(opp.id);
    if (isCurrentlySaved) {
      try {
        await api.removeSavedOpportunity(opp.id);
        setSavedApplications(prev => prev.filter(a => a.opportunityId !== opp.id));
        showToast(`Removed "${opp.title}" from saved opportunities.`);
      } catch (err) {
        console.error('Failed to remove saved opportunity:', err);
      }
    } else {
      try {
        const res = await api.saveOpportunity(opp.id, 'interested');
        if (res.success && res.savedApplication) {
          setSavedApplications(prev => [res.savedApplication, ...prev]);
          showToast(`Saved "${opp.title}" to your Application Tracker!`);
        }
      } catch (err) {
        console.error('Failed to save opportunity:', err);
      }
    }
  };

  // Details Modal handler
  const handleViewDetails = (opp: Opportunity) => {
    setActiveModalOpp(opp);
    setIsDetailModalOpen(true);
  };

  // Jump to Eligibility Checker with specific opportunity
  const handleCheckEligibility = (opp?: Opportunity) => {
    if (opp) {
      setSelectedCheckerOpp(opp);
    }
    setCurrentRoute('checker');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // When Eligibility Checker generates a report
  const handleReportGenerated = (report: EligibilityReport, opp: Opportunity) => {
    setCurrentReport(report);
    setReportOpp(opp);
    setRecentReports(prev => [report, ...prev]);
    setCurrentRoute('report');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('Eligibility assessment generated successfully!');
  };

  // Submit guided follow-up answers
  const handleSubmitFollowUp = async (answers: Record<string, any>) => {
    if (!currentReport) return;
    try {
      const res = await api.submitFollowUp({
        reportId: currentReport.id,
        opportunityId: reportOpp?.id || currentReport.opportunityId,
        answers
      });
      if (res.success && res.report) {
        setCurrentReport(res.report);
        setRecentReports(prev => [res.report, ...prev]);
        if (res.updatedProfile) {
          setProfile(prev => ({ ...prev, ...res.updatedProfile }));
        }
        showToast('Report updated with your answered criteria!');
      }
    } catch (err) {
      console.error('Error submitting follow-up:', err);
    }
  };

  // Update tasks in report plan
  const handleTasksChange = (updatedTasks: NextStepTask[]) => {
    if (currentReport) {
      setCurrentReport({
        ...currentReport,
        nextStepsPlan: updatedTasks
      });
    }
  };

  // Search from landing page
  const handleSearchFromLanding = (query: string, category?: string) => {
    setExploreQuery(query);
    if (category) setExploreCategory(category);
    setCurrentRoute('explore');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to Demo student profile
  const handleResetToDemo = () => {
    const demoProfile: StudentProfile = {
      id: 'student-demo-1',
      fullName: 'Alex Chen',
      email: 'alex.chen@student.university.edu',
      educationLevel: 'undergraduate',
      degreeMajor: 'Computer Science & Engineering',
      institution: 'State University of Technology',
      currentYear: '3rd Year',
      graduationYear: 2027,
      cgpa: 3.65,
      cgpaScale: 4.0,
      skills: ['Python', 'TypeScript', 'React', 'Git', 'Data Structures', 'C++', 'SQL'],
      experienceSummary: 'Undergraduate student interested in open-source systems, AI applications, and community tech initiatives.',
      projects: [
        {
          title: 'Campus Course Planner',
          description: 'Built a collaborative prerequisite visualizer and scheduler for students.',
          tech: ['React', 'TypeScript', 'Node.js']
        }
      ],
      countryOfResidence: 'United States',
      citizenship: 'United States',
      preferredWorkMode: 'any',
      enrolledStatus: true,
      updatedAt: new Date().toISOString()
    };
    setProfile(demoProfile);
    api.updateProfile(demoProfile).catch(() => {});
    showToast('Reset to Alex Chen demo profile.');
  };

  // Handle route switching & scroll to top
  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF7] text-[#202522]">
      {/* Global Header */}
      <Header
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        savedCount={savedApplications.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentRoute === 'home' && (
          <LandingPage
            opportunities={opportunities}
            savedOppIds={savedOppIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onCheckEligibility={handleCheckEligibility}
            onNavigate={handleNavigate}
            onSearchFromLanding={handleSearchFromLanding}
          />
        )}

        {currentRoute === 'explore' && (
          <ExplorePage
            opportunities={opportunities}
            savedOppIds={savedOppIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onCheckEligibility={handleCheckEligibility}
            initialQuery={exploreQuery}
            initialCategory={exploreCategory}
          />
        )}

        {currentRoute === 'checker' && (
          <EligibilityCheckerPage
            opportunities={opportunities}
            currentProfile={profile}
            initialOpportunity={selectedCheckerOpp}
            onReportGenerated={handleReportGenerated}
            onNavigateToResume={() => handleNavigate('resume')}
          />
        )}

        {currentRoute === 'report' && currentReport && (
          <ReportPage
            report={currentReport}
            opportunity={reportOpp || opportunities.find(o => o.id === currentReport.opportunityId) || null}
            isSaved={reportOpp ? savedOppIds.has(reportOpp.id) : false}
            onToggleSave={handleToggleSave}
            onBackToChecker={() => handleNavigate('checker')}
            onSubmitFollowUp={handleSubmitFollowUp}
            onTasksChange={handleTasksChange}
          />
        )}

        {currentRoute === 'resume' && (
          <ResumeUploadPage
            currentProfile={profile}
            onProfileUpdated={(updated) => {
              setProfile(updated);
              showToast('Profile successfully updated from resume.');
            }}
            onProceedToChecker={() => handleNavigate('checker')}
          />
        )}

        {currentRoute === 'dashboard' && (
          <DashboardPage
            profile={profile}
            savedApplications={savedApplications}
            recentReports={recentReports}
            onNavigate={handleNavigate}
            onViewReport={(rep) => {
              setCurrentReport(rep);
              const foundOpp = opportunities.find(o => o.id === rep.opportunityId) || null;
              setReportOpp(foundOpp);
              handleNavigate('report');
            }}
            onViewOpportunity={handleViewDetails}
          />
        )}

        {currentRoute === 'saved' && (
          <SavedOpportunitiesPage
            savedApplications={savedApplications}
            onRemoveApplication={async (id) => {
              await api.removeSavedOpportunity(id);
              setSavedApplications(prev => prev.filter(a => a.id !== id && a.opportunityId !== id));
              showToast('Removed opportunity from tracker.');
            }}
            onUpdateApplication={async (id, updates) => {
              await api.updateApplicationStatus(id, updates);
              setSavedApplications(prev => prev.map(a => (a.id === id ? { ...a, ...updates } : a)));
              showToast('Application record updated.');
            }}
            onCheckEligibility={handleCheckEligibility}
            onNavigateToExplore={() => handleNavigate('explore')}
          />
        )}

        {currentRoute === 'profile' && (
          <ProfilePage
            profile={profile}
            onProfileUpdated={(updated) => {
              setProfile(updated);
              showToast('Profile saved successfully.');
            }}
            onResetToDemo={handleResetToDemo}
          />
        )}
      </main>

      {/* Global Opportunity Detail Modal */}
      <OpportunityDetailModal
        opportunity={activeModalOpp}
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setActiveModalOpp(null);
        }}
        isSaved={activeModalOpp ? savedOppIds.has(activeModalOpp.id) : false}
        onToggleSave={handleToggleSave}
        onCheckEligibility={(opp) => {
          setIsDetailModalOpen(false);
          handleCheckEligibility(opp);
        }}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#202522] text-white text-xs font-medium px-4 py-3 rounded-xl shadow-lg border border-stone-700 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-[#087F73]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
