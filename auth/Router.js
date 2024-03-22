const router = require("express").Router();
const passport = require("passport");
require("dotenv").config();

const { verify, verfiySession } = require("./Controller");

const CLIENT_URL = process.env.CLIENT_URL;

router.get("/verify-session", verfiySession);
router.post("/verify", verify);

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      code: 1,
      //   cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    code: 0,
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect(CLIENT_URL);
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  // `${process.env.CLIENT_URL}/google/callback`,
  `/google/callback`,

  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://backend.sportzon.in/auth/login/failed`,
  })
);

router.get("/github", passport.authenticate("github", { scope: ["profile"] }));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: CLIENT_URL,
    failureRedirect: `${process.env.CLIENT_URL}/api/auth/login/failed`,
  })
);

// router.get(
//   "/facebook",
//   passport.authenticate("facebook", { scope: ["profile"] })
// );

// router.get(
//   `${process.env.CLIENT_URL}/api/auth/facebook/callback`,
//   passport.authenticate("facebook", {
//     successRedirect: CLIENT_URL,
//     failureRedirect: `${process.env.CLIENT_URL}/api/auth/login/failed`,
//   })
// );

router.get("/facebook", passport.authenticate("facebook", { scope: ["profile"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: CLIENT_URL,
    failureRedirect: `https://backend.sportzon.in/auth/login/failed`,
  })
);
router.post(
  "/landing/login",
  passport.authenticate("local", {
    failureRedirect: `${process.env.CLIENT_URL}/api/auth/login/failed`,
  }),
  function (req, res) {
    return res.status(200).json({
      code: "authorised",
      message: "User were logged in successfully",
    });
  }
);

module.exports = router;
