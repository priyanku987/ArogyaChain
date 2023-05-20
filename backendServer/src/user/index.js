const Express = require("express");
const {
  getEHRs,
  grantAllEHRAccessToIdentity,
  grantParticularEHRAccessToIdentity,
  revokeParticularEHRAccessFromIdentity,
  getACLHistoryExecutedForAnIdentity,
  getExecutorACLHistory,
} = require("./chaincode");
const { enrollUser, reenrollUser } = require("./auth");
const { getMSPs } = require("./channel");
const injectIdentity = require("../middlewares/identityInjectionMiddleware");

const router = Express.Router();

// Auth routes
router.post("/auth/enroll", enrollUser); // tested
router.post("/auth/reenroll", reenrollUser);

// Chaincode routes
router.use(injectIdentity);
router.get("/chaincode/getAllEHR", getEHRs); //tested
router.post(
  "/chaincode/grantAllEHRAccessToIdentity",
  grantAllEHRAccessToIdentity
);
router.post(
  "/chaincode/grantParticularEHRAccessToIdentity",
  grantParticularEHRAccessToIdentity
); // tested
router.post(
  "/chaincode/revokeParticularEHRAccessFromIdentity",
  revokeParticularEHRAccessFromIdentity
); // tested

router.get("/chaincode/getACProviderACLHistory", getExecutorACLHistory); // tested

router.get(
  "/chaincode/getACLHistoryExecutedForIdentity",
  getACLHistoryExecutedForAnIdentity
); // tested

router.get("/channel/getMSPs", getMSPs); //tested

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports = router;
