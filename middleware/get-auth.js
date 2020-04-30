const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>  {
  try {
    if (!req.headers.authorization) next(); // Allow unauthorized view of data
    else {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY);
      req.authInfo = {
        username: decodedToken.username,
        userId: decodedToken.userId
      };
      if (req.query.userId && req.authInfo.userId !== req.query.userId) {
        throw new Error("Invalid authorization token used");
      }
      next();
    }
  } catch (error) {
    if (req.query.userId) {
      res.status(401).json({message: error.message});
    } else {
      next();
    }
  }
}