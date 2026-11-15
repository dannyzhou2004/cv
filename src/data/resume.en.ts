import type { Resume } from './types';

/** English content — extracted 1:1 from CV_ZhouYueyang_EN.docx (no invented facts). */
export const en: Resume = {
  lang: 'en',
  htmlLang: 'en',
  meta: {
    title: 'Zhou Yueyang — Electrical Engineering, Power Electronics & Drives',
    description:
      'CV of Zhou Yueyang: B.Eng. Electrical Engineering and Automation (Sino-German Joint Program), ranked 1st of 51 at USST, exchange at HAW Hamburg. Power electronics, drive control, industrial automation.',
    ogLocale: 'en_GB',
  },
  ui: {
    nav: {
      about: 'About',
      education: 'Education',
      experience: 'Experience',
      projects: 'Projects',
      honours: 'Honours',
      skills: 'Skills',
      languages: 'Languages',
    },
    sections: {
      about: 'Profile',
      education: 'Education',
      experience: 'Internship Experience',
      projects: 'Projects',
      honours: 'Honours & Awards',
      skills: 'Technical Skills',
      languages: 'Languages',
      coursework: 'Relevant Coursework',
      contact: 'Get in touch',
    },
    labels: {
      supervisor: 'Supervisor',
      expected: 'Expected',
      playMusic: 'Play background music',
      pauseMusic: 'Pause background music',
      soundHint: 'Click for sound',
      moreProjects: 'More projects on GitHub',
      switchLanguage: 'Switch language',
      copyEmail: 'Copy email address',
      copied: 'Copied',
      backToTop: 'Back to top',
      menu: 'Menu',
      close: 'Close',
      print: 'Print / Save as PDF',
    },
    footer: 'Built with Astro · hosted on GitHub Pages',
  },
  person: {
    name: 'ZHOU YUEYANG',
    nameZh: '周悦杨',
    title: 'B.Eng. Electrical Engineering and Automation · Sino-German Joint Program',
    tagline:
      'Power electronics, drive control and industrial automation — studying between Shanghai and Hamburg, after a full AFS exchange year at a Swiss grammar school.',
    location: 'Guangdong, China · Shanghai / Hamburg',
    phones: [],
    emails: ['Dannyzhou0218@gmail.com', '1532319620@qq.com'],
    links: [
      { label: 'GitHub · projects', href: 'https://github.com/dannyzhou2004' },
    ],
  },
  stats: [
    { value: '1st', label: 'Rank in cohort', note: 'of 51 students' },
    { value: '91.74', label: 'Weighted average', note: 'out of 100' },
    { value: '4.0', label: 'GPA', note: 'of 4.5 · top band' },
    { value: '26%', label: 'Credits taught in German', note: 'share of the 250.5-credit programme' },
  ],
  education: [
    {
      org: 'University of Shanghai for Science and Technology',
      orgSub: 'Shanghai-Hamburg College (SHC)',
      place: 'Shanghai, China',
      degree: 'B.Eng. Electrical Engineering and Automation — Sino-German Joint Program',
      period: 'Sep 2023 — Jul 2027 (expected)',
      bullets: [
        '**Ranked 1st of 51** · weighted average **91.74/100** · GPA **4.0/4.5** (top band) · **26% of credits taught in German**',
      ],
    },
    {
      org: 'HAW Hamburg',
      orgSub: 'Hochschule für Angewandte Wissenschaften Hamburg',
      place: 'Hamburg, Germany',
      degree: 'Exchange study — Electrical Engineering',
      period: 'Sep 2025 — Feb 2026 · Nov 2026 — Mar 2027',
      bullets: [
        'Two exchange terms across the 2025/26 and 2026/27 academic years; **summer school 2024**',
      ],
    },
    {
      org: 'Foshan No. 1 High School',
      orgSub: 'Foshan, Guangdong',
      place: 'Foshan, China',
      degree: 'Secondary education',
      period: '2019 — 2023',
      bullets: [],
      subEntries: [
        {
          period: 'Sep 2021 — Jun 2022',
          org: 'Kantonsschule Schaffhausen',
          orgSub: 'AFS Intercultural Programs · Switzerland',
          place: 'Schaffhausen, Switzerland',
          text: '**One-year exchange** at a Swiss state grammar school — German-language immersion, living with an AFS host family',
        },
      ],
    },
  ],
  experience: [
    {
      org: 'Stucke Elektronik GmbH',
      orgSub: 'stuckeGROUP · Hamburg · Praxissemester',
      place: 'Hamburg, Germany',
      role: 'Hardware Engineer',
      period: 'Nov 2026 — Mar 2027',
      bullets: [
        'Developed and refined the **Morticron waveform generator** on **Arduino Nano** and **STM32H753ZI**',
        'Owned **new-feature validation and implementation**, **firmware adaptation** and flashing',
        'Assembled and debugged the complete unit, from board bring-up to system-level testing',
      ],
    },
    {
      org: 'Guangdong GSI Marine Technology Research Institute',
      orgSub: 'Guangzhou Shipyard International (CSSC)',
      place: 'Guangzhou, China',
      role: 'Assistant Electrical Engineer',
      period: 'Jun 2025 — Aug 2025',
      bullets: [
        'Prepared the **SRtP (Safe Return to Port)** documentation framework for the newbuilding project',
        "Prepared the **SRtP documentation for the electrical part of the ship's machinery installation**, in line with IMO safe-return-to-port requirements",
      ],
    },
  ],
  projects: [
    {
      title: 'Morticron Waveform Generator — Firmware & Hardware',
      role: 'Hardware Engineer · Stucke Elektronik',
      bullets: [
        'Built and extended the waveform-generator firmware on **STM32H753ZI**, with **Arduino Nano** prototyping',
        '**Feature validation and implementation**, firmware adaptation, flashing, and full-unit assembly & debugging',
      ],
    },
    {
      title: 'Remote-Sensing Intelligent UAV Patrol System Based on Computer Vision',
      role: 'Team Leader',
      supervisor: 'Bin Chen',
      bullets: [
        "**Bronze Award**, China International College Students' Innovation Competition (2025) — Higher Education Main Track, International Projects",
        '**Main presenter at the defence**; **dataset preparation and annotation** for the computer-vision pipeline',
      ],
    },
  ],
  awards: [
    {
      title: 'Shanghai Municipal Scholarship',
      detail: 'Shanghai Municipal Education Commission · Municipal level',
      year: '2024–25',
    },
    {
      title: 'Bronze Award',
      detail: "China International College Students' Innovation Competition · National level",
      year: '2025',
    },
    {
      title: 'DAAD Scholarship — Praxissemester (Industrial Internship)',
      detail: 'DAAD funding for the mandatory 18-week practical semester in Hamburg · €992/month + travel allowance',
      year: '2026–27',
    },
    {
      title: 'DAAD Scholarship — Summer Course',
      detail: 'International summer course in Germany',
      year: '2024',
    },
    {
      title: 'Merit Award',
      detail: '4th Hujiang Cup Scientific and Technical Translation Competition · Chinese → German',
      year: '2025',
    },
    {
      title: 'Outstanding Student Scholarship, First Class (×2) & Special Award',
      detail: 'University of Shanghai for Science and Technology · German Language Tutor',
    },
  ],
  skills: [
    { group: 'Power electronics', items: ['Rectifiers', 'Inverters', 'Four-quadrant converters (4QS)'] },
    { group: 'Machines & drives', items: ['DC machines', 'Induction (asynchronous) machines', 'Transformers'] },
    {
      group: 'Control',
      items: ['PID', 'Magnitude optimum', 'Symmetric optimum', 'Cascaded drive control-loop tuning'],
    },
    { group: 'Automation', items: ['PLC programming', 'Embedded systems', 'Sensors & measurement'] },
    {
      group: 'Software & lab',
      items: ['MATLAB/Simulink', 'C (Visual Studio 2022)', 'Java (IntelliJ IDEA)', 'Siemens PLC', 'Digital control'],
    },
    {
      group: 'AI & agent tooling',
      items: [
        'DeepSeek Harness',
        'WorkBuddy',
        'Agentic workflow automation',
        'Independent project delivery',
        'STM32 / Arduino firmware',
      ],
    },
  ],
  coursework: [
    { group: 'Machines & drives', items: ['Electrical Drives (German) — A'] },
    {
      group: 'Power electronics',
      items: ['Power Electronics (German) — A', 'Electric Circuits I & II (German)', 'Analogue Circuits', 'Digital Systems'],
    },
    {
      group: 'Control & automation',
      items: [
        'Automatic Control Principle (German) — A',
        'Digital Control (German) — A',
        'Programmable Industrial Control Systems',
        'Embedded Systems',
        'Sensor Technology',
      ],
    },
    {
      group: 'Programming & mathematics',
      items: ['Advanced C Programming (German)', 'Advanced Mathematics A(1)(2)', 'Linear Algebra B', 'Probability & Statistics B'],
    },
  ],
  languages: [
    { name: 'English', level: 'IELTS 7.5', detail: 'L 8.5 · R 7.5 · W 6.5 · S 6.5', score: 78 },
    { name: 'German', level: 'Goethe B2 · TestDaF', detail: 'Listening 4 · Speaking 4 · Reading 4 · Writing 3', score: 66 },
    { name: 'Mandarin Chinese', level: 'Native', detail: 'First language', score: 100 },
    { name: 'Cantonese', level: 'Native', detail: 'First language · daily and working use', score: 100 },
  ],
};
