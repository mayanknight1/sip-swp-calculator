import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Slider from './Slider';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const formatIndianCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
};

const Calculator = () => {
  const [isSIP, setIsSIP] = useState(true);
  const [values, setValues] = useState({
    monthlyInvestment: 25000,
    totalInvestment: 5000000,
    returnRate: 12,
    timePeriod: 10,
    withdrawalAmount: 10000
  });

  const handleChange = (key, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: value
    }));
  };

  const calculateSIPReturns = () => {
    const P = values.monthlyInvestment;
    const r = values.returnRate / 100 / 12;
    const t = values.timePeriod * 12;

    const invested = P * t;
    const futureValue = P * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
    const returns = futureValue - invested;

    return { invested, returns, total: futureValue };
  };

  const calculateSWPReturns = () => {
    const principal = values.totalInvestment;
    const monthlyWithdrawal = values.withdrawalAmount;
    const monthlyRate = values.returnRate / 100 / 12;
    const months = values.timePeriod * 12;

    let remainingAmount = principal;
    let totalWithdrawn = 0;

    for (let i = 0; i < months && remainingAmount > 0; i++) {
      remainingAmount = (remainingAmount * (1 + monthlyRate)) - monthlyWithdrawal;
      totalWithdrawn += monthlyWithdrawal;
    }

    return {
      withdrawn: totalWithdrawn,
      remaining: Math.max(0, remainingAmount),
      sustainable: remainingAmount > 0
    };
  };

  const getChartData = () => {
    if (isSIP) {
      const { invested, returns } = calculateSIPReturns();
      return {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [{
          data: [invested, returns],
          backgroundColor: ['rgba(203, 213, 225, 1)', 'rgba(0, 189, 126, 1)'],
          borderWidth: 0
        }]
      };
    } else {
      const { withdrawn, remaining } = calculateSWPReturns();
      return {
        labels: ['Withdrawn Amount', 'Remaining Amount'],
        datasets: [{
          data: [withdrawn, remaining],
          backgroundColor: ['rgba(239, 68, 68, 1)', 'rgba(0, 189, 126, 1)'],
          borderWidth: 0
        }]
      };
    }
  };

  const results = isSIP ? calculateSIPReturns() : calculateSWPReturns();

  return (
    <div className="outer-container">
      <div className="inner-container">
        {/* Left Side: Calculator */}
        <div className="calculator-container">
          <div className="toggle-container">
            <button
              className={`toggle-button ${isSIP ? 'active' : ''}`}
              onClick={() => setIsSIP(true)}
            >
              SIP
            </button>
            <button
              className={`toggle-button ${!isSIP ? 'active' : ''}`}
              onClick={() => setIsSIP(false)}
            >
              SWP
            </button>
          </div>

          {isSIP ? (
            <div>
              <div className="input-slider-group">
                <label>Monthly Investment</label>
                <input
                  type="number"
                  value={values.monthlyInvestment}
                  onChange={(e) => handleChange('monthlyInvestment', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.monthlyInvestment}
                  onChange={(v) => handleChange('monthlyInvestment', v)}
                  min={100}
                  max={1000000}
                  step={100}
                />
              </div>
              {/* Add other sliders */}
            </div>
          ) : (
            <div>
              {/* SWP Sliders */}
              <div className="input-slider-group">
                <label>Total Investment</label>
                <input
                  type="number"
                  value={values.totalInvestment}
                  onChange={(e) => handleChange('totalInvestment', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.totalInvestment}
                  onChange={(v) => handleChange('totalInvestment', v)}
                  min={10000}
                  max={10000000}
                  step={1000}
                />
              </div>
              {/* Add other sliders */}
            </div>
          )}
        </div>

        {/* Right Side: Chart */}
        <div className="chart-container">
          <Doughnut data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} />
          <div className="results-container">
            {isSIP ? (
              <>
                <div className="result-item">
                  <span className="result-label">Invested Amount:</span>
                  <span className="result-value">{formatIndianCurrency(results.invested)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Est. Returns:</span>
                  <span className="result-value">{formatIndianCurrency(results.returns)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Total Value:</span>
                  <span className="result-value">{formatIndianCurrency(results.total)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="result-item">
                  <span className="result-label">Total Withdrawn:</span>
                  <span className="result-value">{formatIndianCurrency(results.withdrawn)}</span>
                </div>
                <div className="result-item">
                  <span className="result-label">Remaining Amount:</span>
                  <span className="result-value">{formatIndianCurrency(results.remaining)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;