const webpack = require('webpack');
const {EnvironmentPlugin} = webpack;

module.exports = {
  plugins: [
    new EnvironmentPlugin(['USERS_API_URL', 'VEHICLES_API_URL', 'CHARGERPOINTS_API_URL', 'LOGIN_API_URL'])
  ],
  resolve: {
    fallback: {
      process: require.resolve('process/browser')
    }
  }
};
