// save build means no token or secret is included in the distribution file
// after a safe build, the built file in dist folder must be paired with a .env file to use
// to disable safe build aka build so that you don't have to include a .env file (NOT RECOMMENDED),
// define all of your keys like this
/**
 * build({
 *  ...,
 *  define: {
 *    'process.env.KEY_NAME': JSON.stringify(process.env.KEY_NAME),  
 *  }
 * });
 */
// unsafe build is recommended to be used as a different file not in the dist folder for security purposes
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