export interface CompetencyProgressItem {
  id: string;
  name: string;
  nameTelugu?: string;
  targetMilestone: string;
  benchmarkPercent: number;
  isTarget2026_27?: boolean;
}

export interface FLNTargetGradeSubject {
  subject: 'Telugu' | 'English' | 'Math';
  subjectTitle: string;
  iconName: string;
  averageScore: number;
  goal: string[];
  target2026_27: string[];
  keyCompetencyBrief: string;
  competencies: CompetencyProgressItem[];
}

export interface FLNGradeTarget {
  grade: number;
  gradeLabel: string;
  stage: string;
  subjects: {
    telugu: FLNTargetGradeSubject;
    english: FLNTargetGradeSubject;
    math: FLNTargetGradeSubject;
  };
}

export const FLN_TARGETS_2026_27: FLNGradeTarget[] = [
  {
    grade: 1,
    gradeLabel: 'Class 1',
    stage: 'Foundational Stage (Early Primary)',
    subjects: {
      telugu: {
        subject: 'Telugu',
        subjectTitle: 'Telugu Literacy (తెలుగు)',
        iconName: 'BookOpen',
        averageScore: 78.5,
        goal: [
          'Students will be able to read 3-letter words with Matras with understanding.',
          'Write 2–3 letter words independently.'
        ],
        target2026_27: [
          'Read 2-letter words with Matras',
          'Write 2 letter words'
        ],
        keyCompetencyBrief: 'Read 2-letter words with Matras & write 2 letter words',
        competencies: [
          {
            id: 'G1_TEL_C1',
            name: 'గుణింతాలతో 2 అక్షరాల పదాల పఠనం (Read 2-Letter Words with Matras)',
            targetMilestone: 'Read 2-letter words with Matras with understanding',
            benchmarkPercent: 81.5,
            isTarget2026_27: true,
          },
          {
            id: 'G1_TEL_C2',
            name: '2 అక్షరాల పదాల రచన (Write 2-Letter Words Independently)',
            targetMilestone: 'Write 2-letter words independently',
            benchmarkPercent: 75.2,
            isTarget2026_27: true,
          },
          {
            id: 'G1_TEL_C3',
            name: 'సరళ అక్షర & గుణింతాల గుర్తింపు (Letter & Matra Recognition)',
            targetMilestone: 'Foundation for 3-letter word decoding',
            benchmarkPercent: 84.8,
          },
          {
            id: 'G1_TEL_C4',
            name: 'చిత్ర ఆధారిత పద భావన (Picture Association & Oral Vocabulary)',
            targetMilestone: 'Oral comprehension and descriptive vocabulary',
            benchmarkPercent: 87.2,
          },
        ],
      },
      english: {
        subject: 'English',
        subjectTitle: 'English Literacy (ABC English)',
        iconName: 'Languages',
        averageScore: 73.2,
        goal: [
          'All students will be able to read small sentences with 3-letter words with understanding.',
          'Write 2–3 letter words independently.'
        ],
        target2026_27: [
          'Read small sentences with 2-letter words',
          'Write 2 letter words'
        ],
        keyCompetencyBrief: 'Read small sentences with 2-letter words & write 2 letter words',
        competencies: [
          {
            id: 'G1_ENG_C1',
            name: 'Read Small Sentences with 2-Letter Words',
            targetMilestone: 'Read small sentences with 2-letter words with understanding',
            benchmarkPercent: 74.5,
            isTarget2026_27: true,
          },
          {
            id: 'G1_ENG_C2',
            name: 'Write 2-Letter Words Independently (go, in, on, at)',
            targetMilestone: 'Write 2 letter words independently',
            benchmarkPercent: 70.8,
            isTarget2026_27: true,
          },
          {
            id: 'G1_ENG_C3',
            name: 'Phonics & Letter-Sound Association',
            targetMilestone: 'Accurate phonemic awareness of primary consonants & vowels',
            benchmarkPercent: 78.6,
          },
          {
            id: 'G1_ENG_C4',
            name: 'High-Frequency Sight Words & Oral Expression',
            targetMilestone: 'Instant recognition of common foundational sight words',
            benchmarkPercent: 81.2,
          },
        ],
      },
      math: {
        subject: 'Math',
        subjectTitle: 'Foundational Numeracy (+ - × ÷)',
        iconName: 'Calculator',
        averageScore: 76.8,
        goal: [
          'All students will be able to do simple addition and subtraction with 1-digit numbers.'
        ],
        target2026_27: [
          'Do simple numeric addition and subtraction with 1-digit numbers.'
        ],
        keyCompetencyBrief: 'Simple numeric addition and subtraction with 1-digit numbers',
        competencies: [
          {
            id: 'G1_NUM_C1',
            name: 'Single-Digit Numeric Addition (e.g. 4 + 3 = 7)',
            targetMilestone: 'Do simple numeric addition with 1-digit numbers',
            benchmarkPercent: 78.5,
            isTarget2026_27: true,
          },
          {
            id: 'G1_NUM_C2',
            name: 'Single-Digit Numeric Subtraction (e.g. 8 - 5 = 3)',
            targetMilestone: 'Do simple numeric subtraction with 1-digit numbers',
            benchmarkPercent: 73.2,
            isTarget2026_27: true,
          },
          {
            id: 'G1_NUM_C3',
            name: 'Number Identification & Counting (1 to 20)',
            targetMilestone: 'Direct cardinal recognition and number sequencing',
            benchmarkPercent: 86.4,
          },
          {
            id: 'G1_NUM_C4',
            name: 'Quantity Comparison & Object Spatial Sets',
            targetMilestone: 'More/less comparisons and geometric pattern recognition',
            benchmarkPercent: 81.0,
          },
        ],
      },
    },
  },
  {
    grade: 2,
    gradeLabel: 'Class 2',
    stage: 'Foundational Stage (Late Primary)',
    subjects: {
      telugu: {
        subject: 'Telugu',
        subjectTitle: 'Telugu Literacy (తెలుగు)',
        iconName: 'BookOpen',
        averageScore: 73.1,
        goal: [
          'All students should be able to read and understand simple sentences in Telugu with 4–5 letter words at 30 WCPM.',
          'Write short sentences with 3–4 letter words.'
        ],
        target2026_27: [
          'Read simple sentences in Telugu with 2–3 letter words at 10 WCPM.',
          'Write short sentences with 2–3 letter words.'
        ],
        keyCompetencyBrief: 'Read simple sentences (2–3 letter words) at 10 WCPM & write short sentences',
        competencies: [
          {
            id: 'G2_TEL_C1',
            name: '2–3 అక్షరాల వాక్య పఠనం (Read Sentences with 2–3 Letter Words at 10 WCPM)',
            targetMilestone: 'Read simple sentences with 2-3 letter words at 10 WCPM',
            benchmarkPercent: 72.8,
            isTarget2026_27: true,
          },
          {
            id: 'G2_TEL_C2',
            name: '2–3 అక్షరాల చిన్న వాక్యాల రచన (Write Short Sentences with 2–3 Letter Words)',
            targetMilestone: 'Write short sentences with 2-3 letter words independently',
            benchmarkPercent: 69.5,
            isTarget2026_27: true,
          },
          {
            id: 'G2_TEL_C3',
            name: 'గుణింత పదాల సరళ పఠనం (Word Decoding with Matras)',
            targetMilestone: 'Smooth word recognition without hesitation',
            benchmarkPercent: 78.4,
          },
          {
            id: 'G2_TEL_C4',
            name: 'సరళ కథా గ్రహణం & భావన (Short Passage Comprehension)',
            targetMilestone: 'Answering basic factual questions on age-appropriate text',
            benchmarkPercent: 71.8,
          },
        ],
      },
      english: {
        subject: 'English',
        subjectTitle: 'English Literacy (ABC English)',
        iconName: 'Languages',
        averageScore: 68.4,
        goal: [
          'All students will be able to read and understand short paragraphs with 4–6 letter words at 30 WCPM.',
          'Write short sentences with 3–4 letter words.'
        ],
        target2026_27: [
          'Read short paragraphs with 2–3 letter words at 10 WCPM.',
          'Write short sentences with 2–3 letter words.'
        ],
        keyCompetencyBrief: 'Read short paragraphs (2–3 letter words) at 10 WCPM & write short sentences',
        competencies: [
          {
            id: 'G2_ENG_C1',
            name: 'Read Short Paragraphs (2–3 Letter Words) at 10 WCPM',
            targetMilestone: 'Read short paragraphs with 2-3 letter words at 10 WCPM',
            benchmarkPercent: 67.5,
            isTarget2026_27: true,
          },
          {
            id: 'G2_ENG_C2',
            name: 'Write Short Sentences with 2–3 Letter Words',
            targetMilestone: 'Construct and write short declarative sentences with 2-3 letter words',
            benchmarkPercent: 64.8,
            isTarget2026_27: true,
          },
          {
            id: 'G2_ENG_C3',
            name: 'CVC Word Decoding & Phonetic Blends',
            targetMilestone: 'Accurate decoding of rhyming and patterned CVC words',
            benchmarkPercent: 74.2,
          },
          {
            id: 'G2_ENG_C4',
            name: 'Listening & Sentence-Picture Comprehension',
            targetMilestone: 'Oral comprehension and picture sentence verification',
            benchmarkPercent: 69.0,
          },
        ],
      },
      math: {
        subject: 'Math',
        subjectTitle: 'Foundational Numeracy (+ - × ÷)',
        iconName: 'Calculator',
        averageScore: 75.2,
        goal: [
          'All students will be able to do addition and subtraction with 2-digit numbers with regrouping.'
        ],
        target2026_27: [
          'Do addition and subtraction with 1-digit numbers.'
        ],
        keyCompetencyBrief: 'Addition and subtraction with 1-digit numbers',
        competencies: [
          {
            id: 'G2_NUM_C1',
            name: 'Addition with 1-Digit Numbers (e.g. 7 + 8 = 15)',
            targetMilestone: 'Do addition with 1-digit numbers fluently',
            benchmarkPercent: 79.6,
            isTarget2026_27: true,
          },
          {
            id: 'G2_NUM_C2',
            name: 'Subtraction with 1-Digit Numbers (e.g. 9 - 4 = 5)',
            targetMilestone: 'Do subtraction with 1-digit numbers fluently',
            benchmarkPercent: 74.2,
            isTarget2026_27: true,
          },
          {
            id: 'G2_NUM_C3',
            name: '2-Digit Number Sense & Place Value (1 to 99)',
            targetMilestone: 'Bundles of Tens and Ones decomposition',
            benchmarkPercent: 82.5,
          },
          {
            id: 'G2_NUM_C4',
            name: 'Tens & Ones Addition Readiness',
            targetMilestone: 'Columnar alignment and zero property awareness',
            benchmarkPercent: 76.4,
          },
        ],
      },
    },
  },
  {
    grade: 3,
    gradeLabel: 'Class 3',
    stage: 'Gateway Primary Stage',
    subjects: {
      telugu: {
        subject: 'Telugu',
        subjectTitle: 'Telugu Literacy (తెలుగు)',
        iconName: 'BookOpen',
        averageScore: 71.4,
        goal: [
          'All students should be able to read simple stories in Telugu with understanding words at 50 WCPM.',
          'Write short sentences with 3–5 letter words with correct grammar.'
        ],
        target2026_27: [
          'Read simple stories (20 word) in Telugu and at 30 WCPM.',
          'Write short sentences with 3–4 letter words.'
        ],
        keyCompetencyBrief: 'Read simple stories (20 words) at 30 WCPM & write short sentences (3–4 letter words)',
        competencies: [
          {
            id: 'G3_TEL_C1',
            name: '20 పదాల సరళ కథా పఠనం (Read 20-Word Stories at 30 WCPM)',
            targetMilestone: 'Read simple stories (20 words) in Telugu at 30 WCPM',
            benchmarkPercent: 68.5,
            isTarget2026_27: true,
          },
          {
            id: 'G3_TEL_C2',
            name: '3–4 అక్షరాల చిన్న వాక్యాల రచన (Write Short Sentences with 3–4 Letter Words)',
            targetMilestone: 'Write short sentences with 3-4 letter words independently',
            benchmarkPercent: 72.4,
            isTarget2026_27: true,
          },
          {
            id: 'G3_TEL_C3',
            name: 'కథా గ్రహణం & ప్రశ్నలకు సమాధానాలు (Reading Comprehension)',
            targetMilestone: 'Answering direct factual and inferential comprehension questions',
            benchmarkPercent: 71.9,
          },
          {
            id: 'G3_TEL_C4',
            name: 'సంయుక్తాక్షర & ద్విత్వాక్షర పదాలు (Conjunct Word Decoding)',
            targetMilestone: 'Accurate pronunciation and decoding of complex syllable conjuncts',
            benchmarkPercent: 76.5,
          },
        ],
      },
      english: {
        subject: 'English',
        subjectTitle: 'English Literacy (ABC English)',
        iconName: 'Languages',
        averageScore: 67.5,
        goal: [
          'All students will be able to read and understand short paragraphs with 5–7 letter words at 50 WCPM.',
          'Write sentences with 5–7 letter words with correct grammar.'
        ],
        target2026_27: [
          'Read short paragraphs with 3–4 letter words at 30 WCPM.',
          'Write sentences with 4–5 letter words with correct grammar.'
        ],
        keyCompetencyBrief: 'Read short paragraphs (3–4 letter words) at 30 WCPM & write sentences with 4–5 letter words',
        competencies: [
          {
            id: 'G3_ENG_C1',
            name: 'Read Short Paragraphs (3–4 Letter Words) at 30 WCPM',
            targetMilestone: 'Read short paragraphs with 3-4 letter words at 30 WCPM',
            benchmarkPercent: 66.8,
            isTarget2026_27: true,
          },
          {
            id: 'G3_ENG_C2',
            name: 'Write Sentences with 4–5 Letter Words with Correct Grammar',
            targetMilestone: 'Write sentences with 4-5 letter words with correct grammar',
            benchmarkPercent: 65.2,
            isTarget2026_27: true,
          },
          {
            id: 'G3_ENG_C3',
            name: 'Paragraph Reading Comprehension',
            targetMilestone: 'Extracting key details and sequence from 3-4 sentence text',
            benchmarkPercent: 69.4,
          },
          {
            id: 'G3_ENG_C4',
            name: 'Grammar, Prepositions & Action Words',
            targetMilestone: 'Using action words, singular/plural, and basic prepositions',
            benchmarkPercent: 70.8,
          },
        ],
      },
      math: {
        subject: 'Math',
        subjectTitle: 'Foundational Numeracy (+ - × ÷)',
        iconName: 'Calculator',
        averageScore: 70.8,
        goal: [
          'All students will be able to do simple multiplication, division, and solve word problems.'
        ],
        target2026_27: [
          'Do simple addition, subtraction (2 by 1), multiplication, division (1 by 1).'
        ],
        keyCompetencyBrief: 'Simple addition, subtraction (2 by 1), multiplication, division (1 by 1)',
        competencies: [
          {
            id: 'G3_NUM_C1',
            name: 'Simple Addition with Regrouping / Carryover',
            targetMilestone: 'Do simple addition with multi-digit numbers',
            benchmarkPercent: 74.2,
            isTarget2026_27: true,
          },
          {
            id: 'G3_NUM_C2',
            name: 'Subtraction (2 by 1 Digit) (e.g. 45 - 7 = 38)',
            targetMilestone: 'Do subtraction (2 by 1) with borrowing',
            benchmarkPercent: 68.9,
            isTarget2026_27: true,
          },
          {
            id: 'G3_NUM_C3',
            name: 'Multiplication (1 by 1 Digit) (e.g. 6 × 4 = 24)',
            targetMilestone: 'Do multiplication (1 by 1) basic multiplication facts',
            benchmarkPercent: 71.5,
            isTarget2026_27: true,
          },
          {
            id: 'G3_NUM_C4',
            name: 'Division (1 by 1 Digit) (e.g. 8 ÷ 2 = 4)',
            targetMilestone: 'Do division (1 by 1) single-digit equal sharing',
            benchmarkPercent: 66.2,
            isTarget2026_27: true,
          },
        ],
      },
    },
  },
  {
    grade: 4,
    gradeLabel: 'Class 4',
    stage: 'Preparatory Stage (Mid Primary)',
    subjects: {
      telugu: {
        subject: 'Telugu',
        subjectTitle: 'Telugu Literacy (తెలుగు)',
        iconName: 'BookOpen',
        averageScore: 72.8,
        goal: [
          'All students should be able to read simple stories in Telugu with understanding words at 50 WCPM.',
          'Write short sentences with 3–5 letter words with correct grammar.'
        ],
        target2026_27: [
          'Read simple stories in (30 words) Telugu and at 30 WCPM.',
          'Write short sentences with 3–4 letter words.'
        ],
        keyCompetencyBrief: 'Read simple stories in (30 words) Telugu at 30 WCPM & write short sentences',
        competencies: [
          {
            id: 'G4_TEL_C1',
            name: '30 పదాల కథా పఠనం (Read 30-Word Stories in Telugu at 30 WCPM)',
            targetMilestone: 'Read simple stories in (30 words) Telugu at 30 WCPM',
            benchmarkPercent: 69.8,
            isTarget2026_27: true,
          },
          {
            id: 'G4_TEL_C2',
            name: '3–4 అక్షరాల వాక్యాల రచన (Write Short Sentences with 3–4 Letter Words)',
            targetMilestone: 'Write short sentences with 3-4 letter words with correct grammar',
            benchmarkPercent: 73.6,
            isTarget2026_27: true,
          },
          {
            id: 'G4_TEL_C3',
            name: 'కథా భావగ్రహణం & సమగ్ర వివరణ (Narrative Comprehension)',
            targetMilestone: 'Interpreting main themes and drawing character inferences',
            benchmarkPercent: 72.5,
          },
          {
            id: 'G4_TEL_C4',
            name: 'వ్యాకరణం & వాక్య సవరణ (Grammar & Sentence Syntax)',
            targetMilestone: 'Proper verb agreement and complex conjunct usage',
            benchmarkPercent: 75.8,
          },
        ],
      },
      english: {
        subject: 'English',
        subjectTitle: 'English Literacy (ABC English)',
        iconName: 'Languages',
        averageScore: 68.6,
        goal: [
          'All students will be able to read and understand short paragraphs with 5–7 letter words at 50 WCPM.',
          'Write sentences with 5–7 letter words with correct grammar.'
        ],
        target2026_27: [
          'Read short paragraphs with 3–4 letter words at 30 WCPM.',
          'Write sentences with 4–5 letter words with correct grammar.'
        ],
        keyCompetencyBrief: 'Read short paragraphs (3–4 letter words) at 30 WCPM & write sentences with 4–5 letter words',
        competencies: [
          {
            id: 'G4_ENG_C1',
            name: 'Read Short Paragraphs (3–4 Letter Words) at 30 WCPM',
            targetMilestone: 'Read short paragraphs with 3-4 letter words at 30 WCPM',
            benchmarkPercent: 67.2,
            isTarget2026_27: true,
          },
          {
            id: 'G4_ENG_C2',
            name: 'Write Sentences with 4–5 Letter Words with Correct Grammar',
            targetMilestone: 'Write sentences with 4-5 letter words with correct grammar',
            benchmarkPercent: 68.4,
            isTarget2026_27: true,
          },
          {
            id: 'G4_ENG_C3',
            name: 'Contextual Reading Comprehension',
            targetMilestone: 'Factual retrieval and understanding passage context',
            benchmarkPercent: 71.0,
          },
          {
            id: 'G4_ENG_C4',
            name: 'Functional Grammar & Punctuation Agreement',
            targetMilestone: 'Capitalization, period, comma, and subject-verb agreement',
            benchmarkPercent: 69.5,
          },
        ],
      },
      math: {
        subject: 'Math',
        subjectTitle: 'Foundational Numeracy (+ - × ÷)',
        iconName: 'Calculator',
        averageScore: 71.9,
        goal: [
          'All students will be able to do simple multiplication, division, and solve word problems.'
        ],
        target2026_27: [
          'Do simple Addition, Subtractions (2 by 1), multiplication, division (1 by 1).'
        ],
        keyCompetencyBrief: 'Simple Addition, Subtractions (2 by 1), multiplication, division (1 by 1)',
        competencies: [
          {
            id: 'G4_NUM_C1',
            name: 'Simple Addition (2-Digit + 1-Digit) (e.g. 56 + 8 = 64)',
            targetMilestone: 'Do simple addition with regrouping',
            benchmarkPercent: 76.8,
            isTarget2026_27: true,
          },
          {
            id: 'G4_NUM_C2',
            name: 'Subtractions (2 by 1 Digit) (e.g. 73 - 8 = 65)',
            targetMilestone: 'Do subtraction (2 by 1) with borrowing',
            benchmarkPercent: 70.4,
            isTarget2026_27: true,
          },
          {
            id: 'G4_NUM_C3',
            name: 'Multiplication (1 by 1 Digit) (e.g. 7 × 5 = 35)',
            targetMilestone: 'Single-digit multiplication facts (1 by 1)',
            benchmarkPercent: 73.8,
            isTarget2026_27: true,
          },
          {
            id: 'G4_NUM_C4',
            name: 'Division (1 by 1 Digit) (e.g. 9 ÷ 3 = 3)',
            targetMilestone: 'Single-digit division facts (1 by 1)',
            benchmarkPercent: 67.5,
            isTarget2026_27: true,
          },
        ],
      },
    },
  },
  {
    grade: 5,
    gradeLabel: 'Class 5',
    stage: 'Preparatory Stage (Upper Primary Gateway)',
    subjects: {
      telugu: {
        subject: 'Telugu',
        subjectTitle: 'Telugu Literacy (తెలుగు)',
        iconName: 'BookOpen',
        averageScore: 73.6,
        goal: [
          'All students should be able to read simple stories in Telugu with understanding words at 50 WCPM.',
          'Write short sentences with 3–5 letter words with correct grammar.'
        ],
        target2026_27: [
          'Read simple stories in (40 words) Telugu and at 30 WCPM.',
          'Write short sentences with 3–4 letter words.'
        ],
        keyCompetencyBrief: 'Read simple stories in (40 words) Telugu at 30 WCPM & write short sentences',
        competencies: [
          {
            id: 'G5_TEL_C1',
            name: '40 పదాల కథా పఠనం (Read 40-Word Stories in Telugu at 30 WCPM)',
            targetMilestone: 'Read simple stories in (40 words) Telugu at 30 WCPM',
            benchmarkPercent: 71.2,
            isTarget2026_27: true,
          },
          {
            id: 'G5_TEL_C2',
            name: '3–4 అక్షరాల వాక్యాల రచన (Write Short Sentences with 3–4 Letter Words)',
            targetMilestone: 'Write short sentences with 3-4 letter words independently',
            benchmarkPercent: 75.4,
            isTarget2026_27: true,
          },
          {
            id: 'G5_TEL_C3',
            name: 'సమగ్ర భావగ్రహణం & విశ్లేషణ (Deeper Comprehension & Inference)',
            targetMilestone: 'Inferential thinking, author tone, and thematic summary',
            benchmarkPercent: 74.0,
          },
          {
            id: 'G5_TEL_C4',
            name: 'స్వతంత్ర వాక్య రచన & పదజాలం (Independent Writing & Vocabulary)',
            targetMilestone: 'Expressing creative thoughts and civic opinions in writing',
            benchmarkPercent: 73.2,
          },
        ],
      },
      english: {
        subject: 'English',
        subjectTitle: 'English Literacy (ABC English)',
        iconName: 'Languages',
        averageScore: 70.1,
        goal: [
          'All students will be able to read and understand short paragraphs with 5–7 letter words at 50 WCPM.',
          'Write sentences with 5–7 letter words with correct grammar.'
        ],
        target2026_27: [
          'Read short paragraphs with 3–4 letter words at 30 WCPM.',
          'Write sentences with 4–5 letter words with correct grammar.'
        ],
        keyCompetencyBrief: 'Read short paragraphs (3–4 letter words) at 30 WCPM & write sentences with 4–5 letter words',
        competencies: [
          {
            id: 'G5_ENG_C1',
            name: 'Read Short Paragraphs (3–4 Letter Words) at 30 WCPM',
            targetMilestone: 'Read short paragraphs with 3-4 letter words at 30 WCPM',
            benchmarkPercent: 68.0,
            isTarget2026_27: true,
          },
          {
            id: 'G5_ENG_C2',
            name: 'Write Sentences with 4–5 Letter Words with Correct Grammar',
            targetMilestone: 'Write sentences with 4-5 letter words with correct grammar',
            benchmarkPercent: 70.5,
            isTarget2026_27: true,
          },
          {
            id: 'G5_ENG_C3',
            name: 'Inferential Reading Comprehension',
            targetMilestone: 'Inferring underlying facts and answering open-ended prompts',
            benchmarkPercent: 73.4,
          },
          {
            id: 'G5_ENG_C4',
            name: 'Applied Vocabulary & Parts of Speech',
            targetMilestone: 'Using nouns, verbs, adjectives, and conjunctions correctly',
            benchmarkPercent: 71.2,
          },
        ],
      },
      math: {
        subject: 'Math',
        subjectTitle: 'Foundational Numeracy (+ - × ÷)',
        iconName: 'Calculator',
        averageScore: 72.1,
        goal: [
          'All students will be able to do simple multiplication, division, and solve word problems.'
        ],
        target2026_27: [
          'Do simple Addition, Subtractions (2 by 2), multiplication, division (1 by 1).'
        ],
        keyCompetencyBrief: 'Simple Addition, Subtractions (2 by 2), multiplication, division (1 by 1)',
        competencies: [
          {
            id: 'G5_NUM_C1',
            name: 'Addition (2 by 2 Digits) (e.g. 47 + 35 = 82)',
            targetMilestone: 'Do simple Addition (2 by 2 digits) with carryover',
            benchmarkPercent: 73.5,
            isTarget2026_27: true,
          },
          {
            id: 'G5_NUM_C2',
            name: 'Subtractions (2 by 2 Digits) (e.g. 64 - 28 = 36)',
            targetMilestone: 'Do Subtractions (2 by 2 digits) with regrouping',
            benchmarkPercent: 66.8,
            isTarget2026_27: true,
          },
          {
            id: 'G5_NUM_C3',
            name: 'Multiplication (1 by 1 Digit) (e.g. 8 × 7 = 56)',
            targetMilestone: 'Multiplication (1 by 1) recall with speed',
            benchmarkPercent: 75.2,
            isTarget2026_27: true,
          },
          {
            id: 'G5_NUM_C4',
            name: 'Division (1 by 1 Digit) (e.g. 6 ÷ 2 = 3)',
            targetMilestone: 'Division (1 by 1) single-digit division facts',
            benchmarkPercent: 69.8,
            isTarget2026_27: true,
          },
        ],
      },
    },
  },
];

// Composite multi-grade official curriculum competencies for Classes 1 to 5
export const COMPOSITE_ALL_GRADES_COMPETENCIES = {
  telugu: {
    averageScore: 73.5,
    milestoneOverview: 'Matras (C1) • 10 WCPM (C2) • 20-40 Words @ 30 WCPM (C3-5)',
    competencies: [
      {
        id: 'ALL_TEL_1',
        name: 'గుణింతాలతో 2 అక్షరాల పదాల పఠనం (Read 2-Letter Words with Matras - Class 1)',
        targetMilestone: 'Class 1 Target: Read 2-letter words with Matras with understanding',
        benchmarkPercent: 81.5,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_TEL_2',
        name: '2–3 అక్షరాల వాక్య పఠనం (Read Sentences at 10 WCPM - Class 2)',
        targetMilestone: 'Class 2 Target: Read simple sentences in Telugu with 2-3 letter words at 10 WCPM',
        benchmarkPercent: 72.8,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_TEL_3',
        name: '20–40 పదాల కథా పఠనం (Read 20-40 Word Stories at 30 WCPM - Classes 3–5)',
        targetMilestone: 'Classes 3-5 Target: Read simple stories (20-40 words) at 30 WCPM',
        benchmarkPercent: 70.0,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_TEL_4',
        name: '2–4 అక్షరాల పదాలతో వాక్యాల రచన (Writing Sentences with 2–4 Letter Words - Classes 1–5)',
        targetMilestone: 'Classes 1-5 Target: Write 2-4 letter words & short sentences independently',
        benchmarkPercent: 74.2,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_TEL_5',
        name: 'కథా గ్రహణం & భావ వ్యక్తీకరణ (Reading Comprehension & Oral Rubric - Classes 2–5)',
        targetMilestone: 'Curriculum Goal: Answering factual and inferential questions on grade-level text',
        benchmarkPercent: 73.5,
      },
    ],
  },
  english: {
    averageScore: 69.6,
    milestoneOverview: '2-Letter Sentences (C1) • 10 WCPM (C2) • 30 WCPM & 4-5 Letter Words (C3-5)',
    competencies: [
      {
        id: 'ALL_ENG_1',
        name: 'Read Small Sentences with 2-Letter Words (Class 1)',
        targetMilestone: 'Class 1 Target: Read small sentences with 2-letter words with understanding',
        benchmarkPercent: 74.5,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_ENG_2',
        name: 'Read Short Paragraphs (2–3 Letter Words) at 10 WCPM (Class 2)',
        targetMilestone: 'Class 2 Target: Read short paragraphs with 2-3 letter words at 10 WCPM',
        benchmarkPercent: 67.5,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_ENG_3',
        name: 'Read Short Paragraphs (3–4 Letter Words) at 30 WCPM (Classes 3–5)',
        targetMilestone: 'Classes 3-5 Target: Read short paragraphs with 3-4 letter words at 30 WCPM',
        benchmarkPercent: 67.3,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_ENG_4',
        name: 'Write Sentences with 4–5 Letter Words with Correct Grammar (Classes 3–5)',
        targetMilestone: 'Classes 3-5 Target: Write sentences with 4-5 letter words with correct grammar',
        benchmarkPercent: 68.0,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_ENG_5',
        name: 'Phonics, Vocabulary & Paragraph Reading Comprehension (Classes 1–5)',
        targetMilestone: 'Curriculum Goal: Phonetic decoding, sight vocabulary, and comprehension',
        benchmarkPercent: 72.8,
      },
    ],
  },
  math: {
    averageScore: 73.3,
    milestoneOverview: '1-Digit Add/Sub (C1-2) • 2x1 Sub (C3-4) • 2x2 Add/Sub (C5) • 1x1 Mult/Div (C3-5)',
    competencies: [
      {
        id: 'ALL_NUM_1',
        name: 'Single-Digit Numeric Addition & Subtraction (Classes 1–2)',
        targetMilestone: 'Classes 1-2 Target: Do simple addition and subtraction with 1-digit numbers',
        benchmarkPercent: 77.5,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_NUM_2',
        name: 'Subtraction (2 by 1 Digit) (Classes 3–4)',
        targetMilestone: 'Classes 3-4 Target: Subtractions (2 by 1) with borrowing',
        benchmarkPercent: 69.8,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_NUM_3',
        name: 'Addition & Subtraction (2 by 2 Digits with Carryover/Regrouping - Class 5)',
        targetMilestone: 'Class 5 Target: Do simple Addition & Subtractions (2 by 2)',
        benchmarkPercent: 70.2,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_NUM_4',
        name: 'Multiplication (1 by 1 Digit) (Classes 3–5)',
        targetMilestone: 'Classes 3-5 Target: Multiplication (1 by 1) basic multiplication facts',
        benchmarkPercent: 73.5,
        isTarget2026_27: true,
      },
      {
        id: 'ALL_NUM_5',
        name: 'Division (1 by 1 Digit) (Classes 3–5)',
        targetMilestone: 'Classes 3-5 Target: Division (1 by 1) single-digit division facts',
        benchmarkPercent: 68.0,
        isTarget2026_27: true,
      },
    ],
  },
};
