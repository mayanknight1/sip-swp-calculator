import React, { useEffect } from 'react';
import Calculator from './components/Calculator';
import { useTheme } from './ThemeContext';

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
    </div>
  );
}

export default App;