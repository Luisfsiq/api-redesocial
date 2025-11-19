FROM node:18-alpine

WORKDIR /app

# Dependência necessária para Prisma em Alpine
RUN apk add --no-cache openssl

# Instalar dependências e preparar Prisma client
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install && npx prisma generate

# Copiar código e compilar TypeScript
COPY . .
RUN npm run build

EXPOSE 3000

# Aplicar migrações e iniciar em produção
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
