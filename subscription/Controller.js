const Subscription = require("./Model");

// POST API to create a new subscription
const createSubscription = async (req, res) => {
  try {
    const { planName, price, features } = req.body;

    // Check for duplicate plan
    const existingSubscription = await Subscription.findOne({ planName });
    if (existingSubscription) {
      return res
        .status(400)
        .json({ code: "duplicate", message: "Plan already exists" });
    }

    const newSubscription = new Subscription({ planName, price, features });
    await newSubscription.save();

    res
      .status(201)
      .json({ code: "created", message: "Subscription created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET API to fetch all subscriptions
const getAllSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateSubscription = async (req, res) => {
  try {
    const { _id, planName, price, features } = req.body;

    // Proceed with the update if no duplicity is found
    const updatedSubscription = await Subscription.findByIdAndUpdate(
      _id,
      { planName, price, features },
      { new: true }
    );

    if (updatedSubscription) {
      return res.status(200).json({
        code: "updated",
        message: "Subscription updated successfully.",
        data: updatedSubscription,
      });
    } else {
      return res.status(404).json({
        code: "error",
        message: "Subscription not found.",
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      code: "error",
      message: "Something went wrong. Please try again.",
      data: err,
    });
  }
};

module.exports = {
  createSubscription,
  getAllSubscriptions,
  updateSubscription,
};
