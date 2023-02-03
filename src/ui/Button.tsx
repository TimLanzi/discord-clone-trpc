import { forwardRef } from "react";

type ButtonProps = React.ComponentPropsWithoutRef<"button">;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className="rounded-lg bg-indigo-500 py-2 px-2 text-white hover:bg-indigo-600 md:px-4"
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
