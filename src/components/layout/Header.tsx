import React, { useState } from 'react';
import {
  Menu,
  Search,
  Download,
  Plus,
  HelpCircle,
  ChevronDown,
  Bell
} from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const {
    activePage,
    setActivePage,
    openQuickAction,
    setIsTestGuideOpen,
    activities,
    issues,
    tasks
  } = useCampaign();
  const { showToast } = useToast();

  const [isExporting, setIsExporting] = useState(false);

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Overview',
      subtitle: 'Real-time campaign metrics, mobilization reach & field operations'
    },
    activities: {
      title: 'Campaign Activities',
      subtitle: 'Scheduled rallies, town halls, bodaboda forums & barazas'
    },
    tasks: {
      title: 'Field Logistics & Tasks',
      subtitle: 'Operational checklists, security protocols & volunteer dispatches'
    },
    issues: {
      title: 'Community Issues',
      subtitle: 'Citizen grievances, ward feedback & manifesto policy commitments'
    },
    team: {
      title: 'Campaign Team & Field Leads',
      subtitle: 'Directory of sub-county leads, youth organizers & logistics marshals'
    }
  };

  const current = pageTitles[activePage] || {
    title: 'County Campaign Manager',
    subtitle: 'Uasin Gishu County Prototype'
  };

  const handleExportData = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const csvData = [
        ['Type', 'Title', 'SubCounty', 'Ward', 'Status'],
        ...activities.map((a) => ['Activity', a.title, a.subCounty, a.ward, a.status]),
        ...issues.map((i) => ['Issue', i.title, i.subCounty, i.ward, i.status]),
        ...tasks.map((t) => ['Task', t.title, t.subCounty || '', t.ward || '', t.status])
      ]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');

      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `uasin_gishu_campaign_summary_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Campaign operational CSV exported successfully!', 'success');
    }, 600);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Left Zone: Mobile Hamburger + Current Title & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Mobile Hamburger toggle */}
            <button
              onClick={onOpenMobileSidebar}
              className="lg:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
              aria-label="Open navigation sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title display */}
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <span className="hidden sm:inline">Uasin Gishu 2027</span>
                <span className="hidden sm:inline">/</span>
                <span className="text-emerald-800 font-semibold capitalize">
                  {activePage}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                {current.title}
              </h1>
            </div>
          </div>

          {/* Right Zone: actions and tools */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Export CSV / Download Button (shadcn style) */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              isLoading={isExporting}
              className="hidden sm:inline-flex text-slate-700 border-slate-300 text-xs gap-1.5 shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </Button>

            {/* Test Guide Modal Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTestGuideOpen(true)}
              className="text-slate-700 border-slate-300 text-xs gap-1 shadow-2xs"
            >
              <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">How to Test</span>
              <span className="sm:hidden">Guide</span>
            </Button>

            {/* Record New Action Button */}
            <Button
              variant="default"
              size="sm"
              onClick={() => openQuickAction('activity')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Action</span>
              <span className="sm:hidden">New</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
