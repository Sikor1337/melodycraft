// Build-time prerender (A443, 13.11.2026): `npm run build` renders <App /> to static HTML
// and prerender.mjs writes it into dist/index.html, so the first screen is visible before
// any JavaScript runs. index.tsx then hydrates that markup instead of rendering from scratch.
import { renderToString } from 'react-dom/server';
import App from './App';

export function render(): string {
  return renderToString(<App />);
}
