var _ = require('lodash')
const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }
  return blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce(function(prev, current) {
    return (prev.likes > current.likes) ? prev : current
  })
  return favorite
}

const mostBlogs = (blogs) => {
  const allAuthors = _.countBy(blogs, 'author')
  const author = _.maxBy(_.keys(allAuthors), (function(name) {return name}))
  return { author: author, blogs: _.get(allAuthors, author) }
}
const mostLikes = (blogs) => {
  const allAuthors = _.groupBy(blogs, 'author')
  const likesByAuthor = _.mapValues(allAuthors, blog => {
    return blog.reduce((total, single) => {
      return total + single.likes
    }, 0)
  })
  const mostLiked = _.maxBy(
    Object.entries(likesByAuthor),
    ([key, value]) => value)
  return { author: mostLiked[0], likes: mostLiked[1] }
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}