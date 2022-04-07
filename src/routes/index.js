const express = require("express");
const router = express.Router();
const AwsController = require('../controller/aws');
const auth = require('../middlewares/auth');

router.use(auth);
router.get("/", AwsController.home);
router.post("/clone", auth, AwsController.clone);
router.post("/add", auth, AwsController.add);
router.delete("/delete", auth, AwsController.delete);
router.get("/list", auth, AwsController.list);
module.exports = router;