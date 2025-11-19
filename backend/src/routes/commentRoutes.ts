import express from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// POST /api/comments - Criar comentário (ROTA SIMPLES)
router.post("/", async (req, res) => {
  try {
    console.log("🎯 COMMENT ROUTE: Requisição recebida!");
    console.log("📦 Body:", req.body);
    
    const { content, authorId, postId } = req.body;

    // Validação manual (sem Zod por enquanto)
    if (!content || !authorId || !postId) {
      return res.status(400).json({ 
        error: "Content, authorId and postId are required",
        received: { content: !!content, authorId: !!authorId, postId: !!postId }
      });
    }

    console.log("📝 Criando comentário...");

    const comment = await prisma.comment.create({
      data: { 
        content, 
        authorId, 
        postId 
      },
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
    });

    console.log("✅ Comentário criado:", comment.id);
    res.status(201).json(comment);

  } catch (error) {
    console.error("❌ Erro ao criar comentário:", error);
    const message = error instanceof Error ? error.message : String(error);
    res.status(500).json({ 
      error: "Failed to create comment: " + message,
      details: error 
    });
  }
});

// GET /api/comments - Listar comentários (opcional)
router.get("/", async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        author: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        post: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(comments);
  } catch (error) {
    console.error("Erro ao buscar comentários:", error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

export default router;
