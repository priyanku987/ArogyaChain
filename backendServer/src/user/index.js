const Express = require("express");
const {
  getEHRs,
  grantAllEHRAccessToIdentity,
  grantParticularEHRAccessToIdentity,
  revokeParticularEHRAccessFromIdentity,
} = require("./chaincode");

const router = Express.Router();

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
