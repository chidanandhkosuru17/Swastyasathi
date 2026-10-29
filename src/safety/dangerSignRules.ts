import { DangerSignRule } from '../types';

/**
 * Version-Controlled Deterministic Danger-Sign Rules Registry
 * Source: Ministry of Health and Family Welfare (MoHFW) / National Health Mission (NHM)
 * Frontline Health Worker (ASHA/ANM) Emergency Triage Protocols
 */
export const DANGER_SIGN_RULES: DangerSignRule[] = [
  {
    id: 'EMERGENCY-MAT-01',
    category: 'MATERNAL',
    title: 'Severe Antepartum or Postpartum Hemorrhage',
    triggerKeywords: [
      'heavy bleeding',
      'severe bleeding',
      'bleeding during pregnancy',
      'blood clots pregnancy',
      'postpartum bleeding',
      'continuous bleeding',
      'soaking pad',
      'soaking pads',
      'bleeding heavily',
      'hemorrhage',
      'vaginal bleeding'
    ],
    codeMixedKeywords: [
      'khoon beh raha hai',
      'bahut bleeding',
      'garbh me khoon',
      'raktha sravam',
      'bale bleeding',
      'raktham padipotondi',
      'prasavam tarvata bleeding'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Arrange immediate 108 Emergency Ambulance transfer to First Referral Unit (FRU) or District Hospital with blood transfusion facilities. Keep patient lying flat on left side with legs elevated.',
    stabilizationGuidance: [
      'Call emergency transport (108/102) immediately. Do not delay for registration or documentation.',
      'Place pregnant/postpartum mother on left lateral tilt to prevent supine hypotension.',
      'Keep mother warm with blankets; massage uterus gently if postpartum hemorrhage suspected.',
      'Do not give oral fluids or solid food if surgery/anesthesia may be needed.',
      'Accompany the patient with Maternal and Child Protection (MCP) card.'
    ],
    targetFacility: 'First Referral Unit (FRU) / Sub-District Hospital / District Hospital with Functional Blood Bank',
    ambulanceContact: '108 (Emergency National Ambulance) or 102 (Janani Shishu Suraksha Karyakram - JSSK)',
    sourceDocument: 'NHM Guidelines for Skilled Birth Attendance and Emergency Obstetric Care',
    sectionReference: 'Section 4.2: Management of Obstetric Hemorrhage and Triage',
    pageNumber: 38,
    approvalAuthority: 'Maternal Health Division, MoHFW, Government of India (Rev 2023)'
  },
  {
    id: 'EMERGENCY-MAT-02',
    category: 'MATERNAL',
    title: 'Eclampsia / Severe Preeclampsia (Convulsions & Seizures)',
    triggerKeywords: [
      'convulsions',
      'fits',
      'seizures',
      'eclampsia',
      'seizure in pregnancy',
      'severe headache blurred vision',
      'high bp with fits',
      'fits during pregnancy',
      'maternal seizure',
      'swelling face fits'
    ],
    codeMixedKeywords: [
      'dhaure pad rahe hain',
      'chakkar aakar behosh',
      'fits aa raha hai',
      'murcha poyindi',
      'fits vachayi',
      'garbhini fits',
      'kallu tirigi padipoyaru'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Immediate emergency transfer to FRU. Prevent airway obstruction and trauma during convulsions. Administer Loading Dose of Magnesium Sulfate if trained ANM available under protocol.',
    stabilizationGuidance: [
      'Turn mother to left side; keep mouth clear of vomit/secretions; do not force anything between teeth.',
      'Protect from falling or physical injury during convulsion.',
      'Check BP if sphygmomanometer is immediately accessible, but do not delay transport.',
      'Alert receiving facility for immediate Magnesium Sulfate injection and emergency delivery readiness.'
    ],
    targetFacility: 'FRU or Tertiary Referral Hospital equipped for Eclampsia Management',
    ambulanceContact: '108 Emergency Ambulance',
    sourceDocument: 'MoHFW Operational Guidelines for Management of Hypertensive Disorders in Pregnancy',
    sectionReference: 'Section 3.1: Pre-eclampsia and Eclampsia Identification & Frontline Referral',
    pageNumber: 24,
    approvalAuthority: 'Maternal Health Division, MoHFW & WHO-CC AIIMS'
  },
  {
    id: 'EMERGENCY-MAT-03',
    category: 'MATERNAL',
    title: 'Obstructed or Prolonged Labor / Cord Prolapse',
    triggerKeywords: [
      'obstructed labor',
      'cord prolapse',
      'umbilical cord visible',
      'labor longer than 12 hours',
      'prolonged labour',
      'hand prolapse',
      'foot prolapse',
      'transverse lie labor',
      'severe abdominal pain between contractions'
    ],
    codeMixedKeywords: [
      'dard 12 ghante se jyada',
      'naal bahar aa gaya',
      'bacche ka haath bahar',
      'prasava noppulu ekkuva sepu',
      'koddu bayataki vachindi',
      'prasavam aagipoindi'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Immediate emergency ambulance referral to Cesarean-capable FRU. If cord is prolapsed, position mother in knee-chest or elevated pelvis position to relieve cord pressure.',
    stabilizationGuidance: [
      'If umbilical cord is visible outside vagina, handle gently with sterile gauze soaked in warm normal saline; DO NOT push back.',
      'Keep mother in steep knee-chest position or raised pelvis with two pillows under hips.',
      'Transfer immediately with blue siren/emergency transport.',
      'Notify FRU labor room team en route.'
    ],
    targetFacility: 'FRU with 24x7 C-section and Anesthesiologist capability',
    ambulanceContact: '108 (Immediate Emergency Dispatch)',
    sourceDocument: 'NHM Guidelines for Skilled Birth Attendance and Intrapartum Care',
    sectionReference: 'Section 5.4: Malpresentation, Cord Prolapse, and Obstructed Labor Protocols',
    pageNumber: 52,
    approvalAuthority: 'Maternal Health Division, MoHFW'
  },
  {
    id: 'EMERGENCY-NEWBORN-01',
    category: 'NEWBORN',
    title: 'Severe Neonatal Asphyxia / Respiratory Distress',
    triggerKeywords: [
      'baby not breathing',
      'newborn not crying',
      'blue baby',
      'severe chest indrawing',
      'grunting',
      'gasping',
      'fast breathing newborn',
      'apnea newborn',
      'newborn turning blue',
      'stridor newborn'
    ],
    codeMixedKeywords: [
      'baccha saans nahi le raha',
      'baccha roya nahi',
      'neela pad gaya',
      'chhati dhas rahi hai',
      'pasli chal rahi hai',
      'bidda edvaledu',
      'oopiri teesukovadam ledu',
      'neelamga maarindi'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Immediate emergency resuscitation and transfer to Special Newborn Care Unit (SNCU). Clear secretions, stimulate gently, begin bag-and-mask ventilation if trained ANM present.',
    stabilizationGuidance: [
      'Clear mouth then nose with gentle suction bulb or clean soft cloth.',
      'Dry thoroughly with warm clean towel; remove wet cloth to prevent hypothermia.',
      'Stimulate by gently rubbing sole or back (2-3 times max).',
      'If not breathing or gasping, initiate bag and mask ventilation at 40-60 breaths per minute while mobilizing 108 ambulance.'
    ],
    targetFacility: 'Special Newborn Care Unit (SNCU) or Newborn Stabilization Unit (NBSU)',
    ambulanceContact: '108 / 102 JSSK Neonatal Ambulance with incubator',
    sourceDocument: 'Facility & Home Based Newborn Care (HBNC) Operational Guidelines',
    sectionReference: 'Section 2.1: Neonatal Resuscitation & Immediate Danger Signs',
    pageNumber: 16,
    approvalAuthority: 'Child Health Division, MoHFW & Indian Academy of Pediatrics (IAP)'
  },
  {
    id: 'EMERGENCY-NEWBORN-02',
    category: 'NEWBORN',
    title: 'Severe Neonatal Sepsis / Hypothermia (<35.5°C) / Refusal to Feed',
    triggerKeywords: [
      'newborn not feeding',
      'baby unable to suck',
      'cold to touch',
      'severe hypothermia newborn',
      'lethargic newborn',
      'floppy baby',
      'newborn convulsions',
      'umbilical cord pus foul smell',
      'jaundice on palms and soles newborn'
    ],
    codeMixedKeywords: [
      'baccha doodh nahi pee raha',
      'baccha thanda pad gaya',
      'bejaan baccha',
      'naal me peep',
      'paalu tagadam ledu',
      'bidda challaga aipoindi',
      'kamarlu ekkuvaga unnai'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Urgent transfer to SNCU. Provide Kangaroo Mother Care (KMC) skin-to-skin contact during transit to prevent hypothermia. Do not force oral feeds if child is lethargic.',
    stabilizationGuidance: [
      'Keep newborn in continuous skin-to-skin contact (KMC) on mother’s chest with cap and socks on.',
      'Do not bathe the baby.',
      'If umbilical cord has pus or redness extending to abdominal skin, do not apply local powders or oils.',
      'Prepare referral slip indicating exact age in hours/days, temperature, and feeding status.'
    ],
    targetFacility: 'SNCU / District Hospital Pediatric Department',
    ambulanceContact: '108 / 102 JSSK Transport',
    sourceDocument: 'Home Based Newborn Care (HBNC) ASHA Resource Book',
    sectionReference: 'Module 6: Assessment of Serious Illness in Newborns (HBNC Checkup)',
    pageNumber: 42,
    approvalAuthority: 'National Health Mission & MoHFW'
  },
  {
    id: 'EMERGENCY-PEDIATRIC-01',
    category: 'PEDIATRIC',
    title: 'Severe Dehydration with Hypovolemic Shock (Diarrhea / Cholera)',
    triggerKeywords: [
      'severe dehydration',
      'sunken eyes lethargic child',
      'skin pinch very slow',
      'unconscious diarrhea child',
      'unable to drink child',
      'cholera dehydration',
      'watery stools 10 times lethargic',
      'shock dehydration'
    ],
    codeMixedKeywords: [
      'aankhein dhas gayi behosh',
      'pani nahi pee pa raha',
      'chamdi dheere wapas jati hai',
      'dast lagatar behosh',
      'kallu lopalki poyayi',
      'neellu kuda tagalekapotunadu',
      'spruha ledu virochanalu'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Immediate emergency referral to Primary Health Centre (PHC) / CHC for IV Ringer Lactate fluid resuscitation. Do not attempt forced oral fluids in an unconscious child.',
    stabilizationGuidance: [
      'Assess skin pinch on abdomen (slow if >2 seconds). Check sensorium (lethargic or unconscious).',
      'If child is conscious and can swallow, offer small frequent sips of ORS during transit.',
      'If unconscious, place in recovery position; do not give oral fluids (aspiration risk).',
      'Transport immediately with referral note specifying suspected severe dehydration.'
    ],
    targetFacility: '24x7 PHC or Community Health Centre (CHC) with Pediatric Inpatient Bed',
    ambulanceContact: '108 Emergency Ambulance',
    sourceDocument: 'National Guidelines for the Management of Diarrhoeal Diseases in Children',
    sectionReference: 'Section 3: IMNCI Clinical Algorithm — Severe Dehydration (Plan C)',
    pageNumber: 14,
    approvalAuthority: 'Child Health Division, MoHFW & WHO-India'
  },
  {
    id: 'EMERGENCY-CARDIO-01',
    category: 'CARDIOVASCULAR',
    title: 'Hypertensive Crisis / Suspected Acute Coronary Syndrome',
    triggerKeywords: [
      'bp higher than 180',
      'systolic over 180',
      'severe chest pain radiating to arm',
      'crushing chest pain sweating',
      'suspected heart attack',
      'hypertensive urgency',
      'hypertensive crisis'
    ],
    codeMixedKeywords: [
      'chhati me tej dard pasina',
      'bp 180 se upar sar dard',
      'dil ka daura',
      'gunde noppi chemata',
      'bp chaala ekkuva aindi',
      'chhati bharam'
    ],
    emergencySeverity: 'CRITICAL_IMMEDIATE',
    actionInstruction: 'Immediate emergency referral to Community Health Centre / Sub-District Hospital with ECG and cardiac stabilization facilities. Keep patient at complete physical rest in propped-up position.',
    stabilizationGuidance: [
      'Keep patient resting in semi-reclining or comfortable sitting position; loosen tight collar.',
      'Reassure patient and calm family; avoid any physical exertion or walking.',
      'Do not administer unprescribed tablets without medical officer teleconsultation.',
      'Call 108 immediately and state suspected Acute Coronary Syndrome / Hypertensive Emergency.'
    ],
    targetFacility: 'CHC / District Hospital with Emergency Medical Unit & ECG',
    ambulanceContact: '108 (State Emergency Medical Services)',
    sourceDocument: 'National Programme for Prevention and Control of Non-Communicable Diseases (NP-NCD)',
    sectionReference: 'Chapter 4: Frontline Screening & Emergency Referral of Cardiovascular Events',
    pageNumber: 36,
    approvalAuthority: 'NCD Division, Directorate General of Health Services (DGHS), MoHFW'
  }
];
