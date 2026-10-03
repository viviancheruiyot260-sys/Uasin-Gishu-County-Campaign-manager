import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  MessageSquareWarning,
  Users2,
  MapPin,
  HelpCircle,
  RotateCcw,
  Plus,
  ChevronDown,
  Building2,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';
import { useCampaign, PageView } from '../../context/CampaignContext';
import { SUB_COUNTIES, SubCounty } from '../../types/campaign';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

interface SidebarProps {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpenOnMobile = false,
  onCloseMobile
}) => {
  const {
    activePage,
    setActivePage,
    selectedSubCountyFilter,
    setSelectedSubCountyFilter,
    activities,
    tasks,
    issues,
    team,
    openQuickAction,
    setIsTestGuideOpen,
    resetToDefaultData
  } = useCampaign();

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed').length;
  const openIssues = issues.filter((i) => i.status !== 'Resolved').length;
  const scheduledActs = activities.filter((a) => a.status === 'Scheduled').length;

  const navItems = [
    {
      id: 'dashboard' as PageView,
      label: 'Dashboard',
      icon: LayoutDashboard,
      description: 'Overview & Analytics'
    },
    {
      id: 'activities' as PageView,
      label: 'Activities & Rallies',
      icon: CalendarCheck,
      count: scheduledActs,
      description: 'Town halls & events'
    },
    {
      id: 'tasks' as PageView,
      label: 'Field Tasks',
      icon: CheckSquare,
      count: pendingTasks,
      description: 'Logistics & security'
    },
    {
      id: 'issues' as PageView,
      label: 'Community Issues',
      icon: MessageSquareWarning,
      count: openIssues,
      description: 'Citizen grievances'
    },
    {
      id: 'team' as PageView,
      label: 'Campaign Team',
      icon: Users2,
      count: team.length,
      description: 'Leads & coordinators'
    }
  ];

  const handleNavClick = (page: PageView) => {
    setActivePage(page);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenOnMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top: Team / Campaign Workspace Switcher (shadcn style) */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-extrabold text-sm shrink-0 shadow-xs border border-emerald-900">
                UG
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900 truncate">
                    County Campaign
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    2027
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  Uasin Gishu County HQ
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Action Button right in sidebar */}
          <div className="mt-3">
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                openQuickAction('activity');
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold justify-center gap-2 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Entry</span>
            </Button>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
          {/* Main App Pages */}
          <div className="space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Operations Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer select-none text-left ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-semibold border border-emerald-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-emerald-800' : 'text-slate-400'
                      }`}
                    />
                    <div className="truncate">
                      <span className="block truncate">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block font-normal">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`text-[11px] font-mono tabular-nums px-2 py-0.5 rounded-full text-xs font-bold ${
                        isActive
                          ? 'bg-emerald-800 text-white'
                          : 'bg-slate-200/70 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub-County Quick Filter Jump */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between px-3 pb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sub-County Focus
              </span>
              {selectedSubCountyFilter !== 'All' && (
                <button
                  onClick={() => setSelectedSubCountyFilter('All')}
                  className="text-[11px] text-emerald-800 hover:underline font-medium"
                >
                  Clear
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setSelectedSubCountyFilter('All');
                setActivePage('dashboard');
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                selectedSubCountyFilter === 'All'
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>All 6 Sub-Counties</span>
              <span className="text-[10px] font-mono opacity-80">30 Wards</span>
            </button>

            {SUB_COUNTIES.map((sc) => {
              const isSelected = selectedSubCountyFilter === sc;
              const count = activities.filter((a) => a.subCounty === sc).length;

              return (
                <button
                  key={sc}
                  onClick={() => {
                    setSelectedSubCountyFilter(sc);
                    setActivePage('dashboard');
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors text-left ${
                    isSelected
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin
                      className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-slate-400'}`}
                    />
                    <span>{sc}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono tabular-nums px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {count} events
                  </span>
                </button>
              );
            })}
          </div>

          {/* Documentation & Testing link */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Prototype Tools
            </div>

            <button
              onClick={() => {
                setIsTestGuideOpen(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-700 hover:bg-slate-100 font-medium transition-colors"
            >
              <HelpCircle className="w-4 h-4 text-emerald-700" />
              <span>How to Test All Features</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all sample campaign data to default?')) {
                  resetToDefaultData();
                  if (onCloseMobile) onCloseMobile();
                }
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>

        {/* Footer: User / Candidate Profile */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-slate-800">
              KK
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-bold text-xs text-slate-900 block truncate">
                Hon. Dr. Kiprono Kiprop
              </span>
              <span className="text-[11px] text-emerald-800 font-medium block truncate">
                Gubernatorial Candidate
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
