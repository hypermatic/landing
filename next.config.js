const withPWA = require('next-pwa')                                                            
const runtimeCaching = require('next-pwa/cache')

const linguiConfig = require('./lingui.config.js')
 
const { locales, sourceLocale } = linguiConfig

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const { withSentryConfig } = require('@sentry/nextjs')

const nextConfig = {
  webpack: (config) => {
    config.module.rules = [
      ...config.module.rules,
      {            
        resourceQuery: /raw-lingui/,
        type: 'javascript/auto',
      },       
    ]              
                   
    config.resolve = {
      ...config.resolve,
      alias: {     
        ...config.resolve.alias,
        tls: false,
        net: false,
        fs: false, 
      }            
    }              
                   
    return config  
  },           
  experimental: { esmExternals: true },
  pwa: {           
    dest: 'public',
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },               
  images: {        
    domains: [     
      'raw.githubusercontent.com',
      'sideshift.ai',
      'assets.mistswap.fi',
    ],             
  },               
  reactStrictMode: true,
  async redirects() {
    return []
  },
  async rewrites() {
    return []
  }, 
  i18n: {   
    localeDetection: true,
    locales,       
    defaultLocale: sourceLocale,
  },        
}

const SentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:            
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore                                                              
                             
  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
}                            

// Make sure adding Sentry options is the last code to run before exporting, to
// ensure that your source maps include changes from all other Webpack plugins
module.exports = withSentryConfig(withPWA(withBundleAnalyzer(nextConfig)), SentryWebpackPluginOptions)

// Don't delete this console log, useful to see the config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))
