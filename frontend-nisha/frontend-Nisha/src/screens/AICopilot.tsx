import React, { useState, useRef, useEffect } from 'react';
import { SparkleIcon, FeatureTag } from '../components/ui';
import { SUGGESTED_PROMPTS, CANNED_RESPONSES } from '../data/mockCopilot';
import type { CopilotMessage } from '../types';

type UIMessage = CopilotMessage & { isLoading?: boolean };

const INITIAL_MESSAGES: UIMessage[] = [
  {
    role: 'user',
    content: 'Why is Gurugram currently top-ranked?',
    timestamp: '13:58',
  },
  {
    ...CANNED_RESPONSES['p1'],
    timestamp: '13:58',
  },
];

export default function AICopilot({ onOpenCase }: { onOpenCase?: () => void }) {
  const [messages, setMessages] = useState<UIMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: UIMessage = { role: 'user', content: text, timestamp: 'now' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      // Match to a canned response by prompt text, or use a generic one
      const matchedPrompt = SUGGESTED_PROMPTS.find(p =>
        p.text.toLowerCase().includes(text.toLowerCase().slice(0, 20)) ||
        text.toLowerCase().includes(p.text.toLowerCase().slice(0, 20))
      );
      const response = matchedPrompt
        ? CANNED_RESPONSES[matchedPrompt.id]
        : {
            role: 'assistant' as const,
            content: `I'm currently in prototype mode. I can answer questions about:\n• Prediction explanations\n• Transaction trails\n• Mule account patterns\n• Case summaries\n• OSINT context\n\nTry one of the suggested prompts below.`,
            timestamp: 'now',
          };
      setMessages(prev => [...prev, response]);
      setLoading(false);
    }, 900);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">

      {/* Header */}
      <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C5CFC, #4338CA)' }}>
            <SparkleIcon size={16} />
          </div>
          <div>
            <div className="font-bold text-[#0F172A] text-sm">AI Investigator Copilot</div>
            <div className="text-[10px] text-[#94A3B8]">Prototype — responses grounded in case, prediction, and OSINT data</div>
          </div>
        </div>
        <FeatureTag type="usp" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#F7F8FA]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2.5 flex-shrink-0 mt-0.5" style={{ background: 'linear-gradient(135deg, #7C5CFC, #4338CA)' }}>
                <SparkleIcon size={12} />
              </div>
            )}
            <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={`px-4 py-3 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-[#0F172A] text-white rounded-tr-sm'
                  : 'bg-white border border-[#E2E8F0] text-[#0F172A] rounded-tl-sm shadow-sm'
              }`}>
                {msg.content}
              </div>
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[9px] text-[#94A3B8] uppercase tracking-wide">Sources:</span>
                  {msg.sources.map(s => (
                    <span key={s} className="text-[9px] bg-[#7C5CFC]/8 text-[#7C5CFC] border border-[#7C5CFC]/15 px-1.5 py-0.5 rounded font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center mr-2.5" style={{ background: 'linear-gradient(135deg, #7C5CFC, #4338CA)' }}>
              <SparkleIcon size={12} />
            </div>
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-bounce" style={{ animationDelay: '0ms' }}/>
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-bounce" style={{ animationDelay: '150ms' }}/>
              <div className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC] animate-bounce" style={{ animationDelay: '300ms' }}/>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-6 py-3 border-t border-[#E2E8F0] bg-white">
        <div className="flex gap-2 flex-wrap mb-3">
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p.id}
              onClick={() => sendMessage(p.text)}
              className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs text-[#475569] hover:border-[#7C5CFC]/30 hover:text-[#7C5CFC] transition-colors bg-white"
            >
              {p.text}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex items-center gap-3 p-3 rounded-xl border border-[#E2E8F0] bg-[#F7F8FA] focus-within:border-[#7C5CFC] focus-within:ring-2 focus-within:ring-[#7C5CFC]/10 transition-all">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask about a case, prediction, or mule account…"
            className="flex-1 bg-transparent text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white transition-opacity disabled:opacity-40 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #4338CA)' }}
          >
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M13 1L8 13L6 7L1 5L13 1Z" stroke="white" strokeWidth="1.3" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
