export const calculateXIRR = (cashflows) => {
  // Initial guess rate (10%)
  let rate = 0.1;
  const maxIterations = 100;
  const tolerance = 0.000001;

  const getDaysBetweenDates = (date1, date2) => {
    return (date2 - date1) / (1000 * 60 * 60 * 24);
  };

  // Newton-Raphson method
  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let derivative = 0;
    
    for (const cf of cashflows) {
      const t = getDaysBetweenDates(cashflows[0].date, cf.date) / 365;
      const factor = Math.pow(1 + rate, t);
      npv += cf.amount / factor;
      derivative -= t * cf.amount / Math.pow(1 + rate, t + 1);
    }

    // Check if we've reached desired accuracy
    if (Math.abs(npv) < tolerance) {
      return rate * 100; // Convert to percentage
    }

    // Update rate for next iteration
    rate = rate - npv / derivative;

    // Check for non-convergence
    if (rate < -1) return null;
  }

  return null; // Return null if no solution found
};

export const generateCashflows = (type, values) => {
  const cashflows = [];
  const startDate = new Date();

  switch(type) {
    case 'SIP':
      const monthlyInvestment = values.monthlyInvestment;
      for (let month = 0; month < values.timePeriod * 12; month++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + month);
        cashflows.push({
          date,
          amount: -monthlyInvestment
        });
      }
      // Add final value
      const finalSIPDate = new Date(startDate);
      finalSIPDate.setMonth(finalSIPDate.getMonth() + values.timePeriod * 12);
      cashflows.push({
        date: finalSIPDate,
        amount: values.futureValue
      });
      break;

    case 'SWP':
      // Initial investment
      cashflows.push({
        date: startDate,
        amount: -values.totalInvestment
      });

      for (let month = 1; month <= values.timePeriod * 12; month++) {
        const date = new Date(startDate);
        date.setMonth(date.getMonth() + month);
        cashflows.push({
          date,
          amount: values.withdrawalAmount
        });
      }
      break;

    case 'LUMPSUM':
      // Initial investment
      cashflows.push({
        date: startDate,
        amount: -values.lumpsumAmount
      });

      // Final value
      const finalDate = new Date(startDate);
      finalDate.setFullYear(finalDate.getFullYear() + values.timePeriod);
      cashflows.push({
        date: finalDate,
        amount: values.futureValue
      });
      break;
  }

  return cashflows;
};