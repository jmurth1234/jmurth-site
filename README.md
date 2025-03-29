# jmurth-site: Personal Portfolio & Blog

This is a personal website built with Next.js and Payload CMS, featuring a portfolio of projects and a blog.

## Technologies

- **Next.js 15**: Modern React framework with app router
- **Payload CMS 3.0**: Headless CMS running natively within Next.js
- **MongoDB**: Database backend for content storage
- **TailwindCSS**: Utility-first CSS framework
- **Lexical Rich Text Editor**: Content editing
- **Docker**: Containerization for development and deployment

## Project Structure

- `/src/app/(app)`: Frontend routes and pages
- `/src/app/(payload)`: Payload CMS admin interface
- `/src/collections`: Content models for Payload CMS
- `/src/components`: Reusable React components
- `/src/content`: Markdown content for projects, posts, and pages
- `/src/globals`: Global content definitions

## Setup Instructions

1. Clone the repository
2. Copy `.env.example` to `.env` and configure the MongoDB connection string
3. Install dependencies:
   ```
   pnpm install
   ```
4. Start the development server:
   ```
   pnpm dev
   ```
5. Access the site at http://localhost:3000
6. Access the CMS admin at http://localhost:3000/admin

## Docker Deployment

A Docker configuration is included for containerized deployment:

```
docker-compose up -d
```

## Content Management

The site uses Payload CMS with collections for:
- Projects
- Blog posts
- Pages
- Media
- Users