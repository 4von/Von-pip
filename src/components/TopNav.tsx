import React from 'react';
import { Activity, RotateCcw, ShieldCheck } from 'lucide-react';
import { CurrencyPair } from '../types';

interface TopNavProps {
  onReset: () => void;
  onSelectPair: (symbol: string) => void;
  currentPair: CurrencyPair;
}

export const TopNav: React.FC<TopNavProps> = ({ onReset, onSelectPair, currentPair }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-[#080e1d]/90 backdrop-blur-md sticky top-0 z-50 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-slate-950 font-black">
            <Activity className="w-5 h-5 text-slate-950 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white tracking-tight">Von Pips FX</span>
              <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40">
                PRO RISK
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Precision Forex Position Sizing Engine</p>
          </div>
        </div>

        {/* Live Ticker Pills */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onSelectPair('EUR/USD')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-num transition-all cursor-pointer flex items-center gap-2 ${
              currentPair.symbol === 'EUR/USD'
                ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="font-semibold text-slate-300">EUR/USD</span>
            <span className="text-white">1.0842</span>
            <span className="text-emerald-400 font-medium">+$10.00/pip</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPair('XAU/USD')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-num transition-all cursor-pointer flex items-center gap-2 ${
              currentPair.symbol === 'XAU/USD'
                ? 'bg-amber-950/60 border-amber-500/60 text-white shadow-sm shadow-amber-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="font-semibold text-slate-300">XAU/USD</span>
            <span className="text-amber-300 font-bold">2,382.40</span>
            <span className="text-cyan-400 font-medium">$10.00/pip</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectPair('USD/JPY')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-num transition-all cursor-pointer flex items-center gap-2 ${
              currentPair.symbol === 'USD/JPY'
                ? 'bg-cyan-950/60 border-cyan-500/60 text-white shadow-sm shadow-cyan-500/20'
                : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="font-semibold text-slate-300">USD/JPY</span>
            <span className="text-white">155.80</span>
            <span className="text-cyan-400 font-medium">~$6.70/pip</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            id="reset-calculator-btn"
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-lg transition-all active:scale-95"
            title="Reset to default parameters"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset</span>
          </button>

          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/30 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase font-mono-num">
              LIVE CALC
            </span>
          </div>
        </div>

      </div>
    </header>
  );
};
