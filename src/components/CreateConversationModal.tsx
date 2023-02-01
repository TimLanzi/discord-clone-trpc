import { Combobox, Transition } from "@headlessui/react";
import { User } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { MutatingDots } from "react-loader-spinner";
import { useDebounce } from "../hooks/useDebounce";
import { useChatStore } from "../store/chat-store";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Modal } from "../ui/Modal";
import { TextArea } from "../ui/TextArea";
import { api } from "../utils/api";

export const CreateConversationModal = () => {
  const [show, setShow] = useChatStore((s) => [
    s.showCreateConversationModal,
    s.setCreateConversationModal,
  ]);

  const [userQuery, setUserQuery] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  const { data, refetch } = api.messaging.searchUser.useQuery(
    { query: userQuery },
    {
      enabled: false,
      refetchOnWindowFocus: false,
    }
  );
  const { status, mutate } = api.messaging.createConversation.useMutation({
    onSuccess: () => {
      setShow(false);
      setUser(null);
      setMessage("");
    },
  });

  useDebounce(
    () => {
      if (userQuery.length > 0) refetch();
    },
    500,
    [userQuery]
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user || !message) return;

    mutate({ userId: user.id, message });
  };

  return (
    <Modal
      open={show}
      onClose={() => setShow(false)}
      title="Create Conversation"
      size="md"
    >
      <div className="mt-5 flex flex-col items-center justify-center">
        {status == "loading" && (
          <div className="absolute inset-0 z-10 flex w-full items-center justify-center bg-black/40">
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
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-5">
            <Combobox
              value={user}
              onChange={(val) => {
                setUser(val);
                setUserQuery(val?.name || "");
              }}
            >
              <div className="relative">
                <Combobox.Input
                  as={Input}
                  placeholder="Search users"
                  name="userQuery"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                />
                <Transition
                  as={React.Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  // afterLeave={() => setUserQuery("")}
                >
                  <Combobox.Options className="absolute mt-1 max-h-60 w-full divide-y divide-slate-500 overflow-auto rounded-md bg-slate-600 px-2 text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {data?.map((user) => (
                      <Combobox.Option
                        key={user.id}
                        className="py-2"
                        value={user}
                      >
                        {user.name}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>

          <div className="mb-5">
            <TextArea
              placeholder="Message..."
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={status === "loading"}>
            Send Message
          </Button>
        </form>
      </div>
    </Modal>
  );
};
