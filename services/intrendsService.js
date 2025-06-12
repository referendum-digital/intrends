import axios from 'axios';
import logger from '../utils/logger.js';
import dotenv from 'dotenv';

dotenv.config();

export async function getTrends() {
  const apiKey = process.env.IN_TRENDS_API_KEY;

  if (!apiKey) {
    logger.error('IN_TRENDS_API_KEY is not defined in environment variables');
    throw new Error('Missing IN_TRENDS_API_KEY in environment variables');
  }

  const IN_TRENDS_API_URL = `https://intrends.me/api/usecases/4/info?apiKey=${encodeURIComponent(apiKey)}`;

  try {
    const { data } = await axios.get(IN_TRENDS_API_URL);
    logger.info(`InTrends API response: ${JSON.stringify(data)}`);

    if (!data || !data.trends || !Array.isArray(data.trends) || data.trends.length === 0) {
      logger.error('InTrends API returned empty or invalid trends');
      throw new Error('InTrends API returned empty or invalid trends');
    }

    logger.info('Successfully fetched trends from InTrends API');
    return data.trends; 
  } catch (error) {
    logger.error(`Failed to fetch trends from InTrends: ${error.message}`, error);
    throw new Error('InTrends API request failed.');
  }
}
