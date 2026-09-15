import React from 'react';
import { GraduationCap } from 'lucide-react';

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: 'What is a pip?',
    answer:
      'A "pip" (percentage in point) is the smallest standardized price move for a currency pair — typically the fourth decimal place (0.0001), or the second decimal place (0.01) for pairs quoted in Japanese Yen. It is the common unit traders use to measure price movement and risk.',
  },
  {
    question: 'Why does pip value change between currency pairs?',
    answer:
      'Pip value is fixed at $10.00 per standard lot only when the quote currency is USD (e.g. EUR/USD, GBP/USD). For every other pair, the pip is denominated in the quote currency, so its USD value moves with that currency’s live exchange rate — which is exactly what the Live Market Pip Price mode above calculates for you.',
  },
  {
    question: 'How is my recommended lot size calculated?',
    answer:
      'Lot Size = Cash Risked ÷ (Stop Loss in Pips × Pip Value). Cash Risked comes from your account balance and chosen risk percentage or fixed dollar amount. This keeps every trade’s dollar loss capped at the amount you chose to risk, regardless of the pair or stop distance.',
  },
  {
    question: 'What does a Risk-to-Reward ratio mean?',
    answer:
      'Risk-to-Reward (R:R) compares your Take Profit distance to your Stop Loss distance (TP ÷ SL). A 1:2 ratio means you stand to gain twice what you are risking. Favorable R:R ratios let a trading system stay profitable even without a high win rate.',
  },
];

export const PipEducation: React.FC = () => {
  return (
    <div className="w-full bg-[#0d1527] border border-slate-800/90 rounded-2xl p-6 lg:p-7 shadow-xl shadow-black/40">
      <div className="flex items-center gap-2.5 pb-5 border-b border-slate-800/80 mb-6">
        <GraduationCap className="w-4 h-4 text-cyan-400 shrink-0" />
        <div>
          <h3 className="text-xs font-bold tracking-wider text-slate-200 uppercase">
            Understanding Pip Value &amp; Position Sizing
          </h3>
          <p className="text-[11px] text-slate-400 mt-0.5">
            The core concepts behind every number this calculator produces.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {FAQ_ITEMS.map((item) => (
          <div key={item.question} className="bg-[#070c18] border border-slate-800/90 rounded-xl p-4">
            <h4 className="text-sm font-bold text-white mb-1.5">{item.question}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
