import type { LucideIcon } from "lucide-react";
import styles from "./StatCard.module.css";

type StatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string | number;
};

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className={styles.statCard}>
      <div className={styles.statIcon}>
        <Icon size={20} />
      </div>

      <div>
        <div className={styles.statValue}>{value}</div>
        <div className={styles.statLabel}>{label}</div>
      </div>
    </div>
  );
}
