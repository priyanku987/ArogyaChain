const Express = require("express");

const router = Express.Router();

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports.hospRouter = router;
