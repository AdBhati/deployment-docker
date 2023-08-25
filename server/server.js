require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dbconfig = require("./config/dbconfig");
const userRoute = require("./routes/userRoute");
const roleRoute = require("./routes/roleRoute");
const leadRoute = require("./routes/leadRoute");
const taskRoute = require("./routes/taskRoute");
const emailRoute = require("./routes/emailRoute");

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);
app.use("/api/leads", leadRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/emails", emailRoute);

const init = async () => {
  await dbconfig();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
  });

  // await saveLeadAndTasksHelper();
};

init();
