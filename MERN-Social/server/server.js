require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const connectDB = require("./config/db");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// connectDB
connectDB()

//router
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/upload'))

app.listen(PORT, () => {
  console.log("Server is running on: ", PORT);
});
