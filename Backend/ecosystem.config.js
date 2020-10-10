// Target server hostname or IP address
const TARGET_SERVER_HOST = process.env.TARGET_SERVER_HOST ? process.env.TARGET_SERVER_HOST.trim() : '';
// Target server username
const TARGET_SERVER_USER = process.env.TARGET_SERVER_USER ? process.env.TARGET_SERVER_USER.trim() : '';
// Target server application path
const TARGET_SERVER_APP_PATH = `/home/fabien_gaby/xproject/Backend`;
// Your repository
const REPO = 'git@gitlab.com:Yazid-Krayem/xproject.git';

module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    {
      name: 'Garder Le Cap API for Website',
      cwd: "/home/fabien_gaby/xproject/Backend",
      script: './dist/index.js',
      env: {
        NODE_ENV: 'development',
	PORT: 8000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 8000
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      user: TARGET_SERVER_USER,
      host: TARGET_SERVER_HOST,
      ref: 'origin/production',
      repo: REPO,
      ssh_options: 'StrictHostKeyChecking=no',
      path: TARGET_SERVER_APP_PATH,
      'post-deploy': 'npm install --production'
        + ' && pm2 startOrRestart ecosystem.config.js --env=production'
        + ' && pm2 save'
    }
  }
};
