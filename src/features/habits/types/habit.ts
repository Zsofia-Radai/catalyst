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

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

export const HABIT_CATEGORIES = [
  "mind",
  "body",
  "hobby",
  "chore",
  "career",
  "finance",
  "social",
] as const;

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
  mind: {
    label: "Mind",
    icon: Brain,
    color: "#68AEED",
  },
  body: {
    label: "Body",
    icon: Dumbbell,
    color: "#90EDD9",
  },
  hobby: {
    label: "Hobby",
    icon: Palette,
    color: "#EDBA68",
  },
  chore: {
    label: "Chore",
    icon: House,
    color: "#797698",
  },
  career: {
    label: "Career",
    icon: BriefcaseBusiness,
    color: "#6E685E",
  },
  finance: {
    label: "Finance",
    icon: Wallet,
    color: "#6E434B",
  },
  social: {
    label: "Social",
    icon: Handshake,
    color: "#AD8CA6",
  },
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
  archived: boolean;
};
