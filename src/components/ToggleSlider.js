import React from 'react';
import { useTheme } from '../ThemeContext';
import './ToggleSlider.css';

const ToggleSlider = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="theme-toggle-wrapper">
      <span className="theme-label">Light</span>
      <label className="toggle-switch">
        <input 
          type="checkbox" 
          checked={isDarkMode} 
          onChange={toggleTheme}
        />
        <span className="slider round"></span>
      </label>
      <span className="theme-label">Dark</span>
    </div>
  );
};

export default ToggleSlider;