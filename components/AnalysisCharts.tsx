import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Cell,
  LabelList
} from 'recharts';
import { SentimentType, SentimentDistribution } from '../types';

interface AnalysisChartsProps {
  confidence: number;
  distribution: SentimentDistribution;
  sentiment: SentimentType;
}

const AnalysisCharts: React.FC<AnalysisChartsProps> = ({ confidence, distribution, sentiment }) => {
  
  // Data prep for scientific chart
  const data = [
    {
      name: 'Pozitif',
      score: distribution.positive,
      fill: distribution.positive > distribution.negative ? '#10b981' : '#cbd5e1', // Highlight winner
    },
    {
      name: 'Negatif',
      score: distribution.negative,
      fill: distribution.negative > distribution.positive ? '#ef4444' : '#cbd5e1', // Highlight winner
    },
  ];

  const formatYAxis = (tick: number) => {
    return `${tick}%`;
  };

  return (
    <div className="w-full bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6 text-center">
        <h3 className="text-lg font-bold text-slate-800 font-serif">Sınıflandırma Olasılık Dağılımı</h3>
        <p className="text-sm text-slate-500 font-serif italic">Şekil 1: Modelin duygu sınıfları üzerindeki tahmin güven aralığı</p>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barSize={60}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#334155', fontSize: 14, fontWeight: 600 }} 
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              dy={10}
            />
            
            <YAxis 
              tickFormatter={formatYAxis}
              domain={[0, 100]}
              tick={{ fill: '#64748b', fontSize: 12 }} 
              axisLine={false}
              tickLine={false}
              label={{ value: 'Olasılık Skoru (%)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#94a3b8', fontSize: 12 } }}
            />
            
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => [`%${value}`, 'Olasılık']}
            />
            
            {/* Decision Boundary Line - Common in academic papers */}
            <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="4 4">
              <text x="50" y="45" fill="#94a3b8" fontSize="12" textAnchor="start">Karar Sınırı (%50)</text>
            </ReferenceLine>

            <Bar dataKey="score" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList dataKey="score" position="top" formatter={(val: number) => `%${val}`} style={{ fill: '#334155', fontWeight: 'bold' }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Footer for the chart context */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-mono">
        <div>Model: Gemini-2.5-Flash</div>
        <div>Güven Skoru (Confidence): {confidence.toFixed(2)}</div>
      </div>
    </div>
  );
};

export default AnalysisCharts;