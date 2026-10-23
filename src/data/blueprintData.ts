export interface BlueprintSection {
  id: string;
  code: string;
  title: string;
  category: 'Strategic' | 'Architecture' | 'Algorithms' | 'Specifications' | 'Governance';
  content: string;
}

export const BLUEPRINT_SECTIONS: BlueprintSection[] = [
  {
    id: 'sec_a',
    code: 'A',
    title: 'Executive Summary',
    category: 'Strategic',
    content: `### Executive Summary

The **Andhra Pradesh School Education Department** is executing a high-stakes, statewide Foundational Literacy and Numeracy (FLN) Transformation Programme spanning three academic years: **2026–2029**. Aligned with the national **NIPUN Bharat Mission** and state learning frameworks, this initiative mandates that every child in Classes 1 through 5 acquires foundational reading with comprehension and basic mathematical reasoning skills.

Historically, administrative field monitoring in school education suffered from critical structural vulnerabilities:
1. **Unsystematic School Visits:** Officers selected schools based on convenience rather than academic need.
2. **Assessment Sampling Bias:** Field visitors repeatedly assessed the same vocal, high-performing students seated in front rows, creating artificial score inflation.
3. **Absence of Unique Monthly Coverage Tracking:** Systems equated raw counts of tests with student coverage; assessing 1 student 5 times was recorded as 5 assessments, masking the fact that 29 out of 30 children in the classroom were never assessed.
4. **Data Sinks Without Corrective Action:** Field inspection remarks remained in paper registers without an actionable follow-up loop to empower teachers and headmasters.

This blueprint establishes a state-of-the-art **FLN Field Monitoring Mobile Application & State MIS Dashboard**. Built with intelligent school priority dispatch, algorithmic random student selection from unassessed pools, adaptive bilingual FLN assessments, offline-first sync architecture, anti-gaming anomaly detection, and closed-loop follow-up remediation, the system transforms field visits from routine compliance checks into a continuous outcome-improvement engine.`
  },
  {
    id: 'sec_b',
    code: 'B',
    title: 'Problem Statement',
    category: 'Strategic',
    content: `### Problem Statement

The Andhra Pradesh public school ecosystem encompasses over 45,000 primary and upper primary schools, 1.2+ lakh educators, and approximately 35+ lakh early-grade students. To achieve 100% foundational competency by 2029, the department faces fundamental operational challenges:

1. **Target Dispersion:** Over 3,500 field functionaries (DEOs, Dy. DEOs, MEOs, CRPs) have prescribed monthly field targets (10 to 30 days/month), but visit completion and geographic distribution have been non-transparent.
2. **Cherry-Picking vs Academic Need:** Schools along highways or near urban centers receive frequent visits, whereas interior rural and tribal schools with critical learning deficits remain unvisited for quarters.
3. **Repeated Assessment of the Same Cohort:** Field assessors naturally gravitate towards the quickest respondents. Longitudinal tracking reveals that less than 20% of unique enrolled students were ever monitored directly by external officers.
4. **Lack of In-Situ Diagnostics:** Field officers recorded generic comments like "Teaching good" or "Improve handwriting" rather than diagnosing specific NIPUN Lakshya competency gaps (e.g., struggling with 2-digit subtraction with regrouping).
5. **Low Connectivity in Remote Mandals:** Field staff in Agency/tribal mandals (Alluri Sitharama Raju, Parvathipuram Manyam) experience intermittent GSM connectivity, requiring a resilient offline-first architecture with cryptographically signed local databases.`
  },
  {
    id: 'sec_c',
    code: 'C',
    title: 'Programme Objectives',
    category: 'Strategic',
    content: `### Programme Objectives (2026–2029)

1. **Target-Driven Field Monitoring:** Ensure 100% of mandated field officers achieve their prescribed monthly visit quotas (DEO: 10, Dy. DEO: 15, MEO: 20, CRP: 30 days/month).
2. **Algorithmic School Prioritization:** Automatically direct field functionaries to schools exhibiting the highest learning lag, lowest visit recency, and pending action items via the dynamic Tour Diary engine.
3. **Maximizing Unique Monthly Student Coverage:** Systematically enforce unique student sampling per classroom. In a class of 30 students, sequential visits during the month must assess previously unassessed children until 100% class coverage is attained.
4. **Standardized Bilingual FLN Diagnostics:** Administer calibrated Telugu and English foundational literacy (word decoding, passage fluency, comprehension) and numeracy items (number identification, regrouping, word problem) pegged to NIPUN Lakshyas.
5. **Instant Remediation & Notification Loop:** Instantly push diagnostic gap reports to the class teacher and HM immediately upon submission with suggested TLM activities.
6. **Closed-Loop Follow-up Verification:** Convert diagnosed gaps into trackable Action Items with assigned owners, target resolution dates, and mandatory follow-up verification in subsequent visits.`
  },
  {
    id: 'sec_d',
    code: 'D',
    title: 'User Personas',
    category: 'Strategic',
    content: `### User Personas

| Persona | Role | Primary Goals | Frustrations | System Value |
|---|---|---|---|---|
| **Smt. Thameem Ansariya A, IAS** | State Leadership (Commissioner / SPD) | High-level macro visibility; identify low-performing districts and mandals; track statewide visit achievement % and unique student coverage % | Drowning in unverified spreadsheets; delayed reporting; inability to detect ghost visits | Single-screen Executive Command Center with AI-generated insights, district rankings, and trend analytics |
| **Sri M. Venkata Krishna** | DEO (District Educational Officer) | Monitor division and mandal target completion; address critical schools; hold review meetings with MEOs | Lack of real-time drill-down to mandal/school level; manual compilation of inspection diaries | District Cockpit with officer achievement gaps, school risk heatmaps, and one-click review reports |
| **Sri P. Lakshmi Narayana** | MEO (Mandal Educational Officer) | Complete 20 field visit days/month; conduct surprise checks; verify remedial teaching in MPPS schools | Heavy administrative paperwork; uncertainty over which school needs urgent academic intervention | Digital Tour Diary with daily recommended priority schools and automated route clustering |
| **Sri S. Venkata Rao** | CRP (Cluster Resource Person) | Conduct 30 visits/month (1-2 schools/day); assess minimum 5 students per class; support teachers with FLN pedagogy | Confusion over which students were already tested; cumbersome paper assessment rubrics | Mobile Field App with smart "Random Select Unassessed Student", quick 3-minute adaptive test, and instant scoring |
| **Smt. G. Padmavathi** | Headmistress (MPPS Kaza) | Understand school-wide FLN coverage; track teacher performance; resolve infrastructure and TLM gaps | Officers visit but leave without sharing actionable student diagnostic feedback | In-app School Dashboard and SMS/push notifications detailing class-wise student mastery and specific action items |
| **Sri B. Ramesh Kumar** | Primary Teacher (SGT) | Identify which students need foundational remediation in reading fluency or carryover addition | Generic criticism; no student-specific learning gap diagnosis | Actionable gap card showing exact sub-competencies where individual roll numbers require remedial teaching |`
  },
  {
    id: 'sec_e',
    code: 'E',
    title: 'Roles and Permission Matrix',
    category: 'Governance',
    content: `### Roles and Permission Matrix (Configurable RBAC)

| Role | Scope | Tour Diary Plan | School Check-in | Conduct Assessment | Reassess Student | View State KPIs | View District Drilldown | View Student Names | Configure Rules |
|---|---|---|---|---|---|---|---|---|---|
| **State Leadership** | Statewide | View All | Surprise Only | Optional | With Reason | **Full** | **Full** | Masked / Anonymized | View Only |
| **DEO** | District | View District | Yes (Any in Dist) | Yes | With Reason | District View | **Full** | Permitted | View Only |
| **Deputy DEO** | Division | View Division | Yes (Division) | Yes | With Reason | Division View | Division | Permitted | View Only |
| **MEO** | Mandal | Generate/Edit | Yes (Mandal) | Yes | With Reason | Mandal View | Mandal | Full | View Only |
| **CRP** | Cluster | Assigned Cluster | Yes (Cluster) | **Primary** | With Reason | Cluster View | Cluster | Full | None |
| **Headmaster** | School | None | View Visits | View Only | None | School Only | None | Full (Own School) | None |
| **Teacher** | Class/Section | None | None | View Only | None | Class Only | None | Full (Own Class) | None |
| **System Admin** | Global | Configure All | Audit Mode | Test Mode | Yes | Full | Full | Full | **Full Control** |`
  },
  {
    id: 'sec_f',
    code: 'F',
    title: 'End-to-End User Journeys',
    category: 'Specifications',
    content: `### End-to-End User Journeys

#### 1. Cluster Resource Person (CRP) / Field Officer
1. **Morning Briefing:** Opens mobile app. Tour Diary presents top 3 recommended schools based on priority score. Selects *MPPS Kaza Main* (Priority Score: 68.5, High Priority).
2. **On-Site Check-In:** Reaches school premises. Clicks **Check In**. Device captures GPS lat/long, verifies geofence (within 200m), records timestamp, displays 2 pending action items from prior visits.
3. **Classroom Navigation:** Selects **Class 3, Section A**. System displays: *Enrolled: 30 | Assessed this month: 5 | Remaining: 25 | Coverage: 16.7%*.
4. **Student Selection:** Taps **Random Select 5 Students**. System filters eligible pool (*Not Yet Assessed in July 2026*) and selects Roll Nos 6, 7, 8, 9, 10.
5. **Attendance Verification:** Roll No 8 (N. Bhavani) is absent. Officer marks "Absent". Student is NOT counted as assessed; system automatically selects Roll No 11 from the unassessed pool to maintain target quota.
6. **Adaptive FLN Assessment:** 
   - *Literacy:* Tests word decoding ("పుస్తకం"). Correct → advances to comprehension passage. Scores 8/10.
   - *Numeracy:* Tests 3-digit place value (456). Correct → advances to 2-digit regrouping (54 + 28). Incorrect → provides hint/records score. Scores 6/10.
7. **Submission & Aggregation:** Submits assessment. Record is saved locally and synced to cloud. Monthly status updates to: *Assessed: 10 | Remaining: 20 | Coverage: 33.3%*.
8. **Check-out:** Records overall observation, creates Action Item for math kit regrouping remediation, checks out.

#### 2. Headmaster & Teacher Journey
1. **Instant Notification:** Immediate SMS/in-app alert received: *"Class 3-A: 5 students assessed by Sri S. Venkata Rao. 2 students scored in Developing band in Numeracy."*
2. **Action Item Review:** HM opens school dashboard, reviews remediation note, and assigns remedial peer-learning session to Sri Ramesh Kumar (Teacher).

#### 3. State Leadership Journey (Commissioner / SPD)
1. **Executive Dashboard Review:** Logs in on tablet/web. Views Statewide Achievement: Visits (86.2%), Monthly Unique Student Coverage (64.1%), Average FLN Score (68.4%).
2. **Anomaly & Outlier Identification:** Clicks District heat map. Notes *Kurnool* and *Ananthapuramu* lagging in numeracy coverage.
3. **Directive Issuance:** Filters priority schools in Kurnool; triggers statewide circular directing DEO to conduct targeted review of CRP tour diaries.`
  },
  {
    id: 'sec_g',
    code: 'G',
    title: 'Mobile App Information Architecture',
    category: 'Architecture',
    content: `### Mobile App Information Architecture

\`\`\`
[Mobile App Root]
 ├── Auth Screen (Biometric / OTP / SSO)
 ├── Main Tab Bar
 │    ├── 1. Home / Cockpit
 │    │    ├── Monthly Target vs Actual Visit Card (Achievement %, Gap)
 │    │    ├── Assessment Target vs Actual Card (Unique Students %, Gap)
 │    │    ├── Quick Action: Start School Visit
 │    │    └── Pending Sync Queue Status Indicator
 │    ├── 2. Tour Diary
 │    │    ├── Monthly Calendar View (Planned, Completed, Missed)
 │    │    ├── Recommended Priority Schools Tab (Critical, High, Medium)
 │    │    └── Custom Visit Schedule Request
 │    ├── 3. Active Visit (Workflow Core)
 │    │    ├── Step 1: School Profile & Geofenced Check-In
 │    │    ├── Step 2: Classroom Selection (Classes 1–5, Sections A/B)
 │    │    ├── Step 3: Monthly Class Coverage HUD (30 total, 5 done, 25 left)
 │    │    ├── Step 4: Student Selection Matrix (Filter: Unassessed / Assessed)
 │    │    │    └── Action: "Random Select 5 Students"
 │    │    ├── Step 5: Attendance Verification (Mark Present/Absent)
 │    │    ├── Step 6: FLN Assessment Engine (Bilingual Telugu/English)
 │    │    │    ├── Literacy Sub-Test (Letters, Words, Fluency, Comprehension)
 │    │    │    └── Numeracy Sub-Test (Numbers, Operations, Word Problems)
 │    │    ├── Step 7: Score Summary & Teacher Feedback Generator
 │    │    └── Step 8: Visit Check-out & Action Item Logger
 │    ├── 4. Action Tracker
 │    │    ├── My Created Action Items
 │    │    └── School Pending Remediation Issues
 │    ├── 5. Offline Sync Manager
 │    │    ├── Queued Visits & Assessments
 │    │    └── Manual Force Sync Trigger
 │    └── 6. Profile & Helpdesk
 │         ├── Officer Jurisdiction Details
 │         └── NIPUN Bharat Reference Guidelines
\`\`\``
  },
  {
    id: 'sec_h',
    code: 'H',
    title: 'Web Dashboard Information Architecture',
    category: 'Architecture',
    content: `### Web Dashboard Information Architecture

\`\`\`
[State FLN Web MIS Portal]
 ├── Top Navigation Bar
 │    ├── AP Government Crest & School Education Directorate Lockup
 │    ├── Breadcrumb Pathway
 │    ├── Academic Year / Month Selector (e.g., July 2026)
 │    ├── Role Switcher / User Profile (State Leadership, DEO, MEO, HM, Admin)
 │    └── System Status (Online, Last DB Sync)
 ├── Sidebar Navigation
 │    ├── 1. State Command Center (Executive Macro KPIs & Heatmaps)
 │    ├── 2. District & Mandal Drilldown (Hierarchical Performance Tables)
 │    ├── 3. Priority School Risk Matrix (Automated School Priority Engine)
 │    ├── 4. Field Officer Tour Diary MIS (Planned vs Actual Visits & Gaps)
 │    ├── 5. Student Coverage & Progression Tracker (Unique vs Reassessed)
 │    ├── 6. FLN Competency & Item Analysis (Sub-competency Diagnostic Heatmaps)
 │    ├── 7. Follow-up & Action Tracker (Issue Lifecycle & Closure Rates)
 │    ├── 8. Reports & Analytics Download (Excel, CSV, PDF generator)
 │    ├── 9. Administration & Config (Targets, Weights, Question Bank, Reset Cycle)
 │    └── 10. PRD & Architectural Blueprint (Full 31-Section Reference)
\`\`\``
  },
  {
    id: 'sec_i',
    code: 'I',
    title: 'Detailed Screen Specifications',
    category: 'Specifications',
    content: `### Detailed Screen Specifications

#### Screen 1: Mobile Tour Diary & Recommended Schools
* **Purpose:** Display officer's monthly visit target, current achievement, and algorithmic prioritized school recommendations.
* **Fields & Indicators:**
  - Officer Name, Designation, Month (July 2026).
  - Target Progress Bar: Target = 30 days, Completed = 18 days, Gap = 12 days (60% Achievement).
  - Recommended School Card: School Name, UDISE code, Cluster, Priority Score (e.g. 84.2 - CRITICAL), Priority Reason badge, Days since last visit, Last FLN score.
* **Buttons:** "Select for Today's Visit", "View School History", "Filter by Mandal/Cluster".
* **Validation:** Officer can only select schools within their assigned administrative boundary unless special surprise override authorized.

#### Screen 2: Classroom Monthly Coverage & Student Selection
* **Purpose:** The core student sampling screen that enforces unique monthly student assessment.
* **HUD Display:** Total Class Strength (30) | Assessed This Month (5) | Remaining Unassessed (25) | Monthly Coverage (16.7%).
* **Filter Tabs:** [Not Yet Assessed (25)] (Default) | [Already Assessed (5)] | [All Students (30)].
* **Buttons:** 
  - [🎲 Smart Random Select 5 Students] (Selects strictly from the Unassessed pool).
  - [Start Assessment (N selected)].
* **Card Attributes:** Roll Number, Student Name, AP PEN, Gender, Attendance %, Monthly Status Indicator (🟢 Assessed on 05/07 | ⚪ Not Assessed).
* **Business Rule:** Attempting to select an already assessed student triggers the Reassessment Modal requiring an authorized reason code.

#### Screen 3: Adaptive FLN Assessment Engine
* **Purpose:** Administer calibrated literacy and numeracy tasks with instant auto-scoring.
* **Fields:** Student Name, Class, Active Subject (Literacy / Numeracy), Question Card in Telugu & English, Radio Options, Audio Prompt / Timer indicator.
* **Buttons:** "Correct / Incorrect" quick evaluation buttons for oral reading; multiple-choice radio selectors for written arithmetic; "Next Question", "Previous", "Submit Assessment".`
  },
  {
    id: 'sec_j',
    code: 'J',
    title: 'Tour Diary Priority School Algorithm',
    category: 'Algorithms',
    content: `### Tour Diary Algorithm (School Priority Score Engine)

Field officers must not visit schools arbitrarily. The system dynamically computes a **School Priority Score ($SPS$)** ranging from 0 to 100 for every school at the beginning of each calendar month and updates it continuously after every completed visit.

#### Mathematical Formulation:
$$SPS = \\frac{w_1 \\cdot LG + w_2 \\cdot CG + w_3 \\cdot VG + w_4 \\cdot RG + w_5 \\cdot PI}{w_1 + w_2 + w_3 + w_4 + w_5}$$

Where:
1. **$LG$ (Learning Gap Factor):**
   $$LG = \\max(0, 100 - \\text{School Avg FLN Score})$$
   *(Weight $w_1 = 35$)*
2. **$CG$ (Monthly Coverage Gap Factor):**
   $$CG = \\max(0, 100 - \\text{Monthly Unique Coverage \\%})$$
   *(Weight $w_2 = 25$)*
3. **$VG$ (Visit Gap Factor):**
   $$VG = \\min\\left(100, \\frac{\\text{Target Visits per Month (2)} - \\text{Actual Visits This Month}}{\\text{Target Visits per Month (2)}} \\times 100\\right)$$
   *(Weight $w_3 = 20$)*
4. **$RG$ (Recency Gap Factor):**
   $$RG = \\min\\left(100, \\frac{\\text{Days Since Last Visit}}{45} \\times 100\\right)$$
   *(Weight $w_4 = 10$)*
5. **$PI$ (Pending Issues Factor):**
   $$PI = \\min(100, \\text{Pending Action Items Count} \\times 25)$$
   *(Weight $w_5 = 10$)*

#### Categorization Thresholds:
* **Critical Priority ($SPS \\ge 75$):** Mandatory visit within the next 5 working days. Dispatched to top of MEO/CRP tour diary.
* **High Priority ($60 \\le SPS < 75$):** Recommended visit within 10 days.
* **Medium Priority ($40 \\le SPS < 60$):** Standard monthly cycle.
* **Normal ($SPS < 40$):** High-performing school on track; quarterly maintenance monitoring.`
  },
  {
    id: 'sec_k',
    code: 'K',
    title: 'Repeat Visit and Monthly Student Selection Algorithm',
    category: 'Algorithms',
    content: `### Repeat Visit and Monthly Student Selection Algorithm

This is the central mathematical and operational safeguard preventing assessment fraud and student cherry-picking.

#### State Machine & Pseudocode:

\`\`\`typescript
function getEligibleStudentPool(schoolId, classNumber, section, monthYear) {
  // Step 1: Retrieve all active enrolled students
  const enrolledStudents = db.getStudents(schoolId, classNumber, section);
  
  // Step 2: Retrieve monthly assessment logs for this specific calendar month
  const monthlyLogs = db.getMonthlyStatus(schoolId, classNumber, section, monthYear);
  
  // Step 3: Partition into unassessed and assessed pools
  const assessedStudentIds = new Set(
    monthlyLogs.filter(log => log.isAssessedThisMonth === true).map(log => log.studentId)
  );
  
  const unassessedPool = enrolledStudents.filter(stu => !assessedStudentIds.has(stu.id));
  const assessedPool = enrolledStudents.filter(stu => assessedStudentIds.has(stu.id));
  
  return {
    totalEnrolled: enrolledStudents.length,
    assessedCount: assessedPool.length,
    unassessedCount: unassessedPool.length,
    monthlyCoveragePercent: (assessedPool.length / enrolledStudents.length) * 100,
    unassessedPool,
    assessedPool
  };
}

function selectRandomStudents(unassessedPool, targetCount = 5) {
  // If remaining unassessed pool is <= target, select all remaining unassessed
  if (unassessedPool.length <= targetCount) {
    return unassessedPool;
  }
  // Cryptographically sound unbiased Fisher-Yates shuffle
  const pool = [...unassessedPool];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, targetCount);
}

function handleAbsentStudent(absentStudentId, selectedList, unassessedPool) {
  // Mark attendance record as absent
  db.recordAttendance(absentStudentId, 'ABSENT');
  
  // Do NOT mark student as assessed for the month!
  // Remove from active assessment selection
  const remainingSelected = selectedList.filter(s => s.id !== absentStudentId);
  
  // Replenish from remaining unassessed pool
  const candidatePool = unassessedPool.filter(
    s => s.id !== absentStudentId && !remainingSelected.some(r => r.id === s.id)
  );
  
  if (candidatePool.length > 0) {
    const replacement = candidatePool[Math.floor(Math.random() * candidatePool.length)];
    remainingSelected.push(replacement);
  }
  return remainingSelected;
}
\`\`\`

#### Repeat Visit Walkthrough:
* **Visit 1 (July 5):** 30 students in Class 3-A. Assesses 5 unassessed students (Rolls 1–5). Assessed: 5 | Remaining: 25 | Coverage: 16.7%.
* **Visit 2 (July 14):** System presents ONLY Rolls 6–30 under "Not Yet Assessed". Officer taps Random Select; Rolls 6–10 chosen. Assessed: 10 | Remaining: 20 | Coverage: 33.3%.
* **Visit 3 (July 22):** Rolls 11–15 chosen. Assessed: 15 | Remaining: 15 | Coverage: 50.0%.
* **Monthly Reset (August 1, 00:00):** System resets \`isAssessedThisMonth = false\` for all students. Historical July records remain immutable in database.`
  },
  {
    id: 'sec_l',
    code: 'L',
    title: 'FLN Assessment Engine',
    category: 'Algorithms',
    content: `### FLN Assessment Engine (Adaptive Diagnostic Model)

The assessment engine administers bilingual (Telugu/English) diagnostic items mapped directly to official NIPUN Bharat Lakshyas.

#### Competency Strands:
1. **Foundational Literacy (FL):**
   - Letter & Sound Recognition (అక్షర గుర్తింపు & ధ్వని)
   - Word Decoding & Fluency (పద పఠనం & ధారాళత) - Target: 30–35 wpm for Class 3
   - Sentence Reading with Comprehension (వాక్యార్థ గ్రహణం)
   - Paragraph Comprehension & Inference (పేరాగ్రాఫ్ అవగాహన)
2. **Foundational Numeracy (FN):**
   - Number Identification & Place Value (సంఖ్యల గుర్తింపు & స్థాన విలువ) - Up to 999 for Class 3
   - Addition & Subtraction with Regrouping (దశకంతో కూడికలు & తీసివేతలు)
   - Basic Multiplication & Tables (ప్రాథమిక గుణకారం & ఎక్కాలు)
   - Real-World Word Problems (నిత్యజీవిత గణిత సమస్యలు)

#### Adaptive Item Selection Engine:
* Each assessment session begins at **Moderate** difficulty.
* If response is **Correct**, system advances to next item at **Difficult** tier.
* If response is **Incorrect**, system presents a diagnostic item at **Easy** tier to pinpoint root conceptual misconceptions.
* Total raw score is normalized to a percentage (0–100%) and categorized into performance bands.`
  },
  {
    id: 'sec_m',
    code: 'M',
    title: 'Monthly Assessment Coverage Model',
    category: 'Architecture',
    content: `### Monthly Assessment Coverage Model

#### Critical Architectural Separation:
The data model strictly isolates three distinct operational concepts:

1. **Assessment Event (\`AssessmentRecord\`):** An immutable, time-stamped transaction recording a single test administered to a student by an officer during a specific visit.
2. **Monthly Unique Assessment Status (\`MonthlyAssessmentStatus\`):** A state entity keyed by \`(schoolId, classId, section, studentId, monthYear)\` recording whether the student has been tested at least once during that calendar month.
3. **Historical Longitudinal Portfolio:** Longitudinal performance trajectory across months (June 2026 through March 2029).

#### Core Formulations:
$$\\text{Monthly Unique Coverage \\%} = \\frac{\\text{Count of Unique Students Assessed in Month}}{\\text{Total Active Enrolled Students in Class/School}} \\times 100$$

$$\\text{Assessment Repetition Rate} = \\frac{\\text{Total Raw Assessment Events} - \\text{Unique Students Assessed}}{\\text{Total Raw Assessment Events}} \\times 100$$

*A healthy system maintains an Assessment Repetition Rate $\\le 5\\%$, proving field officers are maximizing student coverage rather than re-testing familiar students.*`
  },
  {
    id: 'sec_n',
    code: 'N',
    title: 'Dashboard KPIs',
    category: 'Specifications',
    content: `### Dashboard Key Performance Indicators (KPIs)

| KPI Name | Technical Definition | Formula | Aggregation Level | Refresh Cadence |
|---|---|---|---|---|
| **Visit Target Achievement %** | Percentage of planned monthly officer visit days completed | $\\frac{\\text{Actual Visits Completed}}{\\text{Target Visit Days}} \\times 100$ | Officer, Mandal, District, State | Near Real-Time (5 min) |
| **Visit Gap** | Deficit in officer visit days | $\\max(0, \\text{Target Visits} - \\text{Actual Visits})$ | Officer, Mandal, District | Daily |
| **Unique Student Coverage %** | Proportion of enrolled students assessed at least once in month | $\\frac{\\text{Unique Students Assessed}}{\\text{Total Enrolled Students}} \\times 100$ | Class, School, Mandal, District, State | Real-Time |
| **Average FLN Score** | Combined mean score across Literacy and Numeracy sub-tests | $\\frac{\\text{Literacy Score} + \\text{Numeracy Score}}{2}$ | School, Mandal, District, State | Real-Time |
| **Critical Schools Count** | Count of schools with Priority Score $\\ge 75$ | $\\sum [SPS \\ge 75]$ | Mandal, District, State | Daily 00:00 batch |
| **Action Resolution %** | Proportion of identified learning/TLM issues resolved | $\\frac{\\text{Actions Resolved}}{\\text{Total Actions Logged}} \\times 100$ | School, Mandal, District | Daily |`
  },
  {
    id: 'sec_o',
    code: 'O',
    title: 'Alerts and Notifications',
    category: 'Specifications',
    content: `### Alerts and Notifications Engine

The alert engine continuously scans transactions against pre-configured triggers:

1. **Officer Target Lag Alert:** Fired on the 20th of the month if officer visit achievement is below 50%. *Recipient: Officer & Immediate Supervisor (DEO for MEO; MEO for CRP).*
2. **Critical Learning Lag Alert:** Fired when a school's average FLN score drops below 40% across two consecutive monitoring rounds. *Recipient: HM, MEO, District Academic Monitoring Cell.*
3. **Zero Coverage Warning:** Fired on the 15th of the month if an entire classroom has 0% student coverage. *Recipient: CRP and MEO.*
4. **Action Item Overdue Alert:** Fired when a target resolution date passes without closure remarks. *Recipient: Assigned Teacher and HM.*
5. **Anti-Gaming Suspicion Alert:** Triggered when an officer records $>15$ student assessments in under 20 minutes or records impossible travel between distant schools.`
  },
  {
    id: 'sec_p',
    code: 'P',
    title: 'Follow-up and Action Module',
    category: 'Specifications',
    content: `### Follow-up and Action Module

Data collection without corrective intervention is prohibited. Whenever an assessment reveals systemic learning gaps (e.g., $\\ge 50\\%$ of tested students failing 2-digit regrouping) or classroom deficiencies, the app prompts creation of an **Action Item**.

#### Issue Lifecycle:
1. **Created (Open):** Logged during school check-out. Contains issue title, competency area, assigned teacher/HM, and target resolution date (default 14 days).
2. **Assigned / In Progress:** Teacher/HM receives notification; acknowledges receipt; initiates remedial pedagogical drills using NIPUN teaching-learning materials (TLM).
3. **Resolved:** School uploads verification evidence (photo of remedial workbook exercises, attendance of remedial hour).
4. **Verified & Closed:** Officer conducts a follow-up visit, verifies student competency, and officially closes the ticket.`
  },
  {
    id: 'sec_q',
    code: 'Q',
    title: 'Reports and Analytics',
    category: 'Specifications',
    content: `### Reports and Analytics

The web MIS provides scheduled and on-demand downloadable exports in **Excel (.xlsx), CSV, and PDF**:

1. **Statewide Monthly FLN Progress Summary:** District-wise rollups of targets, achievements, unique coverage, and competency mastery.
2. **Monthly Unique Student Coverage Audit Report:** School and class-level roster showing enrolled, assessed, unassessed, and coverage %.
3. **Officer Target vs Achievement Ledger:** Individual officer scorecard tracking planned visit days, completed days, visit gap, and total students assessed.
4. **School Priority & Risk Registry:** Ranked list of Critical and High-Priority schools with score breakdown and pending actions.
5. **Competency Gap Matrix:** Granular diagnostic breakdown by NIPUN Lakshya sub-competencies across grades 1 to 5.`
  },
  {
    id: 'sec_r',
    code: 'R',
    title: 'Data Model & Schemas',
    category: 'Architecture',
    content: `### Data Model & Schemas

\`\`\`sql
-- Core Entities
TABLE districts (
  id VARCHAR(32) PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  total_schools INT DEFAULT 0
);

TABLE mandals (
  id VARCHAR(32) PRIMARY KEY,
  district_id VARCHAR(32) REFERENCES districts(id),
  name VARCHAR(100) NOT NULL
);

TABLE schools (
  id VARCHAR(32) PRIMARY KEY,
  udise_code VARCHAR(11) UNIQUE NOT NULL,
  name VARCHAR(200) NOT NULL,
  mandal_id VARCHAR(32) REFERENCES mandals(id),
  category VARCHAR(50),
  total_students INT,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6)
);

TABLE students (
  id VARCHAR(32) PRIMARY KEY,
  pen VARCHAR(20) UNIQUE NOT NULL, -- AP Child ID / PEN
  school_id VARCHAR(32) REFERENCES schools(id),
  class_number INT CHECK (class_number BETWEEN 1 AND 5),
  section VARCHAR(2) DEFAULT 'A',
  name VARCHAR(100) NOT NULL,
  name_telugu VARCHAR(100),
  gender CHAR(1),
  attendance_percent DECIMAL(5,2)
);

-- Crucial Monthly State Entity
TABLE monthly_student_assessment_status (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(32) REFERENCES students(id),
  school_id VARCHAR(32) REFERENCES schools(id),
  class_number INT,
  section VARCHAR(2),
  month_year VARCHAR(7), -- e.g. '2026-07'
  is_assessed_this_month BOOLEAN DEFAULT FALSE,
  assessment_count INT DEFAULT 0,
  last_assessed_date DATE,
  last_assessor_id VARCHAR(32),
  literacy_score DECIMAL(5,2),
  numeracy_score DECIMAL(5,2),
  fln_score DECIMAL(5,2),
  performance_band VARCHAR(20),
  CONSTRAINT uq_student_month UNIQUE(student_id, month_year)
);

TABLE visits (
  id VARCHAR(32) PRIMARY KEY,
  school_id VARCHAR(32) REFERENCES schools(id),
  officer_id VARCHAR(32) NOT NULL,
  visit_date DATE NOT NULL,
  visit_type VARCHAR(20),
  check_in_time TIMESTAMP,
  check_out_time TIMESTAMP,
  gps_latitude DECIMAL(9,6),
  gps_longitude DECIMAL(9,6),
  students_assessed_count INT DEFAULT 0,
  observations TEXT
);

TABLE assessment_records (
  id VARCHAR(32) PRIMARY KEY,
  visit_id VARCHAR(32) REFERENCES visits(id),
  student_id VARCHAR(32) REFERENCES students(id),
  school_id VARCHAR(32) REFERENCES schools(id),
  assessment_date DATE NOT NULL,
  month_year VARCHAR(7) NOT NULL,
  is_reassessment BOOLEAN DEFAULT FALSE,
  reassessment_reason TEXT,
  literacy_score DECIMAL(5,2),
  numeracy_score DECIMAL(5,2),
  total_score_percent DECIMAL(5,2),
  performance_band VARCHAR(20)
);
\`\`\``
  },
  {
    id: 'sec_s',
    code: 'S',
    title: 'API Architecture',
    category: 'Architecture',
    content: `### API Architecture

RESTful JSON APIs secured via OAuth2.0 / JWT with HMAC request signatures:

1. \`GET /api/v1/tour-diary/recommendations\`
   - *Query Params:* \`month=2026-07&officerId=USR_CRP_01\`
   - *Response:* Ranked array of schools with Priority Scores, reasons, and historical FLN metrics.
2. \`GET /api/v1/schools/{schoolId}/classes/{classId}/monthly-coverage\`
   - *Query Params:* \`month=2026-07\`
   - *Response:* Total enrolled, assessed count, unassessed student list, coverage percentage.
3. \`POST /api/v1/visits/check-in\`
   - *Payload:* \`{ schoolId, officerId, latitude, longitude, timestamp, visitType }\`
   - *Response:* Geofence validation status, active visit session token, pending action items.
4. \`POST /api/v1/assessments/submit-batch\`
   - *Payload:* Batch array of student test responses with question IDs, timings, and computed scores.
   - *Response:* Confirmation, updated monthly coverage stats, generated teacher alerts.
5. \`POST /api/v1/sync/offline-push\`
   - *Payload:* Queued offline visits, attendance marks, and assessment events with client timestamps.
   - *Response:* Conflict resolution receipts and synced server IDs.`
  },
  {
    id: 'sec_t',
    code: 'T',
    title: 'Technical Architecture',
    category: 'Architecture',
    content: `### Technical Architecture

* **Client Layer:**
  - Progressive Web App (PWA) & Native Android shell using React 19 + TypeScript + Tailwind CSS.
  - Client-side storage: Encrypted IndexedDB via Dexie.js for offline persistence.
* **API Gateway & Microservices:**
  - Node.js / Express microservices with rate limiting, geo-spatial query caching (Redis), and JWT authentication.
* **Database & Analytics:**
  - Primary OLTP: PostgreSQL with PostGIS extensions for spatial geofencing and UDISE coordinates.
  - Analytics & Warehousing: ClickHouse / BigQuery for instantaneous statewide aggregations across 35+ lakh student records.
* **Message Queue & Notifications:**
  - Apache Kafka / RabbitMQ for decoupled event processing (assessment submitted → triggers aggregation worker → triggers SMS/push service).`
  },
  {
    id: 'sec_u',
    code: 'U',
    title: 'Offline Architecture & Sync',
    category: 'Architecture',
    content: `### Offline Architecture & Synchronization

Given rural terrain connectivity challenges, the mobile client implements an **Offline-First** model:

1. **Pre-caching:** When connected to Wi-Fi/GSM, the app downloads master data for the officer's jurisdiction (assigned schools, enrolled student rosters, monthly status cache, question bank).
2. **Local Transactions:** All check-ins, student selections, attendance marks, and test records are written to encrypted local IndexedDB with UUID primary keys and local timestamps.
3. **Sync Queue:** Outbox queue manages pending transactions.
4. **Deterministic Conflict Resolution (LWW with Idempotency):**
   - If two assessors test the same student offline during the same month, the server accepts the first recorded timestamp as the primary monthly assessment event and converts the second into an audited reassessment event.
5. **Sync HUD:** Visual badge indicates *🟢 Synced*, *🟡 Pending Sync (N)*, or *🔴 Sync Failed*.`
  },
  {
    id: 'sec_v',
    code: 'V',
    title: 'Security and Privacy',
    category: 'Governance',
    content: `### Security and Privacy Controls

1. **Personally Identifiable Information (PII) Protection:** Student PEN, names, and academic records are stored encrypted at rest (AES-256) and transmitted via TLS 1.3.
2. **Access Control & Anonymization:** State and District dashboards display aggregated statistical indicators without exposing individual student identifiable tags to unauthorized viewers.
3. **Audit Trails:** Immutable audit logging for all critical state changes:
   - Reassessments with recorded mandatory justification codes.
   - GPS coordinate capture with mock-location / fake-GPS detection.
   - Administrative rule overrides.`
  },
  {
    id: 'sec_w',
    code: 'W',
    title: 'Data Quality and Anti-Gaming',
    category: 'Governance',
    content: `### Data Quality and Anti-Gaming Engine

To maintain academic integrity and prevent administrative manipulation, automated anomaly detection algorithms flag suspicious patterns:

1. **Impossible Velocity Alert:** Officer checks in at School A, and checks in at School B 30 km away within 15 minutes.
2. **Speed-Run Assessment Detection:** 5 students recorded as assessed in under 4 minutes ($<48$ seconds per child). Flagged for supervisor review.
3. **Identical Answer Anomaly:** 10 consecutive students recorded with identical string of correct/incorrect answer choices across all question IDs.
4. **Favorite Student Anomaly:** Repeated selection of the same 5 students across multiple visits despite unassessed children being present.`
  },
  {
    id: 'sec_x',
    code: 'X',
    title: 'State Dashboard Wireframe',
    category: 'Specifications',
    content: `### State Dashboard Wireframe (ASCII Layout)

\`\`\`
+--------------------------------------------------------------------------------------------------+
| AP SCHOOL EDUCATION DEPT | FLN STATE DASHBOARD (2026–2029)                 Role: State Leadership |
+--------------------------------------------------------------------------------------------------+
| Month: [July 2026 v] | Academic Year: [2026-2027 v] | District: [All 28 Districts v] | [Export CSV] |
+--------------------------------------------------------------------------------------------------+
| [ KPI CARDS ]                                                                                    |
| TOTAL SCHOOLS    VISIT ACHIEVEMENT %   UNIQUE COVERAGE %   AVG FLN SCORE     CRITICAL SCHOOLS    |
| 45,280           86.4% (38,200/44,200) 64.2% (1.82M/2.84M) 68.4% (Proficient) 412 (High Lag)     |
+--------------------------------------------------------------------------------------------------+
| [ EXECUTIVE INSIGHTS ]                                                                           |
| * Guntur & NTR districts leading statewide with 72%+ FLN proficiency.                            |
| * Kurnool & Ananthapuramu show critical numeracy deficits in Class 2 & 3 subtraction regrouping. |
| * 18% of Class 1 students statewide remain unassessed for July; CRP re-allocation advised.       |
+--------------------------------------------------------------------------------------------------+
| [ DISTRICT PERFORMANCE & LEADERBOARD ]                            | [ FLN COMPETENCY RADAR ]     |
| District      Schools  Visits%  Unique Cov%  Literacy  Numeracy   | 1. Letter Recognition: 88%   |
| Visakhapatnam 1,950    88.9%    66.7%        74.5%     72.1%      | 2. Word Decoding: 74%        |
| NTR           1,520    91.0%    74.1%        73.2%     71.0%      | 3. Passage Fluency: 62%      |
| Guntur        1,840    84.0%    64.0%        68.4%     64.8%      | 4. 2-Digit Regrouping: 48%   |
| Kurnool       2,180    75.7%    48.0%        59.2%     56.4%      | 5. Word Problems: 52%        |
+--------------------------------------------------------------------------------------------------+
\`\`\``
  },
  {
    id: 'sec_y',
    code: 'Y',
    title: 'Mobile App Wireframes (10 Core Screens)',
    category: 'Specifications',
    content: `### Mobile App Wireframes (10 Core Screens)

#### 1. Home / Cockpit Screen
\`\`\`
+------------------------------+
| AP FLN Field App    [Online] |
| Officer: Sri S. Venkat (CRP) |
+------------------------------+
| MONTHLY TARGET (JULY 2026)   |
| Visits: 18 / 30 [======--] 60%|
| Students: 90 / 150 Assessed  |
+------------------------------+
| [ START TODAY'S VISIT ]      |
| [ VIEW TOUR DIARY ]          |
| [ ACTION ITEMS (2 PENDING) ] |
+------------------------------+
\`\`\`

#### 2. Tour Diary Screen
\`\`\`
+------------------------------+
| Recommended Priority Schools |
+------------------------------+
| [!] MPPS Chinakakani West    |
| Score: 84.2 - CRITICAL       |
| Reason: 0 visits this month  |
| [ Select & Route GPS ]       |
+------------------------------+
| [*] MPPS Kaza Main           |
| Score: 68.5 - HIGH PRIORITY  |
| Reason: Low Class 3 Numeracy |
| [ Select & Route GPS ]       |
+------------------------------+
\`\`\`

#### 3. School Visit & Geofence Check-In
\`\`\`
+------------------------------+
| School: MPPS Kaza Main       |
| UDISE: 28172000501           |
| GPS: 16.4385, 80.5621 [VERIFIED]|
+------------------------------+
| Visit Type: [Routine Visit v]|
| Previous Issues: 2 Pending   |
| [ CHECK IN TO SCHOOL ]       |
+------------------------------+
\`\`\`

#### 4. Class Selection Screen
\`\`\`
+------------------------------+
| Select Classroom to Monitor  |
+------------------------------+
| [ Class 1 ] Coverage: 40.0%  |
| [ Class 2 ] Coverage: 28.5%  |
| [> Class 3 <] Coverage: 16.7%|
| [ Class 4 ] Coverage: 35.0%  |
| [ Class 5 ] Coverage: 50.0%  |
+------------------------------+
\`\`\`

#### 5. Monthly Student Coverage HUD
\`\`\`
+------------------------------+
| Class 3 - Section A          |
| Strength: 30 Enrolled        |
| Assessed: 5 | Remaining: 25  |
| Monthly Coverage: 16.7%      |
+------------------------------+
| [🎲 Random Select 5 Unassessed]
| Minimum Required: 5 Students |
+------------------------------+
\`\`\`

#### 6. Student Selection Matrix
\`\`\`
+------------------------------+
| [Not Assessed (25)] [Done(5)]|
+------------------------------+
| [X] Roll 6: K. Ananya (95%)  |
| [X] Roll 7: M. Charan (89%)  |
| [ ] Roll 8: N. Bhavani [ABS] |
| [X] Roll 9: P. Rohit (91%)   |
| [X] Roll 10: R. Siri (97%)   |
| [X] Roll 11: S. Tarun (86%)  |
| [ PROCEED TO ASSESSMENT (5) ]|
+------------------------------+
\`\`\`

#### 7. FLN Assessment Screen
\`\`\`
+------------------------------+
| Assessing: K. Ananya (Roll 6)|
| Subject: Foundational Literacy|
+------------------------------+
| Q2. చదవండి: "పుస్తకం"        |
| (Reads word accurately?)     |
| [ (A) పుస్తకం ]  [ (B) పలక ] |
| [ (C) పువ్వు ]   [ (D) పెన్సిల్]
| [ Correct (10) ] [ Incorrect ]
+------------------------------+
\`\`\`

#### 8. Assessment Submission Screen
\`\`\`
+------------------------------+
| Assessment Summary (5 Stus)  |
| Class 3-A FLN Score: 68.0%   |
| 3 Proficient | 2 Developing  |
+------------------------------+
| [ SUBMIT & NOTIFY HM/TEACHER ]|
+------------------------------+
\`\`\`

#### 9. Visit Completion Screen
\`\`\`
+------------------------------+
| Visit Summary - MPPS Kaza    |
| Check-in: 09:45 AM           |
| Check-out: 11:15 AM          |
| Students Assessed: 5 Unique  |
| Action Logged: Math Kit TLM  |
| [ COMPLETE VISIT & SIGN OFF ]|
+------------------------------+
\`\`\`

#### 10. Notifications Screen
\`\`\`
+------------------------------+
| In-App Notifications         |
+------------------------------+
| [HM Alert] Class 3-A assessed|
| 2 students require numeracy  |
| regrouping remedial support. |
| [MEO Alert] Visit verified.  |
+------------------------------+
\`\`\``
  },
  {
    id: 'sec_z',
    code: 'Z',
    title: 'Sample End-to-End Visit',
    category: 'Specifications',
    content: `### Sample End-to-End Visit Walkthrough

1. **Tour Diary Recommendation:** Sri S. Venkat (CRP, Kaza Cluster) opens the mobile app at 08:30 AM. The Tour Diary recommends *MPPS Kaza Main* ($SPS = 68.5$) due to low numeracy scores and only 16.7% Class 3 coverage.
2. **On-Site Check-In:** At 09:45 AM, Sri Venkat arrives at MPPS Kaza. Clicks Check-In. App validates GPS coordinates (within 50 meters of UDISE lat/long 16.4385, 80.5621). Visit Type selected: **Routine Visit**.
3. **Classroom Selection:** Officer chooses **Class 3, Section A**. HUD displays: *Total: 30 | Assessed in July: 5 | Remaining: 25 | Coverage: 16.7%*.
4. **Intelligent Random Student Sampling:** Officer taps **"Random Select 5 Students"**. System samples from the 25 unassessed children:
   - Student 1: K. Ananya (Roll 6) - Present
   - Student 2: M. Charan (Roll 7) - Present
   - Student 3: N. Bhavani (Roll 8) - Teacher indicates absent today. Officer toggles "Absent". Status preserved, student not marked assessed. System automatically draws S. Tarun (Roll 11) from unassessed pool.
   - Student 4: P. Rohit Kumar (Roll 9) - Present
   - Student 5: R. Siri Chandana (Roll 10) - Present
5. **Administering Assessment:**
   - Literacy: Word reading ("పుస్తకం") and sentence comprehension. 4 out of 5 pass proficiently.
   - Numeracy: 3-digit place value (456) and 2-digit addition with carryover (54 + 28). 2 students struggle with the carryover concept.
6. **Submission & Instant State Mutation:**
   - Records saved with cryptographic hash.
   - Monthly Class 3-A Coverage updates from 16.7% (5/30) to **33.3% (10/30)**.
   - HM Smt. Padmavathi and SGT Sri Ramesh receive in-app alert: *"Class 3-A: 5 students assessed. 2 students need carryover addition support."*
7. **Action Item Logging & Check-out:**
   - Officer logs Action Item: *"Daily 15-minute peer abacus math drill for Class 3-A"*.
   - Officer checks out at 11:15 AM. Visit saved to audit log.`
  },
  {
    id: 'sec_aa',
    code: 'AA',
    title: 'Sample Repeat Visit Simulation',
    category: 'Specifications',
    content: `### Sample Repeat Visit Simulation (Multi-Visit Coverage Accumulation)

To prove how the system eliminates selection bias and maximizes coverage across an entire calendar month:

#### Chronology of July 2026:
* **Initial State (July 1):** Class 3-A has 30 students. Assessed: 0/30 (0.0%).
* **Visit 1 (July 5, by CRP):**
  - Assesses Rolls 1 to 5.
  - July Status: Rolls 1–5 marked \`isAssessedThisMonth = true\`.
  - Class Coverage: **5 / 30 (16.7%)**.
* **Visit 2 (July 14, by MEO Sri Lakshmi Narayana):**
  - MEO visits same school and selects Class 3-A.
  - The app displays 25 unassessed students (Rolls 6 to 30). Rolls 1 to 5 are separated under the "Already Assessed This Month" tab.
  - MEO clicks "Random Select 5". App selects Rolls 6, 7, 9, 10, 11 (Roll 8 absent).
  - Assessment completed.
  - Class Coverage increases to: **10 / 30 (33.3%)**.
* **Visit 3 (July 24, by Dy. DEO Smt. Annapurna):**
  - Dy. DEO visits same school.
  - App displays remaining 20 unassessed students (Rolls 8, 12 to 30).
  - Assesses Rolls 12 to 16.
  - Class Coverage increases to: **15 / 30 (50.0%)**.
* **Total Unique Students Assessed in July:** 15. Raw Assessment Events: 15. Duplication: 0.

#### Monthly Reset (August 1, 00:00:00 IST):
* Automated batch job triggers monthly reset.
* For Class 3-A, all 30 students become eligible again for August 2026 monitoring.
* July historical records remain permanently archived for longitudinal learning trajectory analysis.`
  },
  {
    id: 'sec_ab',
    code: 'AB',
    title: 'MVP / Phase 2 / Phase 3 Release Scope',
    category: 'Architecture',
    content: `### Release Phases (MVP vs Phase 2 vs Phase 3)

| Capability | Phase 1 (MVP - Launch Month 1–3) | Phase 2 (Months 4–9) | Phase 3 (Statewide Maturation Months 10–36) |
|---|---|---|---|
| **Platform** | Responsive PWA + Web MIS | Native Android APK + PWA | iOS + Native Offline Engine |
| **School Prioritization** | Standard 5-Factor Weighted Score | Dynamic Route Optimization & Map Dispatch | Machine Learning Predictive Dropout & Lag Alert |
| **Assessment Engine** | 3-tier Adaptive (Easy/Mod/Diff) | Voice Recognition Oral Reading Fluency (AI Speech) | Automated Handwriting OCR Assessment |
| **Geofencing** | Standard GPS distance check (200m) | Beacon / Wi-Fi BSSID validation | Satellite imagery campus boundary validation |
| **Language Support** | Telugu & English | Telugu, English, Urdu, Odia | Full Multilingual Tribal Dialects |
| **Reporting** | Excel/CSV Exports + Core MIS | Scheduled Automated PDF Email Dispatch | Direct Integration with CM's Core Dashboard API |`
  },
  {
    id: 'sec_ac',
    code: 'AC',
    title: 'Implementation Roadmap (2026–2029)',
    category: 'Governance',
    content: `### Implementation Roadmap (2026–2029)

* **Phase I: Pilot & Foundation (Q3 2026 - Q4 2026)**
  - Deploy core PWA and Web MIS across 2 pilot districts (Guntur and Visakhapatnam).
  - Train 500 CRPs and 100 MEOs on digital tour diary and student sampling.
  - Calibrate question bank against State SCERT FLN baseline data.
* **Phase II: Statewide Rollout (Q1 2027 - Q2 2027)**
  - Scale system across all 28 districts of Andhra Pradesh (45,000+ schools).
  - Integrate with Department Child Info / PEN student registry.
  - Enforce mandatory monthly officer visit targets and executive command center.
* **Phase III: Remediation Loop & Predictive Analytics (Q3 2027 - Q4 2028)**
  - Automated remedial TLM recommendation engine pushed to teacher tablets.
  - Longitudinal cohort tracking (following Class 1 students through Class 3).
* **Phase IV: State Endline & Sustained Institutionalization (2029)**
  - Comprehensive programme endline evaluation measuring 2026–2029 net learning gains.`
  },
  {
    id: 'sec_ad',
    code: 'AD',
    title: 'Risks and Mitigation Matrix',
    category: 'Governance',
    content: `### Risks and Mitigation Matrix

| Risk Domain | Identified Risk | Impact | Mitigation Strategy |
|---|---|---|---|
| **Connectivity** | Intermittent or absent cellular service in Agency / hilly tribal mandals | Field staff unable to record assessments | Offline-first architecture; local SQLite/IndexedDB caching; background auto-sync upon reconnection |
| **Data Gaming** | Field officers faking GPS locations or conducting 30-second mock assessments | Invalid baseline & false compliance | Hardware-level mock location detection; minimum dwell time enforcement (15 min); velocity anomaly flags |
| **Teacher Resistance** | Teachers viewing monitoring visits as punitive inspection rather than support | Reluctance to cooperate with field officers | In-app messaging reframing data as diagnostic support; instant remedial action tips rather than disciplinary notes |
| **Student Roster Churn** | Mid-year student migration or transfers between schools | Mismatched student enrollment lists | Bi-weekly API sync with state UDISE+ / Child Info Master Database |
| **Battery Drain** | Continuous GPS tracking depleting officer phone battery during rural travel | Incomplete visit logs | Geofence checked only upon explicit check-in/out button press; no continuous background location polling |`
  },
  {
    id: 'sec_ae',
    code: 'AE',
    title: 'Open Decisions & Items for Department Confirmation',
    category: 'Governance',
    content: `### Open Decisions & Departmental Confirmations

The following items are designed with configurable modularity and must be formally ratified by the Andhra Pradesh School Education Department / SCERT Directorate:

1. **Official NIPUN Lakshya Benchmark Thresholds:** Exact words per minute (wpm) thresholds for Telugu and English fluent reading (currently set to 30–35 wpm for Class 3 as per standard NIPUN guidelines).
   - *Status: Configurable in Admin Module; requires formal SCERT circular confirmation.*
2. **Reassessment Policy:** Whether an officer is permitted to re-assess a student who was already tested within the same calendar month under special supervisor authorization.
   - *Status: Implemented with mandatory justification code & separate audit log.*
3. **Monthly Visit Target Customization:** Departmental approval for field quotas (DEO: 10, Dy. DEO: 15, MEO: 20, CRP: 30 days/month).
   - *Status: Fully dynamic in Administration Config panel.*
4. **Geofencing Buffer Radius:** Permissible distance from official school coordinates (currently set to 200 meters).
5. **SSO / Department Credential Integration:** Protocol for linking with state Vidya Samiksha Kendra (VSK) authentication gateway.`
  }
];
