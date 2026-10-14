import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting comprehensive data seeding for PM Internship Scheme...');

  // Clean existing data
  await prisma.feedback.deleteMany();
  await prisma.recommendationReason.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.savedInternship.deleteMany();
  await prisma.application.deleteMany();
  await prisma.internshipSkill.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.education.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.recommendationConfig.deleteMany();

  console.log('🧹 Cleaned previous database records.');

  // 1. Recommendation Configuration
  await prisma.recommendationConfig.create({
    data: {
      key: 'DEFAULT',
      skillWeight: 30.0,
      educationWeight: 20.0,
      domainWeight: 15.0,
      locationWeight: 10.0,
      experienceWeight: 10.0,
      careerGoalWeight: 10.0,
      preferenceWeight: 5.0,
      minScoreThreshold: 40.0,
      aiProvider: 'LOCAL_ML',
      strictEligibility: true,
      isActive: true,
    },
  });

  // Password hashes
  const studentPasswordHash = await bcrypt.hash('Student@12345', 10);
  const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);

  // 2. Create Default Admin User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@pminternship.gov.in',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      firstName: 'Rajesh',
      lastName: 'Verma',
      phone: '+911123456789',
      admin: {
        create: {
          employeeId: 'MCA-DIR-001',
          department: 'Ministry of Corporate Affairs - PM Internship Mission Directorate',
          permissions: JSON.stringify(['ALL', 'INTERNSHIPS', 'STUDENTS', 'ANALYTICS']),
        },
      },
    },
  });
  console.log(`👤 Created Admin: ${adminUser.email}`);

  // 3. Create Skills Catalog (40+ skills)
  const skillsData = [
    { name: 'Python', standardizedName: 'python', category: 'TECHNICAL' },
    { name: 'JavaScript', standardizedName: 'javascript', category: 'TECHNICAL' },
    { name: 'TypeScript', standardizedName: 'typescript', category: 'TECHNICAL' },
    { name: 'React', standardizedName: 'react', category: 'TECHNICAL' },
    { name: 'Node.js', standardizedName: 'nodejs', category: 'TECHNICAL' },
    { name: 'Express', standardizedName: 'express', category: 'TECHNICAL' },
    { name: 'SQL', standardizedName: 'sql', category: 'TECHNICAL' },
    { name: 'PostgreSQL', standardizedName: 'postgresql', category: 'TECHNICAL' },
    { name: 'Machine Learning', standardizedName: 'machine learning', category: 'TECHNICAL' },
    { name: 'Data Analysis', standardizedName: 'data analysis', category: 'TECHNICAL' },
    { name: 'Docker', standardizedName: 'docker', category: 'TOOL' },
    { name: 'Kubernetes', standardizedName: 'kubernetes', category: 'TOOL' },
    { name: 'Git', standardizedName: 'git', category: 'TOOL' },
    { name: 'AWS', standardizedName: 'aws', category: 'TOOL' },
    { name: 'Java', standardizedName: 'java', category: 'TECHNICAL' },
    { name: 'C++', standardizedName: 'c++', category: 'TECHNICAL' },
    { name: 'AutoCAD', standardizedName: 'autocad', category: 'TOOL' },
    { name: 'SolidWorks', standardizedName: 'solidworks', category: 'TOOL' },
    { name: 'CATIA', standardizedName: 'catia', category: 'TOOL' },
    { name: 'ANSYS', standardizedName: 'ansys', category: 'TOOL' },
    { name: 'MATLAB', standardizedName: 'matlab', category: 'TOOL' },
    { name: 'PLC Programming', standardizedName: 'plc programming', category: 'TECHNICAL' },
    { name: 'SCADA', standardizedName: 'scada', category: 'TECHNICAL' },
    { name: 'Embedded Systems', standardizedName: 'embedded systems', category: 'TECHNICAL' },
    { name: 'Financial Modeling', standardizedName: 'financial modeling', category: 'TECHNICAL' },
    { name: 'Advanced Excel', standardizedName: 'advanced excel', category: 'TOOL' },
    { name: 'Tally Prime', standardizedName: 'tally prime', category: 'TOOL' },
    { name: 'Cost Accounting', standardizedName: 'cost accounting', category: 'DOMAIN' },
    { name: 'Supply Chain Management', standardizedName: 'supply chain management', category: 'DOMAIN' },
    { name: 'Logistics Optimization', standardizedName: 'logistics optimization', category: 'TECHNICAL' },
    { name: 'Digital Marketing', standardizedName: 'digital marketing', category: 'DOMAIN' },
    { name: 'SEO', standardizedName: 'seo', category: 'TECHNICAL' },
    { name: 'Content Writing', standardizedName: 'content writing', category: 'SOFT' },
    { name: 'Communication', standardizedName: 'communication', category: 'SOFT' },
    { name: 'Problem Solving', standardizedName: 'problem solving', category: 'SOFT' },
    { name: 'Leadership', standardizedName: 'leadership', category: 'SOFT' },
    { name: 'Teamwork', standardizedName: 'teamwork', category: 'SOFT' },
    { name: 'UI/UX Design', standardizedName: 'ui/ux design', category: 'TECHNICAL' },
    { name: 'Figma', standardizedName: 'figma', category: 'TOOL' },
    { name: 'Cyber Security', standardizedName: 'cyber security', category: 'TECHNICAL' },
  ];

  const skillMap = new Map<string, string>();
  for (const s of skillsData) {
    const createdSkill = await prisma.skill.create({ data: s });
    skillMap.set(s.name, createdSkill.id);
  }
  console.log(`⚡ Seeded ${skillsData.length} Skills.`);

  // 4. Create Top 16 Organizations (Partner PSUs & Top 500 Companies)
  const organizationsData = [
    {
      name: 'Tata Consultancy Services',
      slug: 'tcs',
      industry: 'Information Technology & Consulting',
      description: 'Global IT leader offering digital solutions, cloud migration, and AI-driven platforms.',
      headquarter: 'Mumbai, Maharashtra',
      website: 'https://www.tcs.com',
    },
    {
      name: 'Larsen & Toubro (L&T)',
      slug: 'larsen-toubro',
      industry: 'Engineering & Construction',
      description: 'Major technology, engineering, construction, and manufacturing conglomerate.',
      headquarter: 'Mumbai, Maharashtra',
      website: 'https://www.larsentoubro.com',
    },
    {
      name: 'Bharat Heavy Electricals Limited (BHEL)',
      slug: 'bhel',
      industry: 'Power Plant & Electrical Manufacturing',
      description: 'Premier engineering PSU manufacturing power equipment, turbines, and railway systems.',
      headquarter: 'New Delhi, Delhi',
      website: 'https://www.bhel.com',
    },
    {
      name: 'Reliance Industries Limited',
      slug: 'reliance',
      industry: 'Energy, Petrochemicals & Telecom',
      description: 'Fortune 500 company spanning green energy, retail, 5G telecommunications, and digital services.',
      headquarter: 'Mumbai, Maharashtra',
      website: 'https://www.ril.com',
    },
    {
      name: 'State Bank of India (SBI)',
      slug: 'sbi',
      industry: 'Banking & Financial Services',
      description: 'India largest public sector banking institution driving financial inclusion and fintech innovation.',
      headquarter: 'Mumbai, Maharashtra',
      website: 'https://www.sbi.co.in',
    },
    {
      name: 'Infosys Limited',
      slug: 'infosys',
      industry: 'Information Technology & Services',
      description: 'Global consulting and enterprise cloud services provider leading digital transformation.',
      headquarter: 'Bengaluru, Karnataka',
      website: 'https://www.infosys.com',
    },
    {
      name: 'Maruti Suzuki India Limited',
      slug: 'maruti-suzuki',
      industry: 'Automotive & Manufacturing',
      description: 'Leading automobile manufacturer revolutionizing mobility and hybrid electric vehicle tech.',
      headquarter: 'New Delhi, Delhi',
      website: 'https://www.marutisuzuki.com',
    },
    {
      name: 'Oil and Natural Gas Corporation (ONGC)',
      slug: 'ongc',
      industry: 'Energy & Natural Gas',
      description: 'Maharatna PSU energy corporation exploring and developing hydrocarbon assets across India.',
      headquarter: 'Dehradun, Uttarakhand',
      website: 'https://www.ongcindia.com',
    },
    {
      name: 'HDFC Bank',
      slug: 'hdfc-bank',
      industry: 'Banking & Fintech',
      description: 'India premier private bank pioneering digital banking, risk modeling, and microfinance.',
      headquarter: 'Mumbai, Maharashtra',
      website: 'https://www.hdfcbank.com',
    },
    {
      name: 'Mahindra & Mahindra',
      slug: 'mahindra',
      industry: 'Automotive & Farm Equipment',
      description: 'Multinational conglomerate leading in commercial electric vehicles and farm technology.',
      headquarter: 'Mumbai, Maharashtra',
      website: 'https://www.mahindra.com',
    },
    {
      name: 'Wipro Limited',
      slug: 'wipro',
      industry: 'Information Technology & Business Process',
      description: 'Global IT enterprise consulting, cognitive computing, and cybersecurity services provider.',
      headquarter: 'Bengaluru, Karnataka',
      website: 'https://www.wipro.com',
    },
    {
      name: 'NTPC Limited',
      slug: 'ntpc',
      industry: 'Power Generation & Renewable Energy',
      description: 'Largest power utility in India transitioning into solar, green hydrogen, and wind projects.',
      headquarter: 'New Delhi, Delhi',
      website: 'https://www.ntpc.co.in',
    },
    {
      name: 'Indian Oil Corporation Limited (IOCL)',
      slug: 'iocl',
      industry: 'Refining & Petrochemicals',
      description: 'Highest ranked Indian PSU on Fortune Global 500, managing refining, logistics, and retail.',
      headquarter: 'New Delhi, Delhi',
      website: 'https://www.iocl.com',
    },
    {
      name: 'Tata Motors',
      slug: 'tata-motors',
      industry: 'Automotive & EV Mobility',
      description: 'Pioneering India electric vehicle ecosystem, commercial vehicles, and automotive engineering.',
      headquarter: 'Pune, Maharashtra',
      website: 'https://www.tatamotors.com',
    },
    {
      name: 'Bharat Electronics Limited (BEL)',
      slug: 'bel',
      industry: 'Defense & Aerospace Electronics',
      description: 'Navratna defense PSU producing cutting-edge radars, avionics, and electronic voting systems.',
      headquarter: 'Bengaluru, Karnataka',
      website: 'https://www.bel-india.in',
    },
    {
      name: 'ITC Limited',
      slug: 'itc',
      industry: 'FMCG, Paperboards & Agri-Business',
      description: 'Exemplar in sustainable agriculture supply chain, smart manufacturing, and FMCG brands.',
      headquarter: 'Kolkata, West Bengal',
      website: 'https://www.itcportal.com',
    },
  ];

  const orgMap = new Map<string, string>();
  for (const org of organizationsData) {
    const created = await prisma.organization.create({ data: org });
    orgMap.set(org.slug, created.id);
  }
  console.log(`🏢 Seeded ${organizationsData.length} Organizations.`);

  // 5. Seed 50+ Realistically Crafted Internships for PM Internship Scheme
  const internshipsData = [
    {
      orgSlug: 'tcs',
      title: 'Associate Software Developer Intern',
      department: 'Cloud & AI Innovation Hub',
      domain: 'Software Development',
      description: 'Contribute to building enterprise-scale cloud microservices, modern REST APIs, and automated data pipelines under senior architects as part of the PM Internship Scheme.',
      responsibilities: 'Develop backend modules using Python and Node.js; collaborate on frontend dashboards using React; write unit tests and documentation.',
      location: 'Mumbai',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 25,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      reqSkills: ['Python', 'SQL', 'JavaScript'],
      prefSkills: ['React', 'Git', 'Docker'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'MCA', 'BCA', 'B.Sc'],
        allowedBranches: ['Computer Science', 'Information Technology', 'Computer Engineering', 'Electronics'],
        minCgpa: 6.5,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Python', 'SQL'],
      },
    },
    {
      orgSlug: 'tcs',
      title: 'AI & Data Science Trainee Intern',
      department: 'Advanced Analytics Lab',
      domain: 'Artificial Intelligence',
      description: 'Explore generative AI models, statistical exploratory data analysis, and predictive machine learning models for public sector digitalization.',
      responsibilities: 'Perform feature engineering on large tabular datasets; train baseline Scikit-Learn and PyTorch models; build visual insight dashboards.',
      location: 'Pune',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 15,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reqSkills: ['Python', 'Machine Learning', 'Data Analysis'],
      prefSkills: ['SQL', 'Docker', 'Git'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'MCA', 'M.Tech', 'B.Sc'],
        allowedBranches: ['Computer Science', 'Data Science', 'Information Technology', 'Mathematics', 'Statistics'],
        minCgpa: 7.0,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Python'],
      },
    },
    {
      orgSlug: 'larsen-toubro',
      title: 'Civil Construction & Infrastructure Intern',
      department: 'Transportation Infrastructure IC',
      domain: 'Civil Infrastructure',
      description: 'Hands-on site experience in expressway, metro rail, and high-speed corridor construction management, material quality testing, and project scheduling.',
      responsibilities: 'Support site engineers with quantity surveying; inspect rebar and concrete pour quality; update project milestone Gantt charts.',
      location: 'Ahmedabad',
      state: 'Gujarat',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 30,
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      reqSkills: ['AutoCAD', 'Problem Solving', 'Communication'],
      prefSkills: ['Advanced Excel'],
      eligibility: {
        minEducationLevel: 'DIPLOMA',
        allowedDegrees: ['B.Tech', 'B.E.', 'Diploma'],
        allowedBranches: ['Civil Engineering', 'Structural Engineering', 'Construction Technology'],
        minCgpa: 6.0,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['AutoCAD'],
      },
    },
    {
      orgSlug: 'bhel',
      title: 'Thermal & Power Equipment Engineering Intern',
      department: 'Turbine & Boiler Manufacturing Unit',
      domain: 'Mechanical Engineering',
      description: 'Assist in fabrication, dynamic balancing, and non-destructive testing of heavy steam turbines and boiler pressure parts in India leading PSU facility.',
      responsibilities: 'Participate in shop floor quality inspections; review 2D/3D CAD component drawings; analyze thermal stress simulation reports.',
      location: 'Bhopal',
      state: 'Madhya Pradesh',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 20,
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      reqSkills: ['AutoCAD', 'SolidWorks', 'Problem Solving'],
      prefSkills: ['ANSYS', 'CATIA'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'Diploma'],
        allowedBranches: ['Mechanical Engineering', 'Production Engineering', 'Industrial Engineering'],
        minCgpa: 6.5,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['AutoCAD'],
      },
    },
    {
      orgSlug: 'sbi',
      title: 'Digital Banking Operations & Fintech Trainee',
      department: 'YONO & Digital Channels Division',
      domain: 'Financial Services',
      description: 'Work with the digital payment product team to review user journey bottlenecks, assist in reconciliation algorithms, and audit digital transactions.',
      responsibilities: 'Perform daily clearing reconciliations; assist branch digital desk operations; document user test cases for YONO app updates.',
      location: 'Navi Mumbai',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 40,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      reqSkills: ['Advanced Excel', 'Communication', 'Financial Modeling'],
      prefSkills: ['SQL', 'Tally Prime'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Com', 'BBA', 'B.Sc', 'B.Tech', 'MBA'],
        allowedBranches: ['Commerce', 'Finance', 'Economics', 'Banking', 'Management', 'Computer Applications'],
        minCgpa: 6.0,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Advanced Excel'],
      },
    },
    {
      orgSlug: 'maruti-suzuki',
      title: 'Automotive Powertrain & EV Systems Intern',
      department: 'R&D Center & Prototyping Division',
      domain: 'Automotive Engineering',
      description: 'Gain hands-on testing experience on hybrid powertrain dynamometers, battery thermal management systems, and electronic vehicle controllers.',
      responsibilities: 'Collect telemetry sensor data during chassis dyno tests; calibrate electronic control unit parameters; document prototype build defects.',
      location: 'Gurugram',
      state: 'Haryana',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 18,
      deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
      reqSkills: ['MATLAB', 'Embedded Systems', 'AutoCAD'],
      prefSkills: ['SolidWorks', 'C++'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.'],
        allowedBranches: ['Automobile Engineering', 'Mechanical Engineering', 'Electrical Engineering', 'Mechatronics'],
        minCgpa: 6.5,
        minGraduationYear: 2024,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'reliance',
      title: 'Green Hydrogen & Clean Energy Projects Intern',
      department: 'New Energy Giga Complex',
      domain: 'Renewable Energy',
      description: 'Participate in setting up India largest solar giga-factory and electrolyzer manufacturing units in Jamnagar.',
      responsibilities: 'Assist process simulation engineers; monitor solar PV cell efficiency telemetry; prepare safety operational checklists.',
      location: 'Jamnagar',
      state: 'Gujarat',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 35,
      deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      reqSkills: ['Problem Solving', 'Data Analysis', 'Communication'],
      prefSkills: ['MATLAB', 'AutoCAD'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'B.Sc', 'M.Sc'],
        allowedBranches: ['Chemical Engineering', 'Electrical Engineering', 'Mechanical Engineering', 'Environmental Science'],
        minCgpa: 6.0,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'infosys',
      title: 'Full Stack Web & Cloud Application Intern',
      department: 'Enterprise Digital Platforms',
      domain: 'Software Development',
      description: 'Build user-centric progressive web apps with React, Node.js, and PostgreSQL for global enterprise clients.',
      responsibilities: 'Implement responsive UI components; integrate OAuth 2.0 authentication; write unit test suites using Jest.',
      location: 'Bengaluru',
      state: 'Karnataka',
      workMode: 'HYBRID',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 50,
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      reqSkills: ['React', 'JavaScript', 'Node.js'],
      prefSkills: ['TypeScript', 'SQL', 'Docker', 'Git'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'BCA', 'MCA'],
        allowedBranches: ['Computer Science', 'Information Technology', 'Software Engineering', 'Electronics'],
        minCgpa: 6.8,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['React', 'JavaScript'],
      },
    },
    {
      orgSlug: 'ongc',
      title: 'Offshore Exploration & Drilling Support Trainee',
      department: 'Western Offshore Operations',
      domain: 'Petroleum & Geosciences',
      description: 'Support petroleum geologists and drilling engineers in analyzing geological well-log data, mud logging, and offshore platform maintenance.',
      responsibilities: 'Process seismic exploration log sheets; assist in instrument calibration; maintain drilling hazard logs.',
      location: 'Mumbai',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 12,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reqSkills: ['Data Analysis', 'Problem Solving', 'Teamwork'],
      prefSkills: ['AutoCAD', 'Advanced Excel'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'M.Sc'],
        allowedBranches: ['Petroleum Engineering', 'Mechanical Engineering', 'Geology', 'Geophysics', 'Chemical'],
        minCgpa: 6.5,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'tata-motors',
      title: 'Commercial EV Body Design & Simulation Intern',
      department: 'Engineering Research Centre (ERC)',
      domain: 'Mechanical Engineering',
      description: 'Work with CAE crash simulation and structural durability engineers to design lightweight chassis for Tata Ace EV and electric buses.',
      responsibilities: 'Create parametric sheet metal assemblies in CATIA; run finite element meshes; document structural stiffness reports.',
      location: 'Pune',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 20,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      reqSkills: ['CATIA', 'SolidWorks', 'AutoCAD'],
      prefSkills: ['ANSYS', 'Problem Solving'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.'],
        allowedBranches: ['Mechanical Engineering', 'Automobile Engineering', 'Production'],
        minCgpa: 7.0,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['CATIA'],
      },
    },
    {
      orgSlug: 'bel',
      title: 'Defense Radar Signal Processing Intern',
      department: 'Radars & Weapon Systems Strategic Business Unit',
      domain: 'Embedded Systems',
      description: 'Develop and simulate FPGA and DSP algorithms for phased array radars and secure naval communication links under DRDO guidelines.',
      responsibilities: 'Write VHDL/Verilog modules; simulate DSP filters in MATLAB; test embedded boards using digital oscilloscopes.',
      location: 'Bengaluru',
      state: 'Karnataka',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 15,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      reqSkills: ['Embedded Systems', 'C++', 'MATLAB'],
      prefSkills: ['Python', 'Problem Solving'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.'],
        allowedBranches: ['Electronics and Communication', 'Electrical Engineering', 'Telecommunications', 'Instrumentation'],
        minCgpa: 7.2,
        minGraduationYear: 2024,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Embedded Systems'],
      },
    },
    {
      orgSlug: 'hdfc-bank',
      title: 'Credit Risk Modeling & Financial Analyst Intern',
      department: 'Retail Risk Analytics Wing',
      domain: 'Financial Services',
      description: 'Assist in building predictive default scorecards, loan loss provisioning calculations, and statistical risk reporting.',
      responsibilities: 'Clean transactional banking datasets; run logistic regression models in Python; prepare regulatory compliance summaries.',
      location: 'Mumbai',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 20,
      deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      reqSkills: ['Financial Modeling', 'SQL', 'Advanced Excel'],
      prefSkills: ['Python', 'Data Analysis'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Com', 'BBA', 'B.Tech', 'B.Sc', 'MBA'],
        allowedBranches: ['Finance', 'Economics', 'Statistics', 'Commerce', 'Mathematics', 'Computer Science'],
        minCgpa: 6.5,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Financial Modeling'],
      },
    },
    {
      orgSlug: 'itc',
      title: 'Agri-Business Supply Chain & Logistics Intern',
      department: 'e-Choupal Digital Agriculture Operations',
      domain: 'Supply Chain & Logistics',
      description: 'Work at the intersection of rural farmers, smart procurement hubs, and cold chain distribution for sustainable agriculture commodities.',
      responsibilities: 'Track truck dispatch turnaround times; analyze warehouse inventory shrinkage; assist farmers with e-Choupal digital app features.',
      location: 'Hyderabad',
      state: 'Telangana',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 30,
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      reqSkills: ['Supply Chain Management', 'Advanced Excel', 'Communication'],
      prefSkills: ['Logistics Optimization', 'Leadership'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Sc', 'B.Com', 'BBA', 'B.Tech'],
        allowedBranches: ['Agriculture', 'Commerce', 'Supply Chain', 'Logistics', 'Industrial Engineering', 'Business'],
        minCgpa: 6.0,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'ntpc',
      title: 'Electrical Substation & Grid Operations Intern',
      department: 'Regional Power Transmission Operations',
      domain: 'Electrical Engineering',
      description: 'Hands-on exposure to high voltage switchyards, SCADA grid synchronisation, and protective relay settings in 2000MW super thermal stations.',
      responsibilities: 'Perform routine battery bank impedance testing; assist in relay fault analysis; monitor real-time SCADA substation load dispatch.',
      location: 'Noida',
      state: 'Uttar Pradesh',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 25,
      deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
      reqSkills: ['SCADA', 'PLC Programming', 'Problem Solving'],
      prefSkills: ['MATLAB', 'AutoCAD'],
      eligibility: {
        minEducationLevel: 'DIPLOMA',
        allowedDegrees: ['B.Tech', 'B.E.', 'Diploma'],
        allowedBranches: ['Electrical Engineering', 'Electrical & Electronics', 'Power Systems', 'Instrumentation'],
        minCgpa: 6.2,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'wipro',
      title: 'Cloud Security & DevSecOps Trainee',
      department: 'Cyber Defense Center',
      domain: 'Cyber Security',
      description: 'Analyze security telemetry alerts, vulnerability scans, and CI/CD security gating for fortune clients.',
      responsibilities: 'Review static code security alerts; configure firewall and cloud identity rules; conduct vulnerability assessment tests.',
      location: 'Hyderabad',
      state: 'Telangana',
      workMode: 'REMOTE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 20,
      deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
      reqSkills: ['Cyber Security', 'Python', 'Git'],
      prefSkills: ['Docker', 'AWS', 'Linux'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'MCA', 'B.Sc'],
        allowedBranches: ['Computer Science', 'Cyber Security', 'Information Technology', 'Electronics'],
        minCgpa: 6.5,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Cyber Security'],
      },
    },
    {
      orgSlug: 'mahindra',
      title: 'Smart Factory IoT & Automation Trainee',
      department: 'Industry 4.0 Center of Excellence',
      domain: 'Manufacturing Technology',
      description: 'Integrate edge computing sensors, machine vision cameras, and robotic arms in automated automotive press and paint shops.',
      responsibilities: 'Wire and configure vibration IoT sensors; develop Python scripts for automated machine downtime alerts; calibrate optical inspection cameras.',
      location: 'Chakan, Pune',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 22,
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      reqSkills: ['PLC Programming', 'Python', 'Embedded Systems'],
      prefSkills: ['SCADA', 'AutoCAD'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'Diploma'],
        allowedBranches: ['Mechatronics', 'Mechanical Engineering', 'Electronics', 'Electrical', 'Instrumentation'],
        minCgpa: 6.5,
        minGraduationYear: 2024,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'iocl',
      title: 'Petrochemical Process Operations Trainee',
      department: 'Refinery Process Optimization Division',
      domain: 'Chemical Engineering',
      description: 'Gain industrial understanding of fluid catalytic cracking units (FCCU), hydrogen generation plants, and refinery energy efficiency.',
      responsibilities: 'Monitor distributed control system (DCS) displays; inspect distillation tray samples; verify valve alignment before scheduled shutdowns.',
      location: 'Panipat',
      state: 'Haryana',
      workMode: 'ONSITE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 25,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      reqSkills: ['Problem Solving', 'Data Analysis', 'Teamwork'],
      prefSkills: ['Advanced Excel', 'Communication'],
      eligibility: {
        minEducationLevel: 'DIPLOMA',
        allowedDegrees: ['B.Tech', 'B.E.', 'Diploma'],
        allowedBranches: ['Chemical Engineering', 'Petrochemical', 'Mechanical Engineering'],
        minCgpa: 6.0,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    },
    {
      orgSlug: 'tcs',
      title: 'UI/UX Design & User Experience Intern',
      department: 'Digital Experience Studio',
      domain: 'Design & Human-Computer Interaction',
      description: 'Craft intuitive interfaces, design systems, wireframes, and interactive prototypes for citizen-centric digital portals.',
      responsibilities: 'Conduct user usability interviews; construct interactive Figma prototypes; produce design tokens and WCAG accessible UI assets.',
      location: 'Bengaluru',
      state: 'Karnataka',
      workMode: 'REMOTE',
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 15,
      deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
      reqSkills: ['UI/UX Design', 'Figma', 'Communication'],
      prefSkills: ['React', 'HTML', 'CSS'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Des', 'B.Tech', 'B.Sc', 'BCA', 'B.A.'],
        allowedBranches: ['Design', 'Computer Science', 'Media', 'Arts', 'Information Technology'],
        minCgpa: 6.0,
        minGraduationYear: 2023,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: ['Figma'],
      },
    },
  ];

  // Populate remaining internships programmatically to exceed 50+ total internships
  const domainsList = [
    { domain: 'Software Development', org: 'infosys', city: 'Pune', state: 'Maharashtra', mode: 'HYBRID', title: 'Full Stack Engineer Intern' },
    { domain: 'Mechanical Engineering', org: 'maruti-suzuki', city: 'Gurugram', state: 'Haryana', mode: 'ONSITE', title: 'Manufacturing Automation Trainee' },
    { domain: 'Civil Infrastructure', org: 'larsen-toubro', city: 'Mumbai', state: 'Maharashtra', mode: 'ONSITE', title: 'Bridge & Tunnel Construction Trainee' },
    { domain: 'Financial Services', org: 'sbi', city: 'New Delhi', state: 'Delhi', mode: 'ONSITE', title: 'Microfinance & Rural Lending Intern' },
    { domain: 'Artificial Intelligence', org: 'wipro', city: 'Bengaluru', state: 'Karnataka', mode: 'REMOTE', title: 'Computer Vision & NLP Research Intern' },
    { domain: 'Supply Chain & Logistics', org: 'itc', city: 'Kolkata', state: 'West Bengal', mode: 'ONSITE', title: 'Warehouse Logistics & Fleet Trainee' },
    { domain: 'Electrical Engineering', org: 'bhel', city: 'Haridwar', state: 'Uttarakhand', mode: 'ONSITE', title: 'Heavy Electrical Generator Testing Trainee' },
    { domain: 'Automotive Engineering', org: 'tata-motors', city: 'Jamshedpur', state: 'Jharkhand', mode: 'ONSITE', title: 'Heavy Commercial Vehicle Assembly Trainee' },
    { domain: 'Renewable Energy', org: 'ntpc', city: 'Ranchi', state: 'Jharkhand', mode: 'ONSITE', title: 'Solar Photovoltaic Maintenance Intern' },
    { domain: 'Cyber Security', org: 'tcs', city: 'Chennai', state: 'Tamil Nadu', mode: 'REMOTE', title: 'SOC Incident Response Analyst Intern' },
    { domain: 'Software Development', org: 'reliance', city: 'Navi Mumbai', state: 'Maharashtra', mode: 'ONSITE', title: 'Jio 5G Network Automation Intern' },
    { domain: 'Financial Services', org: 'hdfc-bank', city: 'Chennai', state: 'Tamil Nadu', mode: 'ONSITE', title: 'Treasury & Forex Operations Intern' },
    { domain: 'Chemical Engineering', org: 'ongc', city: 'Mehsana', state: 'Gujarat', mode: 'ONSITE', title: 'Wellhead Natural Gas Processing Intern' },
    { domain: 'Civil Infrastructure', org: 'larsen-toubro', city: 'Chennai', state: 'Tamil Nadu', mode: 'ONSITE', title: 'Coastal Road Project Site Intern' },
    { domain: 'Mechanical Engineering', org: 'bhel', city: 'Trichy', state: 'Tamil Nadu', mode: 'ONSITE', title: 'Boiler Fabrication & Welding Engineering Intern' },
    { domain: 'Software Development', org: 'infosys', city: 'Mysuru', state: 'Karnataka', mode: 'ONSITE', title: 'Core Java Enterprise Systems Intern' },
    { domain: 'Embedded Systems', org: 'bel', city: 'Hyderabad', state: 'Telangana', mode: 'ONSITE', title: 'Missile Electronic Subsystems Trainee' },
    { domain: 'Manufacturing Technology', org: 'mahindra', city: 'Zaheerabad', state: 'Telangana', mode: 'ONSITE', title: 'Tractor Assembly Quality Assurance Intern' },
    { domain: 'Supply Chain & Logistics', org: 'reliance', city: 'Bengaluru', state: 'Karnataka', mode: 'HYBRID', title: 'Retail E-Commerce Distribution Intern' },
    { domain: 'Artificial Intelligence', org: 'tcs', city: 'Kolkata', state: 'West Bengal', mode: 'REMOTE', title: 'Analytics & Business Intelligence Intern' },
    { domain: 'Electrical Engineering', org: 'ntpc', city: 'Ramagundam', state: 'Telangana', mode: 'ONSITE', title: 'Thermal Power Plant Instrumentation Intern' },
    { domain: 'Automotive Engineering', org: 'maruti-suzuki', city: 'Ahmedabad', state: 'Gujarat', mode: 'ONSITE', title: 'Press Shop & Stamping Engineering Intern' },
    { domain: 'Financial Services', org: 'sbi', city: 'Kolkata', state: 'West Bengal', mode: 'ONSITE', title: 'Commercial Credit Appraisal Intern' },
    { domain: 'Civil Infrastructure', org: 'larsen-toubro', city: 'Noida', state: 'Uttar Pradesh', mode: 'ONSITE', title: 'Smart City Water Supply Pipeline Trainee' },
    { domain: 'Software Development', org: 'wipro', city: 'Pune', state: 'Maharashtra', mode: 'HYBRID', title: 'Cloud DevOps & SRE Intern' },
    { domain: 'Petroleum & Geosciences', org: 'iocl', city: 'Guwahati', state: 'Assam', mode: 'ONSITE', title: 'Refinery Pipeline Corrosion Control Trainee' },
    { domain: 'Mechanical Engineering', org: 'tata-motors', city: 'Pantnagar', state: 'Uttarakhand', mode: 'ONSITE', title: 'Engine Dyno & Emission Testing Intern' },
    { domain: 'Renewable Energy', org: 'reliance', city: 'Nagpur', state: 'Maharashtra', mode: 'ONSITE', title: 'Grid-scale Battery Storage System Trainee' },
    { domain: 'Supply Chain & Logistics', org: 'itc', city: 'Pune', state: 'Maharashtra', mode: 'ONSITE', title: 'Integrated Cold Chain Operations Intern' },
    { domain: 'Software Development', org: 'tcs', city: 'Hyderabad', state: 'Telangana', mode: 'REMOTE', title: 'Mobile App Developer Intern (Flutter/React Native)' },
    { domain: 'Financial Services', org: 'hdfc-bank', city: 'Bengaluru', state: 'Karnataka', mode: 'ONSITE', title: 'SME Lending & Business Banking Trainee' },
    { domain: 'Civil Infrastructure', org: 'larsen-toubro', city: 'Kochi', state: 'Kerala', mode: 'ONSITE', title: 'Port Marine Structures Engineering Trainee' },
    { domain: 'Mechanical Engineering', org: 'bhel', city: 'Ranipet', state: 'Tamil Nadu', mode: 'ONSITE', title: 'Electrostatic Precipitator Design Intern' },
    { domain: 'Electrical Engineering', org: 'bel', city: 'Pune', state: 'Maharashtra', mode: 'ONSITE', title: 'Opto-Electronics & Thermal Imaging Trainee' },
  ];

  for (let i = 0; i < domainsList.length; i++) {
    const item = domainsList[i];
    internshipsData.push({
      orgSlug: item.org,
      title: item.title,
      department: 'Operations & Engineering Team',
      domain: item.domain,
      description: `Comprehensive 12-month professional internship under the Government of India's PM Internship Scheme at ${item.city}. Candidates receive mentoring, industry exposure, and skill certification.`,
      responsibilities: `Participate in day-to-day functional operations, collaborate with senior team leads, maintain technical logbooks, and prepare project progress reports.`,
      location: item.city,
      state: item.state,
      workMode: item.mode,
      durationMonths: 12,
      stipendAmount: 5000,
      openings: 10 + (i % 15),
      deadline: new Date(Date.now() + (20 + (i % 45)) * 24 * 60 * 60 * 1000),
      reqSkills: ['Communication', 'Problem Solving', 'Teamwork'],
      prefSkills: ['Advanced Excel'],
      eligibility: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: ['B.Tech', 'B.E.', 'B.Sc', 'B.Com', 'Diploma'],
        allowedBranches: ['All'],
        minCgpa: 6.0,
        minGraduationYear: 2023,
        maxGraduationYear: 2027,
        minAge: 21,
        maxAge: 24,
        allowedStates: ['All'],
        mandatorySkillNames: [],
      },
    });
  }

  const seededInternships = [];
  for (const item of internshipsData) {
    const orgId = orgMap.get(item.orgSlug) || (Array.from(orgMap.values())[0] as string);
    const slug = (item.title + '-' + item.location + '-' + Math.random().toString(36).slice(2, 6))
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-');

    const createdInternship = await prisma.internship.create({
      data: {
        organizationId: orgId,
        title: item.title,
        slug,
        department: item.department,
        domain: item.domain,
        description: item.description,
        responsibilities: item.responsibilities,
        location: item.location,
        state: item.state,
        workMode: item.workMode as any,
        durationMonths: item.durationMonths,
        stipendAmount: item.stipendAmount,
        openings: item.openings,
        deadline: item.deadline,
        status: 'PUBLISHED',
      },
    });

    // Attach required & preferred skills
    for (const skName of item.reqSkills) {
      const skId = skillMap.get(skName);
      if (skId) {
        await prisma.internshipSkill.create({
          data: {
            internshipId: createdInternship.id,
            skillId: skId,
            isRequired: true,
            weight: 1.0,
          },
        });
      }
    }

    for (const skName of item.prefSkills) {
      const skId = skillMap.get(skName);
      if (skId) {
        await prisma.internshipSkill.upsert({
          where: {
            internshipId_skillId: {
              internshipId: createdInternship.id,
              skillId: skId,
            },
          },
          update: {},
          create: {
            internshipId: createdInternship.id,
            skillId: skId,
            isRequired: false,
            weight: 0.6,
          },
        });
      }
    }

    // Attach eligibility rule
    await prisma.eligibilityRule.create({
      data: {
        internshipId: createdInternship.id,
        minEducationLevel: item.eligibility.minEducationLevel as any,
        allowedDegrees: JSON.stringify(item.eligibility.allowedDegrees),
        allowedBranches: JSON.stringify(item.eligibility.allowedBranches),
        minCgpa: item.eligibility.minCgpa,
        minGraduationYear: item.eligibility.minGraduationYear,
        maxGraduationYear: item.eligibility.maxGraduationYear,
        minAge: item.eligibility.minAge,
        maxAge: item.eligibility.maxAge,
        allowedStates: JSON.stringify(item.eligibility.allowedStates),
        mandatorySkillNames: JSON.stringify(item.eligibility.mandatorySkillNames),
      },
    });

    seededInternships.push(createdInternship);
  }
  console.log(`🎯 Seeded ${seededInternships.length} Internships across all domains.`);

  // 6. Create Demo Student Profile (Aarav Sharma)
  const demoStudentUser = await prisma.user.create({
    data: {
      email: 'student@pminternship.gov.in',
      passwordHash: studentPasswordHash,
      role: 'STUDENT',
      firstName: 'Aarav',
      lastName: 'Sharma',
      phone: '+919876543210',
      studentProfile: {
        create: {
          dateOfBirth: new Date('2003-04-15'),
          gender: 'Male',
          category: 'General',
          state: 'Maharashtra',
          city: 'Mumbai',
          district: 'Mumbai Suburban',
          pinCode: '400076',
          bio: 'Final year Computer Engineering student passionate about backend distributed systems, modern React frontends, and AI applications.',
          careerGoal: 'Become a Full Stack Software Engineer contributing to impactful high-scale national platforms.',
          preferredLocations: JSON.stringify(['Mumbai', 'Pune', 'Bengaluru']),
          preferredDomains: JSON.stringify(['Software Development', 'Artificial Intelligence', 'Cyber Security']),
          remotePreference: 'HYBRID',
          profileCompletionPercentage: 90,
          educations: {
            create: [
              {
                level: 'UNDERGRADUATE',
                degree: 'B.Tech',
                branch: 'Computer Engineering',
                institute: 'Veermata Jijabai Technological Institute (VJTI)',
                boardOrUniversity: 'University of Mumbai',
                startYear: 2022,
                graduationYear: 2026,
                cgpaOrPercentage: 8.8,
                maxScale: 10.0,
                isCompleted: false,
              },
            ],
          },
          projects: {
            create: [
              {
                title: 'Smart City Citizen Grievance Portal',
                description: 'Full stack responsive portal allowing citizens to file grievances with automatic geo-tagging and department routing.',
                technologies: 'React, Node.js, Express, PostgreSQL, Tailwind CSS',
                role: 'Lead Full Stack Developer',
                githubUrl: 'https://github.com/example/smart-city-portal',
              },
              {
                title: 'AI Resume Keyword Matcher',
                description: 'Python application utilizing TF-IDF cosine similarity and spaCy to analyze job descriptions against applicant resumes.',
                technologies: 'Python, Scikit-Learn, Pandas, FastAPI',
                role: 'AI/ML Developer',
                githubUrl: 'https://github.com/example/ai-resume-matcher',
              },
            ],
          },
          experiences: {
            create: [
              {
                title: 'Web Development Trainee',
                company: 'Tech Mahindra Smart Academy',
                location: 'Mumbai',
                experienceType: 'INTERNSHIP',
                startDate: new Date('2024-06-01'),
                endDate: new Date('2024-08-31'),
                isCurrent: false,
                description: 'Assisted in developing reusable React UI components and optimizing SQL queries for reporting.',
              },
            ],
          },
          studentSkills: {
            create: [
              { skillId: skillMap.get('Python')!, proficiencyLevel: 'ADVANCED' },
              { skillId: skillMap.get('JavaScript')!, proficiencyLevel: 'ADVANCED' },
              { skillId: skillMap.get('React')!, proficiencyLevel: 'INTERMEDIATE' },
              { skillId: skillMap.get('SQL')!, proficiencyLevel: 'ADVANCED' },
              { skillId: skillMap.get('Node.js')!, proficiencyLevel: 'INTERMEDIATE' },
              { skillId: skillMap.get('Git')!, proficiencyLevel: 'INTERMEDIATE' },
              { skillId: skillMap.get('Machine Learning')!, proficiencyLevel: 'BEGINNER' },
            ],
          },
        },
      },
    },
    include: { studentProfile: true },
  });
  console.log(`🎓 Created Primary Demo Student: ${demoStudentUser.email}`);

  // 7. Seed 31+ Additional Diverse Student Candidates across India
  const indianStudents = [
    { name: 'Priya Patel', email: 'priya.patel@example.com', degree: 'B.Tech', branch: 'Computer Science', institute: 'IIT Bombay', state: 'Gujarat', city: 'Ahmedabad', cgpa: 9.1, skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL', 'Git'] },
    { name: 'Rohan Deshmukh', email: 'rohan.deshmukh@example.com', degree: 'B.Tech', branch: 'Mechanical Engineering', institute: 'COEP Technological University', state: 'Maharashtra', city: 'Pune', cgpa: 8.4, skills: ['AutoCAD', 'SolidWorks', 'ANSYS', 'Problem Solving'] },
    { name: 'Ananya Iyer', email: 'ananya.iyer@example.com', degree: 'B.Com', branch: 'Commerce & Accounting', institute: 'Shri Ram College of Commerce (SRCC)', state: 'Delhi', city: 'New Delhi', cgpa: 8.9, skills: ['Financial Modeling', 'Advanced Excel', 'Tally Prime', 'Cost Accounting'] },
    { name: 'Vikram Singh', email: 'vikram.singh@example.com', degree: 'B.Tech', branch: 'Civil Engineering', institute: 'NIT Trichy', state: 'Tamil Nadu', city: 'Tiruchirappalli', cgpa: 7.9, skills: ['AutoCAD', 'Problem Solving', 'Communication'] },
    { name: 'Sneha Kulkarni', email: 'sneha.kulkarni@example.com', degree: 'B.Tech', branch: 'Electronics and Communication', institute: 'VJTI Mumbai', state: 'Maharashtra', city: 'Mumbai', cgpa: 8.6, skills: ['Embedded Systems', 'C++', 'MATLAB', 'Python'] },
    { name: 'Mohammed Farhan', email: 'farhan.m@example.com', degree: 'MCA', branch: 'Computer Applications', institute: 'Osmania University', state: 'Telangana', city: 'Hyderabad', cgpa: 8.1, skills: ['React', 'JavaScript', 'Node.js', 'SQL', 'Git'] },
    { name: 'Kavita Nair', email: 'kavita.nair@example.com', degree: 'B.Sc', branch: 'Data Science', institute: 'Loyola College Chennai', state: 'Tamil Nadu', city: 'Chennai', cgpa: 8.7, skills: ['Python', 'SQL', 'Data Analysis', 'Machine Learning'] },
    { name: 'Aditya Verma', email: 'aditya.verma@example.com', degree: 'B.Tech', branch: 'Electrical Engineering', institute: 'IIT Roorkee', state: 'Uttarakhand', city: 'Roorkee', cgpa: 8.3, skills: ['SCADA', 'PLC Programming', 'MATLAB', 'Problem Solving'] },
    { name: 'Meera Sen', email: 'meera.sen@example.com', degree: 'BBA', branch: 'Supply Chain & Logistics', institute: 'St. Xavier College', state: 'West Bengal', city: 'Kolkata', cgpa: 8.0, skills: ['Supply Chain Management', 'Advanced Excel', 'Communication', 'Leadership'] },
    { name: 'Arjun Reddy', email: 'arjun.reddy@example.com', degree: 'B.Tech', branch: 'Automobile Engineering', institute: 'PSG College of Technology', state: 'Tamil Nadu', city: 'Coimbatore', cgpa: 7.8, skills: ['CATIA', 'SolidWorks', 'AutoCAD', 'MATLAB'] },
    { name: 'Deepika Joshi', email: 'deepika.joshi@example.com', degree: 'BCA', branch: 'Computer Applications', institute: 'Christ University', state: 'Karnataka', city: 'Bengaluru', cgpa: 8.5, skills: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'] },
    { name: 'Gaurav Bhatt', email: 'gaurav.bhatt@example.com', degree: 'Diploma', branch: 'Mechanical Engineering', institute: 'Government Polytechnic Mumbai', state: 'Maharashtra', city: 'Mumbai', cgpa: 8.2, skills: ['AutoCAD', 'SolidWorks', 'Teamwork'] },
    { name: 'Nisha Gupta', email: 'nisha.gupta@example.com', degree: 'B.Tech', branch: 'Information Technology', institute: 'Delhi Technological University (DTU)', state: 'Delhi', city: 'New Delhi', cgpa: 8.9, skills: ['Python', 'React', 'Cyber Security', 'Git'] },
    { name: 'Harish Choudhary', email: 'harish.c@example.com', degree: 'B.Sc', branch: 'Agriculture', institute: 'GB Pant University of Agriculture', state: 'Uttarakhand', city: 'Pantnagar', cgpa: 7.6, skills: ['Supply Chain Management', 'Communication', 'Teamwork'] },
    { name: 'Pooja Hegde', email: 'pooja.hegde@example.com', degree: 'B.Tech', branch: 'Computer Science', institute: 'PES University', state: 'Karnataka', city: 'Bengaluru', cgpa: 9.0, skills: ['React', 'TypeScript', 'Node.js', 'Docker', 'AWS'] },
    { name: 'Siddharth Rao', email: 'siddharth.rao@example.com', degree: 'B.Com', branch: 'Banking and Finance', institute: 'Narsee Monjee College', state: 'Maharashtra', city: 'Mumbai', cgpa: 8.3, skills: ['Financial Modeling', 'Advanced Excel', 'Tally Prime'] },
    { name: 'Tarun Sharma', email: 'tarun.sharma@example.com', degree: 'B.Tech', branch: 'Chemical Engineering', institute: 'NIT Warangal', state: 'Telangana', city: 'Warangal', cgpa: 8.0, skills: ['Data Analysis', 'Problem Solving', 'Teamwork'] },
    { name: 'Ishita Banerjee', email: 'ishita.banerjee@example.com', degree: 'B.Des', branch: 'User Experience Design', institute: 'National Institute of Design (NID)', state: 'Gujarat', city: 'Ahmedabad', cgpa: 9.2, skills: ['UI/UX Design', 'Figma', 'Communication'] },
    { name: 'Manish Kumar', email: 'manish.kumar@example.com', degree: 'Diploma', branch: 'Civil Engineering', institute: 'Government Polytechnic Patna', state: 'Bihar', city: 'Patna', cgpa: 7.5, skills: ['AutoCAD', 'Problem Solving'] },
    { name: 'Bhavna Rathore', email: 'bhavna.rathore@example.com', degree: 'B.Tech', branch: 'Information Technology', institute: 'MNIT Jaipur', state: 'Rajasthan', city: 'Jaipur', cgpa: 8.4, skills: ['Python', 'SQL', 'JavaScript', 'Git'] },
    { name: 'Karthik Sundaram', email: 'karthik.s@example.com', degree: 'B.Tech', branch: 'Mechanical Engineering', institute: 'Anna University', state: 'Tamil Nadu', city: 'Chennai', cgpa: 8.7, skills: ['SolidWorks', 'ANSYS', 'AutoCAD'] },
    { name: 'Swati Tiwari', email: 'swati.tiwari@example.com', degree: 'MBA', branch: 'Human Resources', institute: 'Symbiosis Institute of Business Management', state: 'Maharashtra', city: 'Pune', cgpa: 8.2, skills: ['Communication', 'Leadership', 'Teamwork'] },
    { name: 'Amit Saxena', email: 'amit.saxena@example.com', degree: 'B.Tech', branch: 'Computer Science', institute: 'IIIT Hyderabad', state: 'Telangana', city: 'Hyderabad', cgpa: 9.3, skills: ['Python', 'C++', 'Machine Learning', 'Docker', 'Git'] },
    { name: 'Ritu Chauhan', email: 'ritu.chauhan@example.com', degree: 'B.Sc', branch: 'Mathematics', institute: 'Miranda House', state: 'Delhi', city: 'New Delhi', cgpa: 8.8, skills: ['Data Analysis', 'Python', 'Advanced Excel'] },
    { name: 'Sanjay Mishra', email: 'sanjay.mishra@example.com', degree: 'B.Tech', branch: 'Electrical Engineering', institute: 'MNNIT Allahabad', state: 'Uttar Pradesh', city: 'Prayagraj', cgpa: 7.9, skills: ['PLC Programming', 'SCADA', 'MATLAB'] },
    { name: 'Divya Pillai', email: 'divya.pillai@example.com', degree: 'B.Tech', branch: 'Biotechnology', institute: 'Amrita Vishwa Vidyapeetham', state: 'Kerala', city: 'Kollam', cgpa: 8.5, skills: ['Data Analysis', 'Python', 'Problem Solving'] },
    { name: 'Abhishek Pandey', email: 'abhishek.pandey@example.com', degree: 'B.Com', branch: 'Finance', institute: 'Banaras Hindu University (BHU)', state: 'Uttar Pradesh', city: 'Varanasi', cgpa: 8.1, skills: ['Financial Modeling', 'Tally Prime', 'Advanced Excel'] },
    { name: 'Komal Aggarwal', email: 'komal.aggarwal@example.com', degree: 'BCA', branch: 'Computer Applications', institute: 'Panjab University', state: 'Punjab', city: 'Chandigarh', cgpa: 8.3, skills: ['JavaScript', 'SQL', 'React', 'HTML', 'CSS'] },
    { name: 'Naveen Reddy', email: 'naveen.reddy@example.com', degree: 'B.Tech', branch: 'Mechatronics', institute: 'Manipal Institute of Technology', state: 'Karnataka', city: 'Manipal', cgpa: 8.4, skills: ['Embedded Systems', 'PLC Programming', 'Python', 'SolidWorks'] },
    { name: 'Pallavi More', email: 'pallavi.more@example.com', degree: 'B.Tech', branch: 'Civil Engineering', institute: 'Walchand College of Engineering', state: 'Maharashtra', city: 'Sangli', cgpa: 8.2, skills: ['AutoCAD', 'Problem Solving', 'Teamwork'] },
    { name: 'Yashwardhan Mehta', email: 'yash.mehta@example.com', degree: 'B.Tech', branch: 'Computer Science', institute: 'BITS Pilani', state: 'Rajasthan', city: 'Pilani', cgpa: 9.4, skills: ['Python', 'TypeScript', 'React', 'Node.js', 'Docker', 'Kubernetes'] },
  ];

  for (const st of indianStudents) {
    const names = st.name.split(' ');
    const user = await prisma.user.create({
      data: {
        email: st.email,
        passwordHash: studentPasswordHash,
        role: 'STUDENT',
        firstName: names[0],
        lastName: names[1] || 'Kumar',
        phone: '+91' + Math.floor(6000000000 + Math.random() * 3999999999).toString(),
        studentProfile: {
          create: {
            dateOfBirth: new Date(2002 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 12), 10),
            gender: Math.random() > 0.5 ? 'Female' : 'Male',
            state: st.state,
            city: st.city,
            careerGoal: `Excel as a leading specialist in ${st.branch} and modern digital practices.`,
            preferredLocations: JSON.stringify([st.city, 'Mumbai', 'Bengaluru']),
            preferredDomains: JSON.stringify([st.branch.includes('Computer') ? 'Software Development' : st.branch]),
            remotePreference: 'HYBRID',
            profileCompletionPercentage: 85,
            educations: {
              create: [
                {
                  level: st.degree === 'Diploma' ? 'DIPLOMA' : st.degree === 'MCA' || st.degree === 'MBA' ? 'POSTGRADUATE' : 'UNDERGRADUATE',
                  degree: st.degree,
                  branch: st.branch,
                  institute: st.institute,
                  startYear: 2022,
                  graduationYear: 2026,
                  cgpaOrPercentage: st.cgpa,
                  maxScale: 10.0,
                },
              ],
            },
            studentSkills: {
              create: Array.from(new Set(st.skills.map((sk) => skillMap.get(sk)).filter(Boolean) as string[])).map((skId) => ({
                skillId: skId,
                proficiencyLevel: 'INTERMEDIATE',
              })),
            },
          },
        },
      },
      include: { studentProfile: true },
    });

    // Create a sample application for each student
    const randomInternship = seededInternships[Math.floor(Math.random() * seededInternships.length)];
    const statusOptions = ['APPLIED', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];

    await prisma.application.create({
      data: {
        studentId: user.studentProfile!.id,
        internshipId: randomInternship.id,
        status: randomStatus as any,
        matchScoreAtApplication: 75 + Math.floor(Math.random() * 22),
        coverLetter: `I am thrilled to apply for the ${randomInternship.title} position under the PM Internship Scheme. My academic background and technical projects align directly with this opportunity.`,
      },
    });
  }
  console.log(`🧑‍🎓 Seeded ${indianStudents.length} Diverse Students with applications.`);

  // 8. Generate recommendations for the demo student (Aarav)
  const demoProfile = demoStudentUser.studentProfile!;
  const topInternshipsForAarav = seededInternships.slice(0, 8);

  for (let idx = 0; idx < topInternshipsForAarav.length; idx++) {
    const intern = topInternshipsForAarav[idx];
    const score = 94 - idx * 4;
    const rec = await prisma.recommendation.create({
      data: {
        studentId: demoProfile.id,
        internshipId: intern.id,
        compatibilityScore: score,
        eligibilityStatus: 'ELIGIBLE',
        skillScore: score - 2,
        educationScore: 95,
        domainScore: 100,
        locationScore: 90,
        experienceScore: 85,
        careerGoalScore: 92,
        preferenceScore: 100,
        matchedSkills: JSON.stringify(['Python', 'SQL', 'JavaScript', 'React']),
        missingSkills: JSON.stringify(['Docker']),
        reasons: JSON.stringify([
          '✓ Your Python and SQL skills directly match mandatory prerequisites.',
          '✓ Your Computer Engineering degree from VJTI meets academic criteria.',
          '✓ Mumbai/Pune location directly matches your location preference.',
          '△ Familiarizing yourself with Docker will strengthen deployment skills.',
        ]),
        engineMode: 'LOCAL_ML',
      },
    });

    await prisma.recommendationReason.createMany({
      data: [
        { recommendationId: rec.id, factor: 'SKILL', explanation: 'Strong match on required core languages', impactScore: 28 },
        { recommendationId: rec.id, factor: 'EDUCATION', explanation: 'Direct degree discipline alignment', impactScore: 20 },
        { recommendationId: rec.id, factor: 'DOMAIN', explanation: 'Software engineering domain interest match', impactScore: 15 },
        { recommendationId: rec.id, factor: 'LOCATION', explanation: 'Maharashtra resident and preferred city match', impactScore: 10 },
      ],
    });

    if (idx === 0) {
      // Save the top 1
      await prisma.savedInternship.create({
        data: {
          studentId: demoProfile.id,
          internshipId: intern.id,
        },
      });

      // Apply to top 1
      await prisma.application.create({
        data: {
          studentId: demoProfile.id,
          internshipId: intern.id,
          status: 'UNDER_REVIEW',
          matchScoreAtApplication: 94,
          coverLetter: 'I am excited to submit my candidacy for this prestigious internship role through the PM Internship Scheme.',
        },
      });

      // Add feedback
      await prisma.feedback.create({
        data: {
          recommendationId: rec.id,
          studentId: demoProfile.id,
          rating: 5,
          isRelevant: true,
          comment: 'Extremely accurate recommendation! Directly matches my skills and location preference.',
        },
      });
    }
  }

  // Add welcome notification for demo student
  await prisma.notification.create({
    data: {
      userId: demoStudentUser.id,
      title: 'Welcome to PM Internship Scheme',
      message: 'Your profile has been activated. We have calculated initial recommendations matching your education and skills.',
      type: 'RECOMMENDATION',
      link: '/student/recommendations',
    },
  });

  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
  console.log('-------------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('Admin:   admin@pminternship.gov.in   / Admin@12345');
  console.log('Student: student@pminternship.gov.in / Student@12345');
  console.log('-------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
