const userModel = require("../modules/users/user.model");
const { checkRole, verifyToken } = require("./token");

const secureMiddleWare = (sysRole = []) => {
  return async (req, res, next) => {
    try {
      const { token } = req.headers;
      if (!token) throw new Error("Token is missing");
      const isValid = verifyToken(token);
      if (!isValid) throw new Error("Token expired");
      const { data } = isValid;
      const userInfo = await userModel.findOne({
        email: data?.email,
        isActive: true,
        isEmailVerified: true,
      });
      if (!userInfo) throw new Error("user not found");
      const validRole = checkRole({ sysRole, userRole: userInfo?.roles || [] });
      if (!validRole) throw new Error("User Unauthorized");
      req.currentUser = userInfo?._id;
      req.isAdmin = userInfo?.roles.includes("admin");
      next();
    } catch (e) {
      next(e);
    }
  };
};
module.exports = {
  secureMiddleWare,
};

