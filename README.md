# Von Pips FX — Position Size & Risk Calculator

An institutional-grade, responsive Forex position size, risk management, and live pip valuation web application built with React 19, TypeScript, and Tailwind CSS.

![Von Pips FX Dashboard Preview](https://raw.githubusercontent.com/4von/von-pips-fx/main/preview.png)


---

## 🚀 Overview

**Von Pips FX** helps retail and proprietary traders eliminate calculation errors and prevent capital drawdowns by calculating exact position lot sizes, monetary gains, and risk-to-reward ratios before opening orders in MetaTrader 4/5, TradingView, or cTrader.

The engine accounts for live exchange rates, varying contract sizes, decimal pipettes, and quote currency conversions across 17 major currency pairs and commodities.
                                    <a href="https://trendshift.io/repositories/28176?utm_source=repository-badge&amp;utm_medium=badge&amp;utm_campaign=badge-repository-28176" target="_blank" rel="noopener noreferrer"><img src="https://trendshift.io/api/badge/repositories/28176" alt="debpalash%2FVoiceStudio | Trendshift" width="250" height="55"/></a>
---

## ⚡ Key Features

- **Exact Lot Sizing Engine**: Computes standard, mini, and micro lots rounded to 2 decimal places using the institutional formula:
  $$\text{Lot Size} = \frac{\text{Cash Risked}}{\text{Stop Loss (Pips)} \times \text{Pip Value}}$$
- **Dual Risk Allocation Modes**:
  - **Percentage Mode (%)**: Calculate risk dynamically from total account equity (e.g. `0.5%`, `1.0%`, `2.0%`, `3.0%`).
  - **Fixed Cash Mode ($)**: Specify exact dollar loss tolerance (e.g. `$50`, `$100`, `$250`).
- **Live Market Pip Valuation Engine**:
  - Automatically fetches live foreign exchange rates to calculate dynamic pip prices down to the cent.
  - Accounts for fixed USD quote pairs ($10.00/pip), USD base pairs (e.g., USD/JPY, USD/CAD), and cross-currency pairs (e.g., EUR/GBP, GBP/JPY).
  - Includes a fallback toggle to standard institutional benchmark rates.
- **Target Take Profit & Risk-to-Reward (R:R)**:
  - Configurable Take Profit target in pips with preset buttons (`25p`, `50p`, `75p`, `100p`, `150p`).
  - Quick R:R target buttons (`1:1`, `1:1.5`, `1:2`, `1:3`) that automatically calculate target pips relative to Stop Loss.
  - Real-time potential monetary profit calculation and trade asymmetry badge.
- **17 Configured Instruments**:
  - **Forex Majors & Crosses**: EUR/USD, GBP/USD, USD/JPY, USD/CAD, USD/CHF, AUD/USD, AUD/CAD, EUR/AUD, GBP/CHF, GBP/JPY, GBP/NZD, EUR/CAD, CAD/CHF, EUR/GBP, GBP/AUD, GBP/CAD.
  - **Commodities**: XAU/USD (Gold, 100 oz standard contract).
- **Interactive Pip Reference Table**: 17-pair interactive grid displaying pip values per standard lot with one-click instrument selection.
- **Dark Modern Dashboard Aesthetic**: High-contrast slate/midnight navy background (`#060b17`), crisp border framing, glowing neon cyan/emerald inputs, and full mobile responsiveness.

---

## 📐 Mathematical Formulation

### 1. Position Sizing
```
Lot Size = Cash Risked / (Stop Loss Pips × Pip Value in USD)
Position Units = Lot Size × Contract Size (100,000 units or 100 oz Gold)
```

### 2. Pip Value in USD
- **Quote Currency = USD (EUR/USD, GBP/USD, AUD/USD, XAU/USD)**:
  $$\text{Pip Value} = 100{,}000 \times 0.0001 = \$10.00\text{ USD (Constant)}$$
- **Base Currency = USD (USD/JPY, USD/CAD, USD/CHF)**:
  $$\text{Pip Value} = \frac{\text{Standard Pip in Quote Currency}}{\text{USD/Quote Rate}}$$
- **Cross Currency (EUR/GBP, GBP/JPY, EUR/AUD)**:
  $$\text{Pip Value} = \frac{\text{Pip in Quote Currency}}{\text{USD/Quote Rate}}$$

### 3. Risk-to-Reward (R:R) Ratio
$$\text{R:R Ratio} = \frac{\text{Take Profit (Pips)}}{\text{Stop Loss (Pips)}}$$
$$\text{Potential Monetary Gain} = \text{Lot Size} \times \text{Take Profit (Pips)} \times \text{Pip Value}$$

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) & [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)

---

## 📦 Project Structure

```
├── public/
├── src/
│   ├── components/
│   │   ├── LiveRateStatus.tsx       # Live exchange rate sync & toggle bar
│   │   ├── PipReferenceTable.tsx    # 17-instrument reference grid
│   │   ├── ResultsPanel.tsx         # Recommended lot size, R:R, gain cards
│   │   ├── TopNav.tsx               # Brand header, ticker chips & live status
│   │   └── TradeParameters.tsx      # Balance, pair, risk, SL & TP input form
│   ├── data/
│   │   └── currencyPairs.ts         # Specifications for 17 currency pairs & gold
│   ├── utils/
│   │   └── pipCalculator.ts         # Real-time exchange rate engine & math logic
│   ├── types.ts                     # Application TypeScript interfaces
│   ├── App.tsx                      # Root reactive state controller
│   ├── main.tsx                     # React DOM entry point
│   └── index.css                    # Tailwind CSS imports & theme styles
├── index.html                       # HTML5 template & web font imports
├── metadata.json                    # Application metadata
├── package.json                     # Dependencies & build scripts
├── tsconfig.json                    # TypeScript compiler configuration
└── vite.config.ts                   # Vite build configuration
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have **Node.js (v18+)** and **npm** installed:

```bash
node -v
npm -v
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/4von/Von-pips-fx.git
   cd Von-pips-fx
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser.

---

## 🏗️ Production Build

To compile a minified production build:

```bash
npm run build
```

The compiled static assets will be output to the `dist/` directory.

---

## 📄 License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---

## ⚠️ Disclaimer

*Trading foreign exchange and leveraged financial instruments carries a high level of risk and may not be suitable for all investors. Always manage your position sizing responsibly.*
