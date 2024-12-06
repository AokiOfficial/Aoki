import { build } from 'esbuild';

build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  sourcemap: false,
  keepNames: true,
  format: "esm",
  platform: 'node',
  target: 'node18',
  outfile: 'dist/main.js'
}).catch(() => process.exit(1));