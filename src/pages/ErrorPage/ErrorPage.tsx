import { Button } from "../../ui/Button/Button";
import styles from "./ErrorPage.module.css";
import { useNavigate } from "react-router-dom";

export function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.message}>
          <strong>404 - Page Not Found</strong>
          <span>Sorry, the page you are looking for does not exist.</span>
        </div>
        <Button onClick={() => navigate("/")} variant="secondary">
          Home
        </Button>
      </div>
    </div>
  );
}
