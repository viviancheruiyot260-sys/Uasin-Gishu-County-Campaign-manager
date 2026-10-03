import React from 'react';
import {
  LayoutDashboard,
  CalendarCheck,
  CheckSquare,
  MessageSquareWarning,
  Users2
} from 'lucide-react';
import { useCampaign, PageView } from '../../context/CampaignContext';

export const MobileBottomNav: React.FC = () => {
  const { activePage, setActivePage, issues, tasks, activities } = useCampaign();

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;
  const openIssuesCount = issues.filter((i) => i.status !== 'Resolved').length;

  const items: {
    id: PageView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'activities', label: 'Activities', icon: CalendarCheck, badge: activities.filter(a => a.status === 'Scheduled').length },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare, badge: pendingTasksCount },
    { id: 'issues', label: 'Issues', icon: MessageSquareWarning, badge: openIssuesCount },
    { id: 'team', label: 'Team', icon: Users2 }
  ];

  return (
    <nav
      aria-label="Mobile navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg safe-area-bottom"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-md transition-all duration-150 min-h-[48px] select-none ${
                isActive
                  ? 'text-emerald-800 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.3]' : 'stroke-[1.8]'}`} />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 bg-emerald-700 text-white text-[9px] font-bold px-1 rounded-full min-w-3.5 h-3.5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
