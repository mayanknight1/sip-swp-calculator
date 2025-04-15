import React, { useState } from 'react';
import SIPCalculator from './SIPCalculator';
import SWPCalculator from './SWPCalculator';
import Toggle from './Toggle';

const Calculator = () => {
    const [isSIP, setIsSIP] = useState(true);

    const handleToggle = () => {
        setIsSIP(!isSIP);
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold text-center mb-4">SIP and SWP Calculator</h1>
            <Toggle isSIP={isSIP} onToggle={handleToggle} />
            {isSIP ? <SIPCalculator /> : <SWPCalculator />}
        </div>
    );
};

export default Calculator;