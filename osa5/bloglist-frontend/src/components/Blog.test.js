import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Test rendering the blog', () => {

  beforeEach(() => {
    const blog = {
      author: 'Whatever Name',
      title: 'Completely Random',
      url: 'www.website.com',
      likes: 1000,
      user: { name: 'Guy' }
    }
    render(<Blog blog={blog} />)
  })
  test('Test that blog title and author shows correctly', () => {



    const element = screen.getByText('Completely Random Whatever Name')
    expect(element).toBeDefined()

    const url = screen.queryByText('www.website.com', { exact: false })
    expect(url).not.toBeVisible()

    const likes = screen.queryByText('likes 1000', { exact: false })
    expect(likes).not.toBeVisible()
  })
  test('Test that url, likes and user shows when button pressed', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.queryByText('www.website.com', { exact: false })
    expect(url).toBeVisible()

    const likes = screen.queryByText('likes 1000', { exact: false })
    expect(likes).toBeVisible()

    const creator = screen.queryByText('Guy', { exact: false })
    expect(creator).toBeVisible()
  })
})


test('Test that like button calls handler twice', async () => {
  const blog = {
    author: 'Whatever Name',
    title: 'Completely Random',
    url: 'www.website.com',
    likes: 1000,
    user: { name: 'Guy' }
  }
  const mockHandler = jest.fn()
  render(<Blog blog={blog} updateLike={mockHandler}/>)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(mockHandler.mock.calls).toHaveLength(2)
})
