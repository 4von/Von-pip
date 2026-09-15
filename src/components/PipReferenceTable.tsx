import React from 'react';
import { Table, CheckCircle2, Radio, Info } from 'lucide-react';
import { CurrencyPair, PipMode } from '../types';
import { CURRENCY_PAIRS } from '../data/currencyPairs';

interface PipReferenceTableProps {
  selectedPair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
  pipMode: PipMode;
  rates: Record<string, number>;
  getPipValueForPair: (pair: CurrencyPair) => { pipValue: number; isFixedUSD: boolean };
}

export const PipReferenceTable: React.FC<PipReferenceTableProps> = ({
  selectedPair,
  onSelectPair,
  pipMode,
  getPipValueForPair,
}) => {
  return (
    <div className="w-full bg-[#0d1527] border border-slate-800/90 rounded-2xl p-6 lg:p-7 shadow-xl shadow-black/40">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-2.5">
          <Table className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
                {pipMode === 'live' ? 'Live Dynamic Pip Valuation Board' : 'Standard Pip Value Reference Table'} (Per 1.00 Lot)
              </h3>
              <span className={`text-[9px] font-mono-num font-bold px-1.5 py-0.2 rounded border uppercase ${
                pipMode === 'live'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {pipMode === 'live' ? 'Live Market Mode' : 'Fixed Benchmark Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Standard 100,000 unit contracts (100 oz for Gold). Pairs with USD quote (e.g. EUR/USD) are mathematically fixed at $10.00/pip.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-num font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md self-start sm:self-auto">
            {CURRENCY_PAIRS.length} Pairs Supported
          </span>
        </div>
      </div>

      {/* Grid of 17 Pairs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {CURRENCY_PAIRS.map((pair) => {
          const isSelected = selectedPair.symbol === pair.symbol;
          const isGold = pair.symbol === 'XAU/USD';
          const { pipValue, isFixedUSD } = getPipValueForPair(pair);

          return (
            <button
              key={pair.id}
              type="button"
              onClick={() => onSelectPair(pair)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative group ${
                isSelected
                  ? 'bg-cyan-950/40 border-cyan-400/80 ring-1 ring-cyan-400/40 shadow-md shadow-cyan-500/20'
                  : 'bg-[#070c18] border-slate-800/90 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors flex items-center gap-1">
                  <span>{pair.symbol}</span>
                  {isGold ? <span className="text-[9px] text-amber-400 font-semibold">(Gold)</span> : null}
                </span>
                {isSelected ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                ) : isFixedUSD ? (
                  <span className="text-[9px] text-slate-500 font-mono-num" title="Fixed USD Quote">Fixed</span>
                ) : pipMode === 'live' ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Dynamic Live Rate"></span>
                ) : null}
              </div>

              <div className="text-xs font-mono-num font-bold">
                <span className={isGold ? 'text-amber-400' : isFixedUSD ? 'text-cyan-400' : 'text-emerald-400'}>
                  ${pipValue.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 font-normal"> / pip</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            <strong>USD Quote pairs</strong> (EUR/USD, GBP/USD, AUD/USD, XAU/USD) are constant at $10.00. <strong>Non-USD pairs</strong> (USD/JPY, GBP/JPY, EUR/GBP) fluctuate with live FX rates.
          </span>
        </div>
      </div>

    </div>
  );
};
