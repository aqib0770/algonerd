import express, { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import {
  addProblemToPlaylist,
  createPlayList,
  deletePlaylist,
  getAllListDetails,
  getPlaylistDetails,
  removeProblemFromPlaylist,
} from '../controllers/playlist.controller.js';

const playlistRoutes = Router();

playlistRoutes.get('/', authMiddleware, getAllListDetails);
playlistRoutes.get('/:playlistId', authMiddleware, getPlaylistDetails);
playlistRoutes.post('/createPlaylist', authMiddleware, createPlayList);
playlistRoutes.post(
  '/:playlistId/add-problem',
  authMiddleware,
  addProblemToPlaylist
);
playlistRoutes.delete('/:playlistId', authMiddleware, deletePlaylist);
playlistRoutes.delete(
  '/:playlistId/remove-problem',
  authMiddleware,
  removeProblemFromPlaylist
);
export default playlistRoutes;
