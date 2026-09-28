
export enum UserRole {
  SOLO = 'solo',
  WARD = 'ward',
  GUARDIAN = 'guardian'
}

export interface User {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  guardianCode?: string;
}

export interface Task {
  id: string;
  name: string;
  time: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Not Started' | 'In Progress' | 'Completed';
  recurring?: boolean;
}

export interface HealthMetric {
  steps: number;
  sleep: string;
  water: number;
  status: 'Good' | 'Moderate' | 'Alert';
}

export interface FinanceData {
  income: number;
  expenses: number;
  savings: number;
  health: string;
}
// Planner Page Types
export type TaskPriority = 'High' | 'Medium' | 'Low';
export type TaskCategory = 'Work' | 'Study' | 'Health' | 'Personal' | 'Finance' | 'Other';
export type RecurrencePattern = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface PlannerTask {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  duration: number; // in minutes
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  subtasks?: string[];
  notes?: string;
  location?: TaskLocation;
}

export interface RecurringTask {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  duration: number;
  priority: TaskPriority;
  category: TaskCategory;
  pattern: RecurrencePattern;
  startDate: string;
  endDate?: string;
  daysOfWeek?: number[]; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  customInterval?: number; // for custom patterns
}

export interface DayNote {
  date: string;
  content: string;
}

// Intelligent Planner Extensions
export type EnergyLevel = 'Very Low' | 'Low' | 'Medium' | 'High';
export type TaskLocation = 'Office' | 'Home' | 'Field' | 'Travel';
export type WeatherCondition = 'Sunny' | 'Rainy' | 'Cloudy' | 'Stormy';

export interface DailyReflection {
  date: string;
  mood: 'Great' | 'Good' | 'Neutral' | 'Bad' | 'Awful';
  gratitude: string;
  completed: boolean;
}

export interface PlannerContext {
  energyLevel: EnergyLevel;
  focusIntent: string;
  currentLocation: TaskLocation;
  weather: WeatherCondition;
}

// Food Planner Types
export interface Ingredient {
  id: string;
  name: string;
  category: 'Produce' | 'Protein' | 'Dairy' | 'Grains' | 'Spices' | 'Other';
  quantity?: string;
  expiryStatus?: 'Good' | 'Soon' | 'Expired';
}

export interface Dish {
  id: string;
  name: string;
  matchScore: number; // 0-100 based on ingredients
  time: number; // minutes
  difficulty: 'Easy' | 'Medium' | 'Hard';
  calories: number; // indicative
  healthTag: 'Balanced' | 'High Protein' | 'Low Carb' | 'Comfort';
  missingIngredients: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low'; // Non-numeric health score
  allergens?: string[];
  steps?: string[];
}

export interface MealPlanDay {
  date: string;
  breakfast?: Dish;
  lunch?: Dish;
  dinner?: Dish;
}

export interface FoodPreference {
  diet: 'None' | 'Vegetarian' | 'Vegan' | 'Keto';
  allergies: string[];
  peopleCount: number;
  cookingTime: 'Quick (< 30m)' | 'Medium (30-60m)' | 'Elaborate (> 1h)';
}

// Learning Tracker Types
export interface LearningSkill {
  id: string;
  name: string;
  sectorId: string; // Used to group skills
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  masteryLevel: 'Novice' | 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  confidenceScore: number; // 1-10
  hoursLogged: number;
  lastPracticed: string; // ISO date
  dailyTime: number; // in minutes
  weeklyGoal: number; // in hours
  monthlyGoal: number; // in hours
  createdAt: string;
  deadline?: string;
  weakAreas?: string[]; // AI generated
  nextTopics?: string[]; // AI suggested
}

export interface LearningSector {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface LearningGoal {
  id: string;
  title: string;
  type: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annual' | 'Lifetime';
  linkedSkillId?: string;
  targetDate: string; // ISO
  progressPercent: number;
  status: 'Not Started' | 'Active' | 'At Risk' | 'Behind' | 'Completed' | 'Paused';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  milestones: { id: string; title: string; completed: boolean; deadline?: string }[];
  dependencies: string[]; // IDs of other goals
  blockers: string[]; // Concept Unclear, No Time, etc.
  effortEstimate: number; // hours
  effortActual: number; // hours
  createdAt: string;
  probabilityScore?: number; // AI calculated
}

export interface FocusSession {
  id: string;
  skillId: string;
  startTime: string;
  endTime?: string;
  plannedDuration: number;
  actualDuration: number;
  distractions: string[]; // Social Media, Phone, etc.
  breakQuality?: 'Walk' | 'Phone' | 'Food' | 'Rest' | 'Nap';
  postSessionNotes: string;
  sessionType: 'Learning' | 'Practice' | 'Review' | 'Project' | 'Reading';
  environment: 'Home' | 'Library' | 'Café' | 'Office' | 'Transit';
  qualityScore: number; // 1-5
}

export interface LearningResource {
  id: string;
  type: 'Link' | 'Note' | 'PDF' | 'Video' | 'Article' | 'Book' | 'Code Snippet' | 'Image';
  title: string;
  url?: string;
  content?: string;
  linkedSkillIds: string[];
  folderId?: string;
  status: 'Unread' | 'In Progress' | 'Completed' | 'Archived';
  aiSummary?: string;
  personalNote?: string;
  starred: boolean;
  createdAt: string;
}

export interface LearningJournalEntry {
  id: string;
  date: string;
  responses: {
    learned: string;
    difficult: string;
    distracted: string;
    priorityTomorrow: string;
    proudOf: string;
  };
  energyLevel: number; // 1-5
  aiInsights: string[];
  createdAt: string;
}

export interface LearningEfficiency {
  score: number;
  level: 'Low' | 'Moderate' | 'High' | 'Peak';
}

export interface LearningAnalytics {
  completionTrend: { date: string; percentage: number }[];
  efficiency: LearningEfficiency;
  skillDistribution: { name: string; value: number }[]; // value is time spent
  consistency: { date: string; count: number }[]; // GitHub style heatmap
  streak: number;
}
