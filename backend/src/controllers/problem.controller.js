import {
  getJudge0LanguageId,
  pollBatchResults,
  submitBatch,
} from '../libs/judge0.lib.js';
import { db } from '../libs/db.js';

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    example,
    constraints,
    testCases,
    codeSnippets,
    referenceSolution,
  } = req.body;

  if (req.user.role !== 'ADMIN') {
    return res
      .status(403)
      .json({ error: 'You are not allowed to create problem' });
  }

  try {
    for (const [language, solutionCode] of Object.entries(referenceSolution)) {
      const languageId = getJudge0LanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Language ${language} is not supported` });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);
      console.log(submissionResults);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < +results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ error: `Testcase ${i + 1} failed for ${language}` });
        }
      }
      try {
        const newProblem = await db.problem.create({
          data: {
            title,
            description,
            difficulty,
            tags,
            example,
            constraints,
            testCases,
            codeSnippets,
            referenceSolution,
            userId: req.user.id,
          },
        });
        return res.status(201).json({
          success: true,
          message: 'Message Created Successfully',
          problem: newProblem,
        });
      } catch (error) {
        console.error('Error in database', error);
      }
    }
  } catch (error) {}
};
export const getAllProblem = async (req, res) => {};
export const getProblemById = async (req, res) => {};
export const updateProblem = async (req, res) => {};
export const deleteProblem = async (req, res) => {};
export const getAllSolvedProblemsByUser = async (req, res) => {};
