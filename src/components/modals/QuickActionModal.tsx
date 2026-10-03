import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { Tabs } from '../ui/Tabs';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { useCampaign } from '../../context/CampaignContext';
import { useToast } from '../../context/ToastContext';
import {
  SUB_COUNTIES,
  WARDS_BY_SUBCOUNTY,
  SubCounty,
  ActivityType,
  TaskPriority,
  TaskCategory,
  IssueCategory,
  IssuePriority,
  TeamRole
} from '../../types/campaign';
import {
  CalendarCheck,
  CheckSquare,
  MessageSquareWarning,
  UserPlus
} from 'lucide-react';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionOpen,
    setIsQuickActionOpen,
    quickActionInitialTab,
    addActivity,
    addTask,
    addIssue,
    addTeamMember
  } = useCampaign();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'activity' | 'task' | 'issue' | 'team'>('activity');

  useEffect(() => {
    if (isQuickActionOpen) {
      setActiveTab(quickActionInitialTab);
    }
  }, [isQuickActionOpen, quickActionInitialTab]);

  // Form states
  // 1. Activity Form
  const [actTitle, setActTitle] = useState('');
  const [actType, setActType] = useState<ActivityType>('Grand Rally');
  const [actSubCounty, setActSubCounty] = useState<SubCounty>('Soy');
  const [actWard, setActWard] = useState(WARDS_BY_SUBCOUNTY['Soy'][0]);
  const [actVenue, setActVenue] = useState('');
  const [actDate, setActDate] = useState(new Date().toISOString().split('T')[0]);
  const [actTime, setActTime] = useState('10:00 AM');
  const [actTurnout, setActTurnout] = useState('500');
  const [actCoordinator, setActCoordinator] = useState('');
  const [actPhone, setActPhone] = useState('+254 7');
  const [actAgenda, setActAgenda] = useState('');

  // 2. Task Form
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskPriority, setTaskPriority] = useState<TaskPriority>('High');
  const [taskCategory, setTaskCategory] = useState<TaskCategory>('Logistics & Sound');
  const [taskAssignee, setTaskAssignee] = useState('');
  const [taskSubCounty, setTaskSubCounty] = useState<SubCounty>('Turbo');
  const [taskDueDate, setTaskDueDate] = useState(new Date().toISOString().split('T')[0]);

  // 3. Issue Form
  const [issueTitle, setIssueTitle] = useState('');
  const [issueDesc, setIssueDesc] = useState('');
  const [issueCategory, setIssueCategory] = useState<IssueCategory>('Agriculture & Fertilizer');
  const [issueSubCounty, setIssueSubCounty] = useState<SubCounty>('Soy');
  const [issueWard, setIssueWard] = useState(WARDS_BY_SUBCOUNTY['Soy'][0]);
  const [issuePriority, setIssuePriority] = useState<IssuePriority>('High');
  const [issueReporter, setIssueReporter] = useState('');
  const [issueContact, setIssueContact] = useState('');

  // 4. Team Member Form
  const [teamName, setTeamName] = useState('');
  const [teamRole, setTeamRole] = useState<TeamRole>('Field Mobilizer');
  const [teamSubCounty, setTeamSubCounty] = useState<SubCounty>('Turbo');
  const [teamPhone, setTeamPhone] = useState('+254 7');
  const [teamEmail, setTeamEmail] = useState('');
  const [teamVolunteers, setTeamVolunteers] = useState('15');
  const [teamBio, setTeamBio] = useState('');

  // Update wards when subcounty changes
  useEffect(() => {
    setActWard(WARDS_BY_SUBCOUNTY[actSubCounty][0]);
  }, [actSubCounty]);

  useEffect(() => {
    setIssueWard(WARDS_BY_SUBCOUNTY[issueSubCounty][0]);
  }, [issueSubCounty]);

  // Submit Handlers
  const handleActivitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() || !actVenue.trim()) {
      showToast('Please fill in activity title and venue.', 'error');
      return;
    }
    addActivity({
      title: actTitle,
      type: actType,
      subCounty: actSubCounty,
      ward: actWard,
      venue: actVenue,
      date: actDate,
      time: actTime,
      estimatedTurnout: parseInt(actTurnout) || 200,
      status: 'Scheduled',
      coordinatorName: actCoordinator || 'Field Lead',
      coordinatorPhone: actPhone,
      keyAgenda: actAgenda || 'Public address & campaign pledge presentation'
    });
    showToast(`Activity "${actTitle}" scheduled successfully!`, 'success');
    setIsQuickActionOpen(false);
    // Reset fields
    setActTitle('');
    setActVenue('');
    setActAgenda('');
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskAssignee.trim()) {
      showToast('Please provide task title and assignee.', 'error');
      return;
    }
    addTask({
      title: taskTitle,
      description: taskDesc || 'Campaign field duty',
      priority: taskPriority,
      status: 'Todo',
      category: taskCategory,
      assignedTo: taskAssignee,
      subCounty: taskSubCounty,
      dueDate: taskDueDate
    });
    showToast(`Task assigned to ${taskAssignee}.`, 'success');
    setIsQuickActionOpen(false);
    setTaskTitle('');
    setTaskDesc('');
    setTaskAssignee('');
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueTitle.trim() || !issueDesc.trim()) {
      showToast('Please provide issue title and details.', 'error');
      return;
    }
    addIssue({
      title: issueTitle,
      description: issueDesc,
      category: issueCategory,
      subCounty: issueSubCounty,
      ward: issueWard,
      priority: issuePriority,
      status: 'Reported',
      reportedBy: issueReporter || 'Anonymous Ward Citizen',
      reporterContact: issueContact || undefined,
      actionPlanNotes: 'Logged into campaign system for ward coordinator review.'
    });
    showToast(`Grievance logged for ${issueWard} ward.`, 'success');
    setIsQuickActionOpen(false);
    setIssueTitle('');
    setIssueDesc('');
    setIssueReporter('');
  };

  const handleTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !teamPhone.trim()) {
      showToast('Please provide member name and phone.', 'error');
      return;
    }
    addTeamMember({
      name: teamName,
      role: teamRole,
      subCounty: teamSubCounty,
      phone: teamPhone,
      email: teamEmail || `${teamName.toLowerCase().replace(/\s+/g, '.')}@countymanager.ke`,
      status: 'Active',
      volunteersManaged: parseInt(teamVolunteers) || 0,
      bio: teamBio || `Dedicated field campaign personnel in ${teamSubCounty} sub-county.`
    });
    showToast(`Added ${teamName} to Campaign Team.`, 'success');
    setIsQuickActionOpen(false);
    setTeamName('');
    setTeamEmail('');
    setTeamBio('');
  };

  const tabsConfig = [
    { id: 'activity' as const, label: 'Activity', icon: <CalendarCheck className="w-3.5 h-3.5" /> },
    { id: 'task' as const, label: 'Task', icon: <CheckSquare className="w-3.5 h-3.5" /> },
    { id: 'issue' as const, label: 'Citizen Issue', icon: <MessageSquareWarning className="w-3.5 h-3.5" /> },
    { id: 'team' as const, label: 'Team Member', icon: <UserPlus className="w-3.5 h-3.5" /> }
  ];

  return (
    <Dialog
      isOpen={isQuickActionOpen}
      onClose={() => setIsQuickActionOpen(false)}
      title="Campaign Quick Action"
      description="Record activities, tasks, citizen grievances, or personnel."
      maxWidth="lg"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="w-full flex justify-center pb-1">
          <Tabs
            tabs={tabsConfig}
            activeTab={activeTab}
            onChange={(tab) => setActiveTab(tab)}
            size="sm"
          />
        </div>

        {/* Tab 1: Activity */}
        {activeTab === 'activity' && (
          <form onSubmit={handleActivitySubmit} className="space-y-3.5">
            <Input
              label="Activity Title"
              placeholder="e.g. Soy Farmers Town Hall on Subsidies"
              value={actTitle}
              onChange={(e) => setActTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Activity Type"
                value={actType}
                onChange={(e) => setActType(e.target.value as ActivityType)}
              >
                <option value="Grand Rally">Grand Rally</option>
                <option value="Town Hall">Town Hall</option>
                <option value="Community Baraza">Community Baraza</option>
                <option value="Market Walkthrough">Market Walkthrough</option>
                <option value="Bodaboda Forum">Bodaboda Forum</option>
                <option value="Farmers Roundtable">Farmers Roundtable</option>
                <option value="Youth Sports Event">Youth Sports Event</option>
                <option value="Church Visit">Church Visit</option>
              </Select>

              <Select
                label="Sub-County"
                value={actSubCounty}
                onChange={(e) => setActSubCounty(e.target.value as SubCounty)}
              >
                {SUB_COUNTIES.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Ward"
                value={actWard}
                onChange={(e) => setActWard(e.target.value)}
              >
                {WARDS_BY_SUBCOUNTY[actSubCounty].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>

              <Input
                label="Venue / Location"
                placeholder="e.g. Ziwa Market Grounds"
                value={actVenue}
                onChange={(e) => setActVenue(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Date"
                type="date"
                value={actDate}
                onChange={(e) => setActDate(e.target.value)}
                required
              />

              <Input
                label="Time"
                placeholder="e.g. 10:00 AM"
                value={actTime}
                onChange={(e) => setActTime(e.target.value)}
                required
              />

              <Input
                label="Estimated Turnout"
                type="number"
                placeholder="e.g. 800"
                value={actTurnout}
                onChange={(e) => setActTurnout(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Coordinator In Charge"
                placeholder="e.g. Priscilla Chebet"
                value={actCoordinator}
                onChange={(e) => setActCoordinator(e.target.value)}
              />

              <Input
                label="Coordinator Phone"
                placeholder="+254 7..."
                value={actPhone}
                onChange={(e) => setActPhone(e.target.value)}
              />
            </div>

            <Textarea
              label="Key Agenda / Discussion Points"
              placeholder="Primary issues the candidate will highlight..."
              value={actAgenda}
              onChange={(e) => setActAgenda(e.target.value)}
              rows={2}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickActionOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" className="bg-emerald-800 text-white">
                Schedule Activity
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Task */}
        {activeTab === 'task' && (
          <form onSubmit={handleTaskSubmit} className="space-y-3.5">
            <Input
              label="Task Title"
              placeholder="e.g. Setup sound truck at Huruma stage"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Category"
                value={taskCategory}
                onChange={(e) => setTaskCategory(e.target.value as TaskCategory)}
              >
                <option value="Logistics & Sound">Logistics & Sound</option>
                <option value="Volunteer Mobilization">Volunteer Mobilization</option>
                <option value="Communications & Media">Communications & Media</option>
                <option value="Security & Protocol">Security & Protocol</option>
                <option value="Women & Youth Outreach">Women & Youth Outreach</option>
                <option value="Materials & Branding">Materials & Branding</option>
              </Select>

              <Select
                label="Priority Level"
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
                <option value="Urgent">Urgent (Immediate)</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Assigned Lead"
                placeholder="e.g. Patrick Tanui"
                value={taskAssignee}
                onChange={(e) => setTaskAssignee(e.target.value)}
                required
              />

              <Input
                label="Due Date"
                type="date"
                value={taskDueDate}
                onChange={(e) => setTaskDueDate(e.target.value)}
                required
              />
            </div>

            <Select
              label="Sub-County (Optional)"
              value={taskSubCounty}
              onChange={(e) => setTaskSubCounty(e.target.value as SubCounty)}
            >
              {SUB_COUNTIES.map((sc) => (
                <option key={sc} value={sc}>
                  {sc}
                </option>
              ))}
            </Select>

            <Textarea
              label="Task Details / Instructions"
              placeholder="Specific logistics instructions..."
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              rows={2}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickActionOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" className="bg-emerald-800 text-white">
                Create Task
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Community Issue */}
        {activeTab === 'issue' && (
          <form onSubmit={handleIssueSubmit} className="space-y-3.5">
            <Input
              label="Citizen Grievance Title"
              placeholder="e.g. Kapsaos Water Kiosk Out of Service"
              value={issueTitle}
              onChange={(e) => setIssueTitle(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Issue Category"
                value={issueCategory}
                onChange={(e) => setIssueCategory(e.target.value as IssueCategory)}
              >
                <option value="Agriculture & Fertilizer">Agriculture & Fertilizer</option>
                <option value="Roads & Feeder Bridges">Roads & Feeder Bridges</option>
                <option value="Water & Boreholes">Water & Boreholes</option>
                <option value="Dispensary Drugs & Health">Dispensary Drugs & Health</option>
                <option value="Youth Bursaries & Poly">Youth Bursaries & Poly</option>
                <option value="Markets & Street Lighting">Markets & Street Lighting</option>
                <option value="Athletics & Sports Facilities">Athletics & Sports Facilities</option>
              </Select>

              <Select
                label="Priority / Urgency"
                value={issuePriority}
                onChange={(e) => setIssuePriority(e.target.value as IssuePriority)}
              >
                <option value="Low">Low - Informational</option>
                <option value="Medium">Medium - Regular Baraza</option>
                <option value="High">High - Pressing Concern</option>
                <option value="Critical">Critical - Urgent Action Needed</option>
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Sub-County"
                value={issueSubCounty}
                onChange={(e) => setIssueSubCounty(e.target.value as SubCounty)}
              >
                {SUB_COUNTIES.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </Select>

              <Select
                label="Ward"
                value={issueWard}
                onChange={(e) => setIssueWard(e.target.value)}
              >
                {WARDS_BY_SUBCOUNTY[issueSubCounty].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>
            </div>

            <Textarea
              label="Issue Description & Citizen Feedback"
              placeholder="Detailed explanation of the issue, who is affected, and what solution the community expects..."
              value={issueDesc}
              onChange={(e) => setIssueDesc(e.target.value)}
              rows={3}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Reported By (Citizen / Group)"
                placeholder="e.g. Mzee Kiprono or Market Committee"
                value={issueReporter}
                onChange={(e) => setIssueReporter(e.target.value)}
              />

              <Input
                label="Contact Phone"
                placeholder="+254 7..."
                value={issueContact}
                onChange={(e) => setIssueContact(e.target.value)}
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickActionOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" className="bg-emerald-800 text-white">
                Log Community Issue
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Team Member */}
        {activeTab === 'team' && (
          <form onSubmit={handleTeamSubmit} className="space-y-3.5">
            <Input
              label="Full Name"
              placeholder="e.g. Victor Kimutai"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select
                label="Campaign Role"
                value={teamRole}
                onChange={(e) => setTeamRole(e.target.value as TeamRole)}
              >
                <option value="Sub-County Field Lead">Sub-County Field Lead</option>
                <option value="Youth League Coordinator">Youth League Coordinator</option>
                <option value="Women League Chair">Women League Chair</option>
                <option value="Communications Director">Communications Director</option>
                <option value="Logistics & Sound Lead">Logistics & Sound Lead</option>
                <option value="Ward Agent Supervisor">Ward Agent Supervisor</option>
                <option value="Field Mobilizer">Field Mobilizer</option>
              </Select>

              <Select
                label="Assigned Sub-County"
                value={teamSubCounty}
                onChange={(e) => setTeamSubCounty(e.target.value as SubCounty)}
              >
                {SUB_COUNTIES.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Phone Number"
                placeholder="+254 7..."
                value={teamPhone}
                onChange={(e) => setTeamPhone(e.target.value)}
                required
              />

              <Input
                label="Email Address"
                placeholder="name@countymanager.ke"
                value={teamEmail}
                onChange={(e) => setTeamEmail(e.target.value)}
              />
            </div>

            <Input
              label="Volunteers Under Supervision"
              type="number"
              placeholder="e.g. 25"
              value={teamVolunteers}
              onChange={(e) => setTeamVolunteers(e.target.value)}
            />

            <Textarea
              label="Brief Bio & Local Experience"
              placeholder="Relevant experience, grassroots standing..."
              value={teamBio}
              onChange={(e) => setTeamBio(e.target.value)}
              rows={2}
            />

            <div className="pt-2 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsQuickActionOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default" className="bg-emerald-800 text-white">
                Add Team Member
              </Button>
            </div>
          </form>
        )}
      </div>
    </Dialog>
  );
};
