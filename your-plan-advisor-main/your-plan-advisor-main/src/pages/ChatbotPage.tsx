/**
 * Module 6: Chatbot Assistant
 */

import { useState, useRef, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Send, Bot, User } from 'lucide-react';
import type { ChatMessage } from '@/types/insurance';
import { getChatbotResponse } from '@/utils/insuranceLogic';

const ChatbotPage = () => {

  const defaultMessage: ChatMessage = {
    id: '1',
    role: 'assistant',
    content: "Hello! 👋 I'm **ClaimAssist**, your AI insurance advisor. Ask me anything about insurance plans, premiums or claims.",
    timestamp: new Date().toISOString(),
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // GET CURRENT USER
  const userEmail = localStorage.getItem("currentUser");

  const chatKey = `chatHistory_${userEmail}`;

  // LOAD CHAT HISTORY
  useEffect(() => {

    if (!userEmail) return;

    const saved = localStorage.getItem(chatKey);

    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      setMessages([defaultMessage]);
    }

  }, [userEmail]);

  // SAVE CHAT HISTORY
  useEffect(() => {

    if (messages.length > 0 && userEmail) {
      localStorage.setItem(chatKey, JSON.stringify(messages));
    }

  }, [messages, userEmail]);

  // AUTO SCROLL
  useEffect(() => {

    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

  }, [messages]);

  const handleSend = async () => {

    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const botResponse = await getChatbotResponse(trimmed);

    const botMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: botResponse,
      timestamp: new Date().toISOString(),
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, botMsg]);

  };

  const handleKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

  };

  const quickQuestions = [
    'What is premium?',
    'Which plan is best?',
    'How risk indicator works?',
    'What documents are needed?',
  ];

  const renderContent = (content: string) => {

    return content.split('\n').map((line, i) => {

      const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {

        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={j}>{part.slice(2, -2)}</strong>;
        }

        return <span key={j}>{part}</span>;

      });

      return (
        <span key={i}>
          {parts}
          {i < content.split('\n').length - 1 && <br />}
        </span>
      );

    });

  };

  return (
    <AppLayout>

      <div className="container max-w-3xl py-10 px-4">

        <div className="flex items-center gap-3 mb-6">

          <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-destructive" />
          </div>

          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Chat Assistant</h1>
            <p className="text-sm text-muted-foreground">Ask about insurance plans, premiums, and claims</p>
          </div>

        </div>

        <Card className="shadow-elevated flex flex-col" style={{ height: '65vh' }}>

          <CardHeader className="pb-2 border-b border-border">

            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="h-4 w-4 text-primary" />
              ClaimAssist Bot
            </CardTitle>

          </CardHeader>

          <CardContent ref={scrollRef} className="flex-1 overflow-y-auto py-4 space-y-4">

            {messages.map((msg) => (

              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >

                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-primary' : 'bg-accent'
                  }`}
                >

                  {msg.role === 'user'
                    ? <User className="h-3.5 w-3.5 text-primary-foreground" />
                    : <Bot className="h-3.5 w-3.5 text-accent-foreground" />
                  }

                </div>

                <div
                  className={`rounded-xl px-4 py-2.5 max-w-[80%] text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >

                  {renderContent(msg.content)}

                </div>

              </div>

            ))}

            {isTyping && (

              <div className="flex gap-2.5">

                <div className="h-7 w-7 rounded-full flex items-center justify-center bg-accent">
                  <Bot className="h-3.5 w-3.5 text-accent-foreground" />
                </div>

                <div className="rounded-xl px-4 py-2.5 bg-muted text-sm">
                  Bot is typing...
                </div>

              </div>

            )}

          </CardContent>

          <div className="px-4 pb-2 flex gap-2 flex-wrap">

            {quickQuestions.map((q) => (

              <button
                key={q}
                onClick={() => setInput(q)}
                className="text-xs rounded-full border border-border px-3 py-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >

                {q}

              </button>

            ))}

          </div>

          <div className="border-t border-border p-4 flex gap-2">

            <Input
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />

            <Button onClick={handleSend} size="icon" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>

          </div>

        </Card>

      </div>

    </AppLayout>
  );
};

export default ChatbotPage;