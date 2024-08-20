import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import css from 'rollup-plugin-css-only';

export default {
  input: 'src/formique.js',
  output: [
    {
      file: 'dist/formique.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/formique.umd.js',
      format: 'umd',
      name: 'Formique',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    css({
      output: 'dist/formique.css',
    }),
  ],
};