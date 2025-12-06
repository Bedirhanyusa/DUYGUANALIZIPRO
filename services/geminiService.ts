import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, SentimentType } from "../types";

// Initialize the client. API_KEY is guaranteed to be available in process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const sentimentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      enum: ["Pozitif", "Negatif"],
      description: "Metnin genel duygu durumu.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Analizin doğruluk/güven skoru (0.0 ile 1.0 arasında).",
    },
    distribution: {
      type: Type.OBJECT,
      properties: {
        positive: {
          type: Type.NUMBER,
          description: "Metnin pozitiflik oranı (0-100 arası).",
        },
        negative: {
          type: Type.NUMBER,
          description: "Metnin negatiflik oranı (0-100 arası).",
        }
      },
      required: ["positive", "negative"],
      description: "Duygu durumunun olasılık dağılımı."
    },
    summary: {
      type: Type.STRING,
      description: "Neden bu kararın verildiğine dair tek cümlelik çok kısa bir özet.",
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Duyguyu belirleyen en önemli 3 anahtar kelime.",
    },
  },
  required: ["sentiment", "confidence", "distribution", "summary", "keywords"],
};

export const analyzeSentiment = async (text: string): Promise<AnalysisResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Aşağıdaki metni analiz et ve detaylı duygu dökümünü çıkar.
      
      Metin: "${text}"
      
      Görevin:
      1. Metni 'Pozitif' veya 'Negatif' olarak sınıflandır.
      2. Kararın için bir güven skoru (confidence score) ver (0.0 - 1.0).
      3. Metindeki duygu dağılımını (distribution) 100 puan üzerinden analiz et. (Örn: %80 Pozitif, %20 Negatif). Toplamı her zaman 100 olmalı.
      4. Kararının nedenini açıklayan çok kısa bir özet yaz.
      5. En önemli anahtar kelimeleri çıkar.
      
      Sadece JSON formatında yanıt ver.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: sentimentSchema,
        temperature: 0.2, 
      },
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("API'den boş yanıt döndü.");
    }

    const data = JSON.parse(resultText);

    return {
      sentiment: data.sentiment as SentimentType,
      confidence: data.confidence,
      distribution: data.distribution,
      summary: data.summary,
      keywords: data.keywords
    };
  } catch (error) {
    console.error("Sentiment analysis failed:", error);
    throw error;
  }
};