const { Wallets, Gateway, X509 } = require("fabric-network");
const FabricCaServices = require("fabric-ca-client");
const fs = require("fs");
const { getConnectionProfileJSON, getWalletPath } = require("../../utils/misc");

module.exports.getEHRs = async (req, res) => {
  try {
    const { adhaarNumber } = req?.user;

    // See if the user is already being enrolled
    // Currently this is simply done by checking if the identity exists in the wallet
    const walletPath = getWalletPath();
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const identity = await wallet?.get(adhaarNumber);
    if (typeof identity === "undefined") {
      return res.status(403).json({ message: "Identity is not enrolled!" });
    }

    // Make the gateway connection
    const connectionProfileJSON = getConnectionProfileJSON();
    const gateway = new Gateway();
    await gateway.connect(connectionProfileJSON, {
      wallet,
      identity: identity,
      discovery: { enabled: true, asLocalhost: true },
    });

    // Get the network (channel) where contract is deployed to.
    const network = await gateway.getNetwork(process.env.EHR_CHANNEL);

    // Get the contract from the network.
    const contract = network.getContract("medicalRecord");
    const results = await contract?.evaluateTransaction("GetEMRByPatientId", [
      adhaarNumber,
    ]);

    return res.status(200).json({
      data: results,
    });
  } catch (error) {
    console.log(error);
    return res?.status(500).json({ message: "Internal server error!" });
  }
};
