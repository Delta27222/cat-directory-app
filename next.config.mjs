import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

/**
 * La app corre con **SSR**: un servidor Node de Next empaquetado como salida
 * `standalone`. `.next/standalone` trae un `server.js` mínimo que el
 * Dockerfile arranca sin arrastrar todo `node_modules`.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: 'standalone',
  outputFileTracingRoot: HERE,
};

export default nextConfig;
