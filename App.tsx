import React, { useState, useCallback } from 'react';
import { analyzeSentiment } from './services/geminiService';
import { AnalysisResult } from './types';
import ResultCard from './components/ResultCard';
import { BrainCircuit, Sparkles, Loader2, Eraser } from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async () => {
    if (!inputText.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeSentiment(inputText);
      setResult(data);
    } catch (err) {
      setError("Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200 mb-4">
            <BrainCircuit className="text-white h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            Duygu Analizi <span className="text-indigo-600">Pro</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Yapay zeka destekli NLP motoru ile metinlerinizdeki duygusal tonu saniyeler içinde analiz edin. 
            Yüksek doğruluk payı ve detaylı içgörüler.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden border border-white">
          <div className="p-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Analiz etmek istediğiniz metni veya kullanıcı yorumunu buraya yapıştırın..."
              className="w-full min-h-[180px] p-6 text-lg text-slate-700 placeholder:text-slate-400 border-none resize-y focus:ring-0 focus:outline-none bg-transparent"
              spellCheck={false}
            />
          </div>
          <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-slate-100">
            <div className="text-xs text-slate-400 font-medium hidden sm:block">
              {inputText.length} karakter
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                onClick={handleClear}
                disabled={!inputText && !result}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
              >
                <Eraser size={18} />
                <span className="hidden sm:inline">Temizle</span>
              </button>
              <button
                onClick={handleAnalyze}
                disabled={loading || !inputText.trim()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Analiz Ediliyor...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Analiz Et
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl flex items-center gap-3 animate-pulse">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            {error}
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="animate-fade-in">
             <ResultCard result={result} />
          </div>
        )}

        {/* Footer/Info */}
        <div className="pt-8 border-t border-slate-200 text-center text-slate-400 text-sm">
          <p>BERT mimarisi ve Google Gemini altyapısı kullanılarak geliştirilmiştir.</p>
        </div>

      </div>
    </div>
  );
};

export default App;