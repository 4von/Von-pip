import React from 'react';
import { Table, CheckCircle2 } from 'lucide-react';
import { CurrencyPair } from '../types';
import { CURRENCY_PAIRS } from '../data/currencyPairs';

interface PipReferenceTableProps {
  selectedPair: CurrencyPair;
  onSelectPair: (pair: CurrencyPair) => void;
}

export const PipReferenceTable: React.FC<PipReferenceTableProps> = ({
  selectedPair,
  onSelectPair,
}) => {
  return (
    <div className="w-full bg-[#0d1527] border border-slate-800/90 rounded-2xl p-6 lg:p-7 shadow-xl shadow-black/40">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-800/80 mb-6">
        <div className="flex items-center gap-2.5">
          <Table className="w-4 h-4 text-cyan-400 shrink-0" />
          <div>
            <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
              Standard Pip Value Reference Table (Per 1.00 Lot)
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Calculated in USD benchmark values for standard 100,000 unit contracts (100 oz for Gold)
            </p>
          </div>
        </div>

        <span className="text-[11px] font-mono-num font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2.5 py-1 rounded-md self-start sm:self-auto">
          {CURRENCY_PAIRS.length} Configured Instruments
        </span>
      </div>

      {/* Grid of 17 Pairs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {CURRENCY_PAIRS.map((pair) => {
          const isSelected = selectedPair.symbol === pair.symbol;
          const isGold = pair.symbol === 'XAU/USD';

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
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                  {pair.symbol}
                  {isGold ? <span className="text-[10px] text-amber-400 font-normal ml-1">(Gold)</span> : null}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                )}
              </div>

              <div className="text-xs font-mono-num font-bold">
                <span className={isGold ? 'text-amber-400' : 'text-cyan-400'}>
                  ${pair.pipValue.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-400 font-normal"> / pip</span>
              </div>
            </button>
          );
        })}
      </div>

    </div>
  );
};
