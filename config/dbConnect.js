const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("db connected successfully");
  } catch (error) {
    console.log("Db connection failed", error);
  }
};
dbConnect();
module.exports = dbConnect;
