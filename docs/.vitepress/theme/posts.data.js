import { createContentLoader } from 'vitepress'

/**
 * 加载所有博客文章
 */
export default createContentLoader('blog/**/*.md', {
  excerpt: true,
  transform(rawData) {
    return rawData
      .filter(page => page.frontmatter.date)
      .map(page => ({
        url: page.url,
        frontmatter: page.frontmatter
      }))
  }
}) 