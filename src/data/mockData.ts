export type Category = "Sports" | "Cultural" | "Technical";
export type AchievementType = "Participation" | "Award" | "Recognition";
export type Status = "Pending" | "Approved" | "Rejected";

export interface Achievement {
  id: string;
  studentName: string;
  studentId: string;
  title: string;
  category: Category;
  type: AchievementType;
  status: Status;
  date: string; // ISO date from achievement event
  description: string;
  feedback?: string;
  level?: string;
  proofUrl?: string;
  teacherId?: string;
  submittedAt?: string; // ISO datetime from backend
  reviewedAt?: string;  // ISO datetime from backend
}

export interface Student {
  id: string;
  name: string;
  email: string;
  course: string;
  year: string;
  avatar?: string;
  teacherId?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
}

export const teachers: Teacher[] = [];

export const students: Student[] = [];

export const initialAchievements: Achievement[] = [];

export const categoryColors: Record<Category, string> = {
  Sports: "from-emerald-400 to-teal-500",
  Cultural: "from-pink-400 to-rose-500",
  Technical: "from-indigo-400 to-violet-500",
};

export const typeColors: Record<AchievementType, string> = {
  Participation: "from-sky-400 to-blue-500",
  Award: "from-amber-400 to-orange-500",
  Recognition: "from-fuchsia-400 to-purple-500",
};

export const statusColors: Record<Status, string> = {
  "Pending": "bg-amber-500",
  "Approved": "bg-emerald-500",
  "Rejected": "bg-rose-500",
};

export const allStatuses: Status[] = ["Pending", "Approved", "Rejected"];
