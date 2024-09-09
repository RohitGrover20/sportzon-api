const Wallet = require("./Model");

module.exports = {
// Fetch Wallet Transactions (only recharge transactions)
getRechargeTransactions: async (req, res) => {
  try {
    const transactions = await Wallet.find({
      type: "recharge",
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      data: transactions,
      message: "Recharge transactions fetched successfully.",
      code: "fetched",
    });

  } catch (err) {
    console.error("Error fetching recharge transactions:", err);
    return res.status(400).json({
      data: err,
      message: "An error occurred while fetching recharge transactions.",
      code: "error",
    });
  }
},
};
