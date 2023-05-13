const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const cors = require("cors");
const authController = require("./controllers/authController");
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const commentController = require("./controllers/commentController");
const uploadController = require("./controllers/uploadController");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect to mongodb
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to mongodb succed");
  })
  .catch((err) => {
    console.log(err.message);
  });
app.use("/images", express.static("public/images"));
app.use(cors());
app.use("/auth", authController);
app.use("/user", userController);
app.use("/post", postController);
app.use("/comment", commentController);
app.use("/upload", uploadController);

app.listen(process.env.PORT, () => {
  console.log("Listening on port ", process.env.PORT);
});
