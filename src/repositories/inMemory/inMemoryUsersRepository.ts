import { Prisma, User } from '@prisma/client'
import { UsersRepository } from '../usersRepository'

export class InMemoryUsersRepository implements UsersRepository {
  public itens: User[] = []
  async findByEmail(email: string) {
    const user = this.itens.find((user) => user.email === email)
    if (!user) return null
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: 'user-test',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }
    this.itens.push(user)
    return user
  }
}
