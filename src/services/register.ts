import { UsersRepository } from '@/repositories/usersRepository'
import * as argon2 from 'argon2'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'

interface IRegisterServiceRequest {
  name: string
  email: string
  password: string
}

export class RegisterService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: IRegisterServiceRequest) {
    const emailAlredyExists = await this.usersRepository.findByEmail(email)

    if (emailAlredyExists) {
      throw new UserAlreadyExistsError()
    }

    const hash = await argon2.hash(password)

    await this.usersRepository.create({
      name,
      email,
      password_hash: hash,
    })
  }
}
