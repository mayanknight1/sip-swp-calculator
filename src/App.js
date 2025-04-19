import React, { useEffect } from 'react';
import Calculator from './components/Calculator';
import { useTheme } from './ThemeContext';
import { Analytics } from "@vercel/analytics/react";

function App() {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  return (
    <div className={isDarkMode ? 'dark-mode' : ''}>
      <Calculator />
      <Analytics />
    </div>
  );
}

export default App;