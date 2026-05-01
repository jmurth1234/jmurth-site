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

For local container testing, copy the template and start the stack:

```
cp docker-compose.template.yml docker-compose.yml
docker-compose up -d
```

For production Docker Swarm deployment, set `PAYLOAD_SECRET` in the environment or in
`.env`, then run:

```
./deploy.sh
```

The deployment script builds the image with pnpm, tags it with the current commit, and
deploys `docker-stack.yml`. `SITE_URL`, `PAYLOAD_PUBLIC_SITE_URL`, and
`NEXT_PUBLIC_SITE_URL` default to `https://jmurth.co.uk` and can be overridden for
another domain. Traefik serves the site on host port `3333`; its insecure dashboard is
mapped to host port `3334` for server-side debugging only.

For test deployments alongside the live container, override `STACK_NAME`, `HTTP_PORT`,
`TRAEFIK_DASHBOARD_PORT`, and `SITE_HOST` so the test stack does not register the same
Traefik host rule as production. Set `SKIP_BUILD=true` to deploy an image tag that has
already been built.

## Content Management

The site uses Payload CMS with collections for:
- Projects
- Blog posts
- Pages
- Media
- Users
