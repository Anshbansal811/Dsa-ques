export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  problems: Problem[];
}

export interface Problem {
  id: string;
  title: string;
  description?: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  youtubeLink?: string;
  leetcodeLink?: string;
  codeforcesLink?: string;
  articleLink?: string;
  order: number;
  topicId: string;
  createdAt: string;
  updatedAt: string;
  topic?: Topic;
  isCompleted?: boolean;
}

export interface UserProgress {
  id: string;
  userId: string;
  problemId: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  problem: Problem;
}

export interface ProgressSummary {
  totalProblems: number;
  completedProblems: number;
  completionPercentage: number;
  byDifficulty: {
    easy: { completed: number; total: number };
    medium: { completed: number; total: number };
    hard: { completed: number; total: number };
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
