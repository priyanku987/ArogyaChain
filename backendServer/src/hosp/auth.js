const { Wallets, Gateway } = require("fabric-network");
const { getConnectionProfileJSON } = require("../../utils/misc");
const FabricCAServices = require("fabric-ca-client");
const { User } = require("fabric-common");

const commonConnectionProfilePath =
  "backendServer/utils/commonConnectionProfile.json";

module.exports.registerIdentity = async (req, res) => {
  try {
    const { X509Identity } = req.user;
    const { adhaarId, secret, org, identityRoleAttributes } = req.body; //"org" should be in lower case letters

    if (
      !adhaarId ||
      !secret ||
      !org ||
      !identityRoleAttributes ||
      identityRoleAttributes?.length === 0
    ) {
      return res?.status(400).json({
        message: "Required fields are not provided!",
      });
    }

    // Implement UIDAI Adhaar authenticatio and verification layer

    // Get the connection profile from the input provided in the header
    // Connect to the gateway and select the channel to transact on
    const connectionProfile = getConnectionProfileJSON();
    const networkGateway = new Gateway();
    await networkGateway.connect(connectionProfile, {
      identity: X509Identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the ca instance
    const ca = new FabricCAServices(process.env.CA_SERVER_ENDPOINT);

    const attributes = identityRoleAttributes?.map((roleAttr) => ({
      name: roleAttr,
      value: "true",
      ecert: true,
    }));
    const registrationResult = await ca.register(
      {
        enrollmentID: adhaarId,
        enrollmentSecret: secret,
        role: "client",
        affiliation: `${org}.usermanagement`, //NOTE: need to update the fabric-ca-server-config.yaml to include "user" in the affiliations
        maxEnrollments: -1,
        attrs: attributes,
      },
      networkGateway?.identityContext?.user
    );
    return res.status(200).json({
      message: "Identity registration successfull!",
      data: registrationResult,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Internal server error!",
    });
  }
};
