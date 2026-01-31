module.exports = {
  layout: "blog-post.njk",
  permalink: data => `/blog/${data.page.fileSlug}/index.html`,
};
