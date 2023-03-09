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
  console.log("c", certificate);
  const privateKey = req?.header("ACPrivateKey");
  const mspId = req?.header("ACMspId");

  // extract subject
  const x509Cert = new crypto.X509Certificate(certificate);

  console.log(x509Cert, "heh");
  const subject = x509Cert?.subject;

  //Extract the CN: in this case the Adhaar number
  const CN = extractCNFromSubject(subject);

  return {
    certificate,
    privateKey,
    mspId,
    CN,
  };
}

module.exports = async (req, res, next) => {
  try {
    console.log("hello", req);
    const userIdentityDetails = extractUserIdentityDetails(req);
    console.log(userIdentityDetails);
    req.user.X509Identity = makeX509Identity(
      userIdentityDetails?.certificate,
      userIdentityDetails?.privateKey,
      userIdentityDetails?.mspId
    );
    req.user.adhaarNumber = userIdentityDetails?.CN;
    return res
      ?.status(200)
      .json({ data: "", message: "Something not went wrong!" });
  } catch (error) {
    console.log("err", error);
    return res?.status(500).json({ error, message: "Something went wrong!" });
  }
};
