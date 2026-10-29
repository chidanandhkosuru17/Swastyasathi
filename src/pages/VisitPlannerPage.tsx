import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Check,
  Plus,
  X,
  FileText
} from 'lucide-react';
import { HouseholdRecord, PriorityLevel, FollowUpStatus } from '../types';
import { localDB } from '../storage/database';
import { filterPlannerVisits, calculateSummaryMetrics, PlannerSummaryMetrics } from '../planner/dueDateEngine';

interface VisitPlannerPageProps {
  initialPriorityFilter?: PriorityLevel | 'ALL';
}

export const VisitPlannerPage: React.FC<VisitPlannerPageProps> = ({
  initialPriorityFilter
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const [households, setHouseholds] = useState<HouseholdRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [priorityFilter, setPriorityFilter] = useState<PriorityLevel | 'ALL'>(initialPriorityFilter || 'ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<FollowUpStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [metrics, setMetrics] = useState<PlannerSummaryMetrics | null>(null);

  // Note Modal state
  const [activeModalHousehold, setActiveModalHousehold] = useState<HouseholdRecord | null>(null);
  const [modalNoteText, setModalNoteText] = useState('');
  const [isCompletingVisit, setIsCompletingVisit] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const all = localDB.getAll();
    setHouseholds(all);
    const m = calculateSummaryMetrics(all, selectedDate);
    setMetrics(m);
  };

  useEffect(() => {
    if (households.length > 0) {
      setMetrics(calculateSummaryMetrics(households, selectedDate));
    }
  }, [selectedDate, households]);

  const filteredVisits = filterPlannerVisits(households, {
    date: selectedDate,
    category: categoryFilter,
    priority: priorityFilter,
    status: statusFilter,
    village: 'ALL',
    searchQuery
  });

  const handleMarkComplete = (record: HouseholdRecord) => {
    setActiveModalHousehold(record);
    setIsCompletingVisit(true);
    setModalNoteText('');
  };

  const handleAddNoteOnly = (record: HouseholdRecord) => {
    setActiveModalHousehold(record);
    setIsCompletingVisit(false);
    setModalNoteText('');
  };

  const handleSaveModal = () => {
    if (!activeModalHousehold) return;

    if (isCompletingVisit) {
      localDB.markVisitCompleted(activeModalHousehold.householdId, modalNoteText);
    } else {
      localDB.addVisitNote(activeModalHousehold.householdId, modalNoteText);
    }

    loadData();
    setActiveModalHousehold(null);
    setModalNoteText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Daily Household Visit Planner
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Prioritised field schedule generated entirely from the 500-household local register.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-teal-700 shrink-0" />
          <span className="text-xs font-semibold text-slate-600">Target Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden cursor-pointer"
          />
          {selectedDate !== todayStr && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md hover:bg-teal-100 ml-1"
            >
              Today
            </button>
          )}
        </div>
      </div>

      {/* Summary Statistics Bar */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="border-r border-slate-100 pr-3">
            <span className="text-[11px] font-semibold text-slate-500 block">Due for {selectedDate}</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-slate-900">{metrics.dueTodayCount}</span>
              <span className="text-xs text-slate-400">visits</span>
            </div>
          </div>
          <div className="border-r border-slate-100 pr-3">
            <span className="text-[11px] font-semibold text-amber-600 block">Overdue Action</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-amber-700">{metrics.overdueCount}</span>
              <span className="text-xs text-amber-600 font-medium">pending</span>
            </div>
          </div>
          <div className="border-r border-slate-100 pr-3">
            <span className="text-[11px] font-semibold text-rose-600 block">Urgent Priority</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-rose-700">{metrics.urgentCount}</span>
              <span className="text-xs text-rose-600 font-medium">high risk</span>
            </div>
          </div>
          <div>
            <span className="text-[11px] font-semibold text-emerald-600 block">Total Completed</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-emerald-700">{metrics.completedCount}</span>
              <span className="text-xs text-emerald-600 font-medium">in register</span>
            </div>
          </div>
        </div>
      )}

      {/* Filters & Search Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search beneficiary, household ID, or service..."
              className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              aria-label="Filter Visits by Priority"
              onChange={e => setPriorityFilter(e.target.value as PriorityLevel | 'ALL')}
              className="w-full text-xs font-semibold py-2 px-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Priorities</option>
              <option value="URGENT">Urgent Only</option>
              <option value="HIGH">High Priority</option>
              <option value="NORMAL">Normal Routine</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              aria-label="Filter Visits by Category"
              onChange={e => setCategoryFilter(e.target.value)}
              className="w-full text-xs font-semibold py-2 px-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Categories</option>
              <option value="ANC">Pregnant Mother (ANC)</option>
              <option value="INFANT">Infant & Newborn</option>
              <option value="CHILD_U5">Under-5 Child</option>
              <option value="NCD_HTN">Hypertension</option>
              <option value="NCD_DIAB">Diabetes</option>
              <option value="GENERAL">General Welfare</option>
            </select>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-500 font-medium">Displaying:</span>
          <span className="font-bold text-slate-900">{filteredVisits.length} visits matched</span>
          {(priorityFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setPriorityFilter('ALL');
                setCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[11px] text-teal-700 hover:underline font-semibold ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Visit Cards List */}
      <div className="space-y-3">
        {filteredVisits.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <CheckCircle className="w-10 h-10 text-teal-600 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Visits Match This Selection</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Either all visits for this date are completed, or the selected filter criteria yielded no records. Try selecting "All Priorities" or another date.
            </p>
          </div>
        ) : (
          filteredVisits.map(visit => {
            const isCompleted = visit.followUpStatus === 'COMPLETED';
            const isOverdue = visit.followUpStatus === 'OVERDUE' || (visit.nextDueDate < selectedDate && !isCompleted);

            return (
              <div
                key={visit.householdId}
                className={`bg-white rounded-xl border p-4 sm:p-5 shadow-xs transition hover:shadow-md ${
                  visit.priority === 'URGENT'
                    ? 'border-rose-300 bg-rose-50/20'
                    : visit.priority === 'HIGH'
                    ? 'border-amber-200 bg-amber-50/15'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  {/* Left: Beneficiary & Service Info */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                        {visit.householdId}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {visit.beneficiaryName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        ({visit.beneficiaryAge}) • {visit.village}
                      </span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {visit.beneficiaryCategory}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900">
                      {visit.serviceRequired}
                    </h3>

                    {/* Priority & Transparent Reason */}
                    <div className="flex items-start gap-1.5 text-xs">
                      <span
                        className={`font-black text-[10px] px-2 py-0.5 rounded-sm uppercase tracking-wider shrink-0 mt-0.5 ${
                          visit.priority === 'URGENT'
                            ? 'bg-rose-600 text-white'
                            : visit.priority === 'HIGH'
                            ? 'bg-amber-600 text-white'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {visit.priority}
                      </span>
                      <span className="text-slate-600 font-medium">
                        Reason: {visit.priorityReason}
                      </span>
                    </div>

                    {/* Due Date & Last Service Date */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                      <span><strong>Next Due:</strong> {visit.nextDueDate}</span>
                      <span><strong>Last Visit:</strong> {visit.lastServiceDate}</span>
                      {isOverdue && !isCompleted && (
                        <span className="font-bold text-amber-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Overdue</span>
                        </span>
                      )}
                      {isCompleted && (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Completed</span>
                        </span>
                      )}
                    </div>

                    {/* Historical Notes preview */}
                    {visit.visitNotes.length > 0 && (
                      <div className="pt-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Latest Note: </span>
                        <span className="italic">{visit.visitNotes[0]}</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-center">
                    {!isCompleted ? (
                      <button
                        onClick={() => handleMarkComplete(visit)}
                        className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Complete Visit</span>
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl text-center">
                        Done
                      </span>
                    )}

                    <button
                      onClick={() => handleAddNoteOnly(visit)}
                      className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Note</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Note & Visit Completion Modal */}
      {activeModalHousehold && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-base text-slate-900">
                  {isCompletingVisit ? 'Complete Field Visit' : 'Add Beneficiary Field Note'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalHousehold(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <p><strong>Beneficiary:</strong> {activeModalHousehold.beneficiaryName} ({activeModalHousehold.householdId})</p>
              <p><strong>Service:</strong> {activeModalHousehold.serviceRequired}</p>
              <p><strong>Village:</strong> {activeModalHousehold.village}</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Field Observation / Counselling Note
              </label>
              <textarea
                rows={3}
                value={modalNoteText}
                onChange={e => setModalNoteText(e.target.value)}
                placeholder="e.g. Verified vitals, IFA tablets supplied for 30 days, counselled on complementary feeding..."
                className="w-full text-xs text-slate-900 placeholder:text-slate-400 p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-teal-600"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModalHousehold(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveModal}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition active:scale-95"
              >
                {isCompletingVisit ? 'Save & Mark Completed' : 'Save Field Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
