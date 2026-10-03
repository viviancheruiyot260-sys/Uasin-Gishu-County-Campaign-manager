/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ToastProvider } from './context/ToastContext';
import { CampaignProvider, useCampaign } from './context/CampaignContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { ActivitiesPage } from './components/activities/ActivitiesPage';
import { TasksPage } from './components/tasks/TasksPage';
import { CommunityIssuesPage } from './components/issues/CommunityIssuesPage';
import { TeamPage } from './components/team/TeamPage';
import { QuickActionModal } from './components/modals/QuickActionModal';
import { TestGuideModal } from './components/modals/TestGuideModal';
import { HelpCircle, RotateCcw } from 'lucide-react';

const CampaignAppContent: React.FC = () => {
  const { activePage, setIsTestGuideOpen, resetToDefaultData } = useCampaign();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-emerald-800 selection:text-white">
      {/* Left Navigation Sidebar (Desktop fixed, mobile off-canvas drawer) */}
      <Sidebar
        isOpenOnMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area Offset by Left Sidebar on Desktop (lg:pl-72) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        {/* Workspace Top Header */}
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        {/* Dynamic Page Viewport */}
        <main className="flex-1 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 max-w-7xl w-full mx-auto">
          {activePage === 'dashboard' && <DashboardPage />}
          {activePage === 'activities' && <ActivitiesPage />}
          {activePage === 'tasks' && <TasksPage />}
          {activePage === 'issues' && <CommunityIssuesPage />}
          {activePage === 'team' && <TeamPage />}
        </main>

        {/* Clean Footer */}
        <footer className="border-t border-slate-200 bg-white py-5 mt-12 mb-16 lg:mb-0">
          <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800">County Campaign Manager</span>
              <span>·</span>
              <span>Uasin Gishu County Prototype</span>
              <span>·</span>
              <span className="text-emerald-800 font-medium">Tuinuane Uasin Gishu</span>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsTestGuideOpen(true)}
                className="hover:text-emerald-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                Testing Guide
              </button>
              <span>·</span>
              <button
                onClick={() => {
                  if (window.confirm('Reset sample campaign data to default?')) {
                    resetToDefaultData();
                  }
                }}
                className="hover:text-slate-800 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Data
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile-Friendly Bottom Navigation (<15% viewport height cap) */}
      <MobileBottomNav />

      {/* Unified Quick Action Modal */}
      <QuickActionModal />

      {/* Interactive Testing Instructions Modal */}
      <TestGuideModal />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <CampaignProvider>
        <CampaignAppContent />
      </CampaignProvider>
    </ToastProvider>
  );
}
