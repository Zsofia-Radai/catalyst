import styles from "./CustomTooltip.module.css";

type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    value: number;
    name: string;
    payload: {
      name?: string;
      label?: string;
      loggedHours?: number;
      value?: number;
    };
  }[];
  label?: string;
};

export function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0];

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>
        {item.payload.name ?? item.payload.label ?? label}
      </div>

      <div className={styles.tooltipValue}>{Number(item.value)}h logged</div>
    </div>
  );
}
