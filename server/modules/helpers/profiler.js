async function logTimed(label, queryFn) {
  const start = process.hrtime.bigint();
  const result = await queryFn();
  const end = process.hrtime.bigint();
  const durationMs = Number(end - start) / 1e6;
  logger.debug(`${label} executed in ${durationMs.toFixed(2)} ms`);
  return result;
}
