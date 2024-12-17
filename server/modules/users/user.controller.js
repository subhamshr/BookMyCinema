const userModel = require("./user.model");
const { generateHash, compareHash } = require("../../utils/hash");
const { signToken, generateOTP } = require("../../utils/token");

const event = require("events");
const { sendMail } = require("../../services/email");

const myEvent = new event.EventEmitter();

myEvent.addListener("sendMail", (email) => {
  sendMail({
    email,
    subject: "Signing up successful in Book My Cinema",
    html: "<b>Thank you for signing up to Book My Cinema</b>",
  });
});

myEvent.addListener("emailVerification", (email, token) => {
  sendMail({
    email,
    subject: "MovieMate Email Verification",
    html: `<p>This is your OTP for verifying your email : </p>${token}`,
  });
});

myEvent.addListener("resetPassword", (email, password) => {
  sendMail({
    email,
    subject: "MovieMate Password Reset",
    html: `<p>You requested for reset password. Your New Password is : <strong>${password}</strong></p>`,
  });
});

const create = async (payload) => {
  const { email, password } = payload;
  const newUser = await userModel.findOne({ email });
  if (newUser) throw new Error("user already exists");
  payload.password = generateHash(password);
  const result = await userModel.create(payload);
  myEvent.emit("sendMail", email);
  return result;
};

const login = async (payload) => {
  const { email, password } = payload;
  const user = await userModel
    .findOne({ email, isActive: true })
    .select("+password"); // return password too, since model is defined to not return password
  if (!user) throw new Error("User not found");
  const isVerified = user?.isEmailVerified;
  if (!isVerified) throw new Error("Email is not verified");
  const checkPassword = compareHash(user?.password, password);
  if (!checkPassword) throw new Error("Email or Password is incorrect");
  const tokenPaylaod = {
    name: user?.name,
    email: user?.email,
    roles: user?.roles,
  };
  const Token = signToken(tokenPaylaod);
  if (!Token) throw new Error("Something went wrong");
  return { Token, name: user?.name, email: user?.email, id: user?._id };
};

const changePassword = async (id, payload) => {
    const { oldPassword, newPassword } = payload;
    // does user in concern exist?
    const user = await userModel
      .findOne({
        _id: id,
        isActive: true,
        isEmailVerified: true,
      })
      .select("+password");
    if (!user) throw new Error("User Not Found");
    const isValidPassword = compareHash(user?.password, oldPassword);
    if (!isValidPassword)
      throw new Error("Old Password does not match with current user password");
    return await userModel.findOneAndUpdate(
      { _id: id },
      { password: generateHash(newPassword) },
      { new: true }
    );
  };
  
  const resetPassword = async (id, newPassword) => {
    const user = await userModel.findOne({
      _id: id,
      isActive: true,
      isEmailVerified: true,
    });
    if (!user) throw new Error("User Not Found");
    myEvent.emit("resetPassword", user?.email, newPassword);
    return userModel.updateOne(
      { _id: id },
      { password: generateHash(newPassword) }
    );
  };
  
  const forgetPasswordTokenGeneration = async (payload) => {
    const { email } = payload;
    const user = await userModel.findOne({
      email,
      isActive: true,
      isEmailVerified: true,
    });
    if (!user) throw new Error("User Not Found");
    const OTPToken = generateOTP();
    const updatedUser = await userModel.updateOne({ email }, { otp: OTPToken });
    if (!updatedUser) throw new Error("Soemthing went wrong");
    myEvent.emit("emailVerification", email, OTPToken);
    return true;
  };
  
  const forgetPasswordChangePass = async (payload) => {
    const { email, otp, newPassword } = payload;
    const user = await userModel.findOne({
      email,
      isActive: true,
      isEmailVerified: true,
    });
    if (!user) throw new Error("User Not Found");
    if (otp !== user?.otp) throw new Error("Otp mismatch");
    const hashPassword = generateHash(newPassword);
    const updatedUser = await userModel.updateOne(
      { email },
      { password: hashPassword, otp: "" }
    );
    if (!updatedUser) throw new Error("Soemthing went wrong");
    return true;
  };
  
  module.exports = {
    create,
    login,
    changePassword,
    resetPassword,
    forgetPasswordTokenGeneration,
    forgetPasswordChangePass,
  };
  