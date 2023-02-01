import { Message, User } from "@prisma/client";

type MessageWithReadBy = Message & { readBy: User[] };

type WithUnreadMessages<T extends { messages: MessageWithReadBy[] }> = T & {
  unreadMessages: number;
}

export function computeUnreadMessages<T extends { messages: MessageWithReadBy[] }>(
  conversation: T,
  userId: string,
): WithUnreadMessages<T> {
  const unreadMessages = conversation.messages.reduce((prev, curr) => {
    const read = curr.readBy.findIndex(user => user.id === userId);
    return read >= 0 ? prev + 1 : prev;
  }, 0)

  return {
    ...conversation,
    unreadMessages,
  };
}