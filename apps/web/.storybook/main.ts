/* eslint-disable unicorn/prefer-module */

import { VanillaExtractPlugin } from '@vanilla-extract/webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import type { StorybookConfig } from '@storybook/nextjs';

const config: StorybookConfig = {
  staticDirs: [
    '../public',
    '../node_modules/@looks-to-me/package-database/migrations',
  ],
  stories: [
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    {
      name: '@storybook/addon-styling-webpack',
      options: {
        plugins: [
          new VanillaExtractPlugin(),
          new MiniCssExtractPlugin(),
        ],
        rules: [
          {
            test: /\.css$/,
            exclude: /\.vanilla\.css$/,
            sideEffects: true,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {},
              },
            ],
          },
          {
            test: /\.vanilla\.css$/i,
            sideEffects: true,
            use: [
              MiniCssExtractPlugin.loader,
              {
                loader: require.resolve('css-loader'),
                options: {
                  url: false,
                },
              },
            ],
          },
        ],
      },
    },
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
};

export default config;
