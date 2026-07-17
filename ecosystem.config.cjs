const fixedInstances = 1;

module.exports = {
  apps: [
    {
      name: 'giftbox-game',
      script: 'app.js',
      exec_mode: 'cluster',
      instances: fixedInstances,
      autorestart: true,
      watch: false,
      max_memory_restart: '600M',
      kill_timeout: 5000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: 'production',
        APP_RUNTIME_PROFILE: 'prod',
        CONSOLE_ERRORS_ONLY: 'true',
        DB_BOOTSTRAP_ON_START: 'false',
        SSE_DIAGNOSTICS_MS: '60000',
        DB_POOL_MAX: '30',
        DB_POOL_MIN: '5',
        DB_POOL_ACQUIRE: '60000',
        DB_POOL_IDLE: '10000',
        HTTP_KEEP_ALIVE_TIMEOUT: '65000',
        HTTP_HEADERS_TIMEOUT: '66000',
        HTTP_REQUEST_TIMEOUT: '120000',
        HTTP_MAX_REQUESTS_PER_SOCKET: '1000'
      },
      env_production: {
        NODE_ENV: 'production',
        APP_RUNTIME_PROFILE: 'prod',
        CONSOLE_ERRORS_ONLY: 'true',
        DB_BOOTSTRAP_ON_START: 'false',
        SSE_DIAGNOSTICS_MS: '60000',
        DB_POOL_MAX: '30',
        DB_POOL_MIN: '5',
        DB_POOL_ACQUIRE: '60000',
        DB_POOL_IDLE: '10000',
        HTTP_KEEP_ALIVE_TIMEOUT: '65000',
        HTTP_HEADERS_TIMEOUT: '66000',
        HTTP_REQUEST_TIMEOUT: '120000',
        HTTP_MAX_REQUESTS_PER_SOCKET: '1000'
      },
      env_staging: {
        NODE_ENV: 'production',
        APP_RUNTIME_PROFILE: 'staging',
        DB_BOOTSTRAP_ON_START: 'false',
        SSE_DIAGNOSTICS_MS: '15000',
        DB_POOL_MAX: '24',
        DB_POOL_MIN: '4',
        DB_POOL_ACQUIRE: '60000',
        DB_POOL_IDLE: '10000',
        HTTP_KEEP_ALIVE_TIMEOUT: '65000',
        HTTP_HEADERS_TIMEOUT: '66000',
        HTTP_REQUEST_TIMEOUT: '120000',
        HTTP_MAX_REQUESTS_PER_SOCKET: '1000'
      },
      env_development: {
        NODE_ENV: 'development',
        APP_RUNTIME_PROFILE: 'dev',
        DB_BOOTSTRAP_ON_START: 'true',
        SSE_DIAGNOSTICS_MS: '10000',
        DB_POOL_MAX: '12',
        DB_POOL_MIN: '2',
        DB_POOL_ACQUIRE: '60000',
        DB_POOL_IDLE: '10000',
        HTTP_KEEP_ALIVE_TIMEOUT: '65000',
        HTTP_HEADERS_TIMEOUT: '66000',
        HTTP_REQUEST_TIMEOUT: '120000',
        HTTP_MAX_REQUESTS_PER_SOCKET: '1000'
      }
    }
  ]
};
