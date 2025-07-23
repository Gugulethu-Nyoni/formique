import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/js/formique.js',
  output: [
    {
      file: 'dist/js/formique.cjs.js',
      format: 'cjs', // CommonJS for Node.js and bundlers
      exports: 'auto',
      sourcemap: false,
    },
    {
      file: 'dist/js/formique.umd.js',
      format: 'umd', // Universal Module Definition for broad compatibility
      name: 'Formique',
      exports: 'auto',
      sourcemap: false,
    },
    {
      file: 'dist/js/formique.mjs',
      format: 'esm', // ES Module for modern JavaScript environments
      sourcemap: false,
    },
    {
      file: 'dist/js/formique.global.js',
      format: 'iife', // Immediately Invoked Function Expression for browsers
      name: 'Formique',
      sourcemap: false,
    },
  ],
  plugins: [
    nodeResolve(), // Resolve modules from node_modules
    commonjs(), // Convert CommonJS modules to ES6
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**', // Exclude dependencies from being transpiled
    }),
    terser(), // Minify the output to reduce file size
    postcss({
      extract: 'dist/css/formique.css', // Extract CSS to the specified path
    }),
  ],

  treeshake: {
    moduleSideEffects: false // Ensure all code is included if needed
  }
};
