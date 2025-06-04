import { db } from '../libs/db.js';

export const createPlayList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { userId } = req.user.userId;
    const playlist = await db.playlist.create({
      data: {
        name,
        description,
        userId,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Playlist created successfully',
      playlist,
    });
  } catch (error) {
    console.error('Error creating playlist', error);
    return res.status(500).json({
      success: false,
      message: 'Error creating playlist',
    });
  }
};
export const getAllListDetails = async (req, res) => {
  try {
    const playlists = await db.playlist.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Playlist fetched',
    });
  } catch (error) {
    console.error('Error fetching playlist', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching playlist',
    });
  }
};
export const getPlaylistDetails = async (req, res) => {
  const { playlistId } = req.params;

  try {
    const playlist = await db.playlist.findUnique({
      where: {
        id: playlistId,
        userId: req.user.id,
      },
      include: {
        problems: {
          include: {
            problem: true,
          },
        },
      },
    });
    if (!playlist) {
      return res.status(404).json({
        error: 'Playlist not found',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Playlist fetched successfully',
      playlist,
    });
  } catch (error) {
    console.error('Error fetching playlist', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching playlist',
    });
  }
};
export const addProblemToPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({
        error: 'Invalid or missing problems',
      });
    }
    const problemsInPlaylist = await db.problemsInPlaylist.createMany({
      data: problemIds.map((problemId) => ({
        playlistId,
        problemId,
      })),
    });
    res.status(201).json({
      success: true,
      message: 'Problem added to playlist successfully',
      problemsInPlaylist,
    });
  } catch (error) {
    console.error('Error in adding problem to playlist', error);
    return res.status(500).json({
      success: false,
      error: 'Error in adding problem to playlist',
    });
  }
};
export const deletePlaylist = async (req, res) => {
  const { playlist } = req.params;
  try {
    const deleted = await db.playlist.delete({
      where: {
        id: playlist,
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Playlist deleted successfully',
      deletePlaylist,
    });
  } catch (error) {
    console.error('Error in deleting playlist', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete playlist',
    });
  }
};
export const removeProblemFromPlaylist = async (req, res) => {
  const { playlistId } = req.params;
  const { problemIds } = req.body;
  try {
    if (!Array.isArray(problemIds) || problemIds.length === 0) {
      return res.status(400).json({ error: 'Invalid or missing problem id' });
    }
    const deleted = await db.problemsInPlaylist.deleteMany({
      where: {
        playlistId,
        problemId: {
          in: problemIds,
        },
      },
    });
    return res.status(200).json({
      success: true,
      message: 'Problem removed from playlist successfully',
    });
  } catch (error) {
    console.error('Error in removing problem from playlist', error);
    return res.status(500).json({
      success: false,
      error: "Can't remove problem from playlist",
    });
  }
};
