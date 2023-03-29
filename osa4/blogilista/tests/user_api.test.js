const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'dunno', passwordHash })

  await user.save()
})

describe('Tests for user creation', () => {
  test('Creation succeeds with a fresh username', async () => {
    const usersAtStart = await api.get('/api/users')

    const newUser = {
      username: 'User',
      name: 'User Name',
      password: 'secret'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(usersAtStart.body.length + 1)

    const usernames = usersAtEnd.body.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('Test that creation fails with too short password', async () => {
    const newUser = {
      username: 'SuperUser',
      name: 'Name2',
      password: 'no'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('Password length has to be 3 or more')
  })
  test('Test that creation fails with too short username', async () => {
    const newUser = {
      username: 'Us',
      name: 'User Name',
      password: 'pass'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('User validation failed')
  })
  test('Test that creation fails without username ', async () => {
    const newUser = {
      name: 'User Name',
      password: 'pass'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('User validation failed')
  })
  test('Test that creation fails without name', async () => {
    const newUser = {
      username: 'User Name',
      password: 'pass'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(result.body.error).toContain('User validation failed')
  })
})
