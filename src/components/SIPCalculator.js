import React, { useState } from 'react';

const SIPCalculator = () => {
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [expectedReturnRate, setExpectedReturnRate] = useState('');
    const [timePeriod, setTimePeriod] = useState('');
    const [totalAmount, setTotalAmount] = useState(null);

    const calculateSIP = () => {
        const p = parseFloat(investmentAmount);
        const r = parseFloat(expectedReturnRate) / 100 / 12;
        const n = parseFloat(timePeriod) * 12;

        if (!isNaN(p) && !isNaN(r) && !isNaN(n) && r !== 0) {
            const futureValue = p * (((1 + r) ** n - 1) / r) * (1 + r);
            setTotalAmount(futureValue.toFixed(2));
        } else {
            setTotalAmount(null);
        }
    };

    return (
        <div className="p-4 bg-white rounded shadow-md">
            <h2 className="text-xl font-bold mb-4">SIP Calculator</h2>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Investment Amount</label>
                <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter amount"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Expected Return Rate (%)</label>
                <input
                    type="number"
                    value={expectedReturnRate}
                    onChange={(e) => setExpectedReturnRate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter rate"
                />
            </div>
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Time Period (Years)</label>
                <input
                    type="number"
                    value={timePeriod}
                    onChange={(e) => setTimePeriod(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter years"
                />
            </div>
            <button
                onClick={calculateSIP}
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
                Calculate
            </button>
            {totalAmount !== null && (
                <div className="mt-4 text-lg font-semibold">
                    Total Amount: ₹{totalAmount}
                </div>
            )}
        </div>
    );
};

export default SIPCalculator;