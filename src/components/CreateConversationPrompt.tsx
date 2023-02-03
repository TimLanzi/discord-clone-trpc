import React from "react";
import { useChatStore } from "../store/chat-store";
import { Button } from "../ui/Button";

export const CreateConversationPrompt = () => {
  const openModal = useChatStore(
    (s) => () => s.setCreateConversationModal(true)
  );

  return (
    <div className="flex h-full items-center justify-center ">
      <div>
        <h1 className="mb-4 text-2xl text-white">You Have No Conversations</h1>

        <Button type="button" onClick={openModal}>
          Create Conversation
        </Button>
      </div>
    </div>
  );
};
