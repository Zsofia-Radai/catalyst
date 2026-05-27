import { Clock3, ListChecks, Trophy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useHabits } from "../../features/habits/context/HabitsContext";
import {
  HABIT_CATEGORY_META,
  type HabitCategory,
} from "../../features/habits/types/habit";
import { calculateHabitLoggedHours } from "../../features/habits/utils/habitsUtils";
import { useSessions } from "../../features/sessions/context/SessionsContext";
import layout from "../../layout/AppLayout.module.css";
import { EmptyState } from "../../ui/EmptyState/EmptyState";
import { Tabs } from "../../ui/Tabs/Tabs";
import styles from "./AnalyticsPage.module.css";
import { StatCard } from "./StatCard/StatCard";
import {
  ANALYTICS_RANGE_TABS,
  ANALYTICS_RANGES,
  HABIT_FILTER_TABS,
  HABIT_FILTERS,
  type AnalyticsRange,
} from "./types/analytics.types";
import {
  getCategoryHours,
  getLoggedHoursTrend,
  isSessionInRange,
} from "./utils/analyticsUtils";

export function AnalyticsPage() {
  const { sessions } = useSessions();
  const { habits } = useHabits();
  const navigate = useNavigate();
  const [range, setRange] = useState<AnalyticsRange>(ANALYTICS_RANGES.WEEK);
  const [habitFilter, setHabitFilter] = useState(HABIT_FILTERS.ACTIVE);

  const filteredHabits = habits.filter((habit) => {
    if (habitFilter === HABIT_FILTERS.ACTIVE) {
      return !habit.archived;
    }

    if (habitFilter === HABIT_FILTERS.ARCHIVED) {
      return habit.archived;
    }

    return habits;
  });

  const filteredSessions = sessions.filter(
    (session) =>
      session.completed &&
      isSessionInRange(session, range) &&
      filteredHabits.some((habit) => habit.id === session.habitId),
  );

  const loggedHoursByHabit = filteredHabits.map((habit) => {
    return {
      name: habit.name,
      loggedHours: calculateHabitLoggedHours(habit.id, filteredSessions),
      fill: habit.color,
    };
  });

  const categoryHours = getCategoryHours(filteredSessions, filteredHabits);

  const loggedHoursByCategory = Object.entries(categoryHours).map(
    ([category, value]) => {
      const meta = HABIT_CATEGORY_META[category as HabitCategory];

      return {
        name: meta.label,
        value,
        fill: meta.color,
      };
    },
  );

  const totalLoggedHours = loggedHoursByHabit.reduce(
    (total, habit) => total + habit.loggedHours,
    0,
  );

  const mostActiveHabit = loggedHoursByHabit.reduce(
    (max, habit) => (habit.loggedHours > max.loggedHours ? habit : max),
    loggedHoursByHabit[0],
  );

  const loggedHoursTrend = getLoggedHoursTrend(filteredSessions, range);

  const margin = {
    top: 100,
    right: 30,
    left: 20,
    bottom: 25,
  };

  return (
    <div className={layout.page}>
      <div className={styles.filters}>
        <Tabs tabs={ANALYTICS_RANGE_TABS} value={range} onChange={setRange} />
        <Tabs
          tabs={HABIT_FILTER_TABS}
          value={habitFilter}
          onChange={setHabitFilter}
        />
      </div>
      {filteredSessions.length === 0 ? (
        <EmptyState
          title="No completed session yet."
          description="Complete a session from the planner to see analytics."
          actionLabel="Got to planner"
          action={() => navigate("/")}
        />
      ) : (
        <div>
          <div className={styles.summary}>
            <div className={styles.stats}>
              <StatCard
                icon={Clock3}
                label="Tracked"
                value={`${totalLoggedHours}h`}
              />
              <StatCard
                icon={ListChecks}
                label="Sessions"
                value={filteredSessions.length}
              />
              <StatCard
                icon={Trophy}
                label="Most active habit"
                value={mostActiveHabit.name}
              />
            </div>
          </div>
          <div className={styles.chartsContainer}>
            <div className={styles.chart}>
              <div className={styles.title}>Logged hours by habit</div>
              <ResponsiveContainer width={380} height={350}>
                <PieChart width={400} height={400}>
                  <Legend
                    wrapperStyle={{
                      bottom: "3rem",
                    }}
                  />
                  <Pie
                    data={loggedHoursByHabit}
                    dataKey="loggedHours"
                    cx="50%"
                    cy="50%"
                    outerRadius="50%"
                    shape
                    stroke="var(--secondary)"
                    strokeWidth={2}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111827",
                      border: "1px solid #374151",
                      borderRadius: "12px",
                      color: "#f3f4f6",
                    }}
                    labelStyle={{
                      color: "#9ca3af",
                      fontWeight: 600,
                    }}
                    itemStyle={{
                      color: "#f3f4f6",
                    }}
                    formatter={(value) => [`${value} hours`, "Total logged"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chart}>
              <div className={styles.title}>Logged hours by category</div>
              <ResponsiveContainer width={380} height={350}>
                <BarChart data={loggedHoursByCategory} margin={margin}>
                  <XAxis
                    dataKey="name"
                    label={{
                      position: "insideBottomRight",
                    }}
                  />
                  <YAxis
                    label={{
                      position: "insideTopLeft",
                    }}
                  />
                  <Bar dataKey="value" fill="fill" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={styles.chart}>
              <div className={styles.title}>Logged hours by {range}</div>

              <div className={styles.chartScroll}>
                <div
                  className={styles.chartInner}
                  style={{
                    minWidth:
                      range === ANALYTICS_RANGES.WEEK ? "100%" : "900px",
                  }}
                >
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={loggedHoursTrend}>
                      <XAxis
                        dataKey="label"
                        stroke="var(--muted)"
                        interval={
                          range === ANALYTICS_RANGES.WEEK
                            ? 0
                            : range === ANALYTICS_RANGES.MONTH
                              ? 3
                              : 0
                        }
                      />
                      <YAxis stroke="var(--muted)" />

                      <Line
                        type="monotone"
                        dataKey="loggedHours"
                        stroke="var(--text)"
                        strokeWidth={2}
                        dot={(props) => {
                          if (props.payload.loggedHours === 0) {
                            return null;
                          }
                          // Recharts passes extra props (like `points`) which are
                          // incompatible with SVGProps for <circle>. Extract only
                          // the positional props we need (cx, cy) and render the
                          // circle with an explicit type to satisfy TypeScript.
                          const { cx, cy } = props as unknown as {
                            cx?: number;
                            cy?: number;
                          };

                          if (cx == null || cy == null) return null;

                          return <circle cx={cx} cy={cy} r={3} fill="white" />;
                        }}
                        activeDot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
