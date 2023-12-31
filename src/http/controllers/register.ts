import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { RegisterService } from '@/services/register'
import { PrismaUsersRepository } from '@/repositories/prisma/prismaUserRepository'
import { UserAlreadyExistsError } from '@/services/errors/userAlreadyExistsError'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { name, email, password } = registerBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const registerService = new RegisterService(usersRepository)

    await registerService.execute({ name, email, password })
  } catch (error) {
    if (error instanceof UserAlreadyExistsError)
      return reply.status(409).send({ message: error.message })
    return reply.status(500).send()
  }
  return reply.status(201).send()
}
