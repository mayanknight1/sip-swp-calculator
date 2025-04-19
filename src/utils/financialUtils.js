export const calculateXIRR = (cashflows) => {
  const guess = 0.1;
  const maxIterations = 100;
  const tolerance = 0.00001;
  let rate = guess;

  for (let i = 0; i < maxIterations; i++) {
    const npv = cashflows.reduce((sum, cf) => 
      sum + cf.amount / Math.pow(1 + rate, cf.yearFraction), 0);
    
    if (Math.abs(npv) < tolerance) break;

    const derivativeNPV = cashflows.reduce((sum, cf) => 
      sum - cf.yearFraction * cf.amount / Math.pow(1 + rate, cf.yearFraction + 1), 0);
    
    rate = rate - npv / derivativeNPV;
  }

  return rate * 100;
};

export const generateCashflows = (type, values) => {
  const cashflows = [];
  const { monthlyInvestment, totalInvestment, withdrawalAmount, lumpsumAmount, 
    timePeriod, enableStepUp, stepUpRate } = values;

  switch(type) {
    case 'SIP':
      let currentSIP = monthlyInvestment;
      for (let month = 0; month < timePeriod * 12; month++) {
        if (enableStepUp && month > 0 && month % 12 === 0) {
          currentSIP *= (1 + stepUpRate / 100);
        }
        cashflows.push({
          amount: -currentSIP,
          yearFraction: month / 12
        });
      }
      break;

    case 'SWP':
      let currentWithdrawal = withdrawalAmount;
      cashflows.push({
        amount: -totalInvestment,
        yearFraction: 0
      });
      for (let month = 1; month <= timePeriod * 12; month++) {
        if (enableStepUp && month % 12 === 0) {
          currentWithdrawal *= (1 + stepUpRate / 100);
        }
        cashflows.push({
          amount: currentWithdrawal,
          yearFraction: month / 12
        });
      }
      break;

    case 'LUMPSUM':
      cashflows.push({
        amount: -lumpsumAmount,
        yearFraction: 0
      });
      if (enableStepUp) {
        for (let year = 1; year < timePeriod; year++) {
          const topUp = lumpsumAmount * (stepUpRate / 100);
          cashflows.push({
            amount: -topUp,
            yearFraction: year
          });
        }
      }
      break;

    default:
      break;
  }
  return cashflows;
};