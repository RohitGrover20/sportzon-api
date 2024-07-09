const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const GithubStrategy = require("passport-github2").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("./users/Model");
const { hash } = require("bcrypt");
const bcrypt = require("bcrypt");
require("dotenv").config();

// const GOOGLE_CLIENT_ID = "115484652468-mbs94pvo592o8nmrljft2r2ul09cmnff.apps.googleusercontent.com"
// const GOOGLE_CLIENT_SECRET = "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"

FACEBOOK_APP_ID = "1017773106075830";
FACEBOOK_APP_SECRET = "5a93251be9a17d173295a8bedcaa5d26";

// GITHUB_CLIENT_ID = "your id";
// GITHUB_CLIENT_SECRET = "your id";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "159954446675-rjctmid6695at2uvvrob0lt4np4lveme.apps.googleusercontent.com",
      clientSecret: "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",
      // callbackURL: `${process.env.CLIENT_URL}/auth/google/callback`,
      // callbackURL: `https://backend.sportzon.in/auth/google/callback`,
      callbackURL: `https://sportzon.in/api/auth/google/callback`,
      scope: ["email", "profile"],
    },
    function (accessToken, refreshToken, profile, done) {
      const user = profile && profile._json;
      User.findOne({ email: user.email }).then((result) => {
        if (!result) {
          hash("TemporaryPassword@1000", 10, async (err, hash) => {
            if (hash) {
              const create = await User.create({
                firstName: user.given_name,
                lastName: user.family_name,
                profile: user.picture,
                email: user.email,
                // mobile: user.mobile,
                password: hash,
                club: "64a7c238ce825993da286481",
                role: "64ba1e1408376a6fd50c50f2",
              });

              if (create) {
                create.password = undefined;
                done(null, create);
              }
            }
          });
        } else {
          result.password = undefined;
          done(null, result);
        }
      });
    }
  )
);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "823709165958787",
//       clientSecret: "a124a0a79c1f2cd78c6b92b8d36e9a85",
//       callbackURL: `${process.env.CLIENT_URL}/api/auth/facebook/callback`,
//     },
//     function (accessToken, refreshToken, profile, done) {
//       return done(null, profile);
//     }
//   )
// );

passport.use(
  new FacebookStrategy(
    {
      clientID: "823709165958787",
      clientSecret: "a124a0a79c1f2cd78c6b92b8d36e9a85",
      // callbackURL: "/auth/facebook/callback",
      // callbackURL: `https://backend.sportzon.in/auth/facebook/callback`,
      callbackURL: `https://sportzon.in/api/auth/facebook/callback`,

    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await User.findOne({
          $or: [{ email: username }, { mobile: username }],
        });
        if (!user) {
          return done(null, false);
        } else {
          const userPass = user.password;
          const matchPassword = await bcrypt.compare(password, userPass);
          if (matchPassword) {
            user.password = undefined;
            return done(null, user);
          } else {
            return done(null, false);
          }
        }
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
