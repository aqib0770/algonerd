import { db } from '../libs/db.js';

export const getAllSubmissions = async (req, res) => {
  try {
    const { userId } = req.user.id;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Submission fetched successfully',
      submissions,
    });
  } catch (error) {
    console.error('Fetch submission error', error);
    res.status(500).json({ error: 'Fetch submission error' });
  }
};
export const getSubmissionsForProblem = async (req, res) => {
  try {
    const userId = req.user.id;
    const problemId = req.params.problemId;
    const submissions = await db.submission.findMany({
      where: {
        userId: userId,
        problemId,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Submission fetched successfully',
      submissions,
    });
  } catch (error) {
    console.error('Error in getSubmissionsForProblem', error);
    res.status(500).json({ error: 'Fetch submission for problem error' });
  }
};
export const getAllSubmissionForProblem = async (req, res) => {
  try {
    const problemId = req.params.problemId;
    const submissions = await db.submission.count({
      where: {
        problemId,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'All submission fetched successfully',
      count: submissions,
    });
  } catch (error) {
    console.error('Error in getAllSubmissionForProblem', error);
    res.status(500).json({ error: 'Fetch all submission for problem error' });
  }
};
