import React from 'react';
import {
  LayoutDashboard,
  MessageSquareHeart,
  CalendarCheck2,
  Users,
  BookOpenCheck,
  ShieldAlert,
  Cpu,
  Settings,
  Wifi,
  WifiOff,
  Plane
} from 'lucide-react';
import { SupportedLanguage } from '../types';
import { UI_TRANSLATIONS } from '../utils/translations';
import { PWAInstallButton } from './PWAInstallButton';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  isOnline: boolean;
  isSimulatingOffline: boolean;
  toggleSimulateOffline: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  isOnline,
  isSimulatingOffline,
  toggleSimulateOffline
}) => {
  const t = UI_TRANSLATIONS[language];

  const navItems = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'ask', label: t.navAsk, icon: MessageSquareHeart },
    { id: 'planner', label: t.navPlanner, icon: CalendarCheck2 },
    { id: 'households', label: t.navHouseholds, icon: Users },
    { id: 'protocols', label: t.navProtocols, icon: BookOpenCheck },
    { id: 'escalation', label: t.navEscalation, icon: ShieldAlert },
    { id: 'diagnostics', label: t.navDiagnostics, icon: Cpu },
    { id: 'settings', label: t.navSettings, icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Banner: Branding + Connectivity Status + Language + Airplane Simulation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Name */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('dashboard')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-800 to-teal-600 flex items-center justify-center shadow-md text-white font-black text-xl group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">स्व</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-slate-900 tracking-tight">
                  {t.brandName}
                </span>
                <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200">
                  ASHA / ANM
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden md:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Controls: Online/Offline Badge + Airplane Mode Toggle + Language Selector + PWA Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Online / Offline status badge */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">{t.statusOnline}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                  <span>{t.statusOffline}</span>
                </>
              )}
            </div>

            {/* Offline Simulation Button for Evaluators */}
            <button
              onClick={toggleSimulateOffline}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition border ${
                isSimulatingOffline
                  ? 'bg-amber-600 text-white border-amber-700 hover:bg-amber-700'
                  : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
              }`}
              title="Test offline behavior directly in your browser"
            >
              <Plane className={`w-3.5 h-3.5 ${isSimulatingOffline ? 'rotate-45' : ''}`} />
              <span className="hidden md:inline">
                {isSimulatingOffline ? 'Exit Offline Sim' : 'Simulate Offline'}
              </span>
            </button>

            {/* Language Selector */}
            <select
              value={language}
              aria-label="Select Application Language"
              onChange={e => setLanguage(e.target.value as SupportedLanguage)}
              className="text-xs font-semibold bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-2 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-teal-500"
            >
              <option value="en">English (EN)</option>
              <option value="hi">हिंदी (HI)</option>
              <option value="te">తెలుగు (TE)</option>
            </select>

            {/* PWA Install Button */}
            <PWAInstallButton />
          </div>
        </div>

        {/* Navigation Tabs - Horizontal Scrollable for Mobile */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-100">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors min-h-[40px] ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
