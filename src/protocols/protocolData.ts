import { ProtocolSection } from '../types';

/**
 * Approved Public-Health Protocols Corpus
 * Sourced strictly from:
 * 1. National Health Mission (NHM), MoHFW, Govt of India
 * 2. Operational Guidelines for Maternal & Newborn Health (Rev 2023)
 * 3. Universal Immunization Programme (UIP) Guidelines
 * 4. Home Based Newborn Care (HBNC) Operational Manual
 * 5. Facility & Community Management of Severe Acute Malnutrition
 * 6. National Programme for Prevention and Control of NCDs (NP-NCD)
 * 7. Integrated Management of Neonatal & Childhood Illness (IMNCI)
 */

export const APPROVED_PROTOCOLS: ProtocolSection[] = [
  // 1. ANC SCHEDULES & CARE
  {
    id: 'ANC-SEC-01',
    protocolId: 'NHM-ANC-2023',
    documentTitle: 'NHM Guidelines for Antenatal Care and Skilled Attendance at Birth',
    version: 'Version 4.2 (2023)',
    approvedBy: 'Maternal Health Division, MoHFW, Government of India',
    category: 'Antenatal Care',
    sectionHeading: 'Section 2.1: Schedule of 4 Mandatory Antenatal Checkups',
    pageNumber: 14,
    keywords: ['anc', 'antenatal', 'checkup', 'trimester', 'visits', 'services', 'due', 'schedule'],
    summary: 'Every pregnant woman must receive a minimum of four comprehensive antenatal checkups starting from the first trimester.',
    content: `A minimum of four Antenatal Care (ANC) visits are mandatory under NHM guidelines:
1. ANC 1st Visit: Registration within 12 weeks of pregnancy (first trimester). Confirmation of pregnancy, MCP card issuance, baseline BP, weight, Hb testing, urine albumin/sugar, and first dose of Tetanus & Adult Diphtheria (Td-1) toxoid.
2. ANC 2nd Visit: Between 14 and 26 weeks (second trimester). Abdominal examination for fundal height, fetal heart sound (FHS), repeat BP, weight gain tracking, screening for gestational diabetes, and Td-2 dose (4 weeks after Td-1).
3. ANC 3rd Visit: Between 28 and 34 weeks (third trimester). Screening for pre-eclampsia, severe anemia, fetal lie and presentation, multiple pregnancy, and birth preparedness planning.
4. ANC 4th Visit: Between 36 weeks and term (delivery). Assessment of fetal maturity, engagement, review of danger signs, confirmation of institutional delivery center, and 108/102 ambulance helpline number orientation.
Prophylaxis: 180 tablets of Iron & Folic Acid (IFA - 60mg elemental iron + 500mcg folic acid) starting from 14th week, plus Calcium 500mg BD.`,
    allowedActions: [
      'Register pregnancy and issue Mother-Child Protection (MCP) card',
      'Distribute IFA and Calcium tablets as per gestational age',
      'Measure blood pressure and record on MCP card',
      'Counsel on nutrition, birth preparedness, and institutional delivery incentives (JSY/PMMVY)'
    ],
    escalationThreshold: 'BP >= 140/90 mmHg, severe pallor, swelling of hands/face, or decreased fetal movements requires non-emergency referral to Medical Officer within 24 hours.'
  },
  {
    id: 'ANC-SEC-02',
    protocolId: 'NHM-ANC-2023',
    documentTitle: 'NHM Guidelines for Antenatal Care and Skilled Attendance at Birth',
    version: 'Version 4.2 (2023)',
    approvedBy: 'Maternal Health Division, MoHFW, Government of India',
    category: 'Antenatal Care',
    sectionHeading: 'Section 3.4: Nutritional Supplementation and Deworming in Pregnancy',
    pageNumber: 22,
    keywords: ['ifa', 'iron', 'calcium', 'deworming', 'albendazole', 'folic acid', 'nutrition'],
    summary: 'Guidance on routine prophylactic iron, folic acid, calcium, and second-trimester deworming.',
    content: `Nutritional Interventions for Pregnant Women:
- First Trimester (up to 12 weeks): Folic acid 400 mcg daily to prevent neural tube defects.
- Second & Third Trimesters (from 14 weeks onward): One IFA tablet daily (Red tablet: 60 mg elemental iron + 500 mcg folic acid) for minimum 180 days.
- Calcium Supplementation: Two tablets of Calcium (each 500 mg elemental calcium + 250 IU Vit D3) daily starting at 14 weeks. Do NOT take Calcium and Iron simultaneously; maintain a 2-hour gap.
- Deworming: Single dose of Albendazole 400 mg chewable tablet once during the second trimester (after 14 weeks).
- Diet: Counsel for one extra meal daily, inclusion of green leafy vegetables, pulses, dairy, and seasonal fruits.`,
    allowedActions: [
      'Dispense IFA and Calcium supplies',
      'Provide Albendazole 400mg during second trimester',
      'Advise dietary diversification and timing of iron/calcium intake'
    ],
    escalationThreshold: 'Severe anemia (Hb < 7 g/dL) requires referral to PHC for parenteral iron sucrose therapy.'
  },

  // 2. MATERNAL DANGER SIGNS
  {
    id: 'MAT-DANGER-SEC-01',
    protocolId: 'MOHFW-HRP-2022',
    documentTitle: 'MoHFW Operational Guidelines for High Risk Pregnancy & Emergency Triage',
    version: 'Revision 3.0 (2022)',
    approvedBy: 'Child & Maternal Health Division, MoHFW',
    category: 'Maternal Danger Signs',
    sectionHeading: 'Section 4.1: Identification of High Risk Pregnancy (HRP) & Danger Signs',
    pageNumber: 28,
    keywords: ['danger signs pregnancy', 'maternal emergency', 'high risk', 'bleeding', 'headache', 'swelling', 'fetal movements'],
    summary: 'Clinical indicators separating routine pregnancy discomfort from life-threatening maternal emergencies.',
    content: `Major Danger Signs During Pregnancy:
1. Vaginal Bleeding at any stage of pregnancy (Antepartum Hemorrhage, Placenta Previa, or Abruptio Placentae). Immediate referral trigger.
2. Severe headache, blurring of vision, or epigastric pain (signs of impending Eclampsia).
3. Convulsions or fits (Eclampsia).
4. High fever with chills or foul-smelling vaginal discharge (Puerperal Sepsis / Chorioamnionitis).
5. Severe breathlessness at rest or anemia with severe pallor (Cardiac failure / severe anemia).
6. Premature Rupture of Membranes (PROM) or leaking fluid before labor onset.
7. Absence or marked decrease in fetal kicks (<10 movements in 12 hours after 28 weeks).
8. Obstructed or prolonged labor (active labor pains lasting more than 12 hours).`,
    allowedActions: [
      'Perform rapid triage check for immediate danger signs',
      'Activate 108 Emergency Medical Services for critical triggers',
      'Alert nearest First Referral Unit (FRU) / CHC before departure'
    ],
    escalationThreshold: 'Any active bleeding, seizure, or loss of consciousness triggers IMMEDIATE DETERMINISTIC ESCALATION.'
  },

  // 3. NEWBORN DANGER SIGNS & HBNC
  {
    id: 'NEWBORN-SEC-01',
    protocolId: 'NHM-HBNC-2023',
    documentTitle: 'Home Based Newborn Care (HBNC) Operational Guidelines for ASHA',
    version: 'Updated Standard (2023)',
    approvedBy: 'Child Health Division, MoHFW & Indian Academy of Pediatrics',
    category: 'Newborn Care',
    sectionHeading: 'Section 2.3: HBNC Home Visit Schedule and Danger Sign Checklist',
    pageNumber: 45,
    keywords: ['newborn', 'hbnc', 'danger signs', 'hypothermia', 'breathing', 'feeding', 'cord care', 'visits'],
    summary: 'Mandatory home visits (6 for institutional delivery, 7 for home delivery) and life-threatening newborn signs.',
    content: `HBNC Home Visit Protocol:
- Institutional delivery: 6 visits on Days 3, 7, 14, 21, 28, and 42.
- Home delivery: 7 visits on Days 1 (within 24h), 3, 7, 14, 21, 28, and 42.

Immediate Newborn Danger Signs:
1. Inability to suck or feed at the breast (poor feeding / lethargy).
2. Fast breathing (>60 breaths per minute at rest) or severe chest indrawing.
3. Hypothermia (body feels cold, axillary temp < 35.5°C) or high fever (> 37.5°C).
4. Convulsions, seizures, or abnormal twitching of limbs.
5. Yellow palms and soles within first 24 hours of life (pathological jaundice).
6. Umbilical stump with redness extending to abdominal skin, bleeding, or foul pus discharge.
7. Very small baby (< 1800 grams birth weight or gestation < 34 weeks).`,
    allowedActions: [
      'Weigh baby using spring/digital salter scale',
      'Count respiratory rate for full 60 seconds with ARI timer',
      'Check temperature using digital axillary thermometer',
      'Guide mother on exclusive breastfeeding and Kangaroo Mother Care (KMC)'
    ],
    escalationThreshold: 'Any sign of asphyxia, hypothermia <35.5°C, or inability to feed requires emergency transport to SNCU.'
  },

  // 4. NATIONAL IMMUNIZATION SCHEDULE (NIS)
  {
    id: 'IMMUN-SEC-01',
    protocolId: 'UIP-NIS-2023',
    documentTitle: 'Universal Immunization Programme (UIP) Operational Handbook',
    version: 'NIS 2023 Edition',
    approvedBy: 'Immunization Division, MoHFW, Government of India',
    category: 'Immunisation',
    sectionHeading: 'Section 1.2: National Immunization Schedule (NIS) Timetable',
    pageNumber: 8,
    keywords: ['immunization', 'vaccine', 'bcg', 'opv', 'pentavalent', 'rotavirus', 'fipv', 'pcv', 'mr', 'dpt'],
    summary: 'Complete schedule of vaccines from birth through 16 years of age under India UIP.',
    content: `National Immunization Schedule (UIP):
- At Birth: BCG (0.1 ml ID), OPV-0 (2 drops oral), Hepatitis B birth dose (within 24 hours, 0.5 ml IM anterolateral mid-thigh).
- At 6 Weeks: Pentavalent-1 (DPT+HepB+Hib, 0.5 ml IM), OPV-1 (2 drops), Rotavirus-1 (5 drops), fIPV-1 (0.1 ml ID right upper arm), PCV-1 (0.5 ml IM).
- At 10 Weeks: Pentavalent-2 (0.5 ml IM), OPV-2 (2 drops), Rotavirus-2 (5 drops).
- At 14 Weeks: Pentavalent-3 (0.5 ml IM), OPV-3 (2 drops), Rotavirus-3 (5 drops), fIPV-2 (0.1 ml ID), PCV-2 (0.5 ml IM).
- At 9-12 Months: MR-1 (Measles-Rubella, 0.5 ml SC), PCV Booster (0.5 ml IM), Japanese Encephalitis-1 (endemic districts), Vitamin A 1st dose (1 lakh IU = 1 ml oral).
- At 16-24 Months: MR-2 (0.5 ml SC), DPT Booster-1 (0.5 ml IM), OPV Booster (2 drops), JE-2, Vitamin A 2nd dose (2 lakh IU).
- At 5-6 Years: DPT Booster-2 (0.5 ml IM).
- At 10 & 16 Years: Td (Tetanus & adult Diphtheria toxoid, 0.5 ml IM).`,
    allowedActions: [
      'Verify immunization status on MCP card or RCH register',
      'Mobilize children for Village Health Sanitation and Nutrition Day (VHSND)',
      'Educate parents on mild normal post-vaccine fever and paracetamol dosage',
      'Track dropouts and defaulters using due-list'
    ],
    escalationThreshold: 'AEFI (Adverse Event Following Immunization) such as anaphylaxis, high fever with convulsion, or abscess requires immediate MO notification.'
  },

  // 5. CHILD GROWTH & MALNUTRITION SCREENING
  {
    id: 'GROWTH-SEC-01',
    protocolId: 'MOHFW-SAM-2022',
    documentTitle: 'Operational Guidelines for Management of Severe Acute Malnutrition (SAM)',
    version: 'Version 2.5 (2022)',
    approvedBy: 'Child Health Division, MoHFW & National Center of Excellence (NCoE) AIIMS',
    category: 'Child Growth & Malnutrition',
    sectionHeading: 'Section 3.1: Community Screening Criteria for SAM and MAM',
    pageNumber: 19,
    keywords: ['sam', 'mam', 'malnutrition', 'muac', 'edema', 'growth', 'weight', 'nutrition rehabilitation'],
    summary: 'Screening criteria for children aged 6 to 59 months using MUAC tape, bilateral pitting edema, and weight-for-height.',
    content: `Screening Criteria for Malnutrition (Children 6-59 months):
1. Mid-Upper Arm Circumference (MUAC):
   - Red (< 115 mm / 11.5 cm): Severe Acute Malnutrition (SAM).
   - Yellow (115 mm to 124 mm / 11.5 - 12.4 cm): Moderate Acute Malnutrition (MAM).
   - Green (>= 125 mm / 12.5 cm): Normal nutritional status.
2. Bilateral Pitting Edema of Feet:
   - Press both thumbs gently on dorsum of feet for 3 seconds. Persistent indent indicates edema.
   - Any bilateral edema categorizes child as SAM regardless of MUAC or weight.
3. Weight-for-Height / Length:
   - Below -3 SD of WHO Child Growth Standards = SAM.
   - Between -2 SD and -3 SD = MAM.
Action:
- SAM with medical complications (anorexia, fever, pneumonia, severe dehydration) -> Refer to Nutrition Rehabilitation Centre (NRC) immediately.
- SAM without medical complications -> Community-based management with Modified Energy Dense Nutrition (EDN) and weekly monitoring by ANM/ASHA.`,
    allowedActions: [
      'Measure MUAC using calibrated tri-colour tape',
      'Examine for bilateral pitting edema of feet',
      'Assess appetite test using Ready-to-Use Therapeutic Food (RUTF) / local EDN',
      'Counsel mother on complementary feeding and active feeding practices'
    ],
    escalationThreshold: 'SAM child with failed appetite test, lethargy, or bilateral +++ edema requires urgent admission to NRC.'
  },

  // 6. HYPERTENSION FOLLOW-UP
  {
    id: 'HTN-SEC-01',
    protocolId: 'NP-NCD-HTN-2023',
    documentTitle: 'National Programme for Prevention and Control of Non-Communicable Diseases (NP-NCD)',
    version: 'Guideline Edition 2023',
    approvedBy: 'NCD Division, DGHS, MoHFW',
    category: 'Hypertension',
    sectionHeading: 'Section 4.3: Community Follow-up & Medication Adherence for Hypertension',
    pageNumber: 32,
    keywords: ['hypertension', 'blood pressure', 'bp', 'ncd', 'screening', 'adherence', 'lifestyle', 'stroke'],
    summary: 'Standard follow-up schedules, lifestyle modifications, and medication compliance tracking for hypertensive patients.',
    content: `Hypertension Care Protocol at Health & Wellness Centre (Arogya Mandir) / Sub-Centre:
- Diagnostic Threshold: Systolic BP >= 140 mmHg and/or Diastolic BP >= 90 mmHg on two separate readings.
Follow-up Frequency:
- Controlled BP (< 140/90 mmHg): Follow-up BP measurement once every 30 days. Confirm 30-day medicine refill from PHC.
- Uncontrolled Stage 1 (140-159 / 90-99 mmHg): Follow-up check within 14 days; reinforce low sodium diet and medication compliance.
- Uncontrolled Stage 2 (>= 160/100 mmHg): Refer to Medical Officer at PHC within 48-72 hours for treatment escalation.
Lifestyle Counselling (SALT & EXERCISE):
- Reduce dietary salt intake to less than 5 grams (1 teaspoon) daily; avoid papads, pickles, and processed snacks.
- 30 minutes of moderate aerobic exercise (brisk walking) 5 days per week.
- Complete cessation of bidi, cigarette, and smokeless tobacco (khaini, gutkha).
- Emphasize that antihypertensive drugs are life-long and must NOT be discontinued even if the patient feels healthy.`,
    allowedActions: [
      'Measure BP using calibrated digital or aneroid monitor after 5 min rest',
      'Check pill counts and record adherence in NCD register',
      'Facilitate monthly drug refill from Ayushman Arogya Mandir',
      'Counsel on reduction of dietary sodium and tobacco cessation'
    ],
    escalationThreshold: 'BP >= 180/120 mmHg or any associated chest pain, shortness of breath, or neurological deficit triggers IMMEDIATE EMERGENCY ESCALATION.'
  },

  // 7. DIABETES FOLLOW-UP
  {
    id: 'DIAB-SEC-01',
    protocolId: 'NP-NCD-DIAB-2023',
    documentTitle: 'National Guidelines for Screening and Management of Diabetes Mellitus',
    version: 'NP-NCD Rev 2023',
    approvedBy: 'NCD Division, DGHS, MoHFW',
    category: 'Diabetes',
    sectionHeading: 'Section 5.2: Community Monitoring and Foot Care in Type 2 Diabetes',
    pageNumber: 41,
    keywords: ['diabetes', 'sugar', 'blood glucose', 'cbg', 'foot care', 'hypoglycemia', 'diet', 'metformin'],
    summary: 'Capillary blood glucose monitoring, hypoglycemia recognition, and diabetic foot examination.',
    content: `Diabetes Community Follow-up Protocol:
- Target Blood Glucose: Fasting CBG 80-130 mg/dL; Post-prandial (2h after meal) < 180 mg/dL.
Follow-up Visits:
- Every 30 days for blood glucose check and medication compliance review.
- HbA1c testing at PHC every 3 to 6 months (target < 7.0%).
Hypoglycemia Management (Low Blood Sugar < 70 mg/dL):
- Symptoms: Trembling, profuse cold sweating, palpitations, sudden hunger, dizziness, confusion.
- Rule of 15: Give 15-20 grams of fast-acting carbohydrate (3 teaspoons of sugar dissolved in water, or 1/2 cup fruit juice). Recheck after 15 minutes.
Diabetic Foot Inspection:
- Daily self-examination of soles and web-spaces for cuts, blisters, calluses, or redness.
- Never walk barefoot even inside the home; wear soft cushioned footwear.
- Never use hot water bags or sharp blades on corns.`,
    allowedActions: [
      'Screen using glucometer (Fasting / Random CBG)',
      'Check adherence to Metformin, Glimepiride, or prescribed oral hypoglycemics',
      'Inspect feet for ulcers, cracks, and fungal infections',
      'Educate patient and family on Rule of 15 for hypoglycemia'
    ],
    escalationThreshold: 'Blood glucose > 300 mg/dL with vomiting/drowsiness (suspected DKA) or non-healing foot ulcer with redness requires immediate hospital referral.'
  },

  // 8. ORS & DIARRHEA MANAGEMENT
  {
    id: 'DIARRHEA-SEC-01',
    protocolId: 'MOHFW-CDD-2023',
    documentTitle: 'National Guidelines for the Management of Diarrhoeal Diseases in Children',
    version: 'Child Health Manual 2023',
    approvedBy: 'Child Health Division, MoHFW & WHO-India',
    category: 'Diarrhoea & ORS',
    sectionHeading: 'Section 2.2: Home Management of Diarrhea and Zinc Supplementation',
    pageNumber: 11,
    keywords: ['diarrhea', 'ors', 'zinc', 'dehydration', 'watery stool', 'rehydration', 'loose motion'],
    summary: 'Standard WHO Low-Osmolarity ORS reconstitution, volume administration, and 14-day Zinc regimen.',
    content: `Management of Acute Diarrhea in Children (Plan A - No Dehydration):
1. Low-Osmolarity Oral Rehydration Salt (ORS):
   - Reconstitution: Dissolve entire 1 packet of ORS (20.5 grams) in exactly 1 Liter of clean drinking water. Mix thoroughly.
   - Discard any unused reconstituted ORS solution after 24 hours.
   - Quantity after each loose stool:
     * Children under 2 years: 50 to 100 ml (quarter to half cup).
     * Children 2 to 10 years: 100 to 200 ml (half to full cup).
     * Older children & adults: As much as they want.
2. Zinc Supplementation for 14 Consecutive Days:
   - Age 2 months to 6 months: 10 mg elemental zinc (half 20mg dispersible tablet) daily for 14 days.
   - Age 6 months to 5 years: 20 mg elemental zinc (one whole 20mg dispersible tablet) daily for 14 days.
   - Emphasize continuing Zinc for the full 14 days even if diarrhea stops early.
3. Continued Feeding: Continue frequent breastfeeding and normal nutritious home food (dalia, khichdi, curd). Never restrict fluids.`,
    allowedActions: [
      'Demonstrate correct preparation of 1-liter ORS solution',
      'Distribute ORS packets and Zinc 20mg tablets',
      'Instruct on zinc administration using clean spoon and breast milk/water',
      'Advise mother on danger signs requiring clinic visit'
    ],
    escalationThreshold: 'Blood in stool (dysentery), persistent vomiting (>3 times/hour), or signs of dehydration (sunken eyes, extreme thirst) requires referral to PHC.'
  },

  // 9. FEVER MANAGEMENT
  {
    id: 'FEVER-SEC-01',
    protocolId: 'NVBDCP-FEVER-2023',
    documentTitle: 'National Vector Borne Disease Control Programme (NVBDCP) Field Manual',
    version: 'Field Edition 2023',
    approvedBy: 'Directorate of NVBDCP, DGHS, MoHFW',
    category: 'Fever Management',
    sectionHeading: 'Section 3.2: Community Fever Screening and Rapid Diagnostic Tests (RDT)',
    pageNumber: 23,
    keywords: ['fever', 'malaria', 'dengue', 'rdt', 'paracetamol', 'chills', 'sub-centre', 'vashnd'],
    summary: 'Frontline screening for fever, bivalent Rapid Diagnostic Test for Malaria, and antipyretic guidance.',
    content: `Fever Screening & Management Protocol for Frontline Workers:
1. Clinical Assessment:
   - Measure axillary temperature. Fever defined as >= 37.5°C (99.5°F).
   - Inquire about duration, chills/rigors, rashes, headache, body aches, and cough.
2. Rapid Diagnostic Test (RDT) for Malaria:
   - Perform finger-prick blood test using bivalent RDT (Pf/Pv) on all fever cases in endemic areas.
   - Prepare thick and thin blood smears on glass slide for laboratory confirmation.
   - If Pf positive: Initiate Artemisinin-based Combination Therapy (ACT) as per National Drug Policy.
   - If Pv positive: Chloroquine + 14-day Primaquine under supervision of Medical Officer.
3. Symptomatic Relief:
   - Paracetamol 10-15 mg/kg per dose (child) or 500-650 mg per dose (adult) every 6 hours for high fever.
   - Physical cooling with tap-water tepid sponging (NOT cold or ice water).
   - Encourage generous oral fluids (lemon water, coconut water, thin dal).
   - STRICT WARNING: NEVER administer Aspirin or Ibuprofen to suspected fever cases due to Dengue hemorrhagic risk.`,
    allowedActions: [
      'Take temperature with digital thermometer',
      'Administer Paracetamol for temp > 38.5°C',
      'Perform malaria RDT and prepare blood slide',
      'Tepid sponge forehead and limbs'
    ],
    escalationThreshold: 'Fever with stiff neck, altered consciousness, persistent vomiting, petechial rash, or fever > 5 days requires immediate referral to PHC.'
  },

  // 10. REFERRAL & FOLLOW-UP SOP
  {
    id: 'REFERRAL-SEC-01',
    protocolId: 'NHM-REF-SOP-2023',
    documentTitle: 'NHM Standard Operating Procedures for Frontline Emergency Referral & Transport',
    version: 'National SOP 2023',
    approvedBy: 'National Health Mission Directorate, MoHFW',
    category: 'Referral & Follow-up',
    sectionHeading: 'Section 1.4: Frontline Health Worker Referral Slip and Handover Protocol',
    pageNumber: 5,
    keywords: ['referral', 'ambulance', '108', '102', 'fru', 'handover', 'follow up', 'transport', 'slip'],
    summary: 'Procedures for mobilizing emergency transport, filling standard referral slips, and tracking post-discharge follow-up.',
    content: `Standard Operating Procedure for Frontline Health Worker Referrals:
1. Transport Mobilization:
   - Dial 108 for Emergency ambulance (trauma, severe obstetric complication, neonatal distress, coma).
   - Dial 102 for Janani Shishu Suraksha Karyakram (JSSK) free transport for pregnant women and sick infants.
2. Referral Slip Documentation:
   - Frontline worker must prepare standard referral slip stating:
     * Patient Name, Age, Sex, Village, and MCP/RCH ID.
     * Vital signs: Temperature, Pulse, Respiratory Rate, and Blood Pressure.
     * Primary reason for referral and duration of symptoms.
     * Primary stabilization or medication administered (e.g. ORS, Paracetamol, Zinc).
     * Time of departure and referring worker phone number.
3. Accompanying High-Risk Cases:
   - ASHA or ANM should accompany critical obstetric or newborn cases to the receiving hospital whenever feasible.
4. Post-Discharge Follow-up:
   - Visit the patient at home within 48 hours of discharge from CHC/District Hospital to verify treatment compliance and recovery.`,
    allowedActions: [
      'Coordinate with 108/102 ambulance dispatch operator',
      'Fill in 4-point emergency referral slip',
      'Accompany patient to First Referral Unit (FRU)',
      'Conduct home follow-up within 48 hours of hospital discharge'
    ],
    escalationThreshold: 'If transport delayed > 30 minutes in critical case, notify Medical Officer In-Charge at PHC for secondary dispatch.'
  }
];
