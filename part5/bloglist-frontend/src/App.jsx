import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import BlogForm from "./components/BlogForm";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import Togglable from "./components/Togglable";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const blogFormRef = useRef();

  const showNotification = (message, isError = false) => {
    isError ? setErrorMessage(message) : setMessage(message);
    setTimeout(() => {
      isError ? setErrorMessage(null) : setMessage(null);
    }, 3000);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      showNotification(`Welcome, ${user.name}!`);
    } catch (exception) {
      showNotification("Wrong username or password", true);
    }
  };

  const handleCreate = async (newBlog) => {
    try {
      blogFormRef.current.toggleVisibility();
      const savedBlog = await blogService.createBlog(newBlog);
      setBlogs(blogs.concat(savedBlog));
      showNotification(
        `A new blog "${savedBlog.title}" by ${savedBlog.author} added`
      );
    } catch (exception) {
      showNotification("Error creating blog", true);
    }
  };

  const handleLike = async (blog) => {
    try {
      const updatedBlog = await blogService.updateBlog(blog.id, {
        ...blog,
        likes: blog.likes + 1,
      });
      setBlogs(
        blogs.map((b) => (b.id === updatedBlog.id ? updatedBlog : b))
      );
      showNotification("Blog liked successfully!", false);
    } catch (exception) {
      showNotification("Error updating blog", true);
    }
  };

  const handleRemove = async (blog) => {
    const confirmRemove = window.confirm(
      `Remove blog "${blog.title}" by ${blog.author}`
    );
    if (confirmRemove) {
      try {
        await blogService.deleteBlog(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        showNotification(`Blog "${blog.title}" removed successfully!`);
      } catch (exception) {
        showNotification("Error removing blog", true);
      }
    }
  };

  useEffect(() => {
    blogService.getAllBlogs().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  if (user === null)
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={message} errorMessage={errorMessage} />
        <LoginForm handleLogin={handleLogin} />
      </div>
    );

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} errorMessage={errorMessage} />

      <div style={{ marginBottom: "20px" }}>
        <span>{user.name} logged in</span>
        <button
          onClick={() => {
            window.localStorage.removeItem("loggedBlogAppUser");
            setUser(null);
            showNotification("Logged out successfully");
          }}
        >
          logout
        </button>
      </div>

      <h2>Create new</h2>
      <Togglable buttonLabel="new note" ref={blogFormRef}>
        <BlogForm handleCreate={handleCreate} />
      </Togglable>

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={handleLike}
            handleRemove={handleRemove}
          />
        ))}
    </div>
  );
};

export default App;
