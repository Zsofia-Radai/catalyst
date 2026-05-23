import { useNavigate, type Session } from "react-router-dom";
import { useHabits } from "../features/habits/context/HabitsContext";
import { HABIT_CATEGORY_META } from "../features/habits/types/habit";
import { useSessions } from "../features/sessions/context/SessionsContext";
import layout from "../layout/AppLayout.module.css";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import {
  formatDate,
  formatSessionTime,
  getHabitData,
} from "../utils/dashboardUtils";
import styles from "./SessionsPage.module.css";
import { Trash } from "lucide-react";
import { Button } from "../ui/Button/Button";
import { useState } from "react";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal/DeleteConfirmModal";
import { useToast } from "../context/ToastContext";

export function SessionsPage() {
  const { sessions, deleteSession } = useSessions();
  const { habits } = useHabits();
  const { showToast } = useToast();
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] =
    useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const navigate = useNavigate();
  const completedSessions = sessions.filter((session) => session.completed);
  const latestSessions = [...completedSessions]
    .sort(
      (a, b) =>
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
    )
    .slice(0, 20);

  const handleDeleteSession = () => {
    if (!sessionToDelete) return;
    deleteSession(sessionToDelete.id);
    showToast("Session deleted!", "delete");
  };

  return (
    <div className={layout.page}>
      {latestSessions.length === 0 && (
        <EmptyState
          title="No completed session yet."
          description="Complete a session from the planner."
          actionLabel="Got to planner"
          action={() => navigate("/")}
        />
      )}
      <div className={styles.sessionContainer}>
        <div className={styles.header}>
          <div className={layout.title}>Latest completed sessions</div>
          <div>Showing your 20 most recent completed sessions.</div>
        </div>
        {latestSessions.map((session) => {
          const habit = getHabitData(habits, session.habitId);
          if (!habit) return null;
          const meta = HABIT_CATEGORY_META[habit.category];
          const Icon = meta.icon;
          return (
            <div
              key={session.id}
              className={styles.sessionBlock}
              style={{ background: meta.color }}
            >
              <div className={styles.actions}>
                <Button
                  aria-label="Delete session"
                  variant="icon"
                  style={{ color: "var(--text)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConfirmDeleteModalOpen(true);
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>

              <div className={styles.date}>
                {formatDate(new Date(session.startedAt))}
              </div>
              <span className={styles.sessionTime}>
                {formatSessionTime(session.startedAt)} -{" "}
                {formatSessionTime(session.finishedAt)}
              </span>

              <Icon size={20} />
              <div>{habit?.name}</div>
              <div>{session.notes}</div>
            </div>
          );
        })}
      </div>
      {isConfirmDeleteModalOpen && (
        <DeleteConfirmModal
          title="Are you sure you want to delete this session?"
          onCancel={() => {
            setSessionToDelete(null);
            setIsConfirmDeleteModalOpen(false);
          }}
          onDelete={handleDeleteSession}
        />
      )}
    </div>
  );
}
