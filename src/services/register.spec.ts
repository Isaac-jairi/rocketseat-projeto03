import { describe, expect, it } from 'vitest'
import * as argon2 from 'argon2'
import { RegisterService } from './register'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { UserAlreadyExistsError } from './errors/userAlreadyExistsError'
describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'john@gmail.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await argon2.verify(
      user.password_hash,
      '123456',
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
  it('should not be able to register with same email twice', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const registerService = new RegisterService(usersRepository)

    const email = 'john@gmail.com'

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })
    await expect(async () => {
      await registerService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
