import { forwardRef } from "react";

type TextAreaProps = {} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (props, ref) => {
    return (
      <textarea
        ref={ref}
        className="w-full rounded-lg border border-slate-500 bg-slate-700 p-2 text-white"
        {...props}
      />
    );
  }
);
