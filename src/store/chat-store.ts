import { create } from "zustand";
import type { Conversation, User } from "@prisma/client";
import type { MessageWithUser } from "../types/pusher-events";

type ConversationWithUsers = Conversation & { users: User[] };

type ActiveConversationMeta = Conversation & {
  users: {
      id: string;
      name: string | null;
      image: string | null;
  }[];
}

type ChatStore = {
  showCreateConversationModal: boolean;
  showConversationsList: boolean;
  conversationsListLoading: boolean;
  activeConversationId: string | null;
  activeConversationLoading: boolean;
  activeConversationMeta: ActiveConversationMeta | null;
  conversations: ConversationWithUsers[];
  messageFeed: MessageWithUser[],
  setActiveConversationId: (id: string|null) => void;
  setActiveConversationLoading: (loading: boolean) => void;
  setActiveConversationMeta: (c: ActiveConversationMeta) => void;
  setShowConversationsList: (show: boolean) => void;
  setConversations: (conversations: ConversationWithUsers[]) => void;
  setConversationsListLoading: (loading: boolean) => void;
  setCreateConversationModal: (show: boolean) => void;
  setMessageFeed: (messages: MessageWithUser[]) => void;
  addMessageToFeed: (message: MessageWithUser) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  showCreateConversationModal: false,
  showConversationsList: false,
  conversationsListLoading: true,
  activeConversationLoading: true,
  activeConversationId: null,
  activeConversationMeta: null,
  conversations: [],
  messageFeed: [],
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setActiveConversationLoading: (loading) => set({ activeConversationLoading: loading }),
  setActiveConversationMeta: (conv) => set({ activeConversationMeta: conv }),
  setShowConversationsList: (show) => set({ showConversationsList: show }),
  setConversations: (conversations) => set({ conversations }),
  setConversationsListLoading: (loading) => set({ conversationsListLoading: loading }),
  setCreateConversationModal: (show) => set({ showCreateConversationModal: show }),
  setMessageFeed: (messages) => set({ messageFeed: messages }),
  addMessageToFeed: (message) => set((state) => ({ messageFeed: [...state.messageFeed, message] })),
}));