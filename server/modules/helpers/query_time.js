async function timedQuery(query, params = []) {
  const start = process.hrtime.bigint(); // Temps en nanosecondes
  try {
    const result = await connection.unsafe(query, params);
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6; // Converti en millisecondes

    logger.info(`Query executed in ${durationMs.toFixed(2)} ms:\n${query}`);
    return [true, result, durationMs];
  } catch (err) {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1e6;
    logger.warn(
      `Query failed after ${durationMs.toFixed(2)} ms: ${err.message}`,
    );
    return [false, err.message, durationMs];
  }
}

global.exports("timedQuery", (query, params, cb) => {
  timedQuery(query, params).then(([success, result, duration]) => {
    if (typeof cb === "function") cb(success, result, duration);
  });
});
