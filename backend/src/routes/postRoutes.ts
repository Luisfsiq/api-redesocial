import express from "express";
import { PrismaClient } from "@prisma/client";
import { validate } from "../middleware/validate";
import { createPostSchema, updatePostSchema } from "../schemas/postSchema";

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/posts - Buscar todos os posts
router.get("/", async (req, res) => {
  try {
    console.log("🔄 Buscando posts...");
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        likes: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    console.log(`✅ ${posts.length} posts encontrados`);
    res.json(posts);
  } catch (error) {
    console.error("❌ Erro ao buscar posts:", error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/posts/:id - Buscar post por ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        likes: true
      }
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao buscar post:", error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// POST /api/posts - Criar novo post
router.post("/", validate(createPostSchema), async (req, res) => {
  try {
    console.log("📝 Criando post:", req.body);
    const post = await prisma.post.create({
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
        comments: true
      }
    });
    console.log("✅ Post criado:", post.id);
    res.status(201).json(post);
  } catch (error) {
    console.error("❌ Erro ao criar post:", error);
    res.status(500).json({ error: "Failed to create post" });
  }
});

// PUT /api/posts/:id - Atualizar post
router.put("/:id", validate(updatePostSchema), async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.update({
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
        comments: true
      }
    });
    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao atualizar post:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/posts/:id - Deletar post
router.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await prisma.post.delete({
      where: { id }
    });
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("❌ Erro ao deletar post:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(500).json({ error: "Failed to delete post" });
  }
});

// PATCH /api/posts/:id/like - Curtir/descurtir post (CORRIGIDA)
router.patch("/:id/like", async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  // VALIDAÇÃO ADICIONADA
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: id
        }
      }
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          userId_postId: {
            userId: userId,
            postId: id
          }
        }
      });
      console.log(`👎 Like removido - User: ${userId}, Post: ${id}`);
    } else {
      await prisma.like.create({
        data: {
          userId: userId,
          postId: id
        }
      });
      console.log(`👍 Like adicionado - User: ${userId}, Post: ${id}`);
    }

    const post = await prisma.post.findUnique({
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
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        },
        likes: true
      }
    });

    res.json(post);
  } catch (error) {
    console.error("❌ Erro ao curtir post:", error);
    res.status(500).json({ error: "Failed to like post" });
  }
});

export default router;
