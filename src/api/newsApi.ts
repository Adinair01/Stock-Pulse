import axios from 'axios';
import { NEWSAPI_KEY } from '@env';

const newsClient = axios.create({
  baseURL: 'https://newsapi.org/v2',
  headers: {
    'X-Api-Key': NEWSAPI_KEY
  }
});

export const fetchStockNews = async (companyName: string) => {
  try {
    const today = new Date();
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const formattedDate = lastWeek.toISOString().split('T')[0];

    const response = await newsClient.get('/everything', {
      params: {
        q: `${companyName} AND (stock OR shares OR NSE OR BSE OR market)`,
        language: 'en',
        sortBy: 'relevancy',
        pageSize: 8,
        from: formattedDate
      }
    });
    return response.data.articles || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
