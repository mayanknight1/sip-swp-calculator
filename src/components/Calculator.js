import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import Slider from './Slider';
import { useTheme } from '../ThemeContext';
import ToggleSlider from './ToggleSlider'; // Import the ToggleSlider component

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
  const [isLumpsum, setIsLumpsum] = useState(false);
  const [values, setValues] = useState({
    monthlyInvestment: 25000,
    totalInvestment: 5000000,
    returnRate: 12,
    timePeriod: 10,
    withdrawalAmount: 10000,
    lumpsumAmount: 1000000,
  });

  const { isDarkMode } = useTheme();

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

  const calculateLumpsumReturns = () => {
    const principal = values.lumpsumAmount;
    const rate = values.returnRate / 100;
    const time = values.timePeriod;

    const futureValue = principal * Math.pow(1 + rate, time);
    const returns = futureValue - principal;

    return { invested: principal, returns, total: futureValue };
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

  // Update the getChartData function with contrasting colors
  const getChartData = () => {
    const chartColors = {
      sip: ['#FF6B6B', '#4ECDC4'],     // Red & Teal
      swp: ['#FFE66D', '#6C5CE7'],     // Yellow & Purple
      lumpsum: ['#A8E6CF', '#FF8B94']  // Mint & Coral
    };

    if (isLumpsum) {
      const { invested, returns } = calculateLumpsumReturns();
      return {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [{
          data: [invested, returns],
          backgroundColor: chartColors.lumpsum,
          borderWidth: 0,
          hoverOffset: 4
        }]
      };
    }
    if (isSIP) {
      const { invested, returns } = calculateSIPReturns();
      return {
        labels: ['Invested Amount', 'Est. Returns'],
        datasets: [{
          data: [invested, returns],
          backgroundColor: chartColors.sip,
          borderWidth: 0,
          hoverOffset: 4
        }]
      };
    } else {
      const { withdrawn, remaining } = calculateSWPReturns();
      return {
        labels: ['Withdrawn Amount', 'Remaining Amount'],
        datasets: [{
          data: [withdrawn, remaining],
          backgroundColor: chartColors.swp,
          borderWidth: 0,
          hoverOffset: 4
        }]
      };
    }
  };

  const results = isLumpsum ? calculateLumpsumReturns() : (isSIP ? calculateSIPReturns() : calculateSWPReturns());

  return (
    <div className="outer-container">
      <ToggleSlider />
      <h1 className="main-heading">Sip 'n Swip</h1>
      <div className="inner-container">
        {/* Left Side: Calculator */}
        <div className={`calculator-container ${isDarkMode ? 'dark-mode' : ''}`}>
          <div className="toggle-container">
            <button
              className={`toggle-button ${isSIP && !isLumpsum ? 'active' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              onClick={() => { setIsSIP(true); setIsLumpsum(false); }}
            >
              SIP
            </button>
            <button
              className={`toggle-button ${!isSIP && !isLumpsum ? 'active' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              onClick={() => { setIsSIP(false); setIsLumpsum(false); }}
            >
              SWP
            </button>
            <button
              className={`toggle-button ${isLumpsum ? 'active' : ''} ${isDarkMode ? 'dark-mode' : ''}`}
              onClick={() => { setIsLumpsum(true); setIsSIP(false); }}
            >
              Lumpsum
            </button>
          </div>

          {isLumpsum ? (
            <div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Lumpsum Amount</label>
                <input
                  type="number"
                  value={values.lumpsumAmount}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('lumpsumAmount', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.lumpsumAmount}
                  onChange={(v) => handleChange('lumpsumAmount', v)}
                  min={10000}
                  max={10000000}
                  step={1000}
                />
              </div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Expected Return Rate (p.a.)</label>
                <input
                  type="number"
                  value={values.returnRate}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('returnRate', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.returnRate}
                  onChange={(v) => handleChange('returnRate', v)}
                  min={1}
                  max={50}
                  step={0.1}
                />
              </div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Time Period (Years)</label>
                <input
                  type="number"
                  value={values.timePeriod}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('timePeriod', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.timePeriod}
                  onChange={(v) => handleChange('timePeriod', v)}
                  min={1}
                  max={40}
                  step={1}
                />
              </div>
            </div>
          ) : isSIP ? (
            <div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Monthly Investment</label>
                <input
                  type="number"
                  value={values.monthlyInvestment}
                  className={isDarkMode ? 'dark-mode' : ''}
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
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Expected Return Rate (p.a.)</label>
                <input
                  type="number"
                  value={values.returnRate}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('returnRate', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.returnRate}
                  onChange={(v) => handleChange('returnRate', v)}
                  min={1}
                  max={50}
                  step={0.1}
                />
              </div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Time Period (Years)</label>
                <input
                  type="number"
                  value={values.timePeriod}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('timePeriod', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.timePeriod}
                  onChange={(v) => handleChange('timePeriod', v)}
                  min={1}
                  max={40}
                  step={1}
                />
              </div>
            </div>
          ) : (
            <div>
              {/* SWP Sliders */}
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Total Investment</label>
                <input
                  type="number"
                  value={values.totalInvestment}
                  className={isDarkMode ? 'dark-mode' : ''}
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
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Withdrawal Per Month</label>
                <input
                  type="number"
                  value={values.withdrawalAmount}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('withdrawalAmount', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.withdrawalAmount}
                  onChange={(v) => handleChange('withdrawalAmount', v)}
                  min={500}
                  max={500000}
                  step={100}
                />
              </div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Expected Return Rate (p.a.)</label>
                <input
                  type="number"
                  value={values.returnRate}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('returnRate', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.returnRate}
                  onChange={(v) => handleChange('returnRate', v)}
                  min={1}
                  max={50}
                  step={0.1}
                />
              </div>
              <div className="input-slider-group">
                <label className={isDarkMode ? 'dark-mode' : ''}>Time Period (Years)</label>
                <input
                  type="number"
                  value={values.timePeriod}
                  className={isDarkMode ? 'dark-mode' : ''}
                  onChange={(e) => handleChange('timePeriod', parseFloat(e.target.value))}
                />
                <Slider
                  value={values.timePeriod}
                  onChange={(v) => handleChange('timePeriod', v)}
                  min={1}
                  max={40}
                  step={1}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Chart */}
        <div className={`chart-container ${isDarkMode ? 'dark-mode' : ''}`}>
          <Doughnut 
            data={getChartData()} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 750,
                easing: 'easeInOutQuart'
              },
              hover: {
                animationDuration: 200
              },
              plugins: {
                legend: {
                  labels: {
                    font: {
                      size: window.innerWidth <= 768 ? 12 : 14
                    }
                  }
                }
              }
            }} 
          />
          <div className="results-container">
            {isLumpsum ? (
              <>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Invested Amount:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.invested)}</span>
                </div>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Est. Returns:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.returns)}</span>
                </div>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Total Value:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.total)}</span>
                </div>
              </>
            ) : isSIP ? (
              <>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Invested Amount:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.invested)}</span>
                </div>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Est. Returns:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.returns)}</span>
                </div>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Total Value:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.total)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Total Withdrawn:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.withdrawn)}</span>
                </div>
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Remaining Amount:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.remaining)}</span>
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