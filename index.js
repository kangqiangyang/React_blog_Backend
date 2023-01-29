const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/category");
const multer = require("multer");

dotenv.config();
// postman send json file
app.use(express.json());

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//upload file .. images/video..
const storage = multer.diskStorage({
  //where should the file be saved
  destination: (req, file, cb) => {
    // cb == callback function ==> take error
    cb(null, "images");
  },
  // the saved file name
  filename: (req, file, cb) => {
    // send to client side
    cb(null, req.body.name);
  },
});

const upload = multer({
  storage: storage,
});

// upload.single ==> only upload one file
// upload.single("file") - file ==> form-data
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File uploaded successfully!");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/category", categoryRoute);

const port = process.env.PORT || 5555;

app.listen(port, () => {
  console.log(`Backend is running IN ${port}`);
});
