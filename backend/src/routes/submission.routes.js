import express, { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  getAllSubmissionForProblem,
  getAllSubmissions,
  getSubmissionsForProblem,
} from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get('/get-all-submissions', authMiddleware, getAllSubmissions);
submissionRoutes.get(
  '/get-submission/:problemId',
  authMiddleware,
  getSubmissionsForProblem
);
submissionRoutes.get(
  '/get-submissions-count/:problemId',
  authMiddleware,
  getAllSubmissionForProblem
);

export default submissionRoutes;
