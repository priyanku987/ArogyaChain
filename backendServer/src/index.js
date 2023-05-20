const Express = require("express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const session = require("express-session");
const userRouter = require("./user");
const hospRouter = require("./hosp");
const commonRouter = require("./common");

const app = Express();

const memoryStore = new session.MemoryStore();

var whitelist = [
  "http://localhost:3000",
  "http://192.168.1.8:3000",
  "http://10.42.0.1:3000",
  "http://172.16.65.60:3000",
  "http://172.20.10.3:3000",
  "http://192.168.36.131:3000",
  "http://192.168.36.131:3000",
];
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(helmet());

app.use(Express.urlencoded({ extended: true }));
app.use(Express.json({ limit: "50mb" }));
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(
  session({
    secret: "njwwpehfuwfuwiqpropznqkwfuiwf",
    resave: false,
    saveUninitialized: false,
    store: memoryStore,
  })
);

app.use("/common", commonRouter);
app.use("/health", (req, res) => res.sendStatus(200));

app.use("/healthcare", hospRouter);

app.use("/user", userRouter);

module.exports = app;
