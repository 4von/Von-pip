import React from 'react';
import { Sliders, Calculator, DollarSign, Percent, Target, AlertCircle, Check, TrendingUp } from 'lucide-react';
import { CurrencyPair, RiskType } from '../types';
import { CURRENCY_PAIRS } from '../data/currencyPairs';

interface TradeParametersProps {
  balance: number;
  setBalance: (val: number) => void;
  selectedPair: CurrencyPair;
  setSelectedPair: (pair: CurrencyPair) => void;
  effectivePipValue: number;
  isLivePipMode: boolean;
  riskType: RiskType;
  setRiskType: (type: RiskType) => void;
  riskPercentage: number;
  setRiskPercentage: (val: number) => void;
  riskCash: number;
  setRiskCash: (val: number) => void;
  stopLossPips: number;
  setStopLossPips: (val: number) => void;
  takeProfitPips: number;
  setTakeProfitPips: (val: number) => void;
  onCalculateTrigger: () => void;
  validationError?: string;
}

export const TradeParameters: React.FC<TradeParametersProps> = ({
  balance,
  setBalance,
  selectedPair,
  setSelectedPair,
  effectivePipValue,
  isLivePipMode,
  riskType,
  setRiskType,
  riskPercentage,
  setRiskPercentage,
  riskCash,
  setRiskCash,
  stopLossPips,
  setStopLossPips,
  takeProfitPips,
  setTakeProfitPips,
  onCalculateTrigger,
  validationError,
}) => {
  const balancePresets = [10000, 50000, 100000, 250000, 1000000];
  const percentPresets = [0.5, 1.0, 2.0, 3.0];
  const cashPresets = [50, 100, 250, 500];
  const slPresets = [10, 15, 25, 40, 50];
  const tpPresets = [25, 50, 75, 100, 150];

  const handleBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBalance(isNaN(val) ? 0 : val);
  };

  const handleRiskChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (riskType === 'percentage') {
      setRiskPercentage(isNaN(val) ? 0 : val);
    } else {
      setRiskCash(isNaN(val) ? 0 : val);
    }
  };

  const handleSlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setStopLossPips(isNaN(val) ? 0 : val);
  };

  const handleTpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setTakeProfitPips(isNaN(val) ? 0 : val);
  };

  return (
    <div className="w-full bg-[#0d1527] border border-slate-800/90 rounded-2xl p-6 lg:p-7 shadow-xl shadow-black/40 flex flex-col justify-between">
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between pb-5 border-b border-slate-800/80 mb-6">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wider text-white uppercase">
              Trade Parameters
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">Realtime Reactive</span>
        </div>

        {/* Validation Alert (if any error occurs) */}
        {validationError && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        <div className="space-y-6">
          
          {/* Row 1: Account Balance & Currency Pair in a 2-col layout on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Account Balance */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="account-balance-input" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Account Balance ($)
                </label>
                <span className="text-[11px] font-mono-num text-slate-400">
                  Max: <strong className="text-cyan-400 font-bold">$1,000,000</strong>
                </span>
              </div>
              <div className="relative flex items-center bg-[#070c18] border border-slate-700/80 hover:border-cyan-500/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-xl px-3.5 py-2.5 transition-all">
                <span className="text-slate-400 font-mono-num text-base mr-2">$</span>
                <input
                  id="account-balance-input"
                  type="number"
                  min="0"
                  max="1000000"
                  step="any"
                  value={balance === 0 ? '' : balance}
                  onChange={handleBalanceChange}
                  placeholder="10000"
                  className="w-full bg-transparent text-white font-mono-num text-base font-semibold focus:outline-none placeholder-slate-600"
                />
                <span className="text-xs font-semibold text-slate-500 uppercase ml-2 bg-slate-800/60 px-2 py-0.5 rounded">
                  USD
                </span>
              </div>

              {/* Balance Presets */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Presets:</span>
                {balancePresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBalance(val)}
                    className={`text-[11px] font-mono-num px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                      balance === val
                        ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {val >= 1000000 ? '$1M' : val >= 1000 ? `$${val / 1000}k` : `$${val}`}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Pair / Asset */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="currency-pair-select" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Currency Pair / Asset
                </label>
                <span className="text-[11px] font-mono-num font-bold text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-md flex items-center gap-1.5">
                  <span>${effectivePipValue.toFixed(2)}/PIP</span>
                  {isLivePipMode && (
                    <span className="text-[9px] text-emerald-400 uppercase font-black tracking-wider bg-emerald-950 px-1 py-0.2 rounded border border-emerald-500/40">
                      LIVE
                    </span>
                  )}
                </span>
              </div>
              <div className="relative">
                <select
                  id="currency-pair-select"
                  value={selectedPair.symbol}
                  onChange={(e) => {
                    const found = CURRENCY_PAIRS.find((p) => p.symbol === e.target.value);
                    if (found) setSelectedPair(found);
                  }}
                  className="w-full bg-[#070c18] border border-slate-700/80 hover:border-cyan-500/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-white font-medium text-sm rounded-xl px-3.5 py-2.5 focus:outline-none transition-all cursor-pointer appearance-none"
                >
                  {CURRENCY_PAIRS.map((pair) => (
                    <option key={pair.id} value={pair.symbol} className="bg-[#0b1324] text-white py-1">
                      {pair.symbol} ({pair.name})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-2.5">
                Standard Lot: 100k units {selectedPair.isCommodity ? '(100 oz Gold)' : ''}
              </p>
            </div>

          </div>

          {/* Row 2: Risk Sizing Mode & Risk Value */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2.5">
              <div>
                <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                  Risk Sizing Mode
                </span>
                <p className="text-[11px] text-slate-500">Calculate via balance percentage or fixed dollar loss</p>
              </div>

              {/* Mode Toggle */}
              <div className="flex items-center gap-1.5 p-1 bg-[#070c18] border border-slate-800 rounded-xl mt-2 sm:mt-0">
                <button
                  id="risk-type-percent-btn"
                  type="button"
                  onClick={() => setRiskType('percentage')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    riskType === 'percentage'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <Percent className="w-3.5 h-3.5" />
                  <span>Percentage (%)</span>
                </button>

                <button
                  id="risk-type-cash-btn"
                  type="button"
                  onClick={() => setRiskType('cash')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    riskType === 'cash'
                      ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Fixed Cash ($)</span>
                </button>
              </div>
            </div>

            {/* Dynamic Risk Input Field */}
            <div className="mt-3">
              <label htmlFor="risk-value-input" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase mb-2">
                {riskType === 'percentage' ? 'Risk Percentage (%)' : 'Fixed Cash Risk ($)'}
              </label>
              <div className="relative flex items-center bg-[#070c18] border border-slate-700/80 hover:border-cyan-500/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-xl px-3.5 py-2.5 transition-all">
                {riskType === 'cash' && (
                  <span className="text-slate-400 font-mono-num text-base mr-2">$</span>
                )}
                <input
                  id="risk-value-input"
                  type="number"
                  min="0"
                  step={riskType === 'percentage' ? '0.1' : '1'}
                  value={
                    riskType === 'percentage'
                      ? riskPercentage === 0 ? '' : riskPercentage
                      : riskCash === 0 ? '' : riskCash
                  }
                  onChange={handleRiskChange}
                  placeholder={riskType === 'percentage' ? '1.0' : '100'}
                  className="w-full bg-transparent text-white font-mono-num text-base font-semibold focus:outline-none placeholder-slate-600"
                />
                {riskType === 'percentage' ? (
                  <span className="text-sm font-bold text-cyan-400 font-mono-num ml-2">%</span>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 uppercase ml-2 bg-slate-800/60 px-2 py-0.5 rounded">
                    USD
                  </span>
                )}
              </div>

              {/* Quick Risk Presets */}
              <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Quick Risk Presets:</span>
                {riskType === 'percentage'
                  ? percentPresets.map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setRiskPercentage(pct)}
                        className={`text-[11px] font-mono-num px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          riskPercentage === pct
                            ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        {pct.toFixed(1)}%
                      </button>
                    ))
                  : cashPresets.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setRiskCash(amt)}
                        className={`text-[11px] font-mono-num px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                          riskCash === amt
                            ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
              </div>
            </div>

          </div>

          {/* Row 3: Stop Loss (Pips) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="stop-loss-input" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Stop Loss (Pips)
              </label>
              <span className="text-[11px] text-slate-400">Decimals allowed (e.g., 13.2 or 44)</span>
            </div>
            <div className="relative flex items-center bg-[#070c18] border border-slate-700/80 hover:border-cyan-500/50 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 rounded-xl px-3.5 py-2.5 transition-all">
              <Target className="w-4 h-4 text-slate-400 mr-2.5 shrink-0" />
              <input
                id="stop-loss-input"
                type="number"
                min="0.1"
                step="0.1"
                value={stopLossPips === 0 ? '' : stopLossPips}
                onChange={handleSlChange}
                placeholder="25.0"
                className="w-full bg-transparent text-white font-mono-num text-base font-semibold focus:outline-none placeholder-slate-600"
              />
              <span className="text-xs font-bold text-slate-400 font-mono-num tracking-wider ml-2 bg-slate-800/60 px-2 py-0.5 rounded">
                PIPS
              </span>
            </div>

            {/* SL Presets */}
            <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
              <span className="text-[11px] text-slate-500 font-medium mr-1">Standard SL:</span>
              {slPresets.map((pips) => (
                <button
                  key={pips}
                  type="button"
                  onClick={() => setStopLossPips(pips)}
                  className={`text-[11px] font-mono-num px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                    stopLossPips === pips
                      ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {pips}p
                </button>
              ))}
            </div>
          </div>

          {/* Row 4: Target Take Profit (Pips) */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="take-profit-input" className="block text-xs font-semibold tracking-wider text-slate-400 uppercase">
                Target Take Profit (Pips)
              </label>
              <span className="text-[11px] text-slate-400">Decimals allowed (e.g., 50.0 or 75)</span>
            </div>
            <div className="relative flex items-center bg-[#070c18] border border-slate-700/80 hover:border-emerald-500/50 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-500/20 rounded-xl px-3.5 py-2.5 transition-all">
              <TrendingUp className="w-4 h-4 text-emerald-400 mr-2.5 shrink-0" />
              <input
                id="take-profit-input"
                type="number"
                min="0.1"
                step="0.1"
                value={takeProfitPips === 0 ? '' : takeProfitPips}
                onChange={handleTpChange}
                placeholder="50.0"
                className="w-full bg-transparent text-white font-mono-num text-base font-semibold focus:outline-none placeholder-slate-600"
              />
              <span className="text-xs font-bold text-emerald-400 font-mono-num tracking-wider ml-2 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                PIPS TP
              </span>
            </div>

            {/* TP Presets & Dynamic R:R Quick Selection */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Target TP:</span>
                {tpPresets.map((pips) => (
                  <button
                    key={pips}
                    type="button"
                    onClick={() => setTakeProfitPips(pips)}
                    className={`text-[11px] font-mono-num px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${
                      takeProfitPips === pips
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 font-bold'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {pips}p
                  </button>
                ))}
              </div>

              {/* R:R Multiplier shortcuts based on current SL */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-500 font-medium mr-1">Target R:R:</span>
                {[1, 1.5, 2, 3].map((ratio) => {
                  const targetPips = Math.round(stopLossPips * ratio * 10) / 10;
                  const isMatching = Math.abs(takeProfitPips - targetPips) < 0.05;
                  return (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setTakeProfitPips(targetPips)}
                      className={`text-[11px] font-mono-num px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                        isMatching
                          ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300 font-bold shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/40'
                      }`}
                      title={`Set TP to ${targetPips} pips for 1:${ratio} R:R`}
                    >
                      1:{ratio}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Action Button & Live Note */}
      <div className="pt-8 mt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center gap-4">
        <button
          id="instant-calculate-button"
          type="button"
          onClick={onCalculateTrigger}
          className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 hover:from-teal-300 hover:to-cyan-300 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-cyan-500/25 transition-all transform active:scale-[0.98] cursor-pointer"
        >
          <Calculator className="w-4 h-4 text-slate-950 stroke-[2.5]" />
          <span>Instant Calculate</span>
        </button>
        <span className="text-xs text-slate-400 font-medium text-center sm:text-left">
          Live updates automatically on every keystroke
        </span>
      </div>

    </div>
  );
};
