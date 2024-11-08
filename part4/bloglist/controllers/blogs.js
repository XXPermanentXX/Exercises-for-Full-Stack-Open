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

blogRouter.delete("/:id", async (req, res) => {
  try {
    const result = await Blog.findByIdAndDelete(req.params.id);
    if (result) {
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: "Invalid ID format" });
  }
});

blogRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;
  const updatedBlog = { likes };

  try {
    const result = await Blog.findByIdAndUpdate(
      req.params.id,
      updatedBlog,
      { new: true}
    );

    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "Blog not found" });
    }
  } catch (error) {
    logger.error(error);
    res.status(400).json({ error: "Invalid data or ID format" });
  }
});



module.exports = blogRouter;
