const express =  require("express")
const app = express();


const homeResponseData = {
    response : "Welcome to IGIT MCA server.",
    status : "Server is healthy",
    message : "🧑‍💻 You can hit me with api's & I will treat you with cake 🍰!",
    author : "Satyanarayan 🧑‍🦱",
    route : "You are on home route '/' 🏠",
    coding_joke : "Copy-and-Paste was programmed by programmers for programmers actually! 👩‍💻👨‍💻💻",
    frameWork : "Express 🚄",
    warning : "Call me with bad name, I will respond 🤔404🥴"
}


app.get("/",(req,res)=>{
    res.json(homeResponseData);
})






const port = process.env.PORT || 5000 ;
app.listen(port,()=>{
   console.log("Server started in the port 5000. :) Happy codind");
})