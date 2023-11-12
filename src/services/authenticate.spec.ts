import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/inMemory/inMemoryUsersRepository'
import { AuthenticateService } from './authenticate'
import * as argon2 from 'argon2'
import { InvalidCrendentialsError } from './errors/invalidCrendentialsError'

describe('Authenticate Service', () => {
  it('should be able to Authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const loginData = {
      email: 'john@gmail.com',
      password: '123456',
    }
    usersRepository.create({
      name: 'John Doe',
      email: loginData.email,
      password_hash: await argon2.hash(loginData.password),
    })

    const { user } = await sut.execute({
      email: loginData.email,
      password: loginData.password,
    })

    expect(user.id).toEqual(expect.any(String))
  })
  it('should not be able to Authenticate with wrong email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const loginData = {
      email: 'john@gmail.com',
      password: '123456',
    }
    expect(async () => {
      await sut.execute({
        email: '1john@gmail.com',
        password: loginData.password,
      })
    }).rejects.toBeInstanceOf(InvalidCrendentialsError)
  })
  it('should not be able to Authenticate with wrong password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateService(usersRepository)

    const loginData = {
      email: 'john@gmail.com',
      password: '123456',
    }

    usersRepository.create({
      name: 'John Doe',
      email: loginData.email,
      password_hash: await argon2.hash(loginData.password),
    })

    expect(async () => {
      await sut.execute({
        email: loginData.email,
        password: '1234567',
      })
    }).rejects.toBeInstanceOf(InvalidCrendentialsError)
  })
})
