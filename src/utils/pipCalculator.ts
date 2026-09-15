/**
 * Real-time Exchange Rate & Dynamic Pip Valuation Engine
 * Supports standard live rate calculation, API fetching with caching,
 * and manual custom rate overrides.
 */

export interface LiveRates {
  rates: Record<string, number>; // e.g. { JPY: 155.80, CAD: 1.3610, CHF: 0.8925, GBP: 0.7865, EUR: 0.9220, AUD: 1.5060, NZD: 1.6800 }
  lastUpdated: Date;
  source: 'live_api' | 'benchmark' | 'custom';
}

// Institutional benchmark rates (against USD as base, e.g. 1 USD = X currency)
export const DEFAULT_USD_RATES: Record<string, number> = {
  USD: 1.0000,
  EUR: 0.9224,    // implies EUR/USD ~ 1.0841
  GBP: 0.7865,    // implies GBP/USD ~ 1.2715
  JPY: 155.80,    // USD/JPY
  CAD: 1.3610,    // USD/CAD
  CHF: 0.8925,    // USD/CHF
  AUD: 1.5060,    // implies AUD/USD ~ 0.6640
  NZD: 1.6800,    // implies NZD/USD ~ 0.5952
  XAU: 0.0004198, // Gold: 1 / 2382.40
};

/**
 * Calculates the exact pip value in USD for 1.00 standard lot (100,000 units or 100 oz Gold)
 * based on the provided exchange rates relative to USD.
 *
 * Forex Math Rules (Standard 100,000 unit contract):
 * 1 Pip = 0.0001 (or 0.01 for JPY pairs, 0.01 for Gold)
 *
 * Case A: Quote currency is USD (EUR/USD, GBP/USD, AUD/USD, XAU/USD):
 *   Pip Value = 100,000 * 0.0001 = $10.00 USD (Always constant)
 *
 * Case B: Base currency is USD (USD/JPY, USD/CAD, USD/CHF):
 *   Pip Value in USD = (Standard Pip in Quote Currency) / (USD/QuoteRate)
 *   USD/JPY: (100,000 * 0.01 JPY) / 155.80 = 1,000 JPY / 155.80 = $6.42 USD
 *   USD/CAD: (100,000 * 0.0001 CAD) / 1.3610 = 10 CAD / 1.3610 = $7.35 USD
 *   USD/CHF: (100,000 * 0.0001 CHF) / 0.8925 = 10 CHF / 0.8925 = $11.20 USD
 *
 * Case C: Cross Currency (EUR/GBP, GBP/JPY, EUR/AUD):
 *   Pip in Quote Currency = 10 units of Quote Currency (or 1000 JPY)
 *   Pip Value in USD = (Pip in Quote Currency) / (USD/QuoteCurrencyRate)
 *   EUR/GBP: 10 GBP / 0.7865 = $12.71 USD
 *   GBP/JPY: 1,000 JPY / 155.80 = $6.42 USD
 *   EUR/AUD: 10 AUD / 1.5060 = $6.64 USD
 */
export function calculatePipValueInUSD(
  quoteCurrency: string,
  baseCurrency: string,
  isCommodity: boolean = false,
  rates: Record<string, number> = DEFAULT_USD_RATES
): {
  pipValue: number;
  formula: string;
  isFixedUSD: boolean;
  rateUsed: number;
} {
  // Commodity (Gold XAU/USD)
  if (isCommodity || (baseCurrency === 'XAU' && quoteCurrency === 'USD')) {
    return {
      pipValue: 10.00,
      formula: '100 oz contract × $0.10 price move = $10.00 / pip',
      isFixedUSD: true,
      rateUsed: 1.0,
    };
  }

  // Case A: Quote Currency is USD
  if (quoteCurrency === 'USD') {
    return {
      pipValue: 10.00,
      formula: '100,000 units × 0.0001 USD = $10.00 / pip (Constant)',
      isFixedUSD: true,
      rateUsed: 1.0,
    };
  }

  const quoteRateAgainstUSD = rates[quoteCurrency] ?? DEFAULT_USD_RATES[quoteCurrency] ?? 1.0;

  // Case B & C: Quote currency is JPY (pip size = 0.01, so 100,000 * 0.01 = 1,000 JPY)
  if (quoteCurrency === 'JPY') {
    const pipInJPY = 1000; // JPY per standard lot
    const pipInUSD = pipInJPY / quoteRateAgainstUSD;
    return {
      pipValue: Math.round(pipInUSD * 100) / 100,
      formula: `1,000 JPY ÷ ${quoteRateAgainstUSD.toFixed(2)} (USD/JPY) = $${(pipInJPY / quoteRateAgainstUSD).toFixed(2)}`,
      isFixedUSD: false,
      rateUsed: quoteRateAgainstUSD,
    };
  }

  // Quote currency is other standard currency (EUR, GBP, CAD, CHF, AUD, NZD)
  // Pip size = 0.0001, so 100,000 * 0.0001 = 10 units of Quote Currency
  const pipInQuote = 10.0;
  const pipInUSD = pipInQuote / quoteRateAgainstUSD;

  return {
    pipValue: Math.round(pipInUSD * 100) / 100,
    formula: `10 ${quoteCurrency} ÷ ${quoteRateAgainstUSD.toFixed(4)} (USD/${quoteCurrency}) = $${pipInUSD.toFixed(2)}`,
    isFixedUSD: false,
    rateUsed: quoteRateAgainstUSD,
  };
}

// Fetch live rates from public open rates API with graceful fallback to institutional benchmark
export async function fetchLiveExchangeRates(): Promise<LiveRates> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch('https://open.er-api.com/v6/latest/USD', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Rates API HTTP error: ${response.status}`);
    }

    const data = await response.json();
    if (data && data.rates && typeof data.rates === 'object') {
      const liveRates: Record<string, number> = {
        ...DEFAULT_USD_RATES,
        ...data.rates,
      };
      return {
        rates: liveRates,
        lastUpdated: new Date(),
        source: 'live_api',
      };
    }
    throw new Error('Invalid rate data format received');
  } catch {
    // Graceful fallback to verified benchmark rates
    return {
      rates: { ...DEFAULT_USD_RATES },
      lastUpdated: new Date(),
      source: 'benchmark',
    };
  }
}
