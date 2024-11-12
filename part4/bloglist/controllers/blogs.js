const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const User = require('../models/user')

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1, id: 1});
  res.json({blogs});
});

blogRouter.post("/", async (req, res) => {
  const {title, url, userId} = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  const user = await User.findById(userId)

  const blog = new Blog({ ...req.body, user: userId });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (req, res) => {
  const result = await Blog.findByIdAndDelete(req.params.id);
  if (result) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

blogRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;
  const updatedBlog = { likes };

  const result = await Blog.findByIdAndUpdate(
    req.params.id,
    updatedBlog,
    { new: true }
  );

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

module.exports = blogRouter;
