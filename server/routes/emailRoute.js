const express = require("express");
const {
  getUser,
  readMail,
  getDrafts,
  getAllMessages,
  saveLeadAndTasks,
} = require("../controllers/emailController");
const { auth, superAdmin } = require("../middleware/auth");
const router = express.Router();

router.get("/user/:userId/messages", getAllMessages);
router.get("/user/:email", getUser);
router.get("/drafts/:email", getDrafts);
router.get("/read/:messageId", readMail);

router.get("/lead", auth, saveLeadAndTasks);

module.exports = router;
