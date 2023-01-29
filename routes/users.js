const router = require("express").Router();
const Users = require("../models/Users");
const Posts = require("../models/Posts");

const bcrypt = require("bcrypt");

// Update user
router.put("/:id", async (req, res) => {
  // if userId not equal to req.params.id
  if (req.body.userId !== req.params.id) {
    return res.status(401).json({
      message: "Unauthorized UserId,You can only update to your account!",
    });
  } else {
    // if want to update password, bcrypt it first
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    try {
      // find user id and update it to db
      // {new: true} return the updated user, or it will return the old user info
      const updatedUser = await Users.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );

      res
        .status(200)
        .json({ updatedUser, message: "User updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  // if userId not equal to req.params.id
  if (req.body.userId !== req.params.id) {
    return res.status(401).json({
      message: "Unauthorized UserId,You can only delete to your account!",
    });
  } else {
    try {
      // find the deleted account exists or not
      const deletedUser = await Users.findById(req.params.id);

      //   if account found
      try {
        //   delete the account and all Posts
        await Posts.deleteMany({ username: deletedUser.username });
        await Users.findByIdAndDelete(req.params.id);

        res.status(200).json("User deleted successfully!");
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } catch (error) {
      res.status(404).json("Could not find user to delete!");
    }
  }
});

// Get user
router.get("/:id", async (req, res) => {
  try {
    // find the account exists or not
    const user = await Users.findById(req.params.id);

    //   if account found
    try {
      const { password, ...userWithoutPassword } = user._doc;
      res.status(200).json({ userWithoutPassword, message: "User Found!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  } catch (error) {
    res.status(404).json("Could not find user");
  }
});

module.exports = router;
