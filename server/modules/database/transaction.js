async function runTransaction(queries = []) {
  try {
    const result = await connection.begin(async (sql) => {
      const results = [];

      for (const { query, params } of queries) {
        const res = await sql.unsafe(query, params || []);
        results.push(res);
      }

      return results;
    });

    return [true, result];
  } catch (err) {
    logger.warn(`Transaction failed: ${err.message}`);
    return [false, err.message];
  }
}

global.exports("transaction", (queries, cb) => {
  runTransaction(queries).then(([success, result]) => {
    if (typeof cb === "function") cb(success, result);
  });
});
