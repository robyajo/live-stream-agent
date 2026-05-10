module.exports = {
  apps: [
    {
      name: 'tiktok-live-agent',
      script: 'server.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      // Log files for easy monitoring
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      // Merge logs across instances
      merge_logs: true,
      // Wait for 3 seconds before restarting if it crashes
      restart_delay: 3000,
      // Number of retries before giving up
      max_restarts: 10
    }
  ]
};
