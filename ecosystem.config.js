module.exports = {
  apps: [
    {
      name: 'social-network',
      script: 'src/shared/infra/http/server.ts', 
      interpreter: 'ts-node', 
      instances: 1,
      exec_mode: 'cluster', 
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
