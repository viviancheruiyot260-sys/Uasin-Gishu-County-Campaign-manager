import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  X,
  Phone,
  FileText
} from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { Activity, ActivityStatus, ActivityType, SUB_COUNTIES, SubCounty } from '../../types/campaign';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDate, formatNumber } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';
import { Dialog } from '../ui/Dialog';

export const ActivitiesPage: React.FC = () => {
  const { activities, updateActivityStatus, openQuickAction } = useCampaign();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState<SubCounty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ActivityStatus | 'All'>('All');
  const [selectedType, setSelectedType] = useState<ActivityType | 'All'>('All');

  // Selected activity for detail modal
  const [viewActivity, setViewActivity] = useState<Activity | null>(null);

  // Filtering
  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.coordinatorName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubCounty = selectedSubCounty === 'All' || act.subCounty === selectedSubCounty;
    const matchesStatus = selectedStatus === 'All' || act.status === selectedStatus;
    const matchesType = selectedType === 'All' || act.type === selectedType;

    return matchesSearch && matchesSubCounty && matchesStatus && matchesType;
  });

  const handleStatusChange = (id: string, newStatus: ActivityStatus, title: string) => {
    updateActivityStatus(id, newStatus);
    showToast(`Activity "${title}" updated to ${newStatus}.`, 'success');
    if (viewActivity && viewActivity.id === id) {
      setViewActivity({ ...viewActivity, status: newStatus });
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Campaign Activities & Rallies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Rallies, town halls, bodaboda barazas and grassroots engagements across Uasin Gishu.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="md"
            onClick={() => openQuickAction('activity')}
            className="bg-emerald-800 text-white hover:bg-emerald-900"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Schedule Activity
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search activities by title, venue, ward, or coordinator..."
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

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Sub-County Filter */}
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

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ActivityStatus | 'All')}
                aria-label="Filter by Status"
                className="text-xs h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Postponed">Postponed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Reset Filters */}
              {(selectedSubCounty !== 'All' || selectedStatus !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSubCounty('All');
                    setSelectedStatus('All');
                    setSelectedType('All');
                    setSearchQuery('');
                  }}
                  className="text-xs text-slate-500 hover:text-slate-900 underline px-2 py-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Quick Result Counter */}
          <div className="text-xs text-slate-500 pt-1 flex items-center justify-between border-t border-slate-100">
            <span>
              Showing <strong className="text-slate-800">{filteredActivities.length}</strong> of{' '}
              {activities.length} campaign events
            </span>
            <span className="font-mono tabular-nums">
              Total Expected Outreach:{' '}
              {formatNumber(
                filteredActivities.reduce((acc, curr) => acc + (curr.estimatedTurnout || 0), 0)
              )}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Activities Grid */}
      {filteredActivities.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No activities match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or schedule a new event for this sub-county.
          </p>
          <div className="mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => openQuickAction('activity')}
              className="bg-emerald-800 text-white"
            >
              Schedule New Activity
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredActivities.map((act) => {
            const isCompleted = act.status === 'Completed';
            const isPostponed = act.status === 'Postponed';

            return (
              <Card
                key={act.id}
                className="hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <CardContent className="p-5 space-y-3">
                  {/* Top Metadata */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-emerald-800">{act.type}</span>
                      <span>·</span>
                      <span>{act.subCounty}</span>
                      <span>·</span>
                      <span className="font-medium text-slate-700">{act.ward} Ward</span>
                    </div>

                    <Badge
                      variant={
                        isCompleted
                          ? 'success'
                          : isPostponed
                          ? 'warning'
                          : act.status === 'Cancelled'
                          ? 'danger'
                          : 'default'
                      }
                    >
                      {act.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setViewActivity(act)}
                    className="text-base font-bold text-slate-900 hover:text-emerald-800 cursor-pointer transition-colors leading-snug"
                  >
                    {act.title}
                  </h3>

                  {/* Agenda snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {act.keyAgenda}
                  </p>

                  {/* Details matrix */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{formatDate(act.date)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{act.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{act.venue}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono tabular-nums">
                        ~{formatNumber(act.estimatedTurnout)} attendees
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      Coord: <strong>{act.coordinatorName}</strong>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                    <button
                      onClick={() => setViewActivity(act)}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 cursor-pointer"
                    >
                      View Details &amp; Notes
                    </button>

                    <div className="flex items-center gap-1.5">
                      {act.status !== 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(act.id, 'Completed', act.title)}
                          className="px-2 py-1 text-[11px] font-medium text-emerald-800 hover:bg-emerald-50 rounded border border-emerald-300 transition-colors cursor-pointer"
                        >
                          Mark Completed
                        </button>
                      )}
                      {act.status === 'Scheduled' && (
                        <button
                          onClick={() => handleStatusChange(act.id, 'Postponed', act.title)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded border border-slate-300 transition-colors cursor-pointer"
                        >
                          Postpone
                        </button>
                      )}
                      {act.status === 'Completed' && (
                        <button
                          onClick={() => handleStatusChange(act.id, 'Scheduled', act.title)}
                          className="px-2 py-1 text-[11px] font-medium text-slate-600 hover:bg-slate-100 rounded border border-slate-300 transition-colors cursor-pointer"
                        >
                          Reopen
                        </button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Activity Details Modal */}
      {viewActivity && (
        <Dialog
          isOpen={!!viewActivity}
          onClose={() => setViewActivity(null)}
          title={viewActivity.title}
          description={`${viewActivity.type} · ${viewActivity.subCounty} Sub-County`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    viewActivity.status === 'Completed'
                      ? 'success'
                      : viewActivity.status === 'Postponed'
                      ? 'warning'
                      : 'default'
                  }
                >
                  {viewActivity.status}
                </Badge>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Expected: {formatNumber(viewActivity.estimatedTurnout)} citizens
                </span>
              </div>

              <div className="flex items-center gap-2">
                {viewActivity.status !== 'Completed' ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(viewActivity.id, 'Completed', viewActivity.title)}
                    className="text-emerald-800 border-emerald-300 hover:bg-emerald-50 text-xs"
                  >
                    Mark as Completed
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleStatusChange(viewActivity.id, 'Scheduled', viewActivity.title)}
                    className="text-slate-700 text-xs"
                  >
                    Set to Scheduled
                  </Button>
                )}
              </div>
            </div>

            {/* Logistics Info Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block font-medium">Date &amp; Time</span>
                <span className="font-semibold text-slate-800">
                  {formatDate(viewActivity.date)} at {viewActivity.time}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block font-medium">Jurisdiction</span>
                <span className="font-semibold text-slate-800">
                  {viewActivity.ward} Ward, {viewActivity.subCounty}
                </span>
              </div>

              <div className="col-span-2">
                <span className="text-slate-400 block font-medium">Venue Address</span>
                <span className="font-semibold text-slate-800">{viewActivity.venue}</span>
              </div>

              <div className="col-span-2 pt-1 border-t border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block font-medium">Event Coordinator</span>
                  <span className="font-semibold text-slate-800">
                    {viewActivity.coordinatorName} ({viewActivity.coordinatorPhone})
                  </span>
                </div>
                <a
                  href={`tel:${viewActivity.coordinatorPhone}`}
                  className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:text-emerald-800 text-xs flex items-center gap-1 font-medium"
                >
                  <Phone className="w-3 h-3 text-emerald-700" />
                  Call Lead
                </a>
              </div>
            </div>

            {/* Agenda Section */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Key Agenda &amp; Campaign Pledges
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed bg-emerald-50/50 p-3 rounded-md border border-emerald-100">
                {viewActivity.keyAgenda}
              </p>
            </div>

            {/* Logistics Notes */}
            {viewActivity.logisticsNotes && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  Logistics &amp; Sound Staging Notes
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-200">
                  {viewActivity.logisticsNotes}
                </p>
              </div>
            )}

            <div className="pt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewActivity(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
