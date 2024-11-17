import { useState } from 'react'

const Blog = ({ blog, user, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div className="blog">
        {blog.title} {blog.author + ' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div className='details'>
          <p>{blog.url}</p>
          <p>
            likes {blog.likes}{' '}
            <button
              onClick={() => {
                handleLike(blog)
              }}
            >
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          {user && blog.user.username === user.username && (
            <button onClick={() => handleRemove(blog)}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
