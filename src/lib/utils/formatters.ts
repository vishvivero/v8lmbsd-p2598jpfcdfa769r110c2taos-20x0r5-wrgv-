export const formatMoneyValue = (value: number, currencySymbol: string, showDecimals: boolean = true): string => {
  console.log('Formatting money value:', { 
    originalValue: value, 
    type: typeof value,
    showDecimals 
  });
  
  // Ensure value is treated as a number and handle invalid inputs
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    console.error('Invalid numeric value:', value);
    return `${currencySymbol}0`;
  }

  try {
    // Use maximumFractionDigits: 20 to preserve all decimal places
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
      useGrouping: true, // Keep the thousand separators
    }).format(numericValue);

    console.log('Formatted value:', { 
      numericValue,
      formattedValue: `${currencySymbol}${formattedValue}`,
      showDecimals 
    });

    return `${currencySymbol}${formattedValue}`;
  } catch (error) {
    console.error('Error formatting money value:', error);
    // If formatting fails, return the original value with currency symbol
    return `${currencySymbol}${value}`;
  }
};

export const formatInterestRate = (value: number): string => {
  // Preserve exact interest rate value
  return Number(value).toFixed(2) + '%';
};