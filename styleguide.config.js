module.exports = {
  title: 'Forum Diskusi Component Documentation',
  components: 'src/components/**/*.jsx',
  webpackConfig: {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
  },
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap',
        },
      ],
    },
  },
  theme: {
    color: {
      link: '#1677ff',
      linkHover: '#4096ff',
    },
    fontFamily: {
      base: '"Roboto", "Helvetica", "Arial", sans-serif',
    },
  },
  styles: {
    StyleGuide: {
      '@global body': {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      },
    },
  },
};