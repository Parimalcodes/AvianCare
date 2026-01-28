
export type BirdSpecies = 'Cockatiel' | 'Budgie' | 'Other';

export interface Bird {
  id: string;
  name: string;
  species: BirdSpecies;
  image?: string;
  birthDate: string; // ISO string calculated at creation
}

export interface Medication {
  id: string;
  birdId: string;
  name: string;
  dosage: string;
  frequency: 'daily' | 'twice-daily' | 'weekly';
  times: string[]; // e.g., ["08:00", "20:00"]
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export interface DietLog {
  id: string;
  birdId: string;
  date: string;
  foodType: 'seeds' | 'pellets' | 'vegetables' | 'fruits' | 'treats';
  amount: string;
  notes?: string;
}

export interface Task {
  id: string;
  birdId: string;
  title: string;
  type: 'medication' | 'diet' | 'cleaning';
  dueTime: string; // ISO string for today's occurrence
  isCompleted: boolean;
  medicationId?: string;
}

export interface AppState {
  birds: Bird[];
  medications: Medication[];
  dietLogs: DietLog[];
  completedTasks: string[]; // List of Task IDs (concatenated with date)
}
