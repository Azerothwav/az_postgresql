async function addListener(table_name, cb) {
  await sql.listen(table_name, (payload) => {
    if (typeof cb === "function") cb(JSON.parse(payload));
  });
}
