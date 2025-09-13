# AI Career Pathfinder — React + Serverless

## How it works
- React frontend presents quiz → generates top career matches.
- Serverless function `/api/explain.js` safely calls OpenAI API to generate explanations.

## Setup
1. Clone repo
2. Run `npm install` (create-react-app or Vite recommended)
3. Add an environment variable `OPENAI_API_KEY` in your hosting provider (Vercel/Netlify)
4. Deploy!

## Deployment
- **Vercel**: Import GitHub repo, auto-detect React, deploy.
- **Netlify**: Same, plus add `api/explain.js` as a Netlify Function.
