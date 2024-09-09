const Events = require("../../events/Model");
const Users = require("../../users/Model");
const Coaches = require("../../coaches/Model");
const {Booking} = require("../../bookings/Model");
const Students = require("../../students/Model");
const Clubs = require("../../club/Model");
const { SubscriptionBooking } = require("../../subscriptionBookings/Model");
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getMonthIndex = (month) => MONTHS.indexOf(month);

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const currentYear = new Date().getFullYear();

      // Fetch data from various models concurrently
      const [
        totalEvents,
        totalUsers,
        totalCoaches,
        totalBookings,
        totalStudents,
        totalAcademies,
        membershipsCount,
        monthlyEventCounts,
        monthlyUserCounts,
      ] = await Promise.all([
        Events.countDocuments(),
        Users.countDocuments(),
        Coaches.countDocuments(),
        Booking.countDocuments(),
        Students.countDocuments(),
        Clubs.countDocuments(),
        SubscriptionBooking.countDocuments(),
        Events.aggregate([
          {
            $match: {
              eventDate: {
                $exists: true,
                $ne: null,
                $gte: new Date(`${currentYear}-01-01`),
                $lt: new Date(`${currentYear + 1}-01-01`),
              },
            },
          },
          {
            $group: {
              _id: { $month: { $toDate: "$eventDate" } },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              month: {
                $let: {
                  vars: { monthArray: MONTHS },
                  in: {
                    $arrayElemAt: ["$$monthArray", { $subtract: ["$_id", 1] }],
                  },
                },
              },
              count: 1,
              _id: 0,
            },
          },
        ]),
        Users.aggregate([
          {
            $match: {
              createdAt: {
                $gte: new Date(`${currentYear}-01-01`),
                $lt: new Date(`${currentYear + 1}-01-01`),
              },
            },
          },
          {
            $group: {
              _id: { $month: { $toDate: "$createdAt" } },
              count: { $sum: 1 },
            },
          },
          {
            $project: {
              month: {
                $let: {
                  vars: { monthArray: MONTHS },
                  in: {
                    $arrayElemAt: ["$$monthArray", { $subtract: ["$_id", 1] }],
                  },
                },
              },
              count: 1,
              _id: 0,
            },
          },
        ]),
      ]);

      // Ensure monthlyEventCounts and monthlyUserCounts are arrays
      const monthlyEventCountsArray = Array.isArray(monthlyEventCounts)
        ? monthlyEventCounts
        : [];
      const monthlyUserCountsArray = Array.isArray(monthlyUserCounts)
        ? monthlyUserCounts
        : [];

      // Initialize arrays with counts set to 0 for all months
      const initializedMonthlyEventCountsArray = Array.from(
        { length: 12 },
        (_, monthIndex) => ({ month: MONTHS[monthIndex], count: 0 })
      );
      const initializedMonthlyUserCountsArray = Array.from(
        { length: 12 },
        (_, monthIndex) => ({ month: MONTHS[monthIndex], count: 0 })
      );

      // Update counts based on actual data
      monthlyEventCountsArray.forEach((result) => {
        const monthIndex = getMonthIndex(result.month);
        if (initializedMonthlyEventCountsArray[monthIndex]) {
          initializedMonthlyEventCountsArray[monthIndex].count = result.count;
        }
      });

      monthlyUserCountsArray.forEach((result) => {
        const monthIndex = getMonthIndex(result.month);
        if (initializedMonthlyUserCountsArray[monthIndex]) {
          initializedMonthlyUserCountsArray[monthIndex].count = result.count;
        }
      });
      // Respond with the calculated monthly counts and other data
      return res.status(200).json({
        code: "fetched",
        message: "Dashboard Data were fetched",
        data: {
          totalEvents,
          totalUsers,
          totalCoaches,
          totalBookings,
          totalStudents,
          totalAcademies,
          membershipsCount,
          monthlyEventCounts: initializedMonthlyEventCountsArray,
          monthlyUserCounts: initializedMonthlyUserCountsArray,
        },
      });
    } catch (err) {
      return res.status(500).json({
        code: "error",
        message: "Error occurred while fetching dashboard data",
        data: err,
      });
    }
  },
};
