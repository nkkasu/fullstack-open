import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Test creating a new blog', async () => {
  const blog = {
    title: 'Totally Random Title',
    author: 'Author Unknown',
    url: 'www.website.com'
  }
  const user = userEvent.setup()
  const createNote = jest.fn()
  const { container } = render(<BlogForm handleCreateNewBlog={ createNote } />)


  const blogTitle = container.querySelector('#blogtitle')
  const blogAuthor = container.querySelector('#blogauthor')
  const blogUrl = container.querySelector('#blogurl')

  await user.type(blogTitle, blog.title)
  await user.type(blogAuthor, blog.author)
  await user.type(blogUrl, blog.url)

  const submitButton = container.querySelector('#submitbutton')

  await user.click(submitButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0]).toBe('Totally Random Title')
  expect(createNote.mock.calls[0][1]).toBe('Author Unknown')
  expect(createNote.mock.calls[0][2]).toBe('www.website.com')

})