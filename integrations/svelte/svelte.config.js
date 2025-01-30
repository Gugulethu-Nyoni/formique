import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // optional settings for the Node adapter
      out: 'build', // specifies the output directory for the built files
      precompress: false, // set to true to gzip and brotli compress files
      env: {
        host: '0.0.0.0',
        port: '3000'
      }
    })
  }
};

export default config;
