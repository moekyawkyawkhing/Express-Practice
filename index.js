const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routers");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/api", routes);

app.listen(8000, function () {
    console.log("Server running at port 8000...");
});