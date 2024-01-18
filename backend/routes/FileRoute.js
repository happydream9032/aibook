const express = require("express");
const {runPrompt} = require("../controller/FileController");

// CREATING EXPRESS ROUTE HANDLER
const router = express.Router();

router.post("/runprompt", runPrompt);
module.exports = router;
