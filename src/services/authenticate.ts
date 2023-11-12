import { UsersRepository } from '@/repositories/usersRepository'
import { InvalidCrendentialsError } from './errors/invalidCrendentialsError'
import * as argon2 from 'argon2'
import { User } from '@prisma/client'

interface IAuthenticateRequest {
  email: string
  password: string
}

interface IAuthenticateResponse {
  user: User
}

export class AuthenticateService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    email,
    password,
  }: IAuthenticateRequest): Promise<IAuthenticateResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCrendentialsError()

    const doesPasswordMatch = await argon2.verify(user.password_hash, password)

    if (!doesPasswordMatch) throw new InvalidCrendentialsError()

    return { user }
  }
}
