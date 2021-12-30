const mongoose = require('mongoose');
require("dotenv").config();
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Database Connected successfully");
});

module.exports = () => {
    mongoose.connect(
        process.env.Database,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    )
};