import React, { useState, useRef, useEffect } from 'react';
import { Card, SparkleIcon, FeatureTag } from '../components/ui';

const suggestions = [
  "Show all cases linked to account XXXX9234",
  "Why is Gurugram Sector 29 high risk?",
  "Cases with >80% cash-out probability today",
  "Summarise NCRP-26-81942 for an officer",
  "Common entities across digital-arrest cases",
];

type Message = {
  role: 'user' | 'ai';
  content: string;
  sources?: string[];
  confidence?: string;
};

const initialMessages: Message[] = [
  {
    role: 'user',
    content: 'Why was Gurugram selected for Case NCRP-26-81942?',
  },
  {
    role: 'ai',
    content: `Gurugram Sector 29 received a 91% cash-out risk score based on four primary signals:

1. Two accounts in the transaction trail are connected to previous withdrawals in this specific ATM cluster.
2. The transaction timing matches a recurring 45–120 minute cash-out pattern seen across 23 similar cases.
3. Similar investment-fraud cases in NCR have consistently converged in Gurugram Sector 29 over the last 8 weeks.
4. Three verified OSINT signals indicate recent mule-account activity in the broader NCR corridor.`,
    sources: ['Transaction Graph', 'Historical Cases', 'Geo Model', 'OSINT Evidence'],
    confidence: 'High · 91% model confidence',
  },
];

export default function AICopilot({ onOpenCase }: { onOpenCase?: () => void }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setLoading(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Based on the available investigative data, I've cross-referenced the transaction network, geospatial model, and OSINT database.\n\nPlease review the linked evidence sources for full detail. If additional context is needed, specify the case ID or account reference.`,
        sources: ['Transaction Graph', 'Geo Model'],
        confidence: 'Moderate · 74% confidence',
      }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>

      {/* Purple header */}
      <div className="px-7 py-5 border-b border-[#6D4FF5]/30 shrink-0" style={{ background: 'linear-gradient(135deg, #7C5CFC 0%, #5B4FCF 55%, #4338CA 100%)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-white/18 flex items-center justify-center border border-white/20">
              <SparkleIcon size={20}/>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-0.5">
                <span className="text-white font-bold text-xl">TRINETRA Copilot</span>
                <FeatureTag type="usp" />
              </div>
              <p className="text-white/65 text-sm">Ask questions across cases, fraud networks, predictions and verified intelligence.</p>
            </div>
          </div>
          <div className="text-xs text-white/60 border border-white/18 rounded-lg px-3 py-1.5">
            Evidence-grounded · All sources connected
          </div>
        </div>

        {/* Suggested prompts */}
        <div className="flex items-center gap-2 mt-5 flex-wrap">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => sendMessage(s)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/18 border border-white/18 text-white/80 hover:text-white text-xs font-medium transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6 bg-[#F7F8FA]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            {msg.role === 'ai' ? (
              <div className="w-8 h-8 rounded-xl ai-gradient flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                <SparkleIcon size={14}/>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-xl bg-[#14B8A6]/15 flex items-center justify-center text-[#0D9488] text-xs font-bold flex-shrink-0 mt-1">
                AM
              </div>
            )}

            {/* Bubble */}
            <div className={`max-w-2xl ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
              {msg.role === 'user' ? (
                <div className="bg-[#14B8A6] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed">
                  {msg.content}
                </div>
              ) : (
                <Card className="p-5 rounded-2xl rounded-tl-sm border-[#7C5CFC]/12">
                  <div className="flex items-center gap-1.5 mb-3">
                    <SparkleIcon size={11}/>
                    <span className="text-[10px] font-bold text-[#7C5CFC] uppercase tracking-wide">TRINETRA Copilot</span>
                  </div>

                  <div className="text-sm text-[#0F172A] leading-relaxed space-y-2">
                    {msg.content.split('\n\n').map((para, j) => (
                      <p key={j} className="leading-relaxed">{para}</p>
                    ))}
                  </div>

                  {msg.sources && (
                    <div className="mt-4 pt-3 border-t border-[#F1F5F9]">
                      <div className="text-[10px] font-semibold text-[#94A3B8] uppercase tracking-wide mb-2">
                        Evidence grounded in
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.sources.map(s => (
                          <button key={s} className="px-2.5 py-1 text-xs rounded-lg border border-[#7C5CFC]/18 text-[#7C5CFC] bg-[#7C5CFC]/5 hover:bg-[#7C5CFC]/10 font-medium transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.confidence && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"/>
                      <span className="text-[10px] text-[#64748B]">{msg.confidence}</span>
                    </div>
                  )}

                  {msg.sources && (
                    <div className="flex items-center gap-2 mt-3">
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#14B8A6] border border-[#14B8A6]/20 rounded-lg hover:bg-[#14B8A6]/5 transition-colors">
                        Open Evidence
                      </button>
                      <button className="px-3 py-1.5 text-xs font-semibold text-[#7C5CFC] border border-[#7C5CFC]/20 rounded-lg hover:bg-[#7C5CFC]/5 transition-colors">
                        Generate Brief
                      </button>
                      <button onClick={onOpenCase} className="px-3 py-1.5 text-xs font-semibold text-[#E5484D] border border-[#E5484D]/20 rounded-lg hover:bg-[#E5484D]/5 transition-colors">
                        Create Alert
                      </button>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-xl ai-gradient flex items-center justify-center flex-shrink-0 mt-1">
              <SparkleIcon size={14}/>
            </div>
            <Card className="p-4 rounded-2xl rounded-tl-sm">
              <div className="flex items-center gap-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#7C5CFC]"
                    style={{ animation: `pulse-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}/>
                ))}
                <span className="text-xs text-[#94A3B8] ml-1">Analysing intelligence sources…</span>
              </div>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef}/>
      </div>

      {/* Input */}
      <div className="px-7 py-4 bg-white border-t border-[#E2E8F0] shrink-0">
        <div className="flex items-end gap-3 max-w-3xl mx-auto">
          <div className="flex-1 border border-[#E2E8F0] rounded-2xl overflow-hidden focus-within:border-[#7C5CFC]/50 focus-within:ring-2 focus-within:ring-[#7C5CFC]/8 transition-all bg-white">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
              placeholder="Ask about cases, networks, predictions, or intelligence signals…"
              rows={1}
              className="w-full px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] resize-none outline-none bg-transparent leading-relaxed"
              style={{ minHeight: '46px', maxHeight: '160px' }}
            />
          </div>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-11 h-11 rounded-2xl flex items-center justify-center transition-all disabled:opacity-35 disabled:cursor-not-allowed shadow-sm"
            style={{ background: 'linear-gradient(135deg, #7C5CFC, #4338CA)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 8L2 2L5 8L2 14L14 8Z" fill="white"/></svg>
          </button>
        </div>
        <div className="mt-2 text-center text-[10px] text-[#94A3B8] max-w-3xl mx-auto">
          Responses are evidence-grounded. Cite internal sources before acting on any AI output.
        </div>
      </div>
    </div>
  );
}
