const Express = require("express");
const { registerIdentity } = require("./auth");
const { createEHR, getEHRByPatient } = require("./chaincode");
const injectIdentity = require("../middlewares/identityInjectionMiddleware");

const router = Express.Router();

router.use(injectIdentity);
router.post("/auth/registerIdentity", registerIdentity); //tested
router.post("/chaincode/createEHR", createEHR); // tested
router.get("/chaincode/getEHRByPatient", getEHRByPatient); // tested

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports = router;
