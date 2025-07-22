const path = require("path");

async function executeFile(filePath, params = []) {
  logger.debugger(
    `Execute file with path ${filePath} has been called by ${GetInvokingResource()}`,
  );
  try {
    const absolutePath = path.resolve(
      GetResourcePath(GetCurrentResourceName()),
      filePath,
    );
    const result = await connection.file(absolutePath, params);
    logger.info(`File ${filePath} executed without issues`);
    return [true, result];
  } catch (err) {
    return [false, err.message];
  }
}

global.exports("executeFile", (filePath, cb) => {
  executeFile(filePath).then(([success, resultOrError]) => {
    if (typeof cb === "function") cb(success, resultOrError);
  });
});
