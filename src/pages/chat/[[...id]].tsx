import React from "react";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { ChatProvider } from "../../components/ChatProvider";
import { ConversationList } from "../../components/ConversationList";
import { CreateConversationModal } from "../../components/CreateConversationModal";
import { CreateConversationPrompt } from "../../components/CreateConversationPrompt";
import { MessageFeed } from "../../components/MessageFeed";
import { Sidebar } from "../../components/Sidebar";
import { useChatStore } from "../../store/chat-store";

const ChatPage = () => {
  const { data: session } = useSession();
  const { conversations, listLoading, metadata } = useChatStore((s) => ({
    conversations: s.conversations,
    listLoading: s.conversationsListLoading,
    active: s.activeConversationId,
    metadata: s.activeConversationMeta,
  }));

  return (
    <ChatProvider>
      <div className="relative flex h-screen bg-gray-100">
        <Head>
          <title>
            {!!metadata
              ? `Conversation with ${
                  metadata.users
                    ?.filter((u) => u.id !== session?.user.id)
                    .map((u) => u.name)
                    .join(", ") || ""
                }`
              : "Conversation"}
          </title>
        </Head>

        <CreateConversationModal />

        <Sidebar />
        <ConversationList />

        <div className="relative flex h-full w-11/12 flex-col bg-slate-700 p-5 md:w-7/12 lg:w-8/12 xl:w-6/12">
          {!listLoading && conversations.length === 0 && (
            <CreateConversationPrompt />
          )}

          {conversations.length > 0 && <MessageFeed />}
        </div>
        <div className="flex h-full bg-slate-800 lg:w-0 xl:w-2/12 xl:p-5"></div>
      </div>
    </ChatProvider>
  );
};

export default ChatPage;
