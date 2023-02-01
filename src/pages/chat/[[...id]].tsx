import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ConversationList } from "../../components/ConversationList";
import { CreateConversationModal } from "../../components/CreateConversationModal";
import { CreateConversationPrompt } from "../../components/CreateConversationPrompt";
import { MessageFeed } from "../../components/MessageFeed";
import { Sidebar } from "../../components/Sidebar";
import { useChatStore } from "../../store/chat-store";
import { api } from "../../utils/api";

const ChatPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { conversations, conversationsLoading } = useChatStore((s) => ({
    conversations: s.conversations,
    conversationsLoading: s.conversationsLoading,
  }));

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status]);

  return (
    <div className="flex h-screen bg-gray-100">
      <CreateConversationModal />

      <Sidebar />
      <ConversationList />
      {!conversationsLoading && conversations.length === 0 && (
        <CreateConversationPrompt />
      )}

      {conversations.length > 0 && <MessageFeed />}
      <div className="flex h-full w-2/12 bg-slate-800 p-5"></div>
    </div>
  );
};

export default ChatPage;
