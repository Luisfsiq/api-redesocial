import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";

const app = express();
export const prisma = new PrismaClient();

// Middleware de Log para depuração no Render
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

const allowedOrigins = [
  "https://api-redesocial.onrender.com",
  "https://redesocial-frontend.onrender.com",
  "http://localhost:3001",
  "http://localhost:3000",
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Permitir requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || origin.endsWith(".onrender.com");
    
    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS] Origin bloqueado: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  credentials: true,
  optionsSuccessStatus: 200 // Algumas versões do navegador preferem 200 em vez de 204
};

app.use(cors(corsOptions));
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
