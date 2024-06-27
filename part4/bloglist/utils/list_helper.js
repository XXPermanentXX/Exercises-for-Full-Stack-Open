const _ = require("lodash");

const totalLikes = (blogs) => {
  return blogs.reduce((sum, current) => sum + current.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return {};
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
  const targetBlog = sortedBlogs[0];
  return {
    title: targetBlog.title,
    author: targetBlog.author,
    likes: targetBlog.likes,
  };
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return {};
  const authorBlogsCounts = _.countBy(blogs, "author");
  const topAuthor = _.maxBy(
    Object.keys(authorBlogsCounts),
    (author) => authorBlogsCounts[author],
  );
  return {
    author: topAuthor,
    blogs: authorBlogsCounts[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return {};
  const groupedBlogs = _.groupBy(blogs, "author");
  const authorLikesCounts = _.map(groupedBlogs, (blogs, author) => ({
    author: author,
    likes: _.sumBy(blogs, "likes"),
  }));
  return _.maxBy(authorLikesCounts, "likes");
};

module.exports = {
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
