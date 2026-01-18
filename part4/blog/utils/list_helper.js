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
    return blogs.reduce((favorite, current) => {
        return current.likes > favorite.likes ? current : favorite
    })
}

module.exports = { dummy, totalLikes, favoriteBlog }