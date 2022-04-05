const express = require("express");
const router = express.Router();
const AwsController = require('../controller/aws');
router.get("/", AwsController.home);
router.post("/clone", AwsController.clone);
router.post("/add", AwsController.add);
router.delete("/delete", AwsController.delete);

module.exports = router;