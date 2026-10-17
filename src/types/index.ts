export type DifficultyLevel = 'iniciante' | 'intermediario' | 'avancado';

export interface Module {
  id: string;
  title: string;
  description: string;
  durationHours: number;
  topics: string[];
}

export interface CodeChallenge {
  id: string;
  title: string;
  level: DifficultyLevel;
  description: string;
  instructions: string;
  starterCode: string;
  hints: string[];
  testCases: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
}

export interface Track {
  id: string;
  name: string;
  technology: string;
  category: string;
  description: string;
  estimatedHours: number;
  level: DifficultyLevel;
  prerequisites: string[];
  modules: Module[];
  challenges: CodeChallenge[];
}

export interface CertificateData {
  id: string;
  studentName: string;
  trackId: string;
  trackName: string;
  technology: string;
  completionDate: string;
  durationHours: number;
  grade?: string;
  verificationCode: string;
  instructor: string;
  skillsAcquired: string[];
}

export interface TracksDatabase {
  version: string;
  lastUpdated: string;
  tracks: Track[];
}
