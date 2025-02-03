import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';
import { PHASE_DEVELOPMENT_SERVER } from 'next/constants.js';

const withVanillaExtract = createVanillaExtractPlugin();

// eslint-disable-next-line unicorn/no-anonymous-default-export
export default (phase) => {
  /**
   * @type {import('next').NextConfig}
   */
  const nextConfig = {
    transpilePackages: [
      '@looks-to-me/*',
    ],
    eslint: {
      ignoreDuringBuilds: true,
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'avatars.githubusercontent.com',
        },
      ],
    },
    experimental: {
      typedRoutes: true,
    },
    rewrites: async () => [
      {
        source: '/storybook',
        destination: '/storybook/index.html',
      },
    ],
    redirects: async () => [
      {
        source: '/%40:username/',
        destination: '/@:username/',
        permanent: true,
      },
    ],
  };

  if (phase !== PHASE_DEVELOPMENT_SERVER) {
    nextConfig.images = {
      ...nextConfig.images,
      loader: 'custom',
      loaderFile: './next.loader.ts',
    };
  }

  return withVanillaExtract(nextConfig);
};

if (process.env.NODE_ENV === 'development') {
  setupDevPlatform();
}
