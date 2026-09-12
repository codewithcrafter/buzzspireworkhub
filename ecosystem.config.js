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
    {
      name: "buzzspire-scheduler",
      script: "npm",
      args: "run scheduler",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
      },
      log_date_format: "YYYY-MM-DD HH:mm Z",
      error_file: "logs/scheduler-error.log",
      out_file: "logs/scheduler-out.log",
      merge_logs: true,
      max_memory_restart: "200M",
      watch: false,
    },
  ],
};
