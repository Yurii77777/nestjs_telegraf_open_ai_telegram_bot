import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { API } from 'src/constants/api.constants';
import { SearchGoogleResult } from 'src/types/searchGoogle';

@Injectable()
export class GoogleService {
  async searchGoogle(query: string): Promise<SearchGoogleResult[]> {
    const API_KEY = process.env.GOOGLE_API_KEY;
    const CX = process.env.GOOGLE_CX;

    try {
      const response = await axios.get(API.GOOGLE_SEARCH, {
        params: {
          key: API_KEY,
          cx: CX,
          q: query,
        },
      });

      return (
        response.data.items?.map((item) => ({
          title: item.title,
          link: item.link,
          snippet: item.snippet,
        })) || []
      );
    } catch (error) {
      console.error(
        'Error during search:',
        error.response?.data || error.message,
      );
      return [];
    }
  }
}
