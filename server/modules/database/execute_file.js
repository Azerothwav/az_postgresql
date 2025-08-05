const path = require("path");

async function executeFile(filePath, invokingResource) {
  logger.debugger(
    `Execute file with path ${filePath} has been called by ${invokingResource}`,
  );
  try {
    const absolutePath = path.resolve(
      GetResourcePath(invokingResource),
      filePath,
    );
    const result = await connection.file(absolutePath, []);
    logger.info(`File ${filePath} executed without issues`);
    return [true, result];
  } catch (err) {
    return [false, err.message];
  }
}

global.exports("executeFile", (filePath, invokingResource, cb) => {
  executeFile(filePath, invokingResource).then(([success,  resultOrError]) => {
    if (typeof cb === "function") cb(success, resultOrError);
  });
});
