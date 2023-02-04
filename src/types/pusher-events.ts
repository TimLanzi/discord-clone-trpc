import type { Message, User } from "@prisma/client";

export type MessageWithUser = Message & {
  user: User;
};

export type NewMessageEvent = {
  conversationId: string;
  message: MessageWithUser,
}

export type NewConversationEvent = {
  conversationId: string;
};