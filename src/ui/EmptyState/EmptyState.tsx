import { Link } from "react-router-dom";
import { Button } from "../Button/Button";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel: string;
  actionTo: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyStateProps) {
  return (
    <div>
      <div>{title}</div>
      <div>{description}</div>
      <Link to={actionTo}>
        <Button type="button" variant="save">
          {actionLabel}
        </Button>
      </Link>
    </div>
  );
}
