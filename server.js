const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();

const cors = require("cors");

const app = express();
app.use(cors());

//middleware
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//import models
// TODO - organize

const router = express.Router();
const authentication = require('./server/routes/authentication')(router);
const animeAPI = require('./server/routes/animeAPI')(router);
const userAPI = require('./server/routes/userAPI')(router);
const timelineAPI = require('./server/routes/timelineAPI')(router);

app.use('/authentication', authentication);
app.use('/api/user', userAPI);
app.use('/api/anime', animeAPI);
app.use('/api/timeline', timelineAPI);

mongoose.set("strictQuery", true);
mongoose
    .connect(
        process.env.MONGODB_CONNECTION_STRING,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            enableUtf8Validation: false
        }
    )
    .then(() => console.log("MongoDB has been connected"))
    .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

// Accessing the path module
const path = require("path");

// Step 1:
app.use(express.static(path.resolve(__dirname, "./client/build")));
// Step 2:
app.get("*", function (request, response) {
    response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});