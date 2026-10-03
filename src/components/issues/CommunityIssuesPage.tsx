import React, { useState } from 'react';
import {
  MessageSquareWarning,
  Plus,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  MapPin,
  Calendar,
  User,
  ArrowRight,
  Clock,
  Sparkles,
  X,
  FileEdit
} from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { CommunityIssue, IssueCategory, IssuePriority, IssueStatus, SUB_COUNTIES, SubCounty } from '../../types/campaign';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { Dialog } from '../ui/Dialog';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';

export const CommunityIssuesPage: React.FC = () => {
  const { issues, addIssue, updateIssueStatus, openQuickAction } = useCampaign();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState<SubCounty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<IssueStatus | 'All'>('All');
  const [selectedPriority, setSelectedPriority] = useState<IssuePriority | 'All'>('All');
  const [selectedCategory, setSelectedCategory] = useState<IssueCategory | 'All'>('All');

  // Detail / Status update modal
  const [activeIssue, setActiveIssue] = useState<CommunityIssue | null>(null);
  const [editStatus, setEditStatus] = useState<IssueStatus>('Reported');
  const [editNotes, setEditNotes] = useState('');

  const openIssueModal = (issue: CommunityIssue) => {
    setActiveIssue(issue);
    setEditStatus(issue.status);
    setEditNotes(issue.actionPlanNotes || '');
  };

  const handleSaveIssueStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeIssue) return;

    updateIssueStatus(activeIssue.id, editStatus, editNotes);
    showToast(`Updated "${activeIssue.title.slice(0, 24)}..." to ${editStatus}.`, 'success');
    setActiveIssue({
      ...activeIssue,
      status: editStatus,
      actionPlanNotes: editNotes
    });
  };

  // Filter issues
  const filteredIssues = issues.filter((issue) => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.reportedBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubCounty = selectedSubCounty === 'All' || issue.subCounty === selectedSubCounty;
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
    const matchesPriority = selectedPriority === 'All' || issue.priority === selectedPriority;
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;

    return matchesSearch && matchesSubCounty && matchesStatus && matchesPriority && matchesCategory;
  });

  const criticalCount = issues.filter((i) => i.priority === 'Critical' && i.status !== 'Resolved').length;
  const resolvedCount = issues.filter((i) => i.status === 'Resolved').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Community Issues &amp; Grievances
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ward-level citizen feedback: fertilizer access, road washouts, dispensary supplies, and water kiosks.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => openQuickAction('issue')}
          className="bg-emerald-800 text-white hover:bg-emerald-900"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Log Citizen Issue
        </Button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-white border-l-4 border-l-emerald-700">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-slate-500">Total Logged Grievances</span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {issues.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">From 30 county wards</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-red-600">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-slate-500">Critical / Urgent Action</span>
            <div className="text-2xl font-bold text-red-700 font-mono tabular-nums mt-0.5">
              {criticalCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Immediate rally talking points</span>
          </CardContent>
        </Card>

        <Card className="bg-white border-l-4 border-l-slate-700">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-slate-500">Addressed / Manifest Action Planned</span>
            <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-0.5">
              {resolvedCount}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Included in county policy roadmap</span>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search issues by ward, title, description, or reporting citizen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-700 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedSubCounty}
                onChange={(e) => setSelectedSubCounty(e.target.value as SubCounty | 'All')}
                aria-label="Filter by Sub-County"
                className="text-xs h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="All">All Sub-Counties</option>
                {SUB_COUNTIES.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as IssueStatus | 'All')}
                aria-label="Filter by Status"
                className="text-xs h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Reported">Reported</option>
                <option value="Assessing">Assessing</option>
                <option value="Action Planned">Action Planned</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value as IssuePriority | 'All')}
                aria-label="Filter by Priority"
                className="text-xs h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              {(selectedSubCounty !== 'All' || selectedStatus !== 'All' || selectedPriority !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSubCounty('All');
                    setSelectedStatus('All');
                    setSelectedPriority('All');
                    setSelectedCategory('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issues List */}
      {filteredIssues.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <MessageSquareWarning className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No community issues found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or log a new citizen issue directly from your ward outreach.
          </p>
          <div className="mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => openQuickAction('issue')}
              className="bg-emerald-800 text-white"
            >
              Log Citizen Issue
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredIssues.map((issue) => {
            const isResolved = issue.status === 'Resolved';
            const isCritical = issue.priority === 'Critical';

            return (
              <Card
                key={issue.id}
                className="hover:border-slate-300 transition-all bg-white"
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="space-y-3">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-slate-900">{issue.category}</span>
                        <span>·</span>
                        <span className="text-emerald-800 font-semibold">{issue.subCounty}</span>
                        <span>·</span>
                        <span>{issue.ward} Ward</span>
                        <span>·</span>
                        <span>{formatDate(issue.reportedDate)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            isCritical
                              ? 'danger'
                              : issue.priority === 'High'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {issue.priority} Priority
                        </Badge>

                        <Badge
                          variant={
                            isResolved
                              ? 'success'
                              : issue.status === 'Action Planned'
                              ? 'default'
                              : 'neutral'
                          }
                        >
                          {issue.status}
                        </Badge>
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => openIssueModal(issue)}
                      className="text-base font-bold text-slate-900 hover:text-emerald-800 cursor-pointer transition-colors leading-snug"
                    >
                      {issue.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {issue.description}
                    </p>

                    {/* Action plan note if exists */}
                    {issue.actionPlanNotes && (
                      <div className="bg-slate-50 border border-slate-200/80 rounded p-2.5 text-xs text-slate-700">
                        <span className="font-semibold text-slate-900 block mb-0.5">
                          Campaign Action / Manifest Commitment:
                        </span>
                        {issue.actionPlanNotes}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 gap-2">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Reported by: <strong>{issue.reportedBy}</strong></span>
                        {issue.reporterContact && (
                          <span className="text-slate-400 font-mono">({issue.reporterContact})</span>
                        )}
                      </div>

                      <button
                        onClick={() => openIssueModal(issue)}
                        className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        Update Resolution Plan &rarr;
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Issue Detail & Status Updater Modal */}
      {activeIssue && (
        <Dialog
          isOpen={!!activeIssue}
          onClose={() => setActiveIssue(null)}
          title="Community Grievance Resolution"
          description={`${activeIssue.category} · ${activeIssue.ward} Ward (${activeIssue.subCounty})`}
          maxWidth="lg"
        >
          <form onSubmit={handleSaveIssueStatus} className="space-y-4">
            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">{activeIssue.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{activeIssue.description}</p>
              <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                Reported by <strong>{activeIssue.reportedBy}</strong> on {formatDate(activeIssue.reportedDate)}
                {activeIssue.reporterContact && ` · Phone: ${activeIssue.reporterContact}`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Update Workflow Status"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as IssueStatus)}
              >
                <option value="Reported">Reported (Under Initial Review)</option>
                <option value="Assessing">Assessing (Field Team Dispatched)</option>
                <option value="Action Planned">Action Planned (Committed to Policy)</option>
                <option value="Resolved">Resolved (Addressed in Manifesto/Action)</option>
              </Select>

              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-1.5">
                  Priority Rating
                </label>
                <div className="h-10 px-3 flex items-center bg-slate-100 rounded-md text-xs font-bold text-slate-700">
                  {activeIssue.priority} Priority
                </div>
              </div>
            </div>

            <Textarea
              label="Campaign Action Plan / Response Notes"
              placeholder="Record candidate commitment, policy stance, or field engineer assessment..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              rows={3}
            />

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveIssue(null)}
              >
                Close
              </Button>
              <Button type="submit" variant="default" className="bg-emerald-800 text-white">
                Save &amp; Update Status
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
};
