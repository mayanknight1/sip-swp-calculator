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
// import Tooltip from './Tooltip'; // Removed duplicate import
import { calculateXIRR } from '../utils/financialUtils'; // Create this utility

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
    stepUpRate: 0,
    enableStepUp: false,
    expectedXIRR: 12,
  });

  const { isDarkMode } = useTheme();

  const isMobile = window.innerWidth <= 768;

  const handleChange = (key, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: value
    }));
  };

  const calculateSIPReturns = () => {
    let totalInvested = 0;
    let futureValue = 0;
    const monthlyRate = values.returnRate / 100 / 12;
    const months = values.timePeriod * 12;
    let currentMonthlyInvestment = values.monthlyInvestment;

    for (let month = 1; month <= months; month++) {
      // Increase investment on yearly anniversary if step-up is enabled
      if (values.enableStepUp && month > 1 && month % 12 === 1) {
        currentMonthlyInvestment *= (1 + values.stepUpRate / 100);
      }

      totalInvested += currentMonthlyInvestment;
      futureValue = (futureValue + currentMonthlyInvestment) * (1 + monthlyRate);
    }

    const returns = futureValue - totalInvested;
    const xirr = calculateXIRR(generateCashflows('SIP', values));

    return { invested: totalInvested, returns, total: futureValue, xirr };
  };

  const calculateSWPReturns = () => {
    let remainingAmount = values.totalInvestment;
    let totalWithdrawn = 0;
    let currentWithdrawal = values.withdrawalAmount;
    const monthlyRate = values.returnRate / 100 / 12;
    const months = values.timePeriod * 12;

    for (let month = 1; month <= months && remainingAmount > 0; month++) {
      if (values.enableStepUp && month > 1 && month % 12 === 1) {
        currentWithdrawal *= (1 + values.stepUpRate / 100);
      }

      remainingAmount = (remainingAmount * (1 + monthlyRate)) - currentWithdrawal;
      totalWithdrawn += currentWithdrawal;
    }

    const xirr = calculateXIRR(generateCashflows('SWP', values));
    const finalValue = Math.max(0, remainingAmount) + totalWithdrawn;

    return {
      withdrawn: totalWithdrawn,
      remaining: Math.max(0, remainingAmount),
      sustainable: remainingAmount > 0,
      xirr,
      total: finalValue
    };
  };

  const calculateLumpsumReturns = () => {
    let principal = values.lumpsumAmount;
    const rate = values.returnRate / 100;
    const time = values.timePeriod;
    let totalInvested = principal;

    // Calculate yearly top-ups if enabled
    if (values.enableStepUp) {
      for (let year = 1; year < time; year++) {
        const topUp = principal * (values.stepUpRate / 100);
        totalInvested += topUp;
        principal += topUp;
      }
    }

    const futureValue = principal * Math.pow(1 + rate, time);
    const returns = futureValue - totalInvested;
    const xirr = calculateXIRR(generateCashflows('LUMPSUM', values));

    return { invested: totalInvested, returns, total: futureValue, xirr };
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

  const getStepUpTooltip = () => {
    const mode = isLumpsum ? 'top-up' : (isSIP ? 'investment' : 'withdrawal');
    return `Your ${mode} will increase by ${values.stepUpRate}% every year on the anniversary month`;
  };

  const results = isLumpsum ? calculateLumpsumReturns() : (isSIP ? calculateSIPReturns() : calculateSWPReturns());

  return (
    <div className="outer-container">
      {!isMobile && <ToggleSlider />} {/* Conditionally render ToggleSlider */}
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
                  min={100}
                  max={200000}
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
              <div className="input-slider-group">
                <div className="step-up-container">
                  <label className={isDarkMode ? 'dark-mode' : ''}>
                    Enable Step-up
                    <input
                      type="checkbox"
                      checked={values.enableStepUp}
                      onChange={(e) => handleChange('enableStepUp', e.target.checked)}
                    />
                  </label>
                  {values.enableStepUp && (
                    <>
                      <label className={isDarkMode ? 'dark-mode' : ''}>
                        Step-up Rate (% per year)
                        <Tooltip content={getStepUpTooltip()} />
                      </label>
                      <input
                        type="number"
                        value={values.stepUpRate}
                        className={isDarkMode ? 'dark-mode' : ''}
                        onChange={(e) => handleChange('stepUpRate', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.5"
                      />
                      <Slider
                        value={values.stepUpRate}
                        onChange={(v) => handleChange('stepUpRate', v)}
                        min={0}
                        max={100}
                        step={0.5}
                      />
                    </>
                  )}
                </div>
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
                  max={200000}
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
              <div className="input-slider-group">
                <div className="step-up-container">
                  <label className={isDarkMode ? 'dark-mode' : ''}>
                    Enable Step-up
                    <input
                      type="checkbox"
                      checked={values.enableStepUp}
                      onChange={(e) => handleChange('enableStepUp', e.target.checked)}
                    />
                  </label>
                  {values.enableStepUp && (
                    <>
                      <label className={isDarkMode ? 'dark-mode' : ''}>
                        Step-up Rate (% per year)
                        <Tooltip content={getStepUpTooltip()} />
                      </label>
                      <input
                        type="number"
                        value={values.stepUpRate}
                        className={isDarkMode ? 'dark-mode' : ''}
                        onChange={(e) => handleChange('stepUpRate', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.5"
                      />
                      <Slider
                        value={values.stepUpRate}
                        onChange={(v) => handleChange('stepUpRate', v)}
                        min={0}
                        max={100}
                        step={0.5}
                      />
                    </>
                  )}
                </div>
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
                  min={100}
                  max={2000000}  // Updated from 200000 to 2000000
                  step={100}
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
                  min={100}      // Updated from 500 to 100
                  max={50000}    // Updated from 500000 to 50000
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
              <div className="input-slider-group">
                <div className="step-up-container">
                  <label className={isDarkMode ? 'dark-mode' : ''}>
                    Enable Step-up
                    <input
                      type="checkbox"
                      checked={values.enableStepUp}
                      onChange={(e) => handleChange('enableStepUp', e.target.checked)}
                    />
                  </label>
                  {values.enableStepUp && (
                    <>
                      <label className={isDarkMode ? 'dark-mode' : ''}>
                        Step-up Rate (% per year)
                        <Tooltip content={getStepUpTooltip()} />
                      </label>
                      <input
                        type="number"
                        value={values.stepUpRate}
                        className={isDarkMode ? 'dark-mode' : ''}
                        onChange={(e) => handleChange('stepUpRate', parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.5"
                      />
                      <Slider
                        value={values.stepUpRate}
                        onChange={(v) => handleChange('stepUpRate', v)}
                        min={0}
                        max={100}
                        step={0.5}
                      />
                    </>
                  )}
                </div>
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
                <div className="result-item xirr-result">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>
                    Effective XIRR:
                  </span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>
                    {results.xirr.toFixed(2)}%
                  </span>
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
                <div className="result-item xirr-result">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>
                    Effective XIRR:
                  </span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>
                    {results.xirr.toFixed(2)}%
                  </span>
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
                <div className="result-item">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>Final Value:</span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>{formatIndianCurrency(results.total)}</span>
                </div>
                <div className="result-item xirr-result">
                  <span className={`result-label ${isDarkMode ? 'dark-mode' : ''}`}>
                    Effective XIRR:
                  </span>
                  <span className={`result-value ${isDarkMode ? 'dark-mode' : ''}`}>
                    {results.xirr.toFixed(2)}%
                  </span>
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