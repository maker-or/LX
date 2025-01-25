'use client';

import { type Message, useChat } from 'ai/react';
import { Copy, Check, MoveUpRight, Square } from 'lucide-react';
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState, useRef } from "react";
import { marked } from "marked"; // Importing the marked library
import { AppSidebar } from "~/components/app-sidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    api: '/api/chat',
    onResponse: (response) => {
      setIsLoading(false);
      resetInputField(); // Reset the input field after the response is received
    },
    onError: (error) => {
      console.error('Error:', error);
      setIsLoading(false);
    },
  });

  const [submitted, setSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        200 // Max height in pixels
      )}px`;
    }
  };

  const resetInputField = () => {
    // Clear the input field
    setInput('');

    // Reset the height of the textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const copyMessage = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(id);
      setTimeout(() => setCopiedMessageId(null), 2000); // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const renderMarkdown = (content: string) => {
    return { __html: marked(content) }; // Render the content using marked
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setSubmitted(true);
    setIsLoading(true);

    try {
      await handleSubmit(event);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsLoading(false);
    }
  };

  // Handle textarea keydown events
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default behavior (new line)
      onSubmit(event); // Submit the form
    } else if (event.key === 'Enter' && event.shiftKey) {
      // Allow new line when Shift + Enter is pressed
      adjustTextareaHeight(); // Adjust textarea height dynamically
    }
  };

  return (
    <main className="flex h-[100svh] w-[100svw] flex-col items-center justify-center bg-[#f7eee3] text-[#0c0c0c]">
      <SidebarProvider>
        <AppSidebar className="shadow-md" />
        <SidebarInset className="bg-[#f7eee3]">
          <SidebarTrigger className="ml-4 text-[#0c0c0c]" />
          <div className="flex h-full w-full overflow-hidden bg-[#9c713d] gap-4 ">
            <div className="flex flex-col h-full w-full bg-[#f7eee3] overflow-hidden">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-6">
                {messages.map((m, index) => (
                  <div
                    key={m.id}
                    className={`flex flex-col gap-4 mb-6 animate-slide-in group relative`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {m.role === 'user' ? (
                      <div className="max-w-xl text-[2.2em] text-[#0c0c0c87] tracking-tight p-4">
                        <p className="whitespace-pre-wrap">{m.content}</p>
                      </div>
                    ) : (
                      <div
                        className="max-w-2xl text-[1.2rem] tracking-tight text-[#0c0c0c] rounded-xl p-4 relative"
                      >
                        <div dangerouslySetInnerHTML={renderMarkdown(m.content)} /> {/* Render Markdown */}
                        <button
                          onClick={() => copyMessage(m.content, m.id)}
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#0c0c0c] hover:text-[#FF5E00]"
                        >
                          {copiedMessageId === m.id ? (
                            <Check className="h-5 w-5 text-green-400" />
                          ) : (
                            <Copy className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="flex sticky bottom-0 z-10 p-5 items-center justify-center border-t border-[#e0d5c8]">
                <form onSubmit={onSubmit} className="flex w-full items-center justify-center">
                  <div
                    className={`relative flex items-center justify-center bg-[#252525] p-1 w-3/4 ${
                      textareaRef.current && textareaRef.current.value.split('\n').length > 1
                        ? 'rounded-lg' // Medium radius for multi-line input
                        : 'rounded-full' // Full radius for single-line input
                    }`}
                  >
                    <textarea
                      ref={textareaRef}
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => {
                        handleInputChange(e);
                        adjustTextareaHeight();
                      }}
                      onKeyDown={handleKeyDown} // Handle keydown events
                      onInput={adjustTextareaHeight}
                      className={`flex-grow w-3/4 h-full outline-none items-center justify-center bg-[#454444] py-4 px-4 text-[#f7eee3] resize-none overflow-y-auto placeholder-[#f7eee3bb] ${
                        textareaRef.current && textareaRef.current.value.split('\n').length > 1
                          ? 'rounded-lg' // Medium radius for multi-line input
                          : 'rounded-full' // Full radius for single-line input
                      }`}
                      style={{ maxHeight: '200px' }} // Set a max height for the textarea
                      rows={1}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="ml-4 p-3 rounded-full bg-[#FF5E00] text-[#f7eee3] font-semibold transition-colors duration-200 hover:bg-[#e05500] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <Square /> : <MoveUpRight />}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}