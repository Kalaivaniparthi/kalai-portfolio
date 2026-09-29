// ─────────────────────────────────────────────────────────────
// Single source of truth for all portfolio content.
// Replace every value marked TODO with your real details.
// ─────────────────────────────────────────────────────────────

export const site = {
  name: 'Kalaivani P',
  title: 'Generative AI Engineer',
  location: 'Chennai, India',
  email: 'your.email@example.com', // TODO: your email
  linkedin: 'https://www.linkedin.com/in/your-profile', // TODO: your LinkedIn URL
  github: 'https://github.com/your-username', // TODO: your GitHub profile URL
  resume: '/resume.pdf', // place resume.pdf in /public
  photo: '/profile.jpg', // place profile.jpg in /public (monogram shown if missing)
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  tagline:
    'I build production AI systems — RAG pipelines, AI agents, and high-performance backends.',
  bio: "I'm a 3rd-year B.Tech IT student at Agni College of Technology, Chennai, specializing in Generative AI and backend engineering. I've completed internships in Backend AI Engineering at FlyRank AI and GenAI & Prompt Engineering at TN Rise. I build RAG pipelines, AI agents, and production APIs using Python, FastAPI, and LangChain. Currently targeting JLPT N1 and building intelligent AI systems for real-world impact.",
};

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '');

export const navLinks = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'contact', label: 'Contact' },
];

export const currently = [
  { emoji: '🎯', label: 'Building', text: 'AI agents at FlyRank AI' },
  { emoji: '📚', label: 'Learning', text: 'Advanced RAG + Multi-Agent Systems' },
  { emoji: '🌏', label: 'Target', text: 'JLPT N1 (December 2026)' },
];

export const stats = [
  { value: 22, suffix: '+', label: 'Projects' },
  { value: 2, suffix: '', label: 'Internships' },
  { value: 4, suffix: '', label: 'Certifications' },
];

export const skillGroups = [
  { id: 'languages', title: 'Languages', icon: 'code', skills: ['Python', 'JavaScript (ES6)', 'SQL'] },
  {
    id: 'ai',
    title: 'AI / GenAI',
    icon: 'brain',
    skills: ['RAG', 'AI Agents', 'LangChain', 'Prompt Engineering', 'OpenAI API', 'Gemini API'],
  },
  {
    id: 'backend',
    title: 'Backend',
    icon: 'server',
    skills: ['FastAPI', 'REST APIs', 'PostgreSQL', 'SQLAlchemy', 'JWT'],
  },
  { id: 'devops', title: 'DevOps', icon: 'container', skills: ['Docker', 'Git', 'GitHub', 'Render', 'Vercel'] },
  {
    id: 'databases',
    title: 'Databases',
    icon: 'database',
    skills: ['PostgreSQL', 'Vector DBs', 'pgvector', 'ChromaDB'],
  },
  {
    id: 'human',
    title: 'Human Languages',
    icon: 'languages',
    skills: ['English', 'Tamil', 'Japanese (JLPT N1 Target)'],
  },
];

export const experience = [
  {
    role: 'Backend AI Engineering Intern',
    company: 'FlyRank AI',
    period: 'July 2026 – Present',
    current: true,
    points: [
      'Building RAG pipelines and AI agents for document Q&A',
      'Designing and shipping a real API service',
      'Working with LangChain, vector databases, and modern AI stacks',
      'Building a capstone project',
    ],
    tags: ['Python', 'FastAPI', 'LangChain', 'Vector DBs', 'RAG'],
  },
  {
    role: 'GenAI & Prompt Engineering Intern',
    company: 'TN Rise',
    period: '2026',
    current: false,
    points: [
      'Developing prompt engineering strategies for LLMs',
      'Researching RAG and fine-tuning techniques',
      'Building generative AI prototypes',
    ],
    tags: ['LLMs', 'Prompt Engineering', 'RAG', 'Fine-tuning'],
  },
];

export const categories = ['All', 'AI/GenAI', 'Backend', 'Full-Stack', 'ML', 'Other'];

// Status label → colour group. Groups: completed (green), mvp (yellow), progress (blue), unfinished (grey)
export const statusGroup = {
  Completed: 'completed',
  Implemented: 'completed',
  MVP: 'mvp',
  Prototype: 'mvp',
  'In Progress': 'progress',
  Active: 'progress',
  Practice: 'progress',
  Experiment: 'progress',
  Unfinished: 'unfinished',
};

// `repo` is the GitHub repository name — the link is built from site.github.
// Set `live` to a URL when a deployed demo exists.
// TODO: review descriptions/features/learnings and adjust to match each project exactly.
export const projects = [
  // ── AI & GenAI ─────────────────────────────────────────
  {
    slug: 'medcare',
    name: 'MedCare',
    category: 'AI/GenAI',
    status: 'MVP',
    short: 'Healthcare AI application that helps users get quick, AI-assisted medical guidance.',
    description:
      'MedCare is a healthcare-focused AI application with a FastAPI backend that exposes AI-assisted features through a clean REST API.',
    problem:
      'Getting quick, understandable answers to everyday health questions is hard; MedCare makes that information more accessible.',
    features: ['AI-assisted health query handling', 'FastAPI REST backend', 'Structured, validated request/response models'],
    tech: ['Python', 'FastAPI', 'AI'],
    learned: 'Designing AI features responsibly for a sensitive domain and structuring a FastAPI service for growth.',
    repo: 'MedCare',
    live: null,
  },
  {
    slug: 'orca-marine',
    name: 'ORCA-MARINE',
    category: 'AI/GenAI',
    status: 'Prototype',
    short: 'Marine AI reasoning system that turns ocean data into explainable decisions.',
    description:
      'ORCA-MARINE is an agentic marine AI reasoning system built with React, TypeScript and Gemini, developed during Smart India Hackathon 2026.',
    problem:
      'Marine and ocean data is complex and scattered; ORCA-MARINE lets users ask questions and get reasoned, contextual answers.',
    features: ['Agentic reasoning over marine data', 'Gemini-powered natural-language interface', 'Responsive React + TypeScript UI'],
    tech: ['React', 'TypeScript', 'AI Studio', 'Gemini'],
    learned: 'Orchestrating LLM reasoning steps and grounding answers with retrieval (RAG).',
    repo: 'ORCA-MARINE',
    live: null,
  },
  {
    slug: 'himsetu-ai',
    name: 'HIMSETU-AI',
    category: 'AI/GenAI',
    status: 'Prototype',
    short: 'Antarctic AI navigation assistant for safer routing through polar sea ice.',
    description:
      'HIMSETU-AI is an AI-powered Antarctic navigation assistant built with React, TypeScript, Vite and the Gemini API.',
    problem: 'Polar navigation is dangerous and data-heavy; HIMSETU-AI surfaces navigation insight in an accessible interface.',
    features: ['Gemini API integration for navigation insight', 'Fast Vite + React front end', 'Typed, modular TypeScript codebase'],
    tech: ['React', 'TypeScript', 'Vite', 'Gemini API'],
    learned: 'Integrating LLM APIs into a typed front end and communicating domain data clearly.',
    repo: 'HIMSETU-AI',
    live: null,
  },
  {
    slug: 'ai-financial-chatbot',
    name: 'AI-Financial-Chatbot-Analysis',
    category: 'AI/GenAI',
    status: 'Completed',
    short: 'AI financial chatbot with data analysis of company financial statements.',
    description:
      'An AI financial chatbot paired with financial data analysis in Jupyter, built as part of the Forage GenAI Job Simulation.',
    problem: 'Financial reports are dense; this project extracts key trends and answers questions about them conversationally.',
    features: ['Financial data extraction and analysis with Pandas', 'Rule-based chatbot for common financial queries', 'Documented analysis in Jupyter'],
    tech: ['Python', 'Pandas', 'Jupyter'],
    learned: 'Turning raw financial data into insights and designing a conversational flow around them.',
    repo: 'AI-Financial-Chatbot-Analysis',
    live: null,
  },
  {
    slug: 'ai-content-creator',
    name: 'ai_content_creator',
    category: 'AI/GenAI',
    status: 'In Progress',
    short: 'AI content generation tool for drafting posts, articles and captions.',
    description: 'An AI-powered content generation tool that drafts written content from short prompts.',
    problem: 'Creating consistent content takes time; this tool speeds up first drafts.',
    features: ['Prompt-driven content generation', 'Reusable prompt templates', 'Web interface'],
    tech: ['AI', 'Web'],
    learned: 'Prompt design for controllable, on-brand generation.',
    repo: 'ai_content_creator',
    live: null,
  },
  {
    slug: 'oceanguard',
    name: 'OceanGuard',
    category: 'AI/GenAI',
    status: 'MVP',
    short: 'Ocean monitoring platform for tracking and preventing marine plastic pollution.',
    description:
      'OceanGuard is a three-layer marine pollution prevention platform with a Flask backend, SQLite storage and interactive Leaflet maps.',
    problem: 'Marine plastic pollution is hard to track; OceanGuard connects reporting, monitoring and admin action in one system.',
    features: ['Interactive pollution map with Leaflet.js', 'Separate fisher portal and admin dashboard', 'Flask + SQLite backend'],
    tech: ['Python', 'Flask', 'SQLite', 'Leaflet.js'],
    learned: 'Designing multi-role systems and working with geospatial data on the web.',
    repo: 'OceanGuard',
    live: null,
  },
  // ── Backend & API ──────────────────────────────────────
  {
    slug: 'todo-auth-api',
    name: 'todo-auth-api',
    category: 'Backend',
    status: 'Implemented',
    short: 'To-Do REST API with JWT authentication and per-user data.',
    description: 'A To-Do API secured with JWT authentication so each user only accesses their own tasks.',
    problem: 'Demonstrates secure, stateless authentication for a real-world CRUD API.',
    features: ['User registration and login', 'JWT-protected endpoints', 'Per-user task CRUD'],
    tech: ['Python', 'Backend', 'JWT'],
    learned: 'Token-based auth, password hashing and protecting routes.',
    repo: 'todo-auth-api',
    live: null,
  },
  {
    slug: 'todo-api',
    name: 'todo-api',
    category: 'Backend',
    status: 'Implemented',
    short: 'Clean REST API for a To-Do application with full CRUD.',
    description: 'A RESTful To-Do API implementing create, read, update and delete operations.',
    problem: 'A foundation project for REST design, validation and persistence.',
    features: ['Full CRUD endpoints', 'Request validation', 'RESTful resource design'],
    tech: ['Python', 'REST API'],
    learned: 'REST conventions, status codes and API structure.',
    repo: 'todo-api',
    live: null,
  },
  {
    slug: 'form-submission',
    name: 'form-submission',
    category: 'Backend',
    status: 'In Progress',
    short: 'Form submission app that validates and stores user input on the server.',
    description: 'A web form submission app with server-side handling and storage.',
    problem: 'Reliable form handling with validation is a core building block of web apps.',
    features: ['Server-side validation', 'Persistent storage of submissions', 'Simple web UI'],
    tech: ['Web', 'Backend'],
    learned: 'Handling user input safely end to end.',
    repo: 'form-submission',
    live: null,
  },
  {
    slug: 'scraper',
    name: 'scraper',
    category: 'Backend',
    status: 'In Progress',
    short: 'Python web scraping tool for collecting structured data from websites.',
    description: 'A Python web scraper that extracts structured data from web pages.',
    problem: 'Useful data often lives only in HTML pages; this tool turns it into structured data.',
    features: ['HTML parsing and extraction', 'Structured output', 'Configurable targets'],
    tech: ['Python'],
    learned: 'Parsing HTML robustly and scraping responsibly.',
    repo: 'scraper',
    live: null,
  },
  // ── Full-Stack & Web ───────────────────────────────────
  {
    slug: 'printease',
    name: 'PrintEase',
    category: 'Full-Stack',
    status: 'MVP',
    short: 'Printing management app with in-browser PDF preview and page selection.',
    description: 'PrintEase simplifies print-shop workflows with PDF previews rendered in the browser via PDF.js.',
    problem: 'Print orders are error-prone; previewing documents before printing reduces waste and back-and-forth.',
    features: ['In-browser PDF preview with PDF.js', 'Print order management', 'Responsive vanilla JS UI'],
    tech: ['HTML5', 'CSS3', 'JavaScript', 'PDF.js'],
    learned: 'Working with PDF rendering and building UIs without a framework.',
    repo: 'PrintEase',
    live: null,
  },
  {
    slug: 'portfolio',
    name: 'Portfolio',
    category: 'Full-Stack',
    status: 'Completed',
    short: 'This site — a 3D neural-interface portfolio with a FastAPI contact backend.',
    description:
      'A 3D creative portfolio built with Next.js, React Three Fiber and Framer Motion, backed by a FastAPI email service.',
    problem: 'A memorable, fast and accessible home for my work.',
    features: ['Interactive 3D neural network hero', 'Dark/light themes that re-colour the 3D scene', 'Working contact form via FastAPI'],
    tech: ['Next.js', 'Three.js', 'Tailwind CSS', 'FastAPI'],
    learned: 'Balancing 3D visuals with performance and accessibility.',
    repo: 'Portfolio',
    live: null,
  },
  {
    slug: 'ngo-website',
    name: 'NGO-website',
    category: 'Full-Stack',
    status: 'In Progress',
    short: 'Website for an NGO to share its mission, programs and ways to help.',
    description: 'A responsive website for a non-profit organisation.',
    problem: 'Small NGOs need a clear web presence to reach volunteers and donors.',
    features: ['Mission and program pages', 'Responsive layout', 'Contact / get-involved section'],
    tech: ['Web'],
    learned: 'Designing for clarity and a non-technical audience.',
    repo: 'NGO-website',
    live: null,
  },
  {
    slug: 'home-security-sys',
    name: 'Home-security-sys',
    category: 'Full-Stack',
    status: 'In Progress',
    short: 'Home security system concept for monitoring and alerts.',
    description: 'A home security system project focused on monitoring and alerting.',
    problem: 'Affordable home monitoring that notifies owners of unusual activity.',
    features: ['Monitoring dashboard', 'Alerting', 'Access logging'],
    tech: ['Security'],
    learned: 'Thinking about systems from a security-first perspective.',
    repo: 'Home-security-sys',
    live: null,
  },
  {
    slug: 'cybercrimedb',
    name: 'CyberCrimeDB',
    category: 'Full-Stack',
    status: 'In Progress',
    short: 'Cybercrime database for recording and searching incident reports.',
    description: 'A web application backed by a relational database for managing cybercrime records.',
    problem: 'Organising incident data makes patterns easier to spot and act on.',
    features: ['Record management', 'Search and filtering', 'Relational schema design'],
    tech: ['Web', 'Database'],
    learned: 'Relational data modelling and query design.',
    repo: 'CyberCrimeDB',
    live: null,
  },
  // ── ML & Data Science ──────────────────────────────────
  {
    slug: 'antartic-navi',
    name: 'antartic-navi',
    category: 'ML',
    status: 'Active',
    short: 'Antarctic navigation ML — sea-ice prediction from climate datasets.',
    description:
      'Machine learning for Antarctic navigation, including sea-ice prediction using ConvLSTM on gridded climate data (SIH 2026).',
    problem: 'Predicting sea-ice conditions helps plan safer polar routes.',
    features: ['Gridded climate data processing with xarray', 'ConvLSTM spatio-temporal modelling', 'Prediction visualisation'],
    tech: ['Python', 'xarray', 'PyTorch', 'ML/AI'],
    learned: 'Spatio-temporal deep learning and working with NetCDF climate data.',
    repo: 'antartic-navi',
    live: null,
  },
  {
    slug: 'xgboost',
    name: 'xgboost',
    category: 'ML',
    status: 'Practice',
    short: 'XGBoost experiments on tabular data with tuning and evaluation.',
    description: 'Experiments with gradient-boosted trees using XGBoost.',
    problem: 'Understanding when and how boosted trees outperform other models on tabular data.',
    features: ['Model training and evaluation', 'Hyperparameter tuning', 'Feature importance analysis'],
    tech: ['Python', 'XGBoost'],
    learned: 'Gradient boosting internals and tuning trade-offs.',
    repo: 'xgboost',
    live: null,
  },
  {
    slug: 'mock-datatrain',
    name: 'mock_datatrain',
    category: 'ML',
    status: 'Experiment',
    short: 'ML training pipeline experiments on generated mock datasets.',
    description: 'Experiments training ML models on synthetic data.',
    problem: 'Mock data allows fast iteration on pipelines before real data is available.',
    features: ['Synthetic data generation', 'Training pipeline', 'Evaluation metrics'],
    tech: ['ML', 'Data'],
    learned: 'Building repeatable training pipelines.',
    repo: 'mock_datatrain',
    live: null,
  },
  {
    slug: 'model-prac',
    name: 'model-prac',
    category: 'ML',
    status: 'Practice',
    short: 'Hands-on ML model practice across classic algorithms.',
    description: 'Practice notebooks implementing and comparing ML models.',
    problem: 'Building intuition through hands-on implementation.',
    features: ['Classic ML algorithms', 'Model comparison', 'Notebook write-ups'],
    tech: ['ML', 'Python'],
    learned: 'Core ML fundamentals and evaluation.',
    repo: 'model-prac',
    live: null,
  },
  // ── Other ──────────────────────────────────────────────
  {
    slug: 'calculator',
    name: 'My-first-calculator-project',
    category: 'Other',
    status: 'Completed',
    short: 'Calculator with both command-line and Tkinter GUI versions.',
    description: 'My first Python project: a calculator available as a CLI and a Tkinter desktop GUI.',
    problem: 'A first step into programming, UI events and program structure.',
    features: ['CLI calculator', 'Tkinter GUI calculator', 'Input error handling'],
    tech: ['Python', 'Tkinter'],
    learned: 'Python fundamentals and event-driven GUIs.',
    repo: 'My-first-calculator-project',
    live: null,
  },
  {
    slug: 'kural',
    name: 'kural-',
    category: 'Other',
    status: 'In Progress',
    short: 'Tamil Thirukkural project for exploring couplets and their meanings.',
    description: 'A project around the Thirukkural, the classic Tamil text.',
    problem: 'Making Thirukkural couplets easy to explore for modern readers.',
    features: ['Browse couplets', 'Meanings and explanations', 'Search'],
    tech: ['Web'],
    learned: 'Working with Tamil text and Unicode.',
    repo: 'kural-',
    live: null,
  },
  {
    slug: 'readright',
    name: 'ReadRight',
    category: 'Other',
    status: 'Unfinished',
    short: 'Reading app concept to help build consistent reading habits.',
    description: 'A reading app concept focused on habit building.',
    problem: 'Staying consistent with reading is hard without feedback.',
    features: ['Reading tracking', 'Progress view', 'Goals'],
    tech: ['Web'],
    learned: 'Scoping product ideas into buildable features.',
    repo: 'ReadRight',
    live: null,
  },
];

export const repoUrl = (repo) => `${site.github.replace(/\/$/, '')}/${repo}`;

export const certifications = [
  {
    name: 'Introduction to Large Language Models (LLMs)',
    issuer: 'NPTEL — IIT Delhi / IIT Bombay',
    year: '2026',
    status: 'Registered',
    icon: 'graduation',
  },
  { name: 'Generative AI Job Simulation', issuer: 'Forage', year: '2026', status: 'Completed', icon: 'award' },
  { name: 'Career Edge – Young Professional', issuer: 'TCS iON', year: '2026', status: 'In Progress', icon: 'badge' },
  { name: 'JLPT N1', issuer: 'Japan Foundation', year: '2026', status: 'Target: December', icon: 'languages' },
];

export const achievements = [
  {
    icon: 'trophy',
    title: 'Smart India Hackathon 2026 Participant',
    description: 'Competed at national level with two AI builds:',
    points: [
      'Antarctic Sea Ice Prediction using ConvLSTM + PyTorch',
      'ORCA-MARINE Agentic AI with LangChain + RAG',
    ],
    featured: true,
  },
  {
    icon: 'rocket',
    title: 'Backend AI Engineering Intern — FlyRank AI',
    description: 'Earned a place through competitive selection.',
  },
  { icon: 'rocket', title: 'GenAI & Prompt Engineering Intern — TN Rise', description: 'Prompt engineering, RAG research and GenAI prototypes.' },
  { icon: 'award', title: 'Forage GenAI Job Simulation', description: 'Completed the Generative AI job simulation.' },
  { icon: 'star', title: 'Prodigy InfoTech Internship', description: 'Selected for the Web Development internship.' },
  { icon: 'award', title: 'NPTEL — IIT Delhi / Bombay', description: 'Introduction to Large Language Models certification.' },
  { icon: 'code', title: '22+ Projects on GitHub', description: 'From RAG systems to ML experiments and full-stack apps.', wide: true },
];
