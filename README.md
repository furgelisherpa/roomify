# Roomify

A modern, production-ready full-stack React application built with React Router v7, TypeScript, and TailwindCSS.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS v4 for styling
- 🧹 ESLint v10 + Prettier for code quality
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

## Available Scripts

| Script | Command | Description |
|---|---|---|
| **dev** | `npm run dev` | Start the development server with HMR |
| **build** | `npm run build` | Create a production build |
| **start** | `npm run start` | Serve the production build |
| **typecheck** | `npm run typecheck` | Run TypeScript type-checking |
| **lint** | `npm run lint` | Check for ESLint errors |
| **lint:fix** | `npm run lint:fix` | Auto-fix ESLint errors |
| **format** | `npm run format` | Format all files with Prettier |
| **format:check** | `npm run format:check` | Check formatting without writing changes |

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

Serve the production build:

```bash
npm run start
```

## Code Quality

### Linting

Check for errors:

```bash
npm run lint
```

Auto-fix fixable issues:

```bash
npm run lint:fix
```

### Formatting

Format the entire codebase:

```bash
npm run format
```

Check formatting without making changes (useful in CI):

```bash
npm run format:check
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t roomify .

# Run the container
docker run -p 3000:3000 roomify
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`:

```
├── package.json
├── package-lock.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This project uses [Tailwind CSS v4](https://tailwindcss.com/) for styling.

---

Built with ❤️ using React Router.
