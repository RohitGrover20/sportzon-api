const mongoose = require("mongoose");
require("dotenv").config();

const password = encodeURIComponent(process.env.DBPASSWORD);

module.exports = function () {
  mongoose.connect(
    `mongodb+srv://yesteq:Yellow#2424@yesteq.lt5yiuc.mongodb.net/sportzon_dev?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true // Uncomment if needed
      ignoreUndefined: true,
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

