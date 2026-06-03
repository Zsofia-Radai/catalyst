import styles from "./CustomLegend.module.css";

type CustomLegendProps = {
  payload?: {
    id: string;
    value: string;
    color: string;
  }[];
};

export function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload) return null;

  return (
    <div className={styles.legend}>
      {payload.map((entry) => (
        <div key={entry.id} className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: entry.color }}
          />
          <span>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}
