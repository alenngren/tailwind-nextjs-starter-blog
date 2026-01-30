# CLAUDE.md - Latent Capital

## Purpose
Generate interest and leads. Increase surface area for opportunities (quant roles, collaborations, interesting projects). Show by doing — no grand declarations.

## Owner
Alexander Lenngren — Physics MSc at Chalmers, transitioning to quant finance.

## Stack
Next.js 14 (App Router), Tailwind CSS v4, Contentlayer, MDX.

## Key Files
- `data/siteMetadata.js` — site config (title, description, social links)
- `data/headerNavLinks.ts` — navigation
- `data/authors/default.mdx` — about page content
- `data/projectsData.ts` — projects list
- `data/blog/` — blog posts (MDX)
- `public/static/cv.pdf` — CV file

## Commands
- `yarn dev` — dev server (localhost:3000)
- `yarn build` — production build

## Adding Content

### Blog Posts
Add `.mdx` to `data/blog/`:
```yaml
---
title: 'Post Title'
date: '2026-01-30'
tags: ['tag1']
draft: false
summary: 'Brief summary'
---
```

### Projects
Edit `data/projectsData.ts`:
```ts
{ title: 'Name', description: '...', href: '/blog/post-slug', imgSrc: '/static/images/img.png' }
```

### CV
Replace `public/static/cv.pdf`

## Style
- Understated, let work speak
- Physics/quant credible
- No over-explaining — people understand
- Minimal, no unnecessary features

## Deployment
Vercel auto-deploys on push to GitHub.
URL: https://latent-capital-git-vercel-react-serv-dc617f-alenngrens-projects.vercel.app
Repo: https://github.com/alenngren/tailwind-nextjs-starter-blog

## Git
Push requires SSH key (not configured in Claude's env). User pushes manually: `git push`
