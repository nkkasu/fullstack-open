import { useState } from 'react'

const BlogForm = ({
  handleCreateNewBlog
}) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const createNewBlog = async (event) => {
    event.preventDefault()
    await handleCreateNewBlog(blogTitle, blogAuthor, blogUrl)
    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <div>
      <form onSubmit={createNewBlog}>
        <div>
          title:
          <input
            type='text'
            value={blogTitle}
            name='Blogtitle'
            onChange={({ target }) => {setBlogTitle(target.value)}}
          />
        </div>
        <div>
          author:
          <input
            type='text'
            value={blogAuthor}
            name='Blogauthor'
            onChange={({ target }) => {setBlogAuthor(target.value)}}
          />
        </div>
        <div>
          url:
          <input
            type='text'
            value={blogUrl}
            name='Blogurl'
            onChange={({ target }) => {setBlogUrl(target.value)}}
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm