import type { ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "save" | "delete" | "secondary" | "icon" | "neutral";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  variant,
  className,
  ...props
}: ButtonProps) {
  const variantClass = variant ? styles[variant] : "";
  return (
    <button
      className={`${styles.button} ${variantClass} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
