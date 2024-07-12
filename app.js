const express = require("express");
const app = express();
const connectdb = require("./db/dbconnect");
const routes = require("./routes/route");
require("dotenv").config();

app.use(express.static("./public"));
app.use(express.json());

app.use("/api/v1", routes);
app.use("/", routes);

const PORT = process.env.PORT || 4000;
const start = async () => {
  try {
    await connectdb(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
