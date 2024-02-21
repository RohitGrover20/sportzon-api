const mongoose = require("mongoose");
require("dotenv").config();

const password = encodeURIComponent(process.env.DBPASSWORD);

module.exports = function () {
  mongoose.connect(
    `mongodb+srv://${process.env.DBUSER}:${password}@yesteq.lt5yiuc.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true // Uncomment if needed
      bufferCommands: false, // Disable buffering
      bufferTimeoutMS: 60000 ,
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

