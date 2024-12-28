export const formatMoneyValue = (value: number, currencySymbol: string, showDecimals: boolean = true): string => {
  console.log('Formatting money value:', { 
    originalValue: value, 
    type: typeof value,
    precision: value.toString()
  });
  
  if (isNaN(value)) {
    console.error('Invalid numeric value:', value);
    return `${currencySymbol}0`;
  }

  try {
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: showDecimals ? 2 : 0,
      maximumFractionDigits: showDecimals ? 2 : 0,
      useGrouping: true,
    }).format(value);

    console.log('Formatted value:', { 
      value,
      formattedValue: `${currencySymbol}${formattedValue}`,
      showDecimals,
      precision: value.toString()
    });

    return `${currencySymbol}${formattedValue}`;
  } catch (error) {
    console.error('Error formatting money value:', error);
    return `${currencySymbol}${value.toString()}`;
  }
};

export const formatInterestRate = (value: number): string => {
  return isNaN(value) ? '0.00%' : value.toFixed(2) + '%';
};