import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [
    react(),
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
