import React, { type ButtonHTMLAttributes } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
}

/**
 * A reusable, accessible Button component.
 * Uses BEM-style utility classes for styling.
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}) => {
  const classes = [
    "btn",
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? "btn--full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
