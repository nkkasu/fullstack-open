import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const removeBlog = async (blog) => {
    try {
      if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
        return
      }
      await blogService.remove(blog.id)
      setBlogs(blogs.filter(b => b.id !== blog.id))
    } catch (exception) {
      console.log(exception)
    }
  }

  const updateLike = async (blog, update) => {
    try {
      const updatedBlog = await blogService.update(blog.id, { ...blog, ...update })
      setBlogs(blogs.map(x => x.id === blog.id ? updatedBlog : x))
      console.log(blogs)
    } catch (exception) {
      console.log('fail')
    }
  }

  const handleCreateNewBlog = async (title, author, url) => {
    try {
      blogFormRef.current.toggleVisibility()

      const newObject = {
        title: title,
        author: author,
        url: url
      }
      const newBlog = await blogService.create(newObject)

      newBlog.user = { name: user.name, username: user.username }

      setBlogs(blogs.concat(newBlog))
      setMessage({ text: `a new blog ${title} by ${author} added`, type: 'success' })
      setTimeout(() => {setMessage(null)}, 5000)

    } catch (exception) {
      setMessage({ text: 'Adding blog failed.', type: 'failure' })
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setMessage({ text: 'Logged out succesfully', type: 'success' })
    setTimeout(() => {setMessage(null)}, 5000)
  }
  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage({ text: 'Wrong username or password', type: 'failure' })
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={message} />

        <LoginForm username={username} password={password} handleLogin={handleLogin} setUsername={setUsername} setPassword={setPassword}
          handleUsernameChange={({ target }) => setUsername(target.value)} handlePasswordChange={({ target }) => setPassword(target.value)}/>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message}/>

      {user.name} logged in <button onClick={handleLogout}>{'logout'}</button>

      <h2>create new</h2>

      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm
          handleCreateNewBlog={handleCreateNewBlog}
        />
      </Togglable>
      {blogs.sort((a, b) => {return b.likes - a.likes}).map(blog =>
        <Blog key={blog.id} blog={blog} updateLike={updateLike} removeBlog={removeBlog}/>
      )}
    </div>
  )
}

export default App