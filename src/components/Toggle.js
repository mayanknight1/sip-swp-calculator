import React, { useState } from 'react';

const Toggle = ({ onToggle }) => {
    const [isSIP, setIsSIP] = useState(true);

    const handleToggle = () => {
        setIsSIP(!isSIP);
        onToggle(!isSIP);
    };

    return (
        <div className="flex items-center justify-center space-x-4">
            <button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-lg ${isSIP ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
                SIP
            </button>
            <button
                onClick={handleToggle}
                className={`px-4 py-2 rounded-lg ${!isSIP ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
                Lumpsum
            </button>
        </div>
    );
};

export default Toggle;