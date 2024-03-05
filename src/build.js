// cloudflare workers use chrome v8 technology
// which is a browser-based environment
// there's no import core packages because it's not node
// but packages we use does not prefix the core modules with node:*
// so we have to polyfill them so everything works
import { polyfillNode } from "esbuild-plugin-polyfill-node";
import esbuild from "esbuild";
esbuild.build({
  minify: true,
  bundle: true,
  format: "esm",
  entryPoints: ["src/main.js"],
  outdir: "dist",
  platform: "browser",
  target: "esnext",
  sourcemap: true,
  logLevel: "info",
  plugins: [
    polyfillNode({
      polyfills: {
        // these are for yor.ts
        // this is also in their docs
        url: true,
        util: true,
        buffer: true
      },
    }),

  ],
}).catch(() => process.exit(1));