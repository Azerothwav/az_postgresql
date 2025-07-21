async function update(table, data, where = {}) {
  try {
    const safeTable = sanitizeIdentifier(table);

    const setCols = Object.keys(data).map(sanitizeIdentifier);
    const whereCols = Object.keys(where).map(sanitizeIdentifier);

    const setAssignments = setCols.map((col, i) => `${col} = $${i + 1}`);
    const whereAssignments = whereCols.map(
      (col, i) => `${col} = $${i + 1 + setCols.length}`,
    );

    const query = `
      UPDATE ${safeTable}
      SET ${setAssignments.join(", ")}
      WHERE ${whereAssignments.join(" AND ")}
      RETURNING *;
    `.trim();

    const values = [...Object.values(data), ...Object.values(where)];
    const result = await connection.unsafe(query, values);

    return [true, { rows: result, affectedRows: result.length }];
  } catch (err) {
    logger.warn(`Update failed : ${err.message}`);
    return [false, err.message];
  }
}

global.exports("update", (table, data, where, cb) => {
  update(table, data, where).then(([success, result]) => {
    if (typeof cb === "function") cb(success, result);
  });
});
