"use client";

import React, { Fragment, PropsWithChildren } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { cva, VariantProps } from "class-variance-authority";

const modalStyles = cva(
  "relative w-full transform overflow-hidden rounded-lg bg-slate-700 text-white p-6 text-left align-middle shadow-xl transition-all",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
        "3xl": "max-w-3xl",
        "4xl": "max-w-4xl",
        "5xl": "max-w-5xl",
        "6xl": "max-w-6xl",
        "7xl": "max-w-7xl",
        full: "max-w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

type ModalProps = {
  title?: string;
  open: boolean;
  onClose: () => void;
} & VariantProps<typeof modalStyles> &
  PropsWithChildren;

export const Modal: React.FC<ModalProps> = ({
  title,
  open,
  onClose,
  size,
  children,
}) => {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className={modalStyles({ size })}>
                <button
                  type="button"
                  className="absolute top-2 right-2 z-20 text-gray-500 hover:text-gray-700"
                  onClick={onClose}
                >
                  <svg
                    className="h-8 w-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
                {title && (
                  <Dialog.Title
                    as="h3"
                    className="text-site-dark-blue text-2xl leading-6"
                  >
                    {title}
                  </Dialog.Title>
                )}
                <div className={title ? "mt-2" : ""}>{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
