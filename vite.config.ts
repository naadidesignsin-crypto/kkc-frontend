import { facts, seoPages } from './scripts/seo-pages.mjs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'kkc-readable-event-pages',
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const url = new URL(request.url || '/', 'http://localhost');
          const imageFiles = new Map([
            ['/seo-assets/kkc-logo.png', './src/assets/kkc-logo.png'],
            ['/seo-assets/karthika-main.png', './src/assets/events/karthika-masam-main-2026.png'],
            ...facts.programmes.map(item => ['/seo-assets/' + item.image, './src/assets/events/' + item.image]),
          ]);
          const imageFile = imageFiles.get(url.pathname);
          if (imageFile) {
            response.setHeader('Content-Type', imageFile.endsWith('.png') ? 'image/png' : 'image/jpeg');
            response.end(readFileSync(fileURLToPath(new URL(imageFile, import.meta.url))));
            return;
          }
          if (!url.pathname.startsWith('/events/')) return next();
          const path = url.pathname.endsWith('/') ? url.pathname : url.pathname + '/';
          const page = seoPages.get(path);
          if (!page) {
            response.statusCode = 404;
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end('<h1>Page not found</h1><a href="/">KKC homepage</a>');
            return;
          }
          if (url.pathname !== path) {
            response.statusCode = 308;
            response.setHeader('Location', path + url.search);
            response.end();
            return;
          }
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.end(page);
        });
      },
    },
    {
      name: 'kkc-registration-local-preview',
      // Available only on the development server, never in production output.
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          const url = new URL(request.url || '/', 'http://localhost');
          if (!['/registration-preview', '/registration-preview/telugu', '/registration-preview/english'].includes(url.pathname)) return next();
          const source = readFileSync(
            fileURLToPath(new URL('./integrations/Registration.html', import.meta.url)), 'utf8',
          ).replace('<?= environment ?>', 'local')
            .replace('<?= initialLanguage ?>', url.pathname.endsWith('/telugu') || url.searchParams.get('lang') === 'te' ? 'te' : 'en');
          response.setHeader('Content-Type', 'text/html; charset=utf-8');
          response.setHeader('Cache-Control', 'no-store');
          response.end(source);
        });
      },
    },
  ],
  server: { port: 5173, host: true },
});
