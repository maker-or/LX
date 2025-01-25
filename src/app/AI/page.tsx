'use client';

import { type Message, useChat } from 'ai/react';
import { Copy, Check, MoveUpRight, Square, Globe, Play, Loader2 } from 'lucide-react';
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
  const [isSearching, setIsSearching] = useState(false); // Loading state for web search
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState<string>(''); // Store the last query
  const [searchResults, setSearchResults] = useState<string | null>(null); // Store search results
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

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

  // Extract links from the content
  const extractLinks = (content: string): string[] => {
    const linkRegex = /https?:\/\/[^\s]+/g;
    return content.match(linkRegex) || [];
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!input.trim()) return;

    setSubmitted(true);
    setIsLoading(true);

    // Clear search results
    setSearchResults(null);

    // Store the last query
    setLastQuery(input);

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

  // Handle "Search Web" button click
  const handleSearchWeb = async () => {
    if (!lastQuery.trim()) {
      console.error('No query to search');
      return;
    }

    setIsSearching(true); // Start loading
    setIsDropdownOpen(false); // Close dropdown

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: lastQuery,
            },
          ],
        }),
      });

      if (!response.ok) {
        const responseText = await response.text();
        console.error('Raw error response:', responseText);
        throw new Error(`Search failed: ${responseText}`);
      }

      // Get the response data
      const data = await response.json();

      // Store the search results in the state
      setSearchResults(data);
    } catch (error) {
      console.error('Error during web search:', error);
    } finally {
      setIsSearching(false); // Stop loading
    }
  };

  const handleSearchYouTube = (query: string) => {
    setIsDropdownOpen(false); // Close dropdown
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <main className="flex h-[100svh] w-[100svw] flex-col items-center justify-center bg-gradient-to-b from-[#f7eee3] to-[#e0d5c8] text-[#0c0c0c]">
      <SidebarProvider>
        <AppSidebar className="shadow-lg" />
        <SidebarInset className="bg-transparent">
          <SidebarTrigger className="ml-4 text-[#0c0c0c] hover:bg-[#0c0c0c10] rounded-full p-2 transition-all" />
          <div className="flex h-full w-full overflow-hidden bg-[#9c713d]/10 gap-4 backdrop-blur-sm">
            <div className="flex flex-col h-full w-full bg-white/80 overflow-hidden backdrop-blur-sm">
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
                {messages.map((m, index) => {
                  const links = extractLinks(m.content);

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col gap-4 animate-slide-in group relative transition-all`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {m.role === 'user' ? (
                        <div className="max-w-xl self-end">
                          <div className="bg-[#FF5E00] text-white text-xl tracking-tight p-4 rounded-2xl rounded-tr-sm shadow-md">
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-2xl self-start">
                          <div className="bg-white text-[1.1rem] tracking-tight text-[#0c0c0c] rounded-2xl rounded-tl-sm p-4 relative shadow-md">
                            <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={renderMarkdown(m.content)} />
                            
                            <div className="flex items-center gap-2 mt-4 justify-end">
                              <div className="relative group/actions">
                                <button
                                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                  className="p-2 rounded-full hover:bg-gray-100 transition-all"
                                >
                                  <Globe className="h-5 w-5 text-gray-600" />
                                </button>
                                {isDropdownOpen && (
                                  <div className="absolute bottom-full right-0 mb-2 min-w-[150px] bg-white rounded-lg shadow-lg p-2 space-y-1 border border-gray-200">
                                    <button
                                      onClick={handleSearchWeb}
                                      disabled={isSearching}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {isSearching ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                      ) : (
                                        <Globe className="h-4 w-4" />
                                      )}
                                      Web Search
                                    </button>
                                    <button
                                      onClick={() => handleSearchYouTube(m.content)}
                                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center gap-2"
                                    >
                                      <Play className="h-4 w-4" /> YouTube
                                    </button>
                                  </div>
                                )}
                              </div>
                              
                              <button
                                onClick={() => copyMessage(m.content, m.id)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                              >
                                {copiedMessageId === m.id ? (
                                  <Check className="h-5 w-5 text-green-500" />
                                ) : (
                                  <Copy className="h-5 w-5 text-gray-600" />
                                )}
                              </button>
                            </div>

                            {links.length > 0 && (
                              <div className="mt-4 border-t pt-4">
                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                  <span>🔗</span> {links.length} link{links.length > 1 ? 's' : ''}
                                </div>
                                <div className="mt-2 space-y-2">
                                  {links.map((link, index) => (
                                    <a
                                      key={index}
                                      href={link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block text-sm text-blue-600 hover:text-blue-800 hover:underline truncate"
                                    >
                                      {link}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {searchResults && (
                  <div className="max-w-2xl self-start">
                    <div className="bg-white text-[1.1rem] tracking-tight text-[#0c0c0c] rounded-2xl rounded-tl-sm p-4 relative shadow-md">
                      <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={renderMarkdown(searchResults)} />
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar */}
              <div className="sticky bottom-0 z-10 p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
                <form onSubmit={onSubmit} className="max-w-4xl mx-auto">
                  <div className="relative flex items-end gap-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-2">
                    <textarea
                      ref={textareaRef}
                      placeholder="Type your message..."
                      value={input}
                      onChange={(e) => {
                        handleInputChange(e);
                        adjustTextareaHeight();
                      }}
                      onKeyDown={handleKeyDown}
                      onInput={adjustTextareaHeight}
                      className="flex-1 max-h-[200px] min-h-[44px] p-2 outline-none resize-none text-gray-800 placeholder-gray-400"
                      rows={1}
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="p-3 rounded-xl bg-[#FF5E00] text-white shadow-sm transition-all hover:bg-[#e05500] disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MoveUpRight className="h-5 w-5" />}
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