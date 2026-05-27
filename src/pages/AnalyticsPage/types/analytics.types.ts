export const ANALYTICS_RANGES = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
  ALL: "all",
} as const;

export type AnalyticsRange =
  (typeof ANALYTICS_RANGES)[keyof typeof ANALYTICS_RANGES];

export const ANALYTICS_RANGE_TABS = [
  {
    label: "Week",
    value: ANALYTICS_RANGES.WEEK,
  },
  {
    label: "Month",
    value: ANALYTICS_RANGES.MONTH,
  },
  {
    label: "Year",
    value: ANALYTICS_RANGES.YEAR,
  },
  {
    label: "All time",
    value: ANALYTICS_RANGES.ALL,
  },
];

export const HABIT_FILTERS = {
  ACTIVE: "Active habits",
  ARCHIVED: "Archived habits",
  ALL: "All habits",
};

export type HabitFilter = (typeof HABIT_FILTERS)[keyof typeof HABIT_FILTERS];

export const HABIT_FILTER_TABS: { label: string; value: HabitFilter }[] = [
  {
    label: "Active habits",
    value: HABIT_FILTERS.ACTIVE,
  },
  {
    label: "Archived habits",
    value: HABIT_FILTERS.ARCHIVED,
  },
  {
    label: "All habits",
    value: HABIT_FILTERS.ALL,
  },
];
