import React, { useState } from 'react';

const SWPCalculator = () => {
    const [lumpSum, setLumpSum] = useState('');
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [expectedReturn, setExpectedReturn] = useState('');
    const [duration, setDuration] = useState(null);

    const calculateDuration = () => {
        const principal = parseFloat(lumpSum);
        const withdrawal = parseFloat(withdrawalAmount);
        const rate = parseFloat(expectedReturn) / 100 / 12;

        if (principal && withdrawal && rate) {
            let months = 0;
            let currentAmount = principal;

            while (currentAmount > 0) {
                currentAmount = currentAmount * (1 + rate) - withdrawal;
                months++;
            }

            setDuration(months);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">SWP Calculator</h2>
            <div className="mb-4">
                <label className="block mb-2">Lump Sum Investment:</label>
                <input
                    type="number"
                    value={lumpSum}
                    onChange={(e) => setLumpSum(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Monthly Withdrawal Amount:</label>
                <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Expected Annual Return Rate (%):</label>
                <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(e.target.value)}
                    className="border rounded p-2 w-full"
                />
            </div>
            <button
                onClick={calculateDuration}
                className="bg-blue-500 text-white rounded p-2"
            >
                Calculate Duration
            </button>
            {duration !== null && (
                <div className="mt-4">
                    <h3 className="text-lg">Duration of Corpus: {duration} months</h3>
                </div>
            )}
        </div>
    );
};

export default SWPCalculator;