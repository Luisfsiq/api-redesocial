import express from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../index';
import { validate } from '../middleware/validate';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/', validate(createUserSchema), async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: req.body,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.put('/:id', validate(updateUserSchema), async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: req.body,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        createdAt: true,
        updatedAt: true
      }
    });
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to update user' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.user.delete({
      where: { id }
    });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

export default router;
