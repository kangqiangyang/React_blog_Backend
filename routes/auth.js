const router = require("express").Router();
const Users = require("../models/Users");
const bcrypt = require("bcrypt");

// Register new user
router.post("/register", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new Users({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    // save() from mongoose
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    // fetch account by username to if there is account exists in db
    const user = await Users.findOne({
      username: req.body.username,
    });

    // if username not found, means db do not have this account exists
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    //if account exists, then check if password matches
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      res.status(404).json({ message: "Password Not Correct" });
    }

    const { password, ...userWithoutPassword } = user._doc;

    res.status(200).json({ userWithoutPassword, message: "Login Successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
