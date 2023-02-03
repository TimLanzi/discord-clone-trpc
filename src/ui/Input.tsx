import { forwardRef } from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      className="w-full rounded-lg border border-slate-500 bg-slate-700 p-2 text-white"
      {...props}
    />
  );
});

Input.displayName = "Input";
export { Input };
