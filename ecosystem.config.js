module.exports = {
  apps : [
    {
      name: 'planning.click',
      script: '__sapper__/build',

      exec_mode  : "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env_production: {
        NODE_ENV: 'production'
      },
      "cwd" : "/home/bonome/planning.click"
    }
  ],

};
