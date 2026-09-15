import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { TradeParameters } from './components/TradeParameters';
import { ResultsPanel } from './components/ResultsPanel';
import { PipReferenceTable } from './components/PipReferenceTable';
import { LiveRateStatus } from './components/LiveRateStatus';
import { PipEducation } from './components/PipEducation';
import { CURRENCY_PAIRS } from './data/currencyPairs';
import { CurrencyPair, RiskType, PipMode, TradeCalculation } from './types';
import { calculatePipValueInUSD, fetchLiveExchangeRates, DEFAULT_USD_RATES } from './utils/pipCalculator';

// Remembers the trader's last-used inputs across visits (per-browser convenience only).
const SETTINGS_STORAGE_KEY = 'von-pips-fx:settings';

interface StoredSettings {
  balance: number;
  pairSymbol: string;
  riskType: RiskType;
  riskPercentage: number;
  riskCash: number;
  stopLossPips: number;
  takeProfitPips: number;
  pipMode: PipMode;
}

function loadStoredSettings(): Partial<StoredSettings> {
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

const storedSettings = loadStoredSettings();

export default function App() {
  // Default values matching the screenshot, overridden by any previously saved settings
  const [balance, setBalance] = useState<number>(storedSettings.balance ?? 10000);
  const [selectedPair, setSelectedPair] = useState<CurrencyPair>(
    CURRENCY_PAIRS.find((p) => p.symbol === storedSettings.pairSymbol) ?? CURRENCY_PAIRS[0]
  );
  const [riskType, setRiskType] = useState<RiskType>(storedSettings.riskType ?? 'percentage');
  const [riskPercentage, setRiskPercentage] = useState<number>(storedSettings.riskPercentage ?? 1.0);
  const [riskCash, setRiskCash] = useState<number>(storedSettings.riskCash ?? 100);
  const [stopLossPips, setStopLossPips] = useState<number>(storedSettings.stopLossPips ?? 25.0);
  const [takeProfitPips, setTakeProfitPips] = useState<number>(storedSettings.takeProfitPips ?? 50.0);
  const [isCalculatedFlash, setIsCalculatedFlash] = useState<boolean>(false);

  // Live Exchange Rate State
  const [pipMode, setPipMode] = useState<PipMode>(storedSettings.pipMode ?? 'live');
  const [rates, setRates] = useState<Record<string, number>>(DEFAULT_USD_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState<boolean>(false);
  const [lastUpdatedRates, setLastUpdatedRates] = useState<Date | null>(new Date());
  const [rateSource, setRateSource] = useState<'live_api' | 'benchmark' | 'custom'>('live_api');

  // Load live rates on mount
  const refreshRates = useCallback(async () => {
    setIsLoadingRates(true);
    const result = await fetchLiveExchangeRates();
    setRates(result.rates);
    setLastUpdatedRates(result.lastUpdated);
    setRateSource(result.source);
    setIsLoadingRates(false);
  }, []);

  useEffect(() => {
    refreshRates();
  }, [refreshRates]);

  // Persist the trader's inputs so they survive a page reload
  useEffect(() => {
    try {
      const settings: StoredSettings = {
        balance,
        pairSymbol: selectedPair.symbol,
        riskType,
        riskPercentage,
        riskCash,
        stopLossPips,
        takeProfitPips,
        pipMode,
      };
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // localStorage unavailable (private browsing / quota) - safe to ignore
    }
  }, [balance, selectedPair, riskType, riskPercentage, riskCash, stopLossPips, takeProfitPips, pipMode]);

  // Helper to compute pip value for any pair based on current pipMode & rates
  const getPipValueForPair = useCallback((pair: CurrencyPair) => {
    if (pipMode === 'standard') {
      return {
        pipValue: pair.pipValue,
        isFixedUSD: pair.quoteCurrency === 'USD',
        formula: 'Standard institutional benchmark',
      };
    }
    const calculation = calculatePipValueInUSD(
      pair.quoteCurrency,
      pair.baseCurrency,
      pair.isCommodity,
      rates
    );
    return {
      pipValue: calculation.pipValue,
      isFixedUSD: calculation.isFixedUSD,
      formula: calculation.formula,
    };
  }, [pipMode, rates]);

  // Active pair's computed pip value
  const activePipInfo = useMemo(() => {
    return getPipValueForPair(selectedPair);
  }, [getPipValueForPair, selectedPair]);

  // Synchronize cash & percentage gracefully when toggling
  const handleRiskTypeChange = (newType: RiskType) => {
    if (newType === 'cash' && riskType === 'percentage') {
      const calculatedCash = balance > 0 ? (balance * riskPercentage) / 100 : 100;
      setRiskCash(Math.round(calculatedCash * 100) / 100);
    } else if (newType === 'percentage' && riskType === 'cash') {
      const calculatedPct = balance > 0 ? (riskCash / balance) * 100 : 1.0;
      setRiskPercentage(Math.round(calculatedPct * 10) / 10);
    }
    setRiskType(newType);
  };

  // Perform Calculation & Validation
  const calculation = useMemo<TradeCalculation>(() => {
    let isValid = true;
    let error: string | undefined = undefined;

    if (balance <= 0) {
      isValid = false;
      error = 'Account balance must be greater than $0.00';
    } else if (balance > 1000000) {
      isValid = false;
      error = 'Account balance cannot exceed $1,000,000 USD';
    } else if (stopLossPips <= 0) {
      isValid = false;
      error = 'Stop loss must be greater than 0 pips';
    } else if (takeProfitPips <= 0) {
      isValid = false;
      error = 'Target take profit must be greater than 0 pips';
    } else if (riskType === 'percentage' && (riskPercentage <= 0 || riskPercentage > 100)) {
      isValid = false;
      error = 'Risk percentage must be between 0.1% and 100%';
    } else if (riskType === 'cash' && (riskCash <= 0 || riskCash > balance)) {
      isValid = false;
      error = riskCash > balance
        ? 'Risk cash amount cannot exceed account balance'
        : 'Risk cash amount must be greater than $0.00';
    }

    const pipVal = activePipInfo.pipValue;
    let cashRisk = 0;
    let effRiskPct = 0;

    if (riskType === 'percentage') {
      cashRisk = (balance * riskPercentage) / 100;
      effRiskPct = riskPercentage;
    } else {
      cashRisk = riskCash;
      effRiskPct = balance > 0 ? (riskCash / balance) * 100 : 0;
    }

    let exactLotSize = 0;
    let formulaStep = '';

    if (isValid && stopLossPips > 0 && pipVal > 0) {
      // Formula: Lot Size = Cash Risked / (SL Pips * Pip Value)
      const denominator = stopLossPips * pipVal;
      exactLotSize = cashRisk / denominator;
      
      formulaStep = `$${cashRisk.toFixed(2)} ÷ (${stopLossPips.toFixed(1)} × $${pipVal.toFixed(2)}) = ${exactLotSize.toFixed(2)}`;
    } else {
      formulaStep = `$${cashRisk.toFixed(2)} ÷ (${stopLossPips.toFixed(1)} × $${pipVal.toFixed(2)}) = 0.00`;
    }

    const roundedLotSize = Math.max(0, Math.round(exactLotSize * 100) / 100);

    // Potential monetary gain based on recommended lot size: Lot Size * TP Pips * Pip Value
    const potentialGain = isValid && roundedLotSize > 0 && takeProfitPips > 0
      ? roundedLotSize * takeProfitPips * pipVal
      : 0;

    const effGainPct = balance > 0 ? (potentialGain / balance) * 100 : 0;
    const rrRatio = stopLossPips > 0 && takeProfitPips > 0 ? takeProfitPips / stopLossPips : 0;

    // Standard contracts: 100,000 units (or 100 oz for Gold)
    const positionUnits = exactLotSize * selectedPair.contractSize;
    const miniLots = exactLotSize * 10;
    const microLots = exactLotSize * 100;

    return {
      accountBalance: balance,
      riskType,
      riskValue: riskType === 'percentage' ? riskPercentage : riskCash,
      cashRisked: cashRisk,
      effectiveRiskPercentage: effRiskPct,
      stopLossPips,
      takeProfitPips,
      pipValue: pipVal,
      pipMode,
      pipFormulaNote: activePipInfo.formula,
      isFixedUSD: activePipInfo.isFixedUSD,
      lotSize: roundedLotSize,
      miniLots: Math.max(0, miniLots),
      microLots: Math.max(0, microLots),
      positionUnits: Math.max(0, positionUnits),
      potentialGain,
      effectiveGainPercentage: effGainPct,
      riskRewardRatio: rrRatio,
      isValid,
      error,
      formulaStep,
    };
  }, [balance, selectedPair, riskType, riskPercentage, riskCash, stopLossPips, takeProfitPips, activePipInfo, pipMode]);

  // Flash highlight on click of Instant Calculate
  const triggerCalculate = () => {
    setIsCalculatedFlash(true);
    setTimeout(() => setIsCalculatedFlash(false), 600);
  };

  // Reset to screenshot defaults
  const handleReset = () => {
    setBalance(10000);
    setSelectedPair(CURRENCY_PAIRS[0]); // EUR/USD
    setRiskType('percentage');
    setRiskPercentage(1.0);
    setRiskCash(100);
    setStopLossPips(25.0);
    setTakeProfitPips(50.0);
  };

  // Switch pair from tickers or table
  const handleSelectPairBySymbol = (symbol: string) => {
    const found = CURRENCY_PAIRS.find((p) => p.symbol === symbol);
    if (found) setSelectedPair(found);
  };

  return (
    <div className="min-h-screen bg-[#070c18] text-slate-100 flex flex-col justify-between">
      
      {/* Navigation Header */}
      <TopNav
        onReset={handleReset}
        onSelectPair={handleSelectPairBySymbol}
        currentPair={selectedPair}
        eurUsdPip={getPipValueForPair(CURRENCY_PAIRS[0]).pipValue}
        xauUsdPip={getPipValueForPair(CURRENCY_PAIRS[4] ?? CURRENCY_PAIRS[0]).pipValue}
        usdJpyPip={getPipValueForPair(CURRENCY_PAIRS[2]).pipValue}
        pipMode={pipMode}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 flex-1 flex flex-col gap-8">
        
        {/* Title Header Section */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Position Size &amp; Risk Calculator
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-normal">
            Protect capital through institutional-grade risk management and exact lot allocation.
          </p>
        </div>

        {/* Live Market Pip Price Toggle & Status Bar */}
        <LiveRateStatus
          pipMode={pipMode}
          setPipMode={setPipMode}
          isLoadingRates={isLoadingRates}
          onRefreshRates={refreshRates}
          lastUpdated={lastUpdatedRates}
          rateSource={rateSource}
          currentPipValue={activePipInfo.pipValue}
          isFixedUSD={activePipInfo.isFixedUSD}
          quoteCurrency={selectedPair.quoteCurrency}
          formulaNote={activePipInfo.formula}
        />

        {/* 2-Column Primary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Trade Parameters (7 cols) */}
          <div className="lg:col-span-7 h-full">
            <TradeParameters
              balance={balance}
              setBalance={setBalance}
              selectedPair={selectedPair}
              setSelectedPair={setSelectedPair}
              effectivePipValue={activePipInfo.pipValue}
              isLivePipMode={pipMode === 'live'}
              riskType={riskType}
              setRiskType={handleRiskTypeChange}
              riskPercentage={riskPercentage}
              setRiskPercentage={setRiskPercentage}
              riskCash={riskCash}
              setRiskCash={setRiskCash}
              stopLossPips={stopLossPips}
              setStopLossPips={setStopLossPips}
              takeProfitPips={takeProfitPips}
              setTakeProfitPips={setTakeProfitPips}
              onCalculateTrigger={triggerCalculate}
              validationError={calculation.error}
            />
          </div>

          {/* Right Column: Output / Results (5 cols) */}
          <div className="lg:col-span-5 h-full">
            <ResultsPanel
              calc={calculation}
              selectedPair={selectedPair}
              isCalculatedFlash={isCalculatedFlash}
            />
          </div>

        </div>

        {/* Bottom Section: Standard / Live Pip Value Reference Table */}
        <div className="w-full">
          <PipReferenceTable
            selectedPair={selectedPair}
            onSelectPair={setSelectedPair}
            pipMode={pipMode}
            rates={rates}
            getPipValueForPair={getPipValueForPair}
          />
        </div>

        {/* Educational Section: Pip & Position Sizing Explainer */}
        <div className="w-full">
          <PipEducation />
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-[#060a14] py-5 px-4 sm:px-8 mt-12 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="font-medium text-slate-400">
          Von Pips Lot Size Calculator • <span className="text-cyan-500">Precision Engine</span>
        </div>
        <div className="text-center sm:text-right text-slate-400 text-[11px]">
          Trading Foreign Exchange on margin carries high risk and may not be suitable for all investors.
        </div>
      </footer>

    </div>
  );
}
