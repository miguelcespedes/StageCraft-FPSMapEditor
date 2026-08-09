# StageCraft FPS Map Editor

[English](./README.md) | [Español](./README.es.md)

StageCraft FPS Map Editor is an educational browser-based 3D scene explorer for modular FPS map content.

It loads an `.obj` + `.mtl` arena with `Three.js`, provides smooth navigation controls, and lets you inspect individual map parts visually inside a React + TypeScript application.

## Overview

This project was created as a small educational editor-style viewer focused on:

- exploring a modular FPS arena in real time
- inspecting individual scene elements by name
- studying a clean frontend architecture around a 3D workflow
- building and deploying a static web application with production assets

## Features

- Loads a modular FPS arena from `arena.obj` and `arena.mtl`
- Renders the scene in the browser with `Three.js`
- Uses smooth orbit-style navigation with double-click refocus
- Supports inspector mode for selecting and identifying scene pieces
- Highlights selected 3D elements visually
- Shows an inline label for the selected object
- Builds a production-ready `dist/` folder with bundled app code and copied static assets

## Educational Focus

This project is educational.

It is intended as a practical reference for learning:

- browser-based 3D rendering
- modular frontend architecture
- React + TypeScript integration with `Three.js`
- scene inspection workflows for FPS-style map content
- static deployment with GitHub Pages

## Tech Stack

- React
- TypeScript
- Vite
- Three.js

## Project Structure

```text
src/
  application/      Application services and ports
  domain/           Domain-level types
  infrastructure/   Three.js implementation details
  styles/           Global styles
  ui/               React UI components
public/
  arena.obj
  arena.mtl
```

## Available Scripts

- `npm run dev`: start the local development server
- `npm run build`: create the production build in `dist/`
- `npm run preview`: preview the production build locally
- `npm run typecheck`: run TypeScript checks without emitting files

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Build Output

Production builds are generated in `dist/`.

That output contains:

- the generated `index.html`
- bundled JavaScript and CSS assets
- copied static arena assets from `public/`

## Deployment

The repository includes a GitHub Actions workflow for publishing the `dist/` output to GitHub Pages.

For Pages deployment to work correctly, the repository must have GitHub Pages enabled with `GitHub Actions` as the source.

## License And Usage

This project is educational and may be used freely as long as the MIT License is respected.

See `LICENSE` for details.

## Spanish Documentation

Spanish documentation is available in `README.es.md`.
