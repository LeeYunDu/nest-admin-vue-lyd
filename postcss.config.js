module.exports = {
  plugins: {
    autoprefixer: require('autoprefixer')(),
    // autoprefixer: {
    //   browsers: ['Android >= 4.0', 'iOS >= 8'],
    // },
    'postcss-pxtorem': {
      // rootValue: 16,
      // propList: ['*']
    }
  }
}
