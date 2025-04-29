module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  env: {
    production: {
      plugins: ['transform-remove-console'],
    },
    development: {
      presets: [
        [
          'module:metro-react-native-babel-preset',
          {
            development: true,
          },
        ],
      ],
    },
  },
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.js',
          '.jsx',
          '.ts',
          '.tsx',
          '.android.js',
          '.android.tsx',
          '.ios.js',
          '.ios.tsx',
        ],
        alias: {
          assets: './src/assets',
          constant: './src/constant',
          navigation: './src/navigation',
          components: './src/components',
          manager: './src/manager',
          reducer: './src/reducer',
          sagas: './src/sagas',
          scenes: './src/scenes',
          services: './src/services',
          storeConfig: './src/storeConfig',
          utils: './src/utils',
          styleGuide: './src/styleGuide',
          underscore: 'lodash',
        },
      },
    ],
    [
      'react-native-reanimated/plugin',
      {
        globals: ['__scanCodes'],
      },
    ],
  ],
};
