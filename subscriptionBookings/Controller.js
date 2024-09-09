const { SubscriptionBooking } = require("./Model");

module.exports = {
  // Get All Subscription Members
  getAllSubscriptionMembers: async (req, res) => {
    try {
      const subscriptionMember = await SubscriptionBooking.find().sort({createdAt:-1});
      res.status(200).json(subscriptionMember);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  addSubscriptionBooking: async (req, res) => {
    try {
      // const bookingId = `SUBSCRIPTIONBKG${Date.now()}`;

      // Fetch subscription plans data from the external API
      const subscriptionPlansResponse = await axios.get(
        "http://localhost:9000/landing/subscription"
      );
      const subscriptionPlans = subscriptionPlansResponse.data.data; // Adjust according to the API response structure
      // Find the relevant subscription plan from the fetched data
      const plan = subscriptionPlans.find(
        (plan) => plan?.planName === req.body.planName
      );

      if (!plan) {
        return res.status(400).json({
          message: "Invalid plan name",
          code: "invalid_plan",
        });
      }

      // Base duration is one year (365 days)
      const baseDurationInDays = 365;

      // Extract the extension duration (days) from the plan's features
      const extensionFeature = plan.features.find(
        (feature) => feature.details && !isNaN(feature.details)
      );
      const extensionInDays = extensionFeature
        ? parseInt(extensionFeature.details, 10)
        : 0;

      // Calculate start and end dates
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(
        startDate.getDate() + baseDurationInDays + extensionInDays
      );

      // Create the subscription booking
      const addBooking = await SubscriptionBooking.create({
        ...req.body,
        // bookingId,
        startDate,
        endDate,
      });

      // Return a success response
      return res.status(200).json({
        data: addBooking,
        message: "Subscription was created successfully",
        code: "created",
      });
    } catch (err) {
      console.error(err);
      return res.status(400).json({
        message: "Error occurred",
        code: "error",
      });
    }
  },
};
