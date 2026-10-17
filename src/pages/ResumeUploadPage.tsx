import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  X, 
  Edit3, 
  Check, 
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { StudentProfile } from '../types';
import { api } from '../api/client';

interface ResumeUploadPageProps {
  currentProfile: StudentProfile;
  onProfileUpdated: (updated: StudentProfile) => void;
  onProceedToChecker: () => void;
}

export const ResumeUploadPage: React.FC<ResumeUploadPageProps> = ({
  currentProfile,
  onProfileUpdated,
  onProceedToChecker
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<Partial<StudentProfile> | null>(null);
  const [extractionSource, setExtractionSource] = useState<string>('');
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    // Validate size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds the 5MB limit. Please upload a smaller document.');
      return;
    }

    // Validate type
    const validExtensions = ['.pdf', '.docx', '.txt', '.md'];
    const hasValidExt = validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
    if (!hasValidExt) {
      setUploadError('Unsupported file type. Please upload a PDF, DOCX, or TXT file.');
      return;
    }

    setFile(selectedFile);
    setUploadError(null);
    setExtractedData(null);
    setIsSavedSuccess(false);

    // Auto trigger parsing
    parseFile(selectedFile);
  };

  const parseFile = async (uploadFile: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await api.parseResume(uploadFile);
      if (res.success && res.extractedProfile) {
        setExtractedData(res.extractedProfile);
        setExtractionSource(res.source || 'parsed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to extract text from document. You can still fill your profile manually.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveToProfile = async () => {
    if (!extractedData) return;

    try {
      const merged: StudentProfile = {
        ...currentProfile,
        ...extractedData,
        resumeFileName: file?.name,
        updatedAt: new Date().toISOString()
      };

      const res = await api.updateProfile(merged);
      if (res.success) {
        onProfileUpdated(res.profile);
        setIsSavedSuccess(true);
      }
    } catch (err: any) {
      setUploadError(err.message || 'Failed to save extracted profile.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#202522]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="w-4 h-4 text-[#087F73]" />
          <span className="text-xs font-semibold text-[#087F73] uppercase tracking-wider">
            Document Extraction
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
          Resume Upload & Parsing
        </h1>
        <p className="text-xs text-[#69716D] mt-1 max-w-2xl leading-relaxed">
          Upload your resume to extract GPA, degree stage, major, graduation year, and technical skills into your academic profile. You can review and edit every field before applying.
        </p>
      </div>

      {/* Upload Box */}
      <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 sm:p-8 shadow-xs">
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            isDragging
              ? 'border-[#087F73] bg-[#EEF8F6]'
              : 'border-[#E5E9E5] bg-[#FAFAF7] hover:border-stone-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.txt,.md"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileSelect(e.target.files[0]);
              }
            }}
          />

          <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E9E5] text-[#087F73] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Upload className="w-6 h-6" />
          </div>

          <h3 className="font-semibold text-sm text-[#202522] mb-1">
            Drag and drop your resume here
          </h3>
          <p className="text-xs text-[#69716D] mb-4">
            Supports PDF, DOCX, and TXT (Maximum file size: 5MB)
          </p>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-lg bg-white border border-[#E5E9E5] hover:bg-stone-50 text-xs font-semibold text-[#202522] transition-colors cursor-pointer shadow-xs"
          >
            Browse Files
          </button>
        </div>

        {/* Selected file status */}
        {file && (
          <div className="mt-4 p-3 rounded-xl bg-stone-50 border border-[#E5E9E5] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#087F73]" />
              <div>
                <p className="text-xs font-semibold text-[#202522] truncate max-w-xs sm:max-w-md">
                  {file.name}
                </p>
                <p className="text-[11px] text-[#69716D]">
                  {(file.size / 1024).toFixed(1)} KB • {file.type || 'Document'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isUploading ? (
                <span className="flex items-center gap-1.5 text-xs text-[#087F73] font-medium">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Extracting...
                </span>
              ) : (
                <button
                  onClick={() => {
                    setFile(null);
                    setExtractedData(null);
                  }}
                  className="text-[#69716D] hover:text-red-600 p-1"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Error message */}
        {uploadError && (
          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div>
              <p className="font-semibold">Document Processing Issue</p>
              <p>{uploadError}</p>
            </div>
          </div>
        )}
      </div>

      {/* Extracted Profile Preview & Verification */}
      {extractedData && (
        <div className="bg-white rounded-2xl border border-[#E5E9E5] p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#E5E9E5]">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Ready for Review
                </span>
                <span className="text-xs text-[#69716D]">
                  Extracted via {extractionSource === 'gemini_multimodal' ? 'AI Document Engine' : 'Document Parser'}
                </span>
              </div>
              <h2 className="text-base font-bold text-[#202522]">
                Extracted Academic Profile Preview
              </h2>
            </div>

            <span className="text-xs text-[#69716D]">
              Edit any fields before saving
            </span>
          </div>

          {/* Editable fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#202522] mb-1">Full Name</label>
              <input
                type="text"
                value={extractedData.fullName || ''}
                onChange={(e) => setExtractedData({ ...extractedData, fullName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Degree Stage</label>
              <select
                value={extractedData.educationLevel || 'undergraduate'}
                onChange={(e) => setExtractedData({ ...extractedData, educationLevel: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              >
                <option value="undergraduate">Undergraduate</option>
                <option value="masters">Masters</option>
                <option value="phd">PhD</option>
                <option value="high_school">High School</option>
                <option value="recent_grad">Recent Graduate</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Major / Degree</label>
              <input
                type="text"
                value={extractedData.degreeMajor || ''}
                onChange={(e) => setExtractedData({ ...extractedData, degreeMajor: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Institution / College</label>
              <input
                type="text"
                value={extractedData.institution || ''}
                onChange={(e) => setExtractedData({ ...extractedData, institution: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Cumulative CGPA / GPA</label>
              <input
                type="number"
                step="0.01"
                value={extractedData.cgpa ?? ''}
                onChange={(e) => setExtractedData({ ...extractedData, cgpa: e.target.value ? parseFloat(e.target.value) : null })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#202522] mb-1">Graduation Year</label>
              <input
                type="number"
                value={extractedData.graduationYear || 2027}
                onChange={(e) => setExtractedData({ ...extractedData, graduationYear: parseInt(e.target.value, 10) || 2027 })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#202522] mb-1">Extracted Technical Skills</label>
              <input
                type="text"
                value={(extractedData.skills || []).join(', ')}
                onChange={(e) => setExtractedData({
                  ...extractedData,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
                className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-[#202522] focus:outline-none focus:border-[#087F73]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-[#E5E9E5] flex flex-wrap items-center justify-between gap-3">
            {isSavedSuccess ? (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <Check className="w-4 h-4 stroke-[3]" />
                Profile successfully updated from resume!
              </span>
            ) : (
              <span className="text-xs text-[#69716D]">
                Confirm changes to update your permanent profile.
              </span>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveToProfile}
                className="px-4 py-2 rounded-lg bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                Save to Profile
              </button>
              <button
                type="button"
                onClick={onProceedToChecker}
                className="px-4 py-2 rounded-lg bg-white border border-[#E5E9E5] hover:bg-stone-50 text-xs font-semibold text-[#202522] flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Proceed to Checker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
