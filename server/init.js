const postgres = require("postgres");

var connectionReady = false;

const connection = postgres({
  host: GetConvar("postgresql_host", "fivem-db"),
  port: GetConvar("postgresql_port", 5432),
  user: GetConvar("postgresql_user", "fivem"),
  password: GetConvar("postgresql_password", "fivempassword"),
  database: GetConvar("postgresql_db", "fivemdb"),
  idle_timeout: 20, // Close connection idle for more than 20 secondes
  max_lifetime: 60 * 30, // Close connection that existed for more than 30 minutes
});

(async () => {
  try {
    await connection`SELECT 1`;
    setTimeout(() => {
      connectionReady = true;
      logger.info("Connected to PostgreSQL database");
    }, 2000);
  } catch (err) {
    logger.warn(`Failed to connect to PostgreSQL : ${err.message}`);
  }
})();

global.exports("ready", async function (cb) {
  const waitUntilReady = async () => {
    while (!connectionReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (typeof cb === "function") cb();
  };

  waitUntilReady();
});
