export type SubjectDomain = 'LITERACY_TELUGU' | 'LITERACY_ENGLISH' | 'NUMERACY';

export interface CompetencyDef {
  id: string;
  domain: SubjectDomain;
  name: string;
  nameTelugu: string;
  description: string;
  nipunCode: string;
  classRange: string;
}

export interface CompetencyQuestion {
  id: string;
  domain: SubjectDomain;
  competencyId: string;
  classNumber: number; // 1 to 5
  medium?: 'TELUGU' | 'ENGLISH';
  difficulty: 'EASY' | 'MODERATE' | 'DIFFICULT';
  nipunTargetRef: string;
  text: string;
  textTelugu?: string;
  oralPrompt?: string; // Instructions for the teacher / assessor
  options: string[];
  correctAnswerIndex: number;
  maxScore: number;
  scoringRubric: string;
}

// --------------------------------------------------------------------------
// DOMAIN DEFINITIONS
// --------------------------------------------------------------------------
export const SUBJECT_DOMAINS: { id: SubjectDomain; name: string; nameTelugu: string; icon: string }[] = [
  { id: 'LITERACY_TELUGU', name: 'Literacy - Telugu', nameTelugu: 'తెలుగు భాషా సామర్థ్యాలు', icon: 'BookOpen' },
  { id: 'LITERACY_ENGLISH', name: 'Literacy - English', nameTelugu: 'ఆంగ్ల భాషా సామర్థ్యాలు', icon: 'Languages' },
  { id: 'NUMERACY', name: 'Numeracy (Mathematics)', nameTelugu: 'గణిత సామర్థ్యాలు', icon: 'Calculator' },
];

// --------------------------------------------------------------------------
// COMPETENCIES PER DOMAIN
// --------------------------------------------------------------------------
export const COMPETENCIES_BY_DOMAIN: Record<SubjectDomain, CompetencyDef[]> = {
  LITERACY_TELUGU: [
    {
      id: 'TEL_PHONOLOGY',
      domain: 'LITERACY_TELUGU',
      name: 'Phonological Awareness',
      nameTelugu: 'ధ్వని పరిజ్ఞానం (ప్రాస పదాలు, మొదటి-చివరి శబ్దాలు)',
      description: 'Ability to identify, isolate, blend, and manipulate individual sounds, syllables, and rhymes in Telugu words.',
      nipunCode: 'NL-TEL-C1-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'TEL_LETTERS',
      domain: 'LITERACY_TELUGU',
      name: 'Letter & Guninthalu Identification',
      nameTelugu: 'అక్షర, గుణింత గుర్తింపు (వర్ణమాల & ఒత్తులు)',
      description: 'Accurate recognition of vowels (అచ్చులు), consonants (హల్లులు), guninthapu guthulu, and vathulu.',
      nipunCode: 'NL-TEL-C1-02',
      classRange: 'Classes 1–5',
    },
    {
      id: 'TEL_WORDS',
      domain: 'LITERACY_TELUGU',
      name: 'Word Reading & Decoding',
      nameTelugu: 'సరళ, గుణింత, సంయుక్తాక్షర పద పఠనం',
      description: 'Decoding 2, 3, and 4-letter words with appropriate vowels, guninthalu, and conjunct consonants.',
      nipunCode: 'NL-TEL-C2-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'TEL_FLUENCY',
      domain: 'LITERACY_TELUGU',
      name: 'Reading Fluency & Sentences',
      nameTelugu: 'ధారాళంగా వాక్యాలు చదవడం (WPM వేగం)',
      description: 'Reading age-appropriate connected sentences with accuracy, pacing (30–60 WPM), and expression.',
      nipunCode: 'NL-TEL-C2-02',
      classRange: 'Classes 1–5',
    },
    {
      id: 'TEL_COMPREHENSION',
      domain: 'LITERACY_TELUGU',
      name: 'Reading Comprehension',
      nameTelugu: 'గ్రహణ సామర్థ్యం & భావగ్రహణ ప్రశ్నలు',
      description: 'Reading a grade-level story or passage and answering direct factual and inferential comprehension questions.',
      nipunCode: 'NL-TEL-C3-01',
      classRange: 'Classes 1–5',
    },
  ],

  LITERACY_ENGLISH: [
    {
      id: 'ENG_PHONOLOGY',
      domain: 'LITERACY_ENGLISH',
      name: 'Phonological Awareness & Phonics',
      nameTelugu: 'ఫోనలాజికల్ అవేర్‌నెస్ & ఫోనిక్స్ శబ్దాలు',
      description: 'Distinguishing letter sounds, identifying initial/ending sounds, rhyming words, and sound blending.',
      nipunCode: 'NL-ENG-C1-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'ENG_SIGHT_WORDS',
      domain: 'LITERACY_ENGLISH',
      name: 'Sight Words & CVC Decoding',
      nameTelugu: 'సైట్ వర్డ్స్ & 3-అక్షర CVC పదాలు',
      description: 'Instant recognition of high-frequency sight words and decoding of simple consonant-vowel-consonant (CVC) words.',
      nipunCode: 'NL-ENG-C1-02',
      classRange: 'Classes 1–5',
    },
    {
      id: 'ENG_FLUENCY',
      domain: 'LITERACY_ENGLISH',
      name: 'Sentence Reading & Oral Fluency',
      nameTelugu: 'వాక్య పఠనం & ఫ్లూయెన్సీ (30–45 WPM)',
      description: 'Reading simple declarative and interrogative sentences with appropriate pacing and punctuation awareness.',
      nipunCode: 'NL-ENG-C2-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'ENG_COMPREHENSION',
      domain: 'LITERACY_ENGLISH',
      name: 'Listening & Reading Comprehension',
      nameTelugu: 'వినడం, చదవడం & అర్థం చేసుకోవడం',
      description: 'Listening to or reading a 3-4 sentence short passage and answering factual and contextual questions.',
      nipunCode: 'NL-ENG-C3-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'ENG_GRAMMAR',
      domain: 'LITERACY_ENGLISH',
      name: 'Grammar & Vocabulary Usage',
      nameTelugu: 'ఆర్టికల్స్, ప్రిపోజిషన్స్ & పదజాలం',
      description: 'Correct usage of articles (a, an, the), action words, singular/plural nouns, and positional prepositions.',
      nipunCode: 'NL-ENG-C3-02',
      classRange: 'Classes 1–5',
    },
  ],

  NUMERACY: [
    {
      id: 'NUM_NUMBER_SENSE',
      domain: 'NUMERACY',
      name: 'Number Identification & Place Value',
      nameTelugu: 'సంఖ్యల గుర్తింపు, స్థానవిలువలు & విస్తరణ రూపం',
      description: 'Identifying numbers up to 999, skip counting, number comparison (>, <, =), and understanding units, tens, hundreds.',
      nipunCode: 'NL-NUM-C1-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'NUM_ADDITION',
      domain: 'NUMERACY',
      name: 'Addition (Single to Multi-digit)',
      nameTelugu: 'కూడికలు (సాధారణ & చేతికొచ్చే కూడికలు)',
      description: '1-digit, 2-digit, and 3-digit addition with and without regrouping (carryover).',
      nipunCode: 'NL-NUM-C2-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'NUM_SUBTRACTION',
      domain: 'NUMERACY',
      name: 'Subtraction (With & Without Borrowing)',
      nameTelugu: 'తీసివేతలు (సాధారణ & అప్పు తీసివేతలు)',
      description: 'Subtracting 2-digit and 3-digit numbers with decomposing/borrowing across tens and hundreds.',
      nipunCode: 'NL-NUM-C2-02',
      classRange: 'Classes 1–5',
    },
    {
      id: 'NUM_MULTIPLICATION',
      domain: 'NUMERACY',
      name: 'Multiplication & Division Concepts',
      nameTelugu: 'గుణకారం & భాగహార భావనలు (పునరావృత కూడిక)',
      description: 'Multiplication as repeated addition, memory of 2–10 tables, and division as equal grouping/sharing.',
      nipunCode: 'NL-NUM-C3-01',
      classRange: 'Classes 1–5',
    },
    {
      id: 'NUM_WORD_PROBLEMS',
      domain: 'NUMERACY',
      name: 'Word Problems, Patterns & Measurement',
      nameTelugu: 'నిత్యజీవిత రాత లెక్కలు, నమూనాలు & కొలతలు',
      description: 'Solving 1-step and 2-step contextual word problems involving money, weight, time, and geometric patterns.',
      nipunCode: 'NL-NUM-C3-02',
      classRange: 'Classes 1–5',
    },
  ],
};

// --------------------------------------------------------------------------
// STANDARDIZED NIPUN QUESTION REPOSITORY (225 QUESTIONS: >= 5 EASY, 5 MODERATE, 5 DIFFICULT EACH)
// --------------------------------------------------------------------------
export const COMPETENCY_QUESTIONS: CompetencyQuestion[] = [
  {
    "id": "Q_TEL_PA_E01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-01: Isolates initial phoneme in familiar 2-syllable spoken words",
    "text": "Identify the initial sound in the word 'అమ్మ' (Amma / Mother).",
    "textTelugu": "'అమ్మ' అనే పదంలో మొదటి శబ్దం (ధ్వని) ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'అమ్మ' అని పలికి, ప్రారంభ ధ్వనిని చెప్పమనండి.",
    "options": [
      "అ (A)",
      "మ (Ma)",
      "ప (Pa)",
      "క (Ka)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly states initial phoneme /a/ instantly"
  },
  {
    "id": "Q_TEL_PA_E02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-01: Recognizes consonant sound at the beginning of spoken words",
    "text": "Identify the initial sound in the word 'కలము' (Kalamu / Pen).",
    "textTelugu": "'కలము' అనే పదంలో మొదటి శబ్దం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'కలము' అని పలికి మొదటి అక్షర శబ్దాన్ని గుర్తించమనండి.",
    "options": [
      "క (Ka)",
      "ల (La)",
      "ము (Mu)",
      "ర (Ra)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Isolates consonant phoneme /ka/ correctly"
  },
  {
    "id": "Q_TEL_PA_E03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-01: Identifies ending sounds in common 3-letter Telugu words",
    "text": "Identify the ending sound in the word 'పడవ' (Padava / Boat).",
    "textTelugu": "'పడవ' అనే పదంలో చివరి శబ్దం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'పడవ' అని పలికి, చివరిగా వినిపించే ధ్వనిని అడగండి.",
    "options": [
      "వ (Va)",
      "ప (Pa)",
      "డ (Da)",
      "న (Na)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly isolates final phoneme /va/"
  },
  {
    "id": "Q_TEL_PA_E04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-01: Distinguishes long vowel sounds in oral vocabulary",
    "text": "Identify the initial sound in the word 'ఆవు' (Aavu / Cow).",
    "textTelugu": "'ఆవు' అనే పదంలో మొదటి శబ్దం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'ఆవు' అని పలికి దీర్ఘ స్వరాన్ని గుర్తించమనండి.",
    "options": [
      "ఆ (Aa)",
      "వు (Vu)",
      "ఇ (I)",
      "త (Ta)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Recognizes /aa/ initial phoneme"
  },
  {
    "id": "Q_TEL_PA_E05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-01: Recognizes and produces rhyming words in Telugu",
    "text": "Which word rhymes with 'బంతి' (Banthi)?",
    "textTelugu": "'బంతి' అనే పదంతో ప్రాస కుదిరే (రైమింగ్) పదం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'బంతి' అని పలికి, అదే ప్రాసతో ముగిసే పదాన్ని ఎంపిక చేయమనండి.",
    "options": [
      "పంతి (Panthi)",
      "చెట్టు (Chettu)",
      "కాకి (Kaaki)",
      "ఆవు (Aavu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Matches rhyming sound pattern correctly"
  },
  {
    "id": "Q_TEL_PA_M01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-01: Identifies common phonemes across word families",
    "text": "Identify the common ending sound in: 'వల', 'తల', 'కల'.",
    "textTelugu": "'వల', 'తల', 'కల' - ఈ పదాల చివర వచ్చే ఒకే రకమైన ధ్వని ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మూడు పదాలు చదివి, చివర సమానంగా ఉన్న ధ్వనిని గుర్తించమనండి.",
    "options": [
      "ల (La)",
      "వ (Va)",
      "త (Ta)",
      "క (Ka)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately extracts shared final syllable /la/"
  },
  {
    "id": "Q_TEL_PA_M02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-01: Blends 3 isolated phonemes into spoken word",
    "text": "Blend the sounds 'గ' + 'ద' + 'ప' into a meaningful word.",
    "textTelugu": "'గ', 'ద', 'ప' శబ్దాలను కలిపితే ఏ పదం ఏర్పడుతుంది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: అక్షర శబ్దాలను విడివిడిగా పలికి, కలిపి పదం చెప్పమనండి.",
    "options": [
      "గదప (Gadapaha)",
      "పగడ (Pagada)",
      "దగప (Dagapa)",
      "పడగ (Padaga)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Seamless oral sound blending"
  },
  {
    "id": "Q_TEL_PA_M03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-01: Syllable segmentation with clapping cadence",
    "text": "How many syllable sounds are in the word 'పుస్తకం' (Pustakam)?",
    "textTelugu": "'పుస్తకం' అనే పదంలో ఎన్ని అక్షర ధ్వనులు (సిలబుల్స్) ఉన్నాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: చప్పట్లతో 'పుస్ - త - కం' అంటూ సిలబుల్స్ లెక్కించమనండి.",
    "options": [
      "3 ధ్వనులు (3 Syllables)",
      "2 ధ్వనులు (2 Syllables)",
      "4 ధ్వనులు (4 Syllables)",
      "1 ధ్వని (1 Syllable)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly segments 3 distinct syllable units"
  },
  {
    "id": "Q_TEL_PA_M04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-01: Generates rhyming pairs with identical vowel-consonant codas",
    "text": "Which word rhymes with 'పాట' (Paata / Song)?",
    "textTelugu": "కింది వాటిలో 'పాట' అనే పదంతో ప్రాస కుదిరే పదం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'పాట' కి ప్రాస పదం ఎంచుకోమనండి.",
    "options": [
      "ఆట (Aata)",
      "గుడి (Gudi)",
      "నీరు (Neeru)",
      "చెట్టు (Chettu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects /aata/ rhyme accurately"
  },
  {
    "id": "Q_TEL_PA_M05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-01: Isolates medial phonemes in trisyllabic words",
    "text": "Identify the middle sound in the word 'పలక' (Palaka / Slate).",
    "textTelugu": "'పలక' అనే పదంలో మధ్యలో వచ్చే శబ్దం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'పలక' పదంలోని మధ్య ధ్వనిని పలకమనండి.",
    "options": [
      "ల (La)",
      "ప (Pa)",
      "క (Ka)",
      "ర (Ra)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies /la/ correctly"
  },
  {
    "id": "Q_TEL_PA_D01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-01: Analyzes geminate consonant cluster phonemes",
    "text": "Isolate the geminate (dvitva) sound in the word 'పచ్చిక' (Pacchika).",
    "textTelugu": "'పచ్చిక' అనే పదంలోని ద్విత్వాక్షర ధ్వనిని విడదీసి పలకండి:",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'పచ్చిక' లోని చ-వత్తు శబ్దాన్ని విశ్లేషించమనండి.",
    "options": [
      "చ్ + చ = చ్చ (/ch/ + /cha/)",
      "త్ + త = త్త (/t/ + /ta/)",
      "ప్ + ప = ప్ప (/p/ + /pa/)",
      "క్ + క = క్క (/k/ + /ka/)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately articulates /ch/ + /cha/ gemination"
  },
  {
    "id": "Q_TEL_PA_D02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-01: Discriminates complex diphthong vowel sounds",
    "text": "Identify words having the 'ఐత్వ' (Ai) diphthong sound: 'రైతు', 'చేను', 'పైరు'.",
    "textTelugu": "'రైతు', 'చేను', 'పైరు' - వీటిలో 'ఐత్వ' ధ్వని ఉన్న పదాలు ఏవి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'రై' మరియు 'పై' శబ్దాలలో ఐత్వాన్ని గుర్తించమనండి.",
    "options": [
      "రైతు, పైరు (Raitu, Pairu)",
      "చేను మాత్రమే (Chenu only)",
      "పైరు మాత్రమే (Pairu only)",
      "రైతు మాత్రమే (Raitu only)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies /ai/ sound in both target words"
  },
  {
    "id": "Q_TEL_PA_D03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-01: Categorizes words sharing retroflex geminate phonemes",
    "text": "What shared dvitva sound exists in: 'మట్టి', 'చెట్టు', 'పిట్ట'?",
    "textTelugu": "'మట్టి', 'చెట్టు', 'పిట్ట' - ఈ పదాలన్నింటిలో ఉమ్మడిగా ఉన్న ద్విత్వ ధ్వని ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మూడు పదాలు పలికి ట-వత్తు ధ్వనిని గుర్తించమనండి.",
    "options": [
      "ట-వత్తు (ట్ట - Tta)",
      "ప-వత్తు (ప్ప - Ppa)",
      "న-వత్తు (న్న - Nna)",
      "ల-వత్తు (ల్ల - Lla)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly states shared /tta/ sound"
  },
  {
    "id": "Q_TEL_PA_D04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-01: Conscious phonological distinction between short and long vowels",
    "text": "Identify phonemic difference between short 'అ' in అమ్మ and long 'ఆ' in ఆవు.",
    "textTelugu": "'అమ్మ' లోని 'అ' మరియు 'ఆవు' లోని 'ఆ' మధ్య గల ధ్వని భేదం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: హ్రస్వ-దీర్ఘ స్వరాల సమయ నిడివిని వివరించమనండి.",
    "options": [
      "'అ' హ్రస్వ స్వరం (తక్కువ సమయం), 'ఆ' దీర్ఘ స్వరం (ఎక్కువ సమయం)",
      "రెండూ ఒకే ధ్వని సమయం",
      "రెండూ దీర్ఘాలే",
      "ధ్వని భేదం లేదు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Articulates duration difference between short /a/ and long /aa/"
  },
  {
    "id": "Q_TEL_PA_D05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-01: Segments heterorganic consonant clusters in academic words",
    "text": "Identify the conjunct consonant sound in 'పుస్తకం' (Pustakam).",
    "textTelugu": "'పుస్తకం' అనే పదంలో సంయుక్తాక్షర ధ్వనిని గుర్తించండి.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: స్ + త = స్త సంయుక్త శబ్దాన్ని విడదీసి చెప్పమనండి.",
    "options": [
      "స్ + త = స్త (/s/ + /ta/)",
      "ప్ + ఉ = పు (/p/ + /u/)",
      "క్ + అం = కం (/k/ + /am/)",
      "త్ + త = త్త (/t/ + /ta/)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly isolates /s/ + /ta/ blend"
  },
  {
    "id": "Q_TEL_LET_E01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-02: Accurately identifies primary vowels (అచ్చులు)",
    "text": "Identify the letter: 'అ' (A).",
    "textTelugu": "ఈ అక్షరాన్ని గుర్తించండి: 'అ'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: కార్డు చూపించి అక్షరాన్ని చదవమనండి.",
    "options": [
      "అ (A)",
      "ఆ (Aa)",
      "ఇ (I)",
      "ఈ (Ee)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies /a/ without hesitation"
  },
  {
    "id": "Q_TEL_LET_E02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-02: Accurately identifies first group consonants (హల్లులు)",
    "text": "Identify the consonant: 'క' (Ka).",
    "textTelugu": "ఈ హల్లును గుర్తించండి: 'క'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: అక్షర చార్టులో 'క' ను చూపించి చదవమనండి.",
    "options": [
      "క (Ka)",
      "గ (Ga)",
      "చ (Cha)",
      "జ (Ja)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies /ka/ correctly"
  },
  {
    "id": "Q_TEL_LET_E03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-02: Distinguishes short vowel /u/ from similar graphemes",
    "text": "Which letter represents the vowel 'ఉ' (U)?",
    "textTelugu": "కింది వాటిలో 'ఉ' అక్షరం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: నాలుగు అక్షరాలలో 'ఉ' ను చూపించమనండి.",
    "options": [
      "ఉ",
      "ఊ",
      "ఋ",
      "ఎ"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects /u/ correctly"
  },
  {
    "id": "Q_TEL_LET_E04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-02: Discriminates visually confusable graphemes (ప vs వ)",
    "text": "Identify the letter: 'ప' (Pa).",
    "textTelugu": "ఈ అక్షరాన్ని గుర్తించండి: 'ప'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'ప' మరియు 'వ' మధ్య భేదం గమనించి చదవమనండి.",
    "options": [
      "ప (Pa)",
      "వ (Va)",
      "య (Ya)",
      "ష (Sha)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects /pa/ accurately"
  },
  {
    "id": "Q_TEL_LET_E05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C1-02: Identifies primary guninthapu guthulu",
    "text": "Identify the vowel sign: దీర్ఘం (◌ా).",
    "textTelugu": "ఈ గుణింతపు గుర్తును గుర్తించండి: '◌ా' (తలకట్టు పక్కన దీర్ఘం)",
    "oralPrompt": "ఉపాధ్యాయ సూచన: దీర్ఘం గుర్తు పేరు చెప్పమనండి.",
    "options": [
      "దీర్ఘం (Deergham)",
      "గుడి (Gudi)",
      "కొమ్ము (Kommu)",
      "తలకట్టు (Talakattu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Names 'దీర్ఘం' correctly"
  },
  {
    "id": "Q_TEL_LET_M01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-02: Reads basic guninthalu with short /i/ symbol",
    "text": "Identify the letter: 'కి' (Ki - క కు గుడిస్తే కి).",
    "textTelugu": "ఈ గుణింతాక్షరాన్ని గుర్తించండి: 'కి'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: క కి గుడి ఇచ్చిన అక్షరాన్ని చదవమనండి.",
    "options": [
      "కి (Ki)",
      "కీ (Kee)",
      "కు (Ku)",
      "కూ (Koo)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /ki/ correctly"
  },
  {
    "id": "Q_TEL_LET_M02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-02: Distinguishes short kommu from long kommu deergham",
    "text": "Identify the letter: 'గూ' (Goo - గ కు కొమ్ము దీర్ఘం).",
    "textTelugu": "ఈ గుణింతాక్షరాన్ని గుర్తించండి: 'గూ'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: గ కు కొమ్ము దీర్ఘం ఇస్తే ఏమవుతుందో చదవమనండి.",
    "options": [
      "గూ (Goo)",
      "గు (Gu)",
      "గో (Go)",
      "గా (Gaa)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately pronounces /goo/"
  },
  {
    "id": "Q_TEL_LET_M03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-02: Reads letters with etvam deergham",
    "text": "Identify the gunintham letter: 'చే' (Che - చ కు ఏత్వ దీర్ఘం).",
    "textTelugu": "ఈ గుణింతాక్షరాన్ని గుర్తించండి: 'చే'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: చ కి ఏత్వ దీర్ఘం చేర్చిన అక్షరాన్ని చదవమనండి.",
    "options": [
      "చే (Chee)",
      "చె (Che)",
      "చై (Chai)",
      "చో (Cho)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /che/ correctly"
  },
  {
    "id": "Q_TEL_LET_M04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-02: Identifies primary consonant diacritic signs (వత్తులు)",
    "text": "Identify the vathu: 'క్క' లోని వత్తు ఏది?",
    "textTelugu": "'క్క' అనే అక్షరంలో ఉన్న వత్తు ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: క-వత్తు గుర్తును గుర్తించమనండి.",
    "options": [
      "క-వత్తు (K-vathu)",
      "గ-వత్తు (G-vathu)",
      "త-వత్తు (T-vathu)",
      "న-వత్తు (N-vathu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies Ka-vathu accurately"
  },
  {
    "id": "Q_TEL_LET_M05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C1-02: Distinguishes various consonant subscripts",
    "text": "Identify the consonant sign: త-వత్తు (్త).",
    "textTelugu": "కింది వాటిలో 'త-వత్తు' గుర్తు ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఇచ్చిన చిహ్నాలలో త-వత్తును ఎంచుకోమనండి.",
    "options": [
      "్త (T-vathu)",
      "్న (N-vathu)",
      "్మ (M-vathu)",
      "్య (Y-vathu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly selects Ta-vathu"
  },
  {
    "id": "Q_TEL_LET_D01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-02: Deconstructs complex conjunct consonants (సంయుక్తాక్షరాలు)",
    "text": "Identify the samyuktaksharam: 'క్ష్మ' (Kshma).",
    "textTelugu": "ఈ సంయుక్తాక్షరంలో ఏయే అక్షరాలు కలిసి ఉన్నాయి: 'క్ష్మ'?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సంయుక్తాక్షరంలో నిక్షిప్తమైన హల్లులను విశ్లేషించమనండి.",
    "options": [
      "క్ + ష్ + మ (K + Sh + M)",
      "క్ + మ (K + M)",
      "ష్ + మ (Sh + M)",
      "క్ + స (K + S)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately decomposes /k/ + /sh/ + /ma/"
  },
  {
    "id": "Q_TEL_LET_D02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-02: Categorizes varnamala phonetic classes",
    "text": "Identify category: 'ఙ' and 'ఞ' in Telugu alphabet.",
    "textTelugu": "'ఙ' మరియు 'ఞ' అక్షరాలు వర్ణమాలలో ఏ విభాగానికి చెందుతాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: అనునాసిక అక్షరాలను గుర్తించమనండి.",
    "options": [
      "అనునాసికాలు (ముక్కుతో పలికేవి / Nasals)",
      "ఊష్మాలు (గాలిని ఊదేవి)",
      "అంతఃస్థాలు",
      "అచ్చులు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly classifies nasal consonants"
  },
  {
    "id": "Q_TEL_LET_D03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-02: Distinguishes samshlesha from dvitva consonants",
    "text": "Identify: 'ర్త్య' (Rtya) type of consonant cluster.",
    "textTelugu": "'సూర్యుడు' లేదా 'వర్త్య' లోని 'ర్త్య' ను ఏమంటారు?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: రెండు వేర్వేరు వత్తులు చేరిన సంశ్లేషాక్షరాన్ని గుర్తించమనండి.",
    "options": [
      "సంశ్లేషాక్షరం (ఒక హల్లుకు రెండు వేర్వేరు వత్తులు)",
      "ద్విత్వాక్షరం",
      "సరళాక్షరం",
      "హ్రస్వాక్షరం"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies samshleshaksharam correctly"
  },
  {
    "id": "Q_TEL_LET_D04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-02: Accurately recognizes advanced vowel signs",
    "text": "Identify the vowel sign for 'ఐత్వం' (◌ై).",
    "textTelugu": "కింది వాటిలో 'ఐత్వం' గుర్తు ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఐత్వం మరియు ఔత్వం భేదాన్ని గుర్తించమనండి.",
    "options": [
      "◌ై (Aitvam)",
      "◌ౌ (Autvam)",
      "◌ో (Otvam)",
      "◌ూ (Kommu deergham)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects Aitvam accurately"
  },
  {
    "id": "Q_TEL_LET_D05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_LETTERS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C1-02: Recognizes less frequent vowels in classical alphabet",
    "text": "Identify the letter: 'ఋ' (Ru).",
    "textTelugu": "ఈ అక్షరాన్ని గుర్తించండి: 'ఋ'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: అచ్చులలో 'ఋ' అక్షరాన్ని స్పష్టంగా చదవమనండి.",
    "options": [
      "ఋ (Ru)",
      "ౠ (Roo)",
      "ఎ (E)",
      "ఓ (O)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /ru/ accurately"
  },
  {
    "id": "Q_TEL_WRD_E01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes simple 2-letter non-consonant cluster words",
    "text": "Read the 2-letter simple word: 'వల' (Vala / Net).",
    "textTelugu": "కింది 2-అక్షరాల సరళ పదాన్ని చదవండి: 'వల'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: కార్డుపై 'వల' పదాన్ని చూపించి స్పష్టంగా చదవమనండి.",
    "options": [
      "వల (Vala)",
      "తల (Tala)",
      "కల (Kala)",
      "నల (Nala)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /vala/ correctly within 3 seconds"
  },
  {
    "id": "Q_TEL_WRD_E02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-01: Reads familiar words with long vowels",
    "text": "Read the word: 'ఆట' (Aata / Game).",
    "textTelugu": "ఈ పదాన్ని సరిగ్గా చదవండి: 'ఆట'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'ఆట' పదాన్ని చదవమనండి.",
    "options": [
      "ఆట (Aata)",
      "పాట (Paata)",
      "మాట (Maata)",
      "తోట (Thota)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Decodes /aata/ accurately"
  },
  {
    "id": "Q_TEL_WRD_E03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-01: Reads 3-letter sarala padalu fluently",
    "text": "Read the 3-letter simple word: 'పలక' (Palaka / Slate).",
    "textTelugu": "ఈ 3-అక్షరాల పదాన్ని చదవండి: 'పలక'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'ప-ల-క' ను విడదీయకుండా ధారాళంగా చదవమనండి.",
    "options": [
      "పలక (Palaka)",
      "కలప (Kalapa)",
      "పడవ (Padava)",
      "గడప (Gadapa)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /palaka/ without sounding out individual letters"
  },
  {
    "id": "Q_TEL_WRD_E04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes basic sight nouns",
    "text": "Read the word: 'ఈగ' (Eega / Fly).",
    "textTelugu": "ఈ పదాన్ని గుర్తించి చదవండి: 'ఈగ'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'ఈగ' పదాన్ని చదవమనండి.",
    "options": [
      "ఈగ (Eega)",
      "ఆవు (Aavu)",
      "ఇల్లు (Illu)",
      "ఊయల (Ooyala)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /eega/ correctly"
  },
  {
    "id": "Q_TEL_WRD_E05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-01: Reads words with sunna (పూర్ణానుస్వారం)",
    "text": "Read the word: 'కమలం' (Kamalam / Lotus).",
    "textTelugu": "ఈ పదాన్ని సరిగ్గా చదవండి: 'కమలం'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పూర్ణానుస్వారంతో (సున్నాతో) ఉన్న పదాన్ని చదవమనండి.",
    "options": [
      "కమలం (Kamalam)",
      "కలము (Kalamu)",
      "పవనం (Pavanam)",
      "చమకం (Chamakam)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /kamalam/ with proper nasalization"
  },
  {
    "id": "Q_TEL_WRD_M01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes multi-syllable gunintham vocabulary",
    "text": "Read the gunintham word: 'గులాబి' (Gulaabi / Rose).",
    "textTelugu": "ఈ గుణింత పదాన్ని చదవండి: 'గులాబి'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: కొమ్ము మరియు దీర్ఘాలు ఉన్న పదాన్ని చదవమనండి.",
    "options": [
      "గులాబి (Gulaabi)",
      "గోరింట (Gorinta)",
      "గానుగ (Gaanuga)",
      "గురుగు (Gurugu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurate pronunciation with correct vowel lengths"
  },
  {
    "id": "Q_TEL_WRD_M02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-01: Reads gunintha padalu accurately",
    "text": "Read the word: 'చిలక' (Chilaka / Parrot).",
    "textTelugu": "ఈ పదాన్ని సరిగ్గా చదవండి: 'చిలక'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: గుడి మరియు తలకట్టు కలయిక పదాన్ని చదవమనండి.",
    "options": [
      "చిలక (Chilaka)",
      "జిలక (Jilaka)",
      "చిరుత (Chiruta)",
      "పిలక (Pilaka)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /chilaka/ smoothly"
  },
  {
    "id": "Q_TEL_WRD_M03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-01: Accurately articulates /me/ in /meka/",
    "text": "Read the word: 'మేక' (Meka / Goat).",
    "textTelugu": "ఈ పదాన్ని చదవండి: 'మేక'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఏత్వ దీర్ఘం గల పదాన్ని చదవమనండి.",
    "options": [
      "మేక (Meka)",
      "చేప (Chepa)",
      "పేడ (Peda)",
      "లేగ (Lega)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Decodes instantly"
  },
  {
    "id": "Q_TEL_WRD_M04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes geminate consonants in familiar vocabulary",
    "text": "Read the dvitvakshara word: 'చెట్టు' (Chettu / Tree).",
    "textTelugu": "ఈ ద్విత్వాక్షర పదాన్ని సరిగ్గా చదవండి: 'చెట్టు'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ట-వత్తు నొక్కి పలకడం గమనించండి.",
    "options": [
      "చెట్టు (Chettu)",
      "బుట్ట (Butta)",
      "పిట్ట (Pitta)",
      "గుట్టు (Guttu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Emphasizes retroflex geminate /ttu/ correctly"
  },
  {
    "id": "Q_TEL_WRD_M05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-01: Reads primary dvitvakshara words",
    "text": "Read the word: 'అమ్మ' (Amma / Mother).",
    "textTelugu": "ఈ ద్విత్వాక్షర పదాన్ని చదవండి: 'అమ్మ'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మ-వత్తును సరిగ్గా ఉచ్చరించమనండి.",
    "options": [
      "అమ్మ (Amma)",
      "అయ్య (Ayya)",
      "అన్న (Anna)",
      "అక్క (Akka)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /amma/ with accurate gemination"
  },
  {
    "id": "Q_TEL_WRD_D01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes conjunct consonant words fluently",
    "text": "Read the samyuktakshara word: 'పుస్తకం' (Pustakam / Book).",
    "textTelugu": "ఈ సంయుక్తాక్షర పదాన్ని సరిగ్గా చదవండి: 'పుస్తకం'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 'స్త' సంయుక్తాక్షరాన్ని స్పష్టంగా చదవమనండి.",
    "options": [
      "పుస్తకం (Pustakam)",
      "మస్తకం (Mastakam)",
      "హస్తం (Hastam)",
      "ప్రశస్తం (Prashastam)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Articulates /sta/ consonant blend with ease"
  },
  {
    "id": "Q_TEL_WRD_D02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes complex conjunct nouns with vowel diacritics",
    "text": "Read the word: 'సూర్యుడు' (Sooryudu / Sun).",
    "textTelugu": "ఈ సంయుక్తాక్షర పదాన్ని చదవండి: 'సూర్యుడు'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: య-వత్తు మరియు దీర్ఘాన్ని గమనించి చదవమనండి.",
    "options": [
      "సూర్యుడు (Sooryudu)",
      "చంద్రుడు (Chandrudu)",
      "నక్షత్రం (Nakshatram)",
      "ఆకాశం (Aakasham)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /sooryudu/ without errors"
  },
  {
    "id": "Q_TEL_WRD_D03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-01: Reads academic multi-syllable conjunct words",
    "text": "Read the word: 'విద్యార్థి' (Vidyaarthi / Student).",
    "textTelugu": "ఈ పదాన్ని సరిగ్గా ఉచ్చరించి చదవండి: 'విద్యార్థి'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ద్య మరియు ర్థి సంయుక్తాక్షరాలను చదవమనండి.",
    "options": [
      "విద్యార్థి (Vidyaarthi)",
      "ఉపాధ్యాయుడు (Upadhyanyudu)",
      "విద్యావంతుడు (Vidyavanthudu)",
      "విజ్ఞానం (Vignanam)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately pronounces /dya/ and /rthi/"
  },
  {
    "id": "Q_TEL_WRD_D04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes initial s-cluster Telugu words",
    "text": "Read the word: 'స్నేహం' (Sneham / Friendship).",
    "textTelugu": "ఈ సంయుక్తాక్షర పదాన్ని చదవండి: 'స్నేహం'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: స్నే సంయుక్తాక్షర శబ్దాన్ని వినండి.",
    "options": [
      "స్నేహం (Sneham)",
      "నేరం (Neram)",
      "మోహం (Moham)",
      "స్నేహితుడు (Snehithudu)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads /sneham/ cleanly"
  },
  {
    "id": "Q_TEL_WRD_D05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-01: Decodes advanced multi-syllable abstract vocabulary",
    "text": "Read the word: 'ఉత్సాహం' (Utsaaham / Enthusiasm).",
    "textTelugu": "ఈ సంయుక్తాక్షర పదాన్ని చదవండి: 'ఉత్సాహం'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: త్స సంయుక్తాక్షర ధ్వనిని గమనించండి.",
    "options": [
      "ఉత్సాహం (Utsaaham)",
      "ఉల్లాసం (Ullaasam)",
      "సాహసం (Saahasam)",
      "సంతోషం (Santhosham)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Articulates /tsaa/ accurately"
  },
  {
    "id": "Q_TEL_FLU_E01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-02: Reads 2-word connected phrases at steady pace",
    "text": "Read simple 2-word phrase: 'బడికి పోదాం' (Let's go to school).",
    "textTelugu": "ఈ సరళ వాక్యాంశాన్ని ధారాళంగా చదవండి: 'బడికి పోదాం'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఆపకుండా 2 పదాలను కలిపి చదవమనండి.",
    "options": [
      "బడికి పోదాం (Badiki Podam)",
      "ఇంటికి పోదాం",
      "ఆటకు పోదాం",
      "తోటకు పోదాం"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads smoothly without word-by-word pause"
  },
  {
    "id": "Q_TEL_FLU_E02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-02: Reads 3-word simple sentences with basic intonation",
    "text": "Read phrase: 'ఆవు పాలు ఇస్తుంది' (Cow gives milk).",
    "textTelugu": "ఈ వాక్యాన్ని చదవండి: 'ఆవు పాలు ఇస్తుంది'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వాక్య పఠన వేగాన్ని గమనించండి.",
    "options": [
      "ఆవు పాలు ఇస్తుంది",
      "గేదె పాలు ఇస్తుంది",
      "మేక పాలు ఇస్తుంది",
      "ఆవు గడ్డి తింటుంది"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Completes reading in under 4 seconds"
  },
  {
    "id": "Q_TEL_FLU_E03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-02: Reads familiar sentences with dvitva words",
    "text": "Read phrase: 'చెట్టు పై పక్షి ఉంది' (Bird is on tree).",
    "textTelugu": "ఈ వాక్యాన్ని ధారాళంగా చదవండి: 'చెట్టు పై పక్షి ఉంది'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: తప్పులు లేకుండా చదవమనండి.",
    "options": [
      "చెట్టు పై పక్షి ఉంది",
      "గూటిలో పక్షి ఉంది",
      "చెట్టు కింద కుక్క ఉంది",
      "చెట్టు పై కోతి ఉంది"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads smoothly"
  },
  {
    "id": "Q_TEL_FLU_E04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-02: Reads declarative sentences with appropriate pause",
    "text": "Read phrase: 'పిల్లలు ఆటలు ఆడుతున్నారు' (Children are playing games).",
    "textTelugu": "ఈ వాక్యాన్ని చదవండి: 'పిల్లలు ఆటలు ఆడుతున్నారు'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఉచ్చారణ స్పష్టత గమనించండి.",
    "options": [
      "పిల్లలు ఆటలు ఆడుతున్నారు",
      "పిల్లలు పాటలు పాడుతున్నారు",
      "పిల్లలు బడికి వెళ్తున్నారు",
      "పిల్లలు చదువుతున్నారు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurate phrasing and pacing"
  },
  {
    "id": "Q_TEL_FLU_E05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C2-02: Reads descriptive phrase without hesitation",
    "text": "Read phrase: 'మా ఊరు అందమైనది' (Our village is beautiful).",
    "textTelugu": "ఈ వాక్యాన్ని ధారాళంగా చదవండి: 'మా ఊరు అందమైనది'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఆత్మవిశ్వాసంతో చదవమనండి.",
    "options": [
      "మా ఊరు అందమైనది",
      "మా ఇల్లు అందమైనది",
      "మా బడి పెద్దది",
      "మా చెరువు మంచిది"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads within 3 seconds"
  },
  {
    "id": "Q_TEL_FLU_M01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-02: Reads grade 2 passage with 30-35 WPM accuracy",
    "text": "Read connected sentence at 30 WPM: 'రాము ప్రతిరోజూ ఉదయాన్నే లేచి బడికి సమయానికి వెళ్తాడు.'",
    "textTelugu": "ధారాళంగా చదవండి (30-35 WPM): 'రాము ప్రతిరోజూ ఉదయాన్నే లేచి బడికి సమయానికి వెళ్తాడు.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: స్టాప్‌వాచ్‌తో సమయం గమనించండి (గరిష్టంగా 6 సెకన్లు).",
    "options": [
      "రాము ప్రతిరోజూ ఉదయాన్నే లేచి బడికి సమయానికి వెళ్తాడు.",
      "సోము ప్రతిరోజూ బడికి వెళ్తాడు.",
      "రాము సాయంత్రం ఆడుకుంటాడు.",
      "రాము ఆలస్యంగా వెళ్తాడు."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads at > 30 WPM with correct punctuation pauses"
  },
  {
    "id": "Q_TEL_FLU_M02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-02: Reads 2 connected sentences with full stop awareness",
    "text": "Read: 'తోటలో రంగు రంగుల పూలు పూసాయి. సీతాకోకచిలుకలు పూలపై వాలాయి.'",
    "textTelugu": "ధారాళంగా చదవండి: 'తోటలో రంగు రంగుల పూలు పూసాయి. సీతాకోకచిలుకలు పూలపై వాలాయి.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వాక్య విభజన మరియు భావాన్ని వ్యక్తీకరించే శైలిని గమనించండి.",
    "options": [
      "తోటలో రంగు రంగుల పూలు పూసాయి. సీతాకోకచిలుకలు పూలపై వాలాయి.",
      "తోటలో పండ్లు ఉన్నాయి.",
      "సీతాకోకచిలుకలు ఎగిరిపోయాయి.",
      "తోట చాలా పెద్దది."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately pauses at period"
  },
  {
    "id": "Q_TEL_FLU_M03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-02: Reads with appropriate expressive modulation",
    "text": "Read with expression: 'వాన కురిసింది! చెరువులన్నీ నీటితో నిండిపోయాయి.'",
    "textTelugu": "భావవ్యక్తీకరణతో చదవండి: 'వాన కురిసింది! చెరువులన్నీ నీటితో నిండిపోయాయి.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఆశ్చర్యార్థక చిహ్నాన్ని గమనించి ఉత్సాహంగా చదవమనండి.",
    "options": [
      "వాన కురిసింది! చెరువులన్నీ నీటితో నిండిపోయాయి.",
      "ఎండ కాసింది. చెరువులు ఎండిపోయాయి.",
      "వాన రాలేదు.",
      "చెరువులో చేపలు ఉన్నాయి."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reflects exclamation enthusiasm"
  },
  {
    "id": "Q_TEL_FLU_M04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-02: Observes comma pacing during oral list reading",
    "text": "Read: 'మన జాతీయ జెండాలో మూడు రంగులు ఉన్నాయి: కాషాయం, తెలుపు, ఆకుపచ్చ.'",
    "textTelugu": "చదవండి: 'మన జాతీయ జెండాలో మూడు రంగులు ఉన్నాయి: కాషాయం, తెలుపు, ఆకుపచ్చ.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: స్వల్ప విరామాలను (కామాలను) పాటిస్తూ చదవమనండి.",
    "options": [
      "మన జాతీయ జెండాలో మూడు రంగులు ఉన్నాయి: కాషాయం, తెలుపు, ఆకుపచ్చ.",
      "మన జెండా అందమైనది.",
      "జెండాలో రెండు రంగులు ఉన్నాయి.",
      "మన జాతీయ పక్షి నెమలి."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Pauses correctly at commas"
  },
  {
    "id": "Q_TEL_FLU_M05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C2-02: Reads connected informational sentences fluently",
    "text": "Read: 'రైతు మనకు అన్నం పెట్టే దైవం. కష్టపడి పంటలు పండిస్తాడు.'",
    "textTelugu": "చదవండి: 'రైతు మనకు అన్నం పెట్టే దైవం. కష్టపడి పంటలు పండిస్తాడు.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: స్పష్టమైన స్వరంతో చదవమనండి.",
    "options": [
      "రైతు మనకు అన్నం పెట్టే దైవం. కష్టపడి పంటలు పండిస్తాడు.",
      "రైతు పొలానికి వెళ్తాడు.",
      "పంటలు పండాయి.",
      "రైతు దేశానికి వెన్నెముక."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Zero decoding stumbles"
  },
  {
    "id": "Q_TEL_FLU_D01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-02: Reads grade-appropriate unseen text at 45-60 WPM with comprehension",
    "text": "Read Class 3 passage at 45–60 WPM: 'ఆంధ్రప్రదేశ్ రాష్ట్రంలో కృష్ణా, గోదావరి నదులు సస్యశ్యామలంగా ప్రవహిస్తున్నాయి. రైతులు ఈ నీటితో సమృద్ధిగా వరి, చెరకు పంటలను పండిస్తూ రాష్ట్రాన్ని అన్నపూర్ణగా నిలుపుతున్నారు.'",
    "textTelugu": "ధారాళ పఠనం (45-60 WPM వేగంతో చదవండి): 'ఆంధ్రప్రదేశ్ రాష్ట్రంలో కృష్ణా, గోదావరి నదులు సస్యశ్యామలంగా ప్రవహిస్తున్నాయి. రైతులు ఈ నీటితో సమృద్ధిగా వరి, చెరకు పంటలను పండిస్తూ రాష్ట్రాన్ని అన్నపూర్ణగా నిలుపుతున్నారు.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 60 సెకన్లలో కనీసం 45 పదాలు చదివారా లేదా నమోదు చేయండి.",
    "options": [
      "ఆంధ్రప్రదేశ్ రాష్ట్రంలో కృష్ణా, గోదావరి నదులు సస్యశ్యామలంగా ప్రవహిస్తున్నాయి...",
      "నదులు ప్రవహిస్తున్నాయి...",
      "రైతులు పంటలు పండిస్తున్నారు...",
      "గోదావరి నది పెద్దది..."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Achieves > 45 WPM with >= 90% accuracy"
  },
  {
    "id": "Q_TEL_FLU_D02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-02: Reads dialogue with proper prosody and vocal pitch changes",
    "text": "Read dialogue with character voice: 'నక్క జిత్తులమారితనంతో, \"కాకిబావా! నీ గానం ఎంత మధురమో ఒక్కసారి పాడు!\" అని పొగిడింది.'",
    "textTelugu": "పాత్రోచిత సంభాషణ శైలిలో చదవండి: 'నక్క జిత్తులమారితనంతో, \"కాకిబావా! నీ గానం ఎంత మధురమో ఒక్కసారి పాడు!\" అని పొగిడింది.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: కొటేషన్ మార్క్స్ లోని సంభాషణను మార్పుతో చదివారా లేదా గమనించండి.",
    "options": [
      "నక్క జిత్తులమారితనంతో, \"కాకిబావా! నీ గానం ఎంత మధురమో ఒక్కసారి పాడు!\" అని పొగిడింది.",
      "నక్క కాకిని చూసింది.",
      "కాకి పాట పాడింది.",
      "నక్క వడ ఎత్తుకుపోయింది."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Modulates voice for quotation tone"
  },
  {
    "id": "Q_TEL_FLU_D03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-02: Accurately decodes domain-specific complex vocabulary in context",
    "text": "Read scientific text: 'సూర్యరశ్మి సమక్షంలో మొక్కలు తమ ఆకులలోని హరిత రేణువుల సహాయంతో ఆహారాన్ని తయారు చేసుకుంటాయి. దీనినే కిరణజన్య సంయోగక్రియ అంటారు.'",
    "textTelugu": "శాస్త్రీయ పదజాలంతో కూడిన వాక్యాన్ని స్పష్టంగా చదవండి: 'సూర్యరశ్మి సమక్షంలో మొక్కలు తమ ఆకులలోని హరిత రేణువుల సహాయంతో ఆహారాన్ని తయారు చేసుకుంటాయి.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సంక్లిష్ట పదాలను విడదీసి చదవకుండా ధారాళంగా చదివారా గమనించండి.",
    "options": [
      "సూర్యరశ్మి సమక్షంలో మొక్కలు తమ ఆకులలోని హరిత రేణువుల సహాయంతో ఆహారాన్ని తయారు చేసుకుంటాయి.",
      "మొక్కలు ఆహారం తింటాయి.",
      "ఆకులు ఆకుపచ్చగా ఉంటాయి.",
      "సూర్యుడు వెలుగునిస్తాడు."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Zero mispronunciations on academic vocabulary"
  },
  {
    "id": "Q_TEL_FLU_D04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-02: Reads complex multi-clause sentences smoothly",
    "text": "Read compound sentence: 'కష్టపడి చదివితే మంచి మార్కులు వస్తాయి; తద్వారా సమాజంలో ఉన్నతమైన స్థానాన్ని సంపాదించవచ్చు.'",
    "textTelugu": "సంయుక్త వాక్యాన్ని చదవండి: 'కష్టపడి చదివితే మంచి మార్కులు వస్తాయి; తద్వారా సమాజంలో ఉన్నతమైన స్థానాన్ని సంపాదించవచ్చు.'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సెమికోలన్ విరామాన్ని పాటిస్తూ పఠనాన్ని సాగించమనండి.",
    "options": [
      "కష్టపడి చదివితే మంచి మార్కులు వస్తాయి; తద్వారా సమాజంలో ఉన్నతమైన స్థానాన్ని సంపాదించవచ్చు.",
      "బాగా చదవాలి.",
      "మార్కులు ముఖ్యం.",
      "మంచి ఉద్యోగం వస్తుంది."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Natural breathing cadence and pause control"
  },
  {
    "id": "Q_TEL_FLU_D05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C2-02: Recites/reads rhymed Telugu poetic meter fluently",
    "text": "Read poetic verse: 'తల్లిదండ్రుల మాట వినని తనయుడున్న, కులమునెల్ల చెరచు గుణహీనుడౌను!'",
    "textTelugu": "పద్య పాదాలను లయబద్ధంగా చదవండి: 'తల్లిదండ్రుల మాట వినని తనయుడున్న, కులమునెల్ల చెరచు గుణహీనుడౌను!'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పద్య లయ మరియు ఛందోభావం స్పష్టంగా వినిపించాలి.",
    "options": [
      "తల్లిదండ్రుల మాట వినని తనయుడున్న, కులమునెల్ల చెరచు గుణహీనుడౌను!",
      "తల్లిదండ్రుల సేవ చేయాలి.",
      "మంచి అలవాట్లు ఉండాలి.",
      "పద్యాలు పాడాలి."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Maintains rhythmic cadence of padyam"
  },
  {
    "id": "Q_TEL_CMP_E01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C3-01: Answers explicit direct factual questions from 1-sentence text",
    "text": "Read: 'రాము తెల్లటి పిల్లిని పెంచుకుంటున్నాడు.' Question: రాము దగ్గర ఉన్న పిల్లి రంగు ఏమిటి?",
    "textTelugu": "వాక్యం: 'రాము తెల్లటి పిల్లిని పెంచుకుంటున్నాడు.' ప్రశ్న: రాము దగ్గర ఉన్న పిల్లి రంగు ఏమిటి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వాక్యాన్ని చదివి, పిల్లి రంగు చెప్పమనండి.",
    "options": [
      "తెలుపు (White)",
      "నలుపు (Black)",
      "గోధుమ (Brown)",
      "ఎరుపు (Red)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies /white/ directly from text"
  },
  {
    "id": "Q_TEL_CMP_E02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C3-01: Recalls explicitly stated calendar noun",
    "text": "Read: 'ఆదివారం బడికి సెలవు.' Question: బడికి ఏ రోజు సెలవు?",
    "textTelugu": "వాక్యం: 'ఆదివారం బడికి సెలవు.' ప్రశ్న: బడికి ఏ రోజు సెలవు?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ప్రశ్నకు సమాధానాన్ని సూటిగా చెప్పమనండి.",
    "options": [
      "ఆదివారం (Sunday)",
      "సోమవారం (Monday)",
      "శుక్రవారం (Friday)",
      "శనివారం (Saturday)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies Sunday accurately"
  },
  {
    "id": "Q_TEL_CMP_E03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C3-01: Extracts direct object from simple sentence",
    "text": "Read: 'సీత తోటలో గులాబీ పూలను కోసింది.' Question: సీత తోటలో వేటిని కోసింది?",
    "textTelugu": "వాక్యం: 'సీత తోటలో గులాబీ పూలను కోసింది.' ప్రశ్న: సీత ఏమి కోసింది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వస్తువును గుర్తించమనండి.",
    "options": [
      "గులాబీ పూలు (Rose flowers)",
      "పండ్లు (Fruits)",
      "కూరగాయలు (Vegetables)",
      "ఆకులు (Leaves)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects rose flowers correctly"
  },
  {
    "id": "Q_TEL_CMP_E04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C3-01: Direct factual extraction",
    "text": "Read: 'అమ్మ రుచికరమైన పాయసం చేసింది.' Question: అమ్మ ఏమి చేసింది?",
    "textTelugu": "వాక్యం: 'అమ్మ రుచికరమైన పాయసం చేసింది.' ప్రశ్న: అమ్మ ఏమి తయారు చేసింది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వాక్యార్థాన్ని చెప్పమనండి.",
    "options": [
      "పాయసం (Payasam)",
      "లడ్డూ (Laddu)",
      "అన్నం (Rice)",
      "దోశ (Dosa)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies sweet item correctly"
  },
  {
    "id": "Q_TEL_CMP_E05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-TEL-C3-01: Recalls activity noun accurately",
    "text": "Read: 'పిల్లలు బడి మైదానంలో కబడ్డీ ఆడుతున్నారు.' Question: పిల్లలు ఏ ఆట ఆడుతున్నారు?",
    "textTelugu": "వాక్యం: 'పిల్లలు బడి మైదానంలో కబడ్డీ ఆడుతున్నారు.' ప్రశ్న: పిల్లలు ఆడుతున్న ఆట ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఆట పేరు చెప్పమనండి.",
    "options": [
      "కబడ్డీ (Kabaddi)",
      "క్రికెట్ (Cricket)",
      "ఖో-ఖో (Kho-Kho)",
      "ఫుట్‌బాల్ (Football)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies Kabaddi correctly"
  },
  {
    "id": "Q_TEL_CMP_M01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C3-01: Infers cause-and-effect relationship in short folk tale",
    "text": "Read: 'కాకికి బాగా దాహం వేసింది. కుండలో నీళ్లు చాలా అడుగున ఉన్నాయి. అది చిన్న చిన్న గులకరాళ్లను తెచ్చి కుండలో వేసింది. నీరు పైకి వచ్చింది.' Question: కాకి గులకరాళ్లను కుండలో ఎందుకు వేసింది?",
    "textTelugu": "కథ: 'కాకికి బాగా దాహం వేసింది. కుండలో నీళ్లు చాలా అడుగున ఉన్నాయి. అది చిన్న చిన్న గులకరాళ్లను తెచ్చి కుండలో వేసింది.' ప్రశ్న: కాకి గులకరాళ్లను కుండలో ఎందుకు వేసింది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: కారణాన్ని (Reasoning) చెప్పమనండి.",
    "options": [
      "నీటిని పైకి తెచ్చి దాహం తీర్చుకోవడానికి",
      "ఆటలాడుకోవడానికి",
      "కుండను పగలగొట్టడానికి",
      "రాళ్లను దాచుకోవడానికి"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Explains water displacement rationale correctly"
  },
  {
    "id": "Q_TEL_CMP_M02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C3-01: Understands implicit relationship between effort and outcome",
    "text": "Read: 'సురేష్ పరీక్షల కోసం రోజూ రాత్రి దాకా చదివాడు. ఫలితాలు వచ్చినప్పుడు అతనికి ప్రథమ శ్రేణి వచ్చింది.' Question: సురేష్‌కు మొదటి స్థానం రావడానికి కారణం ఏమిటి?",
    "textTelugu": "వాక్యాలు: 'సురేష్ పరీక్షల కోసం రోజూ రాత్రి దాకా శ్రద్ధగా చదివాడు. ఫలితాల్లో మొదటి శ్రేణి సాధించాడు.' ప్రశ్న: సురేష్ విజయం వెనుక ఉన్న రహస్యం ఏమిటి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: శ్రమ ఫలితాన్ని గ్రహించారా లేదా చూడండి.",
    "options": [
      "కష్టపడి క్రమశిక్షణతో చదవడం వలన",
      "అదృష్టం వలన",
      "పరీక్షలు రాయకుండా ఉండటం వలన",
      "స్నేహితులతో ఆడుకోవడం వలన"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Articulates hard work as reason"
  },
  {
    "id": "Q_TEL_CMP_M03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C3-01: Connects atmospheric cues with animal behavioral responses",
    "text": "Read: 'ఆకాశంలో నల్లని మబ్బులు కమ్మాయి. చల్లని గాలి వీచింది. నెమలి తన అందమైన పురివిప్పి ఆడింది.' Question: నెమలి ఎప్పుడు పురివిప్పి ఆడింది?",
    "textTelugu": "వాక్యాలు: 'ఆకాశంలో నల్లని మబ్బులు కమ్మాయి. చల్లని గాలి వీచింది. నెమలి పురివిప్పి ఆడింది.' ప్రశ్న: నెమలి ఏ సందర్భంలో నాట్యం చేసింది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వాతావరణ సందర్భాన్ని గుర్తించమనండి.",
    "options": [
      "వర్షం రాబోయే ముందు మబ్బులు పట్టినప్పుడు",
      "మధ్యాహ్నం ఎండలో",
      "చలికాలం రాత్రి పూట",
      "తుఫాను ఆగిపోయిన తర్వాత"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Infers rain onset correctly"
  },
  {
    "id": "Q_TEL_CMP_M04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C3-01: Infers social values from descriptive passages",
    "text": "Read: 'రైతు ఎండనక, వాననక పొలంలో పనిచేసి ధాన్యాన్ని పండిస్తాడు. మన ఆకలి తీరుస్తాడు.' Question: ఈ వాక్యాల ఆధారంగా మనం రైతుకు ఏమి ఇవ్వాలి?",
    "textTelugu": "వాక్యం: 'రైతు ఎండనక, వాననక కష్టపడి మన ఆకలి తీరుస్తాడు.' ప్రశ్న: మనం రైతు పట్ల ఎలా ఉండాలి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: కృతజ్ఞతా భావాన్ని గుర్తించమనండి.",
    "options": [
      "గౌరవం మరియు కృతజ్ఞతతో ఉండాలి",
      "నిర్లక్ష్యం చేయాలి",
      "పట్టించుకోకూడదు",
      "భయపడాలి"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly states gratitude/respect"
  },
  {
    "id": "Q_TEL_CMP_M05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-TEL-C3-01: Extracts main character trait from nature passage",
    "text": "Read: 'చీమలు వేసవి కాలంలోనే ఆహారాన్ని గూటిలో భద్రపరుచుకుంటాయి. వర్షాకాలంలో బయటకు రాకుండా జీవిస్తాయి.' Question: చీమలు ముందుచూపుతో ఏమి చేస్తాయి?",
    "textTelugu": "ప్రశ్న: పై వాక్యాల ప్రకారం చీమల యొక్క ఏ మంచి గుణం మనకు తెలుస్తుంది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ముందస్తు ప్రణాళిక (Planning) భావాన్ని అడగండి.",
    "options": [
      "భవిష్యత్తు కోసం ముందుచూపుతో ఆహారాన్ని సమకూర్చుకోవడం",
      "ఎల్లప్పుడూ నిద్రపోవడం",
      "ఆహారాన్ని వృథా చేయడం",
      "సోమరిగా ఉండటం"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies foresight/planning trait"
  },
  {
    "id": "Q_TEL_CMP_D01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C3-01: Derives deep moral theme and abstract life values from classical fables",
    "text": "Read: 'ఒకప్పుడు ఒక జింక చెరువు వద్ద నీరు తాగుతూ తన అందమైన కొమ్ములను చూసి మురిసిపోయింది. కానీ తన సన్నని కాళ్లను చూసి సిగ్గుపడింది. ఇంతలో ఒక వేటగాడు బాణం వేయగా, ఆ సన్నని కాళ్లే జింకను వేగంగా పరిగెత్తించి ప్రాణాలు కాపాడాయి. కానీ కొమ్ములు చెట్ల కొమ్మల్లో చిక్కుకున్నాయి.' Question: ఈ కథ ఇచ్చే నైతిక సందేశం ఏమిటి?",
    "textTelugu": "కథ ఆధారంగా నైతిక సందేశాన్ని గుర్తించండి: జింక కొమ్ములు - సన్నని కాళ్ల కథ.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పైపై అందం కంటే ఉపయోగపడే గుణమే గొప్పదని గ్రహించారా చూడండి.",
    "options": [
      "పైపై అందం కంటే ఆపదలో ఆదుకునే గుణమే నిజమైన విలువైనది",
      "కొమ్ములు మాత్రమే ముఖ్యం",
      "వేగంగా పరిగెత్తకూడదు",
      "అడవిలో తిరగకూడదు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Articulates utility over cosmetic appearance"
  },
  {
    "id": "Q_TEL_CMP_D02",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C3-01: Synthesizes ecological cause-and-effect from multi-sentence informational text",
    "text": "Read informational passage: 'చెట్లు గాలిలోని కార్బన్ డయాక్సైడ్‌ను పీల్చుకుని మనకు ప్రాణవాయువైన ఆక్సిజన్‌ను అందిస్తాయి. చెట్లను విచక్షణారహితంగా నరికివేస్తే భూతాపం పెరిగి వర్షాలు తగ్గిపోతాయి.' Question: చెట్లను కాపాడుకోకపోతే జరిగే దుష్పరిణామం ఏమిటి?",
    "textTelugu": "ప్రశ్న: చెట్లను నరికివేయడం వల్ల కలిగే ప్రధాన నష్టం ఏమిటి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పర్యావరణ పరిణామాలను గ్రహించారా చూడండి.",
    "options": [
      "భూతాపం పెరిగి, ప్రాణవాయువు కొరత ఏర్పడి వర్షాలు తగ్గుతాయి",
      "చలి విపరీతంగా పెరుగుతుంది",
      "నీటి ప్రవాహం ఎక్కువవుతుంది",
      "ఏ మార్పూ ఉండదు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies global warming and oxygen depletion risks accurately"
  },
  {
    "id": "Q_TEL_CMP_D03",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C3-01: Formulates central topic title representing entire text gist",
    "text": "Read: 'భారతదేశానికి స్వాతంత్ర్యం తీసుకురావడానికి ఎందరో వీరులు తమ ప్రాణాలను త్యాగం చేశారు. గాంధీజీ అహింసా మార్గంలో పోరాడగా, భగత్‌సింగ్ వంటి యువకులు ధైర్యసాహసాలతో దేశభక్తిని రగిలించారు.' Question: ఈ పేరాకు అత్యంత సరియైన శీర్షిక ఏది?",
    "textTelugu": "ప్రశ్న: పై పేరాకు తగిన శీర్షికను (Title) ఎంపిక చేయండి:",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పేరా యొక్క సారాంశాన్ని ఒక పేరుగా చెప్పమనండి.",
    "options": [
      "స్వాతంత్ర్య సమరయోధుల త్యాగాలు",
      "విదేశీ ప్రయాణాలు",
      "పరీక్షల తయారీ",
      "ఆటల ప్రాముఖ్యత"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects independence heroes sacrifice title"
  },
  {
    "id": "Q_TEL_CMP_D04",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C3-01: Evaluates character empathy and socio-emotional traits",
    "text": "Read: 'రాము తన స్నేహితుడు సోము పెన్సిల్ పోగొట్టుకున్నప్పుడు తన వద్ద ఉన్న అదనపు పెన్సిల్‌ను ఇచ్చాడు. సాయంత్రం ఇద్దరూ కలిసి లెక్కలు నేర్చుకున్నారు.' Question: రాము యొక్క ఏ గుణం ఇక్కడ ప్రస్ఫుటమవుతుంది?",
    "textTelugu": "ప్రశ్న: రాము ప్రవర్తన ద్వారా అతనిలోని ఏ సద్గుణం వ్యక్తమవుతుంది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: స్నేహభావం, సహాయ గుణం గుర్తించారా లేదా చూడండి.",
    "options": [
      "స్నేహశీలత, ఆపదలో సహాయం చేసే గుణం",
      "స్వార్థం",
      "కోపం",
      "గర్వం"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Infers helpfulness and empathy correctly"
  },
  {
    "id": "Q_TEL_CMP_D05",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-TEL-C3-01: Weighs pros and cons to deduce author's balanced recommendation",
    "text": "Read passage: 'కంప్యూటర్లు మరియు ఇంటర్నెట్ ద్వారా మనం ప్రపంచంలో ఎక్కడ ఉన్న సమాచారాన్నైనా క్షణాల్లో తెలుసుకోవచ్చు. కానీ ఎక్కువ సమయం స్క్రీన్ల ముందు గడపడం కంటికి, ఆరోగ్యానికి హానికరం.' Question: రచయిత పాఠకులకు ఇచ్చే సమతుల్య సలహా ఏమిటి?",
    "textTelugu": "ప్రశ్న: సాంకేతిక పరిజ్ఞానం ఉపయోగంపై రచయిత ఇచ్చే సూచన ఏమిటి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పరిమిత వినియోగం ప్రాముఖ్యతను గుర్తించమనండి.",
    "options": [
      "సాంకేతికతను జ్ఞానం కోసం ఉపయోగించుకోవాలి, కానీ అతిగా వాడి ఆరోగ్యం పాడుచేసుకోకూడదు",
      "కంప్యూటర్లను పూర్తిగా వాడటం మానేయాలి",
      "రోజంతా కంప్యూటర్ ముందే ఉండాలి",
      "పుస్తకాలు అసలు చదవకూడదు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately summarizes moderation advice"
  },
  {
    "id": "Q_ENG_PA_E01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-01: Isolates initial consonant sound /b/ in CVC words",
    "text": "Identify the initial sound in the spoken word 'Bat'.",
    "textTelugu": "What is the first sound in 'Bat'?",
    "oralPrompt": "Teacher prompt: Say 'Bat' clearly and ask student for the beginning sound.",
    "options": [
      "/b/ as in Ball",
      "/m/ as in Mat",
      "/s/ as in Sun",
      "/t/ as in Top"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Instantly produces /b/ phoneme"
  },
  {
    "id": "Q_ENG_PA_E02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-01: Matches initial phoneme across oral vocabulary",
    "text": "Which word starts with the same sound as 'Sun'?",
    "textTelugu": "Which word has the beginning sound /s/?",
    "oralPrompt": "Teacher prompt: Say 'Sun'. Which other word starts with /s/?",
    "options": [
      "Star",
      "Moon",
      "Tree",
      "Fish"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'Star' immediately"
  },
  {
    "id": "Q_ENG_PA_E03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-01: Isolates final consonant sound /t/ in spoken monosyllables",
    "text": "Identify the ending sound in the word 'Cat'.",
    "textTelugu": "What is the last sound in 'Cat'?",
    "oralPrompt": "Teacher prompt: Pronounce 'Cat' and emphasize the final stop consonant.",
    "options": [
      "/t/ as in Tap",
      "/k/ as in Cup",
      "/m/ as in Map",
      "/p/ as in Pen"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Isolates /t/ correctly"
  },
  {
    "id": "Q_ENG_PA_E04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-01: Identifies simple -at family rhyming words",
    "text": "Which word rhymes with 'Cat'?",
    "textTelugu": "Which word rhymes with 'Cat'?",
    "oralPrompt": "Teacher prompt: Which word has the same ending sound as 'Cat'?",
    "options": [
      "Mat",
      "Dog",
      "Cup",
      "Pen"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'Mat' accurately"
  },
  {
    "id": "Q_ENG_PA_E05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-01: Recognizes nasal consonant /m/ in common nouns",
    "text": "Identify the initial sound in the word 'Moon'.",
    "textTelugu": "What is the first sound in 'Moon'?",
    "oralPrompt": "Teacher prompt: Ask student for the first sound of 'Moon'.",
    "options": [
      "/m/ as in Man",
      "/n/ as in Net",
      "/s/ as in Sun",
      "/p/ as in Pot"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly produces /m/"
  },
  {
    "id": "Q_ENG_PA_M01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-01: Blends 3 separate phonemes into a recognized CVC word",
    "text": "Blend these individual sounds together: /c/ + /a/ + /t/ = ?",
    "textTelugu": "Blend the sounds: /k/ + /æ/ + /t/ into a word.",
    "oralPrompt": "Teacher prompt: Sound out /c/ - /a/ - /t/ with pauses and ask for the blended word.",
    "options": [
      "Cat",
      "Cut",
      "Cot",
      "Car"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Smooth oral blending into 'Cat'"
  },
  {
    "id": "Q_ENG_PA_M02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-01: Discriminates short medial vowel phonemes",
    "text": "Identify the short vowel sound in the middle of 'Pin'.",
    "textTelugu": "What is the middle vowel sound in 'Pin'?",
    "oralPrompt": "Teacher prompt: Emphasize the short vowel /ɪ/ in 'Pin'.",
    "options": [
      "Short /i/ as in In",
      "Short /a/ as in Apple",
      "Short /o/ as in On",
      "Short /u/ as in Up"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Isolates short /i/ accurately"
  },
  {
    "id": "Q_ENG_PA_M03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-01: Identifies -ing rime family words",
    "text": "Which word rhymes with 'Ring'?",
    "textTelugu": "Which word rhymes with 'Ring'?",
    "oralPrompt": "Teacher prompt: Find the rhyming match for 'Ring'.",
    "options": [
      "King",
      "Run",
      "Red",
      "Rat"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'King' instantly"
  },
  {
    "id": "Q_ENG_PA_M04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-01: Recognizes that digraph 'sh' represents one single phoneme",
    "text": "How many sounds (phonemes) are in the spoken word 'Ship'?",
    "textTelugu": "Count the sounds in 'Ship': /sh/ - /i/ - /p/.",
    "oralPrompt": "Teacher prompt: Tap fingers for each distinct sound in 'Ship'.",
    "options": [
      "3 sounds (/sh/ - /i/ - /p/)",
      "4 sounds",
      "2 sounds",
      "1 sound"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly counts 3 phonemes"
  },
  {
    "id": "Q_ENG_PA_M05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-01: Manipulates initial phonemes through substitution",
    "text": "Change the first sound in 'Hop' to /m/. What is the new word?",
    "textTelugu": "Substitute /h/ in 'Hop' with /m/.",
    "oralPrompt": "Teacher prompt: If we take 'Hop' and change the beginning to /m/, what word do we get?",
    "options": [
      "Mop",
      "Map",
      "Top",
      "Pop"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Produces 'Mop' correctly"
  },
  {
    "id": "Q_ENG_PA_D01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-01: Identifies 2-letter r-blends in onset position",
    "text": "Identify the beginning consonant blend in the word 'Frog'.",
    "textTelugu": "What is the initial blend in 'Frog'?",
    "oralPrompt": "Teacher prompt: Ask the student to isolate the two consonant sounds at the start of 'Frog'.",
    "options": [
      "/fr/ blend",
      "/fl/ blend",
      "/br/ blend",
      "/pr/ blend"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Isolates /fr/ blend clearly"
  },
  {
    "id": "Q_ENG_PA_D02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-01: Distinguishes voiceless from voiced 'th' digraphs",
    "text": "Which word has the voiceless digraph /th/ sound as in 'Thin'?",
    "textTelugu": "Which word contains the /th/ sound as in 'Thin'?",
    "oralPrompt": "Teacher prompt: Differentiate /th/ in 'Thin' vs /th/ in 'This'.",
    "options": [
      "Thumb",
      "This",
      "That",
      "They"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'Thumb' accurately"
  },
  {
    "id": "Q_ENG_PA_D03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-01: Segments complex CCVCC words into 5 distinct phonemes",
    "text": "Segment the word 'Stump' into all its individual phonemes.",
    "textTelugu": "Segment 'Stump' into sounds: /s/ - /t/ - /u/ - /m/ - /p/.",
    "oralPrompt": "Teacher prompt: Tap out every sound in the CCVCC word 'Stump'.",
    "options": [
      "5 sounds: /s/-/t/-/u/-/m/-/p/",
      "4 sounds",
      "3 sounds",
      "6 sounds"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly counts and sounds 5 phonemes"
  },
  {
    "id": "Q_ENG_PA_D04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-01: Discriminates long vowel sounds with split digraphs",
    "text": "Which word has a long /a/ vowel sound (silent 'e' rule)?",
    "textTelugu": "Which word has the long vowel sound /eɪ/?",
    "oralPrompt": "Teacher prompt: Listen to the vowel sounds in 'Cap' vs 'Cape'.",
    "options": [
      "Cake (long /a/)",
      "Cat (short /a/)",
      "Cup",
      "Car"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'Cake' correctly"
  },
  {
    "id": "Q_ENG_PA_D05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_PHONOLOGY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-01: Deletes initial consonant from s-clusters",
    "text": "Delete the sound /s/ from 'Stop'. What word remains?",
    "textTelugu": "Say 'Stop' without the /s/ sound.",
    "oralPrompt": "Teacher prompt: If you say 'Stop' without /s/, what is left?",
    "options": [
      "Top",
      "Pot",
      "Mop",
      "Tap"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Instantly says 'Top'"
  },
  {
    "id": "Q_ENG_SW_E01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-02: Reads top Dolch sight words with automaticity (< 2s)",
    "text": "Read the high-frequency sight word: 'The'.",
    "textTelugu": "Read this word aloud: 'The'",
    "oralPrompt": "Teacher prompt: Show flashcard with 'The' and ask student to read instantly.",
    "options": [
      "The",
      "And",
      "You",
      "For"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Recognizes 'The' instantly"
  },
  {
    "id": "Q_ENG_SW_E02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-02: Instant sight recognition of 'And'",
    "text": "Read the sight word: 'And'.",
    "textTelugu": "Read this word aloud: 'And'",
    "oralPrompt": "Teacher prompt: Ask student to read 'And'.",
    "options": [
      "And",
      "Are",
      "All",
      "At"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'And' without sounding out letters"
  },
  {
    "id": "Q_ENG_SW_E03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-02: Decodes common CVC short /u/ words",
    "text": "Decode the 3-letter CVC word: 'Sun'.",
    "textTelugu": "Read this word aloud: 'Sun'",
    "oralPrompt": "Teacher prompt: Show 'Sun' and ask the child to read it.",
    "options": [
      "Sun",
      "Run",
      "Fun",
      "Gun"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Decodes 'Sun' accurately"
  },
  {
    "id": "Q_ENG_SW_E04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-02: Instant recognition of 2-letter auxiliary 'Is'",
    "text": "Read the sight word: 'Is'.",
    "textTelugu": "Read this word aloud: 'Is'",
    "oralPrompt": "Teacher prompt: Read 'Is' from sight card.",
    "options": [
      "Is",
      "In",
      "It",
      "If"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Is' immediately"
  },
  {
    "id": "Q_ENG_SW_E05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C1-02: Blends short /e/ CVC word",
    "text": "Decode the CVC word: 'Pen'.",
    "textTelugu": "Read this word aloud: 'Pen'",
    "oralPrompt": "Teacher prompt: Ask child to read 'Pen'.",
    "options": [
      "Pen",
      "Pan",
      "Pin",
      "Pet"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Pen' without hesitation"
  },
  {
    "id": "Q_ENG_SW_M01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-02: Reads multi-syllable high-frequency conjunctions",
    "text": "Read the sight word: 'Because'.",
    "textTelugu": "Read this sight word: 'Because'",
    "oralPrompt": "Teacher prompt: Flash 'Because' on screen/card.",
    "options": [
      "Because",
      "Before",
      "Behind",
      "Beside"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Because' fluently"
  },
  {
    "id": "Q_ENG_SW_M02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-02: Decodes words containing consonant digraph -sh",
    "text": "Decode the CVC word with initial digraph: 'Fish'.",
    "textTelugu": "Read this word: 'Fish'",
    "oralPrompt": "Teacher prompt: Blend /f/ - /i/ - /sh/.",
    "options": [
      "Fish",
      "Dish",
      "Wish",
      "Ship"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Decodes 'Fish' correctly"
  },
  {
    "id": "Q_ENG_SW_M03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-02: Reads wh- question sight words",
    "text": "Read the sight word: 'Where'.",
    "textTelugu": "Read this question sight word: 'Where'",
    "oralPrompt": "Teacher prompt: Ask student to read 'Where'.",
    "options": [
      "Where",
      "There",
      "Here",
      "When"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Where' without confusing with 'There'"
  },
  {
    "id": "Q_ENG_SW_M04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-02: Decodes words ending with -ck digraph",
    "text": "Decode the CVC word: 'Duck'.",
    "textTelugu": "Read this word: 'Duck'",
    "oralPrompt": "Teacher prompt: Identify the -ck ending sound in 'Duck'.",
    "options": [
      "Duck",
      "Luck",
      "Back",
      "Sack"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Duck' accurately"
  },
  {
    "id": "Q_ENG_SW_M05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C1-02: Recognizes irregular sight word spelling patterns (-ould)",
    "text": "Read the sight word: 'Could'.",
    "textTelugu": "Read this modal sight word: 'Could'",
    "oralPrompt": "Teacher prompt: Ask student to read silent-l word 'Could'.",
    "options": [
      "Could",
      "Would",
      "Should",
      "Cold"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly reads 'Could'"
  },
  {
    "id": "Q_ENG_SW_D01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-02: Accurately decodes complex phonogram -ought",
    "text": "Read the irregular sight word: 'Thought'.",
    "textTelugu": "Read this irregular sight word: 'Thought'",
    "oralPrompt": "Teacher prompt: Ask student to read 'Thought'.",
    "options": [
      "Thought",
      "Through",
      "Taught",
      "Though"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Thought' correctly"
  },
  {
    "id": "Q_ENG_SW_D02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-02: Distinguishes 'through' from visually similar orthographic patterns",
    "text": "Read the sight word: 'Through'.",
    "textTelugu": "Read this preposition sight word: 'Through'",
    "oralPrompt": "Teacher prompt: Show flashcard 'Through'.",
    "options": [
      "Through",
      "Though",
      "Thorough",
      "Throw"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately discriminates and reads 'Through'"
  },
  {
    "id": "Q_ENG_SW_D03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-02: Decodes 3-syllable descriptive academic vocabulary",
    "text": "Read the multi-syllable sight word: 'Beautiful'.",
    "textTelugu": "Read this word: 'Beautiful'",
    "oralPrompt": "Teacher prompt: Observe multi-syllable decoding cadence.",
    "options": [
      "Beautiful",
      "Bountiful",
      "Dutiful",
      "Peaceful"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'Beautiful' fluently"
  },
  {
    "id": "Q_ENG_SW_D04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-02: Recognizes and decodes 2-morpheme compound words",
    "text": "Decode the compound word: 'Butterfly'.",
    "textTelugu": "Read this compound word: 'Butterfly'",
    "oralPrompt": "Teacher prompt: Check if child breaks word into 'butter' + 'fly'.",
    "options": [
      "Butterfly",
      "Dragonfly",
      "Housefly",
      "Firefly"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Seamless compound decoding"
  },
  {
    "id": "Q_ENG_SW_D05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_SIGHT_WORDS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C1-02: Reads advanced irregular sight words with silent letters",
    "text": "Read the irregular sight word: 'Daughter'.",
    "textTelugu": "Read this irregular sight word: 'Daughter'",
    "oralPrompt": "Teacher prompt: Read silent -gh- family word 'Daughter'.",
    "options": [
      "Daughter",
      "Laughter",
      "Doctor",
      "Sister"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Pronounces /dɔːtər/ accurately"
  },
  {
    "id": "Q_ENG_FLU_E01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C2-01: Reads 3-4 word simple declarative sentences with 1:1 correspondence",
    "text": "Read simple 3-word sentence: 'This is a cat.'",
    "textTelugu": "Read aloud: 'This is a cat.'",
    "oralPrompt": "Teacher prompt: Ask child to read from left to right with finger pointing.",
    "options": [
      "This is a cat.",
      "This is a dog.",
      "That is a cat.",
      "Here is a cat."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads accurately in under 4 seconds"
  },
  {
    "id": "Q_ENG_FLU_E02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C2-01: Reads familiar personal pronoun sentence",
    "text": "Read sentence: 'I like to play.'",
    "textTelugu": "Read aloud: 'I like to play.'",
    "oralPrompt": "Teacher prompt: Listen for fluency on high-frequency verbs.",
    "options": [
      "I like to play.",
      "I like to read.",
      "I want to play.",
      "We like to play."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Smooth reading without pauses"
  },
  {
    "id": "Q_ENG_FLU_E03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C2-01: Reads CVC adjective descriptor sentence",
    "text": "Read sentence: 'The sun is hot.'",
    "textTelugu": "Read aloud: 'The sun is hot.'",
    "oralPrompt": "Teacher prompt: Ask child to read aloud.",
    "options": [
      "The sun is hot.",
      "The sun is bright.",
      "The day is hot.",
      "The moon is cool."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads cleanly"
  },
  {
    "id": "Q_ENG_FLU_E04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C2-01: Reads interrogative sentences with vocal question inflection",
    "text": "Read question: 'Where is the dog?'",
    "textTelugu": "Read aloud: 'Where is the dog?'",
    "oralPrompt": "Teacher prompt: Check if the child raises pitch at the question mark.",
    "options": [
      "Where is the dog?",
      "Here is the dog.",
      "What is the dog?",
      "Where is the cat?"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Voice rises at question mark"
  },
  {
    "id": "Q_ENG_FLU_E05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C2-01: Reads 5-word sentence with color adjective",
    "text": "Read sentence: 'Look at the red bird.'",
    "textTelugu": "Read aloud: 'Look at the red bird.'",
    "oralPrompt": "Teacher prompt: Observe word phrasing.",
    "options": [
      "Look at the red bird.",
      "Look at the big bird.",
      "See the red bird.",
      "Look at the bird."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads smoothly"
  },
  {
    "id": "Q_ENG_FLU_M01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C2-01: Reads grade 2 short connected sentences at 30-35 WPM",
    "text": "Read connected text at 30 WPM: 'Raju has a little brown dog. The dog likes to run and play in the garden every morning.'",
    "textTelugu": "Read aloud at 30-35 WPM: 'Raju has a little brown dog. The dog likes to run and play in the garden every morning.'",
    "oralPrompt": "Teacher prompt: Time reading of the 2-sentence passage with stopwatch.",
    "options": [
      "Raju has a little brown dog. The dog likes to run...",
      "Raju has a dog...",
      "The dog plays in garden...",
      "Raju runs with dog..."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads in under 12 seconds with >= 90% accuracy"
  },
  {
    "id": "Q_ENG_FLU_M02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C2-01: Modulates prosody and volume for exclamation marks",
    "text": "Read with expression: 'Watch out! The bus is coming fast!'",
    "textTelugu": "Read with expression: 'Watch out! The bus is coming fast!'",
    "oralPrompt": "Teacher prompt: Check for urgent warning tone on exclamation marks.",
    "options": [
      "Watch out! The bus is coming fast!",
      "The bus is coming.",
      "Look at the bus.",
      "Watch out the bus."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Expressive warning inflection"
  },
  {
    "id": "Q_ENG_FLU_M03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C2-01: Uses comma markers for phrase boundary pauses",
    "text": "Read with comma pause: 'We bought apples, bananas, and mangoes from the fruit shop.'",
    "textTelugu": "Read pausing at commas: 'We bought apples, bananas, and mangoes from the fruit shop.'",
    "oralPrompt": "Teacher prompt: Check brief pauses after 'apples' and 'bananas'.",
    "options": [
      "We bought apples, bananas, and mangoes from the fruit shop.",
      "We bought fruits.",
      "Apples and bananas.",
      "We went to the shop."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Distinct pause at each serial comma"
  },
  {
    "id": "Q_ENG_FLU_M04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C2-01: Decodes academic school vocabulary smoothly in sentence context",
    "text": "Read sentence: 'My teacher helps me learn mathematics and English in our school.'",
    "textTelugu": "Read aloud: 'My teacher helps me learn mathematics and English in our school.'",
    "oralPrompt": "Teacher prompt: Observe decoding of 'mathematics'.",
    "options": [
      "My teacher helps me learn mathematics and English in our school.",
      "My teacher is good.",
      "I like mathematics.",
      "We learn English."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 'mathematics' without faltering"
  },
  {
    "id": "Q_ENG_FLU_M05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C2-01: Reads quotation dialogue with conversational prosody",
    "text": "Read question dialogue: '\"Can I borrow your pencil, please?\" asked Mary.'",
    "textTelugu": "Read aloud: '\"Can I borrow your pencil, please?\" asked Mary.'",
    "oralPrompt": "Teacher prompt: Listen for polite conversational tone inside quotes.",
    "options": [
      "\"Can I borrow your pencil, please?\" asked Mary.",
      "Give me your pencil.",
      "Mary has a pencil.",
      "Where is my pencil?"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Natural polite tone"
  },
  {
    "id": "Q_ENG_FLU_D01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C2-01: Reads grade 3 expository paragraph at 45-60 WPM with full accuracy",
    "text": "Read Class 3 passage at 45–60 WPM: 'The Indian space program has achieved wonderful milestones. Our scientists work hard with dedication to send satellites and explore the moon and Mars for the benefit of humanity.'",
    "textTelugu": "Read passage aloud at 45-60 WPM: 'The Indian space program has achieved wonderful milestones...'",
    "oralPrompt": "Teacher prompt: Assess WPM pacing and pronunciation of 'milestones' and 'satellites'.",
    "options": [
      "The Indian space program has achieved wonderful milestones...",
      "Scientists work hard...",
      "India went to moon...",
      "Satellites in space..."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Achieves >= 45 WPM with correct pacing and phrasing"
  },
  {
    "id": "Q_ENG_FLU_D02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C2-01: Reads complex sentences with subordinate concessive clauses fluently",
    "text": "Read complex sentence: 'Although it rained heavily all afternoon, the children enjoyed playing paper boats in the street puddle.'",
    "textTelugu": "Read aloud: 'Although it rained heavily all afternoon, the children enjoyed playing paper boats in the street puddle.'",
    "oralPrompt": "Teacher prompt: Notice pause at subordinate clause boundary.",
    "options": [
      "Although it rained heavily all afternoon, the children enjoyed playing paper boats...",
      "It rained heavily.",
      "Children played paper boats.",
      "Puddles in the street."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Pauses accurately after 'afternoon'"
  },
  {
    "id": "Q_ENG_FLU_D03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C2-01: Decodes polysyllabic scientific terminology with correct stress",
    "text": "Read scientific explanation: 'Photosynthesis is the process by which green leaves capture sunlight and turn carbon dioxide into nourishing food.'",
    "textTelugu": "Read scientific sentence aloud: 'Photosynthesis is the process by which green leaves capture sunlight...'",
    "oralPrompt": "Teacher prompt: Observe decoding of 'Photosynthesis' and 'nourishing'.",
    "options": [
      "Photosynthesis is the process by which green leaves capture sunlight...",
      "Leaves make food from sun.",
      "Green plants grow tall.",
      "Carbon dioxide and oxygen."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately accents /foʊtoʊˈsɪnθəsɪs/"
  },
  {
    "id": "Q_ENG_FLU_D04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C2-01: Reads classic literary poetic meter with expressive pacing",
    "text": "Read poetic lines: 'Two roads diverged in a yellow wood, and sorry I could not travel both and be one traveler.'",
    "textTelugu": "Read poetic verse with rhythm: 'Two roads diverged in a yellow wood...'",
    "oralPrompt": "Teacher prompt: Check for poetic meter pacing.",
    "options": [
      "Two roads diverged in a yellow wood, and sorry I could not travel both...",
      "Two roads in a wood.",
      "I could not travel both.",
      "Yellow wood road."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Rhythmic cadence preserved"
  },
  {
    "id": "Q_ENG_FLU_D05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C2-01: Matches voice delivery to adverbs ('whispered nervously')",
    "text": "Read narrative dialogue: '\"If we don\\'t hurry up,\" whispered Arjun nervously, \"we are going to miss the annual sports prize distribution ceremony!\"'",
    "textTelugu": "Read narrative dialogue: '\"If we don\\'t hurry up,\" whispered Arjun nervously...'",
    "oralPrompt": "Teacher prompt: Check if the child lowers voice for the whisper tag.",
    "options": [
      "\"If we don't hurry up,\" whispered Arjun nervously, \"we are going to miss the annual sports prize distribution ceremony!\"",
      "Arjun ran fast to the school.",
      "Sports day prizes.",
      "We missed the bus."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Differentiates whispering character dialogue"
  },
  {
    "id": "Q_ENG_CMP_E01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-01: Locates direct color detail in single sentence text",
    "text": "Read: 'Tom has a red bicycle.' Question: What color is Tom's bicycle?",
    "textTelugu": "Text: 'Tom has a red bicycle.' Question: What color is the bicycle?",
    "oralPrompt": "Teacher prompt: Ask child what color bicycle Tom has.",
    "options": [
      "Red",
      "Blue",
      "Green",
      "Yellow"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'Red' immediately"
  },
  {
    "id": "Q_ENG_CMP_E02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-01: Identifies location noun from simple factual text",
    "text": "Read: 'The fish lives in the water.' Question: Where does the fish live?",
    "textTelugu": "Text: 'The fish lives in the water.' Question: Where does the fish live?",
    "oralPrompt": "Teacher prompt: Ask where the fish lives.",
    "options": [
      "In the water",
      "In a tree",
      "On the grass",
      "In the sky"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 'In the water'"
  },
  {
    "id": "Q_ENG_CMP_E03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-01: Recalls explicitly stated object",
    "text": "Read: 'Priya drinks a glass of warm milk before going to bed.' Question: What does Priya drink?",
    "textTelugu": "Text: 'Priya drinks a glass of warm milk before going to bed.' Question: What does she drink?",
    "oralPrompt": "Teacher prompt: Identify the drink.",
    "options": [
      "Warm milk",
      "Fruit juice",
      "Cold water",
      "Tea"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 'Warm milk'"
  },
  {
    "id": "Q_ENG_CMP_E04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-01: Identifies subject character from action sentence",
    "text": "Read: 'The monkey climbs the tall coconut tree.' Question: Which animal climbs the tree?",
    "textTelugu": "Text: 'The monkey climbs the tall coconut tree.' Question: Which animal climbs the tree?",
    "oralPrompt": "Teacher prompt: Ask which animal is mentioned.",
    "options": [
      "The monkey",
      "The elephant",
      "The dog",
      "The lion"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'The monkey' accurately"
  },
  {
    "id": "Q_ENG_CMP_E05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-01: Recalls gift noun from 2-sentence context",
    "text": "Read: 'Today is Anita\\'s birthday. Her mother gave her a pretty doll.' Question: What gift did Anita receive?",
    "textTelugu": "Text: 'Today is Anita's birthday. Her mother gave her a pretty doll.' Question: What gift did Anita get?",
    "oralPrompt": "Teacher prompt: Ask for the birthday gift.",
    "options": [
      "A pretty doll",
      "A new book",
      "A red bicycle",
      "A box of crayons"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'A pretty doll'"
  },
  {
    "id": "Q_ENG_CMP_M01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-01: Infers cause-and-effect relationship between weather and personal equipment",
    "text": "Read: 'It was raining heavily outside. Mohan took his colorful umbrella before leaving the house.' Question: Why did Mohan take his umbrella?",
    "textTelugu": "Text: 'It was raining heavily outside. Mohan took his umbrella before leaving the house.' Question: Why did Mohan take his umbrella?",
    "oralPrompt": "Teacher prompt: Ask child why Mohan needed an umbrella.",
    "options": [
      "Because it was raining heavily outside and he wanted to stay dry",
      "Because it was very hot and sunny",
      "To play cricket with friends",
      "Because he forgot his bag"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Explains protection against rain accurately"
  },
  {
    "id": "Q_ENG_CMP_M02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-01: Identifies purpose of animal actions in multi-sentence narrative",
    "text": "Read: 'A little bird made its nest in a mango tree. One day, two baby chicks hatched from the eggs. The mother bird flew to find worms for her hungry chicks.' Question: What was the mother bird looking for?",
    "textTelugu": "Text: '...The mother bird flew to find worms for her hungry chicks.' Question: What was the mother bird looking for?",
    "oralPrompt": "Teacher prompt: Ask what food the mother bird went to search for.",
    "options": [
      "Worms to feed her hungry baby chicks",
      "Twigs to build another nest",
      "Water to bathe",
      "A cage to sleep in"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers worms for baby chicks correctly"
  },
  {
    "id": "Q_ENG_CMP_M03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-01: Infers lesson and winner rationale from classic animal story",
    "text": "Read: 'The tortoise kept walking slowly and steadily without stopping. The rabbit took a long nap under a tree. In the end, the tortoise crossed the finish line first.' Question: Why did the tortoise win the race?",
    "textTelugu": "Question: Why did the tortoise win the race against the rabbit?",
    "oralPrompt": "Teacher prompt: Connect consistency with victory.",
    "options": [
      "Because he kept moving steadily while the rabbit fell asleep",
      "Because he ran faster than the rabbit",
      "Because the rabbit got lost",
      "Because the race was canceled"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Explains steady perseverance won the race"
  },
  {
    "id": "Q_ENG_CMP_M04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-01: Recognizes value of daily practice leading to achievement",
    "text": "Read: 'Simran practiced drawing every evening after finishing her homework. During the school art competition, she won the first prize.' Question: How did Simran achieve first prize?",
    "textTelugu": "Question: What helped Simran win the art competition?",
    "oralPrompt": "Teacher prompt: Connect daily practice to competition success.",
    "options": [
      "By practicing drawing diligently every evening",
      "By buying expensive paints",
      "By asking her teacher to draw for her",
      "By pure luck"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers daily practice"
  },
  {
    "id": "Q_ENG_CMP_M05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-01: Extracts sequence of natural process from informational text",
    "text": "Read: 'Bees fly from flower to flower collecting sweet nectar. They carry this nectar back to the beehive to make delicious honey.' Question: Where do bees store nectar to produce honey?",
    "textTelugu": "Question: Where do bees take the nectar to make honey?",
    "oralPrompt": "Teacher prompt: Ask about where honey is made.",
    "options": [
      "In the beehive",
      "On the flower petals",
      "In the ground",
      "Under tree roots"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies beehive correctly"
  },
  {
    "id": "Q_ENG_CMP_D01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-01: Formulates abstract moral theme and problem-solving proverb from fable",
    "text": "Read: 'A thirsty crow found a pitcher with water at the bottom, beyond his reach. Instead of flying away in despair, he patiently dropped pebbles into the pitcher one by one until the water rose to the brim.' Question: What is the main moral lesson of this story?",
    "textTelugu": "Question: What is the primary moral lesson of 'The Thirsty Crow'?",
    "oralPrompt": "Teacher prompt: Ask for the philosophical/problem-solving takeaway.",
    "options": [
      "Where there is a will and thoughtful effort, there is a way to solve difficulties",
      "Never drink water from pitchers",
      "Big birds are stronger than small birds",
      "Pebbles make water dirty"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Articulates 'Where there is a will, there is a way'"
  },
  {
    "id": "Q_ENG_CMP_D02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-01: Synthesizes multi-paragraph environmental rationale",
    "text": "Read: 'Plastic bags take hundreds of years to decompose. When thrown into drains, they block water flow and cause floods. When swallowed by cows and marine animals, they cause fatal illnesses. Therefore, our government encourages using cloth bags.' Question: Based on this passage, why should we switch to cloth bags?",
    "textTelugu": "Question: What is the central reason for replacing plastic bags with cloth bags?",
    "oralPrompt": "Teacher prompt: Check synthesis of multiple environmental hazards.",
    "options": [
      "Plastic pollutes water bodies, clogs drainage, and harms wildlife fatally",
      "Cloth bags are cheaper than plastic",
      "Plastic looks less colorful",
      "Cloth bags are lighter to carry"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Explains wildlife harm and urban drainage blockage accurately"
  },
  {
    "id": "Q_ENG_CMP_D03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-01: Evaluates overarching biographical theme and selects executive title",
    "text": "Read: 'Dr. A.P.J. Abdul Kalam came from a humble family in Rameswaram. Through hard work, curiosity, and love for science, he became a renowned missile scientist and later the beloved President of India.' Question: Which title best summarizes this biographical excerpt?",
    "textTelugu": "Question: Which title best captures the theme of Dr. Kalam's journey?",
    "oralPrompt": "Teacher prompt: Ask student for the most fitting title.",
    "options": [
      "From Humble Beginnings to the People's President",
      "The Geography of Rameswaram Island",
      "Types of Missiles in India",
      "How to Pass Science Exams"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'From Humble Beginnings to the People's President'"
  },
  {
    "id": "Q_ENG_CMP_D04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-01: Makes scientific inferences from narrative historical context",
    "text": "Read: 'Grandfather showed Kabir an old brass compass. \"This needle always points north, no matter which way you turn,\" he explained. Kabir realized that travelers in ancient times used this tool to navigate oceans without losing their way.' Question: What did Kabir deduce about the compass?",
    "textTelugu": "Question: What inference did Kabir make regarding the brass compass?",
    "oralPrompt": "Teacher prompt: Check student understanding of compass navigation.",
    "options": [
      "It enabled ancient sailors to determine direction reliably across vast oceans",
      "It was used to measure wind speed",
      "It told travelers the time of day",
      "It was merely an ornamental piece of jewelry"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Infers ocean directional navigation"
  },
  {
    "id": "Q_ENG_CMP_D05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_COMPREHENSION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-01: Contrasts renewable versus non-renewable energy concepts analytically",
    "text": "Read: 'Both solar energy and wind energy are renewable sources. Unlike coal and petroleum, they never run out and do not produce harmful greenhouse gases that warm the planet.' Question: What distinguishes solar and wind energy from fossil fuels?",
    "textTelugu": "Question: What is the key advantage of renewable energy over coal and petroleum?",
    "oralPrompt": "Teacher prompt: Compare renewable vs non-renewable characteristics.",
    "options": [
      "They are infinite, non-polluting, and do not contribute to climate change",
      "They can only be used during daytime",
      "They are more expensive to store",
      "They require coal to operate"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects clean, infinite, non-polluting attribute"
  },
  {
    "id": "Q_ENG_GRM_E01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-02: Applies article 'an' before words beginning with vowel sounds",
    "text": "Choose the correct article: 'This is ___ apple.'",
    "textTelugu": "Fill in the blank with the correct article: 'This is ___ apple.'",
    "oralPrompt": "Teacher prompt: Ask whether to use 'a' or 'an' before vowel sound.",
    "options": [
      "an",
      "a",
      "the",
      "in"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'an' correctly"
  },
  {
    "id": "Q_ENG_GRM_E02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-02: Applies article 'a' before consonant sounds",
    "text": "Choose the correct article: 'He has ___ book.'",
    "textTelugu": "Fill in the blank: 'He has ___ book.'",
    "oralPrompt": "Teacher prompt: Choose 'a' or 'an' before consonant sound.",
    "options": [
      "a",
      "an",
      "the",
      "at"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'a' correctly"
  },
  {
    "id": "Q_ENG_GRM_E03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-02: Forms regular plurals by adding -s",
    "text": "Select the plural form of the noun: 'Cat'.",
    "textTelugu": "What is the plural of 'Cat'?",
    "oralPrompt": "Teacher prompt: If there is more than one cat, what do we say?",
    "options": [
      "Cats",
      "Cates",
      "Caties",
      "Catss"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Produces 'Cats' instantly"
  },
  {
    "id": "Q_ENG_GRM_E04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-02: Identifies basic action verbs in simple sentences",
    "text": "Select the action word (verb): 'Raju runs to the playground.'",
    "textTelugu": "Which word is the action word in: 'Raju runs to the playground'?",
    "oralPrompt": "Teacher prompt: Which word shows what Raju is doing?",
    "options": [
      "runs",
      "Raju",
      "playground",
      "to"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'runs' accurately"
  },
  {
    "id": "Q_ENG_GRM_E05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-ENG-C3-02: Distinguishes gender-specific third person singular pronouns",
    "text": "Select the pronoun for a boy: '___ is my brother.'",
    "textTelugu": "Fill in the blank with the correct pronoun: '___ is my brother.'",
    "oralPrompt": "Teacher prompt: Which pronoun is used for a boy or male person?",
    "options": [
      "He",
      "She",
      "It",
      "They"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'He'"
  },
  {
    "id": "Q_ENG_GRM_M01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-02: Accurately utilizes spatial prepositions (under, on, in)",
    "text": "Choose the correct preposition: 'The ball is ___ the table.' (underneath it)",
    "textTelugu": "Fill in the blank: 'The ball is ___ the table.'",
    "oralPrompt": "Teacher prompt: Choose the positional preposition for underneath.",
    "options": [
      "under",
      "over",
      "between",
      "behind"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'under' correctly"
  },
  {
    "id": "Q_ENG_GRM_M02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-02: Enforces subject-verb agreement with plural personal pronouns",
    "text": "Choose the correct verb form: 'They ___ playing football.'",
    "textTelugu": "Fill in the blank: 'They ___ playing football.'",
    "oralPrompt": "Teacher prompt: Match plural pronoun 'They' with 'is' or 'are'.",
    "options": [
      "are",
      "is",
      "am",
      "was"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'are' accurately"
  },
  {
    "id": "Q_ENG_GRM_M03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-02: Forms plurals of sibilant-ending nouns with -es",
    "text": "Select the plural form of the noun: 'Box'.",
    "textTelugu": "What is the plural of 'Box'?",
    "oralPrompt": "Teacher prompt: What do we add to words ending in -x?",
    "options": [
      "Boxes",
      "Boxs",
      "Boxies",
      "Boxen"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'Boxes' correctly"
  },
  {
    "id": "Q_ENG_GRM_M04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-02: Identifies descriptive color adjectives qualifying nouns",
    "text": "Identify the describing word (adjective): 'Ananya has a blue umbrella.'",
    "textTelugu": "Which word is the adjective: 'Ananya has a blue umbrella'?",
    "oralPrompt": "Teacher prompt: Which word describes the umbrella?",
    "options": [
      "blue",
      "umbrella",
      "Ananya",
      "has"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'blue'"
  },
  {
    "id": "Q_ENG_GRM_M05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-ENG-C3-02: Accurately produces irregular past tense forms (go -> went)",
    "text": "Choose the past tense of 'Go': 'Yesterday, we ___ to the zoo.'",
    "textTelugu": "Fill in the blank with past tense: 'Yesterday, we ___ to the zoo.'",
    "oralPrompt": "Teacher prompt: What is the past form of 'Go'?",
    "options": [
      "went",
      "goed",
      "goes",
      "going"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'went' correctly"
  },
  {
    "id": "Q_ENG_GRM_D01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-02: Uses coordinating conjunctions expressing cause and result",
    "text": "Choose the correct conjunction: 'Kavya studied hard, ___ she scored the highest marks.'",
    "textTelugu": "Choose the conjunction expressing cause/result: 'Kavya studied hard, ___ she scored highest marks.'",
    "oralPrompt": "Teacher prompt: Which connector shows consequence (so vs but)?",
    "options": [
      "so",
      "but",
      "or",
      "although"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'so' accurately"
  },
  {
    "id": "Q_ENG_GRM_D02",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-02: Identifies adverbs of manner ending in -ly modifying verbs",
    "text": "Identify the adverb: 'The tortoise walked slowly towards the river.'",
    "textTelugu": "Which word is the adverb: 'The tortoise walked slowly towards the river'?",
    "oralPrompt": "Teacher prompt: Which word tells HOW the tortoise walked?",
    "options": [
      "slowly",
      "tortoise",
      "walked",
      "river"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 'slowly' accurately"
  },
  {
    "id": "Q_ENG_GRM_D03",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-02: Recognizes irregular vowel mutation and en-suffix plurals",
    "text": "Select the irregular plural: 'Child' -> '___'.",
    "textTelugu": "What is the plural of 'Child'?",
    "oralPrompt": "Teacher prompt: What is the correct plural form of child?",
    "options": [
      "Children",
      "Childs",
      "Childes",
      "Childrens"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'Children'"
  },
  {
    "id": "Q_ENG_GRM_D04",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-02: Applies comparative degrees of adjectives (-er) correctly",
    "text": "Choose the correct comparative adjective: 'Mount Everest is ___ than any other peak in the world.'",
    "textTelugu": "Fill in the comparative form: 'Mount Everest is ___ than other peaks.'",
    "oralPrompt": "Teacher prompt: Use comparative degree with 'than'.",
    "options": [
      "higher",
      "high",
      "highest",
      "more high"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'higher'"
  },
  {
    "id": "Q_ENG_GRM_D05",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-ENG-C3-02: Punctuates singular noun possession with apostrophe-s",
    "text": "Select the correct possessive form: 'The bag belonging to Ravi is ___ bag.'",
    "textTelugu": "Choose the correct possessive form: 'The bag belonging to Ravi is ___.'",
    "oralPrompt": "Teacher prompt: How do we show ownership with an apostrophe?",
    "options": [
      "Ravi's",
      "Ravis'",
      "Ravis",
      "Ravi'es"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 'Ravi's' accurately"
  },
  {
    "id": "Q_NUM_NUM_E01",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C1-01: Identifies numerals 1-9 accurately",
    "text": "Identify the number: '7' (Seven / ఏడు).",
    "textTelugu": "ఈ సంఖ్యను గుర్తించండి: '7'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఫ్లాష్ కార్డుపై 7 చూపించి అడగండి.",
    "options": [
      "7 (Seven / ఏడు)",
      "1 (One)",
      "4 (Four)",
      "9 (Nine)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Recognizes 7 instantly"
  },
  {
    "id": "Q_NUM_NUM_E02",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C1-01: Counts concrete objects with 1:1 correspondence up to 10",
    "text": "Count the stars: ★ ★ ★ ★ ★. How many stars?",
    "textTelugu": "నక్షత్రాలను లెక్కించండి: ★ ★ ★ ★ ★. ఎన్ని ఉన్నాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వేలితో చూపిస్తూ 1 నుండి 5 వరకు లెక్కించమనండి.",
    "options": [
      "5 (ఐదు)",
      "4 (నాలుగు)",
      "6 (ఆరు)",
      "3 (మూడు)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Counts 5 objects accurately"
  },
  {
    "id": "Q_NUM_NUM_E03",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C1-01: Identifies successor number in range 1-20",
    "text": "Which number comes immediately after 14?",
    "textTelugu": "14 తర్వాత వెంటనే వచ్చే సంఖ్య ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 14 తర్వాత సంఖ్య అడగండి.",
    "options": [
      "15 (పదిహేను)",
      "13 (పదమూడు)",
      "16 (పదహారు)",
      "20 (ఇరవై)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "States 15 immediately"
  },
  {
    "id": "Q_NUM_NUM_E04",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C1-01: Compares two 2-digit numbers up to 20",
    "text": "Which number is greater: 18 or 12?",
    "textTelugu": "18 మరియు 12 లలో ఏది పెద్ద సంఖ్య?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: రెండు సంఖ్యలలో పెద్దది ఎంపిక చేయమనండి.",
    "options": [
      "18",
      "12",
      "రెండూ సమానం",
      "ఏదీ కాదు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 18 correctly"
  },
  {
    "id": "Q_NUM_NUM_E05",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C1-01: Identifies landmark decades (10, 20)",
    "text": "Identify the number: '20' (Twenty / ఇరవై).",
    "textTelugu": "ఈ సంఖ్యను గుర్తించండి: '20'",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సంఖ్య పేరు చెప్పమనండి.",
    "options": [
      "20 (ఇరవై)",
      "12 (పన్నెండు)",
      "21 (ఇరవై ఒకటి)",
      "2 (రెండు)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 20 correctly"
  },
  {
    "id": "Q_NUM_NUM_M01",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C1-01: Explains place value of digits in 2-digit numbers",
    "text": "What is the place value of 5 in the number 54?",
    "textTelugu": "54 సంఖ్యలో 5 యొక్క స్థాన విలువ ఎంత? (Place value of 5 in 54)",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పదుల స్థానాన్ని గుర్తించమనండి.",
    "options": [
      "50 (5 పదులు / Tens)",
      "5 (ఒకట్లు / Ones)",
      "500 (వందలు / Hundreds)",
      "0"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "States 50 (5 tens) correctly"
  },
  {
    "id": "Q_NUM_NUM_M02",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C1-01: Writes 2-digit numbers in expanded notation",
    "text": "What is the expanded form of 76?",
    "textTelugu": "76 యొక్క విస్తరణ రూపం ఏది? (Expanded form of 76)",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పదులు మరియు ఒకట్లుగా విడదీయమనండి.",
    "options": [
      "70 + 6",
      "7 + 6",
      "700 + 6",
      "60 + 7"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 70 + 6 correctly"
  },
  {
    "id": "Q_NUM_NUM_M03",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C1-01: Skip counts forward by 10s up to 100",
    "text": "Fill in the missing number in the skip counting sequence: 10, 20, 30, ___, 50.",
    "textTelugu": "ఖాళీలో సరైన సంఖ్యను రాయండి: 10, 20, 30, ___, 50.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 10 చొప్పున లెక్కిస్తూ ఖాళీని పూరించమనండి.",
    "options": [
      "40",
      "35",
      "45",
      "60"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 40 instantly"
  },
  {
    "id": "Q_NUM_NUM_M04",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C1-01: Applies relational comparison symbols (<, >, =)",
    "text": "Compare the numbers: 89 ___ 98. Use <, >, or =.",
    "textTelugu": "సరైన చిహ్నాన్ని ఎంచుకోండి: 89 ___ 98.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: చిన్నదా పెద్దదా చిహ్నం ఎంచుకోమనండి.",
    "options": [
      "< (89 is less than 98)",
      "> (89 is greater than 98)",
      "= (equal)",
      "ఏదీ కాదు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects < accurately"
  },
  {
    "id": "Q_NUM_NUM_M05",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C1-01: Reconstructs standard numerals from place value bundles",
    "text": "Which number has 4 tens and 7 ones?",
    "textTelugu": "4 పదులు మరియు 7 ఒకట్లు కలిగిన సంఖ్య ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 4 పదులు (40) + 7 ఒకట్లు ఎంతని అడగండి.",
    "options": [
      "47",
      "74",
      "407",
      "740"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 47 accurately"
  },
  {
    "id": "Q_NUM_NUM_D01",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C1-01: Identifies place values in 3-digit numbers up to 999",
    "text": "What is the place value of 4 in 456?",
    "textTelugu": "456 సంఖ్యలో 4 యొక్క స్థాన విలువ ఎంత? (Place value of 4 in 456)",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వందల స్థాన విలువ చెప్పమనండి.",
    "options": [
      "400 (4 వందలు / Hundreds)",
      "40 (4 పదులు / Tens)",
      "4 (4 ఒకట్లు / Ones)",
      "0"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "States 400 correctly"
  },
  {
    "id": "Q_NUM_NUM_D02",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C1-01: Decomposes 3-digit numbers with internal zero",
    "text": "Write the expanded form of 805.",
    "textTelugu": "805 సంఖ్య యొక్క విస్తరణ రూపం ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పదుల స్థానంలో 0 ఉన్నప్పుడు విస్తరణ రూపం రాయమనండి.",
    "options": [
      "800 + 0 + 5 (or 800 + 5)",
      "80 + 5",
      "800 + 50",
      "8 + 0 + 5"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Accurately selects 800 + 5"
  },
  {
    "id": "Q_NUM_NUM_D03",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C1-01: Constructs extreme values using digit permutation rules",
    "text": "What is the largest 3-digit number formed using digits 4, 9, 2 without repeating?",
    "textTelugu": "4, 9, 2 అంకెలతో ఏర్పడే అతిపెద్ద 3-అంకెల సంఖ్య ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పెద్ద అంకె నుండి చిన్న అంకె వరకు అమర్చమనండి.",
    "options": [
      "942",
      "924",
      "492",
      "249"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly states 942"
  },
  {
    "id": "Q_NUM_NUM_D04",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C1-01: Extrapolates arithmetic skip counting sequences by 50s",
    "text": "Complete the pattern: 250, 300, 350, ___, 450.",
    "textTelugu": "నమూనాను పూరించండి: 250, 300, 350, ___, 450.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 50 చొప్పున పెరుగుతున్న వరుసను గమనించమనండి.",
    "options": [
      "400",
      "375",
      "410",
      "390"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 400"
  },
  {
    "id": "Q_NUM_NUM_D05",
    "domain": "NUMERACY",
    "competencyId": "NUM_NUMBER_SENSE",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C1-01: Compares 3-digit numbers with identical hundreds place",
    "text": "Which is smaller: 609 or 690?",
    "textTelugu": "609 మరియు 690 లలో ఏది చిన్న సంఖ్య?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పదుల స్థానాన్ని పోల్చి చిన్న సంఖ్యను ఎంచుకోమనండి.",
    "options": [
      "609",
      "690",
      "రెండూ సమానం",
      "నిర్ణయించలేము"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects 609 accurately"
  },
  {
    "id": "Q_NUM_ADD_E01",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-01: Performs single-digit addition fluently without fingers",
    "text": "Solve single-digit addition: 4 + 3 = ?",
    "textTelugu": "లెక్కించండి: 4 + 3 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: వేళ్లతో లేదా గీతలతో కూడిక చేయమనండి.",
    "options": [
      "7",
      "6",
      "8",
      "5"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Solves in under 3 seconds"
  },
  {
    "id": "Q_NUM_ADD_E02",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-01: Solves basic addition facts",
    "text": "Solve: 5 + 2 = ?",
    "textTelugu": "లెక్కించండి: 5 + 2 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 5 కి 2 కలిపితే ఎంత?",
    "options": [
      "7",
      "8",
      "6",
      "9"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 7"
  },
  {
    "id": "Q_NUM_ADD_E03",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-01: Demonstrates additive identity property of zero",
    "text": "Solve: 6 + 0 = ?",
    "textTelugu": "లెక్కించండి: 6 + 0 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సున్నా (0) కలిపితే ఏమవుతుందో అడగండి.",
    "options": [
      "6",
      "0",
      "7",
      "60"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 6 correctly"
  },
  {
    "id": "Q_NUM_ADD_E04",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-01: Applies add-one successor principle",
    "text": "Solve: 8 + 1 = ?",
    "textTelugu": "లెక్కించండి: 8 + 1 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 8 కి 1 కలిపితే ఎంత?",
    "options": [
      "9",
      "7",
      "10",
      "8"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 9"
  },
  {
    "id": "Q_NUM_ADD_E05",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-01: Recalls doubles addition facts within 10",
    "text": "Solve: 5 + 5 = ?",
    "textTelugu": "లెక్కించండి: 5 + 5 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: డబుల్స్ ఫ్యాక్ట్ (5 + 5) చెప్పమనండి.",
    "options": [
      "10",
      "9",
      "11",
      "15"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 10 instantly"
  },
  {
    "id": "Q_NUM_ADD_M01",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-01: Adds 2-digit numbers without regrouping",
    "text": "Solve 2-digit addition without carryover: 23 + 14 = ?",
    "textTelugu": "లెక్కించండి (చేతికి రాని కూడిక): 23 + 14 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒకట్లకు ఒకట్లు, పదులకు పదులు కూడమనండి.",
    "options": [
      "37",
      "47",
      "36",
      "38"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 37 correctly"
  },
  {
    "id": "Q_NUM_ADD_M02",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-01: Mental addition with multiples of 10",
    "text": "Solve: 40 + 25 = ?",
    "textTelugu": "లెక్కించండి: 40 + 25 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పదుల సంఖ్య కూడికను మానసికంగా చేయమనండి.",
    "options": [
      "65",
      "55",
      "75",
      "60"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 65 mentally"
  },
  {
    "id": "Q_NUM_ADD_M03",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-01: Column addition of 2-digit numbers",
    "text": "Solve: 32 + 26 = ?",
    "textTelugu": "లెక్కించండి: 32 + 26 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: నిలువు వరుసలో కూడమనండి.",
    "options": [
      "58",
      "68",
      "57",
      "59"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Solves 58 accurately"
  },
  {
    "id": "Q_NUM_ADD_M04",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-01: Adds 2-digit with 1-digit number with regrouping across 10",
    "text": "Solve with carryover to tens: 18 + 7 = ?",
    "textTelugu": "లెక్కించండి (చేతికొచ్చే కూడిక): 18 + 7 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 8 + 7 = 15, 1 పదుల స్థానానికి చేర్చమనండి.",
    "options": [
      "25",
      "24",
      "26",
      "23"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 25 correctly"
  },
  {
    "id": "Q_NUM_ADD_M05",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-01: Adds multiples of 50 to form century benchmark",
    "text": "Solve: 50 + 50 = ?",
    "textTelugu": "లెక్కించండి: 50 + 50 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: రెండు 50లు కలిపితే ఎంత?",
    "options": [
      "100",
      "90",
      "110",
      "500"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 100 instantly"
  },
  {
    "id": "Q_NUM_ADD_D01",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-01: Adds 2-digit numbers with regrouping across tens column",
    "text": "Solve 2-digit addition with regrouping: 54 + 28 = ?",
    "textTelugu": "లెక్కించండి (చేతికొచ్చే కూడిక): 54 + 28 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 4 + 8 = 12 (1 చేతిక రాయండి), 1 + 5 + 2 = 8.",
    "options": [
      "82",
      "72",
      "84",
      "78"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 82 accurately"
  },
  {
    "id": "Q_NUM_ADD_D02",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-01: Regroups units into tens seamlessly",
    "text": "Solve: 48 + 37 = ?",
    "textTelugu": "లెక్కించండి: 48 + 37 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: చేతికొచ్చే కూడికను నిలువు వరుసలో చేసి చూపమనండి.",
    "options": [
      "85",
      "75",
      "86",
      "84"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 85 correctly"
  },
  {
    "id": "Q_NUM_ADD_D03",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-01: Adds 3-digit numbers with single regrouping",
    "text": "Solve 3-digit addition: 245 + 138 = ?",
    "textTelugu": "లెక్కించండి: 245 + 138 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒకట్లలో చేతికొచ్చే 3-అంకెల కూడిక.",
    "options": [
      "383",
      "373",
      "382",
      "483"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 383 accurately"
  },
  {
    "id": "Q_NUM_ADD_D04",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-01: Performs double regrouping (units to tens, tens to hundreds)",
    "text": "Solve: 367 + 258 = ?",
    "textTelugu": "లెక్కించండి: 367 + 258 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒకట్లు మరియు పదులలో రెండింటిలోనూ చేతికొచ్చే కూడిక.",
    "options": [
      "625",
      "615",
      "635",
      "525"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 625 correctly"
  },
  {
    "id": "Q_NUM_ADD_D05",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-01: Finds unknown addend to complete century complement",
    "text": "Find the missing number: 65 + ___ = 100.",
    "textTelugu": "ఖాళీని పూరించండి: 65 + ___ = 100.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 100 నుండి 65 తీసివేసి లేదా సంకలన సంబంధంతో కనుగొనమనండి.",
    "options": [
      "35",
      "45",
      "25",
      "30"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 35 accurately"
  },
  {
    "id": "Q_NUM_SUB_E01",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-02: Performs single-digit subtraction facts within 10",
    "text": "Solve single-digit subtraction: 7 - 3 = ?",
    "textTelugu": "లెక్కించండి: 7 - 3 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 7 లో నుండి 3 తీసివేయమనండి.",
    "options": [
      "4",
      "3",
      "5",
      "2"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 4 instantly"
  },
  {
    "id": "Q_NUM_SUB_E02",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-02: Basic subtraction facts",
    "text": "Solve: 9 - 4 = ?",
    "textTelugu": "లెక్కించండి: 9 - 4 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 9 లో నుండి 4 తగ్గించమనండి.",
    "options": [
      "5",
      "4",
      "6",
      "3"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 5 correctly"
  },
  {
    "id": "Q_NUM_SUB_E03",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-02: Identity subtraction property of zero",
    "text": "Solve: 8 - 0 = ?",
    "textTelugu": "లెక్కించండి: 8 - 0 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సున్నా తీసివేస్తే సంఖ్య మారదని వివరించండి.",
    "options": [
      "8",
      "0",
      "7",
      "1"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 8 correctly"
  },
  {
    "id": "Q_NUM_SUB_E04",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-02: Recognizes subtraction of identical numbers equals zero",
    "text": "Solve: 6 - 6 = ?",
    "textTelugu": "లెక్కించండి: 6 - 6 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒక సంఖ్య నుండి అదే సంఖ్యను తీసివేస్తే ఎంత?",
    "options": [
      "0",
      "1",
      "6",
      "12"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 0"
  },
  {
    "id": "Q_NUM_SUB_E05",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C2-02: Subtracts from 10 fluent facts",
    "text": "Solve: 10 - 2 = ?",
    "textTelugu": "లెక్కించండి: 10 - 2 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 10 లో నుండి 2 తీసివేయమనండి.",
    "options": [
      "8",
      "7",
      "9",
      "6"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 8 accurately"
  },
  {
    "id": "Q_NUM_SUB_M01",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-02: Subtracts 2-digit numbers without borrowing",
    "text": "Solve 2-digit subtraction without borrowing: 48 - 15 = ?",
    "textTelugu": "లెక్కించండి (సాధారణ తీసివేత): 48 - 15 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒకట్లలో నుండి ఒకట్లు, పదులలో నుండి పదులు తీసివేయమనండి.",
    "options": [
      "33",
      "23",
      "35",
      "32"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 33 correctly"
  },
  {
    "id": "Q_NUM_SUB_M02",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-02: Column subtraction without decomposition",
    "text": "Solve: 67 - 23 = ?",
    "textTelugu": "లెక్కించండి: 67 - 23 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: నిలువు వరుస తీసివేత.",
    "options": [
      "44",
      "54",
      "43",
      "45"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 44 correctly"
  },
  {
    "id": "Q_NUM_SUB_M03",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-02: Subtracts multiples of 10 mentally",
    "text": "Solve: 50 - 20 = ?",
    "textTelugu": "లెక్కించండి: 50 - 20 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: పదుల సంఖ్యల తీసివేతను మానసికంగా చేయమనండి.",
    "options": [
      "30",
      "20",
      "40",
      "25"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 30 instantly"
  },
  {
    "id": "Q_NUM_SUB_M04",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-02: 2-digit subtraction fluency",
    "text": "Solve: 89 - 45 = ?",
    "textTelugu": "లెక్కించండి: 89 - 45 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 89 లో 45 తీసివేయమనండి.",
    "options": [
      "44",
      "34",
      "45",
      "43"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 44 accurately"
  },
  {
    "id": "Q_NUM_SUB_M05",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C2-02: Zero-units subtraction result",
    "text": "Solve: 35 - 15 = ?",
    "textTelugu": "లెక్కించండి: 35 - 15 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒకట్లలో 5 - 5 = 0.",
    "options": [
      "20",
      "10",
      "25",
      "15"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 20 correctly"
  },
  {
    "id": "Q_NUM_SUB_D01",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-02: Subtracts 2-digit numbers with decomposing/borrowing from tens",
    "text": "Solve 2-digit subtraction with borrowing: 62 - 38 = ?",
    "textTelugu": "లెక్కించండి (అప్పు తీసివేత): 62 - 38 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 2 లో నుండి 8 పోదు కాబట్టి పదుల స్థానం నుండి 1 పది అప్పు తెచ్చుకోవాలి (12 - 8 = 4).",
    "options": [
      "24",
      "34",
      "26",
      "22"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 24 accurately"
  },
  {
    "id": "Q_NUM_SUB_D02",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-02: Decomposes tens when units digit is zero",
    "text": "Solve: 70 - 34 = ?",
    "textTelugu": "లెక్కించండి (సున్నా నుండి అప్పు తీసివేత): 70 - 34 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 70 నుండి 34 తీసివేయడానికి అప్పు తెచ్చుకోవడం చూపమనండి.",
    "options": [
      "36",
      "46",
      "34",
      "44"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 36 correctly"
  },
  {
    "id": "Q_NUM_SUB_D03",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-02: Subtracts 3-digit numbers with single borrowing",
    "text": "Solve 3-digit subtraction: 543 - 219 = ?",
    "textTelugu": "లెక్కించండి: 543 - 219 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఒకట్లలో అప్పు తెచ్చుకునే 3-అంకెల తీసివేత.",
    "options": [
      "324",
      "334",
      "314",
      "326"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 324 accurately"
  },
  {
    "id": "Q_NUM_SUB_D04",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-02: Performs regrouping across multiple zeroes",
    "text": "Solve: 500 - 165 = ?",
    "textTelugu": "లెక్కించండి (వందలు, పదులలో అప్పు తెచ్చుకోవడం): 500 - 165 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: డబుల్ జీరో నుండి వరుసగా అప్పు తెచ్చుకునే పద్ధతి.",
    "options": [
      "335",
      "345",
      "435",
      "325"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 335 correctly"
  },
  {
    "id": "Q_NUM_SUB_D05",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C2-02: Computes unknown subtrahend in algebraic balance equation",
    "text": "Find the missing number: 85 - ___ = 48.",
    "textTelugu": "ఖాళీని పూరించండి: 85 - ___ = 48.",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 85 లో నుండి 48 తీసివేసి సరైన సంఖ్యను కనుగొనమనండి.",
    "options": [
      "37",
      "47",
      "27",
      "39"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies 37 accurately"
  },
  {
    "id": "Q_NUM_MUL_E01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-01: Explains multiplication as repeated addition of equal groups",
    "text": "Express repeated addition as multiplication: 2 + 2 + 2 = 3 times 2 = ?",
    "textTelugu": "పునరావృత కూడికను గుణకారంగా రాయండి: 2 + 2 + 2 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 2 ని 3 సార్లు కూడితే ఎంత?",
    "options": [
      "6 (3 × 2)",
      "5",
      "8",
      "4"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 6 (3 x 2)"
  },
  {
    "id": "Q_NUM_MUL_E02",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-01: Recalls 2 times table facts",
    "text": "Solve multiplication table: 2 × 4 = ?",
    "textTelugu": "లెక్కించండి: 2 × 4 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 2 ఎక్కంలో 4 సార్లు ఎంత?",
    "options": [
      "8",
      "6",
      "10",
      "7"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 8 immediately"
  },
  {
    "id": "Q_NUM_MUL_E03",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-01: Demonstrates multiplicative identity property of one",
    "text": "Solve: 5 × 1 = ?",
    "textTelugu": "లెక్కించండి: 5 × 1 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 1 తో గుణిస్తే సంఖ్య మారదని చెప్పండి.",
    "options": [
      "5",
      "1",
      "6",
      "0"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 5 correctly"
  },
  {
    "id": "Q_NUM_MUL_E04",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-01: Zero multiplication property",
    "text": "Solve: 7 × 0 = ?",
    "textTelugu": "లెక్కించండి: 7 × 0 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సున్నాతో గుణిస్తే సమాధానం సున్నా అవుతుంది.",
    "options": [
      "0",
      "7",
      "1",
      "70"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 0"
  },
  {
    "id": "Q_NUM_MUL_E05",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-01: Square facts within 10",
    "text": "Solve: 3 × 3 = ?",
    "textTelugu": "లెక్కించండి: 3 × 3 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 3 మూడుల ఎంత?",
    "options": [
      "9",
      "6",
      "12",
      "8"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 9 instantly"
  },
  {
    "id": "Q_NUM_MUL_M01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-01: Recalls multiplication tables up to 5x10",
    "text": "Solve multiplication fact: 4 × 6 = ?",
    "textTelugu": "గుణించండి: 4 × 6 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 4 ఆరుల ఎంత?",
    "options": [
      "24",
      "20",
      "28",
      "18"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 24 correctly"
  },
  {
    "id": "Q_NUM_MUL_M02",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-01: 5-times table fluency",
    "text": "Solve: 5 × 8 = ?",
    "textTelugu": "గుణించండి: 5 × 8 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 5 ఎనిమిదుల ఎంత?",
    "options": [
      "40",
      "35",
      "45",
      "48"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 40 instantly"
  },
  {
    "id": "Q_NUM_MUL_M03",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-01: Understands division as equal distribution among groups",
    "text": "Division as equal sharing: 12 chocolates shared equally among 3 children. How many does each child get?",
    "textTelugu": "సమాన పంపకం (భాగహారం): 12 చాక్లెట్లను ముగ్గురు పిల్లలకు సమానంగా పంచితే ఒక్కొక్కరికి ఎన్ని వస్తాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 12 ÷ 3 భాగహార భావనను పరిశీలించండి.",
    "options": [
      "4",
      "3",
      "6",
      "5"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 4 correctly"
  },
  {
    "id": "Q_NUM_MUL_M04",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-01: Multiplication tables up to 10",
    "text": "Solve: 6 × 7 = ?",
    "textTelugu": "గుణించండి: 6 × 7 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 6 ఏడుల ఎంత?",
    "options": [
      "42",
      "36",
      "48",
      "49"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 42 correctly"
  },
  {
    "id": "Q_NUM_MUL_M05",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-01: Connects inverse relation between multiplication and division",
    "text": "Solve division fact: 20 ÷ 4 = ?",
    "textTelugu": "లెక్కించండి: 20 ÷ 4 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 4 ఎక్కంలో 20 ఎప్పుడు వస్తుంది?",
    "options": [
      "5",
      "4",
      "6",
      "10"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 5 correctly"
  },
  {
    "id": "Q_NUM_MUL_D01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-01: Multiplies 2-digit number by 1-digit number with regrouping",
    "text": "Solve 2-digit multiplication: 23 × 4 = ?",
    "textTelugu": "లెక్కించండి: 23 × 4 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: (20 × 4) + (3 × 4) = 80 + 12 = 92.",
    "options": [
      "92",
      "82",
      "88",
      "96"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 92 accurately"
  },
  {
    "id": "Q_NUM_MUL_D02",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-01: 2-digit by 1-digit vertical multiplication",
    "text": "Solve: 35 × 5 = ?",
    "textTelugu": "లెక్కించండి: 35 × 5 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: నిలువు గుణకారం చేసి జవాబు రాయమనండి.",
    "options": [
      "175",
      "165",
      "185",
      "155"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 175 accurately"
  },
  {
    "id": "Q_NUM_MUL_D03",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-01: Performs long division identifying quotient and non-zero remainder",
    "text": "Solve division with remainder: 25 ÷ 4 = ?",
    "textTelugu": "25 ని 4 చే భాగిస్తే వచ్చే భాగఫలం మరియు శేషం ఎంత?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 4 × 6 = 24, శేషం 1.",
    "options": [
      "భాగఫలం 6, శేషం 1 (Quotient 6, Remainder 1)",
      "భాగఫలం 5, శేషం 5",
      "భాగఫలం 6, శేషం 0",
      "భాగఫలం 7, శేషం 1"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Correctly identifies quotient 6, remainder 1"
  },
  {
    "id": "Q_NUM_MUL_D04",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-01: Upper single-digit multiplication fluency",
    "text": "Solve: 8 × 9 = ?",
    "textTelugu": "గుణించండి: 8 × 9 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 8 తొమ్మిదుల ఎంత?",
    "options": [
      "72",
      "81",
      "64",
      "63"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 72 instantly"
  },
  {
    "id": "Q_NUM_MUL_D05",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-01: Divides 2-digit dividend by 1-digit divisor without remainder",
    "text": "Solve division: 84 ÷ 4 = ?",
    "textTelugu": "లెక్కించండి: 84 ÷ 4 = ?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 8 పదులు ÷ 4 = 2 పదులు, 4 ఒకట్లు ÷ 4 = 1 ఒకట్లు.",
    "options": [
      "21",
      "22",
      "24",
      "19"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 21 accurately"
  },
  {
    "id": "Q_NUM_WRD_E01",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-02: Solves simple 1-step contextual addition word problem within 10",
    "text": "Word problem: Ravi has 4 apples. His sister gives him 3 more apples. How many apples does Ravi have now?",
    "textTelugu": "రాత లెక్క: రవి వద్ద 4 ఆపిల్ పండ్లు ఉన్నాయి. అతని చెల్లెలు మరో 3 ఆపిల్స్ ఇచ్చింది. ఇప్పుడు రవి వద్ద మొత్తం ఎన్ని ఆపిల్స్ ఉన్నాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మొత్తం కనుక్కోవడానికి కూడిక చేయమనండి (4 + 3).",
    "options": [
      "7 ఆపిల్స్ (4 + 3 = 7)",
      "6 ఆపిల్స్",
      "8 ఆపిల్స్",
      "1 ఆపిల్"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 7 apples correctly"
  },
  {
    "id": "Q_NUM_WRD_E02",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-02: Solves 1-step subtraction word problem within 10",
    "text": "Word problem: Geeta has 8 chocolates. She eats 3 chocolates. How many chocolates are left?",
    "textTelugu": "రాత లెక్క: గీత వద్ద 8 చాక్లెట్లు ఉన్నాయి. ఆమె 3 చాక్లెట్లు తినివేసింది. ఇంకా ఎన్ని మిగిలి ఉన్నాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మిగిలినవి కనుగొనడానికి తీసివేత చేయమనండి (8 - 3).",
    "options": [
      "5 చాక్లెట్లు (8 - 3 = 5)",
      "4 చాక్లెట్లు",
      "6 చాక్లెట్లు",
      "11 చాక్లెట్లు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 5 chocolates"
  },
  {
    "id": "Q_NUM_WRD_E03",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-02: Identifies repeating ABAB geometric shape patterns",
    "text": "Pattern recognition: What shape comes next in the sequence: ○, △, ○, △, ___?",
    "textTelugu": "నమూనాను పూర్తి చేయండి: ○, △, ○, △, ___?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ఆకారాల వరుస క్రమాన్ని గుర్తించమనండి.",
    "options": [
      "○ (Circle / వృత్తం)",
      "△ (Triangle / త్రిభుజం)",
      "□ (Square / చతురస్రం)",
      "☆ (Star)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects Circle correctly"
  },
  {
    "id": "Q_NUM_WRD_E04",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-02: Compares gross weights using intuitive non-standard concepts",
    "text": "Measurement: Which object is heavier: A feather or an elephant?",
    "textTelugu": "ఏది ఎక్కువ బరువు ఉంటుంది: ఒక పక్షి ఈక లేదా ఏనుగు?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సహజ జ్ఞానంతో బరువులను పోల్చమనండి.",
    "options": [
      "ఏనుగు (Elephant - Heavier)",
      "ఈక (Feather)",
      "రెండూ సమానం",
      "చెప్పలేము"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers Elephant instantly"
  },
  {
    "id": "Q_NUM_WRD_E05",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 1,
    "difficulty": "EASY",
    "nipunTargetRef": "NL-NUM-C3-02: Associates daily life routines with times of day",
    "text": "Time: Which activity do we do in the morning?",
    "textTelugu": "మనం ఉదయాన్నే చేసే పని ఏది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: రోజువారీ సమయ విభాగాన్ని చెప్పమనండి.",
    "options": [
      "పళ్ళు తోముకోవడం మరియు బడికి సిద్ధమవడం (Brushing teeth & getting ready)",
      "రాత్రి నిద్రపోవడం",
      "చీకట్లో నక్షత్రాలు చూడటం",
      "రాత్రి భోజనం చేయడం"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Selects morning brushing routine"
  },
  {
    "id": "Q_NUM_WRD_M01",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-02: Solves monetary transactions with simple rupee denominations",
    "text": "Money problem: A pencil costs ₹ 5 and an eraser costs ₹ 3. How much do both items cost together?",
    "textTelugu": "డబ్బుల లెక్క: ఒక పెన్సిల్ ధర ₹ 5, ఒక రబ్బరు (ఎరేజర్) ధర ₹ 3. రెండింటినీ కొనడానికి మొత్తం ఎన్ని రూపాయలు కావాలి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మొత్తం ఖర్చును కూడమనండి (5 + 3 = 8).",
    "options": [
      "₹ 8 (5 + 3)",
      "₹ 7",
      "₹ 9",
      "₹ 15"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates ₹ 8 correctly"
  },
  {
    "id": "Q_NUM_WRD_M02",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-02: Calculates currency change in shopping scenarios",
    "text": "Change problem: Suresh gave ₹ 20 to a shopkeeper to buy a notebook worth ₹ 14. How much change will Suresh get back?",
    "textTelugu": "రాత లెక్క: సురేష్ ₹ 14 విలువైన నోట్‌బుక్ కొని దుకాణదారుడికి ₹ 20 ఇచ్చాడు. అతనికి ఎంత చిల్లర తిరిగి వస్తుంది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: తిరిగి వచ్చే చిల్లర కనుగొనడానికి 20 - 14 చేయమనండి.",
    "options": [
      "₹ 6 (20 - 14)",
      "₹ 5",
      "₹ 7",
      "₹ 4"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates ₹ 6 change accurately"
  },
  {
    "id": "Q_NUM_WRD_M03",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-02: Applies multiplication to solve rate and unit-group word problems",
    "text": "Grouping problem: A flower garland needs 6 flowers. How many flowers are needed to make 4 such garlands?",
    "textTelugu": "గుణకార రాత లెక్క: ఒక పూలదండ తయారు చేయడానికి 6 పూలు కావాలి. అటువంటి 4 దండలు చేయడానికి ఎన్ని పూలు అవసరం?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: సమాన సమూహాల గుణకారం (4 × 6 = 24).",
    "options": [
      "24 పూలు (4 × 6 = 24)",
      "20 పూలు",
      "10 పూలు",
      "28 పూలు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 24 flowers correctly"
  },
  {
    "id": "Q_NUM_WRD_M04",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-02: Recalls standard metric linear measurement conversions",
    "text": "Measurement: How many centimeters are there in 1 meter?",
    "textTelugu": "కొలతలు: 1 మీటరుకు ఎన్ని సెంటీమీటర్లు? (1 Meter = ___ Centimeters)",
    "oralPrompt": "ఉపాధ్యాయ సూచన: ప్రామాణిక పొడవు కొలత ప్రమాణాన్ని అడగండి.",
    "options": [
      "100 సెంటీమీటర్లు (100 cm)",
      "10 cm",
      "1000 cm",
      "50 cm"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 100 cm correctly"
  },
  {
    "id": "Q_NUM_WRD_M05",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 2,
    "difficulty": "MODERATE",
    "nipunTargetRef": "NL-NUM-C3-02: Applies division to solve liquid volume capacity word problems",
    "text": "Capacity problem: A jug holds 2 liters of water. A bucket holds 10 liters of water. How many jugs of water are needed to fill the bucket?",
    "textTelugu": "కొలతలు (ద్రవ పరిమాణం): ఒక జగ్గులో 2 లీటర్ల నీరు పడుతుంది. ఒక బకెట్లో 10 లీటర్ల నీరు పడుతుంది. బకెట్ నిండటానికి ఎన్ని జగ్గుల నీరు పోయాలి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 10 ని 2 తో భాగించమనండి (10 ÷ 2).",
    "options": [
      "5 జగ్గులు (10 ÷ 2 = 5)",
      "4 జగ్గులు",
      "6 జగ్గులు",
      "8 జగ్గులు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 5 jugs correctly"
  },
  {
    "id": "Q_NUM_WRD_D01",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-02: Solves multi-step word problems involving subtraction followed by addition",
    "text": "2-Step word problem: In a school library, there were 85 storybooks. On Monday, children borrowed 28 books. On Tuesday, the teacher added 15 new books. How many storybooks are in the library now?",
    "textTelugu": "రెండు దశల రాత లెక్క (2-Step Problem): బడి గ్రంథాలయంలో 85 కథల పుస్తకాలు ఉన్నాయి. సోమవారం పిల్లలు 28 పుస్తకాలు చదవడానికి తీసుకున్నారు. మంగళవారం ఉపాధ్యాయుడు 15 కొత్త పుస్తకాలు చేర్చారు. ఇప్పుడు గ్రంథాలయంలో ఎన్ని పుస్తకాలు ఉన్నాయి?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మొదట తీసివేత (85 - 28 = 57), తర్వాత కూడిక (57 + 15 = 72) చేయమనండి.",
    "options": [
      "72 పుస్తకాలు (85 - 28 + 15 = 72)",
      "62 పుస్తకాలు",
      "78 పుస్తకాలు",
      "92 పుస్తకాలు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 72 books correctly"
  },
  {
    "id": "Q_NUM_WRD_D02",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-02: Solves combined multiplication and subtraction money problems",
    "text": "Multiplication-Subtraction combined: Ramesh bought 3 notebooks at ₹ 20 each. He gave a ₹ 100 note to the shopkeeper. How much change will he get back?",
    "textTelugu": "సంయుక్త లెక్క: రమేష్ ఒక్కొక్కటి ₹ 20 చొప్పున 3 నోట్‌బుక్స్ కొన్నాడు. దుకాణదారుడికి ₹ 100 నోటు ఇచ్చాడు. అతనికి ఎంత చిల్లర తిరిగి వస్తుంది?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మొత్తం ఖర్చు = 3 × 20 = 60. తిరిగి వచ్చేది = 100 - 60 = 40.",
    "options": [
      "₹ 40 (100 - 60 = 40)",
      "₹ 30",
      "₹ 50",
      "₹ 20"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates ₹ 40 accurately"
  },
  {
    "id": "Q_NUM_WRD_D03",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-02: Calculates elapsed time between clock hours and minutes",
    "text": "Time duration problem: A train leaves Vijayawada station at 08:30 AM and arrives in Guntur at 09:15 AM. What is the total travel time?",
    "textTelugu": "సమయ గణన: ఒక రైలు విజయవాడ నుండి ఉదయం 08:30 కి బయలుదేరి గుంటూరుకు ఉదయం 09:15 కి చేరుకుంది. ప్రయాణానికి పట్టిన సమయం ఎంత?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: 8:30 నుండి 9:00 వరకు 30 నిమిషాలు + 15 నిమిషాలు = 45 నిమిషాలు.",
    "options": [
      "45 నిమిషాలు (45 Minutes)",
      "30 నిమిషాలు",
      "1 గంట",
      "15 నిమిషాలు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 45 minutes accurately"
  },
  {
    "id": "Q_NUM_WRD_D04",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-02: Calculates perimeter boundary length of regular quadrilaterals",
    "text": "Perimeter geometry problem: A square garden has each side measuring 6 meters. What is the total boundary length (perimeter) of the garden?",
    "textTelugu": "క్షేత్రమితి: ఒక చతురస్రాకార తోట ప్రతి భుజం పొడవు 6 మీటర్లు. ఆ తోట చుట్టుకొలత ఎంత?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: చతురస్ర చుట్టుకొలత = 4 × భుజం = 4 × 6 = 24 మీటర్లు.",
    "options": [
      "24 మీటర్లు (4 × 6 = 24 m)",
      "36 మీటర్లు",
      "12 మీటర్లు",
      "18 మీటర్లు"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates 24 meters correctly"
  },
  {
    "id": "Q_NUM_WRD_D05",
    "domain": "NUMERACY",
    "competencyId": "NUM_WORD_PROBLEMS",
    "classNumber": 3,
    "difficulty": "DIFFICULT",
    "nipunTargetRef": "NL-NUM-C3-02: Solves fractional part-of-whole contextual real-world problems",
    "text": "Fraction / sharing problem: A watermelon was cut into 8 equal slices. Sita and her brother ate 5 slices together. What fraction of the watermelon is left?",
    "textTelugu": "భిన్నాలు: ఒక పుచ్చకాయను 8 సమాన భాగాలుగా కోశారు. సీత మరియు ఆమె సోదరుడు కలిసి 5 భాగాలు తిన్నారు. ఇంకా మిగిలి ఉన్న భాగం ఎంత?",
    "oralPrompt": "ఉపాధ్యాయ సూచన: మిగిలిన భాగాలు = 8 - 5 = 3 భాగాలు. భిన్నం = 3/8.",
    "options": [
      "3/8 (ఎనిమిదింట మూడు భాగాలు)",
      "5/8",
      "1/2",
      "1/4"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Answers 3/8 accurately"
  },

  // =========================================================================
  // GRADE 4 STANDARDIZED QUESTIONS (2026-27 TARGETS)
  // =========================================================================
  {
    "id": "Q_G4_TEL_ORF_01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 4,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G4-TEL: Read simple stories in (30 words) Telugu and at 30 WCPM",
    "text": "Timed 30-Word Story Reading: Read aloud at 30 WCPM.",
    "textTelugu": "30 పదాల కథా పఠనం: \"ఒక అడవిలో ఒక తెలివైన జింక నివసించేది. అది ప్రతిరోజూ నిర్మలమైన నది వద్దకు వెళ్లి స్వచ్ఛమైన నీరు తాగేది. ఒకరోజు దారిలో ఒక చిన్న కుందేలు కనిపించింది. ఇద్దరూ మంచి స్నేహితులుగా మారి కలిసి ఆడుకున్నారు.\"",
    "oralPrompt": "⏱️ 60 సెకన్ల టైమర్ ఆన్ చేసి పఠన వేగాన్ని నమోదు చేయండి (లక్ష్యం: 30 WCPM).",
    "options": [
      "≥30 WCPM (Target Achieved)",
      "22-29 WCPM (Proficient)",
      "15-21 WCPM (Developing)",
      "<15 WCPM (Emergent)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads with accurate phrasing at >= 30 WCPM"
  },
  {
    "id": "Q_G4_TEL_WRT_01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 4,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G4-TEL: Write short sentences with 3-4 letter words",
    "text": "Write Short Sentence: Select the grammatically correct sentence using 3-4 letter words.",
    "textTelugu": "3-4 అక్షరాల పదాలతో సరైన వాక్యం: \"చెట్లు మనకు స్వచ్ఛమైన చల్లని నీడను ఇస్తాయి.\"",
    "oralPrompt": "3-4 అక్షరాల పదాల వాక్య నిర్మాణాన్ని పరిశీలించండి.",
    "options": [
      "చెట్లు మనకు స్వచ్ఛమైన చల్లని నీడను ఇస్తాయి.",
      "చెట్లు నీడ.",
      "గాలి వీస్తుంది.",
      "నీడ ఇస్తాయి."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Constructs meaningful short sentence with 3-4 letter words"
  },
  {
    "id": "Q_G4_ENG_ORF_01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 4,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G4-ENG: Read short paragraphs with 3-4 letter words at 30 WCPM",
    "text": "Timed Reading (3-4 Letter Words): Ask child to read aloud: \"The dark blue fish swam fast in the cool pond. A tiny frog sat near the rock and saw him pass by. Both were very glad to play together all day long.\"",
    "oralPrompt": "Start timer and count words read correctly in 60 seconds (Target: 30 WCPM).",
    "options": [
      "≥30 WCPM (Target Achieved)",
      "22-29 WCPM (Proficient)",
      "15-21 WCPM (Developing)",
      "<15 WCPM (Emergent)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads paragraph smoothly at 30 WCPM"
  },
  {
    "id": "Q_G4_ENG_GRM_01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 4,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G4-ENG: Write sentences with 4-5 letter words with correct grammar",
    "text": "Sentence Structure with 4-5 Letter Words: Which sentence correctly uses 4-5 letter words with proper grammar?",
    "oralPrompt": "Verify grammatical agreement and word length.",
    "options": [
      "Many small birds build their nests on tall trees.",
      "Small birds build on tall trees many.",
      "Nests build birds small on tall.",
      "Many birds is build on tall nests."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies grammatically sound sentence with 4-5 letter words"
  },
  {
    "id": "Q_G4_NUM_ADD_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 4,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G4-NUM: Simple Addition (2 by 1)",
    "text": "Simple Addition (2 by 1 Digit): 56 + 8 = ?",
    "oralPrompt": "Ask the student to compute 56 plus 8.",
    "options": [
      "64",
      "62",
      "65",
      "54"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Computes 2 by 1 digit addition accurately"
  },
  {
    "id": "Q_G4_NUM_SUB_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 4,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G4-NUM: Subtractions (2 by 1)",
    "text": "Subtraction (2 by 1 Digit): 73 - 8 = ?",
    "oralPrompt": "Ask the student to compute 73 minus 8.",
    "options": [
      "65",
      "64",
      "66",
      "75"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Computes 2 by 1 digit subtraction correctly"
  },
  {
    "id": "Q_G4_NUM_MUL_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 4,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G4-NUM: Multiplication (1 by 1)",
    "text": "Multiplication (1 by 1 Digit): 7 × 5 = ?",
    "oralPrompt": "Ask the student: What is 7 times 5?",
    "options": [
      "35",
      "30",
      "40",
      "32"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Calculates basic 1 by 1 product accurately"
  },
  {
    "id": "Q_G4_NUM_DIV_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 4,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G4-NUM: Division (1 by 1)",
    "text": "Division (1 by 1 Digit): 9 ÷ 3 = ?",
    "oralPrompt": "Ask the student: What is 9 divided by 3?",
    "options": [
      "3",
      "2",
      "4",
      "1"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Computes basic 1 by 1 division correctly"
  },

  // =========================================================================
  // GRADE 5 STANDARDIZED QUESTIONS (2026-27 TARGETS)
  // =========================================================================
  {
    "id": "Q_G5_TEL_ORF_01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_FLUENCY",
    "classNumber": 5,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G5-TEL: Read simple stories in (40 words) Telugu and at 30 WCPM",
    "text": "Timed 40-Word Story Reading: Read aloud at 30 WCPM.",
    "textTelugu": "40 పదాల కథా పఠనం: \"కృష్ణానది తీరంలో రామాపురం అనే సుందరమైన గ్రామం ఉంది. ఆ ఊరిలో గోపాల్ అనే రైతు ఉండేవాడు. అతడు కష్టపడి పొలంలో బంగారు పంటలు పండించేవాడు. గ్రామస్తులందరూ అతని నిజాయితీని ఎంతో మెచ్చుకునేవారు. ఒకరోజు ఊరి బడిలో పిల్లలకు సేద్యం గురించి అతడు చక్కగా వివరించాడు. పిల్లలు రైతు సేవలను కొనియాడారు.\"",
    "oralPrompt": "⏱️ 60 సెకన్ల టైమర్ ఆన్ చేసి పఠన వేగాన్ని నమోదు చేయండి (లక్ష్యం: 30 WCPM).",
    "options": [
      "≥30 WCPM (Target Achieved)",
      "22-29 WCPM (Proficient)",
      "15-21 WCPM (Developing)",
      "<15 WCPM (Emergent)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads 40-word narrative at 30 WCPM"
  },
  {
    "id": "Q_G5_TEL_WRT_01",
    "domain": "LITERACY_TELUGU",
    "competencyId": "TEL_WORDS",
    "classNumber": 5,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G5-TEL: Write short sentences with 3-4 letter words",
    "text": "Write Short Sentence: Select the grammatically correct sentence using 3-4 letter words.",
    "textTelugu": "3-4 అక్షరాల పదాలతో సరైన వాక్యం: \"రైతులు సమాజానికి ఆహారాన్ని అందించే అన్నదాతలు.\"",
    "oralPrompt": "3-4 అక్షరాల పదాల వాక్య నిర్మాణాన్ని పరిశీలించండి.",
    "options": [
      "రైతులు సమాజానికి ఆహారాన్ని అందించే అన్నదాతలు.",
      "రైతు అన్నదాత.",
      "ఆహారం సమాజం.",
      "పంటలు పొలం."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Constructs meaningful civic sentence with 3-4 letter words"
  },
  {
    "id": "Q_G5_ENG_ORF_01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_FLUENCY",
    "classNumber": 5,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G5-ENG: Read short paragraphs with 3-4 letter words at 30 WCPM",
    "text": "Timed Reading (3-4 Letter Words): Ask child to read aloud: \"When warm wind blow over dark hill, boys walk with joy. They seek wild fruit that drop from high tree. Some tiny ants work hard upon deep sand. Nature is very kind to all.\"",
    "oralPrompt": "Start timer and count words read correctly in 60 seconds (Target: 30 WCPM).",
    "options": [
      "≥30 WCPM (Target Achieved)",
      "22-29 WCPM (Proficient)",
      "15-21 WCPM (Developing)",
      "<15 WCPM (Emergent)"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Reads with pacing at 30 WCPM"
  },
  {
    "id": "Q_G5_ENG_GRM_01",
    "domain": "LITERACY_ENGLISH",
    "competencyId": "ENG_GRAMMAR",
    "classNumber": 5,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G5-ENG: Write sentences with 4-5 letter words with correct grammar",
    "text": "Grammatical Sentence with 4-5 Letter Words: Which sentence correctly demonstrates grammar with 4-5 letter words?",
    "oralPrompt": "Check correct grammatical structure.",
    "options": [
      "Every brave child shall learn great skill today.",
      "Brave child learn great skill every.",
      "Child brave every learn today skill.",
      "Every child shall are learn skill."
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Identifies grammatical sentence with 4-5 letter words"
  },
  {
    "id": "Q_G5_NUM_SUB_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_SUBTRACTION",
    "classNumber": 5,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G5-NUM: Subtractions (2 by 2)",
    "text": "Subtraction (2 by 2 Digits): 64 - 28 = ?",
    "oralPrompt": "Ask the student to calculate 64 minus 28.",
    "options": [
      "36",
      "44",
      "38",
      "46"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Computes 2 by 2 digit subtraction with regrouping accurately"
  },
  {
    "id": "Q_G5_NUM_ADD_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_ADDITION",
    "classNumber": 5,
    "difficulty": "MODERATE",
    "nipunTargetRef": "FLN-2026-G5-NUM: Addition (2 by 2)",
    "text": "Addition (2 by 2 Digits): 47 + 35 = ?",
    "oralPrompt": "Ask the student to calculate 47 plus 35.",
    "options": [
      "82",
      "72",
      "81",
      "78"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Computes 2 by 2 digit addition with carryover accurately"
  },
  {
    "id": "Q_G5_NUM_MUL_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 5,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G5-NUM: Multiplication (1 by 1)",
    "text": "Multiplication (1 by 1 Digit): 8 × 7 = ?",
    "oralPrompt": "Ask the student: What is 8 times 7?",
    "options": [
      "56",
      "54",
      "48",
      "64"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Recalls single-digit multiplication fact 8x7 correctly"
  },
  {
    "id": "Q_G5_NUM_DIV_01",
    "domain": "NUMERACY",
    "competencyId": "NUM_MULTIPLICATION",
    "classNumber": 5,
    "difficulty": "EASY",
    "nipunTargetRef": "FLN-2026-G5-NUM: Division (1 by 1)",
    "text": "Division (1 by 1 Digit): 6 ÷ 2 = ?",
    "oralPrompt": "Ask the student: What is 6 divided by 2?",
    "options": [
      "3",
      "2",
      "4",
      "1"
    ],
    "correctAnswerIndex": 0,
    "maxScore": 10,
    "scoringRubric": "Computes single digit division 6÷2 correctly"
  }
];
