import axios from 'axios';
import { useRef, useState, type KeyboardEvent } from 'react';
import { FaArrowUp } from 'react-icons/fa';
import { Button } from './ui/button';
import { useForm } from 'react-hook-form';

type FormData = {
   prompt: string;
};

type ChatResponse = {
   message: string;
};

const ChatBot = () => {
   const [messages, setMessages] = useState<string[]>([]);
   const { register, handleSubmit, reset, formState } = useForm<FormData>();
   const conversationId = useRef(crypto.randomUUID());

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, prompt]);
      reset();
      const { data } = await axios.post<ChatResponse>('/api/chat', {
         prompt: prompt,
         conversationId: conversationId.current,
      });

      console.log(data);

      setMessages((prev) => [...prev, data.message]);
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault();
         handleSubmit(onSubmit)();
      }
   };

   return (
      <div>
         <div>
            {messages.map((message, index) => (
               <p key={index} className="">
                  {message}
               </p>
            ))}
         </div>
         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            className="flex flex-col gap-2 items-end border-2 p-2 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0,
               })}
               placeholder="Ask anything"
               maxLength={1000}
               className="w-full bor focus:outline-0 resize-none"
            />
            <Button
               disabled={!formState.isValid}
               className="rounded-full w-9 h-9"
            >
               <FaArrowUp />
            </Button>
         </form>
      </div>
   );
};

export default ChatBot;
