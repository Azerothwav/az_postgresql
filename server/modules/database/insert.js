async function insert(table, data) {
  try {
    const safeTable = sanitizeIdentifier(table);

    const columns = Object.keys(data).map(sanitizeIdentifier);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`);

    const query = `INSERT INTO ${safeTable} (${columns.join(",")}) VALUES (${placeholders.join(",")}) RETURNING *`;

    const result = await connection.unsafe(query, values);
    return [true, result[0]];
  } catch (err) {
    return [false, err.message];
  }
}

global.exports("insert", (table, data, cb) => {
  insert(table, data).then(([success, result]) => {
    if (typeof cb === "function") cb(success, result);
  });
});
