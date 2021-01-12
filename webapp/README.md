# webapp

## Build Setup

Just run`npm run build && npm run generate`.
The first command will create a `.nuxt` directory that will bundle everything
that is to be deployed on the target server.

Our `nuxt.config.js` clearly states that the application is to be statically hosted.
Therefore, our bundle needs to contain the pre-rendered pages.
The `generate` command does this by creating a `dist` directory containing 
our 'compiled' static `.html` and `.js` files which can now be served by a simple webserver.
