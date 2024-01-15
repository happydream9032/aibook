require("dotenv").config();

const bodyparser = require("body-parser");
const express = require("express");
const cors = require("cors");
const fileUpload = require('express-fileupload');

const userRoute = require("./routes/UserRoute");
const fileRoute = require("./routes/FileRoute");
const app = express();
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(fileUpload());
//app.disable("x-powered-by");

// ROUTES
app.use("/file", fileRoute)

// APP LISTENING
app.listen(port, (error) => {
  if (!error) console.log(`server is successfully running on port ${port}`);
  else console.log(`error occurred, server can't start ${error}`);
});
