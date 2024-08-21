import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';

export default {
  input: 'src/js/formique.js',
  output: [
    {
      file: 'dist/js/formique.esm.js',
      format: 'esm',
    },
    {
      file: 'dist/js/formique.umd.js',
      format: 'umd',
      name: 'Formique',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    postcss({
      extract: 'dist/css/formique.css', // Extract CSS to this path
    }),
  ],
};
