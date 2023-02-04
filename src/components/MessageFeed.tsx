import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { useChatStore } from "../store/chat-store";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { api } from "../utils/api";
import { Message } from "./Message";

export const MessageFeed = () => {
  const { data: session } = useSession();
  const feedBottom = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");

  const { loading, conversationId, messageFeed, metadata } = useChatStore(
    (s) => ({
      conversationId: s.activeConversationId,
      loading: s.activeConversationLoading,
      messageFeed: s.messageFeed,
      metadata: s.activeConversationMeta,
    })
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
        {metadata &&
          metadata.users
            ?.filter((u) => u.id !== session?.user.id)
            .map((u) => u.name)
            .join(", ")}
      </h1>
      {!!conversationId && loading && (
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
