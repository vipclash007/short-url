const express = require("express");
const { connectToMongoDB } = require("./connect");

const URL = require("./models/url");
const path = require("path")

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const { checkForAuthentication, restrictTo } = require("./middlewares/auth");

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
    .then(() => console.log("mongoDB connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthentication);

app.use("/url",restrictTo(["Normal","Admin"]), urlRoute);  // restricting to normal user only
app.use("/user", userRoute);
app.use("/", staticRoute);

// app.get("/test", async (req, res) => {
//     const allUrls = await URL.find({});
//     return res.render("home", {
//         urls: allUrls,
//     })
// })


app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    
    const entry = await URL.findOneAndUpdate({
        shortId
    }, {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        },
    },
        { new: true }   // This option ensures the updated document is returned
    );

    res.redirect(entry.redirectURL);
})

app.listen(PORT,() => console.log(`Server started at port:${PORT}`));