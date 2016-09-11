import uglify from 'rollup-plugin-uglify';
import eslint from 'rollup-plugin-eslint';

export default {
  entry: 'src/scripts/main.js',
  dest: 'build/scripts/main.js',
  format: 'iife',
  sourceMap: (process.env.NODE_ENV === 'production' ? '' : 'inline'),
  plugins: [
    eslint(),
    (process.env.NODE_ENV === 'production' && uglify())
  ]
};
