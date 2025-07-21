async function select(table, columns = ["*"], where = {}) {
  try {
    const safeTable = sanitizeIdentifier(table);
    const safeColumns = normalizeArray(columns)
      .map(sanitizeIdentifier)
      .join(", ");

    let whereClause = "";
    let values = [];

    if (Object.keys(where).length > 0) {
      const whereKeys = Object.keys(where).map(sanitizeIdentifier);
      const whereValues = Object.values(where);

      whereClause =
        "WHERE " +
        whereKeys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
      values = whereValues;
    }

    const query = `SELECT ${safeColumns} FROM ${safeTable} ${whereClause}`;
    const result = await connection.unsafe(query, values);

    return [true, { rows: result, rowCount: result.length }];
  } catch (err) {
    logger.warn(`SELECT failed: ${err.message}`);
    return [false, err.message];
  }
}

global.exports("select", (table, columns, where, cb) => {
  select(table, columns, where).then(([success, result]) => {
    if (typeof cb === "function") cb(success, result);
  });
});
