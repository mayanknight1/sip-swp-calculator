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
            <div className="mb-4">
                <label className="block mb-2">Monthly Investment (₹):</label>
                <input
                    type="number"
                    value={monthlyInvestment}
                    onChange={(e) => setMonthlyInvestment(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Expected Annual Return Rate (%):</label>
                <input
                    type="number"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Time Period (Years):</label>
                <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <button onClick={calculateSIP} className="bg-green-500 text-white px-4 py-2 rounded">
                Calculate
            </button>
            <div className="mt-4">
                <p>Invested Amount: ₹{result.invested.toFixed(2)}</p>
                <p>Estimated Returns: ₹{result.returns.toFixed(2)}</p>
                <p>Total Value: ₹{result.total.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default SIPCalculator;