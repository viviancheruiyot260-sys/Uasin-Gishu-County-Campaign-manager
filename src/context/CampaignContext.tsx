import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Activity,
  CommunityIssue,
  IssueStatus,
  SubCounty,
  Task,
  TaskStatus,
  TeamMember,
  SUB_COUNTIES
} from '../types/campaign';
import {
  INITIAL_ACTIVITIES,
  INITIAL_ISSUES,
  INITIAL_TASKS,
  INITIAL_TEAM
} from '../data/mockData';

export type PageView = 'dashboard' | 'activities' | 'tasks' | 'issues' | 'team';

interface CampaignContextType {
  activePage: PageView;
  setActivePage: (page: PageView) => void;
  selectedSubCountyFilter: SubCounty | 'All';
  setSelectedSubCountyFilter: (sc: SubCounty | 'All') => void;

  activities: Activity[];
  addActivity: (activity: Omit<Activity, 'id'>) => void;
  updateActivityStatus: (id: string, status: Activity['status']) => void;
  deleteActivity: (id: string) => void;

  tasks: Task[];
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  deleteTask: (id: string) => void;

  issues: CommunityIssue[];
  addIssue: (issue: Omit<CommunityIssue, 'id' | 'reportedDate'>) => void;
  updateIssueStatus: (id: string, status: IssueStatus, actionNotes?: string) => void;

  team: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;

  resetToDefaultData: () => void;
  
  // Quick action modal state
  isQuickActionOpen: boolean;
  setIsQuickActionOpen: (open: boolean) => void;
  openQuickAction: (actionType: 'activity' | 'task' | 'issue' | 'team') => void;
  quickActionInitialTab: 'activity' | 'task' | 'issue' | 'team';

  // Help/Test Guide modal
  isTestGuideOpen: boolean;
  setIsTestGuideOpen: (open: boolean) => void;
}

const STORAGE_KEY = 'uasin_gishu_campaign_data_v1';

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const CampaignProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<PageView>('dashboard');
  const [selectedSubCountyFilter, setSelectedSubCountyFilter] = useState<SubCounty | 'All'>('All');
  
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [quickActionInitialTab, setQuickActionInitialTab] = useState<'activity' | 'task' | 'issue' | 'team'>('activity');
  const [isTestGuideOpen, setIsTestGuideOpen] = useState(false);

  // Initialize state with localStorage or mock data
  const [activities, setActivities] = useState<Activity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_tasks`);
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [issues, setIssues] = useState<CommunityIssue[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_issues`);
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_team`);
      return saved ? JSON.parse(saved) : INITIAL_TEAM;
    } catch {
      return INITIAL_TEAM;
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_tasks`, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_issues`, JSON.stringify(issues));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_team`, JSON.stringify(team));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [team]);

  // Activity functions
  const addActivity = (data: Omit<Activity, 'id'>) => {
    const newAct: Activity = {
      ...data,
      id: `act-${Date.now().toString().slice(-4)}`
    };
    setActivities((prev) => [newAct, ...prev]);
  };

  const updateActivityStatus = (id: string, status: Activity['status']) => {
    setActivities((prev) =>
      prev.map((act) => (act.id === id ? { ...act, status } : act))
    );
  };

  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  // Task functions
  const addTask = (data: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...data,
      id: `tsk-${Date.now().toString().slice(-4)}`
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              completedDate: status === 'Completed' ? new Date().toISOString().split('T')[0] : undefined
            }
          : t
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Issue functions
  const addIssue = (data: Omit<CommunityIssue, 'id' | 'reportedDate'>) => {
    const newIssue: CommunityIssue = {
      ...data,
      id: `iss-${Date.now().toString().slice(-4)}`,
      reportedDate: new Date().toISOString().split('T')[0]
    };
    setIssues((prev) => [newIssue, ...prev]);
  };

  const updateIssueStatus = (id: string, status: IssueStatus, actionNotes?: string) => {
    setIssues((prev) =>
      prev.map((iss) =>
        iss.id === id
          ? {
              ...iss,
              status,
              actionPlanNotes: actionNotes !== undefined ? actionNotes : iss.actionPlanNotes
            }
          : iss
      )
    );
  };

  // Team functions
  const addTeamMember = (data: Omit<TeamMember, 'id' | 'joinedDate'>) => {
    const newMember: TeamMember = {
      ...data,
      id: `tm-${Date.now().toString().slice(-4)}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setTeam((prev) => [...prev, newMember]);
  };

  const resetToDefaultData = () => {
    setActivities(INITIAL_ACTIVITIES);
    setTasks(INITIAL_TASKS);
    setIssues(INITIAL_ISSUES);
    setTeam(INITIAL_TEAM);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_activities`);
      localStorage.removeItem(`${STORAGE_KEY}_tasks`);
      localStorage.removeItem(`${STORAGE_KEY}_issues`);
      localStorage.removeItem(`${STORAGE_KEY}_team`);
    } catch {}
  };

  const openQuickAction = (actionType: 'activity' | 'task' | 'issue' | 'team') => {
    setQuickActionInitialTab(actionType);
    setIsQuickActionOpen(true);
  };

  return (
    <CampaignContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedSubCountyFilter,
        setSelectedSubCountyFilter,
        activities,
        addActivity,
        updateActivityStatus,
        deleteActivity,
        tasks,
        addTask,
        updateTaskStatus,
        deleteTask,
        issues,
        addIssue,
        updateIssueStatus,
        team,
        addTeamMember,
        resetToDefaultData,
        isQuickActionOpen,
        setIsQuickActionOpen,
        openQuickAction,
        quickActionInitialTab,
        isTestGuideOpen,
        setIsTestGuideOpen
      }}
    >
      {children}
    </CampaignContext.Provider>
  );
};

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) {
    throw new Error('useCampaign must be used within a CampaignProvider');
  }
  return context;
};
