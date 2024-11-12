// const { test, after, beforeEach, describe } = require("node:test");
// const assert = require("node:assert");
// const mongoose = require("mongoose");
// const supertest = require("supertest");
// const app = require("../app");
// const Blog = require("../models/blog");
// const api = supertest(app);
// const helper = require("./test_helper");

// beforeEach(async () => {
//   await Blog.deleteMany({});
//   const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
//   const promiseArray = blogObjects.map((blog) => blog.save());
//   await Promise.all(promiseArray);
// });

// describe("Blog API Tests", () => {
  
//   describe("Fetching blogs", () => {
//     test("blogs are returned as JSON", async () => {
//       await api
//         .get("/api/blogs")
//         .expect(200)
//         .expect("Content-Type", /application\/json/);
//     });

//     test("all blogs are returned", async () => {
//       const response = await api.get("/api/blogs");
//       assert.strictEqual(response.body.length, helper.initialBlogs.length);
//     });

//     test("a specific blog's unique identifier is 'id'", async () => {
//       const response = await api.get("/api/blogs");
//       const blog = response.body[0];
//       assert.ok(blog.id);
//       assert.strictEqual(blog._id, undefined);
//     });
//   });

//   describe("Adding a new blog", () => {
//     test("succeeds with valid data", async () => {
//       const newBlog = {
//         title: "New Blog Post",
//         author: "John Doe",
//         url: "http://example.com",
//         likes: 3,
//       };

//       await api
//         .post("/api/blogs")
//         .send(newBlog)
//         .expect(201)
//         .expect("Content-Type", /application\/json/);

//       const blogs = await helper.blogsInDb();
//       const titles = blogs.map((b) => b.title);

//       assert.strictEqual(blogs.length, helper.initialBlogs.length + 1);
//       assert(titles.includes("New Blog Post"));
//     });

//     test("defaults 'likes' to 0 if 'likes' property is missing", async () => {
//       const newBlog = {
//         title: "No Likes Blog",
//         author: "Jane Doe",
//         url: "http://example.com/nolikes",
//       };

//       const response = await api
//         .post("/api/blogs")
//         .send(newBlog)
//         .expect(201)
//         .expect("Content-Type", /application\/json/);

//       assert.strictEqual(response.body.likes, 0);
//     });

//     test("responds with 400 if 'title' is missing", async () => {
//       const newBlog = {
//         author: "John Doe",
//         url: "http://example.com/no-title",
//         likes: 5,
//       };

//       await api.post("/api/blogs").send(newBlog).expect(400);
//     });

//     test("responds with 400 if 'url' is missing", async () => {
//       const newBlog = {
//         title: "Missing URL",
//         author: "Jane Doe",
//         likes: 10,
//       };

//       await api.post("/api/blogs").send(newBlog).expect(400);
//     });
//   });

//   describe("Deleting a blog", () => {
//     test("succeeds with status code 204 if id is valid", async () => {
//       const blogsAtStart = await helper.blogsInDb();
//       const blogToDelete = blogsAtStart[0];

//       await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

//       const blogsAtEnd = await helper.blogsInDb();
//       assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);
//       assert(!blogsAtEnd.some((b) => b.id === blogToDelete.id));
//     });

//     test("responds with 404 if blog ID does not exist", async () => {
//       const nonExistentIdValue = await helper.nonExistingId();
//       await api.delete(`/api/blogs/${nonExistentIdValue}`).expect(404);
//     });
//   });

//   describe("Updating a blog's likes", () => {
//     test("updates the number of likes for a blog post", async () => {
//       const blogsAtStart = await helper.blogsInDb();
//       const blogToUpdate = blogsAtStart[0];

//       const updatedLikes = blogToUpdate.likes + 1;

//       const response = await api
//         .put(`/api/blogs/${blogToUpdate.id}`)
//         .send({ likes: updatedLikes })
//         .expect(200)
//         .expect("Content-Type", /application\/json/);

//       assert.strictEqual(response.body.likes, updatedLikes);
//     });

//     test("responds with 404 if blog ID does not exist", async () => {
//       const nonExistentIdValue = await helper.nonExistingId();
//       await api.put(`/api/blogs/${nonExistentIdValue}`).send({ likes: 5 }).expect(404);
//     });
//   });
// });

// after(async () => {
//   await mongoose.connection.close();
// });
