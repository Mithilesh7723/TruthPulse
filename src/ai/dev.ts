import { config } from 'dotenv';
config();

import '@/ai/flows/cross-check-news-content.ts';
import '@/ai/flows/calculate-truth-probability-score.ts';
import '@/ai/flows/assess-content-integrity.ts';
import '@/ai/flows/generate-explanation.ts';
import '@/ai/flows/assess-source-credibility.ts';
import '@/ai/flows/analyze-news-article.ts';
