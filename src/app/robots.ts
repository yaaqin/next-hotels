import type { MetadataRoute } from 'next'
import { SITE_URL } from './(publicAccess)/(publicDashboard2)/hotel/hotel.helper'

// Index / noindex diatur per halaman lewat meta robots; di sini cuma area privat yang ditutup
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard', '/restaurant', '/login', '/api/', '/testing'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
