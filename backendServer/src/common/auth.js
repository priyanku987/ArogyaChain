const x509 = require("@peculiar/x509");
const { getConnectionProfileJSON } = require("../../utils/misc");
const { Gateway } = require("fabric-network");

module.exports.getIdentityDetails = async (req, res) => {
  console.log("hehe");
  try {
    return res.status(200).json({
      data: {
        user: {
          aadhaarNumber: req?.session?.user?.aadhaarNumber,
          attrs: req?.session?.user?.attrs,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Internal server error!",
    });
  }
};

module.exports.login = async (req, res) => {
  console.log("test");
  try {
    let { certificate, privateKey } = req?.body;

    const pemFormattedCertificate = certificate.replace(/\\n/g, "\n");
    const pemFormattedPrivateKey = privateKey.replace(/\\r\\n|\\n/g, "\n");
    const x509Cert = new x509.X509Certificate(pemFormattedCertificate);

    /** ************** extract attributes ***************** */
    // extract the extensions data
    const extensions = x509Cert.extensions;
    const ASN1OIDAttributes = extensions.find(
      (ext) => ext.type === "1.2.3.4.5.6.7.8.1"
    );
    var encoder = new TextDecoder("utf-8");
    const decodedAtributesString = encoder.decode(ASN1OIDAttributes?.value);
    const attributesInJSON = JSON.parse(decodedAtributesString);
    /** ************** extract attributes ***************** */

    // make X509 Identity object
    const x509Identity = {
      credentials: {
        certificate: pemFormattedCertificate,
        privateKey: pemFormattedPrivateKey,
      },
      mspId: attributesInJSON?.attrs?.MSPID,
      type: "X.509",
    };

    //extract Adhaar
    const parts = x509Cert?.subject.split(",");
    let CN = "";
    parts?.forEach((part) => {
      if (part?.includes("CN=")) {
        let foundCNParts = part;
        foundCNParts = foundCNParts?.split("=");
        CN = foundCNParts[1];
      }
    });

    // Test the connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      identity: x509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });
    // Get the network (channel) where contract is deployed to.
    await gateway.getNetwork(process.env.EHR_CHANNEL);

    req.session.user = {
      x509Identity,
      aadhaarNumber: CN,
      attrs: attributesInJSON.attrs,
    };

    return res.status(200).json({
      data: {
        user: {
          aadhaarNumber: CN,
          attrs: attributesInJSON.attrs,
          x509Identity: x509Identity,
        },
      },
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Invalid credentils!",
    });
  }
};

module.exports.logout = async (req, res) => {
  try {
    req.session.destroy();
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Internal server error!",
    });
  }
};
