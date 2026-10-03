import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ChevronRight,
  Download,
  Calendar,
  Layers,
  Sparkles,
  PhoneCall,
  Activity as ActivityIcon,
  Shield,
  FileText
} from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { SUB_COUNTIES, SubCounty } from '../../types/campaign';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Tabs } from '../ui/Tabs';
import { formatNumber, formatDate } from '../../lib/utils';
import { CAMPAIGN_METRICS } from '../../data/mockData';
import { ShadcnExampleModal } from '../modals/ShadcnExampleModal';

export const DashboardPage: React.FC = () => {
  const {
    activities,
    tasks,
    issues,
    team,
    selectedSubCountyFilter,
    setSelectedSubCountyFilter,
    setActivePage,
    openQuickAction
  } = useCampaign();

  const [activeDashboardTab, setActiveDashboardTab] = useState<'overview' | 'analytics' | 'reports' | 'notifications'>('overview');
  const [isShadcnModalOpen, setIsShadcnModalOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  // Sub-County filtered data
  const filteredActivities = activities.filter((a) =>
    selectedSubCountyFilter === 'All' ? true : a.subCounty === selectedSubCountyFilter
  );
  const filteredIssues = issues.filter((i) =>
    selectedSubCountyFilter === 'All' ? true : i.subCounty === selectedSubCountyFilter
  );
  const scheduledActs = filteredActivities.filter((a) => a.status === 'Scheduled');
  const completedActs = filteredActivities.filter((a) => a.status === 'Completed');
  const openIssues = filteredIssues.filter((i) => i.status !== 'Resolved');
  const resolvedIssues = filteredIssues.filter((i) => i.status === 'Resolved');

  const resolutionRate = issues.length > 0
    ? Math.round((issues.filter((i) => i.status === 'Resolved').length / issues.length) * 100)
    : 100;

  // Chart data: Sub-County Voter Outreach target vs reached
  const chartData = [
    { subCounty: 'Turbo', reached: 58200, target: 110000, percentage: 53 },
    { subCounty: 'Soy', reached: 54100, target: 105000, percentage: 51 },
    { subCounty: 'Ainabkoi', reached: 38400, target: 85000, percentage: 45 },
    { subCounty: 'Kapseret', reached: 43600, target: 98000, percentage: 44 },
    { subCounty: 'Moiben', reached: 31200, target: 76000, percentage: 41 },
    { subCounty: 'Kesses', reached: 23000, target: 68000, percentage: 34 }
  ];

  const maxVal = Math.max(...chartData.map((d) => d.reached));

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner: shadcn Example Reference & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1 border-b border-slate-200">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Dashboard
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gubernatorial field mobilization reach, grievance status, and logistics tracking for Uasin Gishu County.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => openQuickAction('activity')}
            className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold"
          >
            + Schedule Event
          </Button>
        </div>
      </div>

      {/* Segmented Sub-Tabs (shadcn Dashboard Style: Overview, Analytics, Reports, Notifications) */}
      <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-lg border border-slate-200/80 w-fit">
        <button
          onClick={() => setActiveDashboardTab('overview')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
            activeDashboardTab === 'overview'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveDashboardTab('analytics')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
            activeDashboardTab === 'analytics'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sub-County Analytics
        </button>
        <button
          onClick={() => setActiveDashboardTab('reports')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap ${
            activeDashboardTab === 'reports'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Community Reports
        </button>
        <button
          onClick={() => setActiveDashboardTab('notifications')}
          className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeDashboardTab === 'notifications'
              ? 'bg-white text-slate-900 shadow-xs font-semibold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Notifications</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
        </button>
      </div>

      {/* TAB 1: OVERVIEW (Mirrors https://ui.shadcn.com/examples/dashboard) */}
      {activeDashboardTab === 'overview' && (
        <div className="space-y-6">
          {/* 4 Metric Cards in 4-column grid (shadcn exact equivalent) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Voter Outreach (equiv. Total Revenue) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Total Voter Outreach
                </CardTitle>
                <Users className="w-4 h-4 text-emerald-800" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {formatNumber(CAMPAIGN_METRICS.contactedVoters)}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <span className="text-emerald-700 font-semibold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5 inline" />
                    +20.1%
                  </span>{' '}
                  from last month
                </p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full"
                    style={{ width: `${(CAMPAIGN_METRICS.contactedVoters / CAMPAIGN_METRICS.registeredVotersTarget) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Card 2: Mobilization Events (equiv. Subscriptions) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Scheduled Events
                </CardTitle>
                <CalendarCheck className="w-4 h-4 text-emerald-800" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  +{activities.filter((a) => a.status === 'Scheduled').length}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <span className="text-emerald-700 font-semibold">+33.3%</span> across 30 wards
                </p>
                <span className="text-[11px] text-slate-400 block mt-2">
                  Next: Ziwa Farmers Forum (Oct 6)
                </span>
              </CardContent>
            </Card>

            {/* Card 3: Grievances Resolved (equiv. Sales) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Grievance Resolution
                </CardTitle>
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  {resolutionRate}%
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <span className="text-emerald-700 font-semibold">+12%</span> policy commitments
                </p>
                <span className="text-[11px] text-slate-400 block mt-2">
                  {issues.filter((i) => i.status === 'Resolved').length} resolved of {issues.length} reported
                </span>
              </CardContent>
            </Card>

            {/* Card 4: Active Field Marshals (equiv. Active Now) */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Active Field Marshals
                </CardTitle>
                <ActivityIcon className="w-4 h-4 text-emerald-800" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
                  +{CAMPAIGN_METRICS.activeFieldVolunteers}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <span className="text-emerald-700 font-semibold">+89</span> newly recruited
                </p>
                <span className="text-[11px] text-slate-400 block mt-2">
                  Across 6 sub-county chapters
                </span>
              </CardContent>
            </Card>
          </div>

          {/* Main 2-Column Split: Overview Chart + Recent Mobilizations (Matches shadcn dashboard) */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {/* Left 4 Cols: Overview Chart */}
            <Card className="lg:col-span-4 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Overview</CardTitle>
                    <CardDescription>
                      Voter contact progress by sub-county (Target vs. Reached)
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-semibold text-emerald-800">
                      Total: {formatNumber(CAMPAIGN_METRICS.contactedVoters)}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Visual SVG/CSS Interactive Bar Chart */}
                <div className="h-64 flex items-end justify-between gap-3 sm:gap-4 pt-6 px-2 border-b border-slate-200">
                  {chartData.map((item) => {
                    const heightPercent = Math.max(12, Math.round((item.reached / maxVal) * 100));
                    const isHovered = hoveredBar === item.subCounty;

                    return (
                      <div
                        key={item.subCounty}
                        className="flex-1 flex flex-col items-center gap-2 group relative cursor-pointer"
                        onMouseEnter={() => setHoveredBar(item.subCounty)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        {/* Hover Tooltip Popover */}
                        {isHovered && (
                          <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] px-2 py-1 rounded shadow-md font-mono whitespace-nowrap pointer-events-none">
                            <strong>{item.subCounty}</strong>: {formatNumber(item.reached)} / {formatNumber(item.target)} ({item.percentage}%)
                          </div>
                        )}

                        {/* Bar */}
                        <div className="w-full max-w-[42px] bg-slate-100 rounded-t-sm flex items-end overflow-hidden h-44">
                          <div
                            className={`w-full rounded-t-sm transition-all duration-300 ${
                              isHovered ? 'bg-emerald-600' : 'bg-slate-900 group-hover:bg-emerald-800'
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          />
                        </div>

                        {/* Label */}
                        <span className="text-[11px] font-medium text-slate-600 group-hover:text-slate-900 truncate max-w-full">
                          {item.subCounty}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-slate-900" />
                      Reached Voters
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-xs bg-slate-200" />
                      Unreached Goal
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">Hover bars to view exact counts</span>
                </div>
              </CardContent>
            </Card>

            {/* Right 3 Cols: Recent Activity Feed (equiv. Recent Sales in shadcn) */}
            <Card className="lg:col-span-3 flex flex-col justify-between">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Mobilizations</CardTitle>
                    <CardDescription>
                      You mobilized 7,350 citizens across 5 wards this cycle.
                    </CardDescription>
                  </div>
                  <button
                    onClick={() => setActivePage('activities')}
                    className="text-xs font-semibold text-emerald-800 hover:underline"
                  >
                    View all &rarr;
                  </button>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {activities.slice(0, 5).map((act) => {
                    const initials = act.coordinatorName
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('');

                    return (
                      <div key={act.id} className="flex items-center justify-between gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                          {initials}
                        </div>

                        {/* Details */}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-slate-500 truncate">
                            {act.ward} Ward · {act.subCounty} · Lead: {act.coordinatorName}
                          </p>
                        </div>

                        {/* Figure */}
                        <div className="text-right shrink-0">
                          <span className="text-xs sm:text-sm font-bold font-mono tabular-nums text-slate-900 block">
                            +{formatNumber(act.estimatedTurnout)}
                          </span>
                          <span className="text-[10px] text-slate-400 block">
                            voters
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sub-County Coverage Matrix */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Sub-County Mobilization Status</CardTitle>
                <CardDescription>
                  Full operational matrix across all 6 administrative sub-counties
                </CardDescription>
              </div>
              <button
                onClick={() => setIsShadcnModalOpen(true)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-700" />
                <span>Compare with shadcn Spec</span>
              </button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-5 px-5">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-medium">
                      <th className="pb-3 pl-1">Sub-County</th>
                      <th className="pb-3 text-right">Activities</th>
                      <th className="pb-3 text-right">Issues Logged</th>
                      <th className="pb-3 text-right">Resolution Rate</th>
                      <th className="pb-3 text-right">Active Volunteers</th>
                      <th className="pb-3 text-right pr-1">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SUB_COUNTIES.map((sc) => {
                      const scActs = activities.filter((a) => a.subCounty === sc);
                      const scIssues = issues.filter((i) => i.subCounty === sc);
                      const scTeam = team.filter((m) => m.subCounty === sc);
                      const resolvedCount = scIssues.filter((i) => i.status === 'Resolved').length;
                      const resRate = scIssues.length > 0 ? Math.round((resolvedCount / scIssues.length) * 100) : 100;
                      const vols = scTeam.reduce((acc, curr) => acc + (curr.volunteersManaged || 0), 0);

                      return (
                        <tr key={sc} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pl-1 font-semibold text-slate-900">
                            <button
                              onClick={() => {
                                setSelectedSubCountyFilter(sc);
                                setActivePage('activities');
                              }}
                              className="hover:text-emerald-800 hover:underline text-left cursor-pointer"
                            >
                              {sc}
                            </button>
                          </td>
                          <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                            {scActs.length}
                          </td>
                          <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                            {scIssues.length}
                          </td>
                          <td className="py-3 text-right">
                            <span className="font-mono tabular-nums font-semibold text-emerald-800">
                              {resRate}%
                            </span>
                          </td>
                          <td className="py-3 text-right font-mono tabular-nums text-slate-700">
                            {vols}
                          </td>
                          <td className="py-3 text-right pr-1">
                            <button
                              onClick={() => {
                                setSelectedSubCountyFilter(sc);
                                setActivePage('activities');
                              }}
                              className="text-xs text-emerald-800 hover:text-emerald-950 font-medium cursor-pointer"
                            >
                              View &rarr;
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: ANALYTICS */}
      {activeDashboardTab === 'analytics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ward Voter Registration vs Outreach Analytics</CardTitle>
              <CardDescription>
                Detailed breakdown of registered voters, mobilized attendees, and turnout velocity by sub-county
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {chartData.map((item) => (
                  <div key={item.subCounty} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm">{item.subCounty} Sub-County</span>
                      <span className="font-mono font-bold text-emerald-800 text-sm">{item.percentage}% Reached</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-800 h-full rounded-full" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Contacted: <strong>{formatNumber(item.reached)}</strong></span>
                      <span>Target: <strong>{formatNumber(item.target)}</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: REPORTS */}
      {activeDashboardTab === 'reports' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Grievance Domain Reports</CardTitle>
              <CardDescription>
                Classification of citizen issues logged across Agriculture, Roads, Health, and Water
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { domain: 'Agriculture & Fertilizer', count: 18, share: '35%', color: 'bg-emerald-700' },
                  { domain: 'Roads & Feeder Bridges', count: 14, share: '27%', color: 'bg-slate-800' },
                  { domain: 'Water & Boreholes', count: 9, share: '18%', color: 'bg-emerald-600' },
                  { domain: 'Dispensary Drugs & Health', count: 6, share: '12%', color: 'bg-red-700' },
                  { domain: 'Youth Bursaries & Poly', count: 4, share: '8%', color: 'bg-slate-600' }
                ].map((item) => (
                  <div key={item.domain} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-900">{item.domain}</span>
                      <span className="font-mono text-slate-600">{item.count} grievances ({item.share})</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: item.share }} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 4: NOTIFICATIONS */}
      {activeDashboardTab === 'notifications' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Field Operations Dispatch Feed</CardTitle>
              <CardDescription>
                Recent alert logs from sub-county field coordinators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Sound Truck Dispatched to Ziwa</span>
                    <span className="text-slate-400">10 mins ago</span>
                  </div>
                  <p className="text-slate-600">Patrick Tanui confirmed PA system testing for the maize farmers forum.</p>
                </div>
                <div className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">New Grievance Logged in Kamagut</span>
                    <span className="text-slate-400">1 hour ago</span>
                  </div>
                  <p className="text-slate-600">Kapsaos-Kamagut culvert blockage reported by local headteacher.</p>
                </div>
                <div className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900">Bodaboda Marshals Briefing Complete</span>
                    <span className="text-slate-400">3 hours ago</span>
                  </div>
                  <p className="text-slate-600">Kevin Koech trained 120 riders on peaceful rally route coordination.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Shadcn Example Spec Modal */}
      <ShadcnExampleModal
        isOpen={isShadcnModalOpen}
        onClose={() => setIsShadcnModalOpen(false)}
      />
    </div>
  );
};
