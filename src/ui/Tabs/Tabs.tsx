import { Button } from "../Button/Button";
import styles from "./Tabs.module.css";

type TabOption<T extends string> = {
  label: string;
  value: T;
};

type TabsProps<T extends string> = {
  tabs: TabOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: TabsProps<T>) {
  return (
    <div className={styles.tabs}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          type="button"
          className={value === tab.value ? styles.activeTab : styles.tab}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
