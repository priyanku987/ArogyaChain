const crypto = require("crypto");
const { Gateway } = require("fabric-network");
const { makeX509Identity, decryptCookie } = require("../../utils/misc");
const { getConnectionProfileJSON } = require("../../utils/misc");
const x509 = require("@peculiar/x509");
const _ = require("lodash");

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
    if (_.isEmpty(req?.session?.user)) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No credentials found, Please Login!",
      });
    }
    return next();
  } catch (error) {
    console.log(error);
    return res?.status(401).json({
      error: error?.message,
      message: "Invalid Certificate and Keys!",
    });
  }
};
