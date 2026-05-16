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

export const HABIT_CATEGORY_META: Record<
  HabitCategory,
  { label: string; icon: LucideIcon; color: string }
> = {
  mind: { label: "Mind", icon: Brain, color: "#03A9F4" },
  body: { label: "Body", icon: Dumbbell, color: "#26b62c" },
  hobby: { label: "Hobby", icon: Palette, color: "#FFC107" },
  chore: { label: "Chore", icon: House, color: "#c42a5e" },
  career: { label: "Career", icon: BriefcaseBusiness, color: "#6b43b2" },
  finance: { label: "Finance", icon: Wallet, color: "#dd572d" },
  social: { label: "Social", icon: Handshake, color: "#d01b1b" },
};

export type Habit = {
  id: string;
  name: string;
  category: HabitCategory;
  createdAt: number;
  goal?: string;
  loggedHours: number;
};
