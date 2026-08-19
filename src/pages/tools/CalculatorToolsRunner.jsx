import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import SeoHead from '../../components/SeoHead';
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
  // Helper to prevent leading zeroes (e.g. typing "5" when "0" was there results in "5", not "05")
  const createNumHandler = (setter) => (e) => {
    let raw = e.target.value;
    if (raw === '') {
      setter('');
      return;
    }
    // Strip leading zeroes if followed by integer digits (e.g. "05" -> "5", "00" -> "0")
    if (raw.length > 1 && raw.startsWith('0') && !raw.startsWith('0.')) {
      raw = raw.replace(/^0+/, '');
      if (raw === '') raw = '0';
    }
    setter(raw);
  };

  // 1. Percentage
  const [percNum, setPercNum] = useState('250');
  const [percRate, setPercRate] = useState('15');
  // 2. Age
  const [dob, setDob] = useState('1998-05-15');
  // 3. Date
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-12-31');
  // 4. EMI
  const [loanAmount, setLoanAmount] = useState('500000');
  const [loanInterest, setLoanInterest] = useState('9.5');
  const [loanTenureYears, setLoanTenureYears] = useState('5');
  // 5. GST
  const [gstAmount, setGstAmount] = useState('1000');
  const [gstRate, setGstRate] = useState('18');
  const [gstType, setGstType] = useState('exclusive'); // 'exclusive' | 'inclusive'
  // 6. Profit & Loss
  const [costPrice, setCostPrice] = useState('800');
  const [sellingPrice, setSellingPrice] = useState('1000');
  // 7. Simple Interest
  const [siPrincipal, setSiPrincipal] = useState('100000');
  const [siRate, setSiRate] = useState('8');
  const [siTime, setSiTime] = useState('3');
  // 8. Compound Interest
  const [ciPrincipal, setCiPrincipal] = useState('100000');
  const [ciRate, setCiRate] = useState('8');
  const [ciTime, setCiTime] = useState('3');
  const [ciFrequency, setCiFrequency] = useState('1'); // '1' yearly, '4' quarterly, '12' monthly
  // 9. SIP
  const [sipMonthly, setSipMonthly] = useState('5000');
  const [sipRate, setSipRate] = useState('12');
  const [sipYears, setSipYears] = useState('10');
  // 10. SWP
  const [swpInvestment, setSwpInvestment] = useState('1000000');
  const [swpWithdrawal, setSwpWithdrawal] = useState('8000');
  const [swpRate, setSwpRate] = useState('8');
  const [swpYears, setSwpYears] = useState('10');
  // 11. Lumpsum
  const [lumpAmount, setLumpAmount] = useState('100000');
  const [lumpRate, setLumpRate] = useState('12');
  const [lumpYears, setLumpYears] = useState('10');
  // 12. FD
  const [fdPrincipal, setFdPrincipal] = useState('100000');
  const [fdRate, setFdRate] = useState('7.1');
  const [fdYears, setFdYears] = useState('5');
  // 13. RD
  const [rdMonthly, setRdMonthly] = useState('2000');
  const [rdRate, setRdRate] = useState('7.0');
  const [rdYears, setRdYears] = useState('3');
  // 14. PPF
  const [ppfYearly, setPpfYearly] = useState('150000');
  // 15. NPS
  const [npsMonthly, setNpsMonthly] = useState('5000');
  const [npsCurrentAge, setNpsCurrentAge] = useState('25');
  const [npsReturnRate, setNpsReturnRate] = useState('10');

  // Math Calculation Logic
  const calculateResult = () => {
    try {
      // 1. PERCENTAGE
      if (toolId === 'percentage-calculator') {
        const num = parseFloat(percNum) || 0;
        const rate = parseFloat(percRate) || 0;
        const val = (num * rate) / 100;
        return {
          title: `${rate}% of ${num}`,
          value: `₹${val.toFixed(2)}`,
          formula: `Formula: (${num} × ${rate}) / 100 = ${val}`,
          details: [
            { label: 'Original Amount', val: `₹${num}` },
            { label: 'Percentage Rate', val: `${rate}%` },
            { label: 'Calculated Value', val: `₹${val.toFixed(2)}` },
            { label: 'Total After Addition (+)', val: `₹${(num + val).toFixed(2)}` },
            { label: 'Total After Subtraction (-)', val: `₹${(num - val).toFixed(2)}` },
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
        const p = parseFloat(loanAmount) || 0;
        const r = (parseFloat(loanInterest) || 0) / 12 / 100;
        const n = (parseFloat(loanTenureYears) || 0) * 12;
        const emi = n > 0 && r > 0 ? (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 0;
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
        const amount = parseFloat(gstAmount) || 0;
        const rate = parseFloat(gstRate) || 0;
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
        const cp = parseFloat(costPrice) || 0;
        const sp = parseFloat(sellingPrice) || 0;
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
        const p = parseFloat(siPrincipal) || 0;
        const r = parseFloat(siRate) || 0;
        const t = parseFloat(siTime) || 0;
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
        const p = parseFloat(ciPrincipal) || 0;
        const r = (parseFloat(ciRate) || 0) / 100;
        const t = parseFloat(ciTime) || 0;
        const n = parseFloat(ciFrequency) || 1;
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
        const i = parseFloat(sipMonthly) || 0;
        const r = (parseFloat(sipRate) || 0) / 12 / 100;
        const n = (parseFloat(sipYears) || 0) * 12;
        const totalInvested = i * n;
        const maturityValue = r > 0 ? (i * (Math.pow(1 + r, n) - 1) * (1 + r)) / r : totalInvested;
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
        const totalInvested = parseFloat(swpInvestment) || 0;
        const monthlyDraw = parseFloat(swpWithdrawal) || 0;
        const r = (parseFloat(swpRate) || 0) / 12 / 100;
        const years = parseFloat(swpYears) || 0;
        const n = years * 12;

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
          formula: `SWP Monthly Withdrawal for ${years} Years`,
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
        const p = parseFloat(lumpAmount) || 0;
        const r = (parseFloat(lumpRate) || 0) / 100;
        const n = parseFloat(lumpYears) || 0;
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
        const p = parseFloat(fdPrincipal) || 0;
        const r = (parseFloat(fdRate) || 0) / 100;
        const t = parseFloat(fdYears) || 0;
        const maturity = p * Math.pow(1 + r / 4, 4 * t);
        const interest = maturity - p;

        return {
          title: 'FD Maturity Value',
          value: `₹${Math.round(maturity).toLocaleString()}`,
          formula: `Quarterly Compounded Bank FD Calculation`,
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
        const p = parseFloat(rdMonthly) || 0;
        const r = (parseFloat(rdRate) || 0) / 100;
        const t = parseFloat(rdYears) || 0;
        const n = t * 12;
        const totalInvested = p * n;

        let maturity = 0;
        for (let j = 1; j <= n; j++) {
          maturity += p * Math.pow(1 + r / 4, (4 * (n - j + 1)) / 12);
        }
        const interest = maturity - totalInvested;

        return {
          title: 'RD Maturity Value',
          value: `₹${Math.round(maturity).toLocaleString()}`,
          formula: `Recurring Deposit Quarterly Compound Calculation`,
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
        const p = parseFloat(ppfYearly) || 0;
        const r = 7.1 / 100; // Govt Fixed PPF Rate
        const n = 15;
        const totalInvested = p * n;

        let balance = 0;
        for (let k = 0; k < n; k++) {
          balance = (balance + p) * (1 + r);
        }
        const interest = balance - totalInvested;

        return {
          title: 'PPF 15-Year Maturity Value',
          value: `₹${Math.round(balance).toLocaleString()}`,
          formula: `Government PPF Scheme @ 7.1% Tax-Free Compound Interest`,
          details: [
            { label: 'Yearly Contribution', val: `₹${p.toLocaleString()}` },
            { label: 'Total Invested (15 Yrs)', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Tax-Free Interest Earned', val: `₹${Math.round(interest).toLocaleString()}` },
            { label: 'Final Maturity Corpus', val: `₹${Math.round(balance).toLocaleString()}` },
          ],
        };
      }

      // 15. NPS CALCULATOR
      if (toolId === 'nps-calculator') {
        const p = parseFloat(npsMonthly) || 0;
        const age = parseFloat(npsCurrentAge) || 25;
        const r = (parseFloat(npsReturnRate) || 10) / 12 / 100;
        const years = Math.max(1, 60 - age);
        const n = years * 12;
        const totalInvested = p * n;
        const maturityCorpus = r > 0 ? (p * (Math.pow(1 + r, n) - 1) * (1 + r)) / r : totalInvested;
        const minLumpsum = maturityCorpus * 0.6; // 60% tax free withdrawal
        const annuityCorpus = maturityCorpus * 0.4; // 40% annuity for pension

        return {
          title: 'NPS Retirement Wealth Corpus',
          value: `₹${Math.round(maturityCorpus).toLocaleString()}`,
          formula: `National Pension System (Age ${age} to 60 Years)`,
          details: [
            { label: 'Monthly Contribution', val: `₹${p.toLocaleString()}` },
            { label: 'Total Investment Period', val: `${years} Years` },
            { label: 'Total Amount Invested', val: `₹${totalInvested.toLocaleString()}` },
            { label: 'Lumpsum Withdrawal (60%)', val: `₹${Math.round(minLumpsum).toLocaleString()}` },
            { label: 'Annuity Corpus (40%)', val: `₹${Math.round(annuityCorpus).toLocaleString()}` },
            { label: 'Total Pension Corpus', val: `₹${Math.round(maturityCorpus).toLocaleString()}` },
          ],
        };
      }

      // Fallback
      return {
        title: 'Calculator Result',
        value: '₹0',
        formula: 'Formula Result',
        details: [],
      };
    } catch (err) {
      return {
        title: 'Calculation Error',
        value: '₹0',
        formula: 'Invalid input parameters',
        details: [],
      };
    }
  };

  const result = calculateResult();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <SeoHead
        title={`${toolTitle} – Free Online Financial Calculator | WevePrint`}
        description={toolDescription}
        canonicalUrl={`https://weveprint.netlify.app/tools/${toolId}`}
      />
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Header Navigation */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <Link
            to="/tools"
            className="inline-flex items-center space-x-2 text-xs font-extrabold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Tools</span>
          </Link>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
            100% Client-Side Calculator
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Financial &amp; Math Utility</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            {toolTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {toolDescription}
          </p>
        </div>

        {/* Workspace: Inputs & Live Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
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
                      onChange={createNumHandler(setPercRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Total Number / Amount (₹):</label>
                    <input
                      type="number"
                      value={percNum}
                      onChange={createNumHandler(setPercNum)}
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
                      onChange={createNumHandler(setLoanAmount)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Interest Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={loanInterest}
                      onChange={createNumHandler(setLoanInterest)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tenure (Years):</label>
                    <input
                      type="number"
                      value={loanTenureYears}
                      onChange={createNumHandler(setLoanTenureYears)}
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
                      onChange={createNumHandler(setGstAmount)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">GST Rate (%):</label>
                    <select
                      value={gstRate}
                      onChange={(e) => setGstRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
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
                      onChange={createNumHandler(setCostPrice)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Selling Price (SP ₹):</label>
                    <input
                      type="number"
                      value={sellingPrice}
                      onChange={createNumHandler(setSellingPrice)}
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
                      onChange={createNumHandler(setSiPrincipal)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Annual Interest Rate (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={siRate}
                      onChange={createNumHandler(setSiRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Time Period (Years):</label>
                    <input
                      type="number"
                      value={siTime}
                      onChange={createNumHandler(setSiTime)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 8. Compound Interest */}
              {toolId === 'compound-interest-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Principal Amount (₹):</label>
                    <input
                      type="number"
                      value={ciPrincipal}
                      onChange={createNumHandler(setCiPrincipal)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Annual Interest Rate (%):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={ciRate}
                      onChange={createNumHandler(setCiRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Time Period (Years):</label>
                    <input
                      type="number"
                      value={ciTime}
                      onChange={createNumHandler(setCiTime)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Compounding Frequency:</label>
                    <select
                      value={ciFrequency}
                      onChange={(e) => setCiFrequency(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    >
                      <option value="1">Yearly (1/Yr)</option>
                      <option value="4">Quarterly (4/Yr)</option>
                      <option value="12">Monthly (12/Yr)</option>
                    </select>
                  </div>
                </>
              )}

              {/* 9. SIP */}
              {toolId === 'sip-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Investment (₹):</label>
                    <input
                      type="number"
                      value={sipMonthly}
                      onChange={createNumHandler(setSipMonthly)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expected Return Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={sipRate}
                      onChange={createNumHandler(setSipRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Time Period (Years):</label>
                    <input
                      type="number"
                      value={sipYears}
                      onChange={createNumHandler(setSipYears)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 10. SWP */}
              {toolId === 'swp-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Total Investment Corpus (₹):</label>
                    <input
                      type="number"
                      value={swpInvestment}
                      onChange={createNumHandler(setSwpInvestment)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Withdrawal Amount (₹):</label>
                    <input
                      type="number"
                      value={swpWithdrawal}
                      onChange={createNumHandler(setSwpWithdrawal)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expected Return Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={swpRate}
                      onChange={createNumHandler(setSwpRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tenure (Years):</label>
                    <input
                      type="number"
                      value={swpYears}
                      onChange={createNumHandler(setSwpYears)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 11. Lumpsum */}
              {toolId === 'lumpsum-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">One-time Investment (₹):</label>
                    <input
                      type="number"
                      value={lumpAmount}
                      onChange={createNumHandler(setLumpAmount)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expected Return Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={lumpRate}
                      onChange={createNumHandler(setLumpRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Time Period (Years):</label>
                    <input
                      type="number"
                      value={lumpYears}
                      onChange={createNumHandler(setLumpYears)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 12. FD Calculator */}
              {toolId === 'fd-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Total Principal Deposit (₹):</label>
                    <input
                      type="number"
                      value={fdPrincipal}
                      onChange={createNumHandler(setFdPrincipal)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Interest Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={fdRate}
                      onChange={createNumHandler(setFdRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tenure (Years):</label>
                    <input
                      type="number"
                      value={fdYears}
                      onChange={createNumHandler(setFdYears)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 13. RD Calculator */}
              {toolId === 'rd-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Installment (₹):</label>
                    <input
                      type="number"
                      value={rdMonthly}
                      onChange={createNumHandler(setRdMonthly)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Interest Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={rdRate}
                      onChange={createNumHandler(setRdRate)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Tenure (Years):</label>
                    <input
                      type="number"
                      value={rdYears}
                      onChange={createNumHandler(setRdYears)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                </>
              )}

              {/* 14. PPF Calculator */}
              {toolId === 'ppf-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Yearly Contribution (Max ₹1.5 Lakh):</label>
                    <input
                      type="number"
                      value={ppfYearly}
                      onChange={createNumHandler(setPpfYearly)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-semibold">
                    Govt PPF Interest Rate: <strong>7.1% p.a.</strong> (15 Years Lock-in)
                  </div>
                </>
              )}

              {/* 15. NPS Calculator */}
              {toolId === 'nps-calculator' && (
                <>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Monthly Contribution (₹):</label>
                    <input
                      type="number"
                      value={npsMonthly}
                      onChange={createNumHandler(setNpsMonthly)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Current Age (Years):</label>
                    <input
                      type="number"
                      value={npsCurrentAge}
                      onChange={createNumHandler(setNpsCurrentAge)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm focus:border-cyan-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Expected Return Rate (% p.a.):</label>
                    <input
                      type="number"
                      step="0.1"
                      value={npsReturnRate}
                      onChange={createNumHandler(setNpsReturnRate)}
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

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                    Breakdown Summary
                  </h4>
                  <div className="divide-y divide-slate-800/80 border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50">
                    {result.details.map((item, idx) => (
                      <div key={idx} className="flex justify-between px-4 py-3 text-xs font-semibold">
                        <span className="text-slate-400">{item.label}</span>
                        <span className="text-white font-bold">{item.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs font-bold">
                Enter parameters to see calculated results.
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
