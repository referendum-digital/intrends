import dotenv from 'dotenv';
import { getTrends } from './services/intrendsService.js';
import { generateBinaryQuestion } from './services/openaiService.js';
import { createSentence, createReferendum } from './services/referendumService.js';
import logger from './utils/logger.js';

dotenv.config();

async function main() {
  try {
    const trends = await getTrends();

    const randomIndex = Math.floor(Math.random() * trends.length);
    const news = trends[randomIndex];

    // Generate a binary question 
    const prompt = `Based on the news below, write a one-sentence Yes/No question (max 200 characters) that summarizes the news, includes the date if possible, and asks for the reader's opinion.\n\nNews title: "${news.title}"\nNews description: "${news.description ?? ''}"\nNews date: "${news.date}"`;
    const question = await generateBinaryQuestion(prompt);

    // Create sentence in Referendum API
    logger.info('Creating sentence in Referendum API...');
    const sentenceResult = await createSentence(question);
    const sentenceId = sentenceResult?.created?.id;
    if (!sentenceId) {
      throw new Error('Failed to get sentence ID from Referendum API.');
    }

    // Create referendum
    const referendumResult = await createReferendum(sentenceId);

    console.log(`📰 ${news.title}`);
    console.log(`❓ ${question}`);
    console.log('📤 Referendum created successfully.');
  } catch (error) {
    logger.error(`Error in main workflow: ${error.message}`, error);
    console.error(`❌ An error occurred: ${error.message}`);
    process.exit(1);
  }
}

main();