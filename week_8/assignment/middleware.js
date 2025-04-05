const jwt = require("jsonwebtoken");
const JWT_SECRET = "mySecret";

module.exports = function () {
  function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Unauthentication request." });
    }
    const arrBearer = authHeader.split(" ");
    if (!arrBearer || arrBearer.length <= 1) {
      return res.status(401).json({ message: "Unauthentication request." });
    }
    const token = arrBearer[1];

    jwt.verify(token, JWT_SECRET, function (error, user) {
      if (error) {
        return res.status(403).json({ message: "Invalid Token." });
      }

      req.user = user;

      return next();
    });
  }
  function authAdmin(req, res, next) {
    const { username, role } = req.user;
    if (role === "admin") {
      return next();
    }
    return res.status(403).json({ message: "Not permission" });
  }
  return {
    authenticateToken,
    authAdmin,
  };
};
