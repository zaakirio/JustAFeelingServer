const router = require("express").Router();
const Feeling = require("../models/feelingModel");
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res) => {
  try {
    const { feeling } = req.body;

    const newFeeling = new Feeling({
      feeling,
    });

    const savedFeeling = await newFeeling.save();

    res.json(savedFeeling);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const feelings = await Feeling.find();
    res.json(feelings);
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

module.exports = router;
