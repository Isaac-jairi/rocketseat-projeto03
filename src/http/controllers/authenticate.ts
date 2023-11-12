import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { AuthenticateService } from '@/services/authenticate'
import { PrismaUsersRepository } from '@/repositories/prisma/prismaUserRepository'
import { InvalidCrendentialsError } from '@/services/errors/invalidCrendentialsError'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
  const { email, password } = authenticateBodySchema.parse(request.body)

  try {
    const usersRepository = new PrismaUsersRepository()
    const authenticateService = new AuthenticateService(usersRepository)

    await authenticateService.execute({ email, password })
  } catch (error) {
    if (error instanceof InvalidCrendentialsError)
      return reply.status(400).send({ message: error.message })
  }
  return reply.status(200).send()
}
