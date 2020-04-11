const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>  {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.authInfo = {
      username: decodedToken.username,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    if (req.method === "GET") {
      // Allow GET method to proceed, purpose is only to get user from token
      next();
    } else {
      res.status(401).json({
        message: "Authentication failed! Incorrect token"
      });
    }
  }
}