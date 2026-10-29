import React from 'react';
import { DangerSignRule } from '../types';
import {
  AlertTriangle,
  PhoneCall,
  Ambulance,
  Building2,
  FileText,
  ShieldAlert,
  X
} from 'lucide-react';

interface EmergencyReferralModalProps {
  rule: DangerSignRule;
  onClose: () => void;
  rawTrigger?: string;
}

export const EmergencyReferralModal: React.FC<EmergencyReferralModalProps> = ({
  rule,
  onClose,
  rawTrigger
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border-4 border-rose-600 overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Red Emergency Header */}
        <div className="bg-rose-600 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm bg-white text-rose-700">
                  DETERMINISTIC SAFETY OVERRIDE
                </span>
                <span className="text-xs text-rose-100 font-mono">
                  {rule.id}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mt-0.5">
                IMMEDIATE REFERRAL — DO NOT DELAY
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-rose-700 transition"
            title="Acknowledge and dismiss emergency alert"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Matched Danger Condition */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>Identified Danger Sign: {rule.title}</span>
            </div>
            {rawTrigger && (
              <p className="text-xs text-rose-700 mt-1">
                Trigger keyword matched: <strong className="font-semibold underline">{rawTrigger}</strong>
              </p>
            )}
            <p className="text-xs text-rose-800 mt-2 font-medium">
              Notice: The deterministic safety engine intercepted this query BEFORE any AI model was called. Generative answering is disabled to prevent delay in life-saving care.
            </p>
          </div>

          {/* Immediate Action Instruction */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Primary Mandated Action
            </h3>
            <p className="text-sm font-bold text-slate-900 bg-slate-100 p-3.5 rounded-xl border border-slate-200 leading-relaxed">
              {rule.actionInstruction}
            </p>
          </div>

          {/* Frontline Stabilization Steps */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Frontline Stabilization While Transport Is Mobilized
            </h3>
            <div className="space-y-2">
              {rule.stabilizationGuidance.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Emergency Call Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <a
              href="tel:108"
              className="flex items-center justify-center gap-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-98 text-sm"
            >
              <PhoneCall className="w-4 h-4 animate-pulse" />
              <span>Call 108 Ambulance</span>
            </a>
            <a
              href="tel:102"
              className="flex items-center justify-center gap-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition active:scale-98 text-sm"
            >
              <Ambulance className="w-4 h-4" />
              <span>Call 102 JSSK Transport</span>
            </a>
          </div>

          {/* Target Facility & Transport Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div className="flex items-start gap-2">
              <Building2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Designated Target Facility</span>
                <span className="text-slate-600">{rule.targetFacility}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Ambulance className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800 block">Emergency Dispatch Protocol</span>
                <span className="text-slate-600">{rule.ambulanceContact}</span>
              </div>
            </div>
          </div>

          {/* Official MoHFW Protocol Citation */}
          <div className="border-t border-slate-200 pt-3">
            <div className="flex items-start gap-2 text-[11px] text-slate-500">
              <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700">Official Protocol Citation: </span>
                {rule.sourceDocument} — <span className="font-medium">{rule.sectionReference}</span> (Page {rule.pageNumber}).
                <span className="block text-[10px] text-slate-400 mt-0.5">Approved by: {rule.approvalAuthority}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-500">
            Rule Execution: Immediate Referral Mandated
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition"
          >
            I Acknowledge Emergency Referral
          </button>
        </div>
      </div>
    </div>
  );
};
