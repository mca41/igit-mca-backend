const express =  require("express")
const bodyParser = require("body-parser");
const cors = require("cors")
const app = express();

// -------- DATA BASE CONNECTION -----------
const connectToDatabase = require("./database/database");
connectToDatabase();

// ---------- MIDDLEWARE ------------
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
app.use(express.json());
// --------Home ROUTE ---------
const homeResponseData = {
    response : "Welcome to IGIT MCA server."
}




// -------- ALL ROUTES ----------------
app.use("/api/user/", require("./routes/userRoutes"));

app.get("/",(req,res)=>{
    res.json(homeResponseData);
})






const port = process.env.PORT || 5000 ;
app.listen(port,()=>{
   console.log("Server started in the port 5000. :) Happy coding");
})