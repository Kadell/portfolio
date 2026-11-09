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
  },
  {
    id: 'simplepath',
    eyebrow: 'SimplePath Learning · Next.js · Prisma · PostgreSQL · Claude API · Stripe · 2026',
    title: 'SimplePath',
    subtitle: 'A multi-tenant homeschool curriculum platform: one codebase, several branded schools, an AI teacher that parents can read.',
    badges: ['Next.js', 'TypeScript', 'Prisma + PostgreSQL', 'Claude API', 'Stripe', 'Auth.js', 'Playwright', 'Railway'],
    screenshots: [
      { src: 'assets/simplepath-demo.webp?v=b81e4990', alt: 'A third grader\'s daily checklist for Math, Reading and Writing next to an AI Teacher chat panel', caption: 'A school day is one checklist per subject, with the AI teacher a click away. Parents can review every conversation.' },
      { src: 'assets/simplepath-grade3.webp?v=f4874036', alt: 'Third-grade curriculum page listing Math 3 and Reading 3 with their unit outlines', caption: 'Every grade page lists each subject\'s whole year: 180 daily lessons per course, unit by unit.' },
      { src: 'assets/simplepath-pricing.webp?v=81b94a4f', alt: 'Pricing page with a free Grade 1 plan, monthly and annual Full Access plans and an SAT add-on marked coming soon', caption: 'One flat household price. Entitlements, not per-seat licences, decide what a family can open.' },
      { src: 'assets/simplepath-lessons.webp?v=3fb351ad', position: 'top', alt: 'Marketing infographic: how lessons work as a child grows, from parent-led Pre-K to self-directed high school with the AI teacher as tutor', caption: 'How a day changes with age: the parent starts as the teacher and becomes the coach.' }
    ],
    sections: [
      {
        heading: 'What it is',
        paragraphs: [
          'SimplePath Learning is a complete Pre-K to 12 online homeschool curriculum, live at simplepathhomeschool.com. A student\'s day is one checklist: read, worksheet, quiz, activity, and an AI teacher to ask when stuck. Parents see progress, attendance and a printable report card, and can read every AI conversation their child has had.',
          'Underneath, it is one platform serving several schools. The same codebase and the same database can host a secular school, a faith-based school with a Bible course, and a STEM school with coding, each on its own domain with its own theme, copy, course lineup, pricing and AI-teacher persona.'
        ]
      },
      {
        heading: 'The problem it solves',
        paragraphs: [
          'Homeschool platforms either charge per child per month or hand parents a pile of links and leave the planning to them. SimplePath is built around the opposite: a full academic year of daily lessons already sequenced, one household price for any number of students, and an AI teacher that helps without ever being hidden from the parent.'
        ]
      },
      {
        heading: 'Key capabilities',
        items: [
          '117 shared courses, 180 published lesson days each (30 for the SAT course): about 20,900 days of lessons, worksheets and quizzes across 14 grade programs.',
          'Grade programs bundle five core subjects; each course keeps its own current day and auto-advances when the day\'s blocks are complete, so siblings in different grades run from the same dashboard.',
          'Streaming AI teacher with the tenant\'s persona, the student\'s grade and today\'s lesson injected; Socratic on quizzes rather than giving answers.',
          'Per-student daily message caps and per-household monthly token budgets, enforced server-side; every conversation logged and visible to the parent.',
          'Attendance days and estimated hours rolled up from completed blocks; printable report cards; transcript records in the schema.',
          'Stripe Checkout with webhook fulfilment, cancellation and past-due handling; a dev billing provider grants entitlements instantly so the whole purchase flow is clickable without keys.',
          'Free Grade 1 and the first ten days of every other grade, gated by the same entitlement system as paid access.'
        ]
      },
      {
        heading: 'Architecture highlights',
        items: [
          'Hostname-based tenancy: middleware classifies the request host (a tenant subdomain in development, a custom domain in production, a separate admin host) and forwards it; the tenant row is resolved once per request.',
          'A tenant-scoped data-access layer. Application code never queries tenant-scoped tables through the ORM directly; every helper injects the tenant id, so a cross-tenant query is a visible code smell rather than a silent leak.',
          'Curriculum is authored once at platform level and shared. Tenants opt in per course; tenant-specific tweaks are overlay blocks that override a shared block, never a forked copy.',
          'Theming through CSS variables stored per tenant and injected on the root element, so one component library renders every school.',
          'Tenant domains are owned by configuration, not database rows: an environment variable is the source of truth and is re-asserted on every server start, so a dump-and-restore cannot silently redirect a school.',
          'Both external dependencies degrade to labelled local modes: without an API key the AI teacher runs in a clearly marked mock mode, without Stripe keys purchases grant entitlements instantly.'
        ]
      },
      {
        heading: 'Engineering decisions worth noticing',
        items: [
          'The content pipeline uses the Anthropic API to draft original lesson days into a review queue. External links are chosen only from a curated registry of open resources (CK-12, Khan Academy, Project Gutenberg, PhET, OpenStax and others); the model never invents a URL, and licence and attribution metadata is stored on every link.',
          'Drafts follow written grade-level standards and a content-depth standard after an audit found early lessons drifting above grade and daily text collapsing to a topic label; the standards are inlined into the generation prompt so any future authoring path inherits them.',
          'The seed script refuses to run against a non-empty database. Schema migrations apply on every deploy; authored curriculum moves only by dump and restore. The two are kept apart on purpose because confusing them would overwrite a year of content with a demo fixture.',
          'A November 2026 marketing audit counted 97 distinct capabilities and classified each as available, limited, conditional, in development, planned, disabled or admin-only, so the public site never claims a feature the code does not support.'
        ]
      }
    ],
    authorship: {
      designed: 'The product and its pricing model, the tenant and entitlement architecture, the curriculum structure and pacing, the parent-visibility and AI-budget rules; QA of every build and review of published content.',
      wrote: 'Agents wrote the application code, the content pipeline and the lesson drafts, which were reviewed against the standards before publishing.'
    },
    links: [
      { label: 'simplepathhomeschool.com', href: 'https://simplepathhomeschool.com' }
    ]
  },
  {
    id: 'traderio',
    eyebrow: 'TraderIO · Python 3.12 · FastAPI · C# NinjaScript · Cloudflare Tunnel · 2026',
    title: 'TraderIO',
    subtitle: 'A webhook-to-broker order router that decides which account should take a trade, and refuses the ones that should not.',
    badges: ['Python 3.12', 'FastAPI', 'C# / NinjaScript', 'NinjaTrader 8', 'Cloudflare Tunnel', 'Google Sheets API', 'Gmail API', 'Windows service (NSSM)', 'pytest'],
    gallery: [
      { id: 'signal', label: 'Signal path', title: 'TraderIO — The Signal Path', src: 'assets/infographics/traderio-signal-path.svg?v=9fcfe124', alt: 'Ten stages from a TradingView alert through tunnel, receiver, parser, rules and rotation to the NinjaTrader AddOns, with account state fed back.' },
      { id: 'gates', label: 'Gates & rotation', title: 'TraderIO — Safety Gates and Rotation', src: 'assets/infographics/traderio-gates.svg?v=46742e13', alt: 'Five independent gates an order must pass, and the hard-gate-then-weighted-score method that picks an account.' },
      { id: 'arch', label: 'Architecture', title: 'TraderIO — Under the Hood', src: 'assets/infographics/traderio-architecture.svg?v=62c21580', alt: 'Edge, service, execution and records groups, with the Python router in the middle and two C# AddOns inside NinjaTrader.' }
    ],
    sections: [
      {
        heading: 'What it is',
        paragraphs: [
          'TraderIO receives TradingView strategy alerts over a webhook, filters them with declarative rules, chooses which of several prop-firm futures accounts should take the trade, and places a protected order through a NinjaTrader AddOn: market entry plus stop, partial exits at each target, breakeven after the first two, and a flatten that also sweeps working orders. A second AddOn streams every account\'s state back so the router always knows what each account is holding.',
          'It replaced an n8n flow, then a hosted relay service, then a direct broker API, and the earlier backends still exist behind a config flag. It has run around the clock as an auto-restarting Windows service since mid-2026.'
        ]
      },
      {
        heading: 'The problem it solves',
        paragraphs: [
          'Prop-firm evaluation and funded accounts each carry their own drawdown limits, daily caps, profit targets, renewal deadlines and inactivity rules. Routing every signal to every account breaks accounts; routing by hand is slow and inconsistent. The router encodes the rules once, scores the candidates, and logs the reason for every decision. Because real money moves, the design assumes any component can be wrong and keeps the gates independent of each other.'
        ]
      },
      {
        heading: 'Key capabilities',
        items: [
          'Webhook receiver with a shared secret that answers 200 immediately and processes in the background, so a slow downstream call can never make TradingView time out or retry.',
          'Entry parsing over free text that fails closed: an unreadable payload is rejected and logged, never guessed at.',
          'Filter rules in YAML (direction, symbol allow-list, any field, several time-of-day windows), re-read per signal so an edit applies to the next alert without a restart.',
          'Account rotation in two layers: hard gates remove ineligible accounts, then a weighted score ranks the rest by evaluation urgency, progress to target, drawdown headroom, session activity and an inactivity deadline.',
          'Protective order lifecycle through the Receiver AddOn, and an orphaned-stop sweep that cancels a resting stop by order id when a position is closed externally, because a stop with no position is an entry.',
          'A live dashboard showing the rotation queue, why each account ranks where it does, per-account risk state, unmanaged positions and inactivity deadlines.',
          'Google Sheets audit and trade logs, a daily recap emailed at the close, and a test bench that fires real signals at the live pipeline, labelled so they never look like real alerts.'
        ]
      },
      {
        heading: 'Architecture highlights',
        items: [
          'The Cloudflare tunnel publishes exactly one anchored path, the webhook. Dashboard, API and test pages are refused at the edge with a 404 rather than protected only by the shared secret.',
          'A broker seam: upstream code produces a broker-agnostic trade intent (entry, exit, breakeven, cancel, flatten) and the active backend is a config flag. Swapping NinjaTrader for the direct Tradovate API touches nothing upstream.',
          'Forwarding happens before any Sheets write, and logging is queued off-thread, so nothing that touches Google can delay an order.',
          'Scoring is pure and does no I/O, so it is fully unit-tested. The account feed from the Sync AddOn is treated as authoritative: it corrects position ownership, advances drawdown tracking and counts trades placed by hand.',
          'The two C# AddOns live in the Python repository so the JSON contract and the client that speaks it are versioned together and cannot drift unnoticed. An install script warns when the copies NinjaTrader compiles have diverged.',
          'Futures contract resolution picks the front month by traded volume, cached and refreshed only during the daily maintenance break, so an entry and its exit always name the same contract and the order path never waits on a lookup.'
        ]
      },
      {
        heading: 'Engineering decisions worth noticing',
        items: [
          'Five independent gates: the router\'s dry-run default, the filter rules, rotation eligibility, the AddOn\'s account allowlist and the AddOn\'s own dry-run. The last two live inside NinjaTrader where the service cannot change them, which is deliberate.',
          'The router never claims a trade it did not place. A position with no ownership record was opened by hand or by an outside force; claiming it would mean flattening it on the next reversal. Those positions are reported as unmanaged instead, in the dashboard and the daily recap.',
          'The inactivity rule counts weekdays since the last real fill from the execution feed, not from routing decisions, because a routed order can still be refused downstream. At full urgency it is the largest factor in the scorer, and it saturates past the deadline so accounts already in breach are not ranked against each other.',
          'A rejected signal flattens only the position the router itself opened. An earlier version sent a flatten with no account list, which was the AddOn\'s kill switch for every allowlisted account including hand-placed trades; the fix is documented in the README as an incident, with its reasoning.',
          'Operating notes record the failures that shaped the design: an 18-minute outage when the tunnel service was installed with no arguments, a log line that fired 2,935 times in one evening while a routed short sat unmanaged, and the contract-roll check scheduled before the first real expiry.'
        ]
      }
    ],
    authorship: {
      designed: 'The signal path, the gate model, the rotation rules and their weights, the ownership and inactivity rules, and the operating procedures; ran it live and turned each incident into a documented rule.',
      wrote: 'Agents wrote the Python service, the two NinjaScript AddOns, the dashboard and the 765 tests.'
    },
    note: 'Private project; the infographics above are the public artifact. No account data appears anywhere on this site.'
  },
  {
    id: 'landfinder',
    eyebrow: 'LandFinder · Python 3.12 · PostgreSQL + PostGIS · Claude API · Playwright · Tesseract · 2026',
    title: 'LandFinder',
    subtitle: 'A county land-opportunity pipeline that uses a language model for reading notices and deterministic code for everything else.',
    badges: ['Python 3.12', 'PostgreSQL + PostGIS', 'Claude API', 'Playwright', 'pdfplumber', 'Tesseract OCR', 'pandas / Excel', 'pytest'],
    gallery: [
      { id: 'pipeline', label: 'Pipeline', title: 'LandFinder — Seven Stages, One Model Call', src: 'assets/infographics/landfinder-pipeline.svg?v=6df925a7', alt: 'Ingest, parse, enrich, match, score, report and alert, from public records to a hand-verified lead list, with the model used only in parse.' },
      { id: 'sources', label: 'Sources & guardrails', title: 'LandFinder — Data Sources and Guardrails', src: 'assets/infographics/landfinder-sources.svg?v=e0fae6a0', alt: 'Five data sources with method and risk level beside eight guardrails designed into the pipeline.' }
    ],
    sections: [
      {
        heading: 'What it is',
        paragraphs: [
          'LandFinder finds land and acquisition opportunities in Walker County, Georgia: tax sales, foreclosure of the right to redeem, sheriff sales, estate and probate notices, vacant rural acreage and absentee owners. Public records go in; a weekly, reviewable database and a ranked spreadsheet come out. It is a Phase 1 MVP built in May 2026: a Docker-free Python pipeline over local PostgreSQL and PostGIS, with the Claude API reading the notices.'
        ]
      },
      {
        heading: 'The problem it solves',
        paragraphs: [
          'The information is public but scattered across PDFs, flipbook newspapers and legal-notice portals, in prose written for lawyers. Reading it weekly by hand does not scale, and a careless scraper would breach terms of use or redistribute content it has no right to. The pipeline reads once, structures what it reads, scores deterministically, and leaves the final checks to a person.'
        ]
      },
      {
        heading: 'Key capabilities',
        items: [
          'Four feeds: the county tax commissioner\'s tax-sale PDFs, county public notices, a statewide legal-notice portal queried for one county only, and the local newspaper\'s e-edition.',
          'Text extraction with pdfplumber, OCR with Tesseract for scanned pages, rules-based classification of each notice, then Claude extraction of parcel id, owner, defendant, address, sale date, redemption expiration, amount and a confidence value.',
          'Parcel enrichment from a licensed county shapefile imported into PostGIS, with owner flags such as absentee and acreage derived from the geometry.',
          'Matching that tracks tax sales over time and pairs right-to-redeem notices with the earlier sale they relate to.',
          'Opportunity and lead scores, then top-ten lists by acreage, tax sale, redemption and absentee owner, written to CSV and Excel each week; optional Discord alerts for new high-score leads.',
          'A database-free quick start that needs only the newspaper feed and an API key, and still runs without the key by dumping the legal pages\' text with no structured rows.'
        ]
      },
      {
        heading: 'Architecture highlights',
        items: [
          'Seven stages behind one CLI, runnable one at a time or as run-all, so a failing stage can be re-run alone.',
          'Raw bytes are stored content-addressed and deduplicated, and every write is an upsert, so the weekly re-run is idempotent and safe to schedule.',
          'The model is used in exactly one place, after rules classification has run, and its output carries a confidence column. Scoring, matching and redemption-date arithmetic are plain Python with unit tests.',
          'Enrichment is skipped gracefully until the shapefile is imported, so notice-based leads flow to the report from day one.',
          'JavaScript-driven sources are read through Playwright with their selectors centralised at the top of each scraper, plus inspect commands that save the live DOM for tuning.'
        ]
      },
      {
        heading: 'Engineering decisions worth noticing',
        items: [
          'Legal guardrails are design decisions, not a disclaimer: every scraper throttles and identifies itself, the legal-notice portal is queried county-scoped and read-only, notice content is never redistributed, the assessor site is not mass-scraped and the deeds registry is not automated. Those two are reserved for manual per-lead verification.',
          'The parcel data is purchased and used under its licence rather than scraped from the assessor.',
          'Phase 2 items were deferred explicitly: Docker packaging, an interactive map over the geometry already stored, and AI-generated owner outreach letters.'
        ]
      }
    ],
    authorship: {
      designed: 'The pipeline stages, the choice of data sources and their risk assessment, the legal guardrails, and the decision to keep the model out of scoring.',
      wrote: 'Agents wrote the scrapers, extraction and parsing code, the PostGIS enrichment, scoring and the weekly report.'
    },
    note: 'Private project; the infographics above are the public artifact.'
  }
];
