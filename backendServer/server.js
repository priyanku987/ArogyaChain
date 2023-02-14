require("dotenv").config();
const http = require("http");
const handler = require("./src");

const server = http.createServer(handler);
const port = process.env.PORT || 6004;
server.listen(
  port,
  console.log(`ArogyaEhrchain Backend server is running on port ${port} 🍌`)
);
