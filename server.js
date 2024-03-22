const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const passportSetup = require("./passport");
const passport = require("passport");
const OtpRouter = require("./Otp/Router");
const clubRouter = require("./club/Router");
const roleRouter = require("./roles/Router");
const userRouter = require("./users/Router");
const authRouter = require("./auth/Router");
const arenaRouter = require("./arenas/Router");
const courtRouter = require("./courts/Router");
const eventRouter = require("./events/Router");
const bookingRouter = require("./bookings/Router");
const bannerRouter = require("./banner/Router");
const classRouter = require("./classes/Router");
const coachRouter = require("./coaches/Router");
const feesRouter = require("./fees/Router");
const testimonialRouter = require("./testimonials/Router");
const AffiliateRouter = require("./affiliate/Router");
const TicketRouter = require("./helpDesk/Router");
const reportsRouter = require("./reports/Router");
const deleteRouter = require("./delete/Router");
const studentsRouter = require("./students/Router");
const landingAuthRouter = require("./Landing/Routers/Auth");
const landingDashboardRouter = require("./Landing/Routers/Dashboard");
const landingEventRouter = require("./Landing/Routers/Events");
const landingVenueRouter = require("./Landing/Routers/Venues");
const landingCourtRouter = require("./Landing/Routers/Courts");
const landingBookingRouter = require("./Landing/Routers/Bookings");
const landingPaymentRouter = require("./Landing/Routers/Payment");
const landingSearchRouter = require("./Landing/Routers/Search");
const landingBannerRouter = require("./Landing/Routers/Banner");
const landingClassRouter = require("./Landing/Routers/Classes");
const landingCoachRouter = require("./Landing/Routers/Coaches");
const landingFeesRouter = require("./Landing/Routers/Fees");
const landingTestimonialRouter = require("./Landing/Routers/Testimonials");
const landingReportRouter = require("./Landing/Routers/Reports");
const landingRatingRouter = require("./Landing/Routers/Rating");
const landingContactFormRouter = require("./Landing/Routers/Contact");
const landingClassRegistration = require("./Landing/Routers/ClassRegistration");
const dashboardRouter = require("./dashboard/Router");

const db = require("./config/db");

const app = express();
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

const corsConfig = {
  credentials: true,
  origin: true,
};
app.use(cors(corsConfig));

db();

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:8080",
    "http://localhost:3000",
    "https://crm.sportzon.in",
    "https://www.sportzon.in",
  ];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, GET");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});

app.use(
  cookieSession({
    name: "sessionToken",
    keys: ["thisismysecrctekeyfhrgfgrfrty84fwir767"],
    maxAge: 24 * 60 * 60 * 100,
    domain: "localhost",
    // domain : "sportzon.in"
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/home", (req, res) => {
  res.set("Content-Type", "text/html");
  res.send(
    Buffer.from(
      "<h2 style='font-size: 5rem; color: red'>Application running</h2>"
    )
  );
});

app.use("/dashboard" , dashboardRouter);
app.use("/clubs", clubRouter); //done
app.use("/roles", roleRouter); //done
app.use("/users", userRouter); //done
app.use("/coaches", coachRouter); //done
app.use("/sports-arenas", arenaRouter); //done
app.use("/events", eventRouter);
app.use("/auth", authRouter);
app.use("/courts", courtRouter);
app.use("/classes", classRouter);
app.use("/banners", bannerRouter);
app.use("/testimonials", testimonialRouter);
app.use("/bookings", bookingRouter);
app.use("/students", studentsRouter);
app.use("/fees", feesRouter);
app.use("/reports", reportsRouter);
app.use("/delete", deleteRouter);
app.use("/otp", OtpRouter);
app.use("/affiliate",AffiliateRouter);
app.use("/ticket" ,TicketRouter );
//-----------Routes for Landing Page------------
app.use("/landing/dashboard",landingDashboardRouter )
app.use("/landing/contact", landingContactFormRouter);
app.use("/landing/auth", landingAuthRouter);
app.use("/landing/events", landingEventRouter);
app.use("/landing/venues", landingVenueRouter);
app.use("/landing/courts", landingCourtRouter);
app.use("/landing/bookings", landingBookingRouter);
app.use("/landing/payments", landingPaymentRouter);
app.use("/landing/banners", landingBannerRouter);
app.use("/landing/coaches", landingCoachRouter);
app.use("/landing/search", landingSearchRouter);
app.use("/landing/class-registration", landingClassRegistration);
app.use("/landing/classes", landingClassRouter);
app.use("/landing/fees", landingFeesRouter);
app.use("/landing/reports", landingReportRouter);
app.use("/landing/testimonials", landingTestimonialRouter);
app.use("/landing/rating", landingRatingRouter);

app.listen("9000", () => {
  console.log("Server is running!");
});
