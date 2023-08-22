const cookieSession = require("cookie-session");
const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const passportSetup = require("./passport");
const passport = require("passport");
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
const landingAuthRouter = require("./Landing/Routers/Auth");
const landingEventRouter = require("./Landing/Routers/Events");
const landingVenueRouter = require("./Landing/Routers/Venues");
const landingCourtRouter = require("./Landing/Routers/Courts");
const landingBookingRouter = require("./Landing/Routers/Bookings");
const landingPaymentRouter = require("./Landing/Routers/Payment");
const landingSearchRouter = require("./Landing/Routers/Search");
const landingBannerRouter = require("./Landing/Routers/Banner");
const landingClassRouter = require("./Landing/Routers/Classes");
const db = require("./config/db");

const app = express();
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.json({ limit: "50mb" }))
// app.use(express.urlencoded({ limit: "50mb" }))
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 1000000,
  })
);

// app.use((req, res, next) => {
// 	res.setHeader('Access-Control-Allow-Origin', '*');
// 	res.setHeader(
// 		'Access-Control-Allow-Headers',
// 		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
// 	);
// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
// 	next();
// });

db();

app.use((req, res, next) => {
  const allowedOrigins = ["http://localhost:8080", "http://localhost:3000"];
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
  res.setHeader("Access-Control-Allow-Credentials", true);
  return next();
});
// app.use(cors()); //And add this line as well

app.use(
  cookieSession({
    name: "sessionId",
    keys: ["thisismysecrctekeyfhrgfgrfrty84fwir767"],
    maxAge: 24 * 60 * 60 * 100,
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

app.use("/clubs", clubRouter);
app.use("/roles", roleRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/sports-arenas", arenaRouter);
app.use("/courts", courtRouter);
app.use("/events", eventRouter);
app.use("/coaches", coachRouter);
app.use("/classes", classRouter);
app.use("/banners", bannerRouter);
app.use("/bookings", bookingRouter);
app.use("/landing/auth", landingAuthRouter);
app.use("/landing/events", landingEventRouter);
app.use("/landing/venues", landingVenueRouter);
app.use("/landing/courts", landingCourtRouter);
app.use("/landing/bookings", landingBookingRouter);
app.use("/landing/payments", landingPaymentRouter);
app.use("/landing/banners", landingBannerRouter);
app.use("/landing/search", landingSearchRouter);
app.use("/landing/classes", landingClassRouter);

app.listen("9000", () => {
  console.log("Server is running!");
});
