import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Check, 
  Save, 
  RotateCcw, 
  Download, 
  Trash2, 
  Plus, 
  AlertCircle,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { StudentProfile } from '../types';
import { api } from '../api/client';

interface ProfilePageProps {
  profile: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
  onResetToDemo: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  onProfileUpdated,
  onResetToDemo
}) => {
  const [formData, setFormData] = useState<StudentProfile>({ ...profile });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // New project entry state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [isAddingProject, setIsAddingProject] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await api.updateProfile(formData);
      if (res.success) {
        onProfileUpdated(res.profile);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update academic profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProject = {
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim(),
      tech: newProjectTech.split(',').map(t => t.trim()).filter(Boolean)
    };

    setFormData({
      ...formData,
      projects: [...(formData.projects || []), newProject]
    });

    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectTech('');
    setIsAddingProject(false);
  };

  const handleDeleteProject = (index: number) => {
    const updated = (formData.projects || []).filter((_, i) => i !== index);
    setFormData({ ...formData, projects: updated });
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(formData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opportunitykit-profile-${formData.fullName || 'student'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#202522]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E9E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-[#087F73]" />
            <span className="text-xs font-semibold text-[#087F73] uppercase tracking-wider">
              Student Record
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
            Academic Profile & Settings
          </h1>
          <p className="text-xs text-[#69716D] mt-1 max-w-xl">
            Maintain your educational qualifications, skills, and projects to automatically benchmark eligibility criteria.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportData}
            className="px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white hover:bg-stone-50 text-xs font-medium text-[#202522] flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-[#087F73]" />
            <span>Export Data (JSON)</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#202522] uppercase tracking-wider pb-2 border-b border-[#E5E9E5]">
            1. Identity & Student Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#202522] mb-1">Full Legal Name</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Country of Primary Residence</label>
              <input
                type="text"
                value={formData.countryOfResidence}
                onChange={(e) => setFormData({ ...formData, countryOfResidence: e.target.value })}
                placeholder="e.g. United States"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Citizenship / Nationality</label>
              <input
                type="text"
                value={formData.citizenship}
                onChange={(e) => setFormData({ ...formData, citizenship: e.target.value })}
                placeholder="e.g. United States"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>
          </div>
        </div>

        {/* Academic Qualifications */}
        <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#202522] uppercase tracking-wider pb-2 border-b border-[#E5E9E5]">
            2. Academic Standing & Institution
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#202522] mb-1">Education Stage</label>
              <select
                value={formData.educationLevel}
                onChange={(e) => setFormData({ ...formData, educationLevel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              >
                <option value="undergraduate">Undergraduate (Bachelors / Associate)</option>
                <option value="masters">Masters / Post-Graduate</option>
                <option value="phd">PhD / Doctoral</option>
                <option value="high_school">High School</option>
                <option value="recent_grad">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Major or Field of Study</label>
              <input
                type="text"
                value={formData.degreeMajor}
                onChange={(e) => setFormData({ ...formData, degreeMajor: e.target.value })}
                placeholder="e.g. Computer Science & Engineering"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">College / University Name</label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="e.g. State University of Technology"
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Current Academic Year</label>
              <select
                value={formData.currentYear}
                onChange={(e) => setFormData({ ...formData, currentYear: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year (Final Year)">4th Year (Senior / Final Year)</option>
                <option value="Graduate Student">Graduate Student</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Expected Graduation Year</label>
              <input
                type="number"
                value={formData.graduationYear || 2027}
                onChange={(e) => setFormData({ ...formData, graduationYear: parseInt(e.target.value, 10) || 2027 })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Cumulative CGPA / GPA</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  value={formData.cgpa ?? ''}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value ? parseFloat(e.target.value) : null })}
                  placeholder="3.65"
                  className="flex-1 px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
                />
                <select
                  value={formData.cgpaScale}
                  onChange={(e) => setFormData({ ...formData, cgpaScale: parseFloat(e.target.value) })}
                  className="w-24 px-2 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none"
                >
                  <option value={4.0}>/ 4.0</option>
                  <option value={10.0}>/ 10.0</option>
                  <option value={100}>/ 100%</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-[#202522] select-none">
                <input
                  type="checkbox"
                  checked={formData.enrolledStatus}
                  onChange={(e) => setFormData({ ...formData, enrolledStatus: e.target.checked })}
                  className="rounded accent-[#087F73]"
                />
                <span>Actively matriculated in an accredited post-secondary educational institution</span>
              </label>
            </div>
          </div>
        </div>

        {/* Skills & Experience */}
        <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#202522] uppercase tracking-wider pb-2 border-b border-[#E5E9E5]">
            3. Skills, Summary & Projects
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#202522] mb-1">
                Technical Skills (Comma separated)
              </label>
              <input
                type="text"
                value={(formData.skills || []).join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                placeholder="Python, React, TypeScript, Git, C++, Linux, Algorithms..."
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">
                Background & Experience Summary
              </label>
              <textarea
                value={formData.experienceSummary || ''}
                onChange={(e) => setFormData({ ...formData, experienceSummary: e.target.value })}
                rows={3}
                placeholder="Brief summary of your academic interests, relevant courses, or extracurricular leadership..."
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            {/* Projects list */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-semibold text-[#202522]">Key Projects ({formData.projects?.length || 0})</label>
                {!isAddingProject && (
                  <button
                    type="button"
                    onClick={() => setIsAddingProject(true)}
                    className="text-[#087F73] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                )}
              </div>

              {isAddingProject && (
                <div className="p-3.5 rounded-xl border border-[#087F73]/40 bg-[#FAFAF7] space-y-2 mb-3">
                  <input
                    type="text"
                    value={newProjectTitle}
                    onChange={(e) => setNewProjectTitle(e.target.value)}
                    placeholder="Project Title (e.g. Distributed Key-Value Store)"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white text-xs text-[#202522] focus:outline-none"
                  />
                  <textarea
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    placeholder="Short description of what you built and your role..."
                    rows={2}
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white text-xs text-[#202522] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newProjectTech}
                    onChange={(e) => setNewProjectTech(e.target.value)}
                    placeholder="Technologies used (e.g. Go, Raft, Docker)"
                    className="w-full px-3 py-1.5 rounded-lg border border-[#E5E9E5] bg-white text-xs text-[#202522] focus:outline-none"
                  />
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      className="px-3 py-1 rounded-lg border border-[#E5E9E5] text-[#69716D] text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="px-3 py-1 rounded-lg bg-[#087F73] text-white text-xs font-semibold cursor-pointer"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {(formData.projects || []).map((proj, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-[#E5E9E5] bg-[#FAFAF7] flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-semibold text-[#202522]">{proj.title}</h4>
                      <p className="text-[#69716D] text-[11px] leading-relaxed">{proj.description}</p>
                      {proj.tech && proj.tech.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {proj.tech.map((t, i) => (
                            <span key={i} className="text-[10px] bg-white border border-[#E5E9E5] px-1.5 py-0.2 rounded text-[#202522]">
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(idx)}
                      className="text-stone-400 hover:text-red-600 p-1"
                      title="Remove project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Privacy & Account Settings */}
        <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-[#202522] uppercase tracking-wider pb-2 border-b border-[#E5E9E5]">
            4. Privacy & Data Controls
          </h2>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <p className="font-semibold text-[#202522]">Reset Demo Environment</p>
              <p className="text-[#69716D] mt-0.5">
                Switch back to the preloaded Alex Chen demo profile and seed data.
              </p>
            </div>
            <button
              type="button"
              onClick={onResetToDemo}
              className="px-3 py-1.5 rounded-lg border border-[#E5E9E5] hover:bg-stone-50 text-[#202522] font-medium self-start sm:self-auto cursor-pointer"
            >
              Reset to Demo Profile
            </button>
          </div>
        </div>

        {/* Feedback message */}
        {saveError && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{saveError}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
              <Check className="w-4 h-4 stroke-[3]" />
              Profile updated successfully!
            </span>
          ) : (
            <span className="text-xs text-[#69716D]">
              Changes persist across all eligibility assessments.
            </span>
          )}

          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
