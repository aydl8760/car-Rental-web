const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const listRoutes = require("./routes/listRoutes");
const userRoutes = require("./routes/userRoutes");
const dbConnect = require("./config/dbConnect");

dbConnect();

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/list", listRoutes);
app.use("api/user", userRoutes);

app.listen(PORT, () => {
  console.log(`server runing on ${PORT}`);
});
