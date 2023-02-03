import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { ConversationList } from "../../components/ConversationList";
import { CreateConversationModal } from "../../components/CreateConversationModal";
import { CreateConversationPrompt } from "../../components/CreateConversationPrompt";
import { MessageFeed } from "../../components/MessageFeed";
import { Sidebar } from "../../components/Sidebar";
import { useChatStore } from "../../store/chat-store";

const ChatPage = () => {
  const router = useRouter();
  const { status } = useSession();
  const { conversations, conversationsLoading, setActive } = useChatStore(
    (s) => ({
      conversations: s.conversations,
      conversationsLoading: s.conversationsLoading,
      setActive: s.setActiveConversation,
    })
  );

  useEffect(() => {
    if (router.query.id) {
      setActive(router.query.id[0] as string);
    }
  }, [router.query]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status]);

  return (
    <div className="relative flex h-screen bg-gray-100">
      <CreateConversationModal />

      <Sidebar />
      <ConversationList />

      <div className="relative flex h-full w-11/12 flex-col bg-slate-700 p-5 md:w-7/12 lg:w-8/12 xl:w-6/12">
        {!conversationsLoading && conversations.length === 0 && (
          <CreateConversationPrompt />
        )}

        {conversations.length > 0 && <MessageFeed />}
      </div>
      <div className="flex h-full bg-slate-800 lg:w-0 xl:w-2/12 xl:p-5"></div>
    </div>
  );
};

export default ChatPage;
