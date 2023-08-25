const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");

// jwt authentication
const auth = async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  try {

    if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
      const { userId, role } = jsonwebtoken.verify(
        token,
        process.env.JWT_SECRET
      );

      req.userId = userId;
      req.role = role;
      next();
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!token) {
    return res.status(400).json({ error: "No Token" });
  }
};

// admin authorization
const admin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("roleId")
      .select("-password");
    if (user.roleId.name !== "ADMIN" && user.roleId.name !== "SUPER_ADMIN") {
      return res.status(404).json({
        error: "This role type has no access to this resource.",
        statusCode: 404,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({
      error: error.message,
      statusCode: 404,
    });
  }
};

// admin authorization
const superAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId)
      .populate("roleId")
      .select("-password");
    if (user.roleId.name !== "SUPER_ADMIN") {
      return res.status(404).json({
        error: "This role type has no access to this resource.",
        statusCode: 404,
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(404).json({
      error: error.message,
      statusCode: 404,
    });
  }
};

module.exports = { auth, admin, superAdmin };