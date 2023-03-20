const crypto = require("crypto");
const { makeX509Identity } = require("../../utils/misc");

function extractCNFromSubject(str) {
  const parts = str.split("\n");
  for (let i = 0; i < parts.length; i++) {
    const keyValue = parts[i].split("=");
    if (keyValue[0] === "CN") {
      return keyValue[1];
    }
  }
  return null;
}

function extractUserIdentityDetails(req) {
  let certificate = req?.header("ACCertificate");
  const privateKey = req?.header("ACPrivateKey");
  const mspId = req?.header("ACMspId");

  // extract subject
  const pemFormattedCertificate = certificate.replace(/\\n/g, "\n");
  let pemFormattedPrivateKey = privateKey.replace(/\\r\\n|\\n/g, "\n");
  const x509Cert = new crypto.X509Certificate(pemFormattedCertificate);

  //Extract the CN: in this case the Adhaar number
  const CN = extractCNFromSubject(x509Cert?.subject);

  return {
    certificate: pemFormattedCertificate,
    privateKey: pemFormattedPrivateKey,
    mspId,
    CN,
  };
}

module.exports = async (req, res, next) => {
  try {
    const userIdentityDetails = extractUserIdentityDetails(req);
    req.user = {};
    req.user.X509Identity = makeX509Identity(
      userIdentityDetails?.certificate,
      userIdentityDetails?.privateKey,
      userIdentityDetails?.mspId
    );
    req.user.adhaarNumber = userIdentityDetails?.CN;
    return next();
  } catch (error) {
    console.log("err", error);
    return res?.status(500).json({ error, message: "Something went wrong!" });
  }
};
