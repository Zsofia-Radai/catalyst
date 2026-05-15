import type { CSSProperties } from "react";
import styles from "./Button.module.css";

type ButtonTypes = "button" | "submit" | "reset";

type ButtonProps = {
  type: ButtonTypes;
  children: React.ReactNode;
  onClick?: () => void;
  variant?: string;
  className?: string;
  style?: CSSProperties;
};

export function Button({
  type,
  children,
  onClick,
  variant,
  className,
  style,
}: ButtonProps) {
  const variantClass = variant ? styles[variant] : "";
  return (
    <button
      className={`${styles.button} ${variantClass} ${className || ""}`}
      type={type}
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
}
