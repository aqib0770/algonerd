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
      console.log('SUBMISSIONS', submissions);
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
export const getAllProblem = async (req, res) => {
  try {
    const problems = await db.problem.findMany();
    if (!problems) {
      return res.status(404).json({
        error: 'No Problems Found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Message Fetched Successfully',
      problems,
    });
  } catch (error) {
    console.log('Error in getAllProblem');
    return res.status(500).json({
      success: false,
      error: 'Error while fetching problems',
    });
  }
};
export const getProblemById = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({ error: 'Problem not Found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Message Fetched Successfully',
      problem,
    });
  } catch (error) {
    console.log('Error in getProblemById');
    return res.status(500).json({
      success: false,
      error: 'Error while fetching problem by id',
    });
  }
};
export const updateProblem = async (req, res) => {
  const { id } = req.params;
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
      .json({ error: 'You are not allowed to update problem' });
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
      console.log('SUBMISSIONS', submissions);
      const submissionResults = await submitBatch(submissions);
      console.log(submissionResults);
      const tokens = submissionResults.map((res) => res.token);
      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        if (result.status.id !== 3) {
          return res
            .status(400)
            .json({ error: `Testcase ${i + 1} failed for ${language}` });
        }
      }
    }
    try {
      const updatedProblem = await db.problem.update({
        where: {
          id,
        },
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
      return res.status(200).json({
        success: true,
        message: 'Problem Updated Successfully',
        problem: updatedProblem,
      });
    } catch (error) {
      console.error('Error in database', error);
      return res.status(500).json({
        success: false,
        error: 'Database error while updating problem',
      });
    }
  } catch (error) {
    console.error('Error in updateProblem', error);
    return res.status(500).json({
      success: false,
      error: 'Error while updating problem',
    });
  }
};
export const deleteProblem = async (req, res) => {
  const { id } = req.params;
  try {
    const problem = await db.problem.findUnique({
      where: {
        id,
      },
    });
    if (!problem) {
      return res.status(404).json({ error: 'Problem Nor found' });
    }
    await db.problem.delete({ where: { id } });
    return res.status(201).json({
      success: true,
      message: 'Problem deleted successfully',
    });
  } catch (error) {
    console.log('Error in deleteProblem', error);
    return res.status(500).json({
      success: false,
      message: 'Error while deleting problem',
    });
  }
};
export const getAllSolvedProblemsByUser = async (req, res) => {};
