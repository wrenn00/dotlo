import { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-sm font-medium" style={{ color: "#000000" }}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={[
            "w-full rounded-lg border px-4 py-3 text-base outline-none transition-colors",
            "placeholder:text-[#71717a]",
            error
              ? "border-[#ef4444] focus:border-[#ef4444]"
              : "border-[#e4e4e7] focus:border-[#6366f1]",
            className,
          ].join(" ")}
          {...props}
        />
        {error && (
          <p className="text-xs" style={{ color: "#ef4444" }}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
