const { test, after, describe, beforeEach } = require("node:test");
const assert = require("node:assert");
const Blog = require("../models/blog");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");

const api = supertest(app);

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
];

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

describe("step 1", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("there are two blogs", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, 2);
  });
});

describe("step 2", () => {
  test("unique identifier property is id", async () => {
    const response = await api.get("/api/blogs");
    const blog = response.body[0];
    assert.ok(blog.id);
    assert.strictEqual(blog._id, undefined);
  });
});

describe("step 3", () => {
  test("a valid blog can be added", async () => {
    const newBlog = {
      title: "New Blog Post",
      author: "John Doe",
      url: "http://example.com",
      likes: 3,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");

    const titles = response.body.map((r) => r.title);

    assert.strictEqual(response.body.length, initialBlogs.length + 1);

    assert(titles.includes("New Blog Post"));
  });
});

describe("step 4", () => {
  test("if likes property is missing, it defaults to 0", async () => {
    const newBlog = {
      title: "No Likes Blog",
      author: "Jane Doe",
      url: "http://example.com/nolikes",
      // 'likes' is intentionally omitted to test default value
    };

    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    // Check that likes defaulted to 0
    assert.strictEqual(response.body.likes, 0);
  });
});

describe("step 5", () => {
  test("responds with 400 Bad Request if title is missing", async () => {
    const newBlog = {
      author: "John Doe",
      url: "http://example.com/no-title",
      likes: 5,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });

  test("responds with 400 Bad Request if url is missing", async () => {
    const newBlog = {
      title: "Missing URL",
      author: "Jane Doe",
      likes: 10,
    };

    await api.post("/api/blogs").send(newBlog).expect(400);
  });
});

after(async () => {
  await mongoose.connection.close();
});
