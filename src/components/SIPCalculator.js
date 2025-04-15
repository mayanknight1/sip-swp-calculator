import React, { useState } from 'react';

const SIPCalculator = () => {
    const [monthlyInvestment, setMonthlyInvestment] = useState(0);
    const [annualRate, setAnnualRate] = useState(0);
    const [years, setYears] = useState(0);
    const [result, setResult] = useState({ invested: 0, returns: 0, total: 0 });

    const calculateSIP = () => {
        const P = parseFloat(monthlyInvestment);
        const r = parseFloat(annualRate) / 100 / 12; // Monthly interest rate
        const n = 12; // Compounding periods per year
        const t = parseFloat(years);

        const invested = P * n * t;
        const futureValue = P * ((Math.pow(1 + r, n * t) - 1) * (1 + r)) / r;
        const returns = futureValue - invested;

        setResult({ invested, returns, total: futureValue });
    };

    return (
        <div>
            <div className="form-group">
                <label className="form-label">Monthly Investment (₹):</label>
                <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Expected Annual Return Rate (%):</label>
                <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="form-input"
                />
            </div>
            <div className="form-group">
                <label className="form-label">Time Period (Years):</label>
                <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="form-input"
                />
            </div>
            <button onClick={calculateSIP} className="button">
                Calculate
            </button>
            <div className="results">
                <p>Invested Amount: ₹{result.invested.toFixed(2)}</p>
                <p>Estimated Returns: ₹{result.returns.toFixed(2)}</p>
                <p>Total Value: ₹{result.total.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default SIPCalculator;