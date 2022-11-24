const express = require("express");
require("./db");
const userRouter = require("./routes/user");
require("dotenv").config();

const app = express();

const PORT = 8000;

app.use(express.json());
app.use("/api/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server Run ${PORT}`);
});
