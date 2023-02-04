import React, { type PropsWithChildren, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useChatStore } from "../store/chat-store";
import { api } from "../utils/api";
import {
  MESSAGE_CHANNEL,
  NEW_CONVERSATION_EVENT,
  NEW_MESSAGE_EVENT,
} from "../utils/pusher-channels-events";
import { pusher } from "../utils/pusher-client";
import type {
  NewMessageEvent,
  NewConversationEvent,
} from "../types/pusher-events";

export const ChatProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const { status: sessionStatus } = useSession();
  const {
    activeConversationId,
    setActive,
    setActiveConversationLoading,
    setActiveConversationMeta,
    setConversationsListLoading,
    setConversations,
    setShowConversationsList,
    setMessageFeed,
    addMessageToFeed,
  } = useChatStore((s) => ({
    activeConversationId: s.activeConversationId,
    setActive: s.setActiveConversationId,
    setActiveConversationLoading: s.setActiveConversationLoading,
    setActiveConversationMeta: s.setActiveConversationMeta,
    setConversationsListLoading: s.setConversationsListLoading,
    setConversations: s.setConversations,
    setShowConversationsList: s.setShowConversationsList,
    setMessageFeed: s.setMessageFeed,
    addMessageToFeed: s.addMessageToFeed,
  }));

  const {
    data: conversations,
    status: conversationsStatus,
    refetch: refetchConversations,
  } = api.messaging.getConversations.useQuery();

  const { status: activeConversationStatus } =
    api.messaging.getConversation.useQuery(
      { conversationId: activeConversationId! },
      {
        enabled: !!activeConversationId,
        refetchOnWindowFocus: false,
        onSuccess: ({ messages, ...meta }) => {
          setActiveConversationMeta(meta);
          setMessageFeed(messages);
        },
      }
    );

  // Redirect to login in unauthenticated
  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      void router.push("/api/auth/signin");
    }
  }, [sessionStatus]);

  // Set active conversation from router param
  useEffect(() => {
    if (router.query.id) {
      setActive(router.query.id[0] as string);
    }
  }, [router.query]);

  // Hide conversations list on router change
  useEffect(() => {
    setShowConversationsList(false);
  }, [router]);

  // Update loading status in store
  useEffect(() => {
    if (conversationsStatus !== "loading") setConversationsListLoading(false);
    else setConversationsListLoading(true);
  }, [conversationsStatus]);

  useEffect(() => {
    if (activeConversationStatus !== "loading")
      setActiveConversationLoading(false);
    else setActiveConversationLoading(true);
  }, [activeConversationStatus]);

  // Set conversations and set active conversation in store
  useEffect(() => {
    if (!!conversations) {
      setConversations(conversations);
      if (conversations.length > 0 && !router.query.id) {
        setActive(conversations[0]!.id);
        void router.push(`/chat/${conversations[0]!.id}`);
      } else if (!!router.query.id) {
        setActive(router.query.id[0] as string);
      }
    }
  }, [conversations]);

  // Bind new conversation event
  useEffect(() => {
    const channel = pusher.subscribe(MESSAGE_CHANNEL);
    channel.bind(NEW_CONVERSATION_EVENT, (_data: NewConversationEvent) => {
      void refetchConversations();
    });

    return () => {
      channel.unbind(NEW_CONVERSATION_EVENT);
    };
  }, []);

  // Bind current conversation event
  useEffect(() => {
    if (!activeConversationId) return;

    const channel = pusher.subscribe(MESSAGE_CHANNEL);
    channel.bind(
      NEW_MESSAGE_EVENT(activeConversationId),
      (data: NewMessageEvent) => {
        addMessageToFeed(data.message);
      }
    );

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT(activeConversationId));
    };
  }, [activeConversationId]);

  return <>{children}</>;
};
