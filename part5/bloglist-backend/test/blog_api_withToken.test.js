const { test, after, beforeEach, describe } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Blog = require('../models/blog');
const api = supertest(app);
const helper = require("./test_helper");
const jwt = require("jsonwebtoken");

let token;

beforeEach(async () => {
  await User.deleteMany({});
  await Blog.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', name: 'Superuser', passwordHash });
  await user.save();

  const userForToken = { username: user.username, id: user._id };
  token = jwt.sign(userForToken, process.env.SECRET);

  const blogObjects = helper.initialBlogs.map((blog) => new Blog({ ...blog, user: user._id }));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("Blog API Tests", () => {
  
  describe("Adding a new blog", () => {
    test("succeeds with valid data and token", async () => {
      const newBlog = {
        title: "New Blog Post",
        author: "John Doe",
        url: "http://example.com",
        likes: 3,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`) // 设置请求头，包含 token
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const blogs = await helper.blogsInDb();
      const titles = blogs.map((b) => b.title);

      assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
      assert(titles.includes("New Blog Post"));
    });

    test("fails with status 401 Unauthorized if token is not provided", async () => {
      const newBlog = {
        title: "Unauthorized Blog",
        author: "No Token Author",
        url: "http://example.com/no-token",
        likes: 1,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401) // 期望返回 401 Unauthorized
        .expect("Content-Type", /application\/json/);
    });

    test("defaults 'likes' to 0 if 'likes' property is missing", async () => {
      const newBlog = {
        title: "No Likes Blog",
        author: "Jane Doe",
        url: "http://example.com/nolikes",
      };

      const response = await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`) // 设置请求头，包含 token
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      assert.strictEqual(response.body.likes, 0);
    });

    test("responds with 400 if 'title' is missing", async () => {
      const newBlog = {
        author: "John Doe",
        url: "http://example.com/no-title",
        likes: 5,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`) // 设置请求头，包含 token
        .send(newBlog)
        .expect(400);
    });

    test("responds with 400 if 'url' is missing", async () => {
      const newBlog = {
        title: "Missing URL",
        author: "Jane Doe",
        likes: 10,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`) // 设置请求头，包含 token
        .send(newBlog)
        .expect(400);
    });
  });

  describe("Deleting a blog", () => {
    test("succeeds with status code 204 if id is valid and token is provided", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
      assert(!blogsAtEnd.some((b) => b.id === blogToDelete.id));
    });

    test("responds with 401 if token is not provided when attempting to delete", async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test("responds with 404 if blog ID does not exist", async () => {
      const nonExistentIdValue = await helper.nonExistingId();
      await api
        .delete(`/api/blogs/${nonExistentIdValue}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
