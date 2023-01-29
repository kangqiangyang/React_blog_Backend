const router = require("express").Router();
const Category = require("../models/category");

// Create Category
router.post("/", async (req, res) => {
  const newCategories = new Category(req.body);

  try {
    // save() from mongoose
    const saveCategories = await newCategories.save();
    res
      .status(200)
      .json({ saveCategories, message: "Category Created Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Category
router.get("/", async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json({ category, message: "Category Found Successfully!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
