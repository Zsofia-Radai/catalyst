import styles from "./ToastNotification.module.css";

export type ToastNotificationType = "success" | "delete" | "error";

export type ToastNotificationProps = {
  type: ToastNotificationType;
  message: string;
};

export function ToastNotification({ type, message }: ToastNotificationProps) {
  const toastStyle =
    type === "success"
      ? styles.success
      : type === "delete"
        ? styles.delete
        : styles.error;

  return (
    <div className={`${styles.notification} ${toastStyle}`}>{message}</div>
  );
}
