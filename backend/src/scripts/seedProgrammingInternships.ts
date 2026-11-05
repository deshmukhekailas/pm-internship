import prisma from '../config/db';

async function main() {
  console.log('🚀 Starting ingestion of Programming & Software Internships (Python, C, C++, Java, JavaScript, HTML, CSS, React, etc.)...');

  // 1. Ensure all requested software & web skills exist in DB
  const programmingSkills = [
    { name: 'Python', category: 'TECHNICAL' },
    { name: 'C', category: 'TECHNICAL' },
    { name: 'C++', category: 'TECHNICAL' },
    { name: 'Java', category: 'TECHNICAL' },
    { name: 'JavaScript', category: 'TECHNICAL' },
    { name: 'TypeScript', category: 'TECHNICAL' },
    { name: 'HTML', category: 'TECHNICAL' },
    { name: 'CSS', category: 'TECHNICAL' },
    { name: 'React', category: 'TECHNICAL' },
    { name: 'Node.js', category: 'TECHNICAL' },
    { name: 'Express', category: 'TECHNICAL' },
    { name: 'SQL', category: 'TECHNICAL' },
    { name: 'PostgreSQL', category: 'TECHNICAL' },
    { name: 'MongoDB', category: 'TECHNICAL' },
    { name: 'REST APIs', category: 'TECHNICAL' },
    { name: 'Tailwind CSS', category: 'TOOL' },
    { name: 'Docker', category: 'TOOL' },
    { name: 'Git', category: 'TOOL' },
    { name: 'Linux', category: 'TOOL' },
    { name: 'Machine Learning', category: 'TECHNICAL' },
    { name: 'Data Analysis', category: 'TECHNICAL' },
    { name: 'Cyber Security', category: 'TECHNICAL' },
    { name: 'Embedded Systems', category: 'TECHNICAL' },
    { name: 'Microcontrollers', category: 'TECHNICAL' },
    { name: 'Quality Assurance', category: 'TECHNICAL' },
  ];

  const skillMap = new Map<string, string>();
  for (const s of programmingSkills) {
    const existing = await prisma.skill.findUnique({ where: { name: s.name } });
    if (existing) {
      skillMap.set(s.name, existing.id);
    } else {
      const created = await prisma.skill.create({
        data: {
          name: s.name,
          standardizedName: s.name.toLowerCase().trim(),
          category: s.category,
        },
      });
      skillMap.set(s.name, created.id);
    }
  }
  console.log(`✓ Programming Skills synchronized (${skillMap.size} available).`);

  // 2. Fetch Organizations Map
  const orgs = await prisma.organization.findMany({
    select: { id: true, slug: true },
  });
  const orgMap = new Map<string, string>();
  for (const o of orgs) {
    orgMap.set(o.slug, o.id);
  }

  // 3. Define 20 Programming Internships targeting Python, C, C++, Java, JavaScript, HTML, CSS, React
  const deadlineDate = new Date(Date.now() + 75 * 24 * 60 * 60 * 1000); // +75 days
  const startDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000); // +90 days

  const softwareInternships = [
    {
      orgSlug: 'infosys',
      title: 'Frontend Web Developer Trainee (React, HTML5, CSS3, JavaScript)',
      slug: 'infosys-frontend-react-html-css-intern',
      department: 'Digital Experience & Web Applications Unit',
      domain: 'Software Development',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'HYBRID',
      openings: 35,
      description: 'Build modern, responsive, and accessible user interfaces using React, JavaScript (ES6+), semantic HTML5, and responsive CSS3 layouts.',
      responsibilities: 'Translate Figma UI wireframes into reusable React components, manage application state, ensure cross-browser responsiveness, and optimize web asset rendering.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Applications'],
      minCgpa: 6.0,
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    },
    {
      orgSlug: 'tcs',
      title: 'Full Stack Web Engineering Intern (React, Node.js, HTML, CSS, JavaScript)',
      slug: 'tcs-fullstack-mern-web-intern',
      department: 'Enterprise Application Services',
      domain: 'Software Development',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      openings: 40,
      description: 'Design and implement full stack web applications integrating interactive React frontends (HTML5, CSS3) with Express/Node.js REST APIs.',
      responsibilities: 'Develop client-side components using React and CSS, write secure RESTful endpoints in Node.js, integrate database queries, and manage version control via Git.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
      minCgpa: 6.0,
      skills: ['React', 'JavaScript', 'Node.js', 'HTML', 'CSS', 'SQL'],
    },
    {
      orgSlug: 'tech-mahindra',
      title: 'Python & Generative AI Application Developer Intern (Python, SQL, Machine Learning)',
      slug: 'tech-mahindra-python-ai-intern',
      department: 'Makers Lab & AI Innovation Division',
      domain: 'Artificial Intelligence',
      location: 'Pune, Maharashtra',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      openings: 30,
      description: 'Develop intelligent Python applications, automation workflows, data transformation scripts, and machine learning model integration pipelines.',
      responsibilities: 'Write modular Python scripts, preprocess unstructured text and tabular datasets using Pandas/NumPy, interface with SQL databases, and deploy REST microservices.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Artificial Intelligence', 'Data Science', 'Information Technology'],
      minCgpa: 6.0,
      skills: ['Python', 'SQL', 'Machine Learning', 'Git'],
    },
    {
      orgSlug: 'wipro',
      title: 'Java Enterprise Backend & REST APIs Trainee (Java, SQL, Spring Boot)',
      slug: 'wipro-java-enterprise-backend-intern',
      department: 'Cloud & Enterprise Architecture Unit',
      domain: 'Software Development',
      location: 'Hyderabad, Telangana',
      state: 'Telangana',
      workMode: 'HYBRID',
      openings: 35,
      description: 'Learn enterprise software engineering using Core Java (Java 17/21), Object-Oriented design patterns, relational database schema queries, and REST APIs.',
      responsibilities: 'Implement business logic in Java, author unit tests using JUnit, execute database queries in SQL, and build secure microservices.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Science'],
      minCgpa: 6.0,
      skills: ['Java', 'SQL', 'REST APIs', 'Git'],
    },
    {
      orgSlug: 'bosch-india',
      title: 'C & Embedded Systems Firmware Trainee (C, Microcontrollers, RTOS)',
      slug: 'bosch-c-embedded-firmware-intern',
      department: 'Automotive Embedded Systems Division',
      domain: 'Embedded Systems & Software',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'ONSITE',
      openings: 25,
      description: 'Program low-level C firmware for 32-bit automotive microcontrollers, interface peripheral devices (SPI, I2C, UART), and develop real-time embedded logic.',
      responsibilities: 'Write robust C code for bare-metal and FreeRTOS environments, debug memory allocations, configure timers and interrupts, and execute hardware-in-the-loop tests.',
      degrees: ['B.Tech', 'B.E.', 'Diploma'],
      branches: ['Electronics and Communication Engineering', 'Computer Science and Engineering', 'Electrical Engineering'],
      minCgpa: 6.0,
      skills: ['C', 'Embedded Systems', 'Microcontrollers', 'Git'],
    },
    {
      orgSlug: 'ltts',
      title: 'C++ Systems & High-Performance Algorithm Trainee (C++, Python, Linux)',
      slug: 'ltts-cpp-systems-algorithm-intern',
      department: 'Core Engineering Systems & Simulation',
      domain: 'Software Development',
      location: 'Pune, Maharashtra',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      openings: 25,
      description: 'Engineers high-performance software modules, multi-threaded algorithms, and computational geometry applications using modern C++ (C++17/C++20).',
      responsibilities: 'Write clean, memory-leak-free C++ code utilizing STL containers, profile execution speed with gprof/valgrind, and automate build systems using CMake and Linux.',
      degrees: ['B.Tech', 'B.E.'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Electronics Engineering'],
      minCgpa: 6.5,
      skills: ['C++', 'Python', 'Linux', 'Git'],
    },
    {
      orgSlug: 'reliance-jio',
      title: 'Responsive Web UI/UX & JavaScript Developer Trainee (HTML, CSS, JavaScript, Tailwind)',
      slug: 'jio-web-ui-javascript-html-css-intern',
      department: 'Digital Consumer Platforms & Apps',
      domain: 'Software Development',
      location: 'Navi Mumbai, Maharashtra',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      openings: 35,
      description: 'Craft high-traffic web applications with pixel-perfect responsive layouts using HTML5, modern CSS3 (Flexbox/Grid), and vanilla JavaScript.',
      responsibilities: 'Develop accessible, cross-device HTML/CSS layouts, optimize Core Web Vitals, implement dynamic JavaScript interactivity, and collaborate with UX teams.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc', 'Diploma'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Applications'],
      minCgpa: 6.0,
      skills: ['JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Git'],
    },
    {
      orgSlug: 'tcs',
      title: 'Python Backend & Cloud Microservices Intern (Python, SQL, Docker, REST)',
      slug: 'tcs-python-backend-cloud-api-intern',
      department: 'Cloud Infrastructure & Cognitive Solutions',
      domain: 'Software Development',
      location: 'Chennai, Tamil Nadu',
      state: 'Tamil Nadu',
      workMode: 'HYBRID',
      openings: 30,
      description: 'Develop scalable web services and REST APIs using Python (FastAPI/Flask/Django), SQL databases, and containerized Docker deployments.',
      responsibilities: 'Write robust API endpoints in Python, design database models, implement JWT token authentication, and package microservices inside Docker containers.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Data Science'],
      minCgpa: 6.0,
      skills: ['Python', 'SQL', 'Docker', 'REST APIs', 'Git'],
    },
    {
      orgSlug: 'sbi',
      title: 'Core Java Banking Applications & Database Trainee (Java, SQL, Security)',
      slug: 'sbi-core-java-banking-intern',
      department: 'Digital Banking Operations & IT Department',
      domain: 'Software Development',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      openings: 30,
      description: 'Participate in developing enterprise financial transaction workflows, secure batch processing routines, and relational database queries in Java and SQL.',
      responsibilities: 'Write multithreaded Java applications, optimize complex SQL join queries, enforce banking security encryption standards, and generate financial audit logs.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Science'],
      minCgpa: 6.0,
      skills: ['Java', 'SQL', 'Cyber Security', 'Git'],
    },
    {
      orgSlug: 'infosys',
      title: 'Full Stack JavaScript & MERN Stack Developer Trainee (React, Node.js, Express, MongoDB)',
      slug: 'infosys-fullstack-mern-javascript-intern',
      department: 'Enterprise Full Stack Practice',
      domain: 'Software Development',
      location: 'Hyderabad, Telangana',
      state: 'Telangana',
      workMode: 'HYBRID',
      openings: 35,
      description: 'Hands-on full stack application development using MongoDB, Express.js, React.js, and Node.js (MERN) with HTML5 and modern CSS3.',
      responsibilities: 'Build single page applications in React, manage state with React Hooks, create Express API routers, perform CRUD operations in MongoDB, and write clean CSS styling.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Applications'],
      minCgpa: 6.0,
      skills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'HTML', 'CSS'],
    },
    {
      orgSlug: 'drdo',
      title: 'Defense Mission Software & Embedded C/C++ Trainee (C, C++, Linux)',
      slug: 'drdo-embedded-c-cpp-defense-intern',
      department: 'Center for Artificial Intelligence and Robotics (CAIR)',
      domain: 'Defense Technology & Software',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'ONSITE',
      openings: 20,
      description: 'Develop mission-critical defense control code, real-time sensor polling, and tactical communication protocols using C and C++ on Linux platforms.',
      responsibilities: 'Implement POSIX threads and sockets in C/C++, profile real-time Linux kernel modules, write device drivers, and enforce memory bounds checking.',
      degrees: ['B.Tech', 'B.E.'],
      branches: ['Computer Science and Engineering', 'Electronics and Communication', 'Information Technology'],
      minCgpa: 6.5,
      skills: ['C', 'C++', 'Linux', 'Git'],
    },
    {
      orgSlug: 'isro',
      title: 'Space Mission Ground Control Software Intern (Python, C++, SQL, Linux)',
      slug: 'isro-ground-control-python-cpp-intern',
      department: 'ISRO Telemetry, Tracking and Command Network (ISTRAC)',
      domain: 'Aerospace & Software',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'ONSITE',
      openings: 22,
      description: 'Build automated satellite telemetry logging, orbital data visualization, and ground command validation tools using Python, C++, and SQL.',
      responsibilities: 'Process binary telemetry packets in Python, write high-speed trajectory calculation libraries in C++, and maintain mission logs in SQL databases.',
      degrees: ['B.Tech', 'B.E.'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Aerospace Engineering'],
      minCgpa: 6.5,
      skills: ['Python', 'C++', 'SQL', 'Linux', 'Git'],
    },
    {
      orgSlug: 'hdfc-bank',
      title: 'Fintech Web Services & Python Automation Trainee (Python, Java, SQL, HTML)',
      slug: 'hdfc-fintech-python-java-intern',
      department: 'Digital Banking IT Services',
      domain: 'Software Development',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      openings: 25,
      description: 'Develop automation scripts, automated reconciliation web services, and internal customer service portals using Python, Java, SQL, and HTML.',
      responsibilities: 'Write automated data extraction scripts in Python, develop backend modules in Java, query relational databases in SQL, and craft basic web interfaces in HTML/CSS.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Applications'],
      minCgpa: 6.0,
      skills: ['Python', 'Java', 'SQL', 'HTML', 'Git'],
    },
    {
      orgSlug: 'bel',
      title: 'Avionics Embedded Software Verification Intern (C, C++, Quality Assurance)',
      slug: 'bel-avionics-software-testing-c-cpp-intern',
      department: 'Military Communications & Avionics Software SBU',
      domain: 'Electronics & Software',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'ONSITE',
      openings: 20,
      description: 'Execute formal DO-178C software validation, static code analysis, and unit testing for airborne defense systems developed in C and C++.',
      responsibilities: 'Run automated unit test suites for C/C++ avionics source code, identify boundary condition faults, analyze code coverage, and document test reports.',
      degrees: ['B.Tech', 'B.E.'],
      branches: ['Computer Science and Engineering', 'Electronics and Communication', 'Information Technology'],
      minCgpa: 6.0,
      skills: ['C', 'C++', 'Quality Assurance', 'Git'],
    },
    {
      orgSlug: 'siemens',
      title: 'Industrial Web Visualization & SCADA Dashboard Trainee (React, JavaScript, HTML, CSS)',
      slug: 'siemens-scada-web-react-intern',
      department: 'Digital Enterprise Web Applications',
      domain: 'Software Development',
      location: 'Mumbai, Maharashtra',
      state: 'Maharashtra',
      workMode: 'HYBRID',
      openings: 25,
      description: 'Design interactive, real-time industrial web consoles displaying factory IoT telemetry using React, JavaScript, HTML5 Canvas, and modern CSS.',
      responsibilities: 'Build interactive telemetry dashboards in React, consume WebSockets for live machine data, style responsive visual charts in CSS, and optimize web asset loads.',
      degrees: ['B.Tech', 'B.E.', 'BCA'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Instrumentation Engineering'],
      minCgpa: 6.0,
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Git'],
    },
    {
      orgSlug: 'tech-mahindra',
      title: 'Mobile Web & React Application Trainee (React, JavaScript, HTML, CSS)',
      slug: 'tech-mahindra-react-mobile-web-intern',
      department: 'Digital Mobility Solutions',
      domain: 'Software Development',
      location: 'Noida, Uttar Pradesh',
      state: 'Uttar Pradesh',
      workMode: 'HYBRID',
      openings: 30,
      description: 'Develop fast, accessible, cross-platform web and mobile frontends utilizing React, JavaScript, HTML5, and CSS3 responsive design.',
      responsibilities: 'Implement client-side state management, write custom React components, debug CSS layouts across mobile viewports, and integrate REST API endpoints.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Computer Applications'],
      minCgpa: 6.0,
      skills: ['React', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS'],
    },
    {
      orgSlug: 'wipro',
      title: 'Python Data Engineering & ETL Pipeline Trainee (Python, SQL, Docker, Linux)',
      slug: 'wipro-python-data-engineering-intern',
      department: 'Data & Analytics Global Practice',
      domain: 'Data Science & Software',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'HYBRID',
      openings: 35,
      description: 'Build automated data extraction, transformation, and loading (ETL) data pipelines using Python, SQL database engines, and containerized Docker environments.',
      responsibilities: 'Author scheduled Python batch data scripts, write complex SQL aggregations, build data validation checks, and containerize data workflows with Docker.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Data Science', 'Information Technology'],
      minCgpa: 6.0,
      skills: ['Python', 'SQL', 'Docker', 'Linux', 'Git'],
    },
    {
      orgSlug: 'schneider-electric',
      title: 'Embedded C Device Firmware & Communication Protocols Intern (C, Microcontrollers)',
      slug: 'schneider-embedded-c-firmware-intern',
      department: 'Connected Products R&D Centre',
      domain: 'Embedded Systems & Software',
      location: 'Bengaluru, Karnataka',
      state: 'Karnataka',
      workMode: 'ONSITE',
      openings: 20,
      description: 'Develop low-level C firmware for smart energy meters, protection relays, and IoT gateways utilizing 32-bit ARM Cortex microcontrollers.',
      responsibilities: 'Write robust C code for UART/Modbus communication stacks, optimize memory footprints, test flash memory read/write routines, and use oscilloscopes to verify waveforms.',
      degrees: ['B.Tech', 'B.E.', 'Diploma'],
      branches: ['Electronics Engineering', 'Computer Science and Engineering', 'Electrical Engineering'],
      minCgpa: 6.0,
      skills: ['C', 'Embedded Systems', 'Microcontrollers', 'Git'],
    },
    {
      orgSlug: 'ltts',
      title: 'Web Graphics & 3D Interactive Web Trainee (JavaScript, React, HTML, CSS, C++)',
      slug: 'ltts-web-graphics-javascript-cpp-intern',
      department: 'Digital Engineering & Virtual Reality Lab',
      domain: 'Software Development',
      location: 'Vadodara, Gujarat',
      state: 'Gujarat',
      workMode: 'HYBRID',
      openings: 20,
      description: 'Build browser-based 3D digital twin models and CAD asset visualization interfaces using JavaScript, React, WebGL, HTML5, and native C++ backend engines.',
      responsibilities: 'Render 3D mesh assets in web browsers using JavaScript, write responsive interface controls in React and CSS, and integrate simulation data from C++ services.',
      degrees: ['B.Tech', 'B.E.'],
      branches: ['Computer Science and Engineering', 'Information Technology'],
      minCgpa: 6.0,
      skills: ['JavaScript', 'React', 'C++', 'HTML', 'CSS'],
    },
    {
      orgSlug: 'reliance-jio',
      title: 'Cloud Native Full Stack Software Trainee (TypeScript, React, Node.js, HTML, CSS, Docker)',
      slug: 'jio-fullstack-typescript-react-intern',
      department: '5G Platform Engineering & Cloud Core',
      domain: 'Software Development',
      location: 'Navi Mumbai, Maharashtra',
      state: 'Maharashtra',
      workMode: 'ONSITE',
      openings: 40,
      description: 'End-to-end full stack development using TypeScript, React frontend architecture (HTML5/CSS3), and Node.js microservices deployed on containerized clouds.',
      responsibilities: 'Develop type-safe React applications, implement server-side Node.js logic in TypeScript, style responsive layouts in modern CSS, and deploy images using Docker.',
      degrees: ['B.Tech', 'B.E.', 'BCA', 'B.Sc'],
      branches: ['Computer Science and Engineering', 'Information Technology', 'Software Engineering'],
      minCgpa: 6.5,
      skills: ['TypeScript', 'React', 'Node.js', 'HTML', 'CSS', 'Docker', 'Git'],
    },
  ];

  console.log(`✓ Prepared ${softwareInternships.length} software and programming internships.`);

  let inserted = 0;
  for (const item of softwareInternships) {
    const orgId = orgMap.get(item.orgSlug);
    if (!orgId) {
      console.warn(`⚠️ Warning: Organization slug not found: ${item.orgSlug}`);
      continue;
    }

    // Upsert internship
    const internship = await prisma.internship.upsert({
      where: { slug: item.slug },
      update: {
        organizationId: orgId,
        title: item.title,
        description: item.description,
        responsibilities: item.responsibilities,
        department: item.department,
        domain: item.domain,
        location: item.location,
        state: item.state,
        workMode: item.workMode,
        durationMonths: 12,
        stipendAmount: 5000.0,
        stipendType: 'MONTHLY',
        openings: item.openings,
        deadline: deadlineDate,
        startDate: startDate,
        status: 'PUBLISHED',
      },
      create: {
        organizationId: orgId,
        title: item.title,
        slug: item.slug,
        description: item.description,
        responsibilities: item.responsibilities,
        department: item.department,
        domain: item.domain,
        location: item.location,
        state: item.state,
        workMode: item.workMode,
        durationMonths: 12,
        stipendAmount: 5000.0,
        stipendType: 'MONTHLY',
        openings: item.openings,
        deadline: deadlineDate,
        startDate: startDate,
        status: 'PUBLISHED',
      },
    });

    // Upsert Eligibility Rule
    await prisma.eligibilityRule.upsert({
      where: { internshipId: internship.id },
      update: {
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: JSON.stringify(item.degrees),
        allowedBranches: JSON.stringify(item.branches),
        minCgpa: item.minCgpa,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: JSON.stringify([]),
        mandatorySkillNames: JSON.stringify(item.skills.slice(0, 2)),
      },
      create: {
        internshipId: internship.id,
        minEducationLevel: 'UNDERGRADUATE',
        allowedDegrees: JSON.stringify(item.degrees),
        allowedBranches: JSON.stringify(item.branches),
        minCgpa: item.minCgpa,
        minGraduationYear: 2023,
        maxGraduationYear: 2026,
        minAge: 21,
        maxAge: 24,
        allowedStates: JSON.stringify([]),
        mandatorySkillNames: JSON.stringify(item.skills.slice(0, 2)),
      },
    });

    // Clear old skill mappings and attach fresh
    await prisma.internshipSkill.deleteMany({
      where: { internshipId: internship.id },
    });

    for (let i = 0; i < item.skills.length; i++) {
      const sName = item.skills[i];
      const sId = skillMap.get(sName);
      if (sId) {
        await prisma.internshipSkill.create({
          data: {
            internshipId: internship.id,
            skillId: sId,
            isRequired: i === 0 || i === 1,
            weight: i === 0 ? 1.5 : 1.0,
          },
        });
      }
    }

    inserted++;
  }

  console.log(`✓ Ingested ${inserted} Programming & Web Internships successfully.`);

  // 4. Print final database metrics
  const totalOrgs = await prisma.organization.count();
  const totalInternships = await prisma.internship.count();
  const totalRules = await prisma.eligibilityRule.count();
  const totalSkills = await prisma.skill.count();
  const totalSkillMappings = await prisma.internshipSkill.count();

  console.log('\n======================================================');
  console.log('🎉 Database Update Completed:');
  console.log(`- Total Organizations in DB: ${totalOrgs}`);
  console.log(`- Total Internships in DB:   ${totalInternships}`);
  console.log(`- Total Eligibility Rules:   ${totalRules}`);
  console.log(`- Total Skills in DB:        ${totalSkills}`);
  console.log(`- Total Skill Mappings:      ${totalSkillMappings}`);
  console.log('======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during ingestion:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
