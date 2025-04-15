import React, { useState } from 'react';

const SWPCalculator = () => {
    const [initialCorpus, setInitialCorpus] = useState(0);
    const [monthlyWithdrawal, setMonthlyWithdrawal] = useState(0);
    const [annualRate, setAnnualRate] = useState(0);
    const [result, setResult] = useState({ months: 0, remaining: 0 });

    const calculateSWP = () => {
        let corpus = parseFloat(initialCorpus);
        const withdrawal = parseFloat(monthlyWithdrawal);
        const r = parseFloat(annualRate) / 100 / 12; // Monthly interest rate
        let months = 0;

        while (corpus > 0) {
            corpus = corpus + corpus * r - withdrawal;
            if (corpus < 0) break;
            months++;
        }

        setResult({ months, remaining: Math.max(0, corpus) });
    };

    return (
        <div>
            <div className="mb-4">
                <label className="block mb-2">Initial Corpus (₹):</label>
                <input
                    type="number"
                    value={initialCorpus}
                    onChange={(e) => setInitialCorpus(e.target.value)}
                    className="border p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Monthly Withdrawal (₹):</label>
                <input
                    type="number"
                    value={monthlyWithdrawal}
                    onChange={(e) => setMonthlyWithdrawal(e.target.value)}
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
            <button onClick={calculateSWP} className="bg-green-500 text-white px-4 py-2 rounded">
                Calculate
            </button>
            <div className="mt-4">
                <p>Corpus will last for: {result.months} months</p>
                <p>Remaining Corpus: ₹{result.remaining.toFixed(2)}</p>
            </div>
        </div>
    );
};

export default SWPCalculator;