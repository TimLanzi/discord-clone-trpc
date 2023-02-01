import { forwardRef } from "react";

type InputProps = {} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <input
      ref={ref}
      className="w-full rounded-lg border border-slate-500 bg-slate-700 p-2 text-white"
      {...props}
    />
  );
});
