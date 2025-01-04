export const PASTEL_COLORS = [
  '#8B5CF6', // Vivid Purple
  '#D946EF', // Magenta Pink
  '#F97316', // Bright Orange
  '#0EA5E9', // Ocean Blue
  '#6366F1', // Indigo
  '#EC4899', // Pink
  '#F59E0B', // Amber
  '#10B981', // Emerald
];

export const getGradientDefinitions = (debts: any[]) => (
  debts.map((_, index) => ({
    id: `gradient-${index}`,
    startColor: PASTEL_COLORS[index % PASTEL_COLORS.length],
    endColor: PASTEL_COLORS[index % PASTEL_COLORS.length],
    opacity: { start: 0.8, end: 0.3 }
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
    stroke: '#666666',
    fill: '#333333',
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