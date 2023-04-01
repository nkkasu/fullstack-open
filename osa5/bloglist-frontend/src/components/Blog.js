import { useState } from 'react'

const Blog = ({ blog, updateLike, removeBlog }) => {
  const [blogVisible, setBlogVisible] = useState(false)

  const hideWhenVisible = { display: blogVisible ? 'none' : '' }
  const showWhenVisible = { display: blogVisible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }


  const addLike = async () => {
    await updateLike(blog, { likes: blog.likes + 1 })
  }

  const handleBlogRemove = () => {
    removeBlog(blog)
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title} {blog.author}
        <button onClick={() => setBlogVisible(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} {blog.author}
        <br></br>
        {blog.url}
        <br></br>
        likes {blog.likes} <button onClick={addLike}>like</button>
        <br></br>
        {blog.user.name}
        <br></br>
        <button onClick={handleBlogRemove}>remove</button>
      </div>
    </div>
  )}

export default Blog