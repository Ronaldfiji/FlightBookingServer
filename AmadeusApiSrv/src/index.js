// index.js
const express = require("express");
const router = require("./router");
const bodyParser = require("body-parser");
const cors = require("cors");
const PORT = 1338;
const app = express();


var http = require("http").createServer(app);
var parse = require("socket.io")(http);

app.use(express.static("public"));

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

//app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000'
}));
// Apply JSON parsing middleware
app.use(express.json());
// Apply router
app.use("/", router);
// Serving app on defined PORT
app.listen(PORT, () => {
  console.log(`Express is running on port ${PORT}`);
});