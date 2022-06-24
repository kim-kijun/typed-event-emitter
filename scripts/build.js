const esbuild = require('esbuild');

esbuild
  .build({
    entryPoints: ['src/index.ts'],
    outfile: 'dist/index.js',
    target: 'es2020',
    format: 'esm',
    bundle: true,
    minify: true,
    tsconfig: './tsconfig.json',
    external: [],
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
