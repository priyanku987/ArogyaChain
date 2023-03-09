const Express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const userRouter = require("./user");
const hospRouter = require("./hosp");

const app = Express();

app.use(helmet());
app.use(Express.urlencoded({ extended: true }));
app.use(Express.json({ limit: "50mb" }));
app.use(cors());
app.use("/health", (req, res) => res.sendStatus(200));

app.use("/healthcare", hospRouter);

app.use("/user", userRouter);

module.exports = app;
