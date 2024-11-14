import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'ABC',
    author: "Tony"
  }

  const {container} = render(<Blog blog={blog} />)

  const div= container.querySelector('.blog')
  expect(div).toHaveTextContent('ABC Tony')
})

test('shows URL and likes when view button is clicked', async () => {
  const blog = {
    title: 'ABC',
    author: 'Tony',
    url: 'http://example.com',
    likes: 10,
    user: { name: 'User', username: 'user123' }
  }

  render(<Blog blog={blog}/>)

  // Initially, URL and likes should not be visible
  expect(screen.queryByText('http://example.com')).toBeNull()
  expect(screen.queryByText('likes 10')).toBeNull()

  // Click the view button to show details
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // After clicking, URL and likes should be visible
  expect(screen.getByText('http://example.com')).toBeDefined()
  expect(screen.getByText('likes 10')).toBeDefined()
})

test('calls event handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'ABC',
    author: 'Tony',
    url: 'http://example.com',
    likes: 10,
    user: { name: 'User', username: 'user123' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler}/>)

  // Click the view button to show details
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  // Click the like button
  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  
  expect(mockHandler.mock.calls).toHaveLength(2)
})