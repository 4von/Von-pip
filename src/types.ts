export type RiskType = 'percentage' | 'cash';
export type PipMode = 'live' | 'standard';

export interface CurrencyPair {
  id: string;
  symbol: string;
  name: string;
  pipValue: number; // in USD per 1.00 standard lot (100k units or 100 oz)
  digits: number; // 4 or 2 or 3
  baseCurrency: string;
  quoteCurrency: string;
  isCommodity?: boolean;
  benchmarkPrice?: string;
  priceChange?: string;
  contractSize: number; // 100,000 or 100
  unitLabel: string;
}

export interface TradeCalculation {
  accountBalance: number;
  riskType: RiskType;
  riskValue: number; // percentage or cash
  cashRisked: number;
  effectiveRiskPercentage: number;
  stopLossPips: number;
  takeProfitPips: number;
  pipValue: number;
  pipMode: PipMode;
  pipFormulaNote: string;
  isFixedUSD: boolean;
  lotSize: number;
  miniLots: number;
  microLots: number;
  positionUnits: number;
  potentialGain: number;
  effectiveGainPercentage: number;
  riskRewardRatio: number; // e.g. 2.0 for 1:2
  isValid: boolean;
  error?: string;
  formulaStep: string;
}
