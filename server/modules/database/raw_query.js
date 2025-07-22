function convertPlaceholders(query) {
  let index = 1;
  return query.replace(/\?/g, () => `$${index++}`);
}

async function rawQuery(query, params = []) {
  try {
    const pgQuery = convertPlaceholders(query);
    const result = await connection.unsafe(pgQuery, params);
    return [true, result];
  } catch (err) {
    return [false, err.message];
  }
}

global.exports("rawQuery", (query, params, cb) => {
  rawQuery(query, params).then(([success, result]) => {
    if (typeof cb === "function") cb(success, result);
  });
});
