import React from 'react';
import { Dialog } from '../ui/Dialog';
import {
  CheckCircle2,
  Smartphone,
  Filter,
  PlusCircle,
  FileCheck,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useCampaign } from '../../context/CampaignContext';

export const TestGuideModal: React.FC = () => {
  const { isTestGuideOpen, setIsTestGuideOpen, resetToDefaultData, setActivePage } = useCampaign();

  return (
    <Dialog
      isOpen={isTestGuideOpen}
      onClose={() => setIsTestGuideOpen(false)}
      title="How to Test County Campaign Manager"
      description="Step-by-step instructions for testing all prototype features and simulated county data."
      maxWidth="lg"
    >
      <div className="space-y-4 text-xs sm:text-sm">
        {/* Intro */}
        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-lg text-emerald-950">
          <p className="font-semibold text-emerald-900 mb-1">
            Uasin Gishu County Prototype Overview
          </p>
          <p className="text-slate-700 leading-relaxed">
            This prototype is built using React, TypeScript, shadcn-inspired components, and Lucide icons.
            All state is fully interactive and persists in your browser’s localStorage without requiring external databases or paid APIs.
          </p>
        </div>

        {/* Test Steps */}
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              1
            </div>
            <div>
              <p className="font-semibold text-slate-900">Test Left Sidebar & shadcn/ui Dashboard Example Mode</p>
              <p className="text-slate-600">
                Notice all navigation is now positioned on the <strong>Left Sidebar</strong> (with workspace switcher, active counts, and sub-county filters). On the Dashboard, click <strong>"shadcn/ui Dashboard Example"</strong> to see how each KPI card, bar chart, and recent activity feed directly aligns with the official <code>https://ui.shadcn.com/examples/dashboard</code> specification.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              2
            </div>
            <div>
              <p className="font-semibold text-slate-900">Test Activities Page & Scheduling Form</p>
              <p className="text-slate-600">
                Navigate to <strong>Activities</strong>. Click <strong>+ Schedule Activity</strong> to open the modal. Fill in the title (e.g. <em>"Eldoret Sports Club Youth Baraza"</em>), select Sub-County (<em>Ainabkoi</em>), choose Ward, venue, and estimated turnout. Submit to see it immediately appear at the top. Test marking an event as <strong>Completed</strong> or <strong>Postponed</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              3
            </div>
            <div>
              <p className="font-semibold text-slate-900">Test Tasks Kanban & Priorities</p>
              <p className="text-slate-600">
                Go to <strong>Tasks</strong>. Click the status checkbox or toggle a task from <em>Todo</em> to <em>In Progress</em> or <em>Completed</em>. Add a new task using the <strong>+ New Task</strong> button and test filtering by priority (<em>Urgent, High, Medium, Low</em>).
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              4
            </div>
            <div>
              <p className="font-semibold text-slate-900">Test Community Issues & Citizen Grievance Tracker</p>
              <p className="text-slate-600">
                Switch to <strong>Community Issues</strong>. Click on an existing grievance to view details, then test updating its status from <em>Assessing</em> to <em>Action Planned</em> or <em>Resolved</em> with custom campaign notes. Click <strong>+ Log Citizen Issue</strong> to report a new problem with local ward tags.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              5
            </div>
            <div>
              <p className="font-semibold text-slate-900">Test Team Directory & Quick Actions</p>
              <p className="text-slate-600">
                Visit <strong>Team</strong> to view campaign hierarchy (Candidate, Strategist, Sub-County Leads). Test clicking the simulated <strong>Call</strong>, <strong>Email</strong>, or <strong>Assign Task</strong> buttons to test feedback toasts. Add a new volunteer to test the form.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
              6
            </div>
            <div>
              <p className="font-semibold text-slate-900">Test Mobile Viewport & Responsiveness</p>
              <p className="text-slate-600">
                Resize your desktop browser or open your browser’s Developer Tools (F12) and toggle device mode to an iPhone 14 or Pixel screen (375px–430px). Verify that the bottom navigation bar docks cleanly, modals fit comfortably without horizontal scroll, and buttons have generous tap targets.
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetToDefaultData();
              setIsTestGuideOpen(false);
            }}
            className="w-full sm:w-auto text-slate-600 hover:text-slate-900"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset to Sample Data
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => {
              setIsTestGuideOpen(false);
              setActivePage('dashboard');
            }}
            className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white"
          >
            Start Exploring Dashboard
          </Button>
        </div>
      </div>
    </Dialog>
  );
};
