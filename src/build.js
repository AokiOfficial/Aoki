import { build } from 'esbuild';

build({
  entryPoints: ['src/main.js'],
  bundle: true,
  minify: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/main.js',
  external: [
    'discord.js'
  ],
}).catch(() => process.exit(1));