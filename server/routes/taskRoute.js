const {
  getAllTasks,
  create,
  getTaskById,
  update,
  getTasksByLeadId,
  getTasksByOwnerId,
  showBackupTasks,
  getTasksWithRemarks,
  backupTask
} = require("../controllers/taskController");
const { auth } = require("../middleware/auth");
const {
  showBackup
  } = require("../controllers/index.js")

const router = require("express").Router();

router.get("/", auth, getAllTasks); 
router.post("/", auth, create);
router.get("/remarks/:_id", auth, getTasksWithRemarks);
router.post("/backup", backupTask);
router.post("/showbackup", showBackupTasks);
// router.post("/showbackup",showBackup);
router.get("/:_id", auth, getTaskById);
router.get("/lead/:leadId", auth, getTasksByLeadId);
router.put("/:_id", auth, update);
router.get("/owner/:_id", auth, getTasksByOwnerId);


module.exports = router;
