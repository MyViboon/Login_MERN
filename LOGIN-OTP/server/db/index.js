const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://viboon-admin:TJ6O2eHMRgV9SDgw@test-send-email.e1ayb1v.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("ERROR connect"));
