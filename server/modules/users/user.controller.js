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
    subject: "BookMyCinema Email Verification",
    html: `<p>This is your OTP for verifying your email : </p>${token}`,
  });
});

myEvent.addListener("resetPassword", (email, password) => {
  sendMail({
    email,
    subject: "BookMyCinema Password Reset",
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

const generateToken = async (payload) => {
    const { email } = payload;
    const user = await userModel.findOne({ email, isActive: true });
    if (!user) throw new Error("User not found");
    const isVerified = user?.isEmailVerified;
    if (!isVerified) {
      const token = generateOTP();
      const updatedUser = await userModel.updateOne(
        { _id: user?.id },
        { otp: token }
      );
      if (!updatedUser) throw new Error("Something went wrong");
      myEvent.emit("emailVerification", email, token);
    }
    return true;
  };
  
  const verifyEmail = async (payload) => {
    const { email, otp } = payload;
    const user = await userModel.findOne({ email, isActive: true });
    if (!user) throw new Error("User not found");
    const validOTP = user?.otp === otp;
    if (!validOTP) throw new Error("Invalid OTP");
    const updatedUser = await userModel.updateOne(
      { _id: user?.id },
      { isEmailVerified: true, otp: "" }
    );
    if (!updatedUser) throw new Error("Something went wrong");
    return validOTP;
  };
  
  const list = async ({ page = 1, limit = 2, role, search }) => {
    const query = [];
  
    // search
    if (search?.name) {
      query.push({
        $match: {
          name: new RegExp(search?.name, "gi"),
        },
      });
    }
    if (search?.email) {
      query.push({
        $match: {
          email: new RegExp(search?.email, "gi"),
        },
      });
    }
  
    // sort
    query.push({
      $sort: {
        createdAt: 1,
      },
    });
  
    // filter based on role assignment, TODO accept array remaining
    if (role) {
      query.push({
        $match: {
          roles: filter,
        },
      });
    }
  
    // pagination
    query.push(
      {
        $facet: {
          metadata: [
            {
              $count: "total",
            },
          ],
          data: [
            {
              $skip: (+page - 1) * +limit, // +limit ->Number(limit)
            },
            {
              $limit: +limit,
            },
          ],
        },
      },
      {
        $addFields: {
          total: {
            $arrayElemAt: ["$metadata.total", 0],
          },
        },
      },
      {
        $project: {
          metadata: 0,
          "data.password": 0,
        },
      }
    );
  
    const result = await userModel.aggregate(query);
  
    return {
      total: result[0]?.total || 0,
      users: result[0]?.data,
      page: +page, //+page = Number(page)
      limit: +limit, //+limit = Number(limit)
    };
  };
  
  const blockUser = async (id) => {
    const user = await userModel.findOne({ _id: id });
    if (!user) throw new Error("User not found");
    const statusPayload = {
      isActive: !user?.isActive,
    };
    const updatedUser = await userModel.updateOne({ _id: id }, statusPayload);
    if (!updatedUser) throw new Error("Something went wrong");
    return user;
  };
  
  const removeById = (id) => {
    return userModel.deleteOne({ _id: id });
  };
  
  const getProfile = (_id) => {
    return userModel.findOne({ _id });
  };
  
  const updateByAdmin = async (id, payload) => {
    return userModel.findOneAndUpdate({ _id: id }, payload, { new: true }); // {new : true} immediately return updated data
  };
  
  const updateById = async (id, payload) => {
    return userModel.findOneAndUpdate({ _id: id }, payload, { new: true });
  };
  
  const getById = async (id) => {
    return userModel.findOne({ _id: id });
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
    generateToken,
    verifyEmail,
    blockUser,
  getById,
  list,
  getProfile,
  updateById,
  updateByAdmin,
  removeById,
    changePassword,
    resetPassword,
    forgetPasswordTokenGeneration,
    forgetPasswordChangePass,
  };
  