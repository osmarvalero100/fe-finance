// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  },

  // Application Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Finance App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    env: import.meta.env.VITE_APP_ENV || 'development',
  },

  // Feature flags (can be extended)
  features: {
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableSentry: import.meta.env.VITE_SENTRY_DSN !== undefined,
  },
}

// Type-safe environment validation
export const validateConfig = () => {
  const requiredVars = ['VITE_API_BASE_URL']

  const missing = requiredVars.filter(varName => !import.meta.env[varName])

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env file and ensure all required variables are set.'
    )
  }

  // Validate URL format
  try {
    new URL(config.api.baseUrl)
  } catch {
    throw new Error(`VITE_API_BASE_URL must be a valid URL: ${config.api.baseUrl}`)
  }
}

// Validate configuration on import
if (import.meta.env.DEV) {
  validateConfig()
}

export default config