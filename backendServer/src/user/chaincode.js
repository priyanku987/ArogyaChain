const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");

const connectionProfilePath = "";
const walletPath = "";

module.exports.getEHRs = async (req, res) => {
  try {
    const { adhaarNumber } = req?.user;

    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(adhaarNumber);
    if (typeof identity === "undefined") {
      return res.status(403).json({ message: "Identity is not enrolled!" });
    }

    // Make the gateway connection
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
