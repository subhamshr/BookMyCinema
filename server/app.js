const express = require("express");
require("dotenv").config();
const cors = require("cors");
const route = require("./routes/index");
const morgan = require("morgan");

const app = express();
const port = Number(process.env.PORT);

app.use(cors());
const mongoose = require("mongoose");


// database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.log("Database Error", error);
  });

app.use(express.json());
app.use(morgan("short"));
app.use("/", route);



app.use((err, req, res, next) => {
  const errorMsg = err ? err.toString() : "Something went wrong";
  res.status(500).json({ msg: errorMsg });
});

app.listen(port, () => {
  console.log(`Appilcation is running at port ${port}`);
});
