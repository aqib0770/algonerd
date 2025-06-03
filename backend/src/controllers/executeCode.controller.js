import { pollBatchResults, submitBatch } from '../libs/judge0.lib.js';

export const executeCode = async (req, res) => {
  const { sourceCode, languageId, stdin, expectedOutputs, problemId } =
    req.body;
  const userId = req.user.id;
  try {
    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expectedOutputs) ||
      expectedOutputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: 'Invalid or Missing test cases' });
    }

    const submissions = stdin.map((input) => ({
      source_code: sourceCode,
      language_id: languageId,
      stdin: input,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res) => res.token);
    const results = await pollBatchResults(tokens);
    console.log('Results', results);
    res.status(200).json({
      success: true,
      message: 'Code executed',
    });
  } catch (error) {
    console.error('Error in executeCode', error);
    return res.status(400).json({
      success: false,
      error,
    });
  }
};
