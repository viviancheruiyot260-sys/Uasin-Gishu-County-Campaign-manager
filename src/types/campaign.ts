export type SubCounty = 
  | 'Turbo'
  | 'Soy'
  | 'Ainabkoi'
  | 'Kapseret'
  | 'Moiben'
  | 'Kesses';

export const SUB_COUNTIES: SubCounty[] = [
  'Turbo',
  'Soy',
  'Ainabkoi',
  'Kapseret',
  'Moiben',
  'Kesses'
];

export const WARDS_BY_SUBCOUNTY: Record<SubCounty, string[]> = {
  Turbo: ['Kamagut', 'Kiplombe', 'Kapsaos', 'Huruma', 'Tapsagoi', 'Ngenyilel'],
  Soy: ['Soy', 'Mois Bridge', 'Kapkures', 'Ziwa', 'Segero/Barsombe', 'Kipsomba', 'Kuinet/Kapsuswa'],
  Ainabkoi: ['Kapsoya', 'Kaptagat', 'Ainabkoi/Olare'],
  Kapseret: ['Simat/Kapseret', 'Kipkenyo', 'Ngeria', 'Megun', 'Langas'],
  Moiben: ['Tembelio', 'Sergoit', 'Karuna/Meibeki', 'Moiben', 'Kimumu'],
  Kesses: ['Racecourse', 'Cheptiret/Kipchamo', 'Tulwet/Chuiyat', 'Tarakwa']
};

export type ActivityType = 
  | 'Grand Rally'
  | 'Town Hall'
  | 'Community Baraza'
  | 'Market Walkthrough'
  | 'Bodaboda Forum'
  | 'Farmers Roundtable'
  | 'Youth Sports Event'
  | 'Church Visit';

export type ActivityStatus = 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  subCounty: SubCounty;
  ward: string;
  venue: string;
  date: string;
  time: string;
  estimatedTurnout: number;
  status: ActivityStatus;
  coordinatorName: string;
  coordinatorPhone: string;
  keyAgenda: string;
  logisticsNotes?: string;
}

export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TaskStatus = 'Todo' | 'In Progress' | 'Completed';
export type TaskCategory = 
  | 'Logistics & Sound'
  | 'Volunteer Mobilization'
  | 'Communications & Media'
  | 'Security & Protocol'
  | 'Women & Youth Outreach'
  | 'Materials & Branding';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  assignedTo: string;
  subCounty?: SubCounty;
  ward?: string;
  dueDate: string;
  completedDate?: string;
}

export type IssueCategory = 
  | 'Agriculture & Fertilizer'
  | 'Roads & Feeder Bridges'
  | 'Water & Boreholes'
  | 'Dispensary Drugs & Health'
  | 'Youth Bursaries & Poly'
  | 'Youth & Bursaries'
  | 'Markets & Street Lighting'
  | 'Athletics & Sports Facilities';

export type IssueStatus = 'Reported' | 'Assessing' | 'Action Planned' | 'Resolved';
export type IssuePriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface CommunityIssue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  subCounty: SubCounty;
  ward: string;
  reportedBy: string;
  reporterContact?: string;
  reportedDate: string;
  priority: IssuePriority;
  status: IssueStatus;
  actionPlanNotes?: string;
  impactScore?: number; // 1-100
}

export type TeamRole = 
  | 'Campaign Director'
  | 'Chief Strategist'
  | 'Sub-County Field Lead'
  | 'Youth League Coordinator'
  | 'Women League Chair'
  | 'Communications Director'
  | 'Logistics & Sound Lead'
  | 'Ward Agent Supervisor'
  | 'Field Mobilizer';

export interface TeamMember {
  id: string;
  name: string;
  role: TeamRole;
  subCounty?: SubCounty;
  ward?: string;
  phone: string;
  email: string;
  status: 'Active' | 'Field Deployed' | 'On Call';
  volunteersManaged: number;
  joinedDate: string;
  bio: string;
}
