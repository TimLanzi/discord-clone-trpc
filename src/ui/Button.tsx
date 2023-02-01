import { forwardRef } from "react";

type ButtonProps = {} & React.ComponentPropsWithoutRef<"button">;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className="rounded-lg bg-indigo-500 py-2 px-4 text-white hover:bg-indigo-600"
        {...props}
      >
        {children}
      </button>
    );
  }
);
