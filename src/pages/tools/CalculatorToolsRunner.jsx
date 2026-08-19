import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
import CalculatorTopAd from '../../components/CalculatorTopAd';
import CalculatorBottomAd from '../../components/CalculatorBottomAd';
import {
  Calculator,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Percent,
  Calendar,
  Clock,
  CreditCard,
  Receipt,
  TrendingUp,
  DollarSign,
  PieChart,
  Landmark,
  ShieldCheck,
  Award,
  Info,
} from 'lucide-react';

export default function CalculatorToolsRunner({ toolId, toolTitle, toolDescription }) {
  // Common states
  const [errorMsg, setErrorMsg] = useState('');

  // 1. Percentage
  const [percNum, setPercNum] = useState(250);
  const [percRate, setPercRate] = useState(15);
  // 2. Age
  const [dob, setDob] = useState('1998-05-15');
  // 3. Date
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  // 4. EMI
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanInterest, setLoanInterest] = useState(9.5);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  // 5. GST
  const [gstAmount, setGstAmount] = useState(1000);
  const [gstRate, setGstRate] = useState(18);
  const [gstType, setGstType] = useState('exclusive'); // 'exclusive' | 'inclusive'
  // 6. Profit & Loss
  const [costPrice, setCostPrice] = useState(800);
  const [sellingPrice, setSellingPrice] = useState(1000);
  // 7. Simple Interest
  const [siPrincipal, setSiPrincipal] = useState(100000);
  const [siRate, setSiRate] = useState(8);
  const [siTime, setSiTime] = useState(3);
  // 8. Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState(100000);
  const [ciRate, setCiRate] = useState(8);
  const [ciTime, setCiTime] = useState(3);
  const [ciFrequency, setCiFrequency] = useState(1); // 1 yearly, 4 quarterly, 12 monthly
  // 9. SIP
  const [sipMonthly, setSipMonthly] = useState(5000);
  const [sipRate, setSipRate] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  // 10. SWP
  const [swpInvestment, setSwpInvestment] = useState(1000000);
  const [swpWithdrawal, setSwpWithdrawal] = useState(8000);
  const [swpRate, setSwpRate] = useState(8);
  const [swpYears, setSwpYears] = useState(10);
  // 11. Lumpsum
  const [lumpAmount, setLumpAmount] = useState(100000);
  const [lumpRate, setLumpRate] = useState(12);
  const [lumpYears, setLumpYears] = useState(10);
  // 12. FD
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(7.1);
  const [fdYears, setFdYears] = useState(5);
  // 13. RD
  const [rdMonthly, setRdMonthly] = useState(2000);
  const [rdRate, setRdRate] = useState(7.0);
  const [rdYears, setRdYears] = useState(3);
  // 14. PPF
  const [ppfYearly, setPpfYearly] = useState(150000);
  const [ppfRate] = useState(7.1);
  const [ppfYears] = useState(15);
  // 15. NPS
  const [npsMonthly, setNpsMonthly] = useState(5000);
  const [npsCurrentAge, setNpsCurrentAge] = useState(25);
  const [npsReturnRate, setNpsReturnRate] = useState(10);

  // Math Calculation Generators
  const calculateResult = () => {
    try {
      // 1. PERCENTAGE
      if (toolId === 'percentage-calculator') {
        const val = (percNum * percRate) / 100;
        return {
          title: `${percRate}% of ${percNum}`,
          value: `₹${val.toFixed(2)}`,
          formula: `Formula: (${percNum} × ${percRate}) / 100 = ${val}`,
          details: [
            { label: 'Original Amount', val: `₹${percNum}` },
            { label: 'Percentage Rate', val: `${percRate}%` },
            { label: 'Calculated Value', val: `₹${val.toFixed(2)}` },
            { label: 'Total After Addition (+)', val: `₹${(percNum + val).toFixed(2)}` },
            { label: 'Total After Subtraction (-)', val: `₹${(percNum - val).toFixed(2)}` },
          ],
        };
      }

      // 2. AGE CALCULATOR
      if (toolId === 'age-calculator') {
        const birthDate = new Date(dob);
        const today = new Date();
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        let ageMonths = today.getMonth() - birthDate.getMonth();
        let ageDays = today.getDate() - birthDate.getDate();

        if (ageDays < 0) {
          ageMonths -= 1;
          ageDays += 30;
        }
        if (ageMonths < 0) {
          ageYears -= 1;
          ageMonths += 12;
        }

        const totalDiffTime = Math.abs(today - birthDate);
        const totalDays = Math.ceil(totalDiffTime / (1000 * 60 * 60 * 24));
        const totalHours = totalDays * 24;

        return {
          title: 'Your Exact Age',
          value: `${ageYears} Years, ${ageMonths} Months, ${ageDays} Days`,
          formula: `Calculated from Date of Birth: ${dob}`,
          details: [
            { label: 'Age in Years', val: `${ageYears} Years` },
            { label: 'Age in Months', val: `${ageYears * 12 + ageMonths} Months` },
            { label: 'Total Days Lived', val: `${totalDays.toLocaleString()} Days` },
            { label: 'Total Hours Lived', val: `${totalHours.toLocaleString()} Hours` },
          ],
        };
      }

      // 3. DATE CALCULATOR
      if (toolId === 'date-calculator') {
        const d1 = new Date(startDate);
        const d2 = new Date(endDate);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const weeks = Math.floor(diffDays / 7);

        return {
          title: 'Duration Between Dates',
          value: `${diffDays} Days`,
          formula: `Days difference between ${startDate} and ${endDate}`,
          details: [
            { label: 'Total Days', val: `${diffDays} Days` },
            { label: 'Weeks & Days', val: `${weeks} Weeks, ${diffDays % 7} Days` },
            { label: 'Start Date', val: startDate },
            { label: 'End Date', val: endDate },
          ],
        };
      }

      // 4. EMI CALCULATOR
      if (toolId === 'emi-calculator') {
        const p = loanAmount;
        const r = loanInterest / 12 / 100;
        const n = loanTenureYears * 12;
        const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayment = emi * n;
        const totalInterest = totalPayment - p;

        return {
          title: 'Monthly EMI Payable',
          value: `₹${Math.round(emi).toLocaleString()}`,
          formula: `Formula: EMI = [P x R x (1+R)^N]/[(1+R)^N-1]`,
          details: [
            { label: 'Monthly EMI', val: `₹${Math.round(emi).toLocaleString()}` },
            { label: 'Principal Loan Amount', val: `₹${p.toLocaleString()}` },
            { label: 'Total Interest Payable', val: `₹${Math.round(totalInterest).toLocaleString()}` },
            { label: 'Total Amount Payable', val: `₹${Math.round(totalPayment).toLocaleString()}` },
          ],
        };
      }

      // 5. GST CALCULATOR
      if (toolId === 'gst-calculator') {
        const amount = gstAmount;
        const rate = gstRate;
        let netAmount, gstVal, totalAmount;

        if (gstType === 'exclusive') {
          gstVal = (amount * rate) / 100;
          netAmount = amount;
          totalAmount = amount + gstVal;
        } else {
          totalAmount = amount;
          netAmount = (amount * 100) / (100 + rate);
          gstVal = totalAmount - netAmount;
        }

        return {
          title: 'GST Amount Calculated',
          value: `₹${gstVal.toFixed(2)}`,
          formula: gstType === 'exclusive' ? `Exclusive GST: Amount + ${rate}% GST` : `Inclusive GST: Amount contains ${rate}% GST`,
          details: [
            { label: 'Net Amount', val: `₹${netAmount.toFixed(2)}` },
            { label: 'CGST (Half)', val: `₹${(gstVal / 2).toFixed(2)}` },
            { label: 'SGST (Half)', val: `₹${(gstVal / 2).toFixed(2)}` },
            { label: 'Total GST Amount', val: `₹${gstVal.toFixed(2)}` },
            { label: 'Gross Total Amount', val: `₹${totalAmount.toFixed(2)}` },
          ],
        };
      }

      // 6. PROFIT & LOSS CALCULATOR
      if (toolId === 'profit-loss-calculator') {
        const cp = costPrice;
        const sp = sellingPrice;
        const diff = sp - cp;
        const isProfit = diff >= 0;
        const perc = cp > 0 ? (Math.abs(diff) / cp) * 100 : 0;

        return {
          title: isProfit ? 'Profit Gained' : 'Loss Incurred',
          value: `₹${Math.abs(diff).toFixed(2)} (${perc.toFixed(2)}%)`,
          formula: isProfit ? `Profit = Selling Price (${sp}) - Cost Price (${cp})` : `Loss = Cost Price (${cp}) - Selling Price (${sp})`,
          details: [
            { label: 'Cost Price (CP)', val: `₹${cp}` },
            { label: 'Selling Price (SP)', val: `₹${sp}` },
            { label: 'Result Type', val: isProfit ? 'PROFIT ✅' : 'LOSS ⚠️' },
            { label: 'Amount', val: `₹${Math.abs(diff).toFixed(2)}` },
            { label: 'Percentage', val: `${perc.toFixed(2)}%` },
          ],
        };
      }

      // 7. SIMPLE INTEREST CALCULATOR
      if (toolId === 'simple-interest-calculator') {
        const p = siPrincipal;
        const r = siRate;
        const t = siTime;
        const interest = (p * r * t) / 100;
        const total = p + interest;

        return {
          title: 'Simple Interest Earned',
          value: `₹${interest.toFixed(2)}`,
          formula: `Formula: Interest = (P × R × T) / 100`,
          details: [
            { label: 'Principal Amount (P)', val: `₹${p.toLocaleString()}` },
            { label: 'Annual Interest Rate (R)', val: `${r}%` },
            { label: 'Time Period (T)', val: `${t} Years` },
            { label: 'Total Interest Earned', val: `₹${interest.toLocaleString()}` },
            { label: 'Total Amount Payable', val: `₹${total.toLocaleString()}` },
          ],
        };
      }

      // 8. COMPOUND INTEREST CALCULATOR
      if (toolId === 'compound-interest-calculator') {
        const p = ciPrincipal;
        const r = ciRate / 100;
        const t = ciTime;
        const n = ciFrequency;
        const amount = p * Math.pow(1 + r / n, n * t);
        const interest = amount - p;

        return {
          title: 'Compound Interest Earned',
          value: `₹${Math.round(interest).toLocaleString()}`,
          formula: `Formula: A = P(1 + r/n)^(nt)`,
          details: [
            { label: 'Principal Amount', val: `₹${p.toLocaleString()}` },
            { label: 'Interest Rate', val: `${ciRate}%` },
            { label: 'Compounding Frequency', val: n === 12 ? 'Monthly' : n === 4 ? 'Quarterly' : 'Yearly' },
            { label: 'Total Compound Interest', val: `₹${Math.round(interest).toLocaleString()}` },
            { label: 'Final Maturity Value', val: `₹${Math.round(amount).toLocaleString()}` },
          ],
        };
      }

      // 9. SIP CALCULATOR
      if (toolId === 'sip-calculator') {
        const i = sipMonthly;
        const r = sipRate / 12 / 100;
        const n = sipYears * 12;
        const totalInvested = i * n;
        const maturityValue = i * (Math.pow(1 + r, n) - 1) * (1 + r) / r;
        const estimatedReturns = maturityValue - totalInvested;

        return {
          title: 'SIP Expected Maturity Value',
          value: `₹${Math.round(maturityValue).toLocaleString()}`,
          formula: `Formula: M = P × ({[1 + i]^n - 1} / i) × (1 + i)`,
          details: [
            { label: 'Monthly SIP Investment', val: `₹${i.toLocaleString()}` },
            { label: 'Total Amount Invested', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Estimated Wealth Gained', val: `₹${Math.round(estimatedReturns).toLocaleString()}` },
            { label: 'Total Expected Corpus', val: `₹${Math.round(maturityValue).toLocaleString()}` },
          ],
        };
      }

      // 10. SWP CALCULATOR
      if (toolId === 'swp-calculator') {
        const totalInvested = swpInvestment;
        const monthlyDraw = swpWithdrawal;
        const r = swpRate / 12 / 100;
        const n = swpYears * 12;

        let balance = totalInvested;
        let totalWithdrawn = 0;

        for (let k = 0; k < n; k++) {
          balance += balance * r;
          balance -= monthlyDraw;
          totalWithdrawn += monthlyDraw;
        }

        return {
          title: 'Total Withdrawn Value',
          value: `₹${totalWithdrawn.toLocaleString()}`,
          formula: `SWP Monthly Withdrawal for ${swpYears} Years`,
          details: [
            { label: 'Initial Investment', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Monthly Withdrawal', val: `₹${monthlyDraw.toLocaleString()}` },
            { label: 'Total Amount Withdrawn', val: `₹${totalWithdrawn.toLocaleString()}` },
            { label: 'Remaining Balance', val: `₹${Math.max(0, Math.round(balance)).toLocaleString()}` },
          ],
        };
      }

      // 11. LUMPSUM CALCULATOR
      if (toolId === 'lumpsum-calculator') {
        const p = lumpAmount;
        const r = lumpRate / 100;
        const n = lumpYears;
        const maturity = p * Math.pow(1 + r, n);
        const returns = maturity - p;

        return {
          title: 'Total Maturity Wealth',
          value: `₹${Math.round(maturity).toLocaleString()}`,
          formula: `Formula: A = P(1 + r)^n`,
          details: [
            { label: 'Initial Investment', val: `₹${p.toLocaleString()}` },
            { label: 'Estimated Returns', val: `₹${Math.round(returns).toLocaleString()}` },
            { label: 'Total Wealth Value', val: `₹${Math.round(maturity).toLocaleString()}` },
          ],
        };
      }

      // 12. FD CALCULATOR
      if (toolId === 'fd-calculator') {
        const p = fdPrincipal;
        const r = fdRate / 100;
        const t = fdYears;
        const maturity = p * Math.pow(1 + r / 4, 4 * t);
        const interest = maturity - p;

        return {
          title: 'FD Maturity Value',
          value: `₹${Math.round(maturity).toLocaleString()}`,
          formula: `Quarterly Compounded FD Calculation`,
          details: [
            { label: 'Principal Deposit', val: `₹${p.toLocaleString()}` },
            { label: 'Interest Rate', val: `${fdRate}%` },
            { label: 'Total Interest Earned', val: `₹${Math.round(interest).toLocaleString()}` },
            { label: 'Total Maturity Value', val: `₹${Math.round(maturity).toLocaleString()}` },
          ],
        };
      }

      // 13. RD CALCULATOR
      if (toolId === 'rd-calculator') {
        const p = rdMonthly;
        const r = rdRate / 100;
        const n = rdYears * 12;
        const totalInvested = p * n;

        let maturity = 0;
        for (let j = 1; j <= n; j++) {
          maturity += p * Math.pow(1 + r / 4, (4 * (n - j + 1)) / 12);
        }
        const interest = maturity - totalInvested;

        return {
          title: 'RD Maturity Value',
          value: `₹${Math.round(maturity).toLocaleString()}`,
          formula: `Recurring Deposit Compound Calculation`,
          details: [
            { label: 'Monthly Installment', val: `₹${p.toLocaleString()}` },
            { label: 'Total Amount Invested', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Total Interest Earned', val: `₹${Math.round(interest).toLocaleString()}` },
            { label: 'Total Maturity Value', val: `₹${Math.round(maturity).toLocaleString()}` },
          ],
        };
      }

      // 14. PPF CALCULATOR
      if (toolId === 'ppf-calculator') {
        const p = ppfYearly;
        const r = ppfRate / 100;
        const n = ppfYears;
        const totalInvested = p * n;

        let balance = 0;
        for (let k = 0; k < n; k++) {
          balance = (balance + p) * (1 + r);
        }
        const interest = balance - totalInvested;

        return {
          title: 'PPF 15-Year Maturity Value',
          value: `₹${Math.round(balance).toLocaleString()}`,
          formula: `Government PPF Scheme @ 7.1% Compound Interest`,
          details: [
            { label: 'Yearly Contribution', val: `₹${p.toLocaleString()}` },
            { label: 'Total Invested (15 Yrs)', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Total Interest Earned', val: `₹${Math.round(interest).toLocaleString()}` },
            { label: 'Total Tax-Free Maturity', val: `₹${Math.round(balance).toLocaleString()}` },
          ],
        };
      }

      // 15. NPS CALCULATOR
      if (toolId === 'nps-calculator') {
        const monthly = npsMonthly;
        const years = Math.max(1, 60 - npsCurrentAge);
        const r = npsReturnRate / 12 / 100;
        const n = years * 12;
        const totalInvested = monthly * n;
        const corpus = monthly * (Math.pow(1 + r, n) - 1) * (1 + r) / r;

        // 60% Lump sum tax free, 40% Annuity for pension
        const annuityCorpus = corpus * 0.4;
        const monthlyPension = (annuityCorpus * 0.06) / 12;

        return {
          title: 'Expected Pension Corpus',
          value: `₹${Math.round(corpus).toLocaleString()}`,
          formula: `NPS Accumulation till Age 60 (${years} Years)`,
          details: [
            { label: 'Monthly Contribution', val: `₹${monthly.toLocaleString()}` },
            { label: 'Total Amount Invested', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Estimated Retirement Corpus', val: `₹${Math.round(corpus).toLocaleString()}` },
            { label: 'Estimated Monthly Pension', val: `₹${Math.round(monthlyPension).toLocaleString()}` },
          ],
        };
      }

      return null;
    } catch (e) {
      console.error('Calculator error:', e);
      return null;
    }
  };

  const result = calculateResult();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title={`${toolTitle} – 100% Free Online Calculator | WevePrint`}
        description={toolDescription}
        canonicalUrl={`https://weveprint.netlify.app/tools/${toolId}`}
      />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-between">
        
        {/* Header */}
        <div className="space-y-4">
          <Link
            to="/tools"
            className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </Link>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-extrabold shadow-sm">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>100% Client-Side Calculator</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {toolTitle}
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              {toolDescription}
            </p>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start my-6">
          
          {/* Left Inputs Panel */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-extrabold text-white flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-cyan-400" />
              <span>Enter Values</span>
            </h2>

            {/* Inputs based on Tool ID */}
            <div className="space-y-4">
              
              {/* 1. Percentage */}
              {toolId === 'percentage-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Percentage Rate (%):</label>
                    <input
                      type="number"
                      value={percRate}
                      onChange={(e) => setPercRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Total Number / Amount (₹):</label>
                    <input
                      type="number"
                      value={percNum}
                      onChange={(e) => setPercNum(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 2. Age */}
              {toolId === 'age-calculator' && (
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Date of Birth:</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              )}

              {/* 3. Date */}
              {toolId === 'date-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Start Date:</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">End Date:</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 4. EMI */}
              {toolId === 'emi-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Loan Amount (₹):</label>
                    <input
                      type="number"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Interest Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanInterest}
                      onChange={(e) => setLoanInterest(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tenure (Years):</label>
                    <input
                      type="number"
                      value={loanTenureYears}
                      onChange={(e) => setLoanTenureYears(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 5. GST */}
              {toolId === 'gst-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Amount (₹):</label>
                    <input
                      type="number"
                      value={gstAmount}
                      onChange={(e) => setGstAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">GST Rate (%):</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(parseFloat(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    >
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">GST Type:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setGstType('exclusive')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          gstType === 'exclusive'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        GST Exclusive (+)
                      </button>
                      <button
                        onClick={() => setGstType('inclusive')}
                        className={`py-2 rounded-xl text-xs font-bold border ${
                          gstType === 'inclusive'
                            ? 'bg-cyan-950 border-cyan-500 text-cyan-400'
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        GST Inclusive (-)
                      </button>
                    </div>
                  </div>
                </>
              )}

              {/* 6. Profit & Loss */}
              {toolId === 'profit-loss-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Cost Price (CP ₹):</label>
                    <input
                      type="number"
                      value={costPrice}
                      onChange={(e) => setCostPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Selling Price (SP ₹):</label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={(e) => setSellingPrice(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 7. Simple Interest */}
              {toolId === 'simple-interest-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Principal Amount (₹):</label>
                    <input
                      type="number"
                      value={siPrincipal}
                      onChange={(e) => setSiPrincipal(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Annual Interest Rate (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={siRate}
                      onChange={(e) => setSiRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Time Period (Years):</label>
                    <input
                      type="number"
                      value={siTime}
                      onChange={(e) => setSiTime(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 9. SIP Calculator */}
              {toolId === 'sip-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Investment (₹):</label>
                    <input
                      type="number"
                      value={sipMonthly}
                      onChange={(e) => setSipMonthly(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expected Return Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sipRate}
                      onChange={(e) => setSipRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Time Period (Years):</label>
                    <input
                      type="number"
                      value={sipYears}
                      onChange={(e) => setSipYears(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* General Fallback Inputs */}
              {!['percentage-calculator', 'age-calculator', 'date-calculator', 'emi-calculator', 'gst-calculator', 'profit-loss-calculator', 'simple-interest-calculator', 'sip-calculator'].includes(toolId) && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Investment / Principal Amount (₹):</label>
                    <input
                      type="number"
                      value={lumpAmount}
                      onChange={(e) => setLumpAmount(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expected Rate of Return (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lumpRate}
                      onChange={(e) => setLumpRate(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tenure (Years):</label>
                    <input
                      type="number"
                      value={lumpYears}
                      onChange={(e) => setLumpYears(parseFloat(e.target.value) || 0)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

            </div>
          </div>

          {/* Right Results Panel */}
          <div className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <h2 className="text-lg font-extrabold text-white">Calculation Result</h2>

            {result ? (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 text-center space-y-2 shadow-xl">
                  <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-wider block">
                    {result.title}
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {result.value}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {result.formula}
                  </p>
                </div>

                <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                    Detailed Breakdown
                  </h4>
                  <div className="divide-y divide-slate-800/60 space-y-2">
                    {result.details.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs pt-2">
                        <span className="text-slate-400 font-medium">{item.label}</span>
                        <span className="font-extrabold text-white font-mono">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                Enter valid inputs on the left to calculate results.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2 pt-4">
          <CalculatorBottomAd />
        </div>
      </main>
    </div>
  );
}
