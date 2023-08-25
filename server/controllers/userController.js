const User = require("../models/user");
const UserFilter = require("../models/userFilter");
const Role = require("../models/role");
const Task = require("../models/task");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { taskEnum } = require("../utils/constants");

// create user
const create = async (req, res, next) => {
  try {
    const { salutation, firstName, lastName, email, password, gender } =
      req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) return res.status(400).json({ error: "User exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const roleId = await Role.findOne({ name: "USER" });
    const newUser = new User({
      salutation,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      gender,
      roleId,
    });

    await newUser.save();
    res.status(200).json({ message: "User created." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// login user
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Incomplete data" });
    const existingUser = await User.findOne({ email: email }).populate(
      "roleId"
    );

    if (!existingUser)
      return res.status(400).json({ error: "Incorrect Username/Password" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ error: "Incorrect Password" });

    let token = jwt.sign(
      {
        userId: existingUser._id,
        salutation: existingUser.salutation,
        name: existingUser.firstName + " " + existingUser.lastName,
        gender: existingUser.gender,
        email: existingUser.email,
        role: existingUser.roleId.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.status(200).json({ jwt: token });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// get all users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").populate("roleId");
    const filteredUsers = [];
    users.map((user) => {
      if (
        user.roleId.name !== "SUPER_ADMIN" &&
        user.roleId.name !== "ADMIN" &&
        !user._id.equals(req.userId)
      ) {
        filteredUsers.push(user);
      }
    });
    res.status(200).json(filteredUsers);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// compare old and new passwords
const compareOldAndNewPasswords = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    const oldPasswordCheck = await bcrypt.compare(
      req.body.oldPassword,
      user.password
    );
    if (!oldPasswordCheck)
      return res.status(400).json({ error: "Incorrect old password" });
    res.status(200).json({ message: "Success" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Reset password
const resetPassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const loggedInUser = await User.findById(req.userId)
      .select("-password")
      .populate("roleId");

    if (
      oldPassword &&
      (loggedInUser.roleId.name === "SUPER_ADMIN" ||
        loggedInUser.roleId.name === "ADMIN" ||
        loggedInUser.roleId.name === "USER")
    ) {
      const user = await User.findById(req.params.userId).populate("roleId");
      const oldPasswordCheck = await bcrypt.compare(newPassword, user.password);
      if (oldPasswordCheck)
        return res
          .status(400)
          .json({ error: "Old and new passwords can't be same" });

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.json({ message: "Password updated successfully" });
    } else if (!oldPassword) {
      const user = await User.findById(req.params.userId);
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Failed to reset password" });
  }
};
const createUserFilter = async (req, res, next) => {
  try {
    const existingUserFilter = await UserFilter.findOne({
      filter: { $regex: new RegExp("^" + req.body.filter.toLowerCase(), "i") },
    });
    if (existingUserFilter)
      return res.status(500).json({ error: "Filter exists" });

    const user = await User.findById(req.body.userId);
    const userFilter = new UserFilter({
      userId: user._id,
      filter: req.body.filter,
    });

    await userFilter.save();
    res.status(200).json(userFilter);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getallDashboardData = async (req, res, next) => {
  let dashTaskStatusCount = {
    total: 0,
    open: 0,
    pending: 0,
    inProgress: 0,
    closed: 0,
  };
  let totalTask = [];

  try {
    if (req.role !== "USER") {
      totalTask = await Task.find();
    } else {
      totalTask = await Task.find({ ownerId: req.userId });

    }

    totalTask.forEach((i) => {
      dashTaskStatusCount.total += 1;
      if (i.status === taskEnum[0]) {
        dashTaskStatusCount.open += 1;
      } else if (i.status === taskEnum[1]) {
        dashTaskStatusCount.pending += 1;
      } else if (i.status === taskEnum[2]) {
        dashTaskStatusCount.inProgress += 1;
      } else if (i.status === taskEnum[3]) {
        dashTaskStatusCount.closed += 1;
      }
    });

    return res.status(200).json(dashTaskStatusCount);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

const getAllFilters = async (req, res, next) => {
  try {
    const filters = await UserFilter.find();

    res.status(200).json({ totalRecords: filters.length, filters });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

module.exports = {
  create,
  login,
  getAllUsers,
  compareOldAndNewPasswords,
  resetPassword,
  createUserFilter,
  getallDashboardData,
  getAllFilters,
};
