import React from "react";
import { useChatStore } from "../store/chat-store";
import { Button } from "../ui/Button";

export const CreateConversationPrompt = () => {
  const openModal = useChatStore(
    (s) => () => s.setCreateConversationModal(true)
  );

  return (
    <div className="flex h-full w-6/12 flex-col items-center justify-center bg-slate-700 p-5">
      <div>
        <h1 className="mb-4 text-2xl text-white">You Have No Conversations</h1>

        <Button type="button" onClick={openModal}>
          Create Conversation
        </Button>
      </div>
    </div>
  );
};
