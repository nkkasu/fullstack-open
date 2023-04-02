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
            id='blogtitle'
            type='text'
            value={blogTitle}
            name='Blogtitle'
            onChange={({ target }) => {setBlogTitle(target.value)}}
          />
        </div>
        <div>
          author:
          <input
            id='blogauthor'
            type='text'
            value={blogAuthor}
            name='Blogauthor'
            onChange={({ target }) => {setBlogAuthor(target.value)}}
          />
        </div>
        <div>
          url:
          <input
            id='blogurl'
            type='text'
            value={blogUrl}
            name='Blogurl'
            onChange={({ target }) => {setBlogUrl(target.value)}}
          />
        </div>
        <button id='submitbutton' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm