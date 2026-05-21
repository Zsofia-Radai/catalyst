import { Legend, Pie, PieChart, Tooltip } from "recharts";
import layout from "../layout/AppLayout.module.css";
import styles from "./AnalyticsPage.module.css";

export function AnalyticsPage() {
  const data = [
    { name: "Mind", value: 20, fill: "green" },
    { name: "Body", value: 6, fill: "red" },
    { name: "Career", value: 1.5, fill: "yellow" },
    { name: "Hobby", value: 2, fill: "blue" },
  ];
  return (
    <div className={layout.page}>
      <div>AnalyticsPage</div>
      <div className={styles.rechartsWrapper}>
        <PieChart width={400} height={400}>
          <Legend
            wrapperStyle={{
              bottom: "3rem",
            }}
          />
          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="50%"
            shape
            stroke="#111827"
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
      </div>
    </div>
  );
}
