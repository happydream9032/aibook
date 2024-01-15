const express = require("express");
const { fileUpload, fetchUrl, runSQLQuery, runPrompt, pasteTable} = require("../controller/FileController");

// CREATING EXPRESS ROUTE HANDLER
const router = express.Router();

// SIGN-UP POST ROUTER
router.post("/fileupload", fileUpload);

// LOGIN POST ROUTER
router.post("/fetchurl", fetchUrl);

router.post("/runquery", runSQLQuery);
router.post("/runprompt", runPrompt);
router.post("/pastetable", pasteTable);
module.exports = router;
