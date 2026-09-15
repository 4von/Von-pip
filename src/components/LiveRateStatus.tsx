import React from 'react';
import { Radio, RefreshCw, CheckCircle2, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';
import { PipMode } from '../types';

interface LiveRateStatusProps {
  pipMode: PipMode;
  setPipMode: (mode: PipMode) => void;
  isLoadingRates: boolean;
  onRefreshRates: () => void;
  lastUpdated: Date | null;
  rateSource: 'live_api' | 'benchmark' | 'custom';
  currentPipValue: number;
  isFixedUSD: boolean;
  quoteCurrency: string;
  formulaNote: string;
}

export const LiveRateStatus: React.FC<LiveRateStatusProps> = ({
  pipMode,
  setPipMode,
  isLoadingRates,
  onRefreshRates,
  lastUpdated,
  rateSource,
  currentPipValue,
  isFixedUSD,
  quoteCurrency,
  formulaNote,
}) => {
  return (
    <div className="w-full bg-[#091021] border border-slate-800 rounded-xl p-3.5 sm:p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Mode Toggle */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-[#050913] border border-slate-800 p-1 rounded-lg">
            <button
              id="pip-mode-live-btn"
              type="button"
              onClick={() => setPipMode('live')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                pipMode === 'live'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
              title="Calculate pip value dynamically from live market rates"
            >
              <Radio className={`w-3.5 h-3.5 ${pipMode === 'live' ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
              <span>Live Market Pip Price</span>
            </button>

            <button
              id="pip-mode-standard-btn"
              type="button"
              onClick={() => setPipMode('standard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                pipMode === 'standard'
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
              title="Use standardized institutional fixed benchmark pip values"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400" />
              <span>Fixed Benchmark</span>
            </button>
          </div>
        </div>

        {/* Right: Status & Refresh */}
        <div className="flex items-center gap-2 justify-between sm:justify-end">
          {pipMode === 'live' ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-[11px] font-mono-num text-slate-300 bg-[#060b17] border border-slate-800 px-2.5 py-1 rounded-md">
                <span className={`w-2 h-2 rounded-full ${rateSource === 'live_api' ? 'bg-emerald-400 animate-ping' : 'bg-cyan-400'}`}></span>
                <span>{rateSource === 'live_api' ? 'Live API Feed' : 'Benchmark Live Sync'}</span>
              </span>

              <button
                id="refresh-rates-btn"
                type="button"
                onClick={onRefreshRates}
                disabled={isLoadingRates}
                className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-md transition-all cursor-pointer disabled:opacity-50"
                title="Fetch latest market quotes"
              >
                <RefreshCw className={`w-3 h-3 text-cyan-400 ${isLoadingRates ? 'animate-spin' : ''}`} />
                <span>{isLoadingRates ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          ) : (
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
              Standard Institutional Base
            </span>
          )}
        </div>

      </div>

      {/* Dynamic Explanation Note */}
      <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>
            {isFixedUSD ? (
              <span>
                <strong className="text-white">USD Quote Currency:</strong> Pip value is permanently fixed at <strong className="text-cyan-400">$10.00</strong> / standard lot.
              </span>
            ) : (
              <span>
                <strong className="text-white">Live Rate Applied:</strong> {formulaNote}
              </span>
            )}
          </span>
        </div>

        <div className="font-mono-num text-[11px] text-slate-400 shrink-0">
          Effective Pip Value: <span className="font-bold text-cyan-300">${currentPipValue.toFixed(2)}</span> / lot
        </div>
      </div>
    </div>
  );
};
