module.exports = {
  apps: [
    {
      name: "ms-core:prod",
      script: "dist/app.js",
      "env.production": {
        NODE_ENV: "production",
      },
      instances: 1,
      exec_mode: "cluster",
    },
  ],
};
