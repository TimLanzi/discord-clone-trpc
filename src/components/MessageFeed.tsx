import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { useChatStore } from "../store/chat-store";
import { NewMessageEvent } from "../types/pusher-events";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../utils/api";
import { NEW_MESSAGE_EVENT } from "../utils/pusher-channels-events";
import { pusher } from "../utils/pusher-client";
import { Message } from "./Message";

export const MessageFeed = () => {
  const { data: session } = useSession();
  const feedBottom = useRef<HTMLDivElement>(null);
  const [conversationId, messageFeed, setMessageFeed, addMessageToFeed] =
    useChatStore((s) => [
      s.activeConversationId,
      s.messageFeed,
      s.setMessageFeed,
      s.addMessageToFeed,
    ]);
  const conversation = api.messaging.getConversation.useQuery(
    { conversationId: conversationId! },
    {
      enabled: !!conversationId,
      refetchOnWindowFocus: false,
      onSuccess: (data) => setMessageFeed(data.messages),
    }
  );

  const { mutate } = api.messaging.sendMessage.useMutation({
    onSuccess: () => {
      setMessage("");
      scrollToBottom();
    },
  });

  const scrollToBottom = () => {
    feedBottom.current?.scrollIntoView();
  };

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    const channel = pusher.subscribe("messaging");
    channel.bind(NEW_MESSAGE_EVENT(conversationId), (data: NewMessageEvent) => {
      addMessageToFeed(data.message);
    });

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT(conversationId));
    };
  }, [conversationId]);

  useEffect(() => {
    if (messageFeed) scrollToBottom();
  }, [messageFeed]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!message) return;

    mutate({ conversationId: conversationId!, text: message });
  };

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold text-white">
        {conversationId &&
          conversation.data?.users
            ?.filter((u) => u.id !== session?.user.id)
            .map((u) => u.name)
            .join(", ")}
      </h1>
      {!!conversationId && conversation.isLoading && (
        <div className="absolute inset-0 z-10 flex w-full items-center justify-center">
          <MutatingDots
            height="100"
            width="100"
            color=""
            secondaryColor=""
            radius="12.5"
            ariaLabel="mutating-dots-loading"
            wrapperStyle={{}}
            wrapperClass="fill-indigo-500"
            visible={true}
          />
        </div>
      )}

      {!!messageFeed && (
        <>
          <div className="flex flex-grow flex-col overflow-y-scroll">
            {/* pads the top */}
            <div className="flex-grow" />
            {messageFeed.map((message) => (
              <Message
                key={message.id}
                text={message.text}
                sender={message.user.name!}
              />
            ))}
            <div ref={feedBottom} className="h-0 w-full" />
          </div>

          <form className="flex space-x-2 pt-4" onSubmit={onSubmit}>
            <Input
              type="text"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />

            <Button type="submit">Send</Button>
          </form>
        </>
      )}
    </>
  );
};
