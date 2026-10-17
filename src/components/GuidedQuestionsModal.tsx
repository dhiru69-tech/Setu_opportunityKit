import React, { useState } from 'react';
import { X, HelpCircle, CheckCircle2, ArrowRight, ArrowLeft, RefreshCw } from 'lucide-react';
import { FollowUpQuestion, EligibilityReport } from '../types';

interface GuidedQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: EligibilityReport | null;
  onSubmitAnswers: (answers: Record<string, any>) => Promise<void>;
}

export const GuidedQuestionsModal: React.FC<GuidedQuestionsModalProps> = ({
  isOpen,
  onClose,
  report,
  onSubmitAnswers
}) => {
  if (!isOpen || !report) return null;

  const questions = report.followUpQuestions || [];
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQ = questions[currentIndex];
  const hasQuestions = questions.length > 0;

  const handleInputChange = (val: any) => {
    if (!currentQ) return;
    // Map question ID to standard key
    let key = currentQ.id.replace('fq-', '');
    if (key.includes('cgpa')) key = 'cgpa';
    else if (key.includes('education_level') || key.includes('c1') || key.includes('study')) key = 'educationLevel';
    else if (key.includes('major') || key.includes('field')) key = 'degreeMajor';
    else if (key.includes('grad')) key = 'graduationYear';
    else if (key.includes('enroll')) key = 'enrolledStatus';
    else if (key.includes('skill')) key = 'skills';
    else if (key.includes('citizen') || key.includes('residen')) key = 'countryOfResidence';

    setAnswers(prev => ({ ...prev, [key]: val }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmitAnswers(answers);
      onClose();
    } catch (err) {
      console.error('Error submitting guided answers:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="relative bg-white rounded-2xl max-w-lg w-full border border-[#E5E9E5] shadow-xl text-[#202522] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guided-q-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E5E9E5] flex items-center justify-between bg-[#FAFAF7]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#EEF8F6] text-[#087F73] flex items-center justify-center border border-[#CBE6E2]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 id="guided-q-title" className="text-sm font-bold text-[#202522]">
                Resolve Missing Information
              </h2>
              <p className="text-[11px] text-[#69716D]">
                For {report.opportunityTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#69716D] hover:text-[#202522] hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!hasQuestions ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-semibold text-base text-[#202522]">No Missing Information</h3>
              <p className="text-xs text-[#69716D] max-w-sm mx-auto leading-relaxed">
                All profile parameters evaluated for this opportunity have been provided. Check any remaining criteria in "Needs Verification" against the host portal guidelines.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 rounded-lg text-xs font-semibold bg-[#087F73] text-white"
              >
                Return to Report
              </button>
            </div>
          ) : (
            <div>
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center text-xs text-[#69716D] mb-1 font-medium">
                  <span>Question {currentIndex + 1} of {questions.length}</span>
                  <span>{Math.round(((currentIndex + 1) / questions.length) * 100)}% Completed</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[#087F73] transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Current Question Body */}
              <div className="space-y-4 min-h-[160px]">
                <div>
                  <h3 className="text-sm font-semibold text-[#202522] leading-snug">
                    {currentQ.question}
                  </h3>
                  {currentQ.helperText && (
                    <p className="text-xs text-[#69716D] mt-1">{currentQ.helperText}</p>
                  )}
                </div>

                {/* Input Fields based on type */}
                {currentQ.fieldType === 'number' && (
                  <div>
                    <input
                      type="number"
                      step="any"
                      placeholder="e.g. 3.75"
                      defaultValue={currentQ.currentValue ?? ''}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E9E5] focus:outline-none focus:border-[#087F73] text-sm text-[#202522]"
                    />
                  </div>
                )}

                {currentQ.fieldType === 'text' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Type your response..."
                      defaultValue={currentQ.currentValue ?? ''}
                      onChange={(e) => handleInputChange(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-[#E5E9E5] focus:outline-none focus:border-[#087F73] text-sm text-[#202522]"
                    />
                  </div>
                )}

                {currentQ.fieldType === 'select' && currentQ.options && (
                  <div className="space-y-1.5">
                    {currentQ.options.map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-[#E5E9E5] hover:bg-stone-50 cursor-pointer text-xs font-medium text-[#202522]"
                      >
                        <input
                          type="radio"
                          name={`q-${currentQ.id}`}
                          value={opt}
                          onChange={(e) => handleInputChange(e.target.value)}
                          className="accent-[#087F73]"
                        />
                        <span className="capitalize">{opt.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQ.fieldType === 'boolean' && (
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleInputChange(true)}
                      className="flex-1 py-2.5 rounded-lg border border-[#E5E9E5] hover:border-[#087F73] hover:bg-[#EEF8F6] text-xs font-semibold transition-colors"
                    >
                      Yes, confirmed
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange(false)}
                      className="flex-1 py-2.5 rounded-lg border border-[#E5E9E5] hover:border-stone-400 hover:bg-stone-50 text-xs font-semibold transition-colors"
                    >
                      No / Not yet
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation Controls */}
              <div className="mt-6 pt-4 border-t border-[#E5E9E5] flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(c => c - 1)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 ${
                    currentIndex === 0
                      ? 'text-stone-300 cursor-not-allowed'
                      : 'text-[#69716D] hover:text-[#202522] hover:bg-stone-100'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Previous
                </button>

                {currentIndex < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentIndex(c => c + 1)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#087F73] hover:bg-[#066258] text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#087F73] hover:bg-[#066258] text-white flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Re-evaluating...
                      </>
                    ) : (
                      <>
                        <span>Submit & Update Report</span>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
