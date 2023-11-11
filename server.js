require("dotenv").config();
const express =  require("express")
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();
const connectToDatabase = require("./database/database");

// -------- DATA BASE CONNECTION -----------
connectToDatabase() // here database is connection takes place & a default admin user is created

// ---------- MIDDLEWARE ------------
app.use(bodyParser.urlencoded({ extended: false }));
const origin1 = process.env.ALLOWED_ORIGIN1;
app.use(cors({
    origin : [origin1],
   methods:["GET","POST","DELETE","PUT"],
   credentials : true
}));
app.use(express.json());

const homeResponseData = {
    response : "Welcome to IGIT MCA server."
}




// -------- ALL ROUTES ----------------
app.use("/api/user/", require("./routes/userRoutes"));
app.use("/api/batch/",require("./routes/batchRoutes"))
app.use("/api/coordinators/",require("./routes/coordinators"));


// ---- HOME ROUTE -----
app.get("/",(req,res)=>{
    res.json(homeResponseData);
})






const port = process.env.PORT || 5000 ;
app.listen(port,()=>{
   console.log(`Server started in the port ${port}. :) Happy coding`);
})