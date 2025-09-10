import {createClient} from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
})

// API methods for content retrieval
export const api = {
  // Get latest posts for homepage
  getLatestPosts: () => client.fetch(`
    *[_type == "post" && defined(publishedAt)] | order(publishedAt desc)[0...10] {
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { 
        asset->{_id, url}, 
        alt, 
        caption 
      },
      categories[]->{
        title, 
        slug
      },
      author->{
        name, 
        slug
      }
    }
  `),

  // Get single post by slug
  getPost: (slug) => client.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { 
        asset->{_id, url}, 
        alt, 
        caption 
      },
      categories[]->{
        title, 
        slug, 
        description
      },
      author->{
        name, 
        slug, 
        bio, 
        image { 
          asset->{_id, url} 
        }
      },
      body
    }
  `, { slug }),

  // Get paginated posts with optional category filter
  getPosts: (start = 0, end = 8, category = null) => client.fetch(`
    *[_type == "post" && defined(publishedAt) && (!defined($category) || $category in categories[]->slug.current)] | order(publishedAt desc)[$start...$end] {
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { 
        asset->{_id, url}, 
        alt, 
        caption 
      },
      categories[]->{
        title, 
        slug
      },
      author->{
        name, 
        slug
      }
    }
  `, { start, end, category }),

  // Get total post count for pagination
  getPostCount: (category = null) => client.fetch(`
    count(*[_type == "post" && defined(publishedAt) && (!defined($category) || $category in categories[]->slug.current)])
  `, { category }),

  // Get all categories
  getCategories: () => client.fetch(`
    *[_type == "category"] | order(title asc) {
      title,
      slug,
      description,
      "postCount": count(*[_type == "post" && references(^._id)])
    }
  `),

  // Get posts by author
  getPostsByAuthor: (authorSlug) => client.fetch(`
    *[_type == "post" && defined(publishedAt) && author->slug.current == $authorSlug] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { 
        asset->{_id, url}, 
        alt, 
        caption 
      },
      categories[]->{
        title, 
        slug
      }
    }
  `, { authorSlug }),

  // Get author by slug
  getAuthor: (slug) => client.fetch(`
    *[_type == "author" && slug.current == $slug][0] {
      name,
      slug,
      bio,
      image { 
        asset->{_id, url} 
      }
    }
  `, { slug }),

  // Search posts by title or excerpt
  searchPosts: (query) => client.fetch(`
    *[_type == "post" && defined(publishedAt) && (title match $query || excerpt match $query)] | order(publishedAt desc) {
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { 
        asset->{_id, url}, 
        alt, 
        caption 
      },
      categories[]->{
        title, 
        slug
      },
      author->{
        name, 
        slug
      }
    }
  `, { query: `*${query}*` }),

  // Get related posts (posts with similar categories)
  getRelatedPosts: (postId, categoryIds, limit = 3) => client.fetch(`
    *[_type == "post" && defined(publishedAt) && _id != $postId && count(categories[]._ref[@ in $categoryIds]) > 0] | order(publishedAt desc)[0...$limit] {
      title,
      slug,
      publishedAt,
      excerpt,
      mainImage { 
        asset->{_id, url}, 
        alt, 
        caption 
      },
      categories[]->{
        title, 
        slug
      },
      author->{
        name, 
        slug
      }
    }
  `, { postId, categoryIds, limit })
}

// Utility functions for URL building
export const urlBuilder = (source) => {
  return `${source}?w=800&h=600&fit=crop&crop=center`
}

export const getImageUrl = (image, width = 800, height = 600) => {
  if (!image?.asset?.url) return null
  return `${image.asset.url}?w=${width}&h=${height}&fit=crop&crop=center`
}

// Helper function to convert Sanity block content to plain text
export const blockContentToPlainText = (blocks) => {
  if (!blocks) return ''
  
  return blocks
    .filter(block => block._type === 'block')
    .map(block => block.children?.map(child => child.text).join('') || '')
    .join(' ')
}