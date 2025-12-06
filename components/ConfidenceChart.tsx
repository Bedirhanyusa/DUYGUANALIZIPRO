import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { SentimentType } from '../types';

interface ConfidenceChartProps {
  score: number;
  sentiment: SentimentType;
}

const ConfidenceChart: React.FC<ConfidenceChartProps> = ({ score, sentiment }) => {
  // Convert 0-1 score to percentage
  const percentage = Math.round(score * 100);
  
  const getColor = () => {
    if (sentiment === SentimentType.POSITIVE) return '#10b981'; // emerald-500
    if (sentiment === SentimentType.NEGATIVE) return '#ef4444'; // red-500
    return '#64748b'; // slate-500
  };

  const data = [
    {
      name: 'Confidence',
      value: percentage,
      fill: getColor(),
    },
  ];

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
          cx="50%" 
          cy="50%" 
          innerRadius="70%" 
          outerRadius="100%" 
          barSize={15} 
          data={data} 
          startAngle={180} 
          endAngle={0}
        >
          <PolarAngleAxis
            type="number"
            domain={[0, 100]}
            angleAxisId={0}
            tick={false}
          />
          <RadialBar
            background
            dataKey="value"
            cornerRadius={30 / 2}
            fill={getColor()}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/3 text-center">
        <span className="block text-3xl font-bold text-slate-800">
          %{percentage}
        </span>
        <span className="text-xs text-slate-500 uppercase tracking-wide font-medium">
          Güven Skoru
        </span>
      </div>
    </div>
  );
};

export default ConfidenceChart;