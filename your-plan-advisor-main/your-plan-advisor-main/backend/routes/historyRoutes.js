const express = require("express");
const History = require("../models/History");

const router = express.Router();


// SAVE HISTORY
router.post("/save-history", async (req, res) => {

  try {

    const { userId, feature, inputData, result } = req.body;

    const history = new History({
      userId,
      feature,
      inputData,
      result
    });

    await history.save();

    res.json({ message: "History saved successfully" });

  } catch (error) {

    res.status(500).json({ error: "Failed to save history" });

  }

});


// GET USER HISTORY
router.get("/history/:userId", async (req, res) => {

  try {

    const history = await History.find({
      userId: req.params.userId
    }).sort({ date: -1 });

      res.json(history);

  } catch (error) {

    res.status(500).json({ error: "Failed to fetch history" });

  }

});

module.exports = router;