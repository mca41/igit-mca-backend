require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const connectToDatabase = require("./database/database");
const { serverDownEmail } = require("./helper/sendMail");

// ---------- DATA BASE CONNECTION --------------
(async () => {
  try {
    // either data base will connect or not connect. If not connected then retry 10 times if exceeded then email Admin
    let dbConnected = false;
    let retryDBConnection = 1;
    while (dbConnected === false && retryDBConnection < 10) {
      dbConnected = await connectToDatabase(); // here database is connection takes place & a default admin user is created
      if (dbConnected === false) {
        retryDBConnection++;
      }
    }
    
    if (dbConnected) {
      // start the server only after database connection is ready
      const port = process.env.PORT || 5000;
      return app.listen(port, () => {
        console.log(`Server started in the port ${port}. :) Happy coding`);
      });
    } else {
      // -----------
      const mode = process.env.MODE_ || "production";
      const currentAdminEmail = process.env.ADMIN_NOTIFY_EMAIL;
      if (mode === "production") {
        // Email Admin !! that SERVER IS DOWN !! :: When mode is production only
        const isSent = await serverDownEmail(
          currentAdminEmail,
          "Database connection failed!"
        );
      }
      // -----------
      throw new Error();
    }
  } catch (error) {
    console.log("Unable to connect database ");
  }
})();

// --------- DATA BASE CONNECTION -----------

// ---------- MIDDLEWARE ------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const homeResponseData = {
  response: "Welcome to IGIT MCA server.",
};

// -------- ALL ROUTES ----------------
app.use("/api/user/", require("./routes/userRoutes"));
app.use("/api/batch/", require("./routes/batchRoutes"));
app.use("/api/coordinators/", require("./routes/coordinators"));
app.use("/api/accounts", require("./routes/adminRoutes")); // fetches all users account for admin page
app.use("/api/user/editProfile", require("./routes/userProfileEdit")); // to edit users profile
app.use("/api/post", require("./routes/postRoute")); // to create & delete post

// ---- HOME ROUTE -----
app.get("/", (req, res) => {
  res.json(homeResponseData);
});
