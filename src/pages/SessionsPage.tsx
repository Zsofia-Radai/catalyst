import { useNavigate } from "react-router-dom";
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
import { Calendar, Clock4, NotebookPen, Trash } from "lucide-react";
import { Button } from "../ui/Button/Button";
import { useState } from "react";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal/DeleteConfirmModal";
import { useToast } from "../context/ToastContext";
import type { Session } from "../features/sessions/types/session";
import { PageLoader } from "../ui/PageLoader/PageLoader";

export function SessionsPage() {
  const { sessions, deleteSession, isSessionsLoading } = useSessions();
  const { habits, isHabitsLoading } = useHabits();
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
    setIsConfirmDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  if (isSessionsLoading || isHabitsLoading) {
    return (
      <div className={layout.page}>
        <PageLoader />
      </div>
    );
  }

  return (
    <div className={layout.page}>
      <div className={styles.sessionContainer}>
        <div className={styles.header}>
          <div className={layout.title}>Latest completed sessions</div>
          <div>Showing your 20 most recent completed sessions.</div>
        </div>
        {latestSessions.length === 0 && (
          <EmptyState
            title="No completed session yet."
            description="Complete a session from the planner."
            actionLabel="Got to planner"
            action={() => navigate("/")}
          />
        )}
        {latestSessions.map((session) => {
          const habit = getHabitData(habits, session.habitId);
          if (!habit) return null;
          const meta = HABIT_CATEGORY_META[habit.category];
          const Icon = meta.icon;
          return (
            <div
              key={session.id}
              className={styles.sessionCard}
              style={{ "--habit-color": habit.color } as React.CSSProperties}
            >
              <div className={styles.sessionHeader}>
                <div className={styles.dateTime}>
                  <div className={styles.metaRow}>
                    <Calendar size={20} />
                    <span>{formatDate(new Date(session.startedAt))}</span>
                  </div>

                  <div className={styles.metaRow}>
                    <Clock4 size={20} />
                    <span>
                      {formatSessionTime(session.startedAt)} -{" "}
                      {formatSessionTime(session.finishedAt)}
                    </span>
                  </div>
                </div>

                <div className={styles.habitInfo}>
                  <Icon className={styles.categoryIcon} size={28} />
                  <span className={styles.habitName}>{habit?.name}</span>
                  <span className={styles.habitCategory}>{meta.label}</span>
                </div>
              </div>

              <div className={styles.notesContainer}>
                <div className={styles.notes}>
                  <NotebookPen size={18} />
                  <p>{session.notes}</p>
                </div>
              </div>

              <div className={styles.actions}>
                <Button
                  aria-label="Delete session"
                  variant="icon"
                  style={{ color: "var(--text)" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsConfirmDeleteModalOpen(true);
                    setSessionToDelete(session);
                  }}
                >
                  <Trash size={16} />
                </Button>
              </div>
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
