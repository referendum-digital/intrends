import axios from 'axios';
import logger from '../utils/logger.js';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export async function generateBinaryQuestion(prompt) {
  try {
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content:
              'You are an assistant that generates concise Yes/No questions in English based on provided news, max 200 characters.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    logger.error('Failed to generate question from OpenAI:', error);
    throw new Error('OpenAI API request failed.');
  }
}