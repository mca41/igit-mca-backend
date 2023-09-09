// Goal :: Creates a default admin for login!
require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

// this function is called in main file server.js
const createDefaultAdmin = async () => {
  // --- create admin function starts ----

  const defaultAdminEmail = process.env.DEFAULT_ADMIN_EMAIL;
  const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD;
  // ---- CREATES DEFAULT ADMIN for APPLICATION 
  //:: This helps when you deploy your entire application to new environment, when you need to register first, under category to create a new category (Especially when there is no category previously created, because category is created by user. So if there is no user there is no category, if there is no category how a user will register) :: This will form like DEAD LOCK SITUATION 
  if (defaultAdminEmail === undefined || defaultAdminPassword === undefined) {
    // -- Throw error when default admin email or password not given ---
    throw new Error("Default admin check or new admin creation failed. Please provide admin email & password parameter in .env file")
  } else {
    // create default admin if not created previously
    const findAdmin = await User.findOne({ email: defaultAdminEmail });
    if (findAdmin) {
      console.log("Admin exists 🛠️");
    } else {
      // create new admin
      const hashedPassword = bcrypt.hashSync(defaultAdminPassword, saltRounds);
      const newAdminUser = new User({
        email: defaultAdminEmail,
        isSpecialUser: "admin", // admin
        status: 1, // verified
        userDetails: {
          fName: "Admin",
          mName: "Igit",
          lName: "MCA",
          password: hashedPassword,
        }
      });
      await newAdminUser.save()
      console.log("Default admin created!");
    }
  }
  // --- create admin function ends ----
}


module.exports = createDefaultAdmin;