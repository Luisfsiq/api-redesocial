import express from 'express';
import { prisma } from '../index';
import { validate } from '../middleware/validate';
import { createCommentSchema, updateCommentSchema } from '../schemas/commentSchema';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        post: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await prisma.comment.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        post: true
      }
    });

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json(comment);
  } catch (error) {
    console.error('Error fetching comment:', error);
    res.status(500).json({ error: 'Failed to fetch comment' });
  }
});

router.post('/', validate(createCommentSchema), async (req, res) => {
  try {
    const comment = await prisma.comment.create({
      data: req.body,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        post: true
      }
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
  }
});

router.put('/:id', validate(updateCommentSchema), async (req, res) => {
  const id = req.params.id;
  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: req.body,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        post: true
      }
    });
    res.json(comment);
  } catch (error) {
    console.error('Error updating comment:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(500).json({ error: 'Failed to update comment' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.comment.delete({
      where: { id }
    });
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Error deleting comment:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Comment not found' });
    }
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

export default router;
