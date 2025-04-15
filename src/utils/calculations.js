export const calculateSIP = (investmentAmount, expectedReturnRate, timePeriod) => {
    const monthlyRate = expectedReturnRate / 12 / 100;
    const totalMonths = timePeriod * 12;
    const futureValue = investmentAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
    return futureValue.toFixed(2);
};

export const calculateSWP = (lumpSumAmount, withdrawalAmount, expectedReturnRate) => {
    const monthlyRate = expectedReturnRate / 12 / 100;
    let months = 0;
    let remainingAmount = lumpSumAmount;

    while (remainingAmount > 0) {
        remainingAmount = remainingAmount * (1 + monthlyRate) - withdrawalAmount;
        months++;
    }

    return months;
};

export const calculateTotalInvested = (investmentAmount, timePeriod) => {
    return (investmentAmount * timePeriod * 12).toFixed(2);
};