const { Wallets, Gateway, X509WalletMixin } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");

const commonConnectionProfilePath =
  "backendServer/utils/commonConnectionProfile.json";
const walletPath =
  "/Users/priyankuhazarika/Desktop/.personal/major-project/ArogyaChain/wallet";

module.exports.registerPatient = async (req, res) => {
  try {
    const { X509Identity } = req.user;
    const { patientAdhaarId, patientSecret, org } = req.body; //"org" should be in lower case letters

    // Implement UIDAI Adhaar authenticatio and verification layer

    // Get the connection profile from the input provided in the header
    // Connect to the gateway and select the channel to transact on
    const networkGateway = new Gateway();
    await networkGateway.connect(commonConnectionProfilePath, {
      identity: X509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the ca instance
    const ca = new FabricCAServices(process.env.CA_SERVER_ENDPOINT);

    // Register the user with Certificate Authority
    const registrationResult = await ca.register(
      {
        enrollmentID: patientAdhaarId,
        enrollmentSecret: patientSecret,
        role: "client",
        affiliation: `${org}.usermanagement`, //NOTE: need to update the fabric-ca-server-config.yaml to include "user" in the affiliations
        maxEnrollments: -1,
        attrs: [
          {
            name: "accessType",
            value: "Patient",
          },
        ],
      },
      X509Identity
    );
    return res.status(200).json({
      message: "Patient registration successfull!",
      data: registrationResult,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Internal server error!",
    });
  }
};
