const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const { response } = require("express");

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (error) {
    logger.error(error);
    res.status(500).json({ error: "Failed to retrieve blogs" });
  }
});

blogRouter.post("/", async (req, res) => {
  if (!req.body.title || !req.body.url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }


  try {
    const blog = new Blog(req.body);
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: "Failed to save blog" });
  }
});

module.exports = blogRouter;
