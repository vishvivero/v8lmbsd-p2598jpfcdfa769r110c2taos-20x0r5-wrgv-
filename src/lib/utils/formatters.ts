export const formatMoneyValue = (value: number, currencySymbol: string, showDecimals: boolean = true): string => {
  console.log('Formatting money value:', { originalValue: value, showDecimals });
  
  // Ensure value is treated as a number
  const numericValue = Number(value);
  if (isNaN(numericValue)) {
    console.error('Invalid numeric value:', value);
    return `${currencySymbol}0`;
  }

  try {
    // Use maximumFractionDigits: 20 to avoid any rounding
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
      useGrouping: true, // This ensures we keep the thousand separators
    }).format(numericValue);

    console.log('Formatted value:', { 
      numericValue,
      formattedValue: `${currencySymbol}${formattedValue}`,
      showDecimals 
    });

    return `${currencySymbol}${formattedValue}`;
  } catch (error) {
    console.error('Error formatting money value:', error);
    return `${currencySymbol}${value}`;
  }
};

export const formatInterestRate = (value: number): string => {
  return value.toFixed(2) + '%';
};