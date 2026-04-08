import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  compress: false,
  trailingSlash: false,
  allowedDevOrigins: ['nuc15'],
  experimental: {
    inlineCss: true,
  },
};

export default withNextIntl(nextConfig);
