import React from "react";
import Link from "next/link";
import { useChatStore } from "../store/chat-store";
import { Input } from "../ui/Input";
import { api } from "../utils/api";

export const ConversationList = () => {
  const { data: conversations } = api.messaging.getConversations.useQuery();
  const { openModal, show } = useChatStore((s) => ({
    openModal: () => s.setCreateConversationModal(true),
    show: s.showConversationsList,
  }));

  return (
    <div
      className={`absolute z-10 h-full w-10/12 px-5 transition-all duration-300 md:relative md:left-0 ${
        show ? "left-[16.666667%]" : "-left-full"
      } bg-slate-800 py-5 md:w-4/12 md:px-5 lg:w-1/4`}
    >
      <h1 className="mb-5 flex items-center justify-between text-2xl font-bold text-white">
        Conversations
        <button type="button" onClick={openModal}>
          <svg
            className="h-8 w-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
      </h1>

      <Input type="text" placeholder="Search for conversations" />

      {!!conversations && (
        <ul className="mt-4 list-none divide-y divide-slate-700">
          {conversations.map((conversation) => (
            <Link href={`/chat/${conversation.id}`} key={conversation.id}>
              <li className="py-2 text-white">
                {conversation.users.map((user) => user.name).join(", ")}
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};
