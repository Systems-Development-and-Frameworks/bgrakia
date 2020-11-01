const path = require('path');

module.exports = ({config}) => {
/*  config.resolve.modules = [
    path.resolve(__dirname, ".."),
    "node_modules",
  ]*/
  config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "../src")
  };
  config.module.rules.push({ test: /\.less$/, loaders: [ 'style-loader', 'css-loader', 'less-loader' ] });
  config.module.rules.push({ test: /\.styl$/, loader: 'style-loader!css-loader!stylus-loader' });

  return config
}