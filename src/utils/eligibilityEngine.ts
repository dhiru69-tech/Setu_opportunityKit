import { 
  CriterionAssessment, 
  CriterionItem, 
  EligibilityReport, 
  FollowUpQuestion, 
  NextStepTask, 
  Opportunity, 
  StudentProfile 
} from '../types';

export function evaluateEligibility(
  opportunity: Opportunity,
  profile: Partial<StudentProfile>
): EligibilityReport {
  const criteriaResults: CriterionAssessment[] = [];
  const followUpQuestions: FollowUpQuestion[] = [];
  const nextStepsPlan: NextStepTask[] = [];

  // Normalize scale helper
  const normalizeGpaTo4 = (cgpa: number | null | undefined, scale: number = 4.0): number | null => {
    if (cgpa === null || cgpa === undefined || isNaN(cgpa)) return null;
    if (scale <= 4.0) return cgpa;
    if (scale === 10.0) return (cgpa / 10.0) * 4.0;
    if (scale === 100) return (cgpa / 100.0) * 4.0;
    return cgpa;
  };

  const studentGpaNormalized = normalizeGpaTo4(profile.cgpa, profile.cgpaScale);

  for (const criterion of opportunity.criteria) {
    let status: 'match' | 'needs_verification' | 'missing_information' = 'needs_verification';
    let actual = 'Not provided';
    let reasoning = '';
    let recommendedAction = '';

    switch (criterion.category) {
      case 'minimum_cgpa': {
        if (profile.cgpa === null || profile.cgpa === undefined || profile.cgpa === 0) {
          status = 'missing_information';
          actual = 'CGPA / GPA not provided in profile';
          reasoning = 'The opportunity requires a minimum academic standing, but your profile does not currently include a CGPA.';
          recommendedAction = 'Enter your current CGPA or percentage in the profile or follow-up prompt.';
          
          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: `What is your current cumulative GPA or CGPA?`,
            fieldType: 'number',
            helperText: `Required threshold: ${criterion.targetValue} on a 4.0 scale (or equivalent).`,
            currentValue: profile.cgpa ?? ''
          });
        } else {
          const targetGpa = Number(criterion.targetValue);
          actual = `${profile.cgpa} (Scale: ${profile.cgpaScale || 4.0}, approx ${studentGpaNormalized?.toFixed(2)}/4.0)`;
          if (studentGpaNormalized !== null && studentGpaNormalized >= targetGpa) {
            status = 'match';
            reasoning = `Your cumulative GPA (${actual}) meets or exceeds the required minimum of ${targetGpa} on a 4.0 scale.`;
            recommendedAction = 'Ensure your official university transcript reflects this cumulative score.';
          } else {
            status = 'needs_verification';
            reasoning = `Your entered GPA (${actual}) is slightly below or close to the target of ${targetGpa}/4.0. Some selection committees evaluate major-specific GPA or holistic portfolio contributions.`;
            recommendedAction = 'Confirm with the official guidelines whether departmental or major GPA is accepted.';
          }
        }
        break;
      }

      case 'education_level': {
        if (!profile.educationLevel) {
          status = 'missing_information';
          actual = 'Education level not specified';
          reasoning = 'The program specifies degree requirements (e.g. undergraduate or masters), but your current level is not recorded.';
          recommendedAction = 'Select your current degree level in your academic profile.';

          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: 'What is your current education level?',
            fieldType: 'select',
            options: ['high_school', 'undergraduate', 'masters', 'phd', 'recent_grad'],
            helperText: 'Select your active degree stage.',
            currentValue: profile.educationLevel ?? ''
          });
        } else {
          actual = formatLabel(profile.educationLevel);
          const allowedLevels = Array.isArray(criterion.targetValue) ? criterion.targetValue : [criterion.targetValue];
          if (allowedLevels.includes(profile.educationLevel)) {
            status = 'match';
            reasoning = `Your degree level (${actual}) matches the eligible applicant criteria.`;
            recommendedAction = 'Obtain an enrollment verification letter or unofficial transcript from your registrar.';
          } else {
            status = 'needs_verification';
            reasoning = `The program targets ${allowedLevels.map(formatLabel).join(' or ')}, whereas your profile lists ${actual}.`;
            recommendedAction = 'Review program FAQ to see if exceptions apply for dual-degree or recent graduates.';
          }
        }
        break;
      }

      case 'field_of_study': {
        if (!profile.degreeMajor) {
          status = 'missing_information';
          actual = 'Major/Degree not specified';
          reasoning = 'The opportunity targets specific technical or quantitative disciplines.';
          recommendedAction = 'Add your course of study or major to your academic profile.';

          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: 'What is your current major, degree, or field of study?',
            fieldType: 'text',
            helperText: 'e.g. Computer Science, Electrical Engineering, Physics, Data Science',
            currentValue: profile.degreeMajor ?? ''
          });
        } else {
          actual = profile.degreeMajor;
          const majorLower = profile.degreeMajor.toLowerCase();
          const target = String(criterion.targetValue).toLowerCase();

          const isStemMatch = majorLower.includes('computer') ||
            majorLower.includes('software') ||
            majorLower.includes('data') ||
            majorLower.includes('engineering') ||
            majorLower.includes('math') ||
            majorLower.includes('physics') ||
            majorLower.includes('information') ||
            majorLower.includes('stem');

          if (isStemMatch || target === 'any') {
            status = 'match';
            reasoning = `Your major "${profile.degreeMajor}" aligns with the designated computational and STEM discipline criteria.`;
            recommendedAction = 'Highlight relevant course coursework in your CV.';
          } else {
            status = 'needs_verification';
            reasoning = `Your major "${profile.degreeMajor}" may require confirmation if multidisciplinary applicants are considered.`;
            recommendedAction = 'Check whether relevant tech electives or minor certificates can qualify your application.';
          }
        }
        break;
      }

      case 'graduation_year': {
        if (!profile.graduationYear) {
          status = 'missing_information';
          actual = 'Graduation year not provided';
          reasoning = 'The opportunity requires applicants to have specific standing or remaining semesters before graduation.';
          recommendedAction = 'Specify your projected graduation year in your profile.';

          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: 'What is your expected graduation year?',
            fieldType: 'number',
            helperText: 'Enter a 4-digit year, e.g. 2026 or 2027.',
            currentValue: profile.graduationYear ?? ''
          });
        } else {
          actual = `Class of ${profile.graduationYear}`;
          const targetYear = Number(criterion.targetValue);
          if (criterion.operator === 'gte' && profile.graduationYear >= targetYear) {
            status = 'match';
            reasoning = `Your projected graduation (${profile.graduationYear}) fulfills the minimum enrollment timeline requirement (>= ${targetYear}).`;
            recommendedAction = 'Verify your expected graduation date matches your official university degree audit.';
          } else if (criterion.operator === 'in_list' && Array.isArray(criterion.targetValue) && profile.currentYear && criterion.targetValue.includes(profile.currentYear)) {
            status = 'match';
            reasoning = `Your current year standing (${profile.currentYear}) matches the applicant eligibility guidelines.`;
            recommendedAction = 'Confirm with your academic advisor.';
          } else {
            status = 'needs_verification';
            reasoning = `Your graduation timing (${profile.graduationYear}) should be cross-referenced with the program start date.`;
            recommendedAction = 'Review the eligibility cutoff date on the host organization portal.';
          }
        }
        break;
      }

      case 'skills': {
        const studentSkills = profile.skills || [];
        if (studentSkills.length === 0) {
          status = 'missing_information';
          actual = 'No technical skills listed';
          reasoning = 'The opportunity requires proficiency in specific languages or tools, but none are listed on your profile.';
          recommendedAction = 'Add technical skills or upload your resume to extract skills.';

          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: 'Which programming languages and technologies are you proficient in?',
            fieldType: 'text',
            helperText: 'Comma-separated (e.g., Python, C++, React, Git, SQL)',
            currentValue: ''
          });
        } else {
          const targetSkills: string[] = Array.isArray(criterion.targetValue) ? criterion.targetValue : [criterion.targetValue];
          const matchedSkills = studentSkills.filter(s => 
            targetSkills.some(t => t.toLowerCase() === s.toLowerCase() || s.toLowerCase().includes(t.toLowerCase()))
          );

          actual = matchedSkills.length > 0 
            ? `Matching: ${matchedSkills.join(', ')} (out of ${studentSkills.length} listed)`
            : `Skills listed: ${studentSkills.slice(0, 5).join(', ')}`;

          if (matchedSkills.length > 0) {
            status = 'match';
            reasoning = `You possess relevant core skills required for this opportunity: ${matchedSkills.join(', ')}.`;
            recommendedAction = 'Include repository links or sample projects showcasing these skills.';
          } else {
            status = 'needs_verification';
            reasoning = `Your listed skills do not directly mention: ${targetSkills.join(', ')}. You may still be eligible if you have fundamental programming knowledge.`;
            recommendedAction = 'Update your profile if you have familiarity with these technologies or equivalent tools.';
          }
        }
        break;
      }

      case 'location_citizenship': {
        if (!profile.citizenship && !profile.countryOfResidence) {
          status = 'missing_information';
          actual = 'Citizenship / Residence not stated';
          reasoning = 'Location or citizenship verification is required to determine grant or visa compliance.';
          recommendedAction = 'Provide your country of residence and citizenship.';

          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: 'What is your country of citizenship and primary residence?',
            fieldType: 'text',
            helperText: 'e.g., United States, India, Canada, Germany, etc.',
            currentValue: profile.countryOfResidence || ''
          });
        } else {
          actual = `Citizenship: ${profile.citizenship || 'Not stated'}, Residence: ${profile.countryOfResidence || 'Not stated'}`;
          // Check specific US citizenship rule for NSF etc.
          if (opportunity.id.includes('nsf') || criterion.description.toLowerCase().includes('us citizen')) {
            const isUs = (profile.citizenship?.toLowerCase().includes('united states') || 
                          profile.citizenship?.toLowerCase().includes('us') || 
                          profile.citizenship?.toLowerCase().includes('usa'));
            if (isUs) {
              status = 'match';
              reasoning = 'Your citizenship matches the US domestic eligibility requirement.';
              recommendedAction = 'Have a valid US passport or proof of permanent residency ready.';
            } else {
              status = 'needs_verification';
              reasoning = 'This federal NSF opportunity strictly mandates US Citizenship or Permanent Residency.';
              recommendedAction = 'Verify your residency documentation status on the NSF ETAP portal.';
            }
          } else {
            status = 'match';
            reasoning = `Your geographic status (${actual}) is compatible with this global/regional opportunity.`;
            recommendedAction = 'Verify tax compliance documentation requirements.';
          }
        }
        break;
      }

      case 'enrollment_status': {
        if (profile.enrolledStatus === undefined || profile.enrolledStatus === null) {
          status = 'missing_information';
          actual = 'Enrollment status not specified';
          reasoning = 'The opportunity requires active enrollment in an accredited institution.';
          recommendedAction = 'Confirm your current student enrollment status.';

          followUpQuestions.push({
            id: `fq-${criterion.id}`,
            criterionId: criterion.id,
            question: 'Are you currently enrolled as an active student at an educational institution?',
            fieldType: 'boolean',
            helperText: 'Check yes if you are actively attending classes or enrolled for the upcoming term.',
            currentValue: true
          });
        } else if (profile.enrolledStatus === true) {
          status = 'match';
          actual = 'Actively enrolled student';
          reasoning = 'You meet the active student matriculation requirement.';
          recommendedAction = 'Obtain an enrollment certificate or unofficial transcript from your registrar.';
        } else {
          status = 'needs_verification';
          actual = 'Not actively enrolled';
          reasoning = 'The opportunity specifies enrolled students; non-enrolled or graduated applicants may need special status.';
          recommendedAction = 'Check program guidelines for recent graduate allowances.';
        }
        break;
      }

      default: {
        // Experience / General criteria
        status = 'needs_verification';
        actual = profile.experienceSummary ? 'Experience summary recorded' : 'Details unverified';
        reasoning = criterion.description;
        recommendedAction = 'Check the official opportunity notice for submission guidelines.';
        break;
      }
    }

    criteriaResults.push({
      criterionId: criterion.id,
      criterionName: criterion.name,
      category: criterion.category,
      expected: criterion.description,
      actual,
      status,
      reasoning,
      recommendedAction
    });
  }

  // Calculate summary counts strictly from criteria results
  const matches = criteriaResults.filter(c => c.status === 'match').length;
  const needsVerification = criteriaResults.filter(c => c.status === 'needs_verification').length;
  const missingInformation = criteriaResults.filter(c => c.status === 'missing_information').length;
  const totalCriteria = criteriaResults.length;

  let overallVerdict: EligibilityReport['overallVerdict'] = 'partial_match';
  if (missingInformation > totalCriteria / 2) {
    overallVerdict = 'insufficient_info';
  } else if (matches === totalCriteria) {
    overallVerdict = 'high_match';
  } else if (matches >= totalCriteria * 0.6) {
    overallVerdict = 'high_match';
  } else if (needsVerification > matches) {
    overallVerdict = 'needs_attention';
  }

  // Generate actionable personalized next-steps plan based on actual criteria and opportunity requirements
  // 1. Missing information tasks
  if (missingInformation > 0) {
    nextStepsPlan.push({
      id: 'step-missing-info',
      title: 'Complete Missing Profile Fields',
      description: `Provide the ${missingInformation} missing field(s) identified in this report to unlock a definitive match assessment.`,
      category: 'profile_fix',
      completed: false,
      priority: 'high'
    });
  }

  // 2. Required documents tasks from the opportunity
  if (opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0) {
    opportunity.requiredDocuments.forEach((doc, idx) => {
      nextStepsPlan.push({
        id: `step-doc-${idx}`,
        title: `Prepare: ${doc}`,
        description: `Gather and verify ${doc} according to the sponsor's format guidelines.`,
        category: 'documentation',
        completed: false,
        priority: idx === 0 ? 'high' : 'medium'
      });
    });
  }

  // 3. Verification tasks
  if (needsVerification > 0) {
    nextStepsPlan.push({
      id: 'step-verify-rules',
      title: 'Review Specific Eligibility Rules on Official Portal',
      description: `Confirm the ${needsVerification} criteria requiring verification directly against the host organization's instructions.`,
      category: 'verification',
      completed: false,
      priority: 'medium'
    });
  }

  // 4. Submission task
  nextStepsPlan.push({
    id: 'step-submit-app',
    title: `Submit Application via ${opportunity.organization} Portal`,
    description: `Complete the official online submission before ${formatDeadline(opportunity.deadline)}.`,
    category: 'application_submission',
    completed: false,
    priority: 'high',
    dueDate: opportunity.deadline
  });

  return {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    opportunityOrg: opportunity.organization,
    officialUrl: opportunity.officialUrl,
    generatedAt: new Date().toISOString(),
    overallVerdict,
    summaryCounts: {
      matches,
      needsVerification,
      missingInformation,
      totalCriteria
    },
    criteriaResults,
    followUpQuestions,
    nextStepsPlan,
    disclaimer: 'This assessment is an informational guide to help you discover gaps and prepare your submission. It does not predict or guarantee selection, admission, or funding. Official host organization rules and deadlines remain authoritative.',
    inputProfileSnapshot: { ...profile }
  };
}

function formatLabel(str: string): string {
  if (!str) return '';
  return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function formatDeadline(dateStr: string): string {
  if (!dateStr) return 'the posted deadline';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}
