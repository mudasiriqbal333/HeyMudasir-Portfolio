// @ts-check
/**
 * The Research page: the MSc dissertation in words, numbers and charts.
 *
 * Every number below is the dissertation's own (its tables I-IV and figures
 * 2 and 3). The claims panel counts its numbers itself from claims.json, the
 * per-claim results of the frozen runs, and research.test.js recomputes the
 * numbers stated here from that same file, so the two can never disagree.
 * To refresh claims.json, see project-notes/research.md.
 */

export const researchPaper = {
  title: 'Detecting natural hallucinations in local RAG',
  subtitle: 'Span detectors, LLM judges, and the limits of ensembling',
  kind: 'MSc AI dissertation',
  institution: 'Queen Mary University of London',
  supervisor: 'Syed Rafee',
  year: '2026',
  //? The submitted PDF, served as it is
  pdf: '/research/moiz-shahid-msc-ai-dissertation.pdf',
  pages: 11,
};

/** The opening section, in the case pages' description layout. */
export const researchAbstract = {
  label: 'The study',
  lead: 'Grounding answers in documents does not stop a language model from inventing things, so I tested whether today’s hallucination detectors catch the mistakes a careful, fully local RAG system makes on its own.',
  body: [
    'I built a retrieval-augmented question-answering system that runs entirely on one laptop, over six UK government guidance documents, the “coloured books” such as HM Treasury’s Green Book. Its answers to 100 test questions broke down into 346 short claims, and I labelled every one against the passages it was based on: green when they support it, yellow when they only partly do, red when they do not.',
    'Five ways of checking those claims were then compared on exactly the same answers: a span detector trained on the RAGTruth benchmark, an LLM judge from three model families, and three ways of combining the two. Everything ran on 7 to 9 billion parameter models, the setting open to a government team that cannot send its documents to an external API.',
  ],
  builtLabel: 'Contributions',
  built: [
    'A hand-labelled set of 345 claims from 100 questions',
    'Five verification systems compared on frozen answers',
    'Three judge families, the third pre-registered',
    'Why a benchmark-trained span detector misses natural errors',
    'Judge families catch different errors: union beats agreement',
    'The cost and the blind spot of a screening cascade',
  ],
};

/** The findings, as numbers counted up when they come into view. */
export const researchNumbers = [
  {
    value: 12.2,
    decimals: 1,
    after: '%',
    text: 'of the claims were hallucinations, 42 of 345, mostly subtle and mostly in ordinary questions',
  },
  {
    value: 40,
    after: '/42',
    text: 'hallucinated claims got no span at all from the benchmark-trained detector',
  },
  {
    value: 38.1,
    decimals: 1,
    after: '%',
    text: 'F1 when two judge families and the span detector flag together, against 26.1% for the best single judge',
  },
  {
    value: 0,
    after: '/10',
    text: 'real errors among the claims all three judges flagged together',
  },
];

/** The research questions and what the study found. */
export const researchQuestions = [
  {
    no: '01',
    question:
      'How often, and where, does a well-built local RAG system hallucinate?',
    answer:
      'In 12.2% of its claims, and 33 of those 42 come from ordinary answerable questions: correct facts joined the wrong way, “should” turned into “must”, one document’s words given to another.',
  },
  {
    no: '02',
    question:
      'How well do a span detector and an LLM judge catch these natural errors?',
    answer:
      'Barely. The span detector flags 2 of 42, near chance. Each 8B judge catches 6 to 9, with at best one true alarm in three.',
  },
  {
    no: '03',
    question: 'Do combinations of the two do better than either alone?',
    answer:
      'Not the ones designed: a silent member pulls every rule down to the judge alone. What helps is a union of judges from different families.',
  },
  {
    no: '04',
    question: 'What do the trade-offs between cost and accuracy look like?',
    answer:
      'A screening cascade cuts LLM calls by 99%, from 345 to 2, and catches almost nothing, because a cascade can never see more than its screener.',
  },
];

/**
 * The pipeline, as in the paper's figure 1. `llm` marks a step run by a
 * language model; `out` marks a stage's result.
 */
export const researchPipeline = [
  {
    key: 'A',
    title: 'Ingestion',
    note: 'offline, once',
    steps: [
      { title: 'Corpus', detail: '6 documents · 721 pages' },
      { title: 'Cleaning', detail: 'pdfplumber · audited page by page' },
      { title: 'Chunking', detail: 'heading-aware · 1,000 / 150' },
      {
        title: 'Index',
        detail: '2,473 chunks · bge-large-en-v1.5 in Chroma, and BM25',
        out: true,
      },
    ],
  },
  {
    key: 'B',
    title: 'Answering',
    note: 'one pass per question, then frozen',
    steps: [
      { title: 'Questions', detail: '100 · five types' },
      { title: 'Hybrid retriever', detail: 'dense 20 ∪ BM25 20' },
      { title: 'Reranker', detail: 'bge-reranker-v2-m3 · top 5' },
      { title: 'Generator', detail: 'Llama-3.1-8B · temperature 0', llm: true },
      {
        title: 'Claim extractor',
        detail: 'Qwen2.5-14B · two guards',
        llm: true,
      },
      { title: '346 claims', detail: 'with their top-5 passages', out: true },
    ],
  },
  {
    key: 'C',
    title: 'Verification',
    note: 'every claim, three judge runs',
    steps: [
      { title: 'Claim', detail: '+ top-5 passages + question' },
      { title: 'S1 · S2', detail: 'span detector · LLM judge', llm: true },
      { title: 'S3 · S4 · S5', detail: 'AND · vote · cascade' },
      { title: 'Verdict', detail: 'green · yellow · red', out: true },
    ],
  },
];

/** The three labels, and what each means for a claim in use. */
export const researchLabels = [
  {
    key: 'g',
    name: 'Green',
    meaning: 'Supported',
    text: 'Stated in the passages, or follows directly from them.',
    action: 'Pass',
    count: 303,
  },
  {
    key: 'y',
    name: 'Yellow',
    meaning: 'Partly supported',
    text: 'A true core with an ungrounded addition, overstated certainty or the wrong source.',
    action: 'Human review',
    count: 27,
  },
  {
    key: 'r',
    name: 'Red',
    meaning: 'Unsupported',
    text: 'Absent from the passages, or contradicted by them.',
    action: 'Block',
    count: 15,
  },
];

/** The five verification systems. */
export const researchSystems = [
  {
    key: 'S1',
    name: 'Span detector',
    tool: 'LettuceDetect',
    text: 'A ModernBERT token classifier trained on RAGTruth. The share of the claim it marks as unsupported sets the label.',
    calls: '0 LLM calls',
  },
  {
    key: 'S2',
    name: 'LLM judge',
    tool: 'Llama · Qwen · Gemma',
    text: 'Reasons first, then labels the claim against its passages, in JSON. One run per model family.',
    calls: '1 call a claim',
  },
  {
    key: 'S3',
    name: 'AND',
    tool: 'S1 + S2',
    text: 'Both run, and the worse label wins.',
    calls: '1 call a claim',
  },
  {
    key: 'S4',
    name: 'Vote',
    tool: 'S1 + S2',
    text: 'Agreement keeps the label; any disagreement goes to human review.',
    calls: '1 call a claim',
  },
  {
    key: 'S5',
    name: 'Cascade',
    tool: 'S1, then S2',
    text: 'The span detector screens every claim; only what it flags reaches the judge.',
    calls: '0.006 calls a claim',
  },
];

/** The three judge families, in the order they were run. */
export const researchJudges = [
  { key: 'llama', name: 'Llama-3.1-8B', short: 'Llama', run: 'Run 1' },
  { key: 'qwen', name: 'Qwen2.5-7B', short: 'Qwen', run: 'Run 2' },
  {
    key: 'gemma',
    name: 'Gemma-2-9B',
    short: 'Gemma',
    run: 'Run 3, pre-registered',
  },
];

/**
 * Table I: the flag task, by system and judge (positive = gold yellow or red,
 * 42 of 345). The span detector does not depend on the judge.
 * Each cell: [flagged, true positives, false positives, P%, R%, F1%].
 */
export const researchFlagTable = [
  { key: 'S1', name: 'Span detector', all: [2, 2, 0, 100, 4.8, 9.1] },
  {
    key: 'S2',
    name: 'LLM judge',
    llama: [25, 6, 19, 24.0, 14.3, 17.9],
    qwen: [27, 9, 18, 33.3, 21.4, 26.1],
    gemma: [36, 7, 29, 19.4, 16.7, 17.9],
  },
  {
    key: 'S3',
    name: 'AND',
    llama: [26, 7, 19, 26.9, 16.7, 20.6],
    qwen: [29, 11, 18, 37.9, 26.2, 31.0],
    gemma: [37, 8, 29, 21.6, 19.0, 20.3],
  },
  {
    key: 'S4',
    name: 'Vote',
    llama: [26, 7, 19, 26.9, 16.7, 20.6],
    qwen: [29, 11, 18, 37.9, 26.2, 31.0],
    gemma: [37, 8, 29, 21.6, 19.0, 20.3],
  },
  {
    key: 'S5',
    name: 'Cascade',
    llama: [1, 1, 0, 100, 2.4, 4.7],
    qwen: [0, 0, 0, null, 0, 0],
    gemma: [1, 1, 0, 100, 2.4, 4.7],
  },
];

/**
 * Figure 2: which claims the three judges flag, as Venn regions. `only`
 * counts are claims flagged by that judge alone; pairs and `all` count claims
 * flagged by exactly those judges.
 */
export const researchOverlap = {
  catches: {
    label: 'True alarms',
    of: 42,
    regions: {
      llama: 2,
      qwen: 8,
      gemma: 2,
      'llama+qwen': 0,
      'llama+gemma': 4,
      'qwen+gemma': 1,
      all: 0,
    },
  },
  falseAlarms: {
    label: 'False alarms',
    of: 303,
    regions: {
      llama: 5,
      qwen: 4,
      gemma: 13,
      'llama+qwen': 1,
      'llama+gemma': 3,
      'qwen+gemma': 3,
      all: 10,
    },
  },
};

/**
 * Table II: ways of combining the judges, best first. `kind` sets the bar's
 * colour: a union of flags, one judge alone, or a rule that needs agreement.
 * Each: [flagged, true positives, false positives, P%, R%, F1%].
 */
export const researchCombinations = [
  {
    name: 'Llama or Qwen or span detector',
    kind: 'union',
    cells: [42, 16, 26, 38.1, 38.1, 38.1],
  },
  {
    name: 'Llama or Qwen',
    kind: 'union',
    cells: [41, 15, 26, 36.6, 35.7, 36.1],
  },
  {
    name: 'Any of the three judges',
    kind: 'union',
    cells: [56, 17, 39, 30.4, 40.5, 34.7],
  },
  { name: 'Qwen alone', kind: 'single', cells: [27, 9, 18, 33.3, 21.4, 26.1] },
  {
    name: 'Llama alone',
    kind: 'single',
    cells: [25, 6, 19, 24.0, 14.3, 17.9],
  },
  {
    name: 'Gemma alone',
    kind: 'single',
    cells: [36, 7, 29, 19.4, 16.7, 17.9],
  },
  {
    name: 'Two of the three agree',
    kind: 'agreement',
    cells: [22, 5, 17, 22.7, 11.9, 15.6],
  },
  {
    name: 'Llama and Qwen agree',
    kind: 'agreement',
    cells: [11, 0, 11, 0, 0, 0],
  },
  {
    name: 'All three agree',
    kind: 'agreement',
    cells: [10, 0, 10, 0, 0, 0],
  },
];

/**
 * Tables I and III: precision with every claim, and without the 23
 * meta-claims (statements about what the sources do or do not say).
 */
export const researchMetaClaims = {
  count: 23,
  rows: [
    { name: 'Llama', all: 24.0, without: 41.7 },
    { name: 'Qwen', all: 33.3, without: 69.2 },
    { name: 'Gemma', all: 19.4, without: 27.3 },
    { name: 'Llama or Qwen', all: 36.6, without: 58.3 },
  ],
  //? Of each judge's false alarms, how many were meta-claims
  share: [
    { name: 'Llama', label: 'Llama’s false alarms', meta: 12, of: 19 },
    { name: 'Qwen', label: 'Qwen’s false alarms', meta: 14, of: 18 },
    {
      name: 'shared by both',
      label: 'Shared false alarms',
      meta: 10,
      of: 11,
    },
  ],
};

/** Table IV: the 42 gold non-green claims by kind of error. */
export const researchTaxonomy = [
  {
    key: 'wrong-attachment',
    name: 'Wrong attachment',
    text: 'Every fact is in the passages, joined the wrong way.',
    red: 11,
    yellow: 5,
    caught: 7,
  },
  {
    key: 'overstatement',
    name: 'Overstated certainty or scope',
    text: '“Should” becomes “must”, or the claim reaches further than the source.',
    red: 0,
    yellow: 11,
    caught: 5,
  },
  {
    key: 'cross-document',
    name: 'Cross-document blending',
    text: 'One document’s wording given to another.',
    red: 1,
    yellow: 5,
    caught: 2,
  },
  {
    key: 'premise-echo',
    name: 'Premise echoes',
    text: 'A trap question’s false premise, repeated as fact.',
    red: 1,
    yellow: 4,
    caught: 2,
  },
  {
    key: 'numeric',
    name: 'Numbers and lists',
    text: 'A formula, figure or enumeration corrupted.',
    red: 2,
    yellow: 1,
    caught: 1,
  },
  {
    key: 'meta',
    name: 'Meta-claims',
    text: 'A claim about what the sources say.',
    red: 0,
    yellow: 1,
    caught: 1,
  },
];

/** Section IV-D: what the screening cascade saves, and what it misses. */
export const researchCascade = [
  { label: 'LLM calls', from: '345', to: '2', note: '99% fewer', tone: 'gain' },
  {
    label: 'Time per claim',
    from: '5–7 s',
    to: '0.7–1.9 s',
    note: 'depending on the judge',
    tone: 'gain',
  },
  {
    label: 'Errors caught',
    from: 'up to 11',
    to: '0–1',
    note: 'of the 42',
    tone: 'loss',
  },
];

/**
 * Section IV-B and appendix B: the span detector flags a claim when any span
 * it marks reaches the threshold; the systems use 0.3. Only 2 of the 345
 * claims get a span at all, both of them real errors from one question.
 */
export const researchSweep = {
  errors: 42,
  auroc: 0.524,
  rows: [
    { t: '0.001', flagged: 2 },
    { t: '0.05', flagged: 2 },
    { t: '0.1', flagged: 2 },
    { t: '0.2', flagged: 2 },
    { t: '0.3', flagged: 2, used: true },
    { t: '0.5', flagged: 2 },
    { t: '0.7', flagged: 1 },
    { t: '0.9', flagged: 0 },
  ],
};

/** What the study found, in order, each told beside its chart. */
export const researchResults = [
  {
    no: '01',
    chart: 'taxonomy',
    title: 'The errors are correct facts, joined the wrong way',
    text: [
      'I coded all 42 errors by hand. The most common is wrong attachment: every fact is in the passages, but they are put together wrongly. One answer attached the Teal Book’s risk-response definitions to the wrong categories, five red claims in which every word is supported.',
      'Next come overstatements, a “should” turned into a “must”, and one document’s wording given to another. 24 of the 42 were missed by every system under every judge.',
    ],
  },
  {
    no: '02',
    chart: 'sweep',
    title: 'The span detector is almost blind',
    text: [
      'LettuceDetect marked a span in only 2 of the 345 claims, both real errors from a single question. The other 40 errors got no span at all, so no threshold can rescue it: its AUROC is 0.524, close to a coin toss.',
      'It was trained on the more frequent mistakes of earlier, less reliable generators. When correct facts are joined the wrong way, no single word is wrong for it to mark.',
    ],
  },
  {
    no: '03',
    chart: 'systems',
    title: 'Every judge is weak, and weak in its own way',
    text: [
      'Each 8B judge flags 25 to 36 claims and is right one time in three at best. Qwen does best, catching 9 of the 42; Gemma, the pre-registered third family, flags the most and is right least often.',
      'Pairing a judge with the span detector changes almost nothing. With only two flags of its own, AND and vote collapse into the judge alone, and the cascade inherits the detector’s blindness.',
    ],
  },
  {
    no: '04',
    chart: 'overlap',
    title: 'Different families catch different errors',
    text: [
      'Llama and Qwen never catch the same error: 6 and 9 catches, none shared. Yet 11 of their false alarms are the same claims. Gemma, run last, mostly catches what Llama already caught, 4 of its 7.',
      'No error was caught by all three judges, and all 10 claims the three flag together are false alarms.',
    ],
  },
  {
    no: '05',
    chart: 'combinations',
    title: 'So flag what any judge flags',
    text: [
      'Because their catches differ and their false alarms repeat, the union of Llama and Qwen reaches 36.1% F1, 1.4 times the better judge alone, and the span detector’s extra catch lifts it to 38.1%. Requiring agreement does the opposite: it keeps exactly the shared mistakes.',
      'This was found after seeing the results, so it needs confirming on new data.',
    ],
  },
  {
    no: '06',
    chart: 'meta',
    title: 'Most false alarms are claims about the sources',
    text: [
      '23 claims say what the passages do or do not mention, such as “the passages do not mention X”. A judge looks for a passage that supports the claim, and an absence has none, so it flags them even when they are right.',
      'Set them aside and Llama’s and Qwen’s precision nearly doubles. Their wording gives them away, so they can go to a check of their own.',
    ],
  },
  {
    no: '07',
    chart: 'cascade',
    title: 'A cheap screen sees almost nothing',
    text: [
      'Letting the span detector screen every claim, and sending only what it flags to a judge, cuts LLM calls from 345 to 2 and the time per claim from 5–7 seconds to under 2.',
      'But a cascade never sees more than its screener. It catches 1 error under Llama and Gemma and none under Qwen, whose judge overturned both of the screener’s correct flags.',
    ],
  },
];

/** What a team building such a system should take from it. */
export const researchImplications = [
  {
    no: '01',
    title: 'Validate on your own traffic',
    text: 'Do not deploy a detector on its benchmark numbers. This one went from benchmark-competitive to near chance on this corpus.',
  },
  {
    no: '02',
    title: 'Combine judges by union, not agreement',
    text: 'Use judges from different families and flag what any of them flags, or send disagreements to review. Requiring agreement caught nothing.',
  },
  {
    no: '03',
    title: 'A cascade is only as good as its screener',
    text: 'Its recall is capped by the screener, and its referee can still overturn the screener’s correct catches.',
  },
  {
    no: '04',
    title: 'Give meta-claims their own check',
    text: 'Claims about what the sources do not say are easy to spot by their wording, and they caused most of the judges’ false alarms.',
  },
];

export const researchLimitations = [
  'Only 42 real errors, so some differences cannot be resolved statistically.',
  '12.2% is the rate in a deliberately varied test set, not in everyday use.',
  'The union and the meta-claim analysis are post hoc and need confirming on new data.',
  'One annotator decided every label, with hard cases discussed with two reviewers.',
  'One corpus, one generator and one claim extractor.',
];

export const researchNext = [
  'Larger local judges, 27B to 32B, to see whether the weakness is the 8B scale.',
  'A judge prompt that knows how to verify a claim of absence, tested under pre-registration.',
  'Induced hallucinations, closer to what the span detector was trained on.',
  'A cheap way to estimate in advance how much two judges overlap.',
  'Answer-level correctness, and when the system should refuse to answer.',
];

/**
 * The claims panel's choices: whose flags light the dots. `rule` is 'any'
 * (a claim is flagged when any of `detectors` flags it) or 'all'.
 */
export const researchPanelViews = [
  {
    key: 'gold',
    label: 'Gold labels',
    text: 'Every claim the system made, coloured by its hand-checked label.',
  },
  {
    key: 'lettuce',
    label: 'Span detector',
    detectors: ['lettuce'],
    rule: 'any',
    text: 'LettuceDetect, trained on RAGTruth: almost silent on these errors.',
  },
  {
    key: 'llama',
    label: 'Llama judge',
    detectors: ['llama'],
    rule: 'any',
    text: 'Run 1, Llama-3.1-8B: few catches, and many supported claims flagged.',
  },
  {
    key: 'qwen',
    label: 'Qwen judge',
    detectors: ['qwen'],
    rule: 'any',
    text: 'Run 2, Qwen2.5-7B: the best single judge, catching different errors from Llama.',
  },
  {
    key: 'gemma',
    label: 'Gemma judge',
    detectors: ['gemma'],
    rule: 'any',
    text: 'Run 3, Gemma-2-9B, pre-registered: most of its catches repeat Llama’s.',
  },
  {
    key: 'union',
    label: 'Union',
    detectors: ['llama', 'qwen', 'lettuce'],
    rule: 'any',
    text: 'Flag a claim when Llama, Qwen or the span detector flags it: different families catch different errors.',
  },
  {
    key: 'agree',
    label: 'All agree',
    detectors: ['llama', 'qwen', 'gemma'],
    rule: 'all',
    text: 'Flag a claim only when all three judges flag it: they agree only on their shared mistakes.',
  },
];
