const mongoose = require("mongoose");

async function DB() {
  mongoose.connect("mongodb+srv://happydream9032:rkgjdtmd2304@cluster0.i3vjm38.mongodb.net/");
  const connection = mongoose.connection;

  connection.on("connected", () => {
    console.info("Mongoose Connected ");
  });

  connection.on("error", (err) => {
    console.error(`Mongoose Connection Error: ${err.message}`);
  });

  connection.on("disconnected", () => {
    console.log("Mongoose Disconnected");
  });
}

module.exports = DB;
