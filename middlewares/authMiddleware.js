const jwt = require("jsonwebtoken");

exports.authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    token = token.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

exports.superAdminMiddleware = (req, res, next) => {
  if (req.user.role !== "superadmin") {
    return res.status(403).json({ msg: "Access denied, super admin only" });
  }
  next();
};
