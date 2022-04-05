'use sctrict'
const express = require("express");
const fileUpload = require('express-fileupload');
const BodyParser = require("body-parser");
const cors = require('cors')
const app = express();
app.use(fileUpload());
const DocumentsRoutes = require("./routes");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(BodyParser.json());
app.use(cors());
app.use("/api/aws", DocumentsRoutes);

module.exports = app;