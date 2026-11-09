// Project showcase configuration. One object per AI agent build; the modal in
// showcase.js renders whatever fields are present and skips the rest, so a
// project with little public material gets a short modal, not padding.
//
// Fields:
//   id            matches data-project on the card's Explore button
//   eyebrow       mono line above the title (project · stack · year)
//   title, subtitle
//   badges[]      technology chips
//   gallery[]     optional infographic tabs: { id, label, title, src, alt }
//   screenshots[] optional: { src, alt, caption }
//   sections[]    ordered blocks: { heading, paragraphs?: [], items?: [] }
//   authorship    { designed, wrote, credit? }
//   links[]       { label, href }
window.PORTFOLIO_PROJECTS = [
  {
    id: 'careerops',
    eyebrow: 'career-ops · open source · Claude Code / Codex / OpenCode · 2026',
    title: 'Career Ops',
    subtitle: 'An open-source, local-first, AI-agnostic job-search agent, and the engine of my own search.',
    badges: ['Node.js', 'Markdown prompt modes', 'AI coding CLIs', 'Playwright', '130+ ATS providers', 'Markdown / TSV / YAML data', 'Zero-token scripts'],
    gallery: [
      { id: 'overview', label: 'Overview', title: 'Career Ops — Your AI Job Search Agent', src: 'assets/infographics/careerops-overview.svg?v=dd044cf4', alt: 'Six connected capabilities from Discover Jobs to Learn and Improve, with the human review step highlighted.' },
      { id: 'workflow', label: 'Workflow', title: 'Career Ops — From Job Discovery to Outcome', src: 'assets/infographics/careerops-workflow.svg?v=78603913', alt: 'Ten numbered stages from job boards to feedback into targeting, with a human gate at submission and one feedback loop.' },
      { id: 'architecture', label: 'Technical Architecture', title: 'Career Ops — Under the Hood', src: 'assets/infographics/careerops-architecture.svg?v=a033a27c', alt: 'Five groups: AI orchestration, discovery engine, AI intelligence, analytics and learning, and a canonical data layer of local files.' }
    ],
    sections: [
      {
        heading: 'What it is',
        paragraphs: [
          'Career Ops is an open-source job-search agent by Santiago Fernández and a large contributor community. It runs inside whatever AI coding CLI you already use (Claude Code, Codex, OpenCode and others), keeps every piece of data in plain local files, and never submits an application: it finds, evaluates and drafts, then the human reviews and clicks.',
          'I run it as the engine of my own search. My work on top of it is the targeting profile, scoring overrides, house rules, a few helper scripts, and the review discipline described below. The three-stage agent team I built before adopting it is what taught me what to configure.'
        ]
      },
      {
        heading: 'The problem it solves',
        paragraphs: [
          'A serious search means watching dozens of career pages, reading postings that are mostly poor fits or ghost jobs, tailoring a CV for each real one, and keeping track of every reply. Done by hand it is slow and error-prone; done by a careless agent it produces mass applications with invented qualifications. Career Ops is built around the second failure mode: it spends model tokens only on judgment and writing, and it gates every generated claim against the source CV.'
        ]
      },
      {
        heading: 'Key capabilities',
        items: [
          'Job discovery through 130+ ATS and job-board provider modules (Greenhouse, Lever, Ashby, Workday, SmartRecruiters and many more).',
          'Zero-LLM-token scanning, filtering and deduplication, with a scan-history ledger so a posting is only surfaced once.',
          'Posting verification before any evaluation: a three-rung liveness check (public API, then browser, then a classifier) where "uncertain" is never treated as closed.',
          'AI evaluation with a structured A–H assessment and a 1–5 suitability score, including a posting-legitimacy block for scam and ghost-job signals.',
          'Parallel headless workers for batch processing, with reserved report numbers so parallel runs never collide.',
          'Tailored CV generation (HTML to PDF, or LaTeX), cover letters and application-form answers.',
          'Fact-verification gates: a claim that does not trace to the source CV is cut, and tool-of-trade authorship inflation is explicitly forbidden.',
          'Human-controlled submission: forms are pre-filled, then the tool stops.',
          'Application tracking, interview preparation, follow-up cadence, outcome recording and about forty read-only analytics scripts over the same files.'
        ]
      },
      {
        heading: 'Architecture highlights',
        items: [
          'No daemon and no server orchestrator. The AI CLI agent is the orchestrator, instructed by Markdown mode files, and the file system is the message bus.',
          'Deterministic Node scripts do everything that does not need judgment: scanning, dedup, merging, status changes, analytics. LLM calls are reserved for evaluation and writing.',
          'Multiple model backends behind the same prompts: the interactive CLI, headless Claude workers at three spend tiers, or direct runners for Gemini, OpenAI-compatible endpoints, local Ollama and OpenRouter.',
          'A two-layer data contract separates the auto-updatable system layer from the user layer (CV, profile, tracker, reports), so a system update physically cannot overwrite personal data.',
          'Human-readable files are the permanent source of truth; a SQLite index exists only as a derived, rebuildable view.',
          'Canonical write paths with locking and atomic writes for the tracker, plus an append-only status ledger that records when each transition happened.',
          'Trust boundaries: job postings and recruiter emails are data, never instructions; outbound HTTP has SSRF and IP guards; LLM-bound requests pass a PII interceptor; headless workers never get more write power than the web UI grants the same worker kind.'
        ]
      },
      {
        heading: 'Engineering decisions worth noticing',
        items: [
          'Liveness is conservative by design: a posting is closed only on authoritative evidence, and an aggregator listing (LinkedIn, Indeed, Wellfound) is unconfirmed until the same role is found on the employer’s own careers page.',
          'Batch prompts are byte-identical across offers so prompt caching works; triage runs on a deliberately tiny context of about two thousand tokens.',
          'Report numbers are claimed through sentinel files, not computed as max-plus-one, which is what made the parallel fan-out safe.',
          'Prompt-injection text inside a job description is reported as a legitimacy anomaly in the report instead of being obeyed.'
        ]
      },
      {
        heading: 'My work on top of it',
        items: [
          'Before adopting Career Ops I designed a three-stage Claude Code agent team: a Gmail digest reader, a job qualifier that scores each posting, and a resume customizer for everything above threshold, with strict source rules (one trusted feed, no outside enrichment, no claim that is not in the resume).',
          'Migrated that process onto Career Ops: targeting archetypes and narrative, scoring overrides, procedural house rules, and a small static pipeline page for review.',
          'Operate it interactively only, with every generated document reviewed before it leaves the machine, and with the fact gates run on each tailored CV.'
        ]
      }
    ],
    authorship: {
      designed: 'The three-stage pipeline and its source and fact rules; the targeting profile and house rules in Career Ops; review of every generated document.',
      wrote: 'Agents wrote the pipeline stages and scorer, plus my Career Ops customizations and helper scripts.',
      credit: 'Career Ops itself is by Santiago Fernández and its contributors. The architecture described here is theirs; the infographics are my reading of the published codebase.'
    },
    links: [
      { label: 'career-ops on GitHub', href: 'https://github.com/santifer/career-ops' }
    ]
  },
  {
    id: 'jarvis',
    eyebrow: 'Jarvis · Python · Claude API · 2026',
    title: 'Jarvis',
    subtitle: 'A local voice assistant that delegates real computer work to Claude Code and reads the result aloud.',
    badges: ['Python', 'Claude API', 'faster-whisper', 'Silero VAD', 'Piper TTS', 'openWakeWord', 'FastAPI + PWA', 'Google Workspace APIs', 'Raspberry Pi'],
    sections: [
      {
        heading: 'What it is',
        paragraphs: [
          'Jarvis is a desk assistant that listens for a wake word, transcribes speech locally, answers through a Claude model with a registry of tools, and speaks the reply while it is still being generated. For anything that touches the file system or a shell, it hands the task to Claude Code running headless and reads the result back in one to three sentences.'
        ]
      },
      {
        heading: 'The problem it solves',
        paragraphs: [
          'Most voice assistants stop at answering questions. I wanted one that could do work on my own machine and in my own accounts, safely, without a cloud intermediary for the audio and without being able to quietly rewrite itself.'
        ]
      },
      {
        heading: 'Key capabilities',
        items: [
          'Whole voice loop on the machine: "hey Jarvis" wake word, speech-to-text with end-of-speech detection, streamed text-to-speech.',
          'Delegation to Claude Code in headless mode for file, shell and scripting tasks.',
          'Google Workspace by voice: calendar, Gmail across several accounts and send-as aliases, contacts.',
          'Weather, traffic-aware directions, local business search, web research and page reading.',
          'Voice control of a household to-do board that runs on a Raspberry Pi.',
          'A phone client: a progressive web app posts audio to a FastAPI endpoint with token auth and continues the same conversation that started at the desk.',
          'Long-term memory folded into the system prompt; self-diagnosis from its own logs and network checks.'
        ]
      },
      {
        heading: 'Engineering decisions',
        items: [
          'Capability extension is gated. A delegated task may read anything and write almost anywhere, but the tool registry, orchestrator, voice pipeline and memory are protected paths unless an explicit builder mode is engaged; builds can be reverted with one command.',
          'The subagent is told its stdout will be spoken, so it answers in plain sentences with no markdown, and it may not ask follow-up questions because no one is reading a screen.',
          'Text-to-speech runs in a worker thread fed with partial model output, so the reply starts within a sentence instead of after the whole answer is generated. Wake and dismiss acknowledgments are pre-rendered at startup for instant playback.',
          'The phone server shares the same conversation, client and tool registry as the desktop loop, with a lock serialising turns so the two can never interleave on one conversation.'
        ]
      }
    ],
    authorship: {
      designed: 'Overall system design and the feature set; research and selection of the speech stack; QA of every build and verification that agent output matched the brief.',
      wrote: 'Agents wrote essentially all of the code: voice pipeline, tool registry, Google integrations, builder mode and the phone server.'
    },
    note: 'Private project. The 11-second voice demo on the card is the public artifact.'
  },
  {
    id: 'stationscript',
    eyebrow: 'StationScript · Godot 4.7 + Python 3.12 · released 2026-11-01',
    title: 'StationScript',
    subtitle: 'Build a space factory. Program every machine in real Python.',
    badges: ['Godot 4.7', 'GDScript', 'Python 3.12 (bundled)', 'Windows installer', 'itch.io'],
    screenshots: [
      { src: 'assets/stationscript-factory.webp?v=45e9ae2c', alt: 'Factory floor with named machines joined by conveyors, each showing a three-star grade', caption: 'A late-game factory: ore line, smelters, test bench, market uplink.' },
      { src: 'assets/stationscript-editor.webp?v=1b0b5556', alt: 'In-game code editor with a brief on the left and a Python function on the right', caption: 'Every programmable machine opens into a brief, an editor and a step debugger.' },
      { src: 'assets/stationscript-grade.webp?v=d58e48fe', alt: 'Grade report showing three stars, test results and a reference solution', caption: 'Code is graded on correctness and clarity first, with speed, memory, robustness and security unlocking later.' }
    ],
    sections: [
      {
        heading: 'What it is',
        paragraphs: [
          'StationScript is an automation game where the machines run real Python that the player writes. Place machines on a factory floor in space, drag conveyors between them, power them from solar arrays, then open any machine and write the function that runs it. Working code brings the machine online; code that is fast, robust and clear earns stars, and the machine visibly runs better for it.'
        ]
      },
      {
        heading: 'The problem it solves',
        paragraphs: [
          'Learning to code is dull when the exercises are abstract. Here the Python has a job: a sloppy sorter starves the smelters, a bad airlock check vents the station. A guided tutorial teaches the basics as you play, and short lessons arrive with each new machine, so someone who has never coded can reach regular expressions without ever leaving the game.'
        ]
      },
      {
        heading: 'Key capabilities',
        items: [
          '20+ programmable machines: reactors, airlocks, power routers, ore scanners, sorters, smelters, ledgers, crew rosters, salvage bays.',
          'Real Python 3.12 bundled with the game, so nothing else needs installing.',
          'Code graded on correctness, speed, robustness and clarity; the grade changes how the machine performs.',
          'Progression from a small skiff to a production carrier that hauls the whole factory; trade ships, pirate raids, upgrades, a market and a final megaproject.',
          '24 achievements, multiple save slots, an ambient soundtrack.'
        ]
      },
      {
        heading: 'Engineering decisions',
        items: [
          'Specialisation as a mechanic: a smelter fed the same ingot in a row gets faster and makes better-quality output, so a sorted line pays and the grading has a visible economic consequence.',
          'Upgrades cost credits and one correctly answered Python question, so the quiz is woven into the economy rather than bolted on.',
          'The test harness drives the real game and the real Python worker headless, and can save screenshots, so a build can be checked end to end without a person at the keyboard.',
          'First prototype on 2026-10-22, 1.0 Windows installer on 2026-11-01: ten days from a one-machine smelter to a shipped game.'
        ]
      }
    ],
    authorship: {
      designed: 'The game concept, machine roster, progression and the code-grading model; playtesting and QA of every build.',
      wrote: 'Agents wrote the Godot scenes and scripts, the Python grading harness, the tutorial system, save slots and the installer.'
    },
    links: [
      { label: 'StationScript on itch.io', href: 'https://sadco-studios.itch.io/stationscript' }
    ]
  }
];
