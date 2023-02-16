const Express = require("express");
const { registerPatient } = require("./auth");

const router = Express.Router();

router.post("/auth/rgeisterPatient", registerPatient);

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports.hospRouter = router;
