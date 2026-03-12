import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();
export const prisma = new PrismaClient();

// 1. MIDDLEWARE CORS MANUAL E LOGS (ULTRA-ROBUSTO)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Log detalhado para o Render
  console.log(`[REQ] ${req.method} ${req.url} | Origin: ${origin || 'N/A'}`);

  // Reflete a origem se ela existir (Permite tudo dinamicamente para depuração)
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Trata Preflight OPTIONS imediatamente
  if (req.method === 'OPTIONS') {
    console.log(`[CORS] Respondendo 200 ao preflight OPTIONS de ${origin}`);
    return res.status(200).end();
  }

  next();
});

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.get("/api", (req: Request, res: Response) => {
  res.json({ status: "OK" });
});

// Rota raiz para evitar "Cannot GET /"
app.get("/", (req: Request, res: Response) => {
  res.send("API OK");
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "API is running" });
});

app.post("/api/auth/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      user: userWithoutPassword,
      token: "fake-jwt-token"
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { name, email, password, avatar } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: "Usuário já existe" });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        avatar
      }
    });

    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      user: userWithoutPassword,
      token: "fake-jwt-token"
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Erro ao criar usuário" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Servidor rodando na porta " + PORT);
});
