import React from 'react';
import { useTheme } from '../ThemeContext';
import './ToggleSlider.css'; // Import the CSS file

const ToggleSlider = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <label className="toggle-switch">
      <input type="checkbox" checked={isDarkMode} onChange={toggleTheme} />
      <span className="slider round">
        <span className="light-mode">Light</span>
        <span className="dark-mode">Dark</span>
      </span>
    </label>
  );
};

export default ToggleSlider;