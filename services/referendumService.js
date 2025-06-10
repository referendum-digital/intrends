import axios from 'axios';
import logger from '../utils/logger.js';

const REFERENDUM_JWT = process.env.REFERENDUM_JWT;
const SENTENCE_API_URL = 'https://api.referendum-app.com/sentence';
const REFERENDUM_API_URL = 'https://api.referendum-app.com/referendum';

const headers = {
  Authorization: `JWT ${REFERENDUM_JWT}`,
  'Content-Type': 'application/json',
  version: '1.0.5',
};

export async function createSentence(question) {
  try {
    const response = await axios.post(
      SENTENCE_API_URL,
      { text: question },
      { headers }
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to create sentence in Referendum API:', error);
    throw new Error(`Referendum sentence API request failed: ${error.message}`);
  }
}

export async function createReferendum(sentenceId) {
  try {
    const response = await axios.post(
      REFERENDUM_API_URL,
      {
        question_id: sentenceId,
        topics: [],
        tags: [],
        visibility: 'public',
      },
      { headers }
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to create referendum:', error);
    throw new Error(`Referendum API request failed: ${error.message}`);
  }
}