const Server = require('./server');

const devServer = Server();

devServer.listen().then(({url}) => {
  console.log(`Server ready at ${url}`);
});
