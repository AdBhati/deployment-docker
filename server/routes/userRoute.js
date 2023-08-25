const {
  create,
  login,
  getAllUsers,
  resetPassword,
  createUserFilter,
  getallDashboardData,
  compareOldAndNewPasswords,
  getAllFilters,
} = require("../controllers/userController");
const { auth, admin, superAdmin } = require("../middleware/auth");

const router = require("express").Router();

router.post("/", create);
router.post("/authenticate", login);
router.post("/filter", auth, superAdmin, createUserFilter);
router.get("/getUsers", auth, admin, getAllUsers);
router.get("/dashboard", auth, getallDashboardData);
router.get("/filters", getAllFilters);
router.post("/check-old-password/:userId", auth, compareOldAndNewPasswords);
router.post("/resetpassword/:userId", auth, resetPassword);

module.exports = router;
