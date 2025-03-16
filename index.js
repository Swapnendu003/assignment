const express = require("express");
const app = express();
const cors = require("cors");
const connectDatabase = require("./config/db");
const adminRouter = require("./routes/adminRoutes");
const userRouter = require("./routes/userRoutes");
const dotenv = require("dotenv");
dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // This API is accessible from everywhere.
      // Explicitly allowing https://assignment-mocha-eight.vercel.app/ as well.
      callback(null, true);
    },
    credentials: true
  })
);
app.use("/admin", adminRouter);
app.use("/user", userRouter);

app.all("/", (req, res) => {
    console.log("Just got a request!");
    console.log("MONGO_URI:", process.env.MONGO_URI);
    res.send("Yo yo");
  });
  connectDatabase();
  app.listen(process.env.PORT || 3000, () => {
    console.log("Your Server is running at port 3000");
  });

