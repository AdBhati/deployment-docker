const router = require("express").Router();
const { create } = require("../controllers/roleController");

router.post("/", create);

module.exports = router;
