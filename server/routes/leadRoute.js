const {
  create,
  getAllLeads,
  getLeadById,
  update,
  isDeleteLead,
  showBackupLeads,
  backupLeads
} = require("../controllers/leadController");
const { auth } = require("../middleware/auth");

const router = require("express").Router();

router.get("/", auth, getAllLeads);
router.post("/", auth, create);
router.get("/:_id", auth, getLeadById);
router.post("/backup", backupLeads);
router.post("/showbackup", showBackupLeads);
router.put("/:_id", auth, update);
router.put("/delete/:_id", auth, isDeleteLead);

module.exports = router;
