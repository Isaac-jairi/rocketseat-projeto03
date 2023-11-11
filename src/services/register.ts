import { UsersRepository } from '@/repositories/usersRepository'
import * as argon2 from 'argon2'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'
import { User } from '@prisma/client'

interface IRegisterServiceRequest {
  name: string
  email: string
  password: string
}

interface IRegisterServiceResponse {
  user: User
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: IRegisterServiceRequest): Promise<IRegisterServiceResponse> {
    const emailAlredyExists = await this.usersRepository.findByEmail(email)

    if (emailAlredyExists) {
      throw new UserAlreadyExistsError()
    }

    const hash = await argon2.hash(password)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash: hash,
    })
    return { user }
  }
}
