import React from 'react';
import { AnalysisResult, SentimentType } from '../types';
import AnalysisCharts from './AnalysisCharts';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const isPositive = result.sentiment === SentimentType.POSITIVE;
  
  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fade-in-up">
      <div className={`h-2 w-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`} />
      
      <div className="p-8 space-y-8">
        {/* Main Result Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className={`p-4 rounded-full shadow-sm ${isPositive ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
              {isPositive ? <CheckCircle2 size={40} /> : <AlertCircle size={40} />}
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Tespit Edilen Duygu</h2>
              <p className={`text-4xl font-extrabold tracking-tight ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                {result.sentiment}
              </p>
            </div>
          </div>
          
          {result.keywords && result.keywords.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-start md:justify-end max-w-md">
              {result.keywords.map((keyword, idx) => (
                <span key={idx} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                  #{keyword}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 my-6"></div>

        {/* Content & Charts Grid - Changed to vertical layout for better chart visibility */}
        <div className="grid grid-cols-1 gap-8">
          
          {/* Summary Text */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              Analiz Özeti
            </h3>
            <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
              <p className="text-slate-700 leading-relaxed italic text-lg">
                "{result.summary}"
              </p>
            </div>
          </div>

          {/* Scientific Chart - Full Width */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
              Model Güven Grafiği
            </h3>
            <AnalysisCharts 
              confidence={result.confidence} 
              distribution={result.distribution}
              sentiment={result.sentiment}
            />
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ResultCard;