export enum SentimentType {
  POSITIVE = 'Pozitif',
  NEGATIVE = 'Negatif',
  NEUTRAL = 'Nötr'
}

export interface SentimentDistribution {
  positive: number;
  negative: number;
}

export interface AnalysisResult {
  sentiment: SentimentType;
  confidence: number;
  distribution: SentimentDistribution;
  summary?: string;
  keywords?: string[];
}

export interface HistoryItem extends AnalysisResult {
  id: string;
  text: string;
  timestamp: Date;
}