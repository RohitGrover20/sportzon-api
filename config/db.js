const mongoose = require("mongoose");
require("dotenv").config();

const password = encodeURIComponent(process.env.DBPASSWORD);
module.exports = function () {
  mongoose.connect(
    `mongodb+srv://${process.env.DBUSER}:${password}@cluster1.v23jzfm.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority&appName=Cluster1`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });
};
