import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useChatStore } from "../store/chat-store";
import { Input } from "../ui/Input";
import { api } from "../utils/api";
import { pusher } from "../utils/pusher-client";

export const ConversationList = () => {
  const router = useRouter();
  const {
    data: conversations,
    status,
    refetch,
  } = api.messaging.getConversations.useQuery();
  const [
    setConversations,
    setConversationsLoading,
    openModal,
    setActiveConversation,
  ] = useChatStore((s) => [
    s.setConversations,
    s.setConversationsLoading,
    () => s.setCreateConversationModal(true),
    s.setActiveConversation,
  ]);

  useEffect(() => {
    if (status !== "loading") setConversationsLoading(false);
    else setConversationsLoading(true);
  }, [status]);

  useEffect(() => {
    const channel = pusher.subscribe("messaging");
    channel.bind("new-conversation", (_data: any) => {
      refetch();
    });

    return () => {
      channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!!conversations) {
      setConversations(conversations);
      if (conversations.length > 0 && !router.query.id) {
        setActiveConversation(conversations[0]!.id);
        router.push(`/chat/${conversations[0]!.id}`);
      } else if (!!router.query.id) {
        setActiveConversation(router.query.id[0] as string);
      }
    }
  }, [conversations]);

  return (
    <div className="h-full w-1/4 bg-slate-800 p-5">
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
