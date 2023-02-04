import type { Message } from "@prisma/client";

type WithMostRecentMessage<T extends { messages: Message[] }> = T & {
  mostRecentMessage: Message;
};

export function computeMostRecentMessage<T extends { messages: Message[] }>(
  conversation: T
): WithMostRecentMessage<T> {
  const mostRecentMessage = conversation.messages.reduce((prev, current) =>
    prev.createdAt > current.createdAt ? prev : current
  );

  return {
    ...conversation,
    mostRecentMessage,
  };
}