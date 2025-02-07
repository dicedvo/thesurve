export const seo = ({
  title,
  description,
  keywords,
  image,
  author,
  ogType = 'website',
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
  author?: string
  ogType?: 'website' | 'article' | 'profile'
}) => {
  const tags = [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'og:type', content: ogType },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    ...(author ? [
      { name: 'author', content: author },
      { name: 'og:author', content: author },
      { property: 'article:author', content: author }
    ] : []),
    ...(image ? [
      { name: 'twitter:image', content: image },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'og:image', content: image },
    ] : []),
  ]

  return tags
}
