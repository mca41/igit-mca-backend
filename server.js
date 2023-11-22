require("dotenv").config();
const express =  require("express")
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
const connectToDatabase = require("./database/database");

// -------- DATA BASE CONNECTION -----------
// use async/await to wait for the connection
(async () => {
  try {
    await connectToDatabase(); // here database is connection takes place & a default admin user is created
    // start the server after the connection is ready
    const port = process.env.PORT || 5000 ;
    app.listen(port,()=>{
      console.log(`Server started in the port ${port}. :) Happy coding`);
    })
  } catch (error) {
    console.log("Unable to connect database ");
  }
})();

// ---------- MIDDLEWARE ------------
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

const homeResponseData = {
    response : "Welcome to IGIT MCA server."
}

// -------- ALL ROUTES ----------------
app.use("/api/user/", require("./routes/userRoutes"));
app.use("/api/batch/",require("./routes/batchRoutes"))
app.use("/api/coordinators/",require("./routes/coordinators"));
app.use("/api/accounts",require("./routes/adminRoutes")); // fetches all users account for admin page
app.use("/api/user/editProfile", require("./routes/userProfileEdit")); // to edit users profile
app.use("/api/post", require("./routes/postRoute")); // to create & delete post

// ---- HOME ROUTE -----
app.get("/",(req,res)=>{
    res.json(homeResponseData);
})
