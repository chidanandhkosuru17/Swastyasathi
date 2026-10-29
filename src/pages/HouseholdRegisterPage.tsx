import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  Edit3,
  Check,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { HouseholdRecord, BeneficiaryCategory, PriorityLevel, FollowUpStatus } from '../types';
import { localDB } from '../storage/database';
import { z } from 'zod';

const editRecordSchema = z.object({
  beneficiaryName: z.string().min(2, 'Name must be at least 2 characters'),
  serviceRequired: z.string().min(3, 'Service description required'),
  nextDueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid YYYY-MM-DD date required'),
  priority: z.enum(['URGENT', 'HIGH', 'NORMAL']),
  followUpStatus: z.enum(['PENDING', 'OVERDUE', 'COMPLETED', 'REFERRED'])
});

export const HouseholdRegisterPage: React.FC = () => {
  const [households, setHouseholds] = useState<HouseholdRecord[]>([]);
  const [search, setSearch] = useState('');
  const [villageFilter, setVillageFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Edit record state
  const [editingRecord, setEditingRecord] = useState<HouseholdRecord | null>(null);
  const [editFormData, setEditFormData] = useState({
    beneficiaryName: '',
    serviceRequired: '',
    nextDueDate: '',
    priority: 'NORMAL' as PriorityLevel,
    followUpStatus: 'PENDING' as FollowUpStatus
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = () => {
    const list = localDB.getAll();
    setHouseholds(list);
  };

  const filtered = households.filter(h => {
    if (villageFilter !== 'ALL' && h.village !== villageFilter) return false;
    if (categoryFilter !== 'ALL' && h.beneficiaryCategory !== categoryFilter) return false;
    if (priorityFilter !== 'ALL' && h.priority !== priorityFilter) return false;

    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        h.householdId.toLowerCase().includes(q) ||
        h.beneficiaryName.toLowerCase().includes(q) ||
        h.headOfHousehold.toLowerCase().includes(q) ||
        h.serviceRequired.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const villages = Array.from(new Set(households.map(h => h.village))).sort();

  const handleStartEdit = (h: HouseholdRecord) => {
    setEditingRecord(h);
    setEditFormData({
      beneficiaryName: h.beneficiaryName,
      serviceRequired: h.serviceRequired,
      nextDueDate: h.nextDueDate,
      priority: h.priority,
      followUpStatus: h.followUpStatus
    });
    setValidationError(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    const parseRes = editRecordSchema.safeParse(editFormData);
    if (!parseRes.success) {
      setValidationError(parseRes.error.issues[0]?.message || 'Invalid form input');
      return;
    }

    const updated: HouseholdRecord = {
      ...editingRecord,
      beneficiaryName: editFormData.beneficiaryName,
      serviceRequired: editFormData.serviceRequired,
      nextDueDate: editFormData.nextDueDate,
      priority: editFormData.priority,
      followUpStatus: editFormData.followUpStatus,
      updatedAt: new Date().toISOString()
    };

    localDB.updateHousehold(updated);
    loadHouseholds();
    setEditingRecord(null);
    setValidationError(null);
  };

  const handleDownloadCSV = () => {
    const csvContent = localDB.exportCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `swasthya_synthetic_register_500_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJSON = () => {
    const jsonContent = localDB.exportJSON();
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `swasthya_synthetic_register_500_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Synthetic Data Disclaimer Banner */}
      <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 sm:p-4 text-sky-900 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Synthetic Demonstration Data Notice: </span>
          All 500 records in this register are completely fictional, deterministically generated for prototype testing. No real patient identities, telephone numbers, or confidential clinical records are used.
        </div>
      </div>

      {/* Header & Export Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Frontline Household Register
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse and manage all 500 synthetic families, due services, and field tracking history.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleDownloadCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition shadow-xs"
          >
            <Download className="w-4 h-4 text-teal-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by ID, beneficiary name, head of house, or service..."
              className="w-full pl-9 pr-3 py-2 text-xs text-slate-900 bg-slate-50 rounded-lg border border-slate-200 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-teal-600"
            />
          </div>

          {/* Village Filter */}
          <div>
            <select
              value={villageFilter}
              aria-label="Filter Households by Village"
              onChange={e => {
                setVillageFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold py-2 px-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Villages (7 Areas)</option>
              {villages.map(v => (
                <option key={v} value={v}>Village: {v}</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              aria-label="Filter Households by Category"
              onChange={e => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs font-semibold py-2 px-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Beneficiaries</option>
              <option value="ANC">Pregnant Mother (ANC)</option>
              <option value="INFANT">Infant & Newborn</option>
              <option value="CHILD_U5">Under-5 Child</option>
              <option value="NCD_HTN">Hypertension</option>
              <option value="NCD_DIAB">Diabetes</option>
              <option value="GENERAL">General Welfare</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>Showing <strong>{filtered.length}</strong> of <strong>500</strong> synthetic households</span>
          <span>Page {currentPage} of {totalPages}</span>
        </div>
      </div>

      {/* Households Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4">HH ID</th>
                <th className="py-3 px-4">Beneficiary</th>
                <th className="py-3 px-4">Category & Village</th>
                <th className="py-3 px-4">Service Required</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.map(record => (
                <tr key={record.householdId} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {record.householdId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-slate-900 block">{record.beneficiaryName}</span>
                    <span className="text-[11px] text-slate-500">Head: {record.headOfHousehold}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{record.village}</span>
                    <span className="text-[11px] text-teal-700 font-medium">{record.beneficiaryCategory}</span>
                  </td>
                  <td className="py-3 px-4 max-w-xs truncate" title={record.serviceRequired}>
                    <span className="font-medium text-slate-800">{record.serviceRequired}</span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap font-medium text-slate-600">
                    {record.nextDueDate}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                        record.priority === 'URGENT'
                          ? 'bg-rose-100 text-rose-800'
                          : record.priority === 'HIGH'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {record.priority}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        record.followUpStatus === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : record.followUpStatus === 'OVERDUE'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {record.followUpStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleStartEdit(record)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-teal-50 transition"
                      title="Edit beneficiary record"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-100"
          >
            Previous
          </button>
          <span className="text-slate-500">
            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filtered.length)} of {filtered.length}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-semibold text-slate-700 disabled:opacity-50 hover:bg-slate-100"
          >
            Next
          </button>
        </div>
      </div>

      {/* Edit Beneficiary Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Edit Beneficiary Record ({editingRecord.householdId})
              </h3>
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {validationError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold">
                {validationError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Beneficiary Name</label>
                <input
                  type="text"
                  value={editFormData.beneficiaryName}
                  onChange={e => setEditFormData({ ...editFormData, beneficiaryName: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Required Service</label>
                <input
                  type="text"
                  value={editFormData.serviceRequired}
                  onChange={e => setEditFormData({ ...editFormData, serviceRequired: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-teal-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Next Due Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={editFormData.nextDueDate}
                    onChange={e => setEditFormData({ ...editFormData, nextDueDate: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority Level</label>
                  <select
                    value={editFormData.priority}
                    onChange={e => setEditFormData({ ...editFormData, priority: e.target.value as PriorityLevel })}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-teal-600"
                  >
                    <option value="NORMAL">NORMAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Follow-up Status</label>
                <select
                  value={editFormData.followUpStatus}
                  onChange={e => setEditFormData({ ...editFormData, followUpStatus: e.target.value as FollowUpStatus })}
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-slate-900 focus:outline-hidden focus:border-teal-600"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="OVERDUE">OVERDUE</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="REFERRED">REFERRED</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 transition"
              >
                Save Changes Locally
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
