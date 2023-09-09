require("dotenv").config();
const mongoose = require("mongoose");
const createDefaultAdmin = require("./createDefaultAdminUser")

const dataBaseUrl = process.env.MONGO_DB_URL;
const connectToDatabase = async ()=>{
    try {
        await mongoose.connect(dataBaseUrl,{
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        console.log("connected to database");
        // this function of creating an admin user only runs when database connected successfully
        createDefaultAdmin();
    } catch (error) {
        console.log("Unable to connect database ");
    }
}

module.exports =  connectToDatabase;