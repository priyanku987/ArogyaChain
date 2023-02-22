const Express = require("express");
const { registerPatient } = require("./auth");
const { createEHR, getEHRByPatient } = require("./chaincode");

const router = Express.Router();

router.post("/auth/rgeisterPatient", registerPatient);

router.post("/chaincode/createEHR", createEHR);
router.get("/chaincode/getEHRByPatient", getEHRByPatient);

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports.hospRouter = router;
