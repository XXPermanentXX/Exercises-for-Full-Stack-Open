import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

test('<BlogForm /> calls handleCreate with the correct details on submit', async () => {
  const mockHandleCreate = vi.fn()
  const user = userEvent.setup()

  const { container }=render(<BlogForm handleCreate={mockHandleCreate} />)

  // Get input fields and submit button by id
  const titleInput = container.querySelector('#title')
  const authorInput = container.querySelector('#author')
  const urlInput = container.querySelector('#url')
  const submitButton = screen.getByText('create')

  // Simulate user typing in each input field
  await user.type(titleInput, 'New Blog Title')
  await user.type(authorInput, 'Blog Author')
  await user.type(urlInput, 'http://example.com')

  // Simulate clicking the submit button
  await user.click(submitButton)

  // Check that handleCreate was called once and with the correct argument
  expect(mockHandleCreate).toHaveBeenCalledTimes(1)
  expect(mockHandleCreate).toHaveBeenCalledWith({
    title: 'New Blog Title',
    author: 'Blog Author',
    url: 'http://example.com',
  })
})
