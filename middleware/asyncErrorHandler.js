function asyncErrorHandler(routeHandler) {
  return async function (req, res, next, ...args) {
    try {
      return await routeHandler(req, res, next, ...args);
    } catch (error) {
      return res.status(error.code || 500).error(error.message);
    }
  };
}

module.exports = asyncErrorHandler;
