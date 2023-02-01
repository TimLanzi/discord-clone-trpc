import React from "react";
import { signOut, useSession } from "next-auth/react";

export const Sidebar = () => {
  const { data: session } = useSession();

  return (
    <div className="flex h-full w-1/12 flex-col items-center justify-between bg-slate-700 p-5">
      <div className="flex flex-col">
        <img
          className="h-16 w-16 rounded-full"
          src={
            session?.user?.image ||
            "https://pbs.twimg.com/profile_images/1391729280/IMG_0001_400x400.JPG"
          }
          alt="Profile picture"
        />
      </div>

      <button type="button" onClick={() => signOut()}>
        <svg
          className="h-10 w-10 text-white"
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
