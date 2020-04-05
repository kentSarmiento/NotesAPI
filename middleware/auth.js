const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>  {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "secret_token");
    req.authInfo = {
      username: decodedToken.username,
      userId: decodedToken.userId
    };
    next();
  } catch (error) {
    res.status(401).json({
      message: "Authentication failed! Incorrect token"
    });
  }
}