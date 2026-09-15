import { describe, it, expect, vi, afterEach } from 'vitest';
import { calculatePipValueInUSD, fetchLiveExchangeRates, DEFAULT_USD_RATES } from './pipCalculator';

describe('calculatePipValueInUSD', () => {
  it('returns a fixed $10.00 pip value for USD-quoted pairs', () => {
    const result = calculatePipValueInUSD('USD', 'EUR');
    expect(result.pipValue).toBe(10.0);
    expect(result.isFixedUSD).toBe(true);
  });

  it('returns a fixed $10.00 pip value for gold (XAU/USD)', () => {
    const result = calculatePipValueInUSD('USD', 'XAU', true);
    expect(result.pipValue).toBe(10.0);
    expect(result.isFixedUSD).toBe(true);
  });

  it('divides the standard JPY pip by the USD/JPY rate for JPY-quoted pairs', () => {
    const result = calculatePipValueInUSD('JPY', 'USD', false, { ...DEFAULT_USD_RATES, JPY: 155.8 });
    expect(result.pipValue).toBeCloseTo(6.42, 2);
    expect(result.isFixedUSD).toBe(false);
  });

  it('computes cross-currency pip values from the quote currency rate', () => {
    // EUR/GBP: 10 GBP / 0.7865 (USD/GBP) = $12.71 USD
    const result = calculatePipValueInUSD('GBP', 'EUR', false, { ...DEFAULT_USD_RATES, GBP: 0.7865 });
    expect(result.pipValue).toBeCloseTo(12.71, 2);
  });

  it('falls back to the institutional benchmark rate when a currency is missing from live rates', () => {
    const result = calculatePipValueInUSD('CAD', 'USD', false, {});
    expect(result.pipValue).toBeCloseTo(10 / DEFAULT_USD_RATES.CAD, 2);
  });
});

describe('fetchLiveExchangeRates', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it('merges live rates over the benchmark defaults on success', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ rates: { EUR: 0.91 } }),
    }) as unknown as typeof fetch;

    const result = await fetchLiveExchangeRates();
    expect(result.source).toBe('live_api');
    expect(result.rates.EUR).toBe(0.91);
    expect(result.rates.JPY).toBe(DEFAULT_USD_RATES.JPY);
  });

  it('falls back to benchmark rates when the request throws', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    const result = await fetchLiveExchangeRates();
    expect(result.source).toBe('benchmark');
    expect(result.rates).toEqual(DEFAULT_USD_RATES);
  });

  it('falls back to benchmark rates on a non-OK HTTP response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

    const result = await fetchLiveExchangeRates();
    expect(result.source).toBe('benchmark');
  });
});
