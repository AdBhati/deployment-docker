require('dotenv').config();
const mongoose = require("mongoose");

const dbConfig = async () => {
  console.log('ENVIRONMENT======> ', process.env.ENVIRONMENT)
  try {
    const uri =
      process.env.ENVIRONMENT === "local"
        ? process.env.MONGODB_URI_LOCAL
        : process.env.MONGODB_URI_DOCKER;
    await mongoose.connect(uri, {
      dbName: "gmailapi",
    });
    console.log(`MongoDB Connected!!!`);
  } catch (error) {
    console.log(`Error Connecting Mongodb...`, error);
  }
};

module.exports = dbConfig;