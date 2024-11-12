const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({}).populate("user", {
    username: 1,
    name: 1,
    id: 1,
  });
  res.json({ blogs });
});

blogRouter.post("/", middleware.userExtractor, async (req, res) => {
  const user = req.user;
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ error: "Title and URL are required" });
  }

  const blog = new Blog({ ...req.body, user: user._id });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  res.status(201).json(savedBlog);
});

blogRouter.delete("/:id", middleware.userExtractor, async (req, res) => {
  const user = req.user;

  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    return res.status(404).json({ error: "Blog not found" });
  }

  if (blog.user.toString() !== user._id.toString()) {
    return res
      .status(403)
      .json({ error: "You are not authorized to delete this blog" });
  }

  await Blog.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

blogRouter.put("/:id", async (req, res) => {
  const { likes } = req.body;
  const updatedBlog = { likes };

  const result = await Blog.findByIdAndUpdate(req.params.id, updatedBlog, {
    new: true,
  });

  if (result) {
    res.json(result);
  } else {
    res.status(404).json({ error: "Blog not found" });
  }
});

module.exports = blogRouter;
