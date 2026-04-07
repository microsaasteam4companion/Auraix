import { MetadataRoute } from 'next';
import { BLOGS } from '@/lib/blogs-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://auraix.entrext.com';

  // Base pages
  const routes = ['', '/blogs', '/terms', '/privacy', '/cookie'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Individual blog posts
  const blogPosts = BLOGS.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...routes, ...blogPosts];
}
