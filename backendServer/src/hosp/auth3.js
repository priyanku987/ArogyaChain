const { Wallets, Gateway, X509WalletMixin } = require("fabric-network");
const path = require("path");

const commonConnectionProfilePath =
  "backendServer/utils/commonConnectionProfile.json";
const walletPath =
  "/Users/priyankuhazarika/Desktop/.personal/major-project/ArogyaChain/wallet";

module.exports.registerPatient = async (req, res) => {
  try {
    const { id } = req.user;
    const { patientAdhaarId, patientSecret } = req.body;

    // Implement UIDAI Adhaar authenticatio and verification layer

    // Create the wallet instance
    const wallet = await Wallets?.newFileSystemWallet(walletPath);
    // Get the admin identity from wallet
    const adminUser = await wallet?.get(id);
    if (!adminUser) {
      return res?.status(403).json({
        message: "Admin is not enrolled!",
      });
    }

    // Check if the user that needs to be registered is already registered
    // Currently we are checking only in the wallet
    // later on a better way needs to be implemented to check if the user is registered
    const requestedUser = await wallet?.get(patientAdhaarId);
    if (typeof requestedUser !== "undefined") {
      return res.status(409).json({
        message: "User is already registered and enrolled!",
      });
    }
    // Get the connection profile from the input provided in the header
    // Connect to the gateway and select the channel to transact on
    const networkGateway = new Gateway();
    await networkGateway.connect(commonConnectionProfilePath, {
      wallet,
      identity: id,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the ca client object
    const ca = networkGateway?.getNetwork();

    // Register the user with Certificate Authority
  } catch (error) {
    console.log(error);
    return res?.status(500).json({
      message: "Internal server error!",
    });
  }
};
