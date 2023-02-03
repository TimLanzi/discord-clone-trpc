import React, { useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { useChatStore } from "../store/chat-store";

export const Sidebar = () => {
  const { data: session } = useSession();
  const [show, setShow] = useChatStore((s) => [
    s.showConversationsList,
    s.setShowConversationsList,
  ]);

  const toggle = useCallback(() => setShow(!show), [show]);

  return (
    <div className="z-20 flex h-full w-2/12 flex-col items-center justify-between bg-slate-700 px-3 py-5 sm:px-2 md:w-1/12 lg:w-1/12 lg:px-4 xl:px-5">
      <div className="flex flex-col items-center space-y-4">
        <img
          className="h-8 w-8 rounded-full object-cover sm:h-14 sm:w-14 md:h-12 md:w-12 lg:h-16 lg:w-16"
          src={
            session?.user?.image ||
            "https://pbs.twimg.com/profile_images/1391729280/IMG_0001_400x400.JPG"
          }
          alt="Profile picture"
        />

        <button type="button" className="block md:hidden" onClick={toggle}>
          <svg
            className="h-8 w-8 text-white md:h-10 md:w-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="4" y1="12" x2="20" y2="12"></line>
            <line x1="4" y1="6" x2="20" y2="6"></line>
            <line x1="4" y1="18" x2="20" y2="18"></line>
          </svg>
        </button>
      </div>

      <button type="button" onClick={() => void signOut()}>
        <svg
          className="h-8 w-8 rotate-180 text-white md:h-10 md:w-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
          <polyline points="16 17 21 12 16 7"></polyline>
          <line x1="21" y1="12" x2="9" y2="12"></line>
        </svg>
      </button>
    </div>
  );
};
