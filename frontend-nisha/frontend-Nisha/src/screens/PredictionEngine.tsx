import React from 'react';
import { Card, FeatureTag, PrototypeBadge } from '../components/ui';

export default function PredictionEngine() {
  return (
    <div className="p-7 space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1.5">
          <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight">Prediction Engine Architecture</h1>
          <FeatureTag type="sih" />
        </div>
        <p className="text-sm text-[#64748B] max-w-3xl">
          TRINETRA's core prediction engine uses a phased modeling approach.
          This dashboard outlines the model lifecycle and current integration readiness.
        </p>
      </div>

      {/* Model Readiness Status */}
      <Card className="p-6 border-[#E2E8F0] shadow-sm">
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="text-sm font-bold text-[#0F172A] mb-1">Current Baseline: Reference-Class Prior</div>
            <div className="text-xs text-[#64748B]">Status: <span className="font-semibold text-amber-600">Awaiting Dataset & API Integration</span></div>
          </div>
          <PrototypeBadge tooltip="Metrics will populate after baseline evaluation" />
        </div>

        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Top-1 Zone Accuracy', value: 'Pending' },
            { label: 'Top-3 Zone Recall', value: 'Pending' },
            { label: 'Mean Geographic Error', value: 'Pending' },
          ].map(m => (
            <div key={m.label} className="p-4 rounded-xl bg-[#F7F8FA] border border-[#E2E8F0]">
              <div className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest mb-1.5">{m.label}</div>
              <div className="text-lg font-mono font-semibold text-[#64748B]">{m.value}</div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-xs text-[#94A3B8] flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.2"/><path d="M8 4.5V8.5L10 10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
          Real metrics will populate here after the synthetic dataset is generated and the baseline model is evaluated in Phase 2.
        </div>
      </Card>

      {/* ML Lifecycle Evolution */}
      <div>
        <div className="text-sm font-bold text-[#0F172A] mb-4">Planned Model Evolution</div>
        <div className="grid grid-cols-4 gap-4">
          
          {/* Stage 1 */}
          <Card className="p-5 border-l-4 border-l-[#14B8A6] flex flex-col">
            <div className="text-[10px] font-bold text-[#14B8A6] uppercase tracking-widest mb-1">Stage 1</div>
            <div className="text-sm font-bold text-[#0F172A] mb-2">Reference-Class Prior</div>
            <p className="text-xs text-[#64748B] leading-relaxed flex-1">
              Initial probability distribution based on historical case geography and basic typology.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[10px] font-semibold text-[#14B8A6]">
              Current Development Layer
            </div>
          </Card>

          {/* Stage 2 */}
          <Card className="p-5 flex flex-col">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Stage 2</div>
            <div className="text-sm font-bold text-[#0F172A] mb-2">Sequential Bayesian Update</div>
            <p className="text-xs text-[#64748B] leading-relaxed flex-1">
              Narrows the prediction zone incrementally as new transaction hops are observed in near real-time.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[10px] font-medium text-[#94A3B8]">
              Planned for Integration
            </div>
          </Card>

          {/* Stage 3 */}
          <Card className="p-5 flex flex-col">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Stage 3</div>
            <div className="text-sm font-bold text-[#0F172A] mb-2">Risk Registry Signal</div>
            <p className="text-xs text-[#64748B] leading-relaxed flex-1">
              Incorporates cross-complaint mule entity tracking to spike confidence when known hubs are hit.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[10px] font-medium text-[#94A3B8]">
              Planned for Integration
            </div>
          </Card>

          {/* Stage 4 */}
          <Card className="p-5 flex flex-col">
            <div className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest mb-1">Stage 4</div>
            <div className="text-sm font-bold text-[#0F172A] mb-2">Decision Engine</div>
            <p className="text-xs text-[#64748B] leading-relaxed flex-1">
              Evaluates prediction confidence against dynamic recoverability windows to trigger automated alerts.
            </p>
            <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[10px] font-medium text-[#94A3B8]">
              Planned for Integration
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
}
