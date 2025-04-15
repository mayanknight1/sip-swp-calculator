import React from 'react';
import Calculator from './components/Calculator';
import './styles/styles.css';

function App() {
  return (
    <div className="calculator-container">
      <div className="calculator-card">
        <h1 className="title">SIP and SWP Calculator</h1>
        <Calculator />
      </div>
    </div>
  );
}

export default App;