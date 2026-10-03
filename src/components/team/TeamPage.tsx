import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  ShieldCheck,
  CheckCircle,
  Calendar,
  X
} from 'lucide-react';
import { useCampaign } from '../../context/CampaignContext';
import { SUB_COUNTIES, SubCounty, TeamMember, TeamRole } from '../../types/campaign';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatNumber, formatDate } from '../../lib/utils';
import { useToast } from '../../context/ToastContext';

export const TeamPage: React.FC = () => {
  const { team, openQuickAction } = useCampaign();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCounty, setSelectedSubCounty] = useState<SubCounty | 'All'>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');

  const filteredTeam = team.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.ward && member.ward.toLowerCase().includes(searchQuery.toLowerCase())) ||
      member.bio.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSubCounty =
      selectedSubCounty === 'All' || member.subCounty === selectedSubCounty;
    const matchesRole = selectedRole === 'All' || member.role === selectedRole;

    return matchesSearch && matchesSubCounty && matchesRole;
  });

  const totalVolunteers = team.reduce((acc, curr) => acc + (curr.volunteersManaged || 0), 0);

  const handleContactAction = (type: 'call' | 'sms' | 'email', member: TeamMember) => {
    if (type === 'call') {
      showToast(`Initiating call to ${member.name} (${member.phone})...`, 'info');
    } else if (type === 'sms') {
      showToast(`Dispatching SMS briefing to ${member.name}...`, 'info');
    } else {
      showToast(`Opening campaign email to ${member.email}...`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Campaign Team &amp; Field Marshals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Campaign leadership, 6 sub-county field coordinators, youth wing leads, and logistics managers.
          </p>
        </div>

        <Button
          variant="default"
          size="md"
          onClick={() => openQuickAction('team')}
          className="bg-emerald-800 text-white hover:bg-emerald-900"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Team Member
        </Button>
      </div>

      {/* Team KPI Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-slate-500">Field Coordinators &amp; Leads</span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              {team.length}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Active staff across Uasin Gishu</span>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-slate-500">Mobilized Field Volunteers</span>
            <div className="text-2xl font-bold text-emerald-800 font-mono tabular-nums mt-0.5">
              {formatNumber(totalVolunteers)}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Marshals, bodaboda riders &amp; agents</span>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <span className="text-xs font-medium text-slate-500">Sub-County Command Coverage</span>
            <div className="text-2xl font-bold text-slate-900 font-mono tabular-nums mt-0.5">
              100%
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">All 6 Sub-Counties active</span>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white">
        <CardContent className="p-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search team by name, role, ward, or experience..."
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
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                aria-label="Filter by Role"
                className="text-xs h-10 px-3 border border-slate-300 rounded-md bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
              >
                <option value="All">All Roles</option>
                <option value="Campaign Director">Campaign Director</option>
                <option value="Chief Strategist">Chief Strategist</option>
                <option value="Sub-County Field Lead">Sub-County Field Lead</option>
                <option value="Youth League Coordinator">Youth League Coordinator</option>
                <option value="Women League Chair">Women League Chair</option>
                <option value="Communications Director">Communications Director</option>
                <option value="Logistics & Sound Lead">Logistics & Sound Lead</option>
              </select>

              {(selectedSubCounty !== 'All' || selectedRole !== 'All' || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedSubCounty('All');
                    setSelectedRole('All');
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

      {/* Team Cards Grid */}
      {filteredTeam.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-lg border border-slate-200">
          <Users2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-900">No team members match this search</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your query or enlist a new campaign member.
          </p>
          <div className="mt-4">
            <Button
              variant="default"
              size="sm"
              onClick={() => openQuickAction('team')}
              className="bg-emerald-800 text-white"
            >
              Add Team Member
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeam.map((member) => {
            const isDeployed = member.status === 'Field Deployed';

            return (
              <Card
                key={member.id}
                className="hover:border-slate-300 transition-all flex flex-col justify-between bg-white"
              >
                <CardContent className="p-5 space-y-3">
                  {/* Top info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Initials Avatar */}
                      <div className="w-11 h-11 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs border border-slate-800">
                        {member.name
                          .split(' ')
                          .filter((w) => !w.startsWith('('))
                          .slice(0, 2)
                          .map((w) => w[0])
                          .join('')}
                      </div>

                      <div className="space-y-0.5 min-w-0">
                        <h3 className="font-bold text-slate-900 text-sm truncate">
                          {member.name}
                        </h3>
                        <p className="text-xs text-emerald-800 font-semibold truncate">
                          {member.role}
                        </p>
                      </div>
                    </div>

                    <Badge
                      variant={
                        isDeployed ? 'warning' : member.status === 'Active' ? 'success' : 'neutral'
                      }
                      className="text-[10px]"
                    >
                      {member.status}
                    </Badge>
                  </div>

                  {/* Sub-County & Jurisdiction */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{member.subCounty || 'County HQ'}</span>
                    {member.ward && (
                      <>
                        <span>·</span>
                        <span>{member.ward} Ward</span>
                      </>
                    )}
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {member.bio}
                  </p>

                  {/* Volunteer Count & Joined info */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-mono tabular-nums">
                      <strong>{formatNumber(member.volunteersManaged)}</strong> volunteers led
                    </span>
                    <span>Joined: {formatDate(member.joinedDate)}</span>
                  </div>

                  {/* Direct Contact Buttons */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                    <button
                      onClick={() => handleContactAction('call', member)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center justify-center gap-1 font-medium transition-colors"
                      title="Simulate Phone Call"
                    >
                      <Phone className="w-3 h-3 text-slate-600" />
                      <span>Call</span>
                    </button>

                    <button
                      onClick={() => handleContactAction('sms', member)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center justify-center gap-1 font-medium transition-colors"
                      title="Simulate SMS dispatch"
                    >
                      <MessageSquare className="w-3 h-3 text-slate-600" />
                      <span>SMS</span>
                    </button>

                    <button
                      onClick={() => handleContactAction('email', member)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs flex items-center justify-center gap-1 font-medium transition-colors"
                      title="Simulate Email message"
                    >
                      <Mail className="w-3 h-3 text-slate-600" />
                      <span>Email</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};
