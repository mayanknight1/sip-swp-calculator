import React from 'react';
import Calculator from './components/Calculator';
import { useTheme } from './ThemeContext';

function App() {
    const { isDarkMode } = useTheme();

    return (
        <div className={isDarkMode ? 'dark-mode' : ''}>
            <Calculator />
        </div>
    );
}

export default App;