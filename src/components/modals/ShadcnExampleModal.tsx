import React from 'react';
import { Dialog } from '../ui/Dialog';
import { ExternalLink, CheckCircle2, Layers, BarChart3, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface ShadcnExampleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShadcnExampleModal: React.FC<ShadcnExampleModalProps> = ({ isOpen, onClose }) => {
  const comparisons = [
    {
      shadcnElement: 'Workspace / Team Switcher',
      original: 'Alicia Koch / Acme Inc. dropdown',
      campaignApp: 'Uasin Gishu County 2027 Campaign HQ switcher in left sidebar',
      status: 'Implemented in left sidebar'
    },
    {
      shadcnElement: 'Main Navigation Placement',
      original: 'Left sidebar navigation with icon + label + badge counts',
      campaignApp: 'Full-height left sidebar with Dashboard, Activities, Tasks, Issues, Team & Sub-County filters',
      status: 'Moved from top to left'
    },
    {
      shadcnElement: 'Top Action Bar',
      original: 'Search input, UserNav avatar, Date Range Picker ("Jan 20 - Feb 09"), Download button',
      campaignApp: 'Search, Date Range filter ("Oct 01 - Oct 31, 2026"), Download CSV button, "+ New Action"',
      status: 'Matches layout contract'
    },
    {
      shadcnElement: 'Segmented Section Tabs',
      original: 'Overview, Analytics, Reports, Notifications',
      campaignApp: 'Overview, Sub-County Analytics, Community Reports, Field Notifications',
      status: 'Fully switchable tabs'
    },
    {
      shadcnElement: '4 Metric Cards with Delta',
      original: 'Total Revenue ($45,231.89 +20.1%), Subscriptions (+2350 +180.1%), Sales (+12,234 +19%), Active Now (+573 +201)',
      campaignApp: 'Total Voter Outreach (248,500 +20.1%), Scheduled Events (+12 +33%), Grievance Resolution (74.2% +12%), Field Marshals (647 +16%)',
      status: 'Tabular numbers & deltas'
    },
    {
      shadcnElement: 'Main Chart Component',
      original: 'Overview Bar Chart displaying monthly financial distribution',
      campaignApp: 'Sub-County Outreach Bar Chart with interactive hover states comparing Turbo, Soy, Ainabkoi, Kapseret, Moiben, Kesses',
      status: 'High-density bar chart'
    },
    {
      shadcnElement: 'Right Activity Feed',
      original: 'Recent Sales with user avatar, name, email, transaction figure (+$1,999.00)',
      campaignApp: 'Recent Mobilizations with coordinator initials, name, ward, event type, and turnout (e.g. +2,500 voters)',
      status: 'Clean feed list'
    }
  ];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="shadcn/ui Dashboard Architecture Comparison"
      description="How County Campaign Manager aligns with the official https://ui.shadcn.com/examples/dashboard structure."
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Direct Link Banner */}
        <div className="p-4 bg-slate-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <Layers className="w-4 h-4" />
              <span>REFERENCE ARCHITECTURE SPEC</span>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm">
              Explore the official shadcn/ui dashboard template live:
            </p>
            <span className="text-xs font-mono text-slate-400 block truncate">
              https://ui.shadcn.com/examples/dashboard
            </span>
          </div>

          <a
            href="https://ui.shadcn.com/examples/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold shrink-0 transition-colors"
          >
            <span>Open shadcn.com</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Feature comparison table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/90 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">shadcn/ui Dashboard Spec</th>
                  <th className="py-2.5 px-3">Original Example</th>
                  <th className="py-2.5 px-3">Campaign Manager Adaptation</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisons.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {row.shadcnElement}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">
                      {row.original}
                    </td>
                    <td className="py-2.5 px-3 text-emerald-950 font-medium">
                      {row.campaignApp}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="default" size="sm" onClick={onClose} className="bg-slate-900 text-white">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
