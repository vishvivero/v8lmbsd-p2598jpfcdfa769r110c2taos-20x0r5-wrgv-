export const PASTEL_COLORS = [
  '#D3E4FD', // Soft Blue
  '#F2FCE2', // Soft Green
  '#FEF7CD', // Soft Yellow
  '#FEC6A1', // Soft Orange
  '#E5DEFF', // Soft Purple
  '#FFDEE2', // Soft Pink
  '#FDE1D3', // Soft Peach
  '#F1F0FB', // Soft Gray
];

export const getGradientDefinitions = (debts: any[]) => (
  debts.map((_, index) => ({
    id: `gradient-${index}`,
    startColor: PASTEL_COLORS[index % PASTEL_COLORS.length],
    endColor: PASTEL_COLORS[index % PASTEL_COLORS.length],
    opacity: { start: 0.8, end: 0.2 }
  }))
);

export const chartConfig = {
  margin: { top: 20, right: 30, left: 20, bottom: 20 },
  tooltipStyle: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    border: '1px solid #eee',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    padding: '8px 12px'
  },
  axisStyle: {
    stroke: '#e0e0e0',
    fill: '#666',
    fontSize: 12
  },
  gridStyle: {
    stroke: '#e0e0e0',
    strokeDasharray: '3 3'
  },
  legendStyle: {
    paddingBottom: '20px'
  }
};