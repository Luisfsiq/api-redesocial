import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário de exemplo
  const user = await prisma.user.upsert({
    where: { email: 'usuario@exemplo.com' },
    update: {},
    create: {
      name: 'Usuário Exemplo',
      email: 'usuario@exemplo.com',
      password: '123456',
      avatar: null,
      bio: 'Bio de exemplo'
    },
  })

  console.log(`✅ Usuário criado: ${user.name}`)

  // Criar posts de exemplo
  const ensurePost = async (content: string, authorId: string) => {
    const existing = await prisma.post.findFirst({ where: { content, authorId } })
    if (existing) return existing
    return prisma.post.create({
      data: {
        content,
        authorId,
      },
    })
  }

  const post1 = await ensurePost('Este é meu primeiro post! Bem-vindo à rede social.', user.id)
  const post2 = await ensurePost('Compartilhando mais uma ideia interessante...', user.id)

  console.log(`✅ Posts de exemplo criados: ${post1.id}, ${post2.id}`)
  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
