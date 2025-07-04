import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getJudge0LanguageId = (language) => {
  const languageMap = {
    PYTHON: 71,
    JAVA: 62,
    JAVASCRIPT: 63,
  };

  return languageMap[language.toUpperCase()];
};

export const getLanguageName = (languageId) => {
  const languageMap = {
    71: 'PYTHON',
    62: 'JAVA',
    63: 'JAVASCRIPT',
  };
  return languageMap[languageId] || 'Unknown';
};

export const submitBatch = async (submissions) => {
  try {
    const { data } = await axios.post(
      `${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,
      { submissions }
    );
    return data;
  } catch (error) {
    console.error('Error in submitBatch', error);
  }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const pollBatchResults = async (tokens) => {
  while (true) {
    try {
      const { data } = await axios.get(
        `${process.env.JUDGE0_API_URL}/submissions/batch`,
        {
          params: {
            tokens: tokens.join(','),
            base64_encoded: false,
          },
        }
      );
      const results = data.submissions;
      const isAllDone = results.every(
        (r) => r.status.id !== 1 && r.status.id !== 2
      );
      console.log('DATA', isAllDone);
      if (isAllDone) return results;
    } catch (error) {
      console.error('Error in pollBatchResults');
    }
    await sleep(1000);
  }
};
