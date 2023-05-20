const Express = require("express");
const { getIdentityDetails, login, logout } = require("./auth");
const injectIdentity = require("../middlewares/identityInjectionMiddleware");

const router = Express.Router();

// Auth routes
router.post("/login", login);
router.use(injectIdentity);
router.get("/getIdentityDetails", getIdentityDetails); // tested
router.post("/logout", logout);

router.all("*", (req, res) =>
  res
    .status(404)
    .json({ error: "Requested Resource not exist", data: null, status: 404 })
);
module.exports = router;
