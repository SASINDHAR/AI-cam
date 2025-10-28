import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/kidlearn/',  // Your repo name
  server: {
    host: '0.0.0.0',   // this allows access from other devices on the network
    port: 5173         // you can change this if needed
  },
  plugins: [react(),
    // Plugin to copy 404.html to the dist folder
    {
      name: 'copy-404-html',
      closeBundle: () => {
        // Create 404.html content
        const html404 = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Fun Learn</title>
    <script type="text/javascript">
      var pathSegmentsToKeep = 1;
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, 1 + pathSegmentsToKeep).join('/') + '/?/' +
        l.pathname.slice(1).split('/').slice(pathSegmentsToKeep).join('/').replace(/&/g, '~and~') +
        (l.search ? '&' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body>
  </body>
</html>`;

        // Write the 404.html file directly to the dist folder
        fs.writeFileSync('./dist/404.html', html404);
      }
    }
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist'
  }
});