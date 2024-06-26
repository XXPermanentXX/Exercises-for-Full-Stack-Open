const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");
const {response} = require("express");

blogRouter.get("/", (req, res) => {
  Blog.find({}).then((blogs) => {
    res.json(blogs);
  });
});

blogRouter.post('/',(req,res)=>{
    const blog=new Blog(req.body)

    blog.save().then(savedBlog=>{
        res.status(201).json(savedBlog)
    })
})

module.exports=blogRouter