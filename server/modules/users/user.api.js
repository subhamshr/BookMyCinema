const router = require("express").Router();
const { secureMiddleWare } = require("../../utils/secure");
const { validator } = require("./user.validator");

const userController = require("./user.controller");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/upload/users");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname.concat(
        "-",
        Date.now(),
        ".",
        file.originalname.split(".")[1]
      )
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // in bytes (1 MB = 1000000 bytes)
});

//register user
router.post(
  "/register",
  upload.single("profile"),
  validator,
  async (request, response, next) => {
    try {
      if (request.file) {
        request.body.profile = request.file.path;
      }
      await userController.create(request.body);
      response.json({ msg: "register successful" });
    } catch (error) {
      next(error); // sends control flow/ error to app.js
    }
  }
);

//login user
router.post("/login", async (request, response, next) => {
  try {
    const result = await userController.login(request.body);
    response.json({ msg: "User successfully logged in", data: result });
  } catch (error) {
    next(error);
  }
});
// otp token generation
router.post("/generate-email-token", async (request, response, next) => {
    try {
      const result = await userController.generateToken(request.body);
      response.json({ msg: "User Token Sent to Your Email", data: result });
    } catch (error) {
      next(error);
    }
  });
  
  // email verification
  router.post("/verify-email", async (request, response, next) => {
    try {
      const result = await userController.verifyEmail(request.body);
      response.json({ msg: "Email Verification Successful", data: result });
    } catch (error) {
      next(error);
    }
  });
  


// change password
router.patch(
    "/change-password",
    secureMiddleWare(["admin", "user"]),
    async (req, res, next) => {
      try {
        const result = await userController.changePassword(
          req.currentUser,
          req.body
        );
        res.json({ msg: "Password Changed Successfuly", data: result });
      } catch (e) {
        next(e);
      }
    }
  );
  
  // reset password (by admin)
  router.patch(
    "/reset-password",
    secureMiddleWare(["admin"]),
    async (req, res, next) => {
      try {
        const { id, newPassword } = req.body;
        const result = await userController.resetPassword(id, newPassword);
        res.json({ msg: "Password reset successfully", data: result });
      } catch (e) {
        next(e);
      }
    }
  );
  
  // forget password
  router.post("/forget-password-token", async (req, res, next) => {
    try {
      const result = await userController.forgetPasswordTokenGeneration(req.body);
      res.json({ msg: "OTP sent to email", data: result });
    } catch (e) {
      next(e);
    }
  });
  
  // forget password change password
  router.post("/forget-password-change", async (req, res, next) => {
    try {
      const result = await userController.forgetPasswordChangePass(req.body);
      res.json({ msg: "Password Changed Successfully", data: result });
    } catch (e) {
      next(e);
    }
  });
  
  module.exports = router;
  