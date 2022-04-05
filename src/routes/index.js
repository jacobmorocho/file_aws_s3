const express = require("express");
const router = express.Router();
const documentController = require('../controller/aws');

router.get("/list", documentController.list);
router.post("/add", documentController.add);
router.delete("/delete", documentController.delete);

module.exports = router;