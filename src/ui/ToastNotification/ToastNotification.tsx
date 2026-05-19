import styles from "./ToastNotification.module.css";

export type ToastNotificationType = "save" | "delete";

export type ToastNotificationProps = {
  type: ToastNotificationType;
  message: string;
};

export function ToastNotification({ type, message }: ToastNotificationProps) {
  const toastStyle =
    type === "save" ? styles.save : type === "delete" ? styles.delete : "";

  return (
    <div className={`${styles.notification} ${toastStyle}`}>{message}</div>
  );
}
