module.exports = {
  apps: [
    {
      name: "buzzspire-app",
      script: "npm",
      args: "start",
      instances: "max", // Run across all CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "logs/error.log",
      out_file: "logs/out.log",
      merge_logs: true,
      max_memory_restart: "1G",
      watch: false,
    },
  ],
};
