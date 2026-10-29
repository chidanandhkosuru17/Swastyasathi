import { HouseholdRecord, PriorityLevel, FollowUpStatus } from '../types';

export interface PlannerSummaryMetrics {
  totalHouseholds: number;
  dueTodayCount: number;
  overdueCount: number;
  urgentCount: number;
  highPriorityCount: number;
  completedCount: number;
  pendingSyncCount: number;
}

export function calculateSummaryMetrics(
  households: HouseholdRecord[],
  selectedDateStr: string,
  pendingSyncCount: number = 0
): PlannerSummaryMetrics {
  let dueTodayCount = 0;
  let overdueCount = 0;
  let urgentCount = 0;
  let highPriorityCount = 0;
  let completedCount = 0;

  for (const h of households) {
    if (h.followUpStatus === 'COMPLETED') {
      completedCount++;
    }

    if (h.priority === 'URGENT') {
      urgentCount++;
    } else if (h.priority === 'HIGH') {
      highPriorityCount++;
    }

    if (h.nextDueDate === selectedDateStr && h.followUpStatus !== 'COMPLETED') {
      dueTodayCount++;
    }

    if (h.followUpStatus === 'OVERDUE' || (h.nextDueDate < selectedDateStr && h.followUpStatus !== 'COMPLETED')) {
      overdueCount++;
    }
  }

  return {
    totalHouseholds: households.length,
    dueTodayCount,
    overdueCount,
    urgentCount,
    highPriorityCount,
    completedCount,
    pendingSyncCount
  };
}

export interface FilterOptions {
  date: string;
  category: string;
  priority: PriorityLevel | 'ALL';
  status: FollowUpStatus | 'ALL';
  village: string;
  searchQuery: string;
}

export function filterPlannerVisits(
  households: HouseholdRecord[],
  filters: FilterOptions
): HouseholdRecord[] {
  return households.filter(h => {
    // Date filter: if date matches or overdue
    if (filters.date) {
      const isDateMatch = h.nextDueDate === filters.date;
      const isOverdue = h.followUpStatus === 'OVERDUE' || (h.nextDueDate < filters.date && h.followUpStatus !== 'COMPLETED');
      if (!isDateMatch && !isOverdue) {
        return false;
      }
    }

    if (filters.category && filters.category !== 'ALL' && h.beneficiaryCategory !== filters.category) {
      return false;
    }

    if (filters.priority && filters.priority !== 'ALL' && h.priority !== filters.priority) {
      return false;
    }

    if (filters.status && filters.status !== 'ALL' && h.followUpStatus !== filters.status) {
      return false;
    }

    if (filters.village && filters.village !== 'ALL' && h.village !== filters.village) {
      return false;
    }

    if (filters.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      const match =
        h.householdId.toLowerCase().includes(q) ||
        h.beneficiaryName.toLowerCase().includes(q) ||
        h.headOfHousehold.toLowerCase().includes(q) ||
        h.serviceRequired.toLowerCase().includes(q) ||
        h.village.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sort order: URGENT > HIGH > NORMAL, then by due date
    const priorityWeight: Record<PriorityLevel, number> = {
      URGENT: 3,
      HIGH: 2,
      NORMAL: 1
    };
    if (priorityWeight[b.priority] !== priorityWeight[a.priority]) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return a.nextDueDate.localeCompare(b.nextDueDate);
  });
}
