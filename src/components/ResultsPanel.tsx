import React from 'react';
import { Target, Shield, Layers, Code, Info, Check, Copy, TrendingUp, Scale, ArrowUpRight } from 'lucide-react';
import { TradeCalculation, CurrencyPair } from '../types';

interface ResultsPanelProps {
  calc: TradeCalculation;
  selectedPair: CurrencyPair;
  isCalculatedFlash?: boolean;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  calc,
  selectedPair,
  isCalculatedFlash,
}) => {
  const [copied, setCopied] = React.useState(false);

  const copyLotSize = () => {
    navigator.clipboard.writeText(calc.lotSize.toFixed(2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const getRrBadge = (ratio: number) => {
    if (ratio >= 2.0) {
      return { text: 'High Asymmetry', color: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' };
    }
    if (ratio >= 1.5) {
      return { text: 'Favorable', color: 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40' };
    }
    if (ratio >= 1.0) {
      return { text: 'Balanced 1:1', color: 'text-blue-400 bg-blue-950/60 border-blue-500/40' };
    }
    return { text: 'Low R:R (<1:1)', color: 'text-amber-400 bg-amber-950/60 border-amber-500/40' };
  };

  const rrBadge = getRrBadge(calc.riskRewardRatio);

  return (
    <div className="w-full flex flex-col gap-5">
      
      {/* 1. Main Recommended Lot Size Card */}
      <div
        className={`bg-[#0d1527] border rounded-2xl p-6 lg:p-7 shadow-xl shadow-black/40 transition-all duration-300 ${
          isCalculatedFlash
            ? 'border-cyan-400 ring-2 ring-cyan-500/30 glow-cyan'
            : 'border-slate-800/90'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
              Recommended Lot Size
            </h3>
          </div>
          <span className="px-2.5 py-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 rounded-md">
            Standard Lots
          </span>
        </div>

        {/* Hero Number */}
        <div className="flex items-baseline justify-between mb-3">
          <div className="flex items-baseline gap-3">
            <span
              id="recommended-lot-size-display"
              className="text-5xl lg:text-6xl font-black font-mono-num tracking-tight text-white drop-shadow-[0_0_20px_rgba(6,182,212,0.25)]"
            >
              {calc.isValid ? calc.lotSize.toFixed(2) : '0.00'}
            </span>
            <span className="text-xl font-bold text-slate-400">Lots</span>
          </div>

          <button
            type="button"
            onClick={copyLotSize}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
            title="Copy Lot Size"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Breakdown by contract tiers */}
        <div className="text-xs font-mono-num text-slate-400 font-medium mb-6 flex items-center gap-2 flex-wrap">
          <span className="text-slate-200 font-bold">
            {calc.isValid ? calc.lotSize.toFixed(2) : '0.00'} Std
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            {calc.isValid ? calc.miniLots.toFixed(1) : '0.0'} Mini
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-300">
            {calc.isValid ? calc.microLots.toFixed(1) : '0.0'} Micro
          </span>
        </div>

        {/* 4 Metric Stat Boxes Grid (Risk, Reward, R:R, Units) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          
          {/* Total Cash Risked */}
          <div className="bg-[#070c18] border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center justify-between gap-1 text-slate-400 text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-400" />
                <span>Total Cash Risked</span>
              </span>
            </div>
            <div className="text-2xl font-black font-mono-num text-rose-400 tracking-tight">
              ${calc.isValid ? calc.cashRisked.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>
            <div className="text-[11px] font-mono-num text-slate-400 mt-1">
              {calc.effectiveRiskPercentage.toFixed(2)}% of capital
            </div>
          </div>

          {/* Potential Monetary Gain */}
          <div className="bg-[#070c18] border border-emerald-900/40 hover:border-emerald-500/40 rounded-xl p-4 transition-all">
            <div className="flex items-center justify-between gap-1 text-slate-400 text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Potential Gain ($)</span>
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono-num text-emerald-400 tracking-tight">
              +${calc.isValid ? calc.potentialGain.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0.00'}
            </div>
            <div className="text-[11px] font-mono-num text-emerald-400/90 mt-1">
              +{calc.effectiveGainPercentage.toFixed(2)}% profit on capital
            </div>
          </div>

          {/* Risk-to-Reward Ratio */}
          <div className="bg-[#070c18] border border-cyan-900/40 rounded-xl p-4">
            <div className="flex items-center justify-between gap-1 text-slate-400 text-xs font-medium mb-1.5">
              <span className="flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-cyan-400" />
                <span>Risk : Reward Ratio</span>
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${rrBadge.color}`}>
                {rrBadge.text}
              </span>
            </div>
            <div className="text-2xl font-black font-mono-num text-cyan-300 tracking-tight">
              1 : {calc.isValid && calc.riskRewardRatio > 0 ? calc.riskRewardRatio.toFixed(2) : '0.00'}
            </div>
            <div className="text-[11px] font-mono-num text-slate-400 mt-1">
              Risk ${calc.cashRisked.toFixed(0)} to gain ${calc.potentialGain.toFixed(0)}
            </div>
          </div>

          {/* Position Units */}
          <div className="bg-[#070c18] border border-slate-800/90 rounded-xl p-4">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>Position Units</span>
            </div>
            <div className="text-2xl font-black font-mono-num text-white tracking-tight">
              {calc.isValid ? Math.round(calc.positionUnits).toLocaleString('en-US') : '0'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 truncate">
              {selectedPair.unitLabel}
            </div>
          </div>

        </div>
      </div>

      {/* 2. Applied Formula Card */}
      <div className="bg-[#0d1527] border border-slate-800/90 rounded-2xl p-5 shadow-lg shadow-black/30">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
          <div className="flex items-center gap-2">
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <h4 className="text-xs font-bold tracking-wider text-slate-300 uppercase">
              Applied Formulas &amp; R:R Breakdown
            </h4>
          </div>
          <span className="text-[11px] font-mono-num text-slate-400">
            R:R = TP ÷ SL
          </span>
        </div>

        <div className="space-y-2 text-xs font-mono-num">
          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Cash Risked:</span>
            <span className="text-rose-400 font-bold">
              ${calc.isValid ? calc.cashRisked.toFixed(2) : '0.00'}
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Stop Loss:</span>
            <span className="text-slate-200 font-bold">
              {calc.isValid ? calc.stopLossPips.toFixed(1) : '0.0'} pips
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400">Target Take Profit:</span>
            <span className="text-emerald-400 font-bold">
              {calc.isValid ? calc.takeProfitPips.toFixed(1) : '0.0'} pips
            </span>
          </div>

          <div className="flex justify-between items-center py-0.5">
            <span className="text-slate-400 flex items-center gap-1.5">
              <span>Pip Value / Std Lot:</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border uppercase ${
                calc.pipMode === 'live'
                  ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}>
                {calc.pipMode === 'live' ? 'Live Price' : 'Standard'}
              </span>
            </span>
            <span className="text-cyan-400 font-bold">
              ${calc.pipValue.toFixed(2)}
            </span>
          </div>

          {calc.pipFormulaNote && (
            <div className="text-[11px] text-slate-400 font-sans italic px-2 py-1 bg-[#070c18] rounded border border-slate-800/80">
              {calc.pipFormulaNote}
            </div>
          )}

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">Position Sizing Formula:</div>
              <div className="p-2.5 rounded-lg bg-[#070c18] border border-slate-800/90 text-cyan-300 text-xs font-bold break-all">
                {calc.formulaStep}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-slate-400 mb-1">Potential Gain Formula:</div>
              <div className="p-2.5 rounded-lg bg-[#070c18] border border-slate-800/90 text-emerald-300 text-xs font-bold break-all">
                {calc.lotSize.toFixed(2)} Lots × {calc.takeProfitPips.toFixed(1)} pips × ${calc.pipValue.toFixed(2)} = +${calc.potentialGain.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Professional Risk Tip */}
      <div className="bg-gradient-to-r from-cyan-950/30 to-blue-950/20 border border-cyan-800/30 rounded-2xl p-4 flex gap-3.5 items-start">
        <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0 mt-0.5">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <h5 className="text-xs font-bold text-white mb-1">Risk-to-Reward Guidance</h5>
          <p className="text-xs text-slate-400 leading-relaxed">
            Aiming for a minimum of 1:1.5 or 1:2.0 Risk-to-Reward ratio allows a trading system to maintain long-term profitability even with a sub-50% win rate.
          </p>
        </div>
      </div>

    </div>
  );
};
