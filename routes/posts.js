const router = require("express").Router();
const Users = require("../models/Users");
const Posts = require("../models/Posts");

// Create Post
router.post("/", async (req, res) => {
  const newPosts = new Posts(req.body);

  try {
    // save() from mongoose
    const savePosts = await newPosts.save();
    res.status(200).json({ savePosts, message: "Post Created Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Post
router.put("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const updatePosts = await Posts.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );

        res
          .status(200)
          .json({ updatePosts, message: "Post Updated Successfully!" });
      } catch (error) {
        res.status(500).json({ message: "Post Updated failed!" });
      }
    } else {
      res
        .status(401)
        .json({ message: "You are not authorized to update this post!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not Find the Post to update!" });
  }
});

// Delete Post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        const deletePosts = await Posts.findByIdAndDelete(req.params.id);

        res
          .status(200)
          .json({ deletePosts, message: "Post Deleted Successfully!" });
      } catch (error) {
        res.status(500).json({ message: "Post Deleted failed!" });
      }
    } else {
      res
        .status(401)
        .json({ message: "You are not authorized to delete this post!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not Find the Post to update!" });
  }
});

// Get Posts
router.get("/:id", async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.status(200).json({ post, message: "Post Found!" });
  } catch (error) {
    res.status(500).json({ message: "Post Not Found" });
  }
});

// Get All Posts
router.get("/", async (req, res) => {
  // /?username = "yang" or /?catName = "music"
  // check the url query has username or category or not
  const username = req.query.username;
  const catName = req.query.catName;
  try {
    let posts;

    // if has username in query of url, fetch all posts by username
    if (username) {
      posts = await Posts.find({ username: username });
    } else if (catName) {
      // if has category in query of url, fetch all posts by category

      posts = await Posts.find({
        categories: {
          $in: [catName],
        },
      });
    } else {
      // if no query of url, fetch all posts

      posts = await Posts.find();
    }
    res.status(200).json({ posts, message: "Post Found!" });
  } catch (error) {
    res.status(500).json({ message: "Post Not Found" });
  }
});

module.exports = router;
