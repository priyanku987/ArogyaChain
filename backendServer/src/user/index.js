const Express = require("express");
const {
  getEHRs,
  grantAllEHRAccessToIdentity,
  grantParticularEHRAccessToIdentity,
  revokeParticularEHRAccessFromIdentity,
} = require("./chaincode");
const { enrollUser, reenrollUser } = require("./auth");

const router = Express.Router();

// Auth routes
router.post("/auth/enroll", enrollUser);
router.post("/auth/reenroll", reenrollUser);

// Chaincode routes
router.get("/chaincode/getAllEHR", getEHRs);
router.post(
  "/chaincode/grantAllEHRAccessToIdentity",
  grantAllEHRAccessToIdentity
);
router.post(
  "/chaincode/grantParticularEHRAccessToIdentity",
  grantParticularEHRAccessToIdentity
);
router.post(
  "/chaincode/revokeParticularEHRAccessFromIdentity",
  revokeParticularEHRAccessFromIdentity
);

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports.userRouter = router;
