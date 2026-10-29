import { HouseholdRecord, SyncQueueItem } from '../types';
import { generateSyntheticHouseholds } from '../planner/householdGenerator';

const DB_HOUSEHOLDS_KEY = 'swasthya_households_v1';
const DB_SYNC_QUEUE_KEY = 'swasthya_sync_queue_v1';
const DB_INITIALIZED_KEY = 'swasthya_db_initialized';

class LocalHealthDatabase {
  private inMemoryHouseholds: HouseholdRecord[] | null = null;

  public initialize(): HouseholdRecord[] {
    const isInitialized = localStorage.getItem(DB_INITIALIZED_KEY);
    const existingRaw = localStorage.getItem(DB_HOUSEHOLDS_KEY);

    if (isInitialized && existingRaw) {
      try {
        const parsed = JSON.parse(existingRaw);
        if (Array.isArray(parsed) && parsed.length === 500) {
          this.inMemoryHouseholds = parsed;
          return parsed;
        }
      } catch {
        // Fallback to regeneration if corrupted
      }
    }

    // Generate fresh 500 records
    const initialRecords = generateSyntheticHouseholds();
    this.saveAll(initialRecords);
    localStorage.setItem(DB_INITIALIZED_KEY, 'true');
    return initialRecords;
  }

  public getAll(): HouseholdRecord[] {
    if (this.inMemoryHouseholds && this.inMemoryHouseholds.length === 500) {
      return this.inMemoryHouseholds;
    }
    return this.initialize();
  }

  public getById(id: string): HouseholdRecord | undefined {
    const list = this.getAll();
    return list.find(h => h.householdId === id);
  }

  public updateHousehold(record: HouseholdRecord): void {
    const list = this.getAll();
    const index = list.findIndex(h => h.householdId === record.householdId);
    if (index !== -1) {
      list[index] = {
        ...record,
        updatedAt: new Date().toISOString()
      };
      this.saveAll(list);
      this.queueSyncItem('UPDATE_HOUSEHOLD', record as unknown as Record<string, unknown>);
    }
  }

  public markVisitCompleted(householdId: string, note?: string): HouseholdRecord | null {
    const list = this.getAll();
    const index = list.findIndex(h => h.householdId === householdId);
    if (index !== -1) {
      const item = list[index];
      const todayStr = new Date().toISOString().split('T')[0];
      const newNotes = [...item.visitNotes];
      if (note && note.trim()) {
        newNotes.unshift(`[${todayStr}] ${note.trim()}`);
      } else {
        newNotes.unshift(`[${todayStr}] Visit marked completed. Routine care provided.`);
      }

      const updated: HouseholdRecord = {
        ...item,
        followUpStatus: 'COMPLETED',
        lastServiceDate: todayStr,
        visitNotes: newNotes,
        updatedAt: new Date().toISOString()
      };

      list[index] = updated;
      this.saveAll(list);
      this.queueSyncItem('COMPLETE_VISIT', { householdId, note, completedAt: todayStr });
      return updated;
    }
    return null;
  }

  public addVisitNote(householdId: string, note: string): boolean {
    const list = this.getAll();
    const index = list.findIndex(h => h.householdId === householdId);
    if (index !== -1 && note.trim()) {
      const item = list[index];
      const todayStr = new Date().toISOString().split('T')[0];
      const updated: HouseholdRecord = {
        ...item,
        visitNotes: [`[${todayStr}] ${note.trim()}`, ...item.visitNotes],
        updatedAt: new Date().toISOString()
      };
      list[index] = updated;
      this.saveAll(list);
      this.queueSyncItem('ADD_NOTE', { householdId, note });
      return true;
    }
    return false;
  }

  public resetDatabase(): HouseholdRecord[] {
    localStorage.removeItem(DB_HOUSEHOLDS_KEY);
    localStorage.removeItem(DB_INITIALIZED_KEY);
    localStorage.removeItem(DB_SYNC_QUEUE_KEY);
    this.inMemoryHouseholds = null;
    return this.initialize();
  }

  private saveAll(households: HouseholdRecord[]): void {
    this.inMemoryHouseholds = households;
    try {
      localStorage.setItem(DB_HOUSEHOLDS_KEY, JSON.stringify(households));
    } catch (e) {
      console.warn('Failed to save to localStorage, in-memory copy preserved:', e);
    }
  }

  // --- SYNC QUEUE MANAGEMENT ---
  public getSyncQueue(): SyncQueueItem[] {
    try {
      return JSON.parse(localStorage.getItem(DB_SYNC_QUEUE_KEY) || '[]');
    } catch {
      return [];
    }
  }

  public clearSyncQueue(): void {
    localStorage.setItem(DB_SYNC_QUEUE_KEY, '[]');
  }

  public queueSyncItem(action: SyncQueueItem['action'], payload: Record<string, unknown>): void {
    const current = this.getSyncQueue();
    const item: SyncQueueItem = {
      id: `SYNC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      action,
      payload,
      timestamp: new Date().toISOString(),
      status: 'PENDING'
    };
    current.push(item);
    localStorage.setItem(DB_SYNC_QUEUE_KEY, JSON.stringify(current));
  }

  public exportCSV(): string {
    const list = this.getAll();
    const headers = [
      'Household ID',
      'Head of Household',
      'Village',
      'Beneficiary Name',
      'Category',
      'Age',
      'Service Required',
      'Last Service Date',
      'Next Due Date',
      'Status',
      'Priority',
      'Priority Reason'
    ];

    const rows = list.map(h => [
      h.householdId,
      `"${h.headOfHousehold.replace(/"/g, '""')}"`,
      h.village,
      `"${h.beneficiaryName.replace(/"/g, '""')}"`,
      h.beneficiaryCategory,
      `"${h.beneficiaryAge}"`,
      `"${h.serviceRequired.replace(/"/g, '""')}"`,
      h.lastServiceDate,
      h.nextDueDate,
      h.followUpStatus,
      h.priority,
      `"${h.priorityReason.replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }

  public exportJSON(): string {
    return JSON.stringify(this.getAll(), null, 2);
  }
}

export const localDB = new LocalHealthDatabase();
