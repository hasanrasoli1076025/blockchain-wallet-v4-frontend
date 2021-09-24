const path = require('path')

module.exports = {
  stories: ['../packages/frontend/src/components/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    'storybook-dark-mode'
  ],
  refs: {
    'new-core': {
      title: 'New Core Components',
      url: 'https://blockchain.github.io/constellation/'
    },
    'design-system': {
      title: 'Core Components',
      url: 'http://localhost:6007'
    }
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.

    // Make whatever fine-grained changes you need
    config.resolve.alias = {
      components: path.resolve(__dirname, '..', 'packages/frontend/src/components/'),
      middleware: path.resolve(__dirname, '..', 'packages/frontend/src/middleware/'),
      data: path.resolve(__dirname, '..', 'packages/frontend/src/data/'),
      layouts: path.resolve(__dirname, '..', 'packages/frontend/src/layouts/'),
      modals: path.resolve(__dirname, '..', 'packages/frontend/src/modals/'),
      providers: path.resolve(__dirname, '..', 'packages/frontend/src/providers/'),
      scenes: path.resolve(__dirname, '..', 'packages/frontend/src/scenes/'),
      services: path.resolve(__dirname, '..', 'packages/frontend/src/services/'),
      utils: path.resolve(__dirname, '..', 'packages/frontend/src/utils/')
    }

    // Return the altered config
    return config;
  },

}
  