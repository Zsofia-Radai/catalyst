import type { LucideIcon } from "lucide-react";
import {
  Brain,
  Dumbbell,
  Palette,
  House,
  Wallet,
  Handshake,
  BriefcaseBusiness,
} from "lucide-react";

export type HabitCategory =
  | "mind"
  | "body"
  | "hobby"
  | "chore"
  | "career"
  | "finance"
  | "social";

export const HABIT_CATEGORIES = [
  "mind",
  "body",
  "hobby",
  "chore",
  "career",
  "finance",
  "social",
] as const;

  export const COLORS = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#06b6d4",
    "#3b82f6",
    "#8b5cf6",
    "#ec4899",
  ];

  export const HABIT_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16", 
  "#22c55e",
  "#10b981", 
  "#14b8a6", 
  "#06b6d4", 
  "#3b82f6", 
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
];

export type HabitMeta = {
  label: string;
  icon: LucideIcon;
  color: string;
};

export const HABIT_CATEGORY_META: Record<HabitCategory, HabitMeta> = {
  mind: { label: "Mind", icon: Brain, color: "#0ea5e9" },
  body: { label: "Body", icon: Dumbbell, color: "#26b62c" },
  hobby: { label: "Hobby", icon: Palette, color: "#eab308" },
  chore: { label: "Chore", icon: House, color: "#c42a5e" },
  career: { label: "Career", icon: BriefcaseBusiness, color: "#8b5cf6" },
  finance: { label: "Finance", icon: Wallet, color: "#dd572d" },
  social: { label: "Social", icon: Handshake, color: "#d51c1c" },
};

export type HabitInputs = {
  name: string;
  category: HabitCategory;
  goal?: string;
  color: string;
};

export type Habit = HabitInputs & {
  id: string;
  createdAt: number;
  loggedHours: number;
  archived: boolean;
};
