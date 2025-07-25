const jwt = require('jsonwebtoken');

const verifyUser = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, "qwertyuiop");
    req.user = decoded; // user info stored inside the JWT
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyUser;
