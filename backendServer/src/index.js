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
app.use("/health", (req, res) => res.status(200));

app.all("/healthcare", hospRouter);

app.all("/user", userRouter);

module.exports = app;
