import { useSession } from 'next-auth/react';
import React from 'react'

type MessageProps = {
  text: string;
  sender: string;
}

export const Message: React.FC<MessageProps> = ({ text, sender }) => {
  const { data: session } = useSession();
  return (
    <div className="p-2 mb-2 text-white">
      <p className={`text-sm font-bold ${session?.user.name === sender ? 'text-indigo-400' : ''}`}>
        {session?.user.name === sender ? 'You' : sender}
      </p>
      <p className="text-sm">{text}</p>
    </div>
  )
}
