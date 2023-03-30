import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const Notification = ({message}) => {
  if (message === null) {
    return null
  }
  return (
    <div className={message.type}>
      {message.text}
    </div>
  )
  
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')


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

  const createNewBlog = async (event) => {
    event.preventDefault()

    const newObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }
    try {
      const newBlog = await blogService.create(newObject)
      setBlogs(blogs.concat(newBlog))
      setMessage({text: `a new blog ${blogTitle} by ${blogAuthor} added`, type: 'success'})
      setTimeout(() => {setMessage(null)}, 5000)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
    } catch (exception) {
      setMessage({text: 'Adding blog failed.', type: 'failure'})
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }

  const handleLogout = (event) => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setMessage({text: 'Logged out succesfully', type: 'success'})
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
      setMessage({text: 'Wrong username or password', type: 'failure'})
      setTimeout(() => {setMessage(null)}, 5000)
    }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>

        <Notification message={message}/>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input 
            type='text' 
            value={username} 
            name='Username' 
            onChange={( { target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input 
            type='password'
            value={password}
            name='Password'
            onChange={({ target }) => setPassword(target.value)}
          />
      </div>
      <button type='submit'>login</button>
        </form>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message}/>

      {user.name} logged in <button onClick={handleLogout}>{`logout`}</button>

      <h2>create new</h2>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input 
            type='text'
            value={blogTitle}
            name='Blogtitle'
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input 
            type='text'
            value={blogAuthor}
            name='Blogauthor'
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input 
            type='text'
            value={blogUrl}
            name='Blogurl'
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </div>
        <button type='submit'>create</button>
      </form>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App