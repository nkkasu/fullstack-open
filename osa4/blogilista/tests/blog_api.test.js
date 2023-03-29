const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')


const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

test('testing GET method', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})
test('Test that all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body).toHaveLength(initialBlogs.length)
})
test('Test that a specific blog is in returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const contents = response.body.map(r => r.title)

  expect(contents).toContain('React patterns')
})

afterAll(async () => {
  await mongoose.connection.close()
})

test('Test that identifying field is named id', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})

test('Test that a valid blog can be added', async () => {
  const newBlog = {
    title: 'ABCDEFGH',
    author: 'Random Name',
    url: 'http://randomsite.com',
    likes: 5
  }
  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)

  expect(response.body).toHaveLength(initialBlogs.length + 1)
  expect(titles).toContain('ABCDEFGH')
})

test('Test that blog without like field has field added with value 0', async () => {
  const newBlog = {
    title: 'newTitle',
    author: 'newAuthor',
    url: 'newURL',
  }
  const response = await api.post('/api/blogs')
    .send(newBlog)
  expect(response.body.likes).toBe(0)
})

describe('Test missing title or url', () => {
  test('Test that missing title leads to 400 Bad Request', async () => {
    const newBlogNoTitle = {
      author: 'Random Author',
      url: 'Random URL'
    }
    const response = await api.post('/api/blogs')
      .send(newBlogNoTitle)
    expect(response.status).toBe(400)
  })
  test('Test that missing URL leads to 400 Bad Request', async () => {
    const newBlogNoURL = {
      title: 'Random Title',
      author: 'Random author Name',
    }
    const response = await api.post('/api/blogs')
      .send(newBlogNoURL)
    expect(response.status).toBe(400)
  })
})
test('Test removing blog', async () => {
  const blogAtStart = await api.get('/api/blogs')
  const blogToDelete = blogAtStart.body[0]

  await api.delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await api.get('/api/blogs')
  expect(blogsAtEnd.body).toHaveLength(blogAtStart.body.length - 1)
})
describe('Test updating blog', () => {
  test('Test updating likes of blog', async () => {
    const blogsAtStart = await api.get('/api/blogs')
    const blogToUpdate = blogsAtStart.body[0]
    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send({ likes: 15 })
      .expect(200)
    const blogsAtEnd = await api.get('/api/blogs')

    const updatedBlog = blogsAtEnd.body[0]

    expect(updatedBlog.likes).toBe(15)
  })
  test('Fails if blog doesn\'t exist (status 404)', async () => {
    const randomId = mongoose.Types.ObjectId()
    await api
      .put(`/api/blogs/${randomId}`)
      .send({ likes: 50000 })
      .expect(404)
  })
})

describe('Creating user to db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'dunno', passwordHash })

    await user.save()
  })

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

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('Test that creation fails with too short username', async () => {
    const newUser = {
      username: 'Us',
      name: 'User Name',
      password: 'pass'
    }
    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
  test('Test that creation fails without password', async () => {
    const newUser = {
      username: 'Randomuser',
      name: 'Name2',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
  })
})
afterAll(() => {
  mongoose.connection.close()
})