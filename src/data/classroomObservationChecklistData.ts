import { ClassroomObservationIndicator } from '../types/fln';

export interface ObservationSection {
  key: 'TEACHING_LEARNING' | 'TLM_USAGE' | 'MULTIGRADE' | 'ASSESSMENT_ENGAGEMENT';
  title: string;
  description: string;
  indicators: ClassroomObservationIndicator[];
}

export const CLASSROOM_OBSERVATION_INDICATORS: ClassroomObservationIndicator[] = [
  // 1. Teaching and learning process
  {
    id: 1,
    sectionKey: 'TEACHING_LEARNING',
    sectionTitle: 'Teaching and learning process',
    indicatorText: 'The teacher follows the prescribed teaching process and lesson sequence.',
  },
  {
    id: 2,
    sectionKey: 'TEACHING_LEARNING',
    sectionTitle: 'Teaching and learning process',
    indicatorText: 'Teaching activities are aligned with the grade-level learning objectives and competencies.',
  },
  {
    id: 3,
    sectionKey: 'TEACHING_LEARNING',
    sectionTitle: 'Teaching and learning process',
    indicatorText: 'The teacher provides adequate opportunities for students to practise and complete learning activities.',
  },

  // 2. Use of teaching-learning materials
  {
    id: 4,
    sectionKey: 'TLM_USAGE',
    sectionTitle: 'Use of teaching-learning materials',
    indicatorText: 'The teacher uses the prescribed Teacher Guide to plan and conduct classroom activities.',
  },
  {
    id: 5,
    sectionKey: 'TLM_USAGE',
    sectionTitle: 'Use of teaching-learning materials',
    indicatorText: 'Students use their prescribed textbooks and workbooks during classroom activities.',
  },
  {
    id: 6,
    sectionKey: 'TLM_USAGE',
    sectionTitle: 'Use of teaching-learning materials',
    indicatorText: 'Appropriate TLMs and other learning materials are used to explain concepts and engage students.',
  },

  // 3. Multigrade classroom management
  {
    id: 7,
    sectionKey: 'MULTIGRADE',
    sectionTitle: 'Multigrade classroom management',
    indicatorText: 'The teacher plans and organises learning activities for the different grades being taught.',
  },
  {
    id: 8,
    sectionKey: 'MULTIGRADE',
    sectionTitle: 'Multigrade classroom management',
    indicatorText: 'Students in different grades remain meaningfully engaged while the teacher works with another grade.',
  },
  {
    id: 9,
    sectionKey: 'MULTIGRADE',
    sectionTitle: 'Multigrade classroom management',
    indicatorText: 'The teacher provides grade-appropriate learning tasks and support across grades.',
  },

  // 4. Assessment and student engagement
  {
    id: 10,
    sectionKey: 'ASSESSMENT_ENGAGEMENT',
    sectionTitle: 'Assessment and student engagement',
    indicatorText: "The teacher checks students' understanding through questions, activities or other assessment methods.",
  },
  {
    id: 11,
    sectionKey: 'ASSESSMENT_ENGAGEMENT',
    sectionTitle: 'Assessment and student engagement',
    indicatorText: 'The teacher identifies students facing learning difficulties and provides appropriate support.',
  },
  {
    id: 12,
    sectionKey: 'ASSESSMENT_ENGAGEMENT',
    sectionTitle: 'Assessment and student engagement',
    indicatorText: 'Students actively participate in classroom activities and get opportunities to respond individually.',
  },
];

export const OBSERVATION_SECTIONS: ObservationSection[] = [
  {
    key: 'TEACHING_LEARNING',
    title: 'Teaching and learning process',
    description: 'Adherence to prescribed pedagogical sequence and foundational learning objectives.',
    indicators: CLASSROOM_OBSERVATION_INDICATORS.filter(i => i.sectionKey === 'TEACHING_LEARNING'),
  },
  {
    key: 'TLM_USAGE',
    title: 'Use of teaching-learning materials',
    description: 'Usage of Teacher Guides, workbooks, textbooks, and interactive TLM kits.',
    indicators: CLASSROOM_OBSERVATION_INDICATORS.filter(i => i.sectionKey === 'TLM_USAGE'),
  },
  {
    key: 'MULTIGRADE',
    title: 'Multigrade classroom management',
    description: 'Organization, task allocation, and active peer engagement across combined grades.',
    indicators: CLASSROOM_OBSERVATION_INDICATORS.filter(i => i.sectionKey === 'MULTIGRADE'),
  },
  {
    key: 'ASSESSMENT_ENGAGEMENT',
    title: 'Assessment and student engagement',
    description: 'Formative checks for understanding, remedial support, and inclusive participation.',
    indicators: CLASSROOM_OBSERVATION_INDICATORS.filter(i => i.sectionKey === 'ASSESSMENT_ENGAGEMENT'),
  },
];

export const OBSERVATION_RATING_OPTIONS = [
  { value: 'YES', label: 'Yes', color: 'emerald', description: 'Consistently demonstrated' },
  { value: 'PARTIALLY', label: 'Partially', color: 'amber', description: 'Partially / sometimes observed' },
  { value: 'NO', label: 'No', color: 'rose', description: 'Not observed / not implemented' },
  { value: 'NA', label: 'N/A', color: 'slate', description: 'Not applicable for this session' },
] as const;
