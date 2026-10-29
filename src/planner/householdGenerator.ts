import { BeneficiaryCategory, HouseholdRecord, PriorityLevel, FollowUpStatus } from '../types';

/**
 * Deterministic PRNG using Mulberry32
 * Ensures the exact same 500 synthetic households are generated on every run
 */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const VILLAGES = [
  'Rampur',
  'Kalyanpur',
  'Shampur',
  'Shivaji Nagar',
  'Chandrapur',
  'Bhimavaram',
  'Anandpur'
];

const LAST_NAMES = [
  'Devi', 'Kumar', 'Singh', 'Sharma', 'Patel', 'Reddy', 'Yadav', 'Rao', 'Verma',
  'Gupta', 'Bai', 'Meena', 'Naidu', 'Choudhary', 'Mondal', 'Biswas', 'Das'
];

const FIRST_NAMES_FEMALE = [
  'Sunita', 'Geeta', 'Anjali', 'Pooja', 'Lakshmi', 'Parvati', 'Radha', 'Kavita',
  'Manju', 'Rekha', 'Shanti', 'Savitri', 'Meena', 'Asha', 'Durga', 'Bhavani'
];

const FIRST_NAMES_MALE = [
  'Ramesh', 'Suresh', 'Mukesh', 'Rajesh', 'Anil', 'Vijay', 'Manoj', 'Santosh',
  'Dinesh', 'Mahesh', 'Gopal', 'Naresh', 'Krishna', 'Venkat', 'Srinivas'
];

const FIRST_NAMES_CHILD = [
  'Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan',
  'Diya', 'Ananya', 'Aadhya', 'Pari', 'Saanvi', 'Kavya', 'Anika', 'Isha'
];

interface ServiceTemplate {
  category: BeneficiaryCategory;
  service: string;
  age: string;
  defaultPriority: PriorityLevel;
  priorityReason: string;
}

const SERVICE_TEMPLATES: ServiceTemplate[] = [
  {
    category: 'ANC',
    service: 'ANC 3rd Checkup & Hemoglobin Screening',
    age: '24 yrs (28 weeks gestation)',
    defaultPriority: 'HIGH',
    priorityReason: 'Third trimester screening for pre-eclampsia and gestational anemia'
  },
  {
    category: 'ANC',
    service: 'ANC 1st Checkup & Td-1 Vaccination',
    age: '21 yrs (10 weeks gestation)',
    defaultPriority: 'NORMAL',
    priorityReason: 'Early pregnancy registration and baseline vitals'
  },
  {
    category: 'ANC',
    service: 'ANC High-Risk Follow-up (Borderline BP)',
    age: '28 yrs (34 weeks gestation)',
    defaultPriority: 'URGENT',
    priorityReason: 'Borderline elevated blood pressure history (138/88 mmHg) in third trimester'
  },
  {
    category: 'INFANT',
    service: 'HBNC Day 14 Home Visit & Weight Check',
    age: '14 days',
    defaultPriority: 'HIGH',
    priorityReason: 'Crucial neonatal infection and exclusive breastfeeding check'
  },
  {
    category: 'INFANT',
    service: 'Pentavalent-3, OPV-3 & fIPV-2 Immunization',
    age: '14 weeks',
    defaultPriority: 'HIGH',
    priorityReason: 'Time-sensitive primary immunization booster'
  },
  {
    category: 'INFANT',
    service: 'BCG, HepB-0 & OPV-0 Birth Dose Follow-up',
    age: '3 days',
    defaultPriority: 'URGENT',
    priorityReason: 'Home-delivered newborn requiring birth dose verification'
  },
  {
    category: 'CHILD_U5',
    service: 'SAM Follow-up: MUAC Measurement & Appetite Test',
    age: '18 months',
    defaultPriority: 'URGENT',
    priorityReason: 'Child identified with red-zone MUAC (<115 mm); active nutritional follow-up'
  },
  {
    category: 'CHILD_U5',
    service: 'Measles-Rubella (MR-1) & Vitamin A Dose 1',
    age: '9 months',
    defaultPriority: 'HIGH',
    priorityReason: 'Mandatory 9th month immunization to prevent measles complications'
  },
  {
    category: 'CHILD_U5',
    service: 'MAM Follow-up: Growth Charting & Supplementary Nutrition',
    age: '2.5 yrs',
    defaultPriority: 'NORMAL',
    priorityReason: 'Moderate acute malnutrition monitoring and THR distribution'
  },
  {
    category: 'NCD_HTN',
    service: 'Hypertension Monthly BP Check & Drug Refill',
    age: '56 yrs',
    defaultPriority: 'HIGH',
    priorityReason: 'Chronic hypertension; verification of 30-day Amlodipine compliance'
  },
  {
    category: 'NCD_HTN',
    service: 'Uncontrolled BP Follow-up (Recheck in 14 Days)',
    age: '62 yrs',
    defaultPriority: 'URGENT',
    priorityReason: 'Previous reading was 164/98 mmHg; requires MO treatment review'
  },
  {
    category: 'NCD_DIAB',
    service: 'Diabetes Random Blood Glucose & Foot Inspection',
    age: '49 yrs',
    defaultPriority: 'HIGH',
    priorityReason: 'Monthly capillary glucose monitoring and diabetic foot ulcer screening'
  },
  {
    category: 'NCD_DIAB',
    service: 'Routine Diabetes Medication Adherence Counselling',
    age: '54 yrs',
    defaultPriority: 'NORMAL',
    priorityReason: 'Quarterly Metformin compliance check and dietary counselling'
  },
  {
    category: 'GENERAL',
    service: 'Village Water Sanitation & Diarrhea Prevention Check',
    age: '38 yrs',
    defaultPriority: 'NORMAL',
    priorityReason: 'Chlorine tablet distribution and boiled water awareness'
  }
];

/**
 * Generates EXACTLY 500 synthetic households deterministically.
 */
export function generateSyntheticHouseholds(): HouseholdRecord[] {
  const rng = mulberry32(42); // Fixed seed for reproducible demonstration
  const households: HouseholdRecord[] = [];

  // Base reference date for deterministic planner simulation: "Today"
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  for (let i = 1; i <= 500; i++) {
    const padId = String(i).padStart(3, '0');
    const village = VILLAGES[Math.floor(rng() * VILLAGES.length)];
    const villageCode = village.slice(0, 3).toUpperCase();
    const householdId = `HH-${villageCode}-${padId}`;

    const headLastName = LAST_NAMES[Math.floor(rng() * LAST_NAMES.length)];
    const headFirstName = FIRST_NAMES_MALE[Math.floor(rng() * FIRST_NAMES_MALE.length)];
    const headOfHousehold = `${headFirstName} ${headLastName}`;

    // Select service template
    const template = SERVICE_TEMPLATES[Math.floor(rng() * SERVICE_TEMPLATES.length)];

    let beneficiaryName = '';
    if (template.category === 'ANC') {
      beneficiaryName = `${FIRST_NAMES_FEMALE[Math.floor(rng() * FIRST_NAMES_FEMALE.length)]} ${headLastName}`;
    } else if (template.category === 'INFANT' || template.category === 'CHILD_U5') {
      beneficiaryName = `${FIRST_NAMES_CHILD[Math.floor(rng() * FIRST_NAMES_CHILD.length)]} ${headLastName}`;
    } else {
      const isFemale = rng() > 0.5;
      const fName = isFemale
        ? FIRST_NAMES_FEMALE[Math.floor(rng() * FIRST_NAMES_FEMALE.length)]
        : FIRST_NAMES_MALE[Math.floor(rng() * FIRST_NAMES_MALE.length)];
      beneficiaryName = `${fName} ${headLastName}`;
    }

    // Determine due date offset:
    // Some are overdue (negative days), some due today (0), some upcoming (+1 to +14 days)
    const roll = rng();
    let dayOffset = 0;
    let followUpStatus: FollowUpStatus = 'PENDING';

    if (roll < 0.15) {
      // 15% Overdue (-1 to -10 days)
      dayOffset = -Math.floor(rng() * 10) - 1;
      followUpStatus = 'OVERDUE';
    } else if (roll < 0.35) {
      // 20% Due Today (offset 0)
      dayOffset = 0;
      followUpStatus = 'PENDING';
    } else if (roll < 0.50) {
      // 15% Completed recently
      dayOffset = -Math.floor(rng() * 5);
      followUpStatus = 'COMPLETED';
    } else {
      // 50% Upcoming over next 1 to 14 days
      dayOffset = Math.floor(rng() * 14) + 1;
      followUpStatus = 'PENDING';
    }

    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + dayOffset);
    const nextDueDateStr = dueDate.toISOString().split('T')[0];

    const lastDate = new Date(dueDate);
    lastDate.setDate(lastDate.getDate() - 30);
    const lastServiceDateStr = lastDate.toISOString().split('T')[0];

    // Priority adjustments
    let priority = template.defaultPriority;
    let priorityReason = template.priorityReason;

    if (followUpStatus === 'OVERDUE') {
      if (priority === 'NORMAL') {
        priority = 'HIGH';
        priorityReason = `Overdue by ${Math.abs(dayOffset)} days; time-critical catch-up visit required`;
      } else if (priority === 'HIGH') {
        priority = 'URGENT';
        priorityReason = `High priority follow-up overdue by ${Math.abs(dayOffset)} days`;
      }
    }

    const initialNotes: string[] = [];
    if (followUpStatus === 'COMPLETED') {
      initialNotes.push(`Completed service on ${nextDueDateStr}. Beneficiary counselled; vitals stable.`);
    }

    households.push({
      householdId,
      headOfHousehold,
      village,
      beneficiaryName,
      beneficiaryCategory: template.category,
      beneficiaryAge: template.age,
      serviceRequired: template.service,
      lastServiceDate: lastServiceDateStr,
      nextDueDate: nextDueDateStr,
      followUpStatus,
      priority,
      priorityReason,
      visitNotes: initialNotes,
      updatedAt: new Date().toISOString()
    });
  }

  return households;
}
