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
    origin: "*",
  })
);
app.use("/admin", adminRouter);
app.use("/user", userRouter);
{/*Test Commit*/}

app.all("/", (req, res) => {
    console.log("Just got a request!");
    console.log("MONGO_URI:", process.env.MONGO_URI);
    res.send("Yo yo");
  });
  connectDatabase();
  app.listen(process.env.PORT || 3000, () => {
    console.log("Your Server is running at port 3000");
  });

