import { Opportunity } from '../types';

export const SEED_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-gsoc-2026',
    title: 'Google Summer of Code 2026',
    organization: 'Google Open Source',
    category: 'internship',
    type: 'stipend',
    shortDescription: 'Global mentorship program bringing new contributors into open source software development with structured stipends.',
    fullDescription: 'Google Summer of Code (GSoC) is a global, online program focused on bringing new contributors into open source software development. GSoC Contributors work with an open source organization on a 12+ week programming project under the guidance of mentors. Contributors receive a stipend based on their location.',
    location: 'Global / 100% Remote',
    workMode: 'remote',
    deadline: '2026-04-08T18:00:00Z',
    deadlineStatus: 'open',
    fundingAmount: '$3,000 - $6,600 USD (Location Adjusted)',
    officialUrl: 'https://summerofcode.withgoogle.com',
    lastVerified: '2026-10-15',
    isVerifiedSeed: true,
    eligibilitySummary: 'Must be at least 18 years old, eligible to work in your country of residence, and a beginner or student in open source development.',
    criteria: [
      {
        id: 'gsoc-c1',
        name: 'Minimum Age',
        category: 'experience',
        description: 'Must be at least 18 years of age upon registration.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'gsoc-c2',
        name: 'Open Source Experience Level',
        category: 'skills',
        description: 'Targeted at students or beginners/intermediate contributors to open source.',
        operator: 'text_check',
        targetValue: 'beginner_or_intermediate',
        importance: 'mandatory'
      },
      {
        id: 'gsoc-c3',
        name: 'Technical Competence',
        category: 'skills',
        description: 'Proficiency in programming languages relevant to chosen organization (e.g., Python, C++, JavaScript, Rust, Go).',
        operator: 'includes_any',
        targetValue: ['Python', 'C++', 'JavaScript', 'TypeScript', 'Rust', 'Go', 'Java', 'Git'],
        importance: 'mandatory'
      },
      {
        id: 'gsoc-c4',
        name: 'Work Eligibility',
        category: 'location_citizenship',
        description: 'Must be eligible to receive funds and work legally in the country of residence.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Project Proposal (following mentor organization template)',
      'Proof of prior code contributions or pull requests',
      'Valid Government-issued ID / Tax forms for stipend release'
    ],
    applicationSteps: [
      'Review accepted open source mentor organizations',
      'Engage with community channels and discuss proposal ideas',
      'Draft proposal and get feedback from mentors',
      'Submit official application on GSoC portal before deadline'
    ],
    importantDates: [
      { label: 'Mentoring Orgs Announced', date: 'February 25, 2026' },
      { label: 'Contributor Applications Open', date: 'March 24, 2026' },
      { label: 'Application Deadline', date: 'April 8, 2026' },
      { label: 'Accepted Projects Announced', date: 'May 1, 2026' }
    ]
  },
  {
    id: 'opp-ghc-2026',
    title: 'Grace Hopper Celebration Student Scholarship',
    organization: 'AnitaB.org',
    category: 'scholarship',
    type: 'fully_funded',
    shortDescription: 'Full conference registration, travel grant, and lodging for undergraduate and graduate women and non-binary technologists.',
    fullDescription: 'The GHC Student Scholar program provides complimentary registration, hotel accommodations, and airfare for students to attend the largest gathering of women and non-binary technologists in the world. Scholars participate in specialized career sessions and networking circles.',
    location: 'Philadelphia, PA / Hybrid Option',
    workMode: 'hybrid',
    deadline: '2026-05-15T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: 'Full Registration + Travel & Lodging ($2,500+ value)',
    officialUrl: 'https://ghc.anitab.org',
    lastVerified: '2026-10-10',
    isVerifiedSeed: true,
    eligibilitySummary: 'Enrolled in an accredited degree program in Computer Science or related STEM field. Minimum GPA 3.0/4.0 or equivalent.',
    criteria: [
      {
        id: 'ghc-c1',
        name: 'Accredited Degree Enrollment',
        category: 'enrollment_status',
        description: 'Must be currently enrolled in an accredited undergraduate or graduate post-secondary institution.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'ghc-c2',
        name: 'STEM Major',
        category: 'field_of_study',
        description: 'Degree program in Computer Science, Computer Engineering, Data Science, or related computational discipline.',
        operator: 'text_check',
        targetValue: 'stem_or_cs',
        importance: 'mandatory'
      },
      {
        id: 'ghc-c3',
        name: 'Academic Standing',
        category: 'minimum_cgpa',
        description: 'Cumulative GPA of at least 3.0 on a 4.0 scale (or equivalent 7.5/10.0 or 75%).',
        operator: 'gte',
        targetValue: 3.0,
        importance: 'mandatory'
      },
      {
        id: 'ghc-c4',
        name: 'Enrollment Continuity',
        category: 'graduation_year',
        description: 'Must remain enrolled through at least Fall semester following the conference.',
        operator: 'gte',
        targetValue: 2026,
        importance: 'preferred'
      }
    ],
    requiredDocuments: [
      'Current Academic Transcript (unofficial accepted)',
      'Resume / CV (1 page recommended)',
      'Short Essay: Commitment to diversity in tech & career aspirations',
      'Faculty Recommendation Letter'
    ],
    applicationSteps: [
      'Complete online scholar application on AnitaB.org portal',
      'Upload verified enrollment proof and transcript',
      'Submit essay responses regarding impact and community leadership',
      'Request faculty recommendation before priority deadline'
    ],
    importantDates: [
      { label: 'Application Closes', date: 'May 15, 2026' },
      { label: 'Scholar Decisions Sent', date: 'July 10, 2026' },
      { label: 'Conference Dates', date: 'October 6–9, 2026' }
    ]
  },
  {
    id: 'opp-nasa-lspace-2026',
    title: 'NASA L’SPACE Mission Concept Academy',
    organization: 'NASA STEM Engagement',
    category: 'research',
    type: 'unpaid_learning',
    shortDescription: '12-week virtual STEM workforce academy where student teams design a NASA robotic planetary mission concept.',
    fullDescription: 'The NASA Lucy Student Pipeline Accelerator and Competency Enabler (L’SPACE) Mission Concept Academy (MCA) is a collaborative 12-week online interactive workforce preparation program. Students work in multidisciplinary teams under NASA engineer mentorship to complete a Preliminary Design Review (PDR).',
    location: 'United States / Online Virtual',
    workMode: 'remote',
    deadline: '2026-11-20T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: 'NASA Certificate of Completion & Workforce Credential',
    officialUrl: 'https://www.lspace.asu.edu',
    lastVerified: '2026-10-12',
    isVerifiedSeed: true,
    eligibilitySummary: 'Undergraduate student attending a US-based college or university. All STEM and business majors welcome.',
    criteria: [
      {
        id: 'nasa-c1',
        name: 'Education Level',
        category: 'education_level',
        description: 'Current undergraduate student (freshman through senior standing).',
        operator: 'in_list',
        targetValue: ['undergraduate'],
        importance: 'mandatory'
      },
      {
        id: 'nasa-c2',
        name: 'US Higher Ed Enrollment',
        category: 'location_citizenship',
        description: 'Enrolled in an accredited US college or university.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'nasa-c3',
        name: 'Time Commitment',
        category: 'experience',
        description: 'Ability to dedicate 6-10 hours weekly including virtual weekly sessions.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Unofficial College Transcript',
      'Resume highlighting coursework or team projects',
      'Short Statement of Intent on planetary exploration'
    ],
    applicationSteps: [
      'Fill out online registration form on L’SPACE portal',
      'Verify accredited US institution status',
      'Complete onboarding questionnaire and team role survey'
    ],
    importantDates: [
      { label: 'Fall Applications Open', date: 'October 1, 2026' },
      { label: 'Priority Deadline', date: 'November 20, 2026' },
      { label: 'Academy Kickoff', date: 'January 15, 2027' }
    ]
  },
  {
    id: 'opp-ms-imaginecup-2026',
    title: 'Microsoft Imagine Cup Global Competition',
    organization: 'Microsoft',
    category: 'competition',
    type: 'award',
    shortDescription: 'Premier global student technology competition with $100,000 grand prize, Microsoft mentorship, and Azure credits.',
    fullDescription: 'The Imagine Cup empowers student developers, entrepreneurs, and innovators to build purpose-driven software solutions using cutting-edge AI, cloud, and edge technologies. Finalist teams pitch to global tech leaders for the $100,000 grand prize and direct mentorship with Microsoft executives.',
    location: 'Global / Virtual Rounds + World Finals',
    workMode: 'hybrid',
    deadline: '2026-12-15T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: '$100,000 USD Grand Prize + $10,000 in Azure Credits',
    officialUrl: 'https://imaginecup.microsoft.com',
    lastVerified: '2026-10-14',
    isVerifiedSeed: true,
    eligibilitySummary: 'Must be actively enrolled students aged 16+. Teams of 1 to 4 members with a working tech prototype leveraging cloud/AI.',
    criteria: [
      {
        id: 'mic-c1',
        name: 'Student Status & Minimum Age',
        category: 'enrollment_status',
        description: 'Enrolled student at high school or higher education institution, age 16 or older.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'mic-c2',
        name: 'Team Composition',
        category: 'experience',
        description: 'Team of 1 to 4 eligible students.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'mic-c3',
        name: 'Technical Solution Prototype',
        category: 'skills',
        description: 'Working software prototype built with modern cloud/AI stacks (Azure, Web/Mobile, ML, or IoT).',
        operator: 'includes_any',
        targetValue: ['Cloud', 'Azure', 'Python', 'React', 'AI', 'Machine Learning', 'TypeScript'],
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Project Pitch Deck (PDF format, max 10 slides)',
      '3-Minute Demo Video Walkthrough',
      'Public GitHub or Azure deployment link',
      'Proof of student enrollment for all team members'
    ],
    applicationSteps: [
      'Register student account on Microsoft Imagine Cup portal',
      'Create or join a team of 1-4 members',
      'Build functional solution using Microsoft Cloud / AI tools',
      'Submit pitch deck and video URL before round deadline'
    ],
    importantDates: [
      { label: 'Qualifying Round Closes', date: 'December 15, 2026' },
      { label: 'Semifinals Selection', date: 'February 2027' },
      { label: 'World Championship at Microsoft Build', date: 'May 2027' }
    ]
  },
  {
    id: 'opp-cern-summer-2026',
    title: 'CERN Summer Student Programme 2026',
    organization: 'CERN (European Organization for Nuclear Research)',
    category: 'research',
    type: 'fully_funded',
    shortDescription: '8 to 13 weeks of hands-on advanced physics and computing research at CERN laboratories in Geneva, Switzerland.',
    fullDescription: 'During the summer, students join multidisciplinary research teams working on high-energy physics, scientific computing, detector development, and data analysis at CERN. Participants attend a dedicated lecture series delivered by world-renowned scientists.',
    location: 'Geneva, Switzerland',
    workMode: 'on_site',
    deadline: '2026-01-30T12:00:00Z',
    deadlineStatus: 'closing_soon',
    fundingAmount: 'CHF 92/day Subsistence Allowance (~CHF 2,760/mo) + Travel',
    officialUrl: 'https://careers.cern/summer-student-programme',
    lastVerified: '2026-10-14',
    isVerifiedSeed: true,
    eligibilitySummary: 'Enrolled university student with at least 3 years of full-time university studies completed. Fluent in English or French.',
    criteria: [
      {
        id: 'cern-c1',
        name: 'University Study Progress',
        category: 'education_level',
        description: 'Must have completed at least 3 full academic years of university-level studies.',
        operator: 'in_list',
        targetValue: ['undergraduate', 'masters'],
        importance: 'mandatory'
      },
      {
        id: 'cern-c2',
        name: 'Field of Study',
        category: 'field_of_study',
        description: 'Physics, Computing, Mathematics, Engineering, or related fields.',
        operator: 'text_check',
        targetValue: 'physics_cs_math_engineering',
        importance: 'mandatory'
      },
      {
        id: 'cern-c3',
        name: 'Language Proficiency',
        category: 'skills',
        description: 'Good knowledge of English or French.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'cern-c4',
        name: 'Prior CERN Stay',
        category: 'experience',
        description: 'Must not have worked at CERN as a Summer Student or Technical Student previously for more than 3 months.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Comprehensive Curriculum Vitae (CV) in English or French',
      'Most recent official academic transcript with grades',
      'Two academic letters of recommendation from university professors',
      'Copy of passport or national ID'
    ],
    applicationSteps: [
      'Submit application through CERN SmartRecruiters portal',
      'Provide contact details for two referees to upload recommendations',
      'Review project preference tags (Computing, Detectors, Data Analysis)',
      'Undergo selection committee review in March'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'November 2025' },
      { label: 'Application Deadline', date: 'January 30, 2026' },
      { label: 'Selection Results', date: 'Mid-April 2026' },
      { label: 'Summer Programme Start', date: 'June–July 2026' }
    ]
  },
  {
    id: 'opp-gen-google-2026',
    title: 'Generation Google Scholarship (North America & EMEA)',
    organization: 'Google Diversity & Inclusion',
    category: 'scholarship',
    type: 'tuition_grant',
    shortDescription: '$10,000 USD (or €7,000 EUR) scholarship for students pursuing computer science degrees demonstrating leadership.',
    fullDescription: 'The Generation Google Scholarship was established to help aspiring computer scientists excel in technology and become active leaders in the field. Selected students receive direct tuition assistance and join a global alumni community of technologists.',
    location: 'North America / EMEA (University Enrolled)',
    workMode: 'remote',
    deadline: '2026-04-20T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: '$10,000 USD / €7,000 EUR Direct Tuition Grant',
    officialUrl: 'https://buildyourfuture.withgoogle.com/scholarships/generation-google-scholarship',
    lastVerified: '2026-10-11',
    isVerifiedSeed: true,
    eligibilitySummary: 'Enrolled as a full-time student in an undergraduate or graduate CS program. Exemplify leadership and commitment to diversity.',
    criteria: [
      {
        id: 'gg-c1',
        name: 'Full-time Student Enrollment',
        category: 'enrollment_status',
        description: 'Currently enrolled as a full-time student at an accredited university.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'gg-c2',
        name: 'Major Field of Study',
        category: 'field_of_study',
        description: 'Studying computer science, computer engineering, or a closely related technical field.',
        operator: 'text_check',
        targetValue: 'computer_science',
        importance: 'mandatory'
      },
      {
        id: 'gg-c3',
        name: 'Academic Record',
        category: 'minimum_cgpa',
        description: 'Exemplary academic record (recommended minimum GPA equivalent of 3.2/4.0).',
        operator: 'gte',
        targetValue: 3.2,
        importance: 'preferred'
      },
      {
        id: 'gg-c4',
        name: 'Community Leadership',
        category: 'experience',
        description: 'Demonstrated passion for improving diversity and representation in technology.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Resume/CV highlighting technical projects and leadership roles',
      'Current Academic Transcript',
      'Two essay responses on community leadership and technological challenges',
      '15-minute online technical/analytical assessment (if invited)'
    ],
    applicationSteps: [
      'Submit online application on Google Build Your Future portal',
      'Upload transcripts and essays',
      'Complete online skills verification if prompted'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'March 1, 2026' },
      { label: 'Application Deadline', date: 'April 20, 2026' },
      { label: 'Recipients Notified', date: 'July 2026' }
    ]
  },
  {
    id: 'opp-mlh-fellowship-2026',
    title: 'Major League Hacking (MLH) Fellowship',
    organization: 'Major League Hacking & Meta / GitHub',
    category: 'fellowship',
    type: 'stipend',
    shortDescription: '12-week remote software engineering and open source fellowship with educational stipend and mentor support.',
    fullDescription: 'The MLH Fellowship is a remote internship alternative for aspiring software engineers. Instead of a traditional internship, fellows work in small pods on real-world open source projects used by millions, guided by professional engineering mentors. Need-based educational stipends are provided.',
    location: 'Global / 100% Remote',
    workMode: 'remote',
    deadline: '2026-05-30T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: 'Up to $5,000 USD Need-Based Educational Stipend',
    officialUrl: 'https://fellowship.mlh.io',
    lastVerified: '2026-10-15',
    isVerifiedSeed: true,
    eligibilitySummary: 'Must be 18+ years old, proficient in English, able to commit 30+ hours/week for full-time or 15+ for part-time.',
    criteria: [
      {
        id: 'mlh-c1',
        name: 'Age Requirement',
        category: 'experience',
        description: 'At least 18 years of age at the start of the batch.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'mlh-c2',
        name: 'Coding Competency',
        category: 'skills',
        description: 'Able to produce a working code sample in Python, JavaScript, TypeScript, Go, or Java.',
        operator: 'includes_any',
        targetValue: ['Python', 'JavaScript', 'TypeScript', 'Go', 'Java', 'C++', 'Node.js'],
        importance: 'mandatory'
      },
      {
        id: 'mlh-c3',
        name: 'Weekly Availability',
        category: 'experience',
        description: 'Commit 30-40 hours per week (Full-time batch) or 15-20 hours (Part-time batch).',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Original Code Sample written by you (GitHub repo link)',
      'Resume / LinkedIn profile',
      'Short motivation statement explaining why you want to join'
    ],
    applicationSteps: [
      'Submit written application with code sample link',
      'Technical interview walking through your submitted code sample',
      'Behavioral fit interview with MLH admissions team',
      'Pod matching based on technical stack'
    ],
    importantDates: [
      { label: 'Summer Batch Deadline', date: 'May 30, 2026' },
      { label: 'Batch Orientation', date: 'June 2026' },
      { label: 'Graduation Day', date: 'August 2026' }
    ]
  },
  {
    id: 'opp-github-campus-2026',
    title: 'GitHub Campus Expert Program',
    organization: 'GitHub Education',
    category: 'fellowship',
    type: 'award',
    shortDescription: 'Student community leadership program providing tech training, event sponsorship budgets, and GitHub swag.',
    fullDescription: 'GitHub Campus Experts are student leaders that build tech communities on their campus with training and support from GitHub. Students learn public speaking, technical workshop design, community governance, and receive funding to host student hackathons and meetups.',
    location: 'Global / On Campus',
    workMode: 'hybrid',
    deadline: '2026-08-31T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: 'Community Event Budgets ($1,000+) + Swag & Training',
    officialUrl: 'https://education.github.com/experts',
    lastVerified: '2026-10-10',
    isVerifiedSeed: true,
    eligibilitySummary: 'Active college/university student with GitHub Student Developer Pack and at least one year of study remaining.',
    criteria: [
      {
        id: 'ghce-c1',
        name: 'GitHub Student Developer Pack',
        category: 'enrollment_status',
        description: 'Must have an active GitHub Student Developer Pack verification.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'ghce-c2',
        name: 'Remaining Study Time',
        category: 'graduation_year',
        description: 'Must have at least one year remaining before university graduation.',
        operator: 'gte',
        targetValue: 2027,
        importance: 'mandatory'
      },
      {
        id: 'ghce-c3',
        name: 'Community Drive',
        category: 'experience',
        description: 'Demonstrated enthusiasm for organizing technical clubs, meetups, or study groups.',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Verified GitHub Student Developer Pack',
      'Video submission (5 minutes) addressing local campus tech needs',
      'Campus Community Analysis essay'
    ],
    applicationSteps: [
      'Complete online application when application window opens',
      'Submit community assessment detailing student challenges at your school',
      'Undergo GitHub Campus Expert Training modules upon selection'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'August 1, 2026' },
      { label: 'Application Deadline', date: 'August 31, 2026' },
      { label: 'Training Starts', date: 'October 2026' }
    ]
  },
  {
    id: 'opp-nsf-reu-2026',
    title: 'NSF REU: Undergraduate Research in Intelligent Systems',
    organization: 'National Science Foundation (NSF)',
    category: 'research',
    type: 'fully_funded',
    shortDescription: '10-week funded summer undergraduate research program at top US university research labs in AI and robotics.',
    fullDescription: 'The National Science Foundation Research Experiences for Undergraduates (REU) site provides intensive faculty-mentored research in machine learning, sensor networks, robotics, and cyber-physical systems. Includes research stipend, campus housing, and travel allowance.',
    location: 'Austin, TX / On-site University Lab',
    workMode: 'on_site',
    deadline: '2026-02-15T23:59:59Z',
    deadlineStatus: 'closing_soon',
    fundingAmount: '$6,000 USD Stipend + Free University Housing & Meals',
    officialUrl: 'https://www.nsf.gov/crssprgm/reu/',
    lastVerified: '2026-10-13',
    isVerifiedSeed: true,
    eligibilitySummary: 'US Citizen or Permanent Resident undergraduate student. Minimum CGPA of 3.2 on a 4.0 scale.',
    criteria: [
      {
        id: 'nsf-c1',
        name: 'Citizenship Requirement',
        category: 'location_citizenship',
        description: 'Must be a US Citizen, US National, or Permanent Resident (Federal NSF mandate).',
        operator: 'boolean',
        targetValue: true,
        importance: 'mandatory'
      },
      {
        id: 'nsf-c2',
        name: 'Undergraduate Status',
        category: 'education_level',
        description: 'Must be currently enrolled as an undergraduate student and not graduating prior to summer program completion.',
        operator: 'in_list',
        targetValue: ['undergraduate'],
        importance: 'mandatory'
      },
      {
        id: 'nsf-c3',
        name: 'Minimum CGPA',
        category: 'minimum_cgpa',
        description: 'Cumulative GPA of 3.2 or higher on a 4.0 scale.',
        operator: 'gte',
        targetValue: 3.2,
        importance: 'mandatory'
      },
      {
        id: 'nsf-c4',
        name: 'Foundational Knowledge',
        category: 'skills',
        description: 'Coursework in Data Structures, Linear Algebra, or Python/C++ programming.',
        operator: 'includes_any',
        targetValue: ['Python', 'C++', 'Data Structures', 'Machine Learning', 'Linear Algebra'],
        importance: 'preferred'
      }
    ],
    requiredDocuments: [
      'Official or Unofficial Academic Transcript',
      'Two Academic Letters of Recommendation from STEM faculty',
      'Personal Statement of Research Interests (2 pages max)',
      'Current Resume / CV'
    ],
    applicationSteps: [
      'Create profile on NSF Education and Training Application portal (ETAP)',
      'Select research project lab preferences',
      'Upload transcripts, resume, and statement of research interests',
      'Ensure faculty recommenders submit letters before deadline'
    ],
    importantDates: [
      { label: 'ETAP System Opens', date: 'November 15, 2025' },
      { label: 'Application Deadline', date: 'February 15, 2026' },
      { label: 'Offer Notifications', date: 'March 15–30, 2026' },
      { label: 'Program Dates', date: 'June 1 – August 7, 2026' }
    ]
  },
  {
    id: 'opp-palantir-scholarship-2026',
    title: 'Palantir Women in Technology Scholarship',
    organization: 'Palantir Technologies',
    category: 'scholarship',
    type: 'tuition_grant',
    shortDescription: '$7,000 USD grant + all-expenses-paid developmental retreat at Palantir offices in Washington, D.C.',
    fullDescription: 'Palantir launched the Women in Technology Scholarship to support undergraduate women in STEM fields who are passionate about using technology to solve humanity’s hardest problems. Recipients receive a $7,000 education grant, participate in technical workshops, and are fast-tracked for internship interviews.',
    location: 'North America / Hybrid Retreat',
    workMode: 'hybrid',
    deadline: '2026-03-22T23:59:59Z',
    deadlineStatus: 'open',
    fundingAmount: '$7,000 USD Grant + All-Expenses-Paid Tech Workshop',
    officialUrl: 'https://www.palantir.com/careers/students/scholarships/',
    lastVerified: '2026-10-14',
    isVerifiedSeed: true,
    eligibilitySummary: 'Full-time undergraduate student in CS/Software Engineering in sophomore or junior year.',
    criteria: [
      {
        id: 'pal-c1',
        name: 'Academic Year Standing',
        category: 'graduation_year',
        description: 'Currently in sophomore (2nd year) or junior (3rd year) of undergraduate study.',
        operator: 'in_list',
        targetValue: ['2nd Year', '3rd Year', 'Sophomore', 'Junior'],
        importance: 'mandatory'
      },
      {
        id: 'pal-c2',
        name: 'Technical Degree',
        category: 'field_of_study',
        description: 'Major in Computer Science, Software Engineering, Data Science, or related computational degree.',
        operator: 'text_check',
        targetValue: 'computer_science',
        importance: 'mandatory'
      },
      {
        id: 'pal-c3',
        name: 'Technical Skills',
        category: 'skills',
        description: 'Hands-on programming experience with algorithms, data processing, or full-stack software development.',
        operator: 'includes_any',
        targetValue: ['Python', 'Java', 'C++', 'TypeScript', 'Algorithms', 'Distributed Systems'],
        importance: 'mandatory'
      }
    ],
    requiredDocuments: [
      'Resume/CV (1 page max)',
      'Unofficial University Transcript',
      'Short Essay explaining how you apply technology to tackle societal challenges'
    ],
    applicationSteps: [
      'Submit application through Palantir Students portal',
      'Upload academic records and essay',
      'Semi-finalists participate in a virtual panel conversation with engineers'
    ],
    importantDates: [
      { label: 'Applications Open', date: 'January 20, 2026' },
      { label: 'Application Deadline', date: 'March 22, 2026' },
      { label: 'Scholars Announced', date: 'May 2026' }
    ]
  }
];
