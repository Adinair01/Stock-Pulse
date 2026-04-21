import axios from 'axios';
import { GROQ_API_KEY } from '@env';

const groqClient = axios.create({
  baseURL: 'https://api.groq.com/openai/v1',
  headers: {
    'Authorization': `Bearer ${GROQ_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

export const analyzeSentiment = async (ticker: string, companyName: string, headlines: string[]) => {
    if (!headlines || headlines.length === 0) {
        return null;
    }

    try {
        const payload = {
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a financial sentiment analyst. Given news headlines about a specific stock, return a JSON object with:
{
  "score": <integer 0-100, where 0=extremely bearish, 50=neutral, 100=extremely bullish>,
  "label": "Bullish" | "Neutral" | "Bearish",
  "summary": "<2-sentence plain-English explanation of the sentiment>",
  "headline_sentiments": [<array of "positive"|"neutral"|"negative" matching input order>]
}
Respond ONLY with valid JSON, no markdown, no preamble.`
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        ticker,
                        company: companyName,
                        headlines
                    })
                }
            ],
            temperature: 0.2,
            response_format: { type: "json_object" }
        };

        const response = await groqClient.post('/chat/completions', payload);
        const resultText = response.data.choices[0].message.content;
        return JSON.parse(resultText);
    } catch (error) {
        console.error("Groq Sentiment Analysis Failed:", error);
        return {
            score: 50,
            label: "Neutral",
            summary: "Sentiment could not be determined at this time due to analyzing failure.",
            headline_sentiments: headlines.map(() => "neutral")
        };
    }
};
