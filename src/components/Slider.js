import React from 'react';

const Slider = ({ label, value, onChange, min, max, step, format }) => {
  const formattedValue = format ? format(value) : value;
  
  return (
    <div className="slider-container">
      <div className="slider-label">
        <label>{label}</label>
        <span>{formattedValue}</span>
      </div>
      <input
        type="range"
        className="custom-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
      />
    </div>
  );
};

export default Slider;