interface GradientProps {
  id: string;
  startColor: string;
  endColor: string;
  opacity: {
    start: number;
    end: number;
  };
}

export const ChartGradients = ({ gradients }: { gradients: GradientProps[] }) => {
  return (
    <defs>
      {gradients.map(({ id, startColor, endColor, opacity }) => (
        <linearGradient
          key={id}
          id={id}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="5%"
            stopColor={startColor}
            stopOpacity={opacity.start}
          />
          <stop
            offset="95%"
            stopColor={endColor}
            stopOpacity={opacity.end}
          />
        </linearGradient>
      ))}
    </defs>
  );
};